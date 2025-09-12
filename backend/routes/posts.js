require("dotenv").config();
const express = require("express");
const multer = require("multer");
const OpenAI = require("openai"); // default import for CommonJS

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Create OpenAI client if available
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function ruleBasedCategory(text) {
  const content = (text || "").toLowerCase();
  const isEvent = /(event|workshop|seminar|talk|meetup|fest|festival|concert|party|hackathon|webinar|registration|rsvp|tickets?)/.test(content);
  const isLostFound = /(lost|found|missing|looking for|misplaced|left.*(in|at)|if found|please return|reward)/.test(content);
  const isAnnouncement = /(official|announcement|notice|timetable|schedule|exam|results|update|maintenance|policy|deadline|office|admin|administration)/.test(content);
  if (isEvent) return "Event Posts";
  if (isLostFound) return "Lost & Found Posts";
  if (isAnnouncement) return "Official Announcements";
  // Default guess: event-like community posts
  return "Event Posts";
}

let feed = []; // In-memory feed

// Classification endpoint
router.post("/classify", upload.single("image"), async (req, res) => {
  const { text } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  // If no OpenAI configured, use heuristic immediately
  if (!openai) {
    const category = ruleBasedCategory(text);
    return res.json({ category, source: "heuristic", imagePath });
  }
  try {
    const prompt = `
Classify the following campus post into one of three categories:
1. Event Posts – workshops, college fests, or club activities.
2. Lost & Found Posts – report lost items or found items.
3. Official Announcements – notices, timetables, campus-wide updates.

Post Content: "${text}"
Return only the category name.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.0-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const category = response.choices?.[0]?.message?.content?.trim() || ruleBasedCategory(text);
    res.json({ category, source: "openai", imagePath });
  } catch (err) {
    console.error("OpenAI classify failed, using heuristic:", err?.message || err);
    const category = ruleBasedCategory(text);
    res.json({ category, source: "heuristic", imagePath });
  }
});

// Create post endpoint
router.post("/create", (req, res) => {
  const { title, type, location, date, description, imageUrl } = req.body;
  const post = {
    id: Date.now(),
    title,
    type,
    location,
    date,
    description,
    imageUrl,
    createdAt: Date.now(),
    rsvp: { going: 0, maybe: 0, notGoing: 0 }
  };
  feed.unshift(post);
  res.json({ success: true, post });
});

// RSVP endpoint
router.post("/rsvp", (req, res) => {
  const { postId, response } = req.body; // response: 'going' | 'maybe' | 'notGoing'
  const post = feed.find((p) => p.id === Number(postId));
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (!post.rsvp) post.rsvp = { going: 0, maybe: 0, notGoing: 0 };
  if (!['going','maybe','notGoing'].includes(response)) return res.status(400).json({ error: "Invalid RSVP" });
  post.rsvp[response] += 1;
  return res.json({ success: true, post });
});

// Get feed
router.get("/feed", (req, res) => {
  res.json(feed);
});

module.exports = router;
