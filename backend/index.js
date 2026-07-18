import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import searchRoute from './routes/searchRoutes.js'
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

console.log("===================================");
console.log("🚀 SERVER STARTING...");
console.log("PORT :", PORT);
console.log("URL  :", process.env.URL);
console.log("NODE :", process.version);
console.log("===================================");

// =====================
// REQUEST LOGGER
// =====================
app.use((req, res, next) => {
    // console.log("\n==============================");
    // console.log("📥 NEW REQUEST");
    // console.log("TIME   :", new Date().toLocaleString());
    // console.log("METHOD :", req.method);
    // console.log("URL    :", req.originalUrl);
    // console.log("IP     :", req.ip);
    // console.log("ORIGIN :", req.headers.origin);
    // console.log("COOKIE :", req.headers.cookie);
    // console.log("==============================");

    res.on("finish", () => {
        console.log("📤 RESPONSE :", res.statusCode);
        console.log("==============================\n");
    });

    next();
});

// =====================
// MIDDLEWARES
// =====================

app.use(express.json());

app.use(
    urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

// =====================
// TEST ROUTE
// =====================

app.get("/ping", (req, res) => {
    //console.log("✅ PING HIT");
    res.json({
        success: true,
        message: "Backend Working"
    });
});

app.delete("/delete-test", (req, res) => {
    //console.log("✅ DELETE TEST HIT");
    res.json({
        success: true,
        message: "Delete Route Working"
    });
});

// =====================
// ROUTES
// =====================

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1", searchRoute);
app.use("/api/v1/message", messageRoute);

// =====================
// 404
// =====================

// app.use((req, res) => {
//     console.log("❌ ROUTE NOT FOUND");
//     res.status(404).json({
//         success: false,
//         message: "Route Not Found"
//     });
// });

// =====================
// ERROR HANDLER
// =====================

app.use((err, req, res, next) => {
  //  console.log("🔥 GLOBAL ERROR");
    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message
    });
});

// Serve static files from the 'client/dist' folder
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Catch-all route to serve index.html for frontend React app (This should be last)
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});
// =====================
// START SERVER
// =====================

server.listen(PORT, async () => {
    await connectDB();

    //console.log("================================");
  //  console.log(`✅ Server Running : http://localhost:${PORT}`);
  //  console.log("================================");
});