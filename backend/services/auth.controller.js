import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const user = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    const appToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token: appToken,
      user,
    });

  } catch (err) {
    res.status(401).json({ message: "Invalid Google token" });
  }
};
