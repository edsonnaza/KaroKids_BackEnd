const {
  traerProductosFavoritos,
  agregarProductoFavorito,
  eliminarProductoFavorito,
  topFavoritos,
} = require("../controllers/productosFavoritosControllers");

const getProductosFavoritos = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const response = await traerProductosFavoritos(usuario_id);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTopFavoritos = async (req, res) => {
  const { top } = req.body;
  try {
    const response = await topFavoritos(top);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addProductoFavorito = async (req, res) => {
  const { usuario_id, producto_id } = req.body;
  try {
    const response = await agregarProductoFavorito(usuario_id, producto_id);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProductoFavorito = async (req, res) => {
  const { usuario_id, producto_id } = req.body;
  try {
    const response = await eliminarProductoFavorito(usuario_id, producto_id);
    res.send(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProductosFavoritos,
  addProductoFavorito,
  deleteProductoFavorito,
  getTopFavoritos,
};
