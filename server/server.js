import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import { PRESET_VENUES } from "./data/presetVenues.js";
import { analyzeCrowdRisk } from "./ai/hfClient.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "sih_crowd_flow_secret_key_2026";

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// In-Memory Database for Hackathon speed
let currentVenues = [...PRESET_VENUES];
let activeVenueId = "v1";
let activeAlerts = [
  {
    id: "alt-101",
    type: "High Congestion",
    severity: "danger",
    nodeLabel: "Gate 2 (East Main VIP)",
    message: "Gate 2 capacity reached 89%. Congestion delay expected +14 mins.",
    timestamp: "10 mins ago"
  },
  {
    id: "alt-102",
    type: "Stall Overflow",
    severity: "warning",
    nodeLabel: "Food Court North",
    message: "Food Court North queue exceeding 600 people. Redirecting to South Court.",
    timestamp: "5 mins ago"
  }
];

// Auth Endpoint
app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;
  const userRole = role || (email.includes("admin") ? "Admin" : "Event Manager");
  const token = jwt.sign({ email, role: userRole, id: "u-123" }, JWT_SECRET, { expiresIn: "24h" });

  res.json({
    token,
    user: {
      id: "u-123",
      name: email.split("@")[0] || "Event Manager",
      email,
      role: userRole
    }
  });
});

// Venues Endpoints
app.get("/api/venues", (req, res) => {
  res.json(currentVenues);
});

app.get("/api/venues/:id", (req, res) => {
  const venue = currentVenues.find(v => v.id === req.params.id) || currentVenues[0];
  res.json(venue);
});

app.post("/api/venues", (req, res) => {
  const newVenue = {
    id: `v-${Date.now()}`,
    name: req.body.name || "Custom Stadium Venue",
    category: req.body.category || "Stadium",
    capacity: req.body.capacity || 50000,
    dimensions: req.body.dimensions || { width: 800, height: 600 },
    nodes: req.body.nodes || [],
    edges: req.body.edges || []
  };
  currentVenues.push(newVenue);
  activeVenueId = newVenue.id;
  io.emit("venueUpdated", newVenue);
  res.status(201).json(newVenue);
});

// Update crowd data per node
app.post("/api/venues/:id/crowd", (req, res) => {
  const { nodeUpdates } = req.body; // array of { id, crowd }
  const venue = currentVenues.find(v => v.id === req.params.id);
  if (!venue) return res.status(404).json({ error: "Venue not found" });

  if (Array.isArray(nodeUpdates)) {
    nodeUpdates.forEach(upd => {
      const node = venue.nodes.find(n => n.id === upd.id);
      if (node) node.crowd = Number(upd.crowd);
    });
  }

  io.emit("crowdDataStream", { venueId: venue.id, nodes: venue.nodes });
  res.json({ success: true, nodes: venue.nodes });
});

// AI Predict Endpoint
app.post("/api/ai/predict", async (req, res) => {
  const { venueId, hfToken, eventType } = req.body;
  const venue = currentVenues.find(v => v.id === (venueId || activeVenueId)) || currentVenues[0];
  
  const result = await analyzeCrowdRisk({
    nodes: venue.nodes,
    capacity: venue.capacity,
    eventType: eventType || venue.category,
    hfToken
  });

  res.json(result);
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Socket.io connections
io.on("connection", (socket) => {
  console.log("Client connected to Socket.io:", socket.id);

  socket.on("joinVenue", (venueId) => {
    socket.join(venueId);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Crowd Flow Backend API running on port ${PORT}`);
});
