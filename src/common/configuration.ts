import { Verify } from 'crypto';

const configuration = () => ({
  databaseURI: verifyEnv('MONGO_URI'),
  jwtsecret: verifyEnv('JWT_SECRET'),
  aws_s3_access_key: verifyEnv('AWS_S3_ACCESS_KEY_ID'),
  aws_s3_secret_access: verifyEnv('AWS_S3_SECRET_ACCESS_KEY'),
  aws_s3_flaq_bucket: verifyEnv('AWS_S3_FLAQ_BUCKET'),
});
const verifyEnv = (key: string) => {
  // if (!process.env[key]) {
  //   console.log(`Invalid or no Env avalible for key: ${key}`);

  const value = process.env[key];
  // console.log(value);
  return String(value);
};

export default configuration;
