#Usar una imagen base de Java 21
FROM eclipse-temurin:21-jdk-alpine

#Defini el directorio de trabajo dentro del contenedor

WORKDIR /app

#Copiar el archivo .jar compilado en el contenedor
COPY target/*.jar app.jar

#Exponer el puerto en el que corre Srping Boot
EXPOSE 8080

#Comando para ejecutar la aplicacion 
ENTRYPOINT [ "java", "-jar", "app.jar" ]