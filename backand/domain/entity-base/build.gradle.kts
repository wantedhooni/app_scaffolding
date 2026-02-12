plugins {
    id("java-library")
}
dependencies {
    implementation(project(":common"))
    api("org.springframework.boot:spring-boot-starter-data-jpa")

    var jakartaPersistenceVersion = "3.1.0"
    var querydslVersion = "5.1.0"
    // Ensure JPA API available at compile time (version from root)
    api("jakarta.persistence:jakarta.persistence-api:${jakartaPersistenceVersion}")

    // QueryDSL used in domain (version from root)
    api("com.querydsl:querydsl-jpa:${querydslVersion}:jakarta")
    api("com.querydsl:querydsl-core:${querydslVersion}")
    annotationProcessor("com.querydsl:querydsl-apt:${querydslVersion}:jakarta")
    annotationProcessor("jakarta.persistence:jakarta.persistence-api:${jakartaPersistenceVersion}")
}
