require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());


const session = require("express-session");
app.use(session({
    secret: "...",
    resave: false,
    saveUninitialized: false
}));


const projectRoutes = require("./routes/projects");
app.use("/api/projects", projectRoutes);

const userRoutes = require("./routes/users");
app.use("/api/users",userRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});



