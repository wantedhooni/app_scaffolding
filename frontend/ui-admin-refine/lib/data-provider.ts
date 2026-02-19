"use client";

import type { DataProvider } from "@refinedev/core";

const notImplemented = async () => {
  throw new Error("Use custom command/query endpoints directly in this dashboard.");
};

export const dataProvider: DataProvider = {
  getApiUrl: () => process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
  getList: notImplemented,
  getMany: notImplemented,
  getOne: notImplemented,
  create: notImplemented,
  createMany: notImplemented,
  update: notImplemented,
  updateMany: notImplemented,
  deleteOne: notImplemented,
  deleteMany: notImplemented,
  custom: notImplemented,
};
