export class XmiService {
  /**
   * Exporta nodos y edges de React Flow a formato XMI (UML 1.3 / XMI 1.1)
   */
  static exportToXMI(nodes: any[], edges: any[]): string {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const idMap: Record<string, string> = {};
    const getEAID = (originalId: string, prefix = 'EAID') => {
      if (!idMap[originalId]) {
        const hash = Math.random().toString(16).substring(2, 10).toUpperCase() + '_' + Math.random().toString(16).substring(2, 6).toUpperCase();
        idMap[originalId] = `${prefix}_${hash}`;
      }
      return idMap[originalId];
    };

    let xml = `<?xml version="1.0" encoding="windows-1252"?>\n`;
    xml += `<XMI xmlns:UML="omg.org/UML1.3" xmi.version="1.1" timestamp="${timestamp}">\n`;
    xml += `<XMI.header>\n  <XMI.documentation>\n    <XMI.exporter>Enterprise Architect</XMI.exporter>\n    <XMI.exporterVersion>2.5</XMI.exporterVersion>\n  </XMI.documentation>\n</XMI.header>\n`;
    xml += `<XMI.content>\n`;
    xml += `  <UML:Model name="ReactFlow Model" xmi.id="MX_EAID_MODEL">\n`;
    xml += `    <UML:Namespace.ownedElement>\n`;
    xml += `      <UML:Class name="EARootClass" xmi.id="EAID_ROOT" isRoot="true" isLeaf="false" isAbstract="false"/>\n`;
    xml += `      <UML:Package name="Diagrama Exportado" xmi.id="EAPK_MAIN" isRoot="false" isLeaf="false" isAbstract="false" visibility="public">\n`;
    xml += `        <UML:Namespace.ownedElement>\n`;

    // 1. Exportar Nodos
    (nodes || []).forEach(node => {
      const eaId = getEAID(node.id, 'EAID');
      const name = node.data.label || 'Unnamed';

      if (node.type === 'umlInterface') {
        xml += `          <UML:Interface name="${name}" xmi.id="${eaId}" visibility="public" namespace="EAPK_MAIN" isRoot="false" isLeaf="false" isAbstract="true">\n`;
      } else {
        xml += `          <UML:Class name="${name}" xmi.id="${eaId}" visibility="public" namespace="EAPK_MAIN" isRoot="false" isLeaf="false" isAbstract="false" isActive="false">\n`;
      }

      if (node.type === 'umlEnum') {
        xml += `            <UML:ModelElement.stereotype>\n              <UML:Stereotype name="enumeration"/>\n            </UML:ModelElement.stereotype>\n`;
      }

      xml += `            <UML:ModelElement.taggedValue>\n`;
      xml += `              <UML:TaggedValue tag="ea_stype" value="${node.type === 'umlInterface' ? 'Interface' : 'Class'}"/>\n`;
      xml += `              <UML:TaggedValue tag="ea_eleType" value="element"/>\n`;
      if (node.type === 'umlEnum') {
        xml += `              <UML:TaggedValue tag="stereotype" value="enumeration"/>\n`;
      }
      if (node.type === 'umlIntermediateClass') {
        xml += `              <UML:TaggedValue tag="ea_ntype" value="17"/>\n`;
        const parentEdge = (edges || []).find(e => e.data?.associatedNodeId === node.id);
        if (parentEdge) {
          xml += `              <UML:TaggedValue tag="conID" value="${getEAID(parentEdge.id, 'EAID')}"/>\n`;
        }
      }
      xml += `            </UML:ModelElement.taggedValue>\n`;

      if ((node.data.attributes && node.data.attributes.length > 0) || (node.data.methods && node.data.methods.length > 0)) {
         xml += `            <UML:Classifier.feature>\n`;
         (node.data.attributes || []).forEach((attr: any, idx: number) => {
             const vis = attr.visibility === '+' ? 'public' : attr.visibility === '-' ? 'private' : 'protected';
             xml += `              <UML:Attribute name="${attr.name}" xmi.id="${eaId}_attr${idx}" visibility="${vis}" type="${attr.type || 'String'}">\n`;
             if (node.type === 'umlEnum') {
               xml += `                <UML:ModelElement.stereotype>\n                  <UML:Stereotype name="enum"/>\n                </UML:ModelElement.stereotype>\n`;
             }
             xml += `              </UML:Attribute>\n`;
         });
         (node.data.methods || []).forEach((method: any, idx: number) => {
             const vis = method.visibility === '+' ? 'public' : method.visibility === '-' ? 'private' : 'protected';
             xml += `              <UML:Operation name="${method.name}" xmi.id="${eaId}_op${idx}" visibility="${vis}" isAbstract="false"/>\n`;
         });
         xml += `            </UML:Classifier.feature>\n`;
      }

      if (node.type === 'umlInterface') {
        xml += `          </UML:Interface>\n`;
      } else {
        xml += `          </UML:Class>\n`;
      }
    });

    // 2. Exportar Relaciones
    (edges || []).forEach((edge) => {
      const edgeId = getEAID(edge.id, 'EAID');
      const sourceId = getEAID(edge.source, 'EAID');
      const targetId = getEAID(edge.target, 'EAID');
      const relType = edge.data?.relationType || 'umlAssociation';

      if (relType === 'umlGeneralization') {
        xml += `          <UML:Generalization subtype="${sourceId}" supertype="${targetId}" xmi.id="${edgeId}" visibility="public">\n`;
        xml += `            <UML:ModelElement.taggedValue>\n              <UML:TaggedValue tag="ea_type" value="Generalization"/>\n            </UML:ModelElement.taggedValue>\n`;
        xml += `          </UML:Generalization>\n`;
      } else {
        let eaType = 'Association';
        let targetAggregation = 'none';
        let sourceAggregation = 'none';

        if (relType === 'umlAggregation') { eaType = 'Aggregation'; targetAggregation = 'shared'; }
        else if (relType === 'umlComposition') { eaType = 'Aggregation'; targetAggregation = 'composite'; }

        xml += `          <UML:Association name="${eaType}" xmi.id="${edgeId}" visibility="public" isRoot="false" isLeaf="false" isAbstract="false">\n`;
        xml += `            <UML:ModelElement.taggedValue>\n`;
        xml += `              <UML:TaggedValue tag="ea_type" value="${eaType}"/>\n`;
        
        if (relType === 'umlAssociationClass') {
          xml += `              <UML:TaggedValue tag="subtype" value="Class"/>\n`;
          if (edge.data?.associatedNodeId) {
            xml += `              <UML:TaggedValue tag="associationclass" value="${getEAID(edge.data.associatedNodeId, 'EAID')}"/>\n`;
          }
        }
        
        xml += `            </UML:ModelElement.taggedValue>\n`;
        xml += `            <UML:Association.connection>\n`;
        xml += `              <UML:AssociationEnd visibility="public" multiplicity="${edge.data?.sourceMultiplicity || ''}" aggregation="${sourceAggregation}" isOrdered="false" targetScope="instance" changeable="none" isNavigable="true" type="${sourceId}"/>\n`;
        xml += `              <UML:AssociationEnd visibility="public" multiplicity="${edge.data?.targetMultiplicity || ''}" aggregation="${targetAggregation}" isOrdered="false" targetScope="instance" changeable="none" isNavigable="true" type="${targetId}"/>\n`;
        xml += `            </UML:Association.connection>\n`;
        xml += `          </UML:Association>\n`;
      }
    });

    xml += `        </UML:Namespace.ownedElement>\n`;
    xml += `      </UML:Package>\n`;
    xml += `    </UML:Namespace.ownedElement>\n`;
    xml += `  </UML:Model>\n`;
    
    // 3. Exportar Diagrama
    xml += `  <UML:Diagram name="Diagrama Exportado" xmi.id="EAID_DIAGRAM_1" diagramType="ClassDiagram" owner="EAPK_MAIN" toolName="Enterprise Architect 2.5">\n`;
    xml += `    <UML:ModelElement.taggedValue>\n`;
    xml += `      <UML:TaggedValue tag="EAStyle" value="ShowPrivate=1;ShowProtected=1;ShowPublic=1;HideRelationships=0;Locked=0;Border=1;HighlightForeign=1;PackageContents=1;SequenceNotes=0;ScalePrintImage=0;PPgs.cx=1;PPgs.cy=1;DocSize.cx=826;DocSize.cy=1169;ShowDetails=0;Orientation=P;Zoom=100;ShowTags=0;OpParams=1;VisibleAttributeDetail=0;ShowOpRetType=1;ShowIcons=1;CollabNums=0;HideProps=0;ShowReqs=0;ShowCons=0;PaperSize=9;HideParents=0;UseAlias=0;HideAtts=0;HideOps=0;HideStereo=0;HideElemStereo=0;ShowTests=0;ShowMaint=0;ConnectorNotation=UML 2.1;ExplicitNavigability=0;ShowShape=1;AllDockable=0;AdvancedElementProps=1;AdvancedFeatureProps=1;AdvancedConnectorProps=1;m_bElementClassifier=1;SPT=1;ShowNotes=0;SuppressBrackets=0;SuppConnectorLabels=0;PrintPageHeadFoot=0;ShowAsList=0;"/>\n`;
    xml += `    </UML:ModelElement.taggedValue>\n`;
    xml += `    <UML:Diagram.element>\n`;
    
    (nodes || []).forEach((node, index) => {
       const x = Math.round(node.position.x);
       const y = Math.round(node.position.y);
       const w = 150; 
       const h = 100;
       const eaId = getEAID(node.id, 'EAID');
       xml += `      <UML:DiagramElement geometry="Left=${x};Top=${y};Right=${x+w};Bottom=${y+h};" subject="${eaId}" seqno="${index+1}" style="ImageID=0;DUID=${eaId}_DUID;"/>\n`;
    });
    
    (edges || []).forEach((edge) => {
       const edgeId = getEAID(edge.id, 'EAID');
       xml += `      <UML:DiagramElement geometry="SX=0;SY=0;EX=0;EY=0;EDGE=2;" subject="${edgeId}" style="Mode=3;Color=-1;LWidth=0;Hidden=0;"/>\n`;
    });
    
    xml += `    </UML:Diagram.element>\n`;
    xml += `  </UML:Diagram>\n`;
    
    xml += `</XMI.content>\n`;
    xml += `</XMI>`;

    return xml;
  }

