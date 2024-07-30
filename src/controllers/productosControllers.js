require("dotenv").config();
const { Productos, Ordenes } = require("../db");
const resultadosPaginados = require("../utils/paginacion");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const todosLosProductos = async (paginaActual) => {
  const itemsPorPagina = 8;

  return resultadosPaginados(paginaActual, itemsPorPagina, Productos);
};

const productosDestacados = async (limite) => {
  try {
    const productos = await Productos.findAll({
      where: {
        destacado: true,
      },
      limit: limite,
      attributes: [
        "producto_id",
        "nombre",
        "descripcion",
        "imagen_principal",
        "precio",
      ],
    });

    return productos;
  } catch (error) {
    return error;
  }
};

const traerProducto = async (id) => {
  const response = await Productos.findByPk(id);
  if (response === null) {
    return "El producto no existe";
  } else {
    return response;
  }
};

const borrarProducto = async (producto_id) => {
  try {
    const producto = await Productos.findByPk(producto_id);

    if (!producto) {
      return "No existe ese producto";
    }
    if (producto.destacado == true) {
      await Productos.update(
        { inactivo: !producto.inactivo, destacado: !producto.destacado },
        {
          where: { producto_id: producto_id },
        }
      );
    } else {
      await Productos.update(
        { inactivo: !producto.inactivo },
        {
          where: { producto_id: producto_id },
        }
      );
    }
    return await Productos.findByPk(producto_id);
  } catch (error) {
    return error;
  }
};

