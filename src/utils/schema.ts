import { z } from "zod";

export const commonFieldSchema = (requiredMessage: string) =>
  z.string().trim().min(1, { message: requiredMessage });
