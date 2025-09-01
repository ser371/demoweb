// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Route to check OpenAI API key
app.get("/check-key", async (req, res) => {
  try {
    const apiKey = req.query.key || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: "API key is required" });
    }

    // Test request to OpenAI (list available models)
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    if (response.status === 401) {
      return res.status(401).json({ valid: false, message: "Invalid API key" });
    }

    if (!response.ok) {
      return res.status(response.status).json({ valid: false, message: "Error checking key" });
    }

    return res.json({ valid: true, message: "API key is valid" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
