const apiClient = require('../services/springClient');
const { uploadFile, deleteFile } = require('../services/s3Service');

const handleError = (error, res) => {
  console.error('API Error:', error.message);
  if (error.response) {
    return res.status(error.response.status).json({
      error: error.response.data || 'Error desde API Spring Boot',
      status: error.response.status,
    });
  }
  return res.status(500).json({ error: 'Internal Server Error', message: error.message });
};

exports.getAll = async (req, res) => {
  console.log(apiClient);
  try {
    const { data } = await apiClient.get('');
    res.json(data);
  } catch (e) {
    handleError(e, res);
  }
};

exports.getById = async (req, res) => {
  try {
    const { data } = await apiClient.get(`/${req.params.id}`);
    res.json(data);
  } catch (e) {
    handleError(e, res);
  }
};

exports.create = async (req, res) => {
  try {
    const arbitro = req.body;
    if (!arbitro.nombre || !arbitro.cedula || !arbitro.username)
      return res.status(400).json({ error: 'Nombre, cedula y username son obligatorios' });

    const { data } = await apiClient.post('', arbitro);
    res.status(201).json(data);
  } catch (e) {
    handleError(e, res);
  }
};

exports.update = async (req, res) => {
  try {
    const { data } = await apiClient.put(`/${req.params.id}`, req.body);
    res.json(data);
  } catch (e) {
    handleError(e, res);
  }
};

exports.remove = async (req, res) => {
  try {
    await apiClient.delete(`/${req.params.id}`);
    res.status(204).send();
  } catch (e) {
    handleError(e, res);
  }
};

exports.getByCedula = async (req, res) => {
  try {
    const { data } = await apiClient.get(`/cedula/${req.params.cedula}`);
    res.json(data);
  } catch (e) {
    handleError(e, res);
  }
};

exports.searchByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: 'Se requiere el parámetro username' });

    const { data } = await apiClient.get('/search', { params: { username } });
    res.json(data);
  } catch (e) {
    handleError(e, res);
  }
};

// ========== NUEVAS FUNCIONES PARA IMÁGENES S3 ==========

/**
 * Subir imagen de árbitro
 * POST /arbitros/:id/imagen
 */
exports.uploadImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que se haya subido un archivo
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha proporcionado ninguna imagen' });
    }

    // Verificar que el árbitro existe
    const { data: arbitro } = await apiClient.get(`/${id}`);
    if (!arbitro) {
      return res.status(404).json({ error: 'Árbitro no encontrado' });
    }

    // Si el árbitro ya tiene una imagen, eliminarla de S3
    if (arbitro.imagenUrl) {
      try {
        await deleteFile(arbitro.imagenUrl);
      } catch (error) {
        console.error('Error al eliminar imagen anterior:', error);
        // Continuar aunque falle la eliminación
      }
    }

    // Subir nueva imagen a S3
    const imageUrl = await uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Actualizar el árbitro con la nueva URL de imagen
    const updatedArbitro = {
      ...arbitro,
      imagenUrl: imageUrl
    };

    const { data } = await apiClient.put(`/${id}`, updatedArbitro);

    res.json({
      message: 'Imagen subida exitosamente',
      imagenUrl: imageUrl,
      arbitro: data
    });
  } catch (e) {
    handleError(e, res);
  }
};

/**
 * Eliminar imagen de árbitro
 * DELETE /arbitros/:id/imagen
 */
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener el árbitro
    const { data: arbitro } = await apiClient.get(`/${id}`);
    if (!arbitro) {
      return res.status(404).json({ error: 'Árbitro no encontrado' });
    }

    // Verificar que tiene imagen
    if (!arbitro.imagenUrl) {
      return res.status(400).json({ error: 'El árbitro no tiene imagen asignada' });
    }

    // Eliminar de S3
    await deleteFile(arbitro.imagenUrl);

    // Actualizar el árbitro removiendo la URL de imagen
    const updatedArbitro = {
      ...arbitro,
      imagenUrl: null
    };

    const { data } = await apiClient.put(`/${id}`, updatedArbitro);

    res.json({
      message: 'Imagen eliminada exitosamente',
      arbitro: data
    });
  } catch (e) {
    handleError(e, res);
  }
};

/**
 * Obtener árbitros con sus imágenes (útil para verificación)
 * GET /arbitros/con-imagenes
 */
exports.getWithImages = async (req, res) => {
  try {
    const { data } = await apiClient.get('');
    
    // Filtrar solo árbitros que tienen imagen
    const arbitrosConImagenes = data.filter(arbitro => arbitro.imagenUrl);
    
    res.json({
      total: data.length,
      conImagenes: arbitrosConImagenes.length,
      arbitros: arbitrosConImagenes
    });
  } catch (e) {
    handleError(e, res);
  }
};