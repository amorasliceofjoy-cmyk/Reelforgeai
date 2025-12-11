// backend.cjs (merged & cleaned)
const path = require("path");
const fs = require("fs");

// Load env from project root explicitly
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { spawn } = require("child_process");

// App setup
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// DEV: relax CSP so devtools/extensions can connect (REMOVE or tighten for production)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self' 'unsafe-inline' data: blob:; connect-src *; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'"
    );
    next();
  });
}

// Config with safe defaults
const PORT = process.env.PORT || 5000;
const ENV_MONGO = process.env.MONGODB_URI || process.env.MONGO_URI || "";
const DEFAULT_LOCAL = "mongodb://127.0.0.1:27017/reelforge-dev";
const MONGO_TO_USE = ENV_MONGO || DEFAULT_LOCAL;

// Helpers
function safeMask(str, keepStart = 12, keepEnd = 6) {
  if (!str) return "[EMPTY]";
  if (str.length <= keepStart + keepEnd + 3) return "[REDACTED]";
  return str.slice(0, keepStart) + "..." + str.slice(-keepEnd);
}

console.log("DEBUG: process.cwd() =", process.cwd());
console.log("DEBUG: resolved .env path =", path.resolve(process.cwd(), ".env"));
console.log("DEBUG: .env exists =", fs.existsSync(path.resolve(process.cwd(), ".env")));
console.log("DEBUG: MONGODB_URI present in env =", ENV_MONGO ? "[SET]" : "[NOT SET]");
if (ENV_MONGO) console.log("DEBUG: using MONGODB_URI (masked) =", safeMask(ENV_MONGO));
else console.warn("⚠️  MONGODB_URI not set; falling back to local DB:", DEFAULT_LOCAL);

// ---------- ffmpeg setup (ffprobe optional) ----------
try {
  const ffmpegStatic = require("ffmpeg-static"); // path to binary
  const ffmpeg = require("fluent-ffmpeg");
  ffmpeg.setFfmpegPath(ffmpegStatic);
  try {
    const ffprobe = require("ffprobe-static");
    if (ffprobe && ffprobe.path) {
      ffmpeg.setFfprobePath(ffprobe.path);
      console.log("DEBUG: ffprobe configured:", ffprobe.path);
    }
  } catch (e) {
    console.warn("DEBUG: ffprobe-static not installed — continuing without ffprobe. (npm i ffprobe-static)");
  }
  console.log("DEBUG: fluent-ffmpeg configured to use:", ffmpegStatic);
} catch (e) {
  console.warn("DEBUG: fluent-ffmpeg or ffmpeg-static not configured:", e && e.message ? e.message : e);
}

// ---------- Mongoose connect ----------
mongoose
  .connect(MONGO_TO_USE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.warn("Mongo connection error:", err.message);
    // In production you might prefer process.exit(1);
  });

// ---------- MODELS ----------
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);
const User = mongoose.models?.User || mongoose.model("User", userSchema);

const projectSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled project" },
    timelineBlocks: { type: Array, default: [] },
    notes: { type: String, default: "" },
    attachments: { type: Array, default: [] },
  },
  { timestamps: true }
);
const Project = mongoose.models?.Project || mongoose.model("Project", projectSchema);

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
  { timestamps: true }
);
const Trend = mongoose.models?.Trend || mongoose.model("Trend", trendSchema);

// ---------- AUTH helpers ----------
const JWT_SECRET = process.env.JWT_SECRET || "replace_this_with_a_real_secret";

