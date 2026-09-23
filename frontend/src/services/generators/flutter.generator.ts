import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { Project } from '../../types/project.types';
import { ASTParser } from './ast.parser';
import type { ParsedModel } from './ast.parser';

export class FlutterGenerator {
  
  static generateFiles(_project: Project, nodes: any[], edges: any[], config: any): Record<string, string> {
    const files: Record<string, string> = {};
    const parsedModel: ParsedModel = ASTParser.parseDiagram(nodes, edges);
    const apiPrefix = config.apiPrefix || '/api/v1';

    // 1. CONOCIMIENTO DE LA IA (System Prompt / Tools)
    const aiKnowledge = parsedModel.classes.map(c => ({
      name: `crear_${c.name.toLowerCase()}`,
      description: `Crea un nuevo registro de ${c.name} en la base de datos local y lo encola para sincronizar.`,
      endpoint: `POST ${apiPrefix}/${c.name.toLowerCase()}s`,
      action_type: 'POST',
      entity: c.name,
      parameters: c.attributes.filter(a => !a.isPrimaryKey || !c.parentName).map(a => ({
        name: a.name,
        type: a.type,
        required: true
      }))
    })).concat(parsedModel.classes.map(c => ({
      name: `listar_${c.name.toLowerCase()}s`,
      description: `Consulta la lista de ${c.name} en la base de datos local (Modo Offline).`,
      endpoint: `GET ${apiPrefix}/${c.name.toLowerCase()}s`,
      action_type: 'GET',
      entity: c.name,
      parameters: []
    })));

    files['assets/ai_knowledge.json'] = JSON.stringify(aiKnowledge, null, 2);

    // 2. MODELOS DART
    parsedModel.classes.forEach(c => {
      let fields = '';
      let constructorArgs = '';
      let fromMap = '';
      let toMap = '';

      c.attributes.forEach(attr => {
        let dartType = 'String';
        if (attr.type === 'Long' || attr.type === 'Integer') dartType = 'int';
        else if (attr.type === 'Double') dartType = 'double';
        else if (attr.type === 'Boolean') dartType = 'int'; // SQLite usa 0 y 1 para booleanos

        fields += `  final ${dartType}? ${attr.name};\n`;
        constructorArgs += `    this.${attr.name},\n`;
        fromMap += `      ${attr.name}: map['${attr.name}'],\n`;
        toMap += `      '${attr.name}': ${attr.name},\n`;
      });

      const modelCode = `class ${c.name} {
${fields}
  ${c.name}({
${constructorArgs}  });

  factory ${c.name}.fromMap(Map<String, dynamic> map) {
    return ${c.name}(
${fromMap}    );
  }

  Map<String, dynamic> toMap() {
    return {
${toMap}    };
  }
}
`;
      files[`lib/models/${c.name.toLowerCase()}.dart`] = modelCode;
    });

    // 3. BASE DE DATOS LOCAL (SQLite Offline)
    let createTables = '';
    parsedModel.classes.forEach(c => {
      let columns = '';
      c.attributes.forEach(attr => {
        let sqlType = 'TEXT';
        if (attr.type === 'Long' || attr.type === 'Integer') sqlType = 'INTEGER';
        else if (attr.type === 'Double') sqlType = 'REAL';
        else if (attr.type === 'Boolean') sqlType = 'INTEGER';
        columns += `${attr.name} ${sqlType}${attr.isPrimaryKey ? ' PRIMARY KEY' : ''}, `;
      });
      columns = columns.replace(/, $/, '');
      createTables += `    await db.execute('CREATE TABLE ${c.name} (${columns})');\n`;
    });

    // Tabla de Cola de Sincronización
    createTables += `    await db.execute('CREATE TABLE SyncQueue (id INTEGER PRIMARY KEY AUTOINCREMENT, entity TEXT, action TEXT, payload TEXT)');\n`;

    files['lib/database/local_database.dart'] = `import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class LocalDatabase {
  static final LocalDatabase instance = LocalDatabase._init();
  static Database? _database;

  LocalDatabase._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('app_offline.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);
    return await openDatabase(path, version: 1, onCreate: _createDB);
  }

  Future _createDB(Database db, int version) async {
${createTables}  }

  Future<int> insertData(String table, Map<String, dynamic> data) async {
    final db = await instance.database;
    return await db.insert(table, data, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<List<Map<String, dynamic>>> getAllData(String table) async {
    final db = await instance.database;
    return await db.query(table);
  }

  Future<void> enqueueSyncAction(String entity, String action, String payload) async {
    final db = await instance.database;
    await db.insert('SyncQueue', {'entity': entity, 'action': action, 'payload': payload});
  }
}
`;

    // 4. PLANTILLAS UI UNIVERSALES
    files['lib/ui/templates/universal_list.dart'] = `import 'package:flutter/material.dart';

class UniversalListTemplate extends StatelessWidget {
  final String title;
  final List<Map<String, dynamic>> items;

  const UniversalListTemplate({Key? key, required this.title, required this.items}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: items.isEmpty 
        ? Center(child: Text("No hay datos guardados offline."))
        : ListView.builder(
            itemCount: items.length,
            itemBuilder: (context, index) {
              final item = items[index];
              final titleText = item.values.isNotEmpty ? item.values.first.toString() : "Item";
              return Card(
                child: ListTile(
                  leading: Icon(Icons.data_object),
                  title: Text(titleText),
                  subtitle: Text(item.toString()),
                ),
              );
            },
          ),
    );
  }
}
`;

    files['lib/ui/templates/universal_feedback.dart'] = `import 'package:flutter/material.dart';

class UniversalFeedbackTemplate extends StatelessWidget {
  final String message;
  final bool isSuccess;

  const UniversalFeedbackTemplate({Key? key, required this.message, this.isSuccess = true}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(isSuccess ? Icons.check_circle : Icons.error, size: 80, color: isSuccess ? Colors.green : Colors.red),
            SizedBox(height: 20),
            Text(message, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}
`;

    // 5. ORQUESTADOR IA (El Cerebro Local Real usando MediaPipe)
    files['lib/ai/ai_orchestrator.dart'] = `import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;
import 'package:mediapipe_genai/mediapipe_genai.dart';
import 'package:flutter/material.dart';
import '../database/local_database.dart';
import '../ui/templates/universal_feedback.dart';
import '../ui/templates/universal_list.dart';

class AiOrchestrator {
  static LlmInference? _llm;
  static String _systemPrompt = "";

  // 1. Inicializar la IA Local al abrir la app
  static Future<void> initialize() async {
    try {
      // Cargar el mapa de endpoints que conoce la IA
      _systemPrompt = await rootBundle.loadString('assets/ai_knowledge.json');
      
      // Inicializar Gemma-2B (El Small Model) on-device
      final options = LlmInferenceOptions(
        modelPath: 'assets/models/gemma-2b-it.bin',
        maxTokens: 512,
        topK: 40,
        temperature: 0.1, // Baja temperatura para que devuelva un JSON estricto
      );
      _llm = await LlmInference.create(options);
    } catch (e) {
      print("Error cargando IA Local: \$e");
      print("IMPORTANTE: Asegúrate de descargar gemma-2b-it.bin y ponerlo en assets/models/");
    }
  }

  // 2. Procesar el texto del usuario (Ej: Hablado con el micrófono)
  static Future<void> handleUserVoiceCommand(BuildContext context, String userInput) async {
    if (_llm == null) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Modelo IA no cargado")));
      return;
    }

    // Le pedimos a Gemma que evalúe el texto usando nuestro manual de endpoints
    final prompt = """
    ERES EL SISTEMA RUTADOR DE LA APP. NO RESPONDAS NORMAL. SOLO RESPONDE UN JSON VALIDO.
    HERRAMIENTAS DISPONIBLES:
    \$_systemPrompt

    USUARIO DICE: "\$userInput"
    
    ELIGE LA HERRAMIENTA CORRECTA Y RESPONDE ESTRICTAMENTE ESTE JSON:
    {"action_type": "POST|GET", "entity": "NombreEntidad", "parameters": {"llave": "valor"}}
    """;

    try {
      final responseStr = await _llm!.generateResponse(prompt);
      final aiResponse = json.decode(responseStr);
      _executeAction(context, aiResponse);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("No entendí el comando. Intenta de nuevo.")));
    }
  }

  // 3. Ejecutar la acción elegida por la IA
  static void _executeAction(BuildContext context, Map<String, dynamic> aiResponse) async {
    final action = aiResponse['action_type']; // GET o POST
    final entity = aiResponse['entity']; // Ej: Estudiante
    final data = aiResponse['parameters'] ?? {}; // JSON con los datos

    if (action == 'POST') {
      // Guardar en SQLite Local
      await LocalDatabase.instance.insertData(entity, data);
      
      // Encolar para el Backend (Offline-First)
      await LocalDatabase.instance.enqueueSyncAction(entity, 'POST', json.encode(data));

      // Mostrar Plantilla de Éxito Universal
      Navigator.push(context, MaterialPageRoute(builder: (_) => UniversalFeedbackTemplate(
        message: "\$entity guardado localmente.\\nSincronizando cuando haya red.",
        isSuccess: true,
      )));

    } else if (action == 'GET') {
      // Consultar Base de Datos Local
      final results = await LocalDatabase.instance.getAllData(entity);
      
      // Mostrar Plantilla de Lista Universal
      Navigator.push(context, MaterialPageRoute(builder: (_) => UniversalListTemplate(
        title: "Tus \$entity (Offline)",
        items: results,
      )));
    }
  }
}
`;

    // 6. PUBSPEC.YAML
    files['pubspec.yaml'] = `name: flutter_ai_offline_client
description: Frontend Agentic generado por DiagramConnect
version: 1.0.0+1
environment:
  sdk: ">=3.0.0 <4.0.0"
dependencies:
  flutter:
    sdk: flutter
  sqflite: ^2.3.0
  path: ^1.8.3
  http: ^1.1.0
  speech_to_text: ^6.5.1
  mediapipe_genai: ^1.0.0

flutter:
  assets:
    - assets/ai_knowledge.json
    - assets/models/
`;

    return files;
  }

  static async generateAndDownload(project: Project, nodes: any[], edges: any[], config: any) {
    const files = this.generateFiles(project, nodes, edges, config);
    const zip = new JSZip();
    Object.entries(files).forEach(([path, content]) => zip.file(path, content));
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `flutter_offline_agent_${project.name.replace(/[^a-zA-Z0-9]/g, '_')}.zip`);
  }
}
