const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Direcciones", {
    direccion_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    tipo_direccion: {
      type: DataTypes.ENUM("facturacion", "envio"),
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    calle: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    casa: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    codigo_postal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
