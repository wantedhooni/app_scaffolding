import { API_BASE_URL } from "./core";

export type OpenApiDoc = {
  tags?: Array<{ name: string; description?: string }>;
  paths?: Record<string, Record<string, { tags?: string[]; summary?: string }>>;
};

export async function getOpenApiDoc(): Promise<OpenApiDoc> {
  const response = await fetch(`${API_BASE_URL}/v3/api-docs`);
  if (!response.ok) {
    throw new Error(`Swagger load failed: ${response.status}`);
  }
  return (await response.json()) as OpenApiDoc;
}
