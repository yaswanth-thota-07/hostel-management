const jwt = require("jsonwebtoken");

const subAdminMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "subadmin" && decoded.role !== "admin") {
            return res.status(403).json({
                message: "Sub-admin or Admin access required"
            });
        }

        if (decoded.role === "admin") {
            req.adminId = decoded.id;
        } else {
            req.subAdminId = decoded.id;
        }

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = subAdminMiddleware;