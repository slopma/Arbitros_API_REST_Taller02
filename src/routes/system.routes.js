const express = require('express');
const router = express.Router();
const { SPRING_BOOT_API_URL } = require('../config/config');

/**
 * @swagger
 * tags:
 *   name: System
 *   description: Endpoints del sistema
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get system check 
 *     tags: [System]
 *     description: Chech if the system is running
 *     responses:
 *       200:
 *         description: System running
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *       404:
 *         description: Inactive System
 *       500:
 *         description: Internal server error
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    springBootApi: SPRING_BOOT_API_URL,
  });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get system info 
 *     tags: [System]
 *     description: See info of the system
 *     responses:
 *       200:
 *         description: System basic information
 *       404:
 *         description: Inactive System
 *       500:
 *         description: Internal server error
 */
router.get('/', (req, res) => {
  res.json({
    message: 'API Express de Árbitros',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

module.exports = router;
