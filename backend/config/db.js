const mongoose = require("mongoose");
const dns = require("node:dns");

// Fallback to public DNS to prevent querySrv ECONNREFUSED on some local ISPs/Windows networks
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
    // Ignore if not supported in environment
}

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
        console.error("MongoDB error: Neither MONGO_URI nor MONGODB_URI is set in environment variables.");
        return;
    }

    try {
        const options = {};
        if (process.env.DATABASE_NAME) {
            options.dbName = process.env.DATABASE_NAME;
        }

        await mongoose.connect(mongoUri, options);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        if (error.message.includes("bad auth") || error.message.includes("Authentication failed")) {
            console.error("-> Authentication failed: Check your MongoDB username and password in MONGO_URI / MONGODB_URI.");
        }
    }
};

module.exports = connectDB;