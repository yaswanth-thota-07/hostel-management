const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
            index: true
        },

        hostel: {
            type: String,
            required: true,
            trim: true
        },

        wing: {
            type: String,
            required: true,
            trim: true
        },

        roomNo: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            type: String,
            default: null
        },

        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"],
            default: "pending",
            index: true
        },

        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        resolvedByModel: {
            type: String,
            enum: ["Admin", "SubAdmin"],
            default: null
        },

        resolutionNote: {
            type: String,
            default: null,
            trim: true
        },

        resolvedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Complaint", complaintSchema);