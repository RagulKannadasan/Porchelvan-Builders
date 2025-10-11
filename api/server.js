
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json());

// MongoDB Connection
const mongoURI = "mongodb+srv://ragul:raguldb@cluster0.rtuno3r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("MongoDB connection error:", err));

// Registration Schema
const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Registration = mongoose.model("Registration", registrationSchema);

// API Routes
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }
    const existingUser = await Registration.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists." });
    }
    const newRegistration = new Registration({ name, email, phone, address });
    await newRegistration.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "ragul" && password === "ragul@123") {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await Registration.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

app.delete("/api/admin/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await Registration.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// This is necessary for Vercel to work
module.exports = app;

// This is necessary for local development
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
