// File: app.js or server.js
// Main application setup with Swagger documentation

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes.js';
import { specs, swaggerUi } from './config/swagger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for large HTML content
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "AI Website Generator API Documentation",
    swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true
    }
}));

// Routes
app.use('/', routes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'AI Website Generator API',
        version: '2.0.0'
    });
});

// Root endpoint with API information
app.get('/', (req, res) => {
    res.json({
        message: 'AI Website Generator API',
        version: '2.0.0',
        documentation: '/api-docs',
        endpoints: {
            prompts: '/api/v2/user',
            websites: '/api/v2/websites',
            preview: '/api/v2/websites/preview'
        },
        features: [
            'AI-powered website generation',
            'IIS deployment with subdomain support',
            'Separate HTML, CSS, JS file creation',
            'Website updates and regeneration',
            'Preview functionality'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
// Catch-all handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    availableRoutes: [
      'GET /api-docs - API Documentation',
      'GET /api/v2/user - User Prompts',
      'POST /api/v2/websites - Create Website',
      'GET /api/v2/websites - List Websites'
    ]
  });
});


app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    console.log(`🌐 IIS Path: ${process.env.IIS_WWWROOT_PATH || 'C:\\inetpub\\wwwroot'}`);
});

export default app;