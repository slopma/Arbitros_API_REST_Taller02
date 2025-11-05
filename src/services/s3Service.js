// src/services/s3Service.js
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');
const path = require('path');

// Configurar cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN // Importante para AWS Academy
  }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

/**
 * Subir archivo a S3
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {string} originalName - Nombre original del archivo
 * @param {string} mimetype - Tipo MIME del archivo
 * @returns {Promise<string>} - URL pública del archivo
 */
const uploadFile = async (fileBuffer, originalName, mimetype) => {
  try {
    // Generar nombre único para el archivo
    const fileExtension = path.extname(originalName);
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Retornar URL pública
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    return fileUrl;
  } catch (error) {
    console.error('Error al subir archivo a S3:', error);
    throw new Error('Error al subir archivo');
  }
};

/**
 * Eliminar archivo de S3
 * @param {string} fileUrl - URL del archivo a eliminar
 * @returns {Promise<boolean>}
 */
const deleteFile = async (fileUrl) => {
  try {
    // Extraer el nombre del archivo de la URL
    const fileName = fileUrl.split('/').pop();

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);

    return true;
  } catch (error) {
    console.error('Error al eliminar archivo de S3:', error);
    throw new Error('Error al eliminar archivo');
  }
};

/**
 * Listar todos los archivos en el bucket S3
 * @returns {Promise<Array>} - Array de objetos con información de archivos
 */
const listFiles = async () => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });

    const response = await s3Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      return [];
    }

    // Mapear los archivos con información útil
    const files = response.Contents.map(file => ({
      key: file.Key,
      url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
      size: file.Size,
      lastModified: file.LastModified,
      sizeKB: (file.Size / 1024).toFixed(2)
    }));

    return files;
  } catch (error) {
    console.error('Error al listar archivos de S3:', error);
    throw new Error('Error al listar archivos de S3');
  }
};

/**
 * Obtener URL pre-firmada (para archivos privados, opcional)
 * @param {string} fileName - Nombre del archivo en S3
 * @param {number} expiresIn - Tiempo de expiración en segundos (default: 3600)
 * @returns {Promise<string>}
 */
const getPresignedUrl = async (fileName, expiresIn = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error al generar URL pre-firmada:', error);
    throw new Error('Error al generar URL');
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  getPresignedUrl,
  listFiles,
  s3Client
};