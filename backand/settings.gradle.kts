rootProject.name = "backend"

include(
    ":common",
    ":domain:entity-base",
    ":domain:entity",
    ":application:security:jwt",
    ":application:api-admin-server"
)