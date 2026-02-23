import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    id("org.springframework.boot")
    id("io.spring.dependency-management")
    id("java")
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}


dependencies {
    implementation(project(":common"))
    implementation(project(":domain:entity"))
    implementation(project(":application:security:jwt"))

    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}


tasks.withType<BootJar> {
    enabled = true
    mainClass.set("com.revy.api.admin.server.ApiAdminServerApplication")
}