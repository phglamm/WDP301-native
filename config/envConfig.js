import { z } from 'zod';

const configSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string(),
});

const configProject = configSchema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
});

if (!configProject.success) {
  console.log(configProject.error);
  throw new Error(`Error when get env data`);
}

const envConfig = configProject.data;

export default envConfig;
