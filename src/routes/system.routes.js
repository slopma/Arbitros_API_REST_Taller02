const express = require('express');
const router = express.Router();
const os = require('os');
const { SPRING_BOOT_API_URL } = require('../config/config');
const { listFiles } = require('../services/s3Service');

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
 *     description: Check if the system is running
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

/**
 * @swagger
 * /info:
 *   get:
 *     summary: Get container information
 *     tags: [System]
 *     description: Returns container ID and system information
 *     responses:
 *       200:
 *         description: Container information retrieved successfully
 */
router.get('/info', (req, res) => {
  res.json({
    containerId: os.hostname(),
    containerShortId: os.hostname().substring(0, 12),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    platform: os.platform(),
    architecture: os.arch(),
    uptime: process.uptime()
  });
});

/**
 * @swagger
 * /images:
 *   get:
 *     summary: List all S3 images
 *     tags: [System]
 *     description: Returns list of all images stored in S3 bucket with container info
 *     responses:
 *       200:
 *         description: Images list retrieved successfully
 */
router.get('/images', async (req, res) => {
  try {
    const images = await listFiles();
    
    res.json({
      containerId: os.hostname(),
      containerShortId: os.hostname().substring(0, 12),
      total: images.length,
      bucket: 'arbitros-images-sara',
      images: images,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error listing S3 images:', error);
    res.status(500).json({ 
      containerId: os.hostname(),
      error: 'Error al listar imágenes de S3',
      message: error.message 
    });
  }
});

module.exports = router;