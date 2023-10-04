# Stage 1: Amazon Corretto-based build stage
FROM amazoncorretto:20 as build

WORKDIR /workspace/app

# Copy the Maven wrapper and pom.xml to download dependencies
COPY authentication-service/mvnw .
COPY authentication-service/.mvn .mvn
COPY authentication-service/pom.xml .

# Ensure script is executable and download dependencies
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

# Now copy the actual source code and build the project
COPY authentication-service/src src
RUN ./mvnw package -DskipTests -e

# Stage 2: Amazon Corretto-based runtime stage
FROM amazoncorretto:20

WORKDIR /app

# Copy only the built jar file from the build stage
COPY --from=build /workspace/app/target/*.jar app.jar

# Make port 80 available to the world outside this container
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]