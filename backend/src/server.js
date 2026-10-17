const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

app.get('/api/tickets', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, asunto, categoria, estado FROM tickets ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'No se pudo consultar los tickets' });
  }
});

app.listen(3000, () => console.log('API Backend corriendo en el puerto 3000'));
