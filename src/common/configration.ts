const configration = () => ({
  databaseURI: VerifyEnv('MONGO_URI'),
  jwtsecret: VerifyEnv('JWT_SECRET'),
});
const VerifyEnv = (key: string) => {
  // if (!process.env[key]) {
  //   console.log(`Invalid or no Env avalible for key: ${key}`);

  const value = process.env[key];
  // console.log(value);

  return String(value);
};

export default configration;
