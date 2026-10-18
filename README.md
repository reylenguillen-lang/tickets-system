# Sistema de Tickets de Soporte Interno

Proyecto Integrador · Arquitectura de Microservicios (AMI026) · UPES · Ciclo 02/2026

## Componentes

| Contenedor | Imagen base | Puerto | Expuesto al host |
| --- | --- | --- | --- |
| tickets-frontend | nginx:alpine | 80 | Sí (80) |
| backend-container | node:20-alpine | 3000 | No |
| usuarios-service | node:20-alpine | 3001 | No |
| db-container | postgres:16 | 5432 | No |

Todos se conectan por la red `tickets-net`. Los datos se guardan en el volumen `postgres_data`.

## Ejecución

1. Copiar `.env.example` como `.env` y poner la clave real.
2. Construir y ejecutar los contenedores en este orden: db-container, backend-container, usuarios-service y tickets-frontend.
3. Abrir `http://localhost`.
