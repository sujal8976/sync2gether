import jwt from "jsonwebtoken";

export const validateToken = async (
  token: string
): Promise<string | null> => {
  try {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
      userId: string;
    };

    return decoded.userId;
  } catch (error) {
    return null;
  }
};
