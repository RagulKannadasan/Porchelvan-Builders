const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
