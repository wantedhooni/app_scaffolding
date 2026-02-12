plugins {
    id("java-library")
}

// Use version variables defined in root build.gradle.kts
dependencies {
    implementation(project(":common"))
    api(project(":domain:entity-base"))
}
