export const roleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({ message: "Access Denied" });
      }

      next();
    } catch (err) {
      next(err);
    }
  }
}