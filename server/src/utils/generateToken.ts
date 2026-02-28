import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN as string || "1d",
    }
  );
};

export default generateToken;