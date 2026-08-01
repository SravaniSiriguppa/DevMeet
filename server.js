require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    });
