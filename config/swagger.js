// File: config/swagger.js
// Swagger configuration for API documentation

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Website Generator API',
      version: '2.0.0',
      description: `
        AI-powered website generation API that creates and deploys websites to IIS.
        
        ## Features
        - Generate complete websites using ChatGPT
        - Deploy to IIS wwwroot with subdomain access
        - Separate HTML, CSS, and JS file creation
        - Update and regenerate existing websites
        - Preview websites before deployment
        
        ## Deployment
        Websites are automatically deployed to: \`C:\\inetpub\\wwwroot\\{subdomain}\`
        Access deployed sites at: \`http://localhost/{subdomain}\`
      `,
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://your-production-domain.com',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'User Prompts',
        description: 'Operations related to user prompt management'
      },
      {
        name: 'Website Generation',
        description: 'AI-powered website creation and modification'
      },
      {
        name: 'Website Management',
        description: 'Website CRUD operations and deployment management'
      },
      {
        name: 'Website Deployment',
        description: 'IIS deployment and subdomain management'
      }
    ],
    components: {
      schemas: {
        UserPrompt: {
          type: 'object',
          required: ['name', 'UserPrompt', 'llmPrompt'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier'
            },
            name: {
              type: 'string',
              description: 'Prompt name'
            },
            UserPrompt: {
              type: 'string',
              description: 'User input prompt'
            },
            llmPrompt: {
              type: 'string',
              description: 'LLM formatted prompt'
            }
          }
        },
        Website: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier'
            },
            name: {
              type: 'string',
              description: 'Website name'
            },
            description: {
              type: 'string',
              description: 'Website description'
            },
            prompt: {
              type: 'string',
              description: 'Original generation prompt'
            },
            htmlCode: {
              type: 'string',
              description: 'HTML source code'
            },
            cssCode: {
              type: 'string',
              description: 'CSS source code'
            },
            jsCode: {
              type: 'string',
              description: 'JavaScript source code'
            },
            subdomain: {
              type: 'string',
              description: 'Subdomain name'
            },
            deployPath: {
              type: 'string',
              description: 'File system path where website is deployed'
            },
            isDeployed: {
              type: 'boolean',
              description: 'Deployment status'
            },
            url: {
              type: 'string',
              description: 'Accessible URL',
              example: 'http://localhost/designer-portfolio'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message'
            }
          }
        }
      }
    }
  },
  // apis: ['./routes.js', './src/controller/*.js'], // Path to the API docs
  apis: ['../src/routes.js', '../src/utils/swagger.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };