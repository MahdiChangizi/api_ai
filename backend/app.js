import express from "express";
import axios from "axios";
import cors from "cors";
import { exec } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = "https://api.chaingpt.org/chat";
const API_KEY = '3daec896-fc06-4b85-897c-9875326451bd';

app.post("/chat", async (req, res) => {
 try {
  const { messages } = req.body;

  const lastMessage = messages[messages.length - 1].content;

  const curlCommand = `
  curl -s -X POST "${API_URL}" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "general_assistant",
    "question": "${lastMessage}",
    "chatHistory": "off"
  }'
  `;

  exec(curlCommand, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ reply: "curl error", error: err.message });
    }

    try {
      const data = JSON.parse(stdout);

      const reply =
        data?.response ||
        data?.answer ||
        JSON.stringify(data);

      res.json({ reply });

    } catch (e) {
      res.status(500).json({
        reply: "Parse error",
        error: stdout
      });
    }
  });

} catch (error) {
  res.status(500).json({
    reply: "Server error",
    error: error.message
  });
}
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
