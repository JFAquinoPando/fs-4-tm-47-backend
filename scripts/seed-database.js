const fs = require('fs');
const path = require('path');
const { dbQuery, initDB } = require('../src/config/database');

async function seed() {
  await initDB();

  const jsonPath = path.resolve(__dirname, '../personajes.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('No se encontró el archivo personajes.json. Ejecuta primero fetch-characters.js');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Cargando ${data.length} personajes en SQLite...`);

  // Opcional: limpiar registros existentes antes de poblar
  await dbQuery.run('DELETE FROM personajes');
  await dbQuery.run('DELETE FROM sqlite_sequence WHERE name="personajes"');

  const insertSql = `
    INSERT INTO personajes (
      nombre, alias, estatura, imagen, especies, genero, edad, vivo, lugarNacimiento, residencia
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const c of data) {
    const especiesJson = JSON.stringify(Array.isArray(c.especies) ? c.especies : []);
    const vivoInt = c.vivo ? 1 : 0;

    await dbQuery.run(insertSql, [
      c.nombre || '',
      c.alias || '',
      Number(c.estatura) || 0,
      c.imagen || '',
      especiesJson,
      c.genero || '',
      Number(c.edad) || 0,
      vivoInt,
      c.lugarNacimiento || '',
      c.residencia || ''
    ]);
  }

  const count = await dbQuery.get('SELECT COUNT(*) as total FROM personajes');
  console.log(`Base de datos poblada exitosamente con ${count.total} registros.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error al poblar la base de datos:', err);
  process.exit(1);
});
