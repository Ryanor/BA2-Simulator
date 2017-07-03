/**
* Class HeartRateMeasurementCharacteristic extends bleno.Characteristic class
* HeartRateMeasurementCharacteristic shows user information about the sensor location the body.
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

// initial value for the heart rate randomization
var heartRate = 60;

/**
* Constructor for BodySensorLocationCharacteristic calls constructor from the parent class Characteristic
* Defines the UUID for the characteristic
* Includes descriptors used
*/ 
var HeartRateMeasurementCharacteristic = function() {
  HeartRateMeasurementCharacteristic.super_.call(this, {
    uuid: '2A37',
    value: null,
    properties: ['notify','read'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Heart rate measurement between 0 and 240 bpm'
      })
    ]
  });
};

// define inhertance
util.inherits(HeartRateMeasurementCharacteristic, Characteristic);


/**
* Override prototype method onSubscribe from class bleno.Characteristic 
* This method is called if the master subscribes to the characteristic so it gets a new value every 2s interval.
* Creates a random number between 1 and 6 and adds or substrats the value form the heartRate value
*/
HeartRateMeasurementCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  // creates interval function  
  this.intervalId = setInterval(function() {
    // create random value
    var val = parseInt(Math.floor(Math.random() * 6) + 1);
    // check if even
    if( (val % 2) == 0) {
      // add the value
      heartRate = parseInt(heartRate + val);
    } else {
      // substract the value
      heartRate = parseInt(heartRate - val);   
    }
    // crete buffer and write value into it
    let data = new Buffer(2);
    data.writeUInt16BE(heartRate, 0);
    // send data to master
    updateValueCallback(data);  
    // wait 2s
  }, 2000);
};

/**
* Override prototype method onUnsubscrib from class bleno.Characteristic 
* This method is called if the master unsubscribes from the characteristic.
* Interval is cleared and no data will be transmitted
*/
HeartRateMeasurementCharacteristic.prototype.onUnsubscribe = function() {                          
    clearInterval(this.intervalId);
};

// export class as HeartRateMeasurementCharacteristic
module.exports = HeartRateMeasurementCharacteristic;
