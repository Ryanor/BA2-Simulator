/**
 * Class PressureCharacteristic extends bleno.Characteristic class
 * PressureCharacteristic shows user information about the air pressure in Pascals.
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
 * Constructor for PressureCharacteristic calls super constructor from the parent class Characteristic
 * Defines the UUID, value, properties and descriptors of the characteristics
 */
var PressureCharacteristic = function() {
    PressureCharacteristic.super_.call(this, {
        uuid: '2A6D',
        value: null,
        properties: ['read', 'notify'],
        descriptors: [
            new Descriptor({
                uuid: '2901',
                value: 'Pressure level in Pa, values between 165 and 108000 Pa'
            })
        ]
    });
};

// define inheritance
util.inherits(PressureCharacteristic, Characteristic);

/**
 * Override prototype method onReadRequest from class bleno.Characteristic
 * This method is called if the master initiates an onReadRequest for the pressure characteristic.
 * Sends a randomly created value for the pressure to the client
 */
PressureCharacteristic.prototype.onReadRequest = function(offset, callback) {
    // create random value
    createRandomValue(0.1, 1);
    // return value to master
    callback(this.RESULT_SUCCESS, new Buffer(pressure));
};

/**
 * Override prototype method onSubscribe from class bleno.Characteristic
 * This method is called if the master subscribes to the characteristic so it gets a new value every 2s interval.
 * Creates a random number between within a min and max range and subtracts the value from the actual pressure value
 */
PressureCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    // creates interval function
    this.intervalId = setInterval(function() {
        // get random value
        createRandomValue(0.1, 1);
        // send data to master
        updateValueCallback(new Buffer(pressure));
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


/**
 * Function creates a new value with a random value within the range of min and max.
 * This values is either added or subtracted from the base value of pressure
 * @param min Minimum range
 * @param max Maximum range
 */
function createRandomValue(min, max) {
    console.log("Get randomized value for pressure");
    // create random value
    var delta = (Math.random() * (max - min) + min).toFixed(1);
    // check if even
    if( (delta % 2) === 0) {
        // add the value
        pressure = pressure + delta;
    } else {
        // subtract the value
        pressure = pressure - delta;
    }
    console.log("Pressure: " + pressure + " Pa");
}

// export class as PressureCharacteristic
module.exports = PressureCharacteristic;