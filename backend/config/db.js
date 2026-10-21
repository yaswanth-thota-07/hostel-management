const mongoose = require("mongoose");
const dns = require("dns");

// Configure public DNS resolvers to prevent ECONNREFUSED on MongoDB Atlas SRV lookups in certain environments/ISPs
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (dnsErr) {
    // Fail gracefully if system denies setting custom DNS servers
}

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("Neither MONGO_URI nor MONGODB_URI is defined in environment variables");
        }
        const options = {};
        if (process.env.DATABASE_NAME) {
            options.dbName = process.env.DATABASE_NAME;
        }
        await mongoose.connect(uri, options);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;