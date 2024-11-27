import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

// middlewares routes configuration
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

// database connection
import connectToMongoDB from "./db/connectToMongoDB.js";
const app = express();

// dotenv config
dotenv.config();
const PORT = process.env.PORT || 5001;


app.use(express.json()); // middleware to parse incoming request body as JSON (req.body)
app.use(cookieParser());


// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


app.listen(PORT, () => {
    connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
