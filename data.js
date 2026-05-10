/* LocalStorage-backed "DB" + seed data */
const STORAGE_KEYS = {
  akreditasi: 'sumedang.akreditasi.v1',
  pesertaDidik: 'sumedang.pesertaDidik.v1',
  eRapor: 'sumedang.eRapor.v1',
};

const SEED = {
  akreditasi: [
    { id: 1, npsn: 'P2963449', namaSekolah: 'PKBM MEKAR BUANA', alamatSekolah: 'JL.ANGKREK NO.9BRT 4RW 2, Kel.Kotakaler, Kec. Sumedang Utara', kepalaSekolah: 'EGI ZAENAL MUTAQIEN', akreditasi: 'B', tahunAkreditasi: 2017, berakhirTahun: 2026, nomorSk: 'No SK: -(Bukan program Kesetaraan)' },
    { id: 2, npsn: 'P9934726', namaSekolah: 'PKBM PASCA MARGA', alamatSekolah: 'Jl. KLK No.72 RT.02 RW.02RT 1RW 3, Desa Rancamulya, Kec. Sumedang Utara', kepalaSekolah: 'DEDEH KURAESIN', akreditasi: 'B', tahunAkreditasi: 2025, berakhirTahun: 2030, nomorSk: 'No SK: 602/BAN-PDM/SK/2025' },
    { id: 3, npsn: 'P9952581', namaSekolah: 'PKBM MULYASARI SEJATI', alamatSekolah: 'Dsn. Kadupugur Rt 1/Rw 6 Desa Mulyasari Kec. Sumedang Utara', kepalaSekolah: 'GRACY MEILANTA', akreditasi: 'B', tahunAkreditasi: 2024, berakhirTahun: 2029, nomorSk: 'No SK: 120/BAN-PDM/SK/2025' },
    { id: 4, npsn: 'P9999789', namaSekolah: 'PKBM AI-AMANAH', alamatSekolah: 'Jl. Angkrek Gg. Karyawan II No. 08 RT. 003 RW. 018, Kel. Situ, Kec. Sumedang Utara', kepalaSekolah: 'DEDI MUHAMMAD ISHAK', akreditasi: 'C', tahunAkreditasi: 2025, berakhirTahun: 2030, nomorSk: 'No SK: 602/BAN-PDM/SK/2025' },
    { id: 5, npsn: 'P9984783', namaSekolah: 'PKBM MENTARI MADANI', alamatSekolah: 'Perum Jatihurip Blok 9 No. 111 SumedangRT 4RW 14, Desa Jatihurip, Kec. Sumedang Utara', kepalaSekolah: 'YANA SATRIANA', akreditasi: 'C', tahunAkreditasi: 2025, berakhirTahun: 2030, nomorSk: 'No SK: 602/BAN-PDM/SK/2025' },
  ],
  pesertaDidik: [
    { id: 1, npsn: 'P2963449', namaSekolah: 'PKBM MEKAR BUANA', alamatSekolah: 'JL.Angkrek NO.9BRT 4RW 2, Kel.Kotakaler', wilKecamatan: 'Sumedang Utara', zonasiKelDesa: 'Kota Kaler Kebonjati', lakiLaki: 0, perempuan: 0, verval: 'Belum' },
    { id: 2, npsn: 'P9934726', namaSekolah: 'PKBM PASCA MARGA', alamatSekolah: 'Jl. KLK No.72 RT.02 RW.02RT 1RW 3, Desa Rancamulya', wilKecamatan: 'Sumedang Utara', zonasiKelDesa: 'Rancamulya Talun', lakiLaki: 0, perempuan: 0, verval: 'Belum' },
    { id: 3, npsn: 'P9952581', namaSekolah: 'PKBM MULYASARI SEJATI', alamatSekolah: 'Dsn. Kadupugur Rt 1/Rw 6 Desa Mulyasari', wilKecamatan: 'Sumedang Utara', zonasiKelDesa: 'Mulyasari Sirnamulya', lakiLaki: 2, perempuan: 3, verval: 'Sudah' },
    { id: 4, npsn: 'P9999789', namaSekolah: 'PKBM AI-AMANAH', alamatSekolah: 'Jl. Angkrek Gg. Karyawan II No. 08 RT. 003 RW. 018, Kel. Situ', wilKecamatan: 'Sumedang Utara', zonasiKelDesa: 'Situ Mekarjaya', lakiLaki: 0, perempuan: 0, verval: 'Belum' },
    { id: 5, npsn: 'P9984783', namaSekolah: 'PKBM MENTARI MADANI', alamatSekolah: 'Perum Jatihurip Blok 9 No. 111 SumedangRT 4RW 14 Desa Jatihurip', wilKecamatan: 'Sumedang Utara', zonasiKelDesa: 'Jatihurip Jatimulya', lakiLaki: 0, perempuan: 0, verval: 'Belum' },
    { id: 6, npsn: 'P9984784', namaSekolah: 'PKBM MENTARI KREATIF MANDIRI', alamatSekolah: 'Jl. Serma Muhtar NO 97 RT 1RW 7, Kel. Situ', wilKecamatan: 'Sumedang Utara', zonasiKelDesa: 'Margamukti Padasuka', lakiLaki: 4, perempuan: 2, verval: 'Sudah' },
  ],
  eRapor: [
    { id: 1, npsn: '10123456', namaLembaga: 'PKBM Bina Warga', skl: 60, sIsi: 60, sProses: 40, sPenilaian: 80, sPtk: 30, sSapras: 90, sPengelolaan: 50, sPembiayaan: 50, keterisian: 'LENGKAP' },
  ],
};

