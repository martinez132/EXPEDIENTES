# EXPEDIENTES
Creación de una Api
EXPEDIENTES

API REST para gestionar Expedientes e Indicios con autenticación JWT y control de roles (técnico / coordinador).
Base de datos: SQL Server.

🧱 Stack

Node.js + TypeScript

Express

MSSQL (mssql)

JSON Web Tokens (jsonwebtoken)

Validación con zod

Documentación con Swagger UI (/docs)

📦 Requisitos

Node.js 18+

SQL Server (recomendado: habilitar TCP/IP y puerto 1433)

SSMS para ejecutar scripts SQL

⚙️ Configuración
1) Variables de entorno (.env)

Crea un archivo .env en la raíz del proyecto con:

PORT=3000

SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
# SQLSERVER_INSTANCE=           # ← no usar si defines puerto

SQLSERVER_DB=ExpedientesDB
SQLSERVER_USER=expedientes_user
SQLSERVER_PASSWORD=TuPasswordFuerte_2025!

JWT_SECRET=supersecreto
JWT_EXPIRES_IN=1d


Si usas instancia SQLEXPRESS en vez de puerto, cambia a:
SQLSERVER_HOST=localhost y SQLSERVER_INSTANCE=SQLEXPRESS (sin SQLSERVER_PORT) y asegúrate de que el SQL Browser esté iniciado.

2) Instalar dependencias
npm install

▶️ Scripts

En package.json:

"scripts": {
  "dev":   "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}


Desarrollo: npm run dev

Compilar: npm run build

Producción: npm start (ejecuta desde dist)

🗄️ Base de datos

En SSMS, ejecuta los scripts de la carpeta /scripts:

schema.sql → crea tablas

procedures.sql → crea/actualiza stored procedures

(opcional) seed.sql → datos de ejemplo

Si usas SQL Authentication, crea el login (solo desarrollo):

CREATE LOGIN expedientes_user WITH PASSWORD = 'TuPasswordFuerte_2025!';
USE ExpedientesDB;
CREATE USER expedientes_user FOR LOGIN expedientes_user;
EXEC sp_addrolemember 'db_owner', 'expedientes_user';


Asegúrate de tener habilitado SQL Server and Windows Authentication mode.

🔍 Health Check

Con el servidor corriendo:

Ping: GET http://localhost:3000/ → “🚀 API funcionando”

DB: GET http://localhost:3000/health/db → { ok: true, db: "ExpedientesDB", ... }

📖 Swagger

Abre la documentación en: http://localhost:3000/docs

Para probar endpoints protegidos, usa Authorize y pega: Bearer <tu_token> (luego de hacer login).

🔐 Flujo básico
1) Crear usuarios (seed)

POST /api/usuarios

{ "username": "tecnico1", "password": "123456", "rol": "tecnico" }

{ "username": "coord1", "password": "123456", "rol": "coordinador" }

2) Login (JWT)

POST /api/auth/login

{ "username": "tecnico1", "password": "123456" }


Respuesta

{ "token": "JWT...", "user": { "id": 1, "username": "tecnico1", "rol": "tecnico" } }


Copia el token → botón Authorize en Swagger → Bearer <token>.

3) Expedientes

Crear
POST /api/expedientes

{ "codigo": "EXP-001", "descripcion": "Caso A" }


Listar
GET /api/expedientes?page=1&pageSize=10

Detalle
GET /api/expedientes/1

Actualizar descripción
PUT /api/expedientes/1

{ "descripcion": "Descripción actualizada" }


Cambiar estado (coordinador)
PATCH /api/expedientes/1/estado

{ "estado": "aprobado", "justificacion": "OK" }


Activar/Desactivar
PATCH /api/expedientes/1/activo

{ "activo": false }

4) Indicios

Crear
POST /api/indicios/expedientes/1/indicios

{ "descripcion": "Muestra 1", "peso": 2.5 }


Listar por expediente
GET /api/indicios/expedientes/1/indicios

Actualizar
PUT /api/indicios/1

{ "descripcion": "Muestra 1 (editada)" }


Activar/Desactivar
PATCH /api/indicios/1/activo

{ "activo": true }

🧪 cURL rápido (opcional)
# Crear usuario
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"username":"tecnico1","password":"123456","rol":"tecnico"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"tecnico1","password":"123456"}'

🛠️ Troubleshooting

Timeout o “Failed to connect …”

Habilita TCP/IP en SQL Server Configuration Manager → Protocols for (SQLEXPRESS).

En IPAll, fija TCP Port = 1433 y deja vacío TCP Dynamic Ports.

Reinicia SQL Server (SQLEXPRESS).

En .env, usa SQLSERVER_PORT=1433 (sin SQLSERVER_INSTANCE).

“Login failed for user …”

Habilita SQL Server and Windows Authentication mode.

Crea el login/usuario y otorga db_owner en desarrollo.

400 Bad Request en Swagger

Asegúrate de enviar JSON válido y que el content-type sea application/json.

📁 Estructura
expedientes-api/
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ swagger.ts
│  ├─ config/env.ts
│  ├─ db/db.ts
│  ├─ auth/
│  ├─ controllers/
│  ├─ routes/
│  ├─ middlewares/
│  └─ models/
├─ scripts/
│  ├─ schema.sql
│  ├─ procedures.sql
│  └─ seed.sql
├─ .env.example
├─ tsconfig.json
├─ package.json
└─ README.md

📜 Licencia

MIT (o la que definas)