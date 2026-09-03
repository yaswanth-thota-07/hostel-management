const Admin = require("../models/Admin.js");

const createAdmin = async () => {
    try {
        const admin = await Admin.findOne({ email: "admin@gmail.com" });

        if (!admin) {
            await Admin.create({
                email: "admin@gmail.com",
                password: "admin123"
            }); 

            console.log("Default admin created");
        }
    } catch (error) {
        console.log("Admin creation failed");
    }
};

module.exports = createAdmin;