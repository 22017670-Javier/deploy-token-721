import { z } from 'zod';

export const appConfigSchema = z.object({
  port: z.coerce.number(),
});
export type AppConfig = z.infer<typeof appConfigSchema>;

export const jwtConfigSchema = z.object({
  secret: z.string(),
  expiresIn: z.string(),
});
export type JwtConfig = z.infer<typeof jwtConfigSchema>;

export const dbConfigSchema = z.object({
  host: z.string(),
  port: z.coerce.number(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
});
export type DbConfig = z.infer<typeof dbConfigSchema>;

export const awsConfigSchema = z.object({
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
  region: z.string(),
});
export type AwsConfig = z.infer<typeof awsConfigSchema>;

export const sqsConfigSchema = z.record(
  z.object({
    url: z.string().url(),
    region: z.string(),
  }),
);
export type SqsConfig = z.infer<typeof sqsConfigSchema>;

export const redisConfigSchema = z.object({
  url: z.string().url(),
});
export type RedisConfig = z.infer<typeof redisConfigSchema>;

export const rmqConfigSchema = z.object({
  url: z.string().url(),
});
export type RmqConfig = z.infer<typeof rmqConfigSchema>;

export const servicesConfigSchema = z.object({
  symphonyServiceUrl: z.string().url(),
});
export type ServicesConfig = z.infer<typeof servicesConfigSchema>;
