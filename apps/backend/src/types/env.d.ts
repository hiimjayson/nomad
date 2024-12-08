declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV: "development" | "production" | "test";
      NCP_ACCESS_KEY: string;
      NCP_SECRET_KEY: string;
      NCP_SMS_SECRET_KEY: string;
      NCP_SMS_SERVICE_ID: string;
      NCP_CALLING_NUMBER: string;
      UPSTASH_REDIS_REST_URL: string;
      UPSTASH_REDIS_REST_TOKEN: string;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
    }
  }
}

export {};
