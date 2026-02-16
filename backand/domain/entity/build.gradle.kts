plugins {
    id("java-library")
}

// Use version variables defined in root build.gradle.kts
dependencies {
    implementation(project(":common"))
    api(project(":domain:entity-base"))

    var jakartaPersistenceVersion = "3.1.0"
    // Ensure JPA API available at compile time
    api("jakarta.persistence:jakarta.persistence-api:${jakartaPersistenceVersion}")
    annotationProcessor("jakarta.persistence:jakarta.persistence-api:${jakartaPersistenceVersion}")
//    // QueryDSL used in domain
    var querydslVersion = "5.1.0"
    api("com.querydsl:querydsl-jpa:${querydslVersion}:jakarta")
    api("com.querydsl:querydsl-core:${querydslVersion}")
    annotationProcessor("com.querydsl:querydsl-apt:${querydslVersion}:jakarta")
}
