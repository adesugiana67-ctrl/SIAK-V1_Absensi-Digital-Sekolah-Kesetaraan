// server.js - Backend Server PKBM IGI Sumedang
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname))); // Serve index.html

// === DATABASE SQLITE ===
const db = new sqlite3.Database('./absensi.db', (err) => {
  if (err) console.error('Error DB:', err.message);
  else console.log('✅ Connected to SQLite Database');
});

// Buat Tabel jika belum ada
db.run(`CREATE TABLE IF NOT EXISTS absensi (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  program TEXT NOT NULL,
  mapel TEXT,
  tanggal TEXT NOT NULL,
  status TEXT NOT NULL,
  catatan TEXT,
  timestamp INTEGER NOT NULL,
  device_id TEXT
)`);

// === VALIDASI DUPLIKAT SERVER-SIDE ===
// Cek apakah siswa sudah input di tanggal tersebut di mana pun
function checkDuplicate(nama, tanggal, deviceId, callback) {
  const sql = `SELECT * FROM absensi WHERE LOWER(nama) = ? AND tanggal = ? AND device_id != ?`;
  db.get(sql, [nama.toLowerCase(), tanggal, deviceId], callback);
}

// === API ENDPOINTS ===

// GET: Ambil semua data untuk sync
app.get('/api/absensi', (req, res) => {
  db.all('SELECT * FROM absensi ORDER BY timestamp DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST: Simpan data baru (dengan cek duplikat)
app.post('/api/absensi', (req, res) => {
  const { id, nama, program, mapel, tanggal, status, catatan, timestamp, device_id } = req.body;
  
  // Validasi Duplikat (Hindari input ganda dari device berbeda atau sama)
  checkDuplicate(nama, tanggal, device_id, (err, existing) => {
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        message: `Duplikasi Terdeteksi! ${nama} sudah diabsen pada tanggal ${tanggal}.`,
        existingData: existing 
      });
    }

    // Jika tidak duplikat, simpan ke DB
    const sql = `INSERT INTO absensi (id, nama, program, mapel, tanggal, status, catatan, timestamp, device_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [id, nama, program, mapel, tanggal, status, catatan, timestamp, device_id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      // Broadcast alert untuk sinkronisasi realtime ke client lain
      io.emit('sync-data', true); 
      
      res.json({ success: true, message: 'Data berhasil disimpan & disinkronkan!' });
    });
  });
});

// DELETE: Hapus satu data
app.delete('/api/absensi/:id', (req, res) => {
  const sql = `DELETE FROM absensi WHERE id = ?`;
  db.run(sql, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    io.emit('sync-data', true); // Broadcast ke client lain
    res.json({ success: true });
  });
});

// CLEAR ALL: Kosongkan database
app.delete('/api/absensi/clear', (req, res) => {
  if (req.query.key !== 'ADMIN_KEY_IGI') {
    return res.status(403).json({ error: 'Access denied. Provide valid key.' });
  }
  db.run(`DELETE FROM absensi`, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    io.emit('sync-data', true);
    res.json({ success: true });
  });
});

// === WEBSOCKET UNTUK REALTIME SYNC ===
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('🔗 Client connected for realtime sync');
  
  // Kirim data terbaru saat connect
  db.all('SELECT * FROM absensi ORDER BY timestamp DESC', [], (err, rows) => {
    socket.emit('initial-sync', rows);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// === START SERVER ===
http.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📱 Buka browser dan akses: http://localhost:${PORT}`);
  console.log(`💾 Database tersimpan di: ./absensi.db`);
});