function loadOrSeed(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function nextId(arr) {
  return arr.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1;
}

const DB = {
  // ----- AKREDITASI -----
  getAkreditasi() { return loadOrSeed(STORAGE_KEYS.akreditasi, SEED.akreditasi); },
  saveAkreditasi(rows) { localStorage.setItem(STORAGE_KEYS.akreditasi, JSON.stringify(rows)); },
  addAkreditasi(row) {
    const rows = DB.getAkreditasi();
    row.id = nextId(rows);
    rows.push(row);
    DB.saveAkreditasi(rows);
  },
  updateAkreditasi(id, row) {
    const rows = DB.getAkreditasi().map(r => r.id === id ? { ...r, ...row, id } : r);
    DB.saveAkreditasi(rows);
  },
  deleteAkreditasi(id) {
    DB.saveAkreditasi(DB.getAkreditasi().filter(r => r.id !== id));
  },

  // ----- PESERTA DIDIK -----
  getPesertaDidik() { return loadOrSeed(STORAGE_KEYS.pesertaDidik, SEED.pesertaDidik); },
  savePesertaDidik(rows) { localStorage.setItem(STORAGE_KEYS.pesertaDidik, JSON.stringify(rows)); },
  addPesertaDidik(row) {
    const rows = DB.getPesertaDidik();
    row.id = nextId(rows);
    rows.push(row);
    DB.savePesertaDidik(rows);
  },
  updatePesertaDidik(id, row) {
    const rows = DB.getPesertaDidik().map(r => r.id === id ? { ...r, ...row, id } : r);
    DB.savePesertaDidik(rows);
  },
  deletePesertaDidik(id) {
    DB.savePesertaDidik(DB.getPesertaDidik().filter(r => r.id !== id));
  },

  // ----- E-RAPOR -----
  getERapor() { return loadOrSeed(STORAGE_KEYS.eRapor, SEED.eRapor); },
  saveERapor(rows) { localStorage.setItem(STORAGE_KEYS.eRapor, JSON.stringify(rows)); },
  addERapor(row) {
    const rows = DB.getERapor();
    row.id = nextId(rows);
    rows.push(row);
    DB.saveERapor(rows);
  },
  updateERapor(id, row) {
    const rows = DB.getERapor().map(r => r.id === id ? { ...r, ...row, id } : r);
    DB.saveERapor(rows);
  },
  deleteERapor(id) {
    DB.saveERapor(DB.getERapor().filter(r => r.id !== id));
  },

  // Reset all data to seed
  resetAll() {
    localStorage.removeItem(STORAGE_KEYS.akreditasi);
    localStorage.removeItem(STORAGE_KEYS.pesertaDidik);
    localStorage.removeItem(STORAGE_KEYS.eRapor);
  },
};
