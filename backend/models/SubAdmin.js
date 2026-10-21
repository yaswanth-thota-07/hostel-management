const mongoose = require("mongoose");

const subAdminSchema = new mongoose.Schema({
    staffName: {
        type: String,
        required: true
    },
    staffMobile: {
        type: String,
        required: true
    },
    staffRegId: {
        type: String,
        required: true,
        unique: true
    },
    staffEmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},{
        timestamps: true
    });

const SubAdmin = mongoose.model("SubAdmin", subAdminSchema);

module.exports = SubAdmin;