import jwt from "jsonwebtoken";
import { auth, googleProvider } from "./firebase"
import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth"

export async function verifyJwtToken(
  token: string
): Promise<string | jwt.JwtPayload | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    return null;
  }
}


export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    const response = await fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to authenticate with backend")
    }

    const data = await response.json()
    return { success: true, user: data.user }
  } catch (error) {
    console.error("Google sign-in error:", error)
    return { success: false, error: error.message }
  }
}

export const signOutUser = async () => {
  try {
    await firebaseSignOut(auth)

    await fetch("/api/auth/login", {
      method: "PUT",
    })

    return { success: true }
  } catch (error) {
    console.error("Sign out error:", error)
    return { success: false, error: error.message }
  }
}
