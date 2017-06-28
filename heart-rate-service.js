var util = require('util');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var HeartRateMeasurementCharacteristic = require('./heart-rate-measurement-characteristic');
var BodySensorLocationCharacteristic = require('./body-sensor-location-characteristic');

function HeartRateService() {
  HeartRateService.super_.call(this, {
      uuid: '180D',
      characteristics: [
          new HeartRateMeasurementCharacteristic(),
          new BodySensorLocationCharacteristic()
      ]
  });
}

util.inherits(HeartRateService, BlenoPrimaryService);

module.exports = HeartRateService;