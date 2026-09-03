const SubAdmin = require("../models/SubAdmin");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { staffEmail, password } = req.body;

        if (!staffEmail || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            }); 
        }

        const subAdmin = await SubAdmin.findOne({ staffEmail });

        if (!subAdmin || password !== subAdmin.password) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: subAdmin._id,
                role: "subadmin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Sub-admin login successful",
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    login
};