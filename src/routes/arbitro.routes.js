const express = require('express');
const router = express.Router();
const controller = require('../controllers/arbitro.controller');

/**
 * @swagger
 * tags:
 *   name: Arbitros
 *   description: Operaciones CRUD sobre árbitros
 */

/**
 * @swagger
 * /arbitros:
 *   get:
 *     summary: Get all arbitros
 *     tags: [Arbitros]
 *     description: Retrieve a list of all arbitros from the database
 *     responses:
 *       200:
 *         description: List of arbitros retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Arbitro'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /arbitros/search:
 *   get:
 *     summary: Search arbitro by username
 *     tags: [Arbitros]
 *     description: Find an arbitro by their username/email
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username or email to search for
 *         example: juan.perez@example.com
 *     responses:
 *       200:
 *         description: Arbitro found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Arbitro'
 *       400:
 *         description: Username parameter is required
 *       404:
 *         description: Arbitro not found
 *       500:
 *         description: Internal server error
 */
router.get('/search', controller.searchByUsername);

/**
 * @swagger
 * /arbitros/cedula/{cedula}:
 *   get:
 *     summary: Get arbitro by cedula
 *     tags: [Arbitros]
 *     description: Find an arbitro by their identification number (cedula)
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *         description: Identification number (cedula)
 *         example: "1234567890"
 *     responses:
 *       200:
 *         description: Arbitro found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Arbitro'
 *       404:
 *         description: Arbitro not found
 *       500:
 *         description: Internal server error
 */
router.get('/cedula/:cedula', controller.getByCedula);

/**
 * @swagger
 * /arbitros/{id}:
 *   get:
 *     summary: Get arbitro by ID
 *     tags: [Arbitros]
 *     description: Retrieve a specific arbitro by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Arbitro ID
 *     responses:
 *       200:
 *         description: Arbitro found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Arbitro'
 *       404:
 *         description: Arbitro not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /arbitros:
 *   post:
 *     summary: Create new arbitro
 *     tags: [Arbitros]
 *     description: Create a new arbitro in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Arbitro'
 *           example:
 *             nombre: "Nicolas Torres"
 *             cedula: "1234567890"
 *             username: "nico.34@example.com"
 *             telefono: "+57 300 123 4567"
 *             experiencia: "Profesional"
 *     responses:
 *       201:
 *         description: Arbitro created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Arbitro'
 *       400:
 *         description: Bad request - Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', controller.create);

/**
 * @swagger
 * /arbitros/{id}:
 *   put:
 *     summary: Update arbitro
 *     tags: [Arbitros]
 *     description: Update an existing arbitro's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Arbitro ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Arbitro'
 *     responses:
 *       200:
 *         description: Arbitro updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Arbitro'
 *       404:
 *         description: Arbitro not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /arbitros/{id}:
 *   delete:
 *     summary: Delete arbitro
 *     tags: [Arbitros]
 *     description: Delete an arbitro from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Arbitro ID
 *     responses:
 *       204:
 *         description: Arbitro deleted successfully
 *       404:
 *         description: Arbitro not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', controller.remove);

module.exports = router;