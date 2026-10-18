require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();  
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


const session = require("express-session");
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));


const projectRoutes = require("./routes/projects");
app.use("/api/projects", projectRoutes);

const userRoutes = require("./routes/users");
app.use("/api/users",userRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});



