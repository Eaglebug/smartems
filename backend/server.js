const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// ================= MONGODB CONNECTION ================= //
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartems';

const DB_STATUS = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

const logDbStatus = (label) => {
  const state = DB_STATUS[mongoose.connection.readyState] || 'unknown';
  console.log(`🗄️ MongoDB Status [${label}]: ${state}`);
};

mongoose.connection.on('connecting', () => logDbStatus('connecting'));
mongoose.connection.on('connected', () => logDbStatus('connected'));
mongoose.connection.on('disconnected', () => logDbStatus('disconnected'));
mongoose.connection.on('error', (err) => {
  logDbStatus('error');
  console.log('❌ MongoDB Error Details:', err.message);
});

mongoose.connect(MONGODB_URI).then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    logDbStatus('post-connect');
    seedDatabase(); // Initial dummy data dalne ke liye
}).catch(err => console.log("❌ MongoDB Connection Error:", err));

// ================= DATABASE MODELS ================= //
const userSchema = new mongoose.Schema({ user: String, pass: String });
const User = mongoose.model('User', userSchema);

const recordSchema = new mongoose.Schema({
    id: String, name: String, type: String, outcome: String, time: String, address: String
});
const Record = mongoose.model('Record', recordSchema);

// Initial Data Seed (Taki pehli baar khali na dikhe)
async function seedDatabase() {
    const userCount = await User.countDocuments();
    if (userCount === 0) await User.create({ user: 'admin', pass: 'ems123' });

    const recordCount = await Record.countDocuments();
    if (recordCount === 0) {
        await Record.insertMany([
            { id: '101', name: 'Rahul Sharma', type: 'Vehicle Accident', outcome: 'Saved', time: '09:15 AM', address: 'Highway 101, Mumbai' },
            { id: '102', name: 'Priya Verma', type: 'Cardiac Arrest', outcome: 'Saved', time: '10:05 AM', address: 'Andheri West' }
        ]);
    }
}

// ================= API ENDPOINTS ================= //

// 1. Login API
app.post('/api/login', async (req, res) => {
    const { user, pass } = req.body;
    const foundUser = await User.findOne({ user, pass });
    if (foundUser) res.json({ success: true });
    else res.json({ success: false });
});

// 2. Register API
app.post('/api/register', async (req, res) => {
    const { user, pass } = req.body;
    const existing = await User.findOne({ user });
    if (existing) return res.json({ success: false, message: "User exists" });
    await User.create({ user, pass });
    res.json({ success: true });
});

// 3. Get Patient Records API
app.get('/api/records', async (req, res) => {
    const records = await Record.find().sort({ _id: -1 }); // Latest pehle
    res.json(records);
});

// 4. Save New Patient Record API
app.post('/api/records', async (req, res) => {
    const newRecord = await Record.create(req.body);
    res.json(newRecord);
});

// 5. SOS Dispatch API (Socket.io)
app.post('/api/sos', (req, res) => {
  const { emergencyId, type, dronePayload, ambulanceCount, location, severity, patientName, contactNumber, description, hub, hospital } = req.body;
  
  io.emit('new_emergency', {
    id: emergencyId, zone: location, hub: hub, hospital: hospital, ambulanceCount: ambulanceCount
  });

  setTimeout(() => io.emit('status_update', { time: new Date().toLocaleTimeString(), message: `Drone Dispatched with [${dronePayload}]` }), 1000);
  
  setTimeout(() => {
    io.emit('status_update', { time: new Date().toLocaleTimeString(), message: `${ambulanceCount} Ambulance(s) Routed to Scene.` });
    
    io.emit('hospital_alert', { 
      id: emergencyId, time: new Date().toLocaleTimeString(), type: type, severity: severity,
      patientName: patientName || 'Unknown', contactNumber: contactNumber || 'Not Provided',
      description: description || 'No extra details provided.', dronePayload: dronePayload, 
      ambulanceCount: ambulanceCount, address: location.name, 
      message: `MASS ALERT: Incoming ${ambulanceCount} Ambulance(s)!`, ambulanceEta: '5 Mins'
    });
    
    startTrackingSimulation(emergencyId);
  }, 3000);

  res.status(200).json({ success: true });
});

function startTrackingSimulation(id) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 5; 
    let droneProgress = Math.min(progress * 2, 100);
    let ambulanceProgress = Math.min(progress, 100);
    io.emit('tracking_update', { id, drone: droneProgress, ambulance: ambulanceProgress, phase: 'to_scene' });

    if (ambulanceProgress >= 100) {
      clearInterval(interval);
      io.emit('status_update', { time: new Date().toLocaleTimeString(), message: `Arrived at Accident Zone. Loading patients...` });

      setTimeout(() => {
        let returnProgress = 0;
        const returnInterval = setInterval(() => {
          returnProgress += 5;
          io.emit('tracking_update', { id, drone: 100, ambulance: returnProgress, phase: 'to_hospital' });
          if (returnProgress >= 100) {
            clearInterval(returnInterval);
            io.emit('status_update', { time: new Date().toLocaleTimeString(), message: `Convoy reached Hospital.` });
          }
        }, 1000);
      }, 3000);
    }
  }, 1000);
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { console.log(`Backend running on port ${PORT}`); });