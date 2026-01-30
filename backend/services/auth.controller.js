import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import Stats from "../models/Stats.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    console.log("/auth/google controller hit");
    console.log("MONGO_URI:", process.env.MONGO_URI ? "loaded" : "missing");

    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // FIND OR CREATE USER IN DB
    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
      });

      // create stats doc once
      await Stats.create({ userId: user._id });

      console.log("🟢 User created:", user._id);
    } else {
      console.log("🔵 Existing user:", user._id);
    }

    // JWT SHOULD STORE userId
    const appToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token: appToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.avatar,
      },
    });

  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(500).json({ message: "Auth failed" });
  }
};