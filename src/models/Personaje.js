const { dbQuery } = require('../config/database');

class Personaje {
  // Convierte un registro de la base de datos al formato del esquema solicitado
  static #formatRow(row) {
    if (!row) return null;

    let especies = [];
    if (typeof row.especies === 'string') {
      try {
        especies = JSON.parse(row.especies);
      } catch {
        especies = row.especies ? [row.especies] : [];
      }
    } else if (Array.isArray(row.especies)) {
      especies = row.especies;
    }

    return {
      id: row.id,
      nombre: row.nombre,
      alias: row.alias || '',
      estatura: Number(row.estatura) || 0,
      imagen: row.imagen || '',
      especies,
      genero: row.genero || '',
      edad: Number(row.edad) || 0,
      vivo: Boolean(row.vivo),
      lugarNacimiento: row.lugarNacimiento || '',
      residencia: row.residencia || ''
    };
  }

  // Obtener todos los personajes
  static async findAll() {
    const rows = await dbQuery.all('SELECT * FROM personajes ORDER BY id ASC');
    return rows.map(this.#formatRow);
  }

  // Obtener un personaje por su ID
  static async findById(id) {
    const row = await dbQuery.get('SELECT * FROM personajes WHERE id = ?', [id]);
    return this.#formatRow(row);
  }

  // Crear un nuevo personaje
  static async create(data) {
    const {
      nombre,
      alias = '',
      estatura = 0,
      imagen = '',
      especies = [],
      genero = '',
      edad = 0,
      vivo = true,
      lugarNacimiento = '',
      residencia = ''
    } = data;

    const especiesJson = JSON.stringify(Array.isArray(especies) ? especies : [especies]);
    const vivoInt = vivo ? 1 : 0;

    const sql = `
      INSERT INTO personajes (
        nombre, alias, estatura, imagen, especies, genero, edad, vivo, lugarNacimiento, residencia
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await dbQuery.run(sql, [
      nombre,
      alias,
      Number(estatura) || 0,
      imagen,
      especiesJson,
      genero,
      Number(edad) || 0,
      vivoInt,
      lugarNacimiento,
      residencia
    ]);

    return this.findById(result.lastID);
  }

  // Actualizar un personaje existente
  static async update(id, data) {
    const actual = await this.findById(id);
    if (!actual) return null;

    const {
      nombre = actual.nombre,
      alias = actual.alias,
      estatura = actual.estatura,
      imagen = actual.imagen,
      especies = actual.especies,
      genero = actual.genero,
      edad = actual.edad,
      vivo = actual.vivo,
      lugarNacimiento = actual.lugarNacimiento,
      residencia = actual.residencia
    } = data;

    const especiesJson = JSON.stringify(Array.isArray(especies) ? especies : [especies]);
    const vivoInt = vivo ? 1 : 0;

    const sql = `
      UPDATE personajes SET
        nombre = ?,
        alias = ?,
        estatura = ?,
        imagen = ?,
        especies = ?,
        genero = ?,
        edad = ?,
        vivo = ?,
        lugarNacimiento = ?,
        residencia = ?
      WHERE id = ?
    `;

    await dbQuery.run(sql, [
      nombre,
      alias,
      Number(estatura) || 0,
      imagen,
      especiesJson,
      genero,
      Number(edad) || 0,
      vivoInt,
      lugarNacimiento,
      residencia,
      id
    ]);

    return this.findById(id);
  }

  // Eliminar un personaje por ID
  static async delete(id) {
    const result = await dbQuery.run('DELETE FROM personajes WHERE id = ?', [id]);
    return result.changes > 0;
  }
}

module.exports = Personaje;
