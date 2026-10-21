const express = require("express");
const path = require("path");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const subAdminRoutes = require("./routes/subAdminRoutes");
const complaintRoutes = require("./routes/studentComplaintRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.on("finish", () => {
        if (res.statusCode >= 400) {
            console.log(`[http] ${req.method} ${req.originalUrl} -> ${res.statusCode}`);
        }
    });
    next();
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subadmin", subAdminRoutes);
app.use("/api/complaints", complaintRoutes);

const frontendDist = path.join(__dirname, "..", "frontend", "dist");

if (require("fs").existsSync(frontendDist)) {
    app.use(express.static(frontendDist));

    app.use((req, res, next) => {
        if (req.path.startsWith("/api")) {
            return next();
        }

        res.sendFile(path.join(frontendDist, "index.html"));
    });
}

app.use("/api", (req, res) => {
    res.status(404).json({
        message: `No route for ${req.method} ${req.originalUrl}`
    });
});

module.exports = app;