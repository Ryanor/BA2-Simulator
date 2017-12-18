/**
 * Class HumidityCharacteristic extends bleno.Characteristic class
 * HumidityCharacteristic shows user information about the humidity in percent.
 * Humidity level is calculated from a base level which will increase or decrease its value randomly.
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
var humidity = 50;

/**
 * Constructor for HumidityCharacteristic, calls super constructor from the parent class Characteristic
 * Defines the UUID, value, properties and descriptors of the characteristics
 */
var HumidityCharacteristic = function() {
    HumidityCharacteristic.super_.call(this, {
        uuid: '2A6F',
        value: null,
        properties: ['read', 'notify'],
        descriptors: [
            new Descriptor({
                uuid: '2901',
                value: 'Humidity level in %, values between 0 and 100%'
            })
        ]
    });
};

// define inheritance
util.inherits(HumidityCharacteristic, Characteristic);

/**
 * Override prototype method onReadRequest from class bleno.Characteristic
 * This method is called if the master initiates an onReadRequest on the humidity characteristic.
 * Sends a randomly created value for the humidity to the client
 */
HumidityCharacteristic.prototype.onReadRequest = function(offset, callback) {
    console.log("Get random value for humidity");
    // create random value
    createRandomValue(0.01, 0.1);
    // return value to master
    callback(this.RESULT_SUCCESS, new Buffer(humidity));
};

/**
 * Override prototype method onSubscribe from class bleno.Characteristic
 * This method is called if the master subscribes to the characteristic so it gets a new value every 2s interval.
 * Creates a random number between within a min and max range and subtracts the value from the actual humidity value
 */
HumidityCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    // creates interval function
    this.intervalId = setInterval(function() {
        console.log("Get random value for humidity");
        // get random value
        createRandomValue(0.01, 0.1);
        // send data to master
        updateValueCallback(new Buffer(humidity));
        // wait 2s
    }, 2000);
};

/**
 * Override prototype method onUnsubscribe from class bleno.Characteristic
 * This method is called if the master unsubscribes from the characteristic.
 * Interval is cleared and no data will be transmitted
 */
HumidityCharacteristic.prototype.onUnsubscribe = function() {
    clearInterval(this.intervalId);
};

/**
 * Function creates a new value with a random value within the range of min and max.
 * This values is either added or subtracted from the base value of humidity
 * @param min Minimum range
 * @param max Maximum range
 */
function createRandomValue(min, max) {
    console.log("Get randomized value for humidity");
    // create random value
    var delta = (Math.random() * (max - min) + min).toFixed(2);
    // check if even
    if( (delta % 2) === 0) {
        // add the value to actual bae
        humidity = humidity + delta;
    } else {
        // subtract the value from actual base
        humidity = humidity - delta;
    }
    console.log("Humidity: " + humidity + " %");
}

// export class as HumidityCharacteristic
module.exports = HumidityCharacteristic;