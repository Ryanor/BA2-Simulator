/**
* Class ThermometerService extends bleno.PrimaryService class
* Main class for the ThermometerService including 
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
var TemperatureMeasurementCharacteristic = require('./temperature-measurement-characteristic');

/**
* Constructor for ThermometerService calls constructor from the parent class PrimaryService
* Defines the UUID for the service
* Includes characteristics used
*/ 
function ThermometerService() {
  ThermometerService.super_.call(this, {
      uuid: '1809',
      characteristics: [
          new TemperatureMeasurementCharacteristic()
      ]
  });
}

// define inhertance
util.inherits(ThermometerService, BlenoPrimaryService);

// export class as ThermometerService
module.exports = ThermometerService;
