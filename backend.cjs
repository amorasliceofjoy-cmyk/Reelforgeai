const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// ---------------- AUTH ROUTES (paste into backend.cjs) ----------------
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// JWT secret - prefer to set process.env.JWT_SECRET in production/.env
const JWT_SECRET = process.env.JWT_SECRET || "replace_this_with_a_strong_secret";

// User Schema & Model (if you already have users collection, this will reuse it)
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "user" }, // 'user' or 'admin'
  },
  { timestamps: true }
);

const User = mongoose.models?.User || mongoose.model("User", userSchema);

// Helper: sign JWT
function signToken(userDoc) {
  const payload = { id: String(userDoc._id), email: userDoc.email, name: userDoc.name, role: userDoc.role };
  // expiresIn short for dev; increase in production
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Middleware: protect routes
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, JWT_SECRET);
    // attach user info (minimal) to req
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Optional admin-only guard
function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  next();
}



// Example: protect an admin-only route (uncomment to use)
// app.get("/api/admin/secret", authMiddleware, adminOnly, (req, res) => {
//   res.json({ secret: "only admins see this" });
//});
// -----------------------------------------------------------------------

// 🔴 IMPORTANT: put your real MongoDB URI here
// Copy it from Atlas (Drivers tab) and add `/reelforge` at the end.
const MONGO_URI = "mongodb+srv://Reelforge:Saadsaif7@cluster0.sbdvjdf.mongodb.net/reelforge?appName=Cluster0"; 
// Safety check so you don't forget to replace it
if (
  !MONGO_URI ||
  MONGO_URI.includes("USERNAME") ||
  MONGO_URI.includes("PASSWORD")
) {
  console.error("❌ Please set your real MongoDB URI in backend.cjs (MONGO_URI)");
  process.exit(1);
}

console.log("➡️ Using Mongo URI (start):", MONGO_URI.slice(0, 40) + "...");

const app = express();
app.use(cors());
app.use(express.json());

const ffmpegPath = require('ffmpeg-static'); // path to bundled ffmpeg binary
const ffmpeg = require('fluent-ffmpeg');

if (!ffmpegPath) {
  console.error('ffmpeg-static not found — install with: npm install ffmpeg-static');
  process.exit(1);
}

ffmpeg.setFfmpegPath(ffmpegPath); // tell fluent-ffmpeg to use this binary
console.log('Using ffmpeg at:', ffmpegPath);

// POST /api/auth/signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }

    // check existing
    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userDoc = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), passwordHash, role: role || "user" });
    const token = signToken(userDoc);

    const userSafe = { id: String(userDoc._id), name: userDoc.name, email: userDoc.email, role: userDoc.role };
    res.status(201).json({ token, user: userSafe });
  } catch (err) {
    console.error("POST /api/auth/signup error:", err.message);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user);
    const userSafe = { id: String(user._id), name: user.name, email: user.email, role: user.role };
    res.json({ token, user: userSafe });
  } catch (err) {
    console.error("POST /api/auth/login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/auth/me (protected)
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    const userSafe = { id: String(user._id), name: user.name, email: user.email, role: user.role };
    res.json(userSafe);
  } catch (err) {
    console.error("GET /api/auth/me error:", err.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});
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

  // Project model - to persist editor projects / drafts
const projectSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled project" },
    timelineBlocks: { type: Array, default: [] },
    notes: { type: String, default: "" },
    attachments: { type: Array, default: [] }, // store S3 keys or local filenames
  },
  { timestamps: true }
);

const Project = mongoose.models?.Project || mongoose.model("Project", projectSchema);


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
    timestamps: true, // createdAt, updatedAt
  }
);

const Trend = mongoose.model("Trend", trendSchema);

// 🔧 Normalize Mongo docs → { id, ...rest }
function mapTrend(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  const { _id, __v, ...rest } = obj;
  return { id: _id?.toString?.() || obj.id, ...rest };
}

// 3) Health route
app.get("/", (req, res) => {
  res.send("✅ ReelForge backend (backend.cjs) with MongoDB is running");
});

// 4) GET all trends
app.get("/api/manual-trends", async (req, res) => {
  try {
    const docs = await Trend.find().sort({ createdAt: -1 });
    const trends = docs.map(mapTrend);
    res.json(trends);
  } catch (err) {
    console.error("GET /api/manual-trends error:", err.message);
    res.status(500).json({ error: "Failed to load trends" });
  }
});



// 5) CREATE or UPDATE via POST (upsert)
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
      const updatedDoc = await Trend.findByIdAndUpdate(
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
      );

      if (!updatedDoc) {
        return res.status(404).json({ error: "Trend not found for update" });
      }

      const updated = mapTrend(updatedDoc);
      return res.json(updated);
    }

    // CREATE new if no id
    const createdDoc = await Trend.create({
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

    const created = mapTrend(createdDoc);
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
  console.log(`✅ Backend (backend.cjs) listening on http://localhost:${PORT}`);
});
