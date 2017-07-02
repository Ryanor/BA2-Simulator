/**
* Class BatterySerice extends bleno.PrimaryService class
* Main class for the battery service including 
* BatteryLevelCharacteristic.
* The battery service sets the UUID to the SIG defined value.
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
var BatteryLevelCharacteristic = require('./battery-level-characteristic');

/**
* Constructor for BatteryService calls constructor from the parent class PrimaryService
* Defines the UUID for the service
* Includes characteristics used
*/ 
function BatteryService() {
  BatteryService.super_.call(this, {
      uuid: '180F',
      characteristics: [
          new BatteryLevelCharacteristic()
      ]
  });
}

// define inhertance
util.inherits(BatteryService, BlenoPrimaryService);

// export class as BatteryService
module.exports = BatteryService;