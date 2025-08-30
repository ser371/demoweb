// File: routes.js (in your project root or wherever your routes file is)
import { Router } from "express";
import { 
    listprompt, 
    addprompt, 
    editprompt, 
    removeprompt,
    createweb,
    updateweb,
    listweb,
    getweb,
    removeweb,
    regenerateweb,
    previewweb,
    deployweb
} from "./controller/userPromptController.js"; // Adjust path based on your structure

const router = Router();

// ===== USER PROMPTS ROUTES =====

/**
 * @swagger
 * /api/v2/user:
 *   get:
 *     summary: Get all user prompts
 *     description: Returns a list of all user prompts from the database.
 *     tags: [User Prompts]
 *     responses:
 *       200:
 *         description: List of user prompts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/api/v2/user", listprompt);

/**
 * @swagger
 * /api/v2/user:
 *   post:
 *     summary: Create a new user prompt
 *     description: Adds a new user prompt to the database.
 *     tags: [User Prompts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - UserPrompt
 *               - llmPrompt
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Portfolio Generator"
 *               UserPrompt:
 *                 type: string
 *                 example: "Create a modern portfolio website"
 *               llmPrompt:
 *                 type: string
 *                 example: "Generate HTML/CSS for a responsive portfolio"
 *     responses:
 *       200:
 *         description: User prompt created successfully
 *       500:
 *         description: Server error
 */
router.post("/api/v2/user", addprompt);

/**
 * @swagger
 * /api/v2/user/{id}:
 *   put:
 *     summary: Update a user prompt
 *     description: Updates the user prompt with the specified ID.
 *     tags: [User Prompts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user prompt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               UserPrompt:
 *                 type: string
 *               llmPrompt:
 *                 type: string
 *     responses:
 *       200:
 *         description: User prompt updated
 *       500:
 *         description: Server error
 */
router.put("/api/v2/user/:id", editprompt);

/**
 * @swagger
 * /api/v2/user/{id}:
 *   delete:
 *     summary: Delete a user prompt
 *     description: Deletes the user prompt with the specified ID.
 *     tags: [User Prompts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user prompt
 *     responses:
 *       200:
 *         description: User prompt deleted
 *       500:
 *         description: Server error
 */
router.delete("/api/v2/user/:id", removeprompt);

// ===== WEBSITE GENERATION ROUTES =====

/**
 * @swagger
 * /api/v2/websites:
 *   post:
 *     summary: Create and deploy a new website
 *     description: Generates a complete website using AI and deploys it to IIS wwwroot.
 *     tags: [Website Generation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *               - websiteName
 *               - subdomain
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "Create a modern portfolio website for a graphic designer"
 *               websiteName:
 *                 type: string
 *                 example: "Designer Portfolio"
 *               description:
 *                 type: string
 *                 example: "Modern portfolio for graphic designer"
 *               subdomain:
 *                 type: string
 *                 example: "designer-portfolio"
 *     responses:
 *       200:
 *         description: Website created and deployed
 *       500:
 *         description: Server error
 */
router.post("/api/v2/websites", createweb);

/**
 * @swagger
 * /api/v2/websites/{id}:
 *   put:
 *     summary: Update existing website
 *     description: Updates website and redeploys to IIS.
 *     tags: [Website Generation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *               websiteName:
 *                 type: string
 *               description:
 *                 type: string
 *               modifications:
 *                 type: string
 *     responses:
 *       200:
 *         description: Website updated successfully
 *       404:
 *         description: Website not found
 */
router.put("/api/v2/websites/:id", updateweb);

/**
 * @swagger
 * /api/v2/websites:
 *   get:
 *     summary: Get all websites
 *     description: Returns list of all generated websites.
 *     tags: [Website Management]
 *     responses:
 *       200:
 *         description: List of websites
 */
router.get("/api/v2/websites", listweb);

/**
 * @swagger
 * /api/v2/websites/{id}:
 *   get:
 *     summary: Get specific website
 *     description: Returns complete website data including code.
 *     tags: [Website Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Website details
 *       404:
 *         description: Website not found
 */
router.get("/api/v2/websites/:id", getweb);

/**
 * @swagger
 * /api/v2/websites/{id}:
 *   delete:
 *     summary: Delete and undeploy website
 *     description: Removes website from database and IIS.
 *     tags: [Website Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Website deleted successfully
 */
router.delete("/api/v2/websites/:id", removeweb);

/**
 * @swagger
 * /api/v2/websites/preview:
 *   post:
 *     summary: Preview website without deployment
 *     description: Generates website code for preview only.
 *     tags: [Website Generation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "Create a restaurant website with menu"
 *     responses:
 *       200:
 *         description: Preview generated
 */
router.post("/api/v2/websites/preview", previewweb);

/**
 * @swagger
 * /api/v2/websites/{id}/regenerate:
 *   post:
 *     summary: Regenerate website with different style
 *     description: Recreates website with new design approach.
 *     tags: [Website Generation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               style:
 *                 type: string
 *                 example: "minimalist design with light colors"
 *               approach:
 *                 type: string
 *                 example: "single page application"
 *     responses:
 *       200:
 *         description: Website regenerated successfully
 */
router.post("/api/v2/websites/:id/regenerate", regenerateweb);

/**
 * @swagger
 * /api/v2/websites/{id}/deploy:
 *   post:
 *     summary: Deploy to new subdomain
 *     description: Deploys existing website to new subdomain.
 *     tags: [Website Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newSubdomain
 *             properties:
 *               newSubdomain:
 *                 type: string
 *                 example: "portfolio-v2"
 *     responses:
 *       200:
 *         description: Deployed successfully
 */
router.post("/api/v2/websites/:id/deploy", deployweb);

export default router;