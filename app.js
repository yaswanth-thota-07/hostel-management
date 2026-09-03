const express = require("express");

const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const subAdminRoutes = require("./routes/subAdminRoutes");
const complaintRoutes = require("./routes/studentComplaintRoutes");

const app = express();

app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subadmin", subAdminRoutes);
app.use("/api/complaints", complaintRoutes);

module.exports = app;