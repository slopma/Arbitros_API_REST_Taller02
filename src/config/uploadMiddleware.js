// src/config/uploadMiddleware.js
const multer = require('multer');

// Configurar multer para almacenar archivos en memoria
const storage = multer.memoryStorage();

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  // Tipos MIME permitidos
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)'), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB
  },
});

module.exports = upload;