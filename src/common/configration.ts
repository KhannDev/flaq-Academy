const configration = () => ({
  databaseURI: verifyEnv('MONGO_URI'),
  jwtsecret: verifyEnv('JWT_SECRET'),
});
const verifyEnv = (key: string) => {
  // if (!process.env[key]) {
  //   console.log(`Invalid or no Env avalible for key: ${key}`);

  const value = process.env[key];
  // console.log(value);
  return String(value);
};

export default configration;