  /**
   * Lee un XML en formato XMI (UML 1.3 de EA) y lo convierte a React Flow
   */
  static importFromXMI(xmlString: string): { nodes: any[], edges: any[] } {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const nodes: any[] = [];
    const edges: any[] = [];

    // 1. Leer posiciones del diagrama
    const geometries: Record<string, {x:number, y:number}> = {};
    const diagramElements = xmlDoc.getElementsByTagName('UML:DiagramElement');
    
    for (let i = 0; i < diagramElements.length; i++) {
        const el = diagramElements[i];
        const subject = el.getAttribute('subject');
        const geometry = el.getAttribute('geometry');
        
        if (subject && geometry && geometry.includes('Left=')) {
            const leftMatch = geometry.match(/Left=(\d+)/);
            const topMatch = geometry.match(/Top=(\d+)/);
            if (leftMatch && topMatch) {
                geometries[subject] = { x: parseInt(leftMatch[1], 10), y: parseInt(topMatch[1], 10) };
            }
        }
    }

    const processClassOrInterface = (elements: HTMLCollectionOf<Element>, isInterface: boolean) => {
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const id = el.getAttribute('xmi.id');
        const name = el.getAttribute('name');
        
        if (!id || !name || name === 'EARootClass') continue;

        let isEnum = false;
        let isAssociationClass = false;

        const stereotypes = el.getElementsByTagName('UML:Stereotype');
        for (let s = 0; s < stereotypes.length; s++) {
            if (stereotypes[s].getAttribute('name') === 'enumeration') isEnum = true;
        }

        const tags = el.getElementsByTagName('UML:TaggedValue');
        for (let t = 0; t < tags.length; t++) {
            if (tags[t].getAttribute('tag') === 'ea_ntype' && tags[t].getAttribute('value') === '17') {
                isAssociationClass = true;
            }
        }

        const nodeType = isInterface ? 'umlInterface' : (isEnum ? 'umlEnum' : (isAssociationClass ? 'umlIntermediateClass' : 'umlClass'));
        const attributes: any[] = [];
        const methods: any[] = [];

        const attrs = el.getElementsByTagName('UML:Attribute');
        for(let a=0; a < attrs.length; a++){
           const attrName = attrs[a].getAttribute('name');
           const visAttr = attrs[a].getAttribute('visibility');
           const visibility = visAttr === 'public' ? '+' : visAttr === 'protected' ? '#' : '-';
           if (attrName) attributes.push({ name: attrName, visibility, type: 'String' });
        }

        const ops = el.getElementsByTagName('UML:Operation');
        for(let o=0; o < ops.length; o++){
           const opName = ops[o].getAttribute('name');
           const visAttr = ops[o].getAttribute('visibility');
           const visibility = visAttr === 'public' ? '+' : visAttr === 'protected' ? '#' : '-';
           if (opName) methods.push({ name: opName, visibility, returnType: 'void' });
        }

        nodes.push({
          id: id,
          type: nodeType,
          position: geometries[id] || { x: Math.random() * 500, y: Math.random() * 500 },
          data: { label: name, attributes, methods }
        });
      }
    };

