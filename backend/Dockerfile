FROM maven:3.8.3-openjdk-17-slim AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV SPRING_DATASOURCE_URL="jdbc:postgresql://postgres:5432/dev"
ENTRYPOINT ["java", "-jar", "app.jar"]
