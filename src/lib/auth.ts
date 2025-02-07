import jwt from "jsonwebtoken";

export async function verifyJwtToken(token: string): Promise<any> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    return null;
  }
}
