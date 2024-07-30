const {
  traerCarrito,
  agregarProducto,
  eliminarProducto,
  actualizarProducto,
  borrarCarrito,
} = require("../controllers/carritosController");

const getCarrito = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const response = await traerCarrito(usuario_id);
    return res.json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const addProducto = async (req, res) => {
  //Permite actualizar el carrito luego de la eliminación de un producto.
  const {
    usuario_id,
    id,
    title,
    picture_url,
    compra_talla,
    compra_color,
    quantity,
    unit_price,
    products,
  } = req.body;

  try {
    if (products) {
      for (const product of products) {
        await agregarProducto(
          usuario_id,
          product.id,
          product.title,
          product.picture_url,
          product.compra_talla,
          product.compra_color,
          product.quantity,
          product.unit_price
        );
      }
      return res.json({ message: "Productos agregados al carrito" });
    } else {
      const response = await agregarProducto(
        usuario_id,
        id,
        title,
        picture_url,
        compra_talla,
        compra_color,
        quantity,
        unit_price
      );
      return res.json(response);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteProducto = async (req, res) => {
  //Permite actualizar el carrito luego de la eliminación de un producto.
  const { usuario_id, producto_id, compra_talla, compra_color } = req.body;

  try {
    const response = await eliminarProducto(
      usuario_id,
      producto_id,
      compra_talla,
      compra_color
    );
    return res.json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const updateProducto = async (req, res) => {
  const {
    usuario_id,
    producto_id,
    compra_talla,
    compra_color,
    compra_cantidad,
  } = req.body;

  try {
    const response = await actualizarProducto(
      usuario_id,
      producto_id,
      compra_talla,
      compra_color,
      compra_cantidad
    );
    return res.json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//Permite resetear a cero el carrito luego de enviar todo su contenido a la tabla Ordenes.
const deleteCarrito = async (req, res) => {
  const { usuario_id } = req.body;
  console.log("llego hasta aca con: " + usuario_id);

  try {
    const response = await borrarCarrito(usuario_id);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCarrito,
  addProducto,
  deleteProducto,
  updateProducto,
  deleteCarrito,
};
