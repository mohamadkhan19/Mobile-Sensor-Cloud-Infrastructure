'use strict';
module.exports = function(sequelize, DataTypes) {
  var Sensors = sequelize.define('Sensors', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    type: {
      type: DataTypes.INTEGER,
      references: {
        model: 'SensorTypes', // Can be both a string representing the table name, or a reference to the model
        key: 'id'
      }
    },
    isEmulator: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    storages: DataTypes.ENUM('2G', '4G', '8G', '16G'),
    provider_id: {
      type: DataTypes.STRING,
      references: {
        model: 'Users', // Can be both a string representing the table name, or a reference to the model
        key: 'id'
      }
    },
    host_id: {
      type: DataTypes.STRING,
      references: {
        model: 'Hosts', // Can be both a string representing the table name, or a reference to the model
        key: 'id'
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Sensors;
};