const modificarProducto = async (
  producto_id,
  nombre,
  descripcion,
  imagen_principal,
  imagenes_secundarias,
  edad,
  genero,
  precio,
  destacado,
  inactivo,
  stock
) => {
  try {
    const productoActual = await Productos.findByPk(producto_id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    const cloudinaryRegex =
      /^https:\/\/res\.cloudinary\.com\/dk4ysl2hw\/image\/upload\//;

    //todo Actualizacion por cambio de nombre
    if (nombre !== productoActual.nombre) {
      await Productos.update(
        { nombre: nombre },
        { where: { producto_id: producto_id } }
      );
    }

    //todo Actualizacion por cambio de descripcion
    if (descripcion !== productoActual.descripcion) {
      await Productos.update(
        { descripcion: descripcion },
        { where: { producto_id: producto_id } }
      );
    }

    //todo Actualizacion por cambio de Imagen Principal
    if (imagen_principal !== productoActual.imagen_principal) {
      if (!cloudinaryRegex.test(imagen_principal)) {
        const img_principal_cloud = await cloudinary.uploader.upload(
          imagen_principal,
          {
            upload_preset: "preset_imagenes_productos",
            allowed_formats: ["png", "jpg", "jpeg", "gif", "webp"],
          },
          function (err, result) {
            if (err) {
              throw new Error("Error al subir la imagen primaria: ", err);
            }
            try {
              return result.secure_url;
            } catch (err) {
              throw new Error("Error en img_principal_cloud: ", err);
            }
          }
        );

        await Productos.update(
          { imagen_principal: img_principal_cloud.secure_url },
          { where: { producto_id: producto_id } }
        );
      } else {
        await Productos.update(
          { imagen_principal: imagen_principal },
          { where: { producto_id: producto_id } }
        );
      }
    }

    //todo Actualizacion por cambio de Imagenes secundarias
    imagenes_secundarias = [...new Set(imagenes_secundarias)];
    const imagenes_secundarias_cloud = [];

    for (let i = 0; i < imagenes_secundarias.length; i++) {
      if (!cloudinaryRegex.test(imagenes_secundarias[i])) {
        await cloudinary.uploader.upload(
          imagenes_secundarias[i],
          {
            upload_preset: "preset_imagenes_productos",
            allowed_formats: ["png", "jpg", "jpeg", "gif", "webp"],
          },
          function (err, result) {
            if (err) {
              throw new Error("Error al subir las imagenes secundarias: ", err);
            }

            try {
              imagenes_secundarias_cloud.push(result.secure_url);
            } catch (err) {
              throw new Error(
                "Error al construir el array imagenes_secundarias_cloud: ",
                err
              );
            }
          }
        );
      } else {
        imagenes_secundarias_cloud.push(imagenes_secundarias[i]);
      }
    }

    await Productos.update(
      { imagenes_secundarias: imagenes_secundarias_cloud },
      { where: { producto_id: producto_id } }
    );

    //todo Actualizacion por cambio de edad/categoría
    if (edad !== productoActual.edad) {
      await Productos.update(
        { edad: edad },
        { where: { producto_id: producto_id } }
      );
    }

    //todo Actualizacion por cambio de genero
    if (genero !== productoActual.genero) {
      await Productos.update(
        { genero: genero },
        { where: { producto_id: producto_id } }
      );
    }

    //todo Actualizacion por cambio de precio
    if (precio !== productoActual.precio) {
      await Productos.update(
        { precio: precio },
        { where: { producto_id: producto_id } }
      );
    }

    //todo Actualizacion por cambio de destacado
    if (destacado !== productoActual.destacado) {
      await Productos.update(
        { destacado: destacado },
        { where: { producto_id: producto_id } }
      );
    }

    //todo Actualizacion por cambio de inactivo
    if (inactivo !== productoActual.inactivo) {
      await Productos.update(
        { inactivo: inactivo },
        { where: { producto_id: producto_id } }
      );
    }

    //todo Actualizacion por cambio de stock
    if (stock !== productoActual.stock) {
      if (Object.keys(stock).length === 0 && productoActual.inactivo == false) {
        if (productoActual.destacado === true) {
          productoActual.destacado = false;
        }
        await Productos.update(
          { stock: stock, inactivo: true, destacado: productoActual.destacado },
          { where: { producto_id: producto_id } }
        );
      } else {
        await Productos.update(
          { stock: stock},
          { where: { producto_id: producto_id } }
        );
      }
    }
    //todo Se retorna el elemento modificado
    console.log(`Se modificó exitosamente el producto ${producto_id}`);
    return await Productos.findByPk(producto_id);
  } catch (error) {
    console.error(error);
    throw new Error("Error en modificarProducto Controller");
  }
};

const crearProducto = async (
  nombre,
  descripcion,
  imagen_principal,
  imagenes_secundarias,
  edad,
  genero,
  precio,
  destacado,
  inactivo,
  stock
) => {
  try {
    const img_principal_cloud = await cloudinary.uploader.upload(
      imagen_principal,
      {
        upload_preset: "preset_imagenes_productos",
        allowed_formats: ["png", "jpg", "jpeg", "gif", "webp"],
      },
      function (err, result) {
        if (err) {
          throw new Error("Error al subir la imagen primaria: ", err);
        }
        try {
          return result.secure_url;
        } catch (err) {
          throw new Error("Error en img_principal_cloud: ", err);
        }
      }
    );

    const imagenes_secundarias_cloud = [];

    for (let i = 0; i < imagenes_secundarias.length; i++) {
      await cloudinary.uploader.upload(
        imagenes_secundarias[i],
        {
          upload_preset: "preset_imagenes_productos",
          allowed_formats: ["png", "jpg", "jpeg", "gif", "webp"],
        },
        function (err, result) {
          if (err) {
            throw new Error("Error al subir las imagenes secundarias: ", err);
          }

          try {
            imagenes_secundarias_cloud.push(result.secure_url);
          } catch (err) {
            throw new Error(
              "Error al construir el array imagenes_secundarias_cloud: ",
              err
            );
          }
        }
      );
    }

    return await Productos.create({
      nombre,
      descripcion,
      imagen_principal: img_principal_cloud.secure_url,
      imagenes_secundarias: imagenes_secundarias_cloud,
      edad,
      genero,
      precio,
      destacado,
      inactivo,
      stock,
    });
  } catch (error) {
    throw new Error("Error en el controller crearProducto");
  }
};

const decrementarCantidad = async (
  producto_id,
  compra_talla,
  compra_color,
  compra_cantidad
) => {
  const producto = await Productos.findByPk(producto_id);
  const modificado = producto.dataValues.stock[compra_talla].filter((item) => {
    if (item.color === compra_color) {
      if (item.cantidad - compra_cantidad > 0) {
        item.cantidad = item.cantidad - compra_cantidad;
        item.cantidad = item.cantidad.toString();
        return item;
      }
    } else {
      return item;
    }
  });
  console.log(modificado);
  if (modificado.length) {
    producto.dataValues.stock[compra_talla] = modificado;
  } else {
    delete producto.dataValues.stock[compra_talla];
  }
  if (
    producto.dataValues.stock == null ||
    producto.dataValues.stock == undefined
  ) {
    producto.dataValues.stock = {};
  }
  if (
    Object.keys(producto.dataValues.stock).length === 0 &&
    producto.dataValues.inactivo == false
  ) {
    if (producto.dataValues.destacado == true) {
      producto.dataValues.destacado = false;
    }
    await Productos.update(
      {
        stock: producto.dataValues.stock,
        inactivo: true,
        destacado: producto.dataValues.destacado,
      },
      { where: { producto_id: producto_id } }
    );
  } else {
    await Productos.update(
      { stock: producto.dataValues.stock },
      { where: { producto_id: producto_id } }
    );
  }
  return await Productos.findByPk(producto_id);
};

const filtrarProductos = async () => {};

const destacarProducto = async (producto_id) => {
  if (!producto_id) {
    return "El producto no existe";
  } else {
    const producto = await Productos.findByPk(producto_id);

    await Productos.update(
      { destacado: !producto.destacado },
      {
        where: { producto_id: producto_id },
      }
    );

    return await Productos.findByPk(producto_id);
  }
};

const topProductos = async (top) =>{
  try {
    const ordenes = await Ordenes.findAll();
    let array = []
    for(orden of ordenes){
      for (prod of orden.productos_compra){
        let esta = false
          array = array.map((item) => {
            if(item.producto.producto_id === prod.id){
              item.cantidad = parseInt(item.cantidad)
              item.cantidad += parseInt(prod.quantity)
              esta = true
            }
            return item;
          });
          if (esta === false){
            let nuevo = {
              producto :{ 
                producto_id : prod.id,
                producto_nombre : prod.title,
                producto_precio : prod.unit_price,
                producto_imagen : prod.picture_url
              },
              cantidad : parseInt(prod.quantity)
            }
            array.push(nuevo)
          }
        }
      } 
      array.sort((a, b) => b.cantidad - a.cantidad);
      if (array.length < top){
        return array
      }else{
      return array.slice(0,top)
      }
  } catch (error) {
    console.error("Error al obtener los productos más vendidos:", error);
    throw error;
  }

}

module.exports = {
  todosLosProductos,
  traerProducto,
  borrarProducto,
  modificarProducto,
  crearProducto,
  filtrarProductos,
  destacarProducto,
  productosDestacados,
  decrementarCantidad,
  topProductos
};
