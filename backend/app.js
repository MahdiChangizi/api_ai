import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = "https://api.chaingpt.org/chat";
const API_KEY = "3daec896-fc06-4b85-897c-9875326451bd";

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !messages.length) {
      return res.status(400).json({ reply: "No messages" });
    }

    const lastMessage = messages[messages.length - 1].content;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "general_assistant",
        question: lastMessage,
        chatHistory: "off"
      })
    });

    const data = await response.json();

    const reply =
      data?.response ||
      data?.answer ||
      JSON.stringify(data);

    res.json({ reply });

  } catch (error) {
    res.status(500).json({
      reply: "Server error",
      error: error.message
    });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});