function signToken(userDoc) {
  const payload = { id: String(userDoc._id), email: userDoc.email, name: userDoc.name, role: userDoc.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
function isStrongPassword(pw) {
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return re.test(pw);
}

// ---------- Utility mapper ----------
function mapTrend(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  const { _id, __v, ...rest } = obj;
  return { id: _id?.toString?.() || obj.id, ...rest };
}

// ---------- Routes ----------

// respond to devtools probe to avoid 404 noise
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => res.status(204).end());

// Health
app.get("/", (req, res) => res.send("✅ ReelForge backend (backend.cjs) with MongoDB is running"));

// ffmpeg quick version test (uses ffmpeg-static binary)
app.get("/ffmpeg-version", (req, res) => {
  try {
    const ffmpegPath = require("ffmpeg-static");
    const child = spawn(ffmpegPath, ["-version"]);
    let out = "", err = "";
    child.stdout.on("data", (d) => (out += d.toString()));
    child.stderr.on("data", (d) => (err += d.toString()));
    child.on("close", (code) => res.json({ code, versionLine: out.split("\n")[0], stderrFirst: err ? err.split("\n")[0] : null }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Example convert route (child_process) - simple test: input file -> out-simple.mp4
// Ensure you place a small file at ./test-assets/input.mov before calling this
app.post("/convert-simple", async (req, res) => {
  const input = path.resolve("./test-assets/input.mov");
  const output = path.resolve("./test-assets/out-simple.mp4");

  if (!fs.existsSync(input)) return res.status(400).json({ error: "Input file not found at ./test-assets/input.mov" });

  const ffmpegPath = require("ffmpeg-static");
  const args = ["-i", input, "-c:v", "libx264", "-preset", "veryfast", "-y", output];
  const proc = spawn(ffmpegPath, args, { stdio: ["ignore", "pipe", "pipe"] });

  proc.stdout.on("data", (d) => console.log("ffmpeg stdout:", d.toString()));
  proc.stderr.on("data", (d) => console.log("ffmpeg stderr:", d.toString()));
  proc.on("error", (e) => {
    console.error("spawn error", e);
    res.status(500).json({ ok: false, error: e.message });
  });
  proc.on("close", (code) => {
    if (code === 0) return res.json({ ok: true, output });
    return res.status(500).json({ ok: false, code });
  });
});

// ---------- Auth routes ----------
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Name, email and password are required." });
    if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email." });
    if (!isStrongPassword(password)) return res.status(400).json({ error: "Password not strong enough." });

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

// ---------- Manual trends routes ----------
app.get("/api/manual-trends", async (req, res) => {
  try {
    const docs = await Trend.find().sort({ createdAt: -1 });
    res.json(docs.map(mapTrend));
  } catch (err) {
    console.error("GET /api/manual-trends error:", err.message);
    res.status(500).json({ error: "Failed to load trends" });
  }
});

app.post("/api/manual-trends", async (req, res) => {
  try {
    const { id, title, description, editingTemplate, platform, niche, hookType, captionExample, hashtags, soundType, status, sourceUrl } = req.body;
    if (!title || !description || !editingTemplate) return res.status(400).json({ error: "Title, description and editing template are required." });

    if (id) {
      const updatedDoc = await Trend.findByIdAndUpdate(
        id,
        { title, platform: platform || "Instagram Reels", niche: niche || "", hookType: hookType || "", description, editingTemplate, captionExample: captionExample || "", hashtags: hashtags || "", soundType: soundType || "", status: status || "Rising", sourceUrl: sourceUrl || "" },
        { new: true }
      );
      if (!updatedDoc) return res.status(404).json({ error: "Trend not found for update" });
      return res.json(mapTrend(updatedDoc));
    }

    const createdDoc = await Trend.create({ title, platform: platform || "Instagram Reels", niche: niche || "", hookType: hookType || "", description, editingTemplate, captionExample: captionExample || "", hashtags: hashtags || "", soundType: soundType || "", status: status || "Rising", sourceUrl: sourceUrl || "" });
    return res.status(201).json(mapTrend(createdDoc));
  } catch (err) {
    console.error("POST /api/manual-trends error:", err.message);
    res.status(500).json({ error: "Failed to save trend" });
  }
});

app.delete("/api/manual-trends/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Trend.findByIdAndDelete(id).lean();
    if (!deleted) return res.status(404).json({ error: "Trend not found" });
    res.json({ success: true, deletedId: id });
  } catch (err) {
    console.error("DELETE /api/manual-trends error:", err.message);
    res.status(500).json({ error: "Failed to delete trend" });
  }
});

// ---------- Server start ----------
app.listen(PORT, () => {
  console.log(`✅ Backend (backend.cjs) listening on http://localhost:${PORT}`);
});
