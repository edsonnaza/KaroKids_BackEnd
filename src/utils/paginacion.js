//paginaActual: Se introduce el valor que llega por QUERY de la página en la que se encuentra posicionado el usuario. --> Permite definir el atributo OFFSET para el modelo.

//itemsPorPagina: Es el numero de elementos que se quieren visualizar. --> Permite definir el atributo LIMIT para el modelo.

//ModeloActual: Toma el modelo con el que se va a trabajar.

//Necesito saber cuánto elementos tiene la tabla en total.

//OFFSET = (pagina - 1) * LIMIT

//SELECT * FROM tabla OFFSET 0 LIMIT 10 ---> Devolverá lo que se encuentre entre OFFSET y LIMIT. En este caso, los primeros 10 elementos.

const resultadosPaginados = async (
	paginaActual,
	itemsPorPagina,
	modeloActual
) => {
	try {
		const limitAttribute = itemsPorPagina;
		const totalElementos = await modeloActual.count();
		const totalPaginas = Match.ceil(totalElementos / limitAttribute); //Este parámetro se va a utilizar para manejar apropiadamente los últimos elementos disponibles para visualizar en el Front, por eso no se usa acá y simplemente se retorna.
		const offseAttribute = (paginaActual - 1) * limitAttribute;

		const elementosPaginados = await modeloActual.findAll({
			offset: offseAttribute,
			limit: limitAttribute,
		});

		return { elementosPaginados, totalPaginas };
	} catch (error) {
		throw new Error(
			"Error al obtener los usuarios paginados: " + error.message
		);
	}
};
