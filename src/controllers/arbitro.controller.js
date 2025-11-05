// Mock data - Datos de prueba
const arbitros = [
  {
    id: 1,
    nombre: "Paula Lop",
    cedula: "34567",
    username: "paula.lop",
    telefono: "3222469336",
    experiencia: "Campo"
  },
  {
    id: 2,
    nombre: "Sebastian Medina",
    cedula: "105819877",
    username: "sebastian.medina",
    telefono: "3222469336",
    experiencia: "Campo"
  },
  {
    id: 3,
    nombre: "Carlos Rodriguez",
    cedula: "87654321",
    username: "carlos.rod",
    telefono: "+57 300 111 2222",
    experiencia: "Profesional"
  },
  {
    id: 4,
    nombre: "Maria Garcia",
    cedula: "12398765",
    username: "maria.garcia",
    telefono: "+57 301 333 4444",
    experiencia: "Profesional"
  },
  {
    id: 5,
    nombre: "Juan Perez",
    cedula: "55566677",
    username: "juan.perez",
    telefono: "+57 302 555 6666",
    experiencia: "Campo"
  },
  {
    id: 6,
    nombre: "Ana Martinez",
    cedula: "99988877",
    username: "ana.martinez",
    telefono: "+57 303 777 8888",
    experiencia: "Profesional"
  },
  {
    id: 7,
    nombre: "Luis Fernandez",
    cedula: "11122233",
    username: "luis.fernandez",
    telefono: "+57 304 999 0000",
    experiencia: "Campo"
  },
  {
    id: 8,
    nombre: "Sofia Torres",
    cedula: "44455566",
    username: "sofia.torres",
    telefono: "+57 305 111 2222",
    experiencia: "Profesional"
  },
  {
    id: 9,
    nombre: "Diego Ramirez",
    cedula: "77788899",
    username: "diego.ramirez",
    telefono: "+57 306 333 4444",
    experiencia: "Campo"
  },
  {
    id: 10,
    nombre: "Laura Gomez",
    cedula: "33344455",
    username: "laura.gomez",
    telefono: "+57 307 555 6666",
    experiencia: "Profesional"
  }
];

const getAll = async (req, res) => {
  try {
    res.json(arbitros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const arbitro = arbitros.find(a => a.id === parseInt(req.params.id));
    if (!arbitro) {
      return res.status(404).json({ error: 'Arbitro no encontrado' });
    }
    res.json(arbitro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const newArbitro = {
      id: arbitros.length + 1,
      ...req.body
    };
    arbitros.push(newArbitro);
    res.status(201).json(newArbitro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const index = arbitros.findIndex(a => a.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Arbitro no encontrado' });
    }
    arbitros[index] = { ...arbitros[index], ...req.body };
    res.json(arbitros[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const index = arbitros.findIndex(a => a.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Arbitro no encontrado' });
    }
    arbitros.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getByCedula = async (req, res) => {
  try {
    const arbitro = arbitros.find(a => a.cedula === req.params.cedula);
    if (!arbitro) {
      return res.status(404).json({ error: 'Arbitro no encontrado' });
    }
    res.json(arbitro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: 'Username es requerido' });
    }
    const arbitro = arbitros.find(a => a.username === username);
    if (!arbitro) {
      return res.status(404).json({ error: 'Arbitro no encontrado' });
    }
    res.json(arbitro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getByCedula,
  searchByUsername
};