    // 2. Procesar Clases e Interfaces
    processClassOrInterface(xmlDoc.getElementsByTagName('UML:Class'), false);
    processClassOrInterface(xmlDoc.getElementsByTagName('UML:Interface'), true);

    // 3. Leer Asociaciones, Agregaciones, Composiciones y Clases Asociación
    const associations = xmlDoc.getElementsByTagName('UML:Association');
    for (let i = 0; i < associations.length; i++) {
        const el = associations[i];
        const id = el.getAttribute('xmi.id') || `edge_${i}`;
        const ends = el.getElementsByTagName('UML:AssociationEnd');
        
        let assocClassId: string | null = null;
        const assocTags = el.getElementsByTagName('UML:TaggedValue');
        for (let t = 0; t < assocTags.length; t++) {
            if (assocTags[t].getAttribute('tag') === 'associationclass') {
                assocClassId = assocTags[t].getAttribute('value');
            }
        }

        if (ends.length >= 2) {
            const source = ends[0].getAttribute('type');
            const target = ends[1].getAttribute('type');
            const targetAgg = ends[1].getAttribute('aggregation');
            
            let relType = 'umlAssociation';
            if (targetAgg === 'shared') relType = 'umlAggregation';
            else if (targetAgg === 'composite') relType = 'umlComposition';
            
            if (assocClassId) {
                relType = 'umlAssociationClass'; // Tu editor maneja nativamente esto en el Edge
            }

            if (source && target) {
                // Relación principal que ancla la Clase Asociación usando associatedNodeId
                edges.push({
                    id: id,
                    source: source,
                    target: target,
                    type: 'umlEdge',
                    data: { 
                      relationType: relType, 
                      associatedNodeId: assocClassId || undefined, 
                      sourceMultiplicity: ends[0].getAttribute('multiplicity') || '', 
                      targetMultiplicity: ends[1].getAttribute('multiplicity') || '' 
                    }
                });
            }
        }
    }

    // 4. Leer Generalizaciones (Herencia)
    const generalizations = xmlDoc.getElementsByTagName('UML:Generalization');
    for (let i = 0; i < generalizations.length; i++) {
        const el = generalizations[i];
        const id = el.getAttribute('xmi.id') || `gen_${i}`;
        const subtype = el.getAttribute('subtype'); // El que hereda (source)
        const supertype = el.getAttribute('supertype'); // El padre (target)

        if (subtype && supertype) {
            edges.push({
                id: id,
                source: subtype,
                target: supertype,
                type: 'umlEdge',
                data: { relationType: 'umlGeneralization' }
            });
        }
    }
    
    return { nodes, edges };
  }
}
