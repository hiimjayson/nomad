declare namespace NodeJS {
  interface ProcessEnv {
    NCP_ACCESS_KEY: string;
    NCP_SECRET_KEY: string;
    NCP_SMS_SECRET_KEY: string;
    NCP_SMS_SERVICE_ID: string;
    NCP_CALLING_NUMBER: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
  }
}
