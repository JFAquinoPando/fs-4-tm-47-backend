class PersonajeD1 {
  // Convierte un registro de D1 SQLite al formato del esquema solicitado
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

  // Obtener todos los personajes desde Cloudflare D1
  static async findAll(db) {
    const { results } = await db.prepare('SELECT * FROM personajes ORDER BY id ASC').all();
    return results.map(this.#formatRow);
  }

  // Obtener un personaje por ID
  static async findById(db, id) {
    const row = await db.prepare('SELECT * FROM personajes WHERE id = ?').bind(id).first();
    return this.#formatRow(row);
  }

  // Crear un nuevo personaje en D1
  static async create(db, data) {
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

    const query = `
      INSERT INTO personajes (
        nombre, alias, estatura, imagen, especies, genero, edad, vivo, lugarNacimiento, residencia
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const res = await db.prepare(query).bind(
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
    ).run();

    return this.findById(db, res.meta.last_row_id);
  }

  // Actualizar un personaje existente en D1
  static async update(db, id, data) {
    const actual = await this.findById(db, id);
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

    const query = `
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

    await db.prepare(query).bind(
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
    ).run();

    return this.findById(db, id);
  }

  // Eliminar un personaje en D1
  static async delete(db, id) {
    const res = await db.prepare('DELETE FROM personajes WHERE id = ?').bind(id).run();
    return res.meta.changes > 0;
  }
}

module.exports = PersonajeD1;
