/**
* Class TemperatureMeasurementCharacteristic extends bleno.Characteristic class
* TemperatureMeasurementCharacteristic shows user information about the sensor location the body.
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
* Constructor for TemperatureMeasurementCharacteristic calls constructor from the parent class Characteristic
* Defines the UUID for the characteristic
* Includes descriptors used
*/ 
var TemperatureMeasurementCharacteristic = function() {
  TemperatureMeasurementCharacteristic.super_.call(this, {
    uuid: '2A1C',
    value: null,
    properties: ['notify'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Temperature measurement in degree Celsius'
      })
    ]
  });
};

// define inhertance
util.inherits(TemperatureMeasurementCharacteristic, Characteristic);


/**
* Override prototype method onSubscribe from class bleno.Characteristic 
* This method is called if the master subscribes to the characteristic so it gets a new value every 2s interval.
* Creates a random number between 35.00 and 40.00 to simulate the body temperature
*/
TemperatureMeasurementCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  // creates interval function  
  this.intervalId = setInterval(function() {
    console.log("Get randomized temperature");
    // create random value
    var val = (Math.random() * (40 - 35) + 35).toFixed(2);
    // send data to master
    console.log("Randomized body temperature: " + val + " °C");
    updateValueCallback(new Buffer(val));  
    // wait 2s
  }, 2000);
};

/**
* Override prototype method onUnsubscrib from class bleno.Characteristic 
* This method is called if the master unsubscribes from the characteristic.
* Interval is cleared and no data will be transmitted
*/
TemperatureMeasurementCharacteristic.prototype.onUnsubscribe = function() {                          
    clearInterval(this.intervalId);
};

// export class as TemperatureMeasurementCharacteristic
module.exports = TemperatureMeasurementCharacteristic;
