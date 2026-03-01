import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET as string;

  return jwt.sign(
    { id },
    secret,
    {
      expiresIn: "1d",
    }
  );
};

export default generateToken;
