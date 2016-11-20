'use strict';

module.exports = function(sequelize, DataTypes) {
  var TransactionManagers = sequelize.define('TransactionManager', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.STRING,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    virtualsensor_id: {
      type: DataTypes.STRING,
      references: {
        model: 'VirtualSensors',
        key: 'id'
      }
    },
    timestamp: DataTypes.DATE,
    sensor_id: {
      type: DataTypes.STRING,
      references: {
        model: 'Sensors', //physical sensor
        key: 'id'
      }
    },
    status: DataTypes.ENUM('success','fail')
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'TransactionManager',
    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: true

    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    //underscored: true,
  });

  return TransactionManagers;
};