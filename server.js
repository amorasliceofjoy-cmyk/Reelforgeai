import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// 🔴 TEMP: Hardcode your MongoDB connection string here for local dev
// Replace the whole string below with your connection string from Atlas.
const MONGO_URI =
  "mongodb+srv://reelforge_user:<db_password>@reelforgeuser.egk4nex.mongodb.net/?appName=reelforgeuser";

if (!MONGO_URI || MONGO_URI.includes("USERNAME") || MONGO_URI.includes("PASSWORD")) {
  console.error("❌ Please set your real MongoDB URI in MONGO_URI in server.js");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// 1) Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    dbName: "reelforge",
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// 2) Trend schema + model
const trendSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    platform: { type: String, default: "Instagram Reels" },
    niche: { type: String, default: "" },
    hookType: { type: String, default: "" },
    description: { type: String, required: true },
    editingTemplate: { type: String, required: true },
    captionExample: { type: String, default: "" },
    hashtags: { type: String, default: "" },
    soundType: { type: String, default: "" },
    status: { type: String, default: "Rising" },
    sourceUrl: { type: String },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

const Trend = mongoose.model("Trend", trendSchema);

// 3) Health check
app.get("/", (req, res) => {
  res.send("✅ ReelForge backend with MongoDB is running");
});

// 4) GET all trends
app.get("/api/manual-trends", async (req, res) => {
  try {
    const trends = await Trend.find().sort({ createdAt: -1 }).lean();
    res.json(trends);
  } catch (err) {
    console.error("GET /api/manual-trends error:", err.message);
    res.status(500).json({ error: "Failed to load trends" });
  }
});

// 5) CREATE or UPDATE (UPSERT) trend via POST
app.post("/api/manual-trends", async (req, res) => {
  try {
    const {
      id,
      title,
      platform,
      niche,
      hookType,
      description,
      editingTemplate,
      captionExample,
      hashtags,
      soundType,
      status,
      sourceUrl,
    } = req.body;

    if (!title || !description || !editingTemplate) {
      return res.status(400).json({
        error: "Title, description and editing template are required.",
      });
    }

    // UPDATE existing if id present
    if (id) {
      const updated = await Trend.findByIdAndUpdate(
        id,
        {
          title,
          platform: platform || "Instagram Reels",
          niche: niche || "",
          hookType: hookType || "",
          description,
          editingTemplate,
          captionExample: captionExample || "",
          hashtags: hashtags || "",
          soundType: soundType || "",
          status: status || "Rising",
          sourceUrl: sourceUrl || "",
        },
        { new: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ error: "Trend not found for update" });
      }

      return res.json(updated);
    }

    // CREATE new if no id
    const created = await Trend.create({
      title,
      platform: platform || "Instagram Reels",
      niche: niche || "",
      hookType: hookType || "",
      description,
      editingTemplate,
      captionExample: captionExample || "",
      hashtags: hashtags || "",
      soundType: soundType || "",
      status: status || "Rising",
      sourceUrl: sourceUrl || "",
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error("POST /api/manual-trends error:", err.message);
    res.status(500).json({ error: "Failed to save trend" });
  }
});

// 6) DELETE a trend
app.delete("/api/manual-trends/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Trend.findByIdAndDelete(id).lean();

    if (!deleted) {
      return res.status(404).json({ error: "Trend not found" });
    }

    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error("DELETE /api/manual-trends error:", err.message);
    res.status(500).json({ error: "Failed to delete trend" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});
