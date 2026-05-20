const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

export const env = {
  // Cloudflare R2
  R2_ACCOUNT_ID: required("R2_ACCOUNT_ID"),
  R2_ACCESS_KEY_ID: required("R2_ACCESS_KEY_ID"),
  R2_SECRET_ACCESS_KEY: required("R2_SECRET_ACCESS_KEY"),
  R2_BUCKET_NAME: required("R2_BUCKET_NAME"),
  R2_PUBLIC_URL: required("R2_PUBLIC_URL"),

  // Database
  DATABASE_URL: required("DATABASE_URL"),

  // OpenAI
  OPENAI_API_KEY: required("OPENAI_API_KEY"),
};
