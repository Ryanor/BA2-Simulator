var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var heartRate = 60;

var HeartRateMeasurementCharacteristic = function() {
  HeartRateMeasurementCharacteristic.super_.call(this, {
    uuid: '2A37',
    value : null,
    properties: ['notify','read'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Heart rate measurement between 0 and 240 bpm'
      })
    ]
  });
};

util.inherits(HeartRateMeasurementCharacteristic, Characteristic);

HeartRateMeasurementCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    this.intervalId = setInterval(function() {
        var val = parseInt(Math.floor(Math.random() * 6) + 1);
        if( (val % 2) == 0) {
            heartRate = parseInt(heartRate + val);
        } else {
            heartRate = parseInt(heartRate - val);
        }
        updateValueCallback(new Buffer([heartRate]));
    }, 1000);
};


HeartRateMeasurementCharacteristic.prototype.onUnsubscribe = function() {                          
    clearInterval(this.intervalId);
};


module.exports = HeartRateMeasurementCharacteristic;
