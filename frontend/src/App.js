import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    deviceId: '',
    name: '',
    deviceType: '',
    room: '',
    brand: '',
    model: '',
    quantity: 1,
    status: 'Đang sử dụng',
    purchaseDate: '',
    description: ''
  });

  // URL kết nối tới Backend API đã chạy ở cổng 5000
  const API_URL = 'http://localhost:5000/api/devices';

  // Hàm lấy danh sách thiết bị
  const fetchDevices = async (searchTerm = '') => {
    try {
      const res = await axios.get(`${API_URL}?search=${searchTerm}`);
      setDevices(res.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Xử lý khi nhập dữ liệu vào form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Thêm thiết bị mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form);
      fetchDevices();
      alert('Thêm thiết bị thành công!');
      setForm({
        deviceId: '', name: '', deviceType: '', room: '', brand: '',
        model: '', quantity: 1, status: 'Đang sử dụng', purchaseDate: '', description: ''
      });
    } catch (err) {
      alert('Lỗi khi thêm thiết bị: ' + (err.response?.data?.error || err.message));
    }
  };

  // Xóa thiết bị theo ID
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thiết bị này không?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchDevices();
      } catch (err) {
        alert('Lỗi khi xóa thiết bị');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>QUẢN LÝ THIẾT BỊ PHÒNG HỌC - MSSV: 235514</h2>

      {/* Form thêm thiết bị */}
      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>Thêm thiết bị mới</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input type="text" name="deviceId" placeholder="Mã thiết bị (VD: DEV002)" value={form.deviceId} onChange={handleChange} required />
          <input type="text" name="name" placeholder="Tên thiết bị" value={form.name} onChange={handleChange} required />
          <input type="text" name="deviceType" placeholder="Loại thiết bị" value={form.deviceType} onChange={handleChange} />
          <input type="text" name="room" placeholder="Phòng học" value={form.room} onChange={handleChange} />
          <input type="text" name="brand" placeholder="Hãng sản xuất" value={form.brand} onChange={handleChange} />
          <input type="text" name="model" placeholder="Model" value={form.model} onChange={handleChange} />
          <input type="number" name="quantity" placeholder="Số lượng" value={form.quantity} onChange={handleChange} />
          <input type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} />
        </div>
        <textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} style={{ width: '100%', marginTop: '10px', height: '60px' }} />
        <button type="submit" style={{ marginTop: '10px', background: 'green', color: 'white', padding: '10px 15px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Thêm thiết bị</button>
      </form>

      {/* Thanh tìm kiếm */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên hoặc mã thiết bị..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ padding: '8px', width: '70%', marginRight: '10px' }}
        />
        <button onClick={() => fetchDevices(search)} style={{ padding: '8px 15px', cursor: 'pointer' }}>Tìm kiếm</button>
      </div>

      {/* Bảng danh sách thiết bị */}
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#ddd' }}>
            <th>Mã ĐV</th>
            <th>Tên thiết bị</th>
            <th>Loại</th>
            <th>Phòng</th>
            <th>Hãng</th>
            <th>SL</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {devices.length > 0 ? (
            devices.map((d) => (
              <tr key={d._id}>
                <td>{d.deviceId}</td>
                <td>{d.name}</td>
                <td>{d.deviceType}</td>
                <td>{d.room}</td>
                <td>{d.brand}</td>
                <td>{d.quantity}</td>
                <td>{d.status}</td>
                <td>
                  <button onClick={() => handleDelete(d._id)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>Không có thiết bị nào!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;