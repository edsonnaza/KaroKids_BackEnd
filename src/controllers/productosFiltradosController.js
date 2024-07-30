const { Productos } = require("../db");
const { Op } = require("sequelize");
const resultadosPaginados = require("../utils/paginacion");

const filtrarEdad = (edad, array1) => {
	if (edad) {
		const arr = [];
		array1.map((a) => {
			if (a.edad === edad) {
				arr.push(a);
			}
		});
		return arr;
	} else {
		return array1;
	}
};

const filtrarGenero = (genero, array1) => {
	if (genero) {
		const arr = [];

		if (genero === "chico") {
			array1.map((a) => {
				if (a.genero !== "chica") {
					arr.push(a);
				}
			});
		} else {
			array1.map((a) => {
				if (a.genero !== "chico") {
					arr.push(a);
				}
			});
		}

		return arr;
	} else {
		return array1;
	}
};

const filtrarTalla = async (talla, array1) => {
	if (talla) {
		const arr = [];
		array1.map((a) => {
			if (a.stock.hasOwnProperty(talla)) {
				if (a.stock[talla].length) {
					arr.push(a);
				}
			}
		});
		return arr;
	} else {
		return array1;
	}
};

const filtrarColor = (color, talla, array1) => {
	if (color) {
		const arr = [];
		if (talla) {
			array1.map((a) => {
				if (a.stock[talla].find((item) => item.color === color)) {
					arr.push(a);
				}
			});
		} else {
			array1.map((a) => {
				if (
					Object.values(a.stock).some((tallas) =>
						tallas.find((item) => item.color === color)
					)
				) {
					arr.push(a);
				}
			});
		}
		return arr;
	} else {
		return array1;
	}
};

const filtrarPrecio = (minPrecio, maxPrecio, array1) => {
	if (minPrecio && maxPrecio) {
		const arr = [];
		array1.map((a) => {
			if (a.precio < maxPrecio && a.precio > minPrecio) {
				arr.push(a);
			}
		});
		return arr;
	} else {
		return array1;
	}
};

const ordenar = (orden, array) => {
	let arr = [];
	arr = array;
	if (orden == 1) {
		arr.sort(function (a, b) {
			if (a.precio > b.precio) {
				return 1;
			}
			if (b.precio > a.precio) {
				return -1;
			}
			return 0;
		});
	}
	if (orden == 2) {
		arr.sort(function (a, b) {
			if (a.precio > b.precio) {
				return -1;
			}
			if (b.precio > a.precio) {
				return 1;
			}
			return 0;
		});
	}
	if (orden == 3) {
		arr.sort(function (a, b) {
			if (a.nombre > b.nombre) {
				return 1;
			}
			if (b.nombre > a.nombre) {
				return -1;
			}
			return 0;
		});
	}
	if (orden == 4) {
		arr.sort(function (a, b) {
			if (a.nombre > b.nombre) {
				return -1;
			}
			if (b.nombre > a.nombre) {
				return 1;
			}
			return 0;
		});
	}
	return arr;
};
async function productosFiltrados(req, res) {
	try {
		const {
			edad,
			genero,
			talla,
			color,
			minPrecio,
			maxPrecio,
			nombre,
			orden,
			admin,
		} = req.query;
		let { paginaActual } = req.query;
		if (!paginaActual) {
			paginaActual = 1;
		}


		let array = [];
		let mapeado = [];
		if (nombre) {
			const searchWords = nombre.split(" ");

			const whereCondition = {
				[Op.and]: searchWords.map((word) => ({
					nombre: { [Op.iLike]: `%${word}%` },
				})),
			};
			array = await Productos.findAll({
				where: whereCondition,
			});
		} else {
			array = await Productos.findAll();
		}

		array = array.map((a) => a.dataValues);

		if (admin === "false") {
			array = array.map((producto) => {
				if (producto.inactivo === false) {
					mapeado.push(producto);
				}
			});
			array = mapeado;
		} 
		array = filtrarEdad(edad, array);
		array = filtrarGenero(genero, array);
		array = await filtrarTalla(talla, array);
		array = filtrarColor(color, talla, array);
		array = filtrarPrecio(minPrecio, maxPrecio, array);
		array = await ordenar(orden, array);

		const paginacion = await resultadosPaginados(paginaActual, 8, array);

		res.status(200).json(paginacion);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

module.exports = productosFiltrados;
