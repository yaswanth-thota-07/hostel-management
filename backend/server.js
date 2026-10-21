const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
dotenv.config({ path: path.join(__dirname, ".env") });

const app = require("./app");
const connectDB = require("./config/db");

const createAdmin = require("./config/createAdmin");





const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    try {
        await connectDB();
        await createAdmin();
    } catch (err) {
        console.error("Initialization error:", err.message);
    }
});