const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Kết nối MongoDB Atlas thành công!'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// Schema thiết bị phòng học
const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  deviceType: String,
  room: String,
  brand: String,
  model: String,
  quantity: Number,
  status: String,
  purchaseDate: String,
  description: String
});

const Device = mongoose.model('Device', deviceSchema);

// --- CÁC API ENDPOINTS ---

// 1. Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server backend đang chạy bình thường!' });
});

// 2. GET: Lấy danh sách + Tìm kiếm thiết bị
app.get('/api/devices', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { deviceId: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const devices = await Device.find(query);
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST: Thêm thiết bị mới
app.post('/api/devices', async (req, res) => {
  try {
    const newDevice = new Device(req.body);
    const savedDevice = await newDevice.save();
    res.status(201).json(savedDevice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. PUT: Cập nhật thông tin thiết bị
app.put('/api/devices/:id', async (req, res) => {
  try {
    const updatedDevice = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDevice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. DELETE: Xóa thiết bị
app.delete('/api/devices/:id', async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa thiết bị thành công!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});