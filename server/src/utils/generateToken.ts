import jwt, { Secret, SignOptions } from "jsonwebtoken";

const generateToken = (id: string) => {
  const secret: Secret = process.env.JWT_SECRET as string;

  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  };

  return jwt.sign({ id }, secret, options);
};

export default generateToken;