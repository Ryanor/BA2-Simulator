/**
* Class HeartRateService extends bleno.PrimaryService class
* Main class for the heart rate service including 
* HeartRateMeasurementCharacteristic
* BodySensorLocationCharacteristic
* The heart rate service sets the UUID to the SIG defined value.
*
* @author gwu
* @version 1.0
*/

// import utility library to build classes
var util = require('util');

// import bleno module for bluettoth low energy communication
var bleno = require('bleno');

// create the PrimaryService class which the battery class inherits from
var BlenoPrimaryService = bleno.PrimaryService;

// predefine the included characteristics of the service
var HeartRateMeasurementCharacteristic = require('./heart-rate-measurement-characteristic');
var BodySensorLocationCharacteristic = require('./body-sensor-location-characteristic');

/**
* Constructor for HeartRateService calls constructor from the parent class PrimaryService
* Defines the UUID for the service
* Includes characteristics used
*/ 
function HeartRateService() {
  HeartRateService.super_.call(this, {
      uuid: '180D',
      characteristics: [
          new HeartRateMeasurementCharacteristic(),
          new BodySensorLocationCharacteristic()
      ]
  });
}

// define inhertance
util.inherits(HeartRateService, BlenoPrimaryService);

// export class as HeartRateService
module.exports = HeartRateService;