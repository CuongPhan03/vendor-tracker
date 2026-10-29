export type AppConfig = {
  env: string;
  host: string;
  port: number;
};

export default () => {
  const app: AppConfig = {
    env: process.env.NODE_ENV ?? 'development',
    host: process.env.HOST ?? 'localhost',
    port: parseInt(process.env.PORT || '3000'),
  };

  return { app };
};
