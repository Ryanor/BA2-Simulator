/**
* Class BodySensorLocationCharacteristic extends bleno.Characteristic class
* BodySensorLocationCharacteristic shows user information about the sensor location the body.
* Uses SIG defined UUID for the characteristic
*
* @author gwu
* @version 1.0
*/

// import utility library to build classes
var util = require('util');

// import bleno module for bluettoth low energy communication
var bleno = require('bleno');

// predefine the included descriptors of the service
var Descriptor = bleno.Descriptor;

// create the Characteristic class which the battery level characteristic inherits from
var Characteristic = bleno.Characteristic;

/**
* Constructor for BodySensorLocationCharacteristic calls constructor from the parent class Characteristic
* Defines the UUID for the characteristic
* Includes descriptors used
*/ 
var BodySensorLocationCharacteristic = function() {
  BodySensorLocationCharacteristic.super_.call(this, {
    // defined UUID 
    uuid: '2A38',
    // only readable
    properties: ['read',],
    // used descriptors
    descriptors: [
      // new user information descriptor
      new Descriptor({
        // defined UUID
        uuid: '2901',
        // Meassage to the master / user
        value: 'Body sensor location'
      })
    ]
  });
};

// define inhertance
util.inherits(BodySensorLocationCharacteristic, Characteristic);

/**
* Override prototype method onReadRequest from class bleno.Characteristic 
* This method is called if the master initiates an onReadRequest on the body sensor location characteristic.
* Creates a random number between 0 and 7 which are used for the position on the body
*/
BodySensorLocationCharacteristic.prototype.onReadRequest = function(offset, callback) {
  // create random value
  var location = parseInt(Math.floor(Math.random() * 7));
  // return value to master
  callback(this.RESULT_SUCCESS, new Buffer([location]));
};

// export class as BodySensorLocationCharacteristic
module.exports = BodySensorLocationCharacteristic;

