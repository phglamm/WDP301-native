import { z } from 'zod';

const configSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string(),
  EXPO_PUBLIC_TOKEN_KEY: z.string(),
  EXPO_PUBLIC_USER_KEY: z.string(),
  EXPO_PUBLIC_THEME_KEY: z.string(),
});

const configProject = configSchema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_TOKEN_KEY: process.env.EXPO_PUBLIC_TOKEN_KEY,
  EXPO_PUBLIC_USER_KEY: process.env.EXPO_PUBLIC_USER_KEY,
  EXPO_PUBLIC_THEME_KEY: process.env.EXPO_PUBLIC_THEME_KEY,
});

if (!configProject.success) {
  console.log(configProject.error);
  throw new Error(`Error when get env data`);
}

const envConfig = configProject.data;

export default envConfig;
