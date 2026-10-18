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
pool.on('error', (err) => console.error('Conexión con la base de datos perdida:', err.message));

const ESTADOS = ['PENDIENTE', 'EN_ATENCION', 'RESUELTO', 'CERRADO'];

app.get('/api/tickets', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.id, t.asunto, t.categoria, t.estado, u.nombre AS empleado
       FROM tickets t JOIN usuarios u ON u.id = t.empleado_id ORDER BY t.id`
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'No se pudo consultar los tickets' });
  }
});

app.post('/api/tickets', async (req, res) => {
  const { asunto, descripcion, categoria, empleado_id } = req.body;
  if (!asunto || !categoria || !empleado_id) {
    return res.status(400).json({ error: 'Asunto, categoría y empleado son obligatorios' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO tickets (asunto, descripcion, categoria, empleado_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [asunto, descripcion || null, categoria, empleado_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23503') return res.status(400).json({ error: 'El empleado no existe' });
    console.error(err.message);
    res.status(500).json({ error: 'No se pudo registrar el ticket' });
  }
});

app.patch('/api/tickets/:id/estado', async (req, res) => {
  const { estado } = req.body;
  if (!ESTADOS.includes(estado)) {
    return res.status(400).json({ error: `Estado inválido. Use: ${ESTADOS.join(', ')}` });
  }
  try {
    const { rows } = await pool.query(
      'UPDATE tickets SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Ticket no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'No se pudo actualizar el ticket' });
  }
});

app.listen(3000, () => console.log('Servicio de tickets corriendo en el puerto 3000'));
