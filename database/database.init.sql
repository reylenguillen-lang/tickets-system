CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(120) NOT NULL UNIQUE,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('EMPLEADO','SOPORTE'))
);
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  asunto VARCHAR(150) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(50) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  empleado_id INTEGER NOT NULL REFERENCES usuarios(id),
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);
INSERT INTO usuarios (nombre, correo, rol) VALUES
  ('Empleado de Prueba','empleado@empresa.local','EMPLEADO'),
  ('Tecnico de Soporte','soporte@empresa.local','SOPORTE');
INSERT INTO tickets (asunto, descripcion, categoria, estado, empleado_id) VALUES
  ('Falla de red','Sin conexion en contabilidad','Redes','PENDIENTE',1);
