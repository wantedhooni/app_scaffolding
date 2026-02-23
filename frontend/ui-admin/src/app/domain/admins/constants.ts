// Refine resource name for admin pages (must match resources[].name).
export const RESOURCE = "admins";
export const API_PATH = "/api/admin";
export const RESOURCE_META = { apiPath: API_PATH } as const;

// Related resource used to fetch role options in admin edit form.
export const ROLE_RESOURCE = "roles";
export const ROLE_API_PATH = "/api/role";
export const ROLE_RESOURCE_META = { apiPath: ROLE_API_PATH } as const;

// Entity label used for titles and action text.
export const ENTITY_LABEL = "Admin";

// Primary account fields.
export const EMAIL_FIELD = "email";
export const EMAIL_LABEL = "Email";
export const PASSWORD_FIELD = "password";
export const PASSWORD_LABEL = "Password";
