const fs = require('fs');
const path = require('path');

async function descargarPersonajes() {
  const characters = [];
  let url = 'https://api.attackontitanapi.com/characters';

  console.log('Descargando personajes desde la API...');

  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error en la petición: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    characters.push(...data.results);
    url = data.info?.next_page || null;
  }

  console.log(`Total de personajes obtenidos: ${characters.length}`);

  const resultado = characters.map((c) => {
    let estatura = 0;
    if (typeof c.height === 'number') {
      estatura = c.height;
    } else if (typeof c.height === 'string') {
      const match = c.height.match(/\d+(\.\d+)?/);
      if (match) estatura = parseFloat(match[0]);
    }

    let edad = 0;
    if (typeof c.age === 'number') {
      edad = c.age;
    } else if (typeof c.age === 'string') {
      const parsed = parseInt(c.age, 10);
      edad = isNaN(parsed) ? 0 : parsed;
    }

    return {
      nombre: c.name || '',
      alias: Array.isArray(c.alias) ? c.alias.join(', ') : (c.alias || ''),
      estatura,
      imagen: c.img || '',
      especies: Array.isArray(c.species) ? c.species : [],
      genero: c.gender || '',
      edad,
      vivo: c.status === 'Alive',
      lugarNacimiento: c.birthplace || '',
      residencia: c.residence || ''
    };
  });

  const outputPath = path.join(__dirname, '..', 'personajes.json');
  fs.writeFileSync(outputPath, JSON.stringify(resultado, null, 2), 'utf-8');
  console.log(`Archivo generado con éxito en: ${outputPath}`);
}

descargarPersonajes().catch((err) => {
  console.error('Error al descargar personajes:', err);
  process.exit(1);
});
