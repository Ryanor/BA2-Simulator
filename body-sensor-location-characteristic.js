var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;


var BodySensorLocationCharacteristic = function() {
  BodySensorLocationCharacteristic.super_.call(this, {
    uuid: '2A38',
    value : null,
    properties: ['read',],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Body sensor location'
      })
    ]
  });
};

util.inherits(BodySensorLocationCharacteristic, Characteristic);


BodySensorLocationCharacteristic.prototype.onReadRequest = function(offset, callback) {
    var location = parseInt(Math.floor(Math.random() * 7));
    callback(this.RESULT_SUCCESS, new Buffer([location]));
};

module.exports = BodySensorLocationCharacteristic;

