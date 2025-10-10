const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
const allowedOrigins = [
  'https://3000-firebase-porchelvanbuildgit-1760097351440.cluster-y75up3teuvc62qmnwys4deqv6y.cloudworkstations.dev',
  'https://porchelvan-builders-45on.vercel.app'
];

app.use(cors({ 
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(express.json());

// MongoDB Connection
const mongoURI = "mongodb+srv://ragul:raguldb@cluster0.rtuno3r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB connection string

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

// API Route for Registration
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Basic validation
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    // Check if user already exists
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

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  // IMPORTANT: In a real application, use a more secure authentication method!
  if (username === "ragul" && password === "1234567890") {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Get all registered users
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await Registration.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = app;
