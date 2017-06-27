var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var heartRate = 60;

var HeartRateMeasurementCharacteristic = function() {
  HeartRateMeasurementCharacteristic.super_.call(this, {
    uuid: '2A37',
    value : null,
    properties: ['read','notify'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Heart rate measurement between 0 and 240 bpm'
      }),
      new Descriptor({
        uuid: '2904',
        value: new Buffer([0x04, 0x01, 0x27, 0xAD, 0x01, 0x00, 0x00 ]) // maybe 12 0xC unsigned 8 bit
      })
    ]
  });
};

util.inherits(HeartRateMeasurementCharacteristic, Characteristic);

HeartRateMeasurementCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    this.intervalId = setInterval(function() {
        value = Math.floor(Math.random() * 6) + 1;
        if( (value % 2) == 0) {
            heartRate = hearRate + value;
        } else {
            heartRate = heartRate - value;
        }
        updateValueCallback(new Buffer(heartRate));
    }, 1000);
};


HeartRateMeasurementCharacteristic.prototype.onUnsubscribe = function() {                          
    clearInterval(this.intervalId);
};


HeartRateMeasurementCharacteristic.prototype.onReadRequest = function(offset, callback) {
    callback(this.RESULT_SUCCESS, new Buffer(value));
};

module.exports = HeartRateMeasurementCharacteristic;
