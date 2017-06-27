var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var sensorLocation = 0;

var BodySensorLocationCharacteristic = function() {
  BodySensorLocationCharacteristic.super_.call(this, {
    uuid: '2A38',
    value : null,
    properties: ['read',],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Body sensor location'
      }),
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x04, 0x01, 0x27, 0xAD, 0x01, 0x00, 0x00 ]) // maybe 12 0xC unsigned 8 bit
      })
    ]
  });
};

util.inherits(BodySensorLocationCharacteristic, Characteristic);


BodySensorLocationCharacteristic.prototype.onReadRequest = function(offset, callback) {
    sensorLocation = parseInt(Math.floor(Math.random() * 6) + 1);
    callback(this.RESULT_SUCCESS, new Buffer([sensorLocation]));
};

module.exports = BodySensorLocationCharacteristic;

