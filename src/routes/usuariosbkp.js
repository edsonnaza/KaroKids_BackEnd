const { Router } = require("express");
const {
  // getUsuarios,
  getUsuario,
  postUsuario,
  putUsuario,
  deleteUsuario,
  putUsuarioRol,
  getTopUsuarios
} = require("../handlers/usuariosHandlers");
const usuariosFiltrados = require('../controllers/usuariosFiltradosControllers');

const usuarios = Router();

usuarios.get("/", usuariosFiltrados);
usuarios.get("/top", getTopUsuarios);
usuarios.get("/user", getUsuario);
usuarios.post("/user", postUsuario);
usuarios.put("/", putUsuario);
usuarios.put("/rol", putUsuarioRol);
usuarios.put("/delete", deleteUsuario);

module.exports = usuarios;
