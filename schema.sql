-- Esquema para Cloudflare D1 (SQLite)
CREATE TABLE IF NOT EXISTS personajes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  alias TEXT,
  estatura REAL DEFAULT 0,
  imagen TEXT,
  especies TEXT,
  genero TEXT,
  edad INTEGER DEFAULT 0,
  vivo INTEGER DEFAULT 1,
  lugarNacimiento TEXT,
  residencia TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
