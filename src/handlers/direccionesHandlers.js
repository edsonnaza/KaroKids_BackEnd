const { todasLasDirecciones, traerDireccion, crearDireccion } = require("../controllers/direccionesController");


const getDirecciones = async (req, res) => {
    try{
        const response = await todasLasDirecciones()
        res.status(200).json(response);
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
}

const getDireccion = async (req, res) => {
    const {id} = req.params;
    try{
        const response = await traerDireccion(id)
        res.status(200).json(response);
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
}

const postDireccion = async (req, res) => {
    const {a} = req.body;
    try{
        const response = await crearDireccion(a)
        res.status(200).json(response);
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
}

const putDireccion = async (req, res) => {
    const {id} = req.params;
    try{
        res.status(200).send(`se modifico el Direccion ${id}`);
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
}

const deleteDireccion = async (req, res) => {
    const {id} = req.params;
    try{
        res.status(200).send(`se elimino el Direccion ${id}`);
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    getDirecciones,
    getDireccion,
    postDireccion,
    putDireccion,
    deleteDireccion
}