import { Verify } from 'crypto';

const configuration = () => ({
  databaseURI: verifyEnv('MONGO_URI'),
  jwtsecret: verifyEnv('JWT_SECRET'),
  aws_s3_access_key: verifyEnv('AWS_S3_ACCESS_KEY_ID'),
  aws_s3_secret_access: verifyEnv('AWS_S3_SECRET_ACCESS_KEY'),
  aws_s3_flaq_bucket: verifyEnv('AWS_S3_FLAQ_BUCKET'),
  discord_access_id: verifyEnv('DISCORD_ACCESS_ID'),
  discord_secret: verifyEnv('DISCORD_SECRET'),
  discord_redirect_url: verifyEnv('DISCORD_REDIRECT_URL'),
  smtp: {
    SMTP_HOST: verifyEnv('SMTP_HOST'),
    SMTP_PORT: verifyEnv('SMTP_PORT'),
    SMTP_EMAIL: verifyEnv('SMTP_EMAIL'),
    SMTP_PASSWORD: verifyEnv('SMTP_PASSWORD'),
    FROM_NAME: verifyEnv('SMTP_FROM_NAME'),
    FROM_EMAIL: verifyEnv('SMTP_FROM_EMAIL'),
  },
});
const verifyEnv = (key: string) => {
  // if (!process.env[key]) {
  //   console.log(`Invalid or no Env avalible for key: ${key}`);

  const value = process.env[key];

  return String(value);
};

export default configuration;
