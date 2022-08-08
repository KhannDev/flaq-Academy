import * as jwt from 'jsonwebtoken';
const Id = 1234;
function generateAccessToken(Id) {
  return jwt.sign({ Id }, '88', { expiresIn: '1h' });
}
console.log(generateAccessToken(12));
