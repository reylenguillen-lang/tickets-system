import { useEffect, useState } from 'react';

const ESTADOS = ['PENDIENTE', 'EN_ATENCION', 'RESUELTO', 'CERRADO'];
const CATEGORIAS = ['Redes', 'Hardware', 'Software', 'Accesos'];

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ asunto: '', descripcion: '', categoria: 'Redes', empleado_id: '' });
  const [mensaje, setMensaje] = useState('');

  const cargarTickets = () => {
    fetch('/api/tickets')
      .then(r => r.json())
      .then(setTickets)
      .catch(() => setMensaje('No se pudo cargar la lista de tickets.'));
  };

  useEffect(() => {
    cargarTickets();
    fetch('/api/usuarios')
      .then(r => r.json())
      .then(setUsuarios)
      .catch(() => setMensaje('No se pudo cargar la lista de usuarios.'));
  }, []);

  const registrar = async () => {
    const r = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, empleado_id: Number(form.empleado_id) }),
    });
    const data = await r.json();
    if (!r.ok) { setMensaje(data.error); return; }
    setMensaje(`Ticket #${data.id} registrado.`);
    setForm({ ...form, asunto: '', descripcion: '' });
    cargarTickets();
  };

  const cambiarEstado = async (id, estado) => {
    await fetch(`/api/tickets/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    });
    cargarTickets();
  };

  const empleados = usuarios.filter(u => u.rol === 'EMPLEADO');

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 760, margin: '40px auto', padding: '0 16px' }}>
      <h1>Sistema de Tickets de Soporte Interno</h1>

      <h2>Registrar ticket</h2>
      <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
        <input placeholder="Asunto" value={form.asunto} onChange={e => setForm({ ...form, asunto: e.target.value })} />
        <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
        <select value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
          {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={form.empleado_id} onChange={e => setForm({ ...form, empleado_id: e.target.value })}>
          <option value="">Seleccione el empleado</option>
          {empleados.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
        </select>
        <button onClick={registrar}>Registrar ticket</button>
      </div>
      {mensaje && <p>{mensaje}</p>}

      <h2>Tickets registrados</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead><tr><th>ID</th><th>Asunto</th><th>Categoría</th><th>Empleado</th><th>Estado</th></tr></thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td><td>{t.asunto}</td><td>{t.categoria}</td><td>{t.empleado}</td>
              <td>
                <select value={t.estado} onChange={e => cambiarEstado(t.id, e.target.value)}>
                  {ESTADOS.map(s => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
