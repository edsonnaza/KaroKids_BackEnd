const { Router } = require("express");
const {
  getOrdenes,
  getOrden,
  postOrden,
  putOrden,
  deleteOrden,
  getOrdenById,
} = require("../handlers/ordenesHandlers");
const ordenes = Router();

ordenes.get("/", getOrdenes);
ordenes.get("/:id", getOrden);
ordenes.post("/", postOrden);
ordenes.put("/:id", putOrden);
ordenes.delete("/:id", deleteOrden);
ordenes.get("/detail/:orden_id", getOrdenById);

module.exports = ordenes;
