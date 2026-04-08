import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret" // 🔥 MISMO SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error); // 🔥 debug real
    return res.status(401).json({ error: "Invalid token" });
  }
};