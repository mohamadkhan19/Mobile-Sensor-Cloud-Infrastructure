'use strict';

var Host = require('../models/').Hosts;
var Routes = require('../models/').Routes;
var SensorHubs = require('../models/').SensorHubs;
var uuid = require('node-uuid');
var randomip = require('random-ip');

module.exports = {

  create(req, res) {
    var data = req.body;
    var reqBody = {
      id: uuid.v4(),
      name: data.name,
      description: data.description,
      ip: randomip('192.168.2.0', 24),
      status: data.status || true,
      creator_id: req.headers.u,
      sensorhub_id: data.sensorhub_id,
      route_id: data.route_id
    };
    Host.create(reqBody)
      .then(function (newHost) {
        res.status(201).json(newHost);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  show(req, res) {
    var userId = req.headers.u || '';
    Host.findAll({
      where: {
        creator_id: userId
      },
      include: [Routes, SensorHubs]
    })
    .then(function (hosts) {
      res.status(200).json(hosts);
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
  },

  showstatus(req, res) {
    var userId = req.headers.u || '';
    Host.findAll({
      where: {
        creator_id: userId
      }
    })
    .then(function (hosts) {
      var active = 0,
          inactive = 0;
      for (var i = 0; i < hosts.length; i++) {
        if (hosts[i].status) {
          active++;
        } else {
          inactive++;
        }
      }
      //return status
      res.status(200).json({
        active: active,
        inactive: inactive
      });
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
  },

  update(req, res) {
    var data = req.body;
    var reqBody = {
      name: data.name,
      description: data.description,
      status: data.status || true
    };
    Host.update(reqBody, {
      where: {
        id: req.params.id
      }
    })
    .then(function (updatedRecords) {
      res.status(200).json({});
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
  },

  delete(req, res) {
    Host.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(function (deletedRecords) {
      res.status(200).json({});
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
  }

};
