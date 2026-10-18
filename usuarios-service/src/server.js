const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});
pool.on('error', (err) => console.error('Conexión con la base de datos perdida:', err.message));

app.get('/api/usuarios', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, nombre, rol FROM usuarios ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'No se pudo consultar los usuarios' });
  }
});

app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, nombre, rol FROM usuarios WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'No se pudo consultar el usuario' });
  }
});

app.listen(3001, () => console.log('Servicio de usuarios corriendo en el puerto 3001'));
