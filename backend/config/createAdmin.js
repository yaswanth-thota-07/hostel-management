const Admin = require("../models/Admin.js");
const bcrypt = require("bcrypt");

const createAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const admin = await Admin.findOne({ email: "admin@gmail.com" });

        if (!admin) {
            await Admin.create({
                email: "admin@gmail.com",
                password: hashedPassword
            });
            console.log("Default admin created: admin@gmail.com / admin123");
        } else {
            admin.password = hashedPassword;
            await admin.save();
            console.log("Admin password updated: admin@gmail.com / admin123");
        }
    } catch (error) {
        console.error("Admin creation/update failed:", error.message);
    }
};

module.exports = createAdmin;