import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log("🔐 Incoming Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("✅ Decoded Token:", decoded);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("❌ Authenticationn error:", error.message);
    res.status(401).json({ message: "Token is invalid" });
  } finally {
    console.log("sab badiyan chalra h dosto");
  }
};

export default protectRoute;
