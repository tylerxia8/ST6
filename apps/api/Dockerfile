FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace
COPY . .
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew && ./gradlew --no-daemon bootJar

FROM eclipse-temurin:21-jre
WORKDIR /app
ARG OCI_SOURCE=https://github.com/tylerxia8/ST6
ARG OCI_REVISION=local
ARG OCI_VERSION=dev
LABEL org.opencontainers.image.source=$OCI_SOURCE
LABEL org.opencontainers.image.revision=$OCI_REVISION
LABEL org.opencontainers.image.version=$OCI_VERSION
COPY --from=build /workspace/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
