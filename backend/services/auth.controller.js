import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    console.log("🔥 /auth/google hit");

    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const appToken = jwt.sign(
      {
        email: payload.email,
        name: payload.name,
      },
      "secretkey",
      { expiresIn: "7d" }
    );

    // 🔥 THIS RESPONSE IS REQUIRED
    return res.status(200).json({
      token: appToken,
      user: {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      },
    });

  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(500).json({ message: "Auth failed" });
  }
};
