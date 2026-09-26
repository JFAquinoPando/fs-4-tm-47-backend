const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, '../personajes.json');
const outputPath = path.resolve(__dirname, '../seed.sql');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

function escapeSql(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/'/g, "''");
}

let sql = '-- Seed para Cloudflare D1 (SQLite)\nDELETE FROM personajes;\nDELETE FROM sqlite_sequence WHERE name="personajes";\n';

for (const c of data) {
  const nombre = escapeSql(c.nombre);
  const alias = escapeSql(c.alias);
  const estatura = Number(c.estatura) || 0;
  const imagen = escapeSql(c.imagen);
  const especies = escapeSql(JSON.stringify(c.especies || []));
  const genero = escapeSql(c.genero);
  const edad = Number(c.edad) || 0;
  const vivo = c.vivo ? 1 : 0;
  const lugarNacimiento = escapeSql(c.lugarNacimiento);
  const residencia = escapeSql(c.residencia);

  sql += `INSERT INTO personajes (nombre, alias, estatura, imagen, especies, genero, edad, vivo, lugarNacimiento, residencia) VALUES ('${nombre}', '${alias}', ${estatura}, '${imagen}', '${especies}', '${genero}', ${edad}, ${vivo}, '${lugarNacimiento}', '${residencia}');\n`;
}

fs.writeFileSync(outputPath, sql, 'utf-8');
console.log(`seed.sql generado con éxito en: ${outputPath}`);
