import "dotenv/config";
import express from "express";
import cors from "cors";    
import authRoutes from "./routes/authroutes.js";
import bookRoutes from "./routes/bookroutes.js";
import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";
const app = express();
const PORT = process.env.PORT || 3000;

job.start(); // Start the cron job
// app.use(express.json());
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the API Home!");
});

app.listen(PORT, () => {
    console.log(`server is listening on the port ${PORT}`);
    // connectDB();
});
// console.log("JWT_SECRET:", process.env.JWT_SECRET); // should not be undefined
// console.log("MONGO_URI:", process.env.MONGO_URI); // should not be undefined
await connectDB(); 
// app.listen(PORT, () => console.log("..........."))