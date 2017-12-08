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

// initial value for the pressure in pascals
var pressure = 975000;

/**
 * Constructor for HeartRateMeasurementCharacteristic calls constructor from the parent class Characteristic
 * Defines the UUID for the characteristic
 * Includes descriptors used
 */
var PressureCharacteristic = function() {
    PressureCharacteristic.super_.call(this, {
        uuid: '2A6D',
        value: null,
        properties: ['read', 'notify'],
        descriptors: [
            new Descriptor({
                uuid: '2901',
                value: 'Pressure level in Pa, values between 165 and 108000%'
            })
        ]
    });
};

// define inhertance
util.inherits(PressureCharacteristic, Characteristic);

/**
 * Override prototype method onReadRequest from class bleno.Characteristic
 * This method is called if the master initiates an onReadRequest on the body sensor location characteristic.
 * Creates a random number between 0 and 7 which are used for the position on the body
 */
PressureCharacteristic.prototype.onReadRequest = function(offset, callback) {
    // create random value
    createRandomValue(0.1, 1);
    pressure = pressure.toFixed(1);

    // return value to master
    callback(this.RESULT_SUCCESS, new Buffer([pressure]));
};

/**
 * Override prototype method onSubscribe from class bleno.Characteristic
 * This method is called if the master subscribes to the characteristic so it gets a new value every 2s interval.
 * Creates a random number between 1 and 6 and adds or substracts the value form the heartRate value
 */
PressureCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    // creates interval function
    this.intervalId = setInterval(function() {
        // get random value
        createRandomValue(0.1, 1);
        pressure = pressure.toFixed(1);
        // crete buffer and write value into it
        //var data = new Buffer(2);
        //data.writeUInt16BE(humidity, 0);
        // send data to master
        updateValueCallback(new Buffer[pressure]);
        // wait 2s
    }, 2000);
};

/**
 * Override prototype method onUnsubscribe from class bleno.Characteristic
 * This method is called if the master unsubscribes from the characteristic.
 * Interval is cleared and no data will be transmitted
 */
PressureCharacteristic.prototype.onUnsubscribe = function() {
    clearInterval(this.intervalId);
};


function createRandomValue(min, max) {
    console.log("Get randomized value for pressure");
    // create random value
    var delta = Math.random() * (max - min) + min;
    // check if even
    if( (delta % 2) === 0) {
        // add the value
        pressure = pressure + delta;
    } else {
        // substract the value
        pressure = pressure - delta;
    }
    console.log("Pressure: " + pressure + " Pa");
}

// export class as HeartRateMeasurementCharacteristic
module.exports = PressureCharacteristic;