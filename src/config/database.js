const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../base_datos.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite en:', dbPath);
  }
});

// Promisificación de métodos habituales de sqlite3
const dbQuery = {
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
};

// Inicialización de la tabla personajes
function initDB() {
  const sql = `
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
    )
  `;
  return dbQuery.run(sql);
}

// Ejecutamos la creación de la tabla de forma automática
initDB().catch((err) => {
  console.error('Error al inicializar la tabla personajes:', err.message);
});

module.exports = {
  db,
  dbQuery,
  initDB
};
