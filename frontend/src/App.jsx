import { useEffect, useState } from 'react';

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/tickets')
      .then(r => r.json())
      .then(setTickets)
      .catch(() => setError('No se pudo cargar la lista de tickets.'));
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 700, margin: '40px auto' }}>
      <h1>Sistema de Tickets de Soporte Interno</h1>
      <p>Módulo Frontend de React operando en contenedor Nginx.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead><tr><th>ID</th><th>Asunto</th><th>Categoría</th><th>Estado</th></tr></thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t.id}><td>{t.id}</td><td>{t.asunto}</td><td>{t.categoria}</td><td>{t.estado}</td></tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
