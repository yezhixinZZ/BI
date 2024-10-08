FROM openjdk:8-jre-slim
VOLUME /tmp
COPY target/bi-app.jar /usr/local/java/bi-app.jar
ENTRYPOINT ["java", "-jar", "/usr/local/java/bi-app.jar"]
