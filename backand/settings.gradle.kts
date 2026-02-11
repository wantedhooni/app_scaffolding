rootProject.name = "backend"

include(
    ":common",
    ":domain:entity-base",
    ":domain:entity",
    ":security:jwt",
    ":application:api-admin-server"
)