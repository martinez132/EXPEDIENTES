import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

export function setupSwagger(app: Express) {
  const swaggerDefinition = {
    openapi: '3.0.3',
    info: {
      title: 'API Expedientes',
      version: '1.0.0',
      description:
        'API para gestión de Expedientes e Indicios con roles (técnico/coordinador).',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local' }],
    tags: [
      { name: 'Auth' },
      { name: 'Expedientes' },
      { name: 'Indicios' },
      { name: 'Usuarios' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        LoginBody: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'tecnico1' },
            password: { type: 'string', example: '123456' },
          },
        },
        UsuarioCrear: {
          type: 'object',
          required: ['username', 'password', 'rol'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            rol: { type: 'string', enum: ['tecnico', 'coordinador'] },
          },
        },
        ExpedienteCrear: {
          type: 'object',
          required: ['codigo', 'descripcion'],
          properties: {
            codigo: { type: 'string', example: 'EXP-001' },
            descripcion: { type: 'string', example: 'Caso A' },
          },
        },
        ExpedienteActualizar: {
          type: 'object',
          required: ['descripcion'],
          properties: {
            descripcion: { type: 'string', example: 'Descripción actualizada' },
          },
        },
        ExpedienteCambiarEstado: {
          type: 'object',
          required: ['estado'],
          properties: {
            estado: {
              type: 'string',
              enum: ['pendiente', 'aprobado', 'rechazado'],
              example: 'aprobado',
            },
            justificacion: { type: 'string', nullable: true },
          },
        },
        ActivarDesactivar: {
          type: 'object',
          required: ['activo'],
          properties: { activo: { type: 'boolean', example: true } },
        },
        IndicioCrear: {
          type: 'object',
          required: ['descripcion'],
          properties: {
            descripcion: { type: 'string', example: 'Muestra 1' },
            color: { type: 'string', nullable: true },
            tamano: { type: 'string', nullable: true },
            peso: { type: 'number', nullable: true, minimum: 0 },
            ubicacion: { type: 'string', nullable: true },
          },
        },
        IndicioActualizar: {
          type: 'object',
          required: ['descripcion'],
          properties: {
            descripcion: { type: 'string' },
            color: { type: 'string', nullable: true },
            tamano: { type: 'string', nullable: true },
            peso: { type: 'number', nullable: true, minimum: 0 },
            ubicacion: { type: 'string', nullable: true },
          },
        },
      },
    },
    paths: {
      // ---------- AUTH ----------
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login y obtención de JWT',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } } },
          },
          responses: {
            '200': { description: 'OK (token y user)' },
            '401': { description: 'Credenciales inválidas' },
          },
        },
      },

      // ---------- USUARIOS ----------
      '/api/usuarios': {
        post: {
          tags: ['Usuarios'],
          summary: 'Crear usuario (seed/alta inicial)',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioCrear' } } },
          },
          responses: { '201': { description: 'Creado' } },
        },
      },

      // ---------- EXPEDIENTES ----------
      '/api/expedientes': {
        get: {
          tags: ['Expedientes'],
          summary: 'Listar expedientes',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'pageSize', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'codigo', in: 'query', schema: { type: 'string' } },
            { name: 'estado', in: 'query', schema: { type: 'string', enum: ['pendiente','aprobado','rechazado'] } },
          ],
          responses: { '200': { description: 'OK' }, '401': { description: 'No autorizado' } },
        },
        post: {
          tags: ['Expedientes'],
          summary: 'Crear expediente (rol técnico/coordinador)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ExpedienteCrear' } } },
          },
          responses: { '201': { description: 'Creado' }, '401': { description: 'No autorizado' } },
        },
      },

      '/api/expedientes/{id}': {
        get: {
          tags: ['Expedientes'],
          summary: 'Obtener expediente por id',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'OK' }, '404': { description: 'No encontrado' } },
        },
        put: {
          tags: ['Expedientes'],
          summary: 'Actualizar expediente (pertenencia válida)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ExpedienteActualizar' } } },
          },
          responses: { '200': { description: 'Actualizado' }, '403': { description: 'Sin permisos' } },
        },
      },

      '/api/expedientes/{id}/estado': {
        patch: {
          tags: ['Expedientes'],
          summary: 'Cambiar estado (solo coordinador)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ExpedienteCambiarEstado' } } },
          },
          responses: { '200': { description: 'Actualizado' }, '403': { description: 'Sin permisos' } },
        },
      },

      '/api/expedientes/{id}/activo': {
        patch: {
          tags: ['Expedientes'],
          summary: 'Activar/Desactivar expediente',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ActivarDesactivar' } } },
          },
          responses: { '200': { description: 'Actualizado' } },
        },
      },

      // ---------- INDICIOS ----------
      '/api/indicios/expedientes/{id}/indicios': {
        get: {
          tags: ['Indicios'],
          summary: 'Listar indicios por expediente',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'OK' } },
        },
        post: {
          tags: ['Indicios'],
          summary: 'Crear indicio',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/IndicioCrear' } } },
          },
          responses: { '201': { description: 'Creado' } },
        },
      },

      '/api/indicios/{id}': {
        put: {
          tags: ['Indicios'],
          summary: 'Actualizar indicio',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/IndicioActualizar' } } },
          },
          responses: { '200': { description: 'Actualizado' } },
        },
      },

      '/api/indicios/{id}/activo': {
        patch: {
          tags: ['Indicios'],
          summary: 'Activar/Desactivar indicio',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ActivarDesactivar' } } },
          },
          responses: { '200': { description: 'Actualizado' } },
        },
      },
    },
  };

  const options = {
    swaggerDefinition,
    apis: [], // si luego quieres usar JSDoc, aquí apuntas a src/**/*.ts
  };

  const swaggerSpec = swaggerJSDoc(options);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
}
