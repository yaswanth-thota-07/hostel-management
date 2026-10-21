const Admin = require("../models/Admin.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const createAdmin = async () => {
    if (mongoose.connection.readyState !== 1) {
        console.warn("Skipping default admin creation: database is not connected.");
        return;
    }

    try {
        const admin = await Admin.findOne({ email: "admin@gmail.com" });

        if (!admin) {
            const hashedPassword = await bcrypt.hash("CIDC26@admin128", 10);

            await Admin.create({
                email: "admin@gmail.com",
                password: hashedPassword
            });

            console.log("Default admin created");
        }
    } catch (error) {
        console.log("Admin creation failed");
    }
};

module.exports = createAdmin;