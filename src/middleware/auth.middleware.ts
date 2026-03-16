import { verifyJwt } from "../utils/jwt-utils.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.session;
  const payload = token ? await verifyJwt(token) : null;
  if (!payload) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  next();
}