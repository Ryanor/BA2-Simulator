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
var humidity = 50;

/**
 * Constructor for HeartRateMeasurementCharacteristic calls constructor from the parent class Characteristic
 * Defines the UUID for the characteristic
 * Includes descriptors used
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
            }),
            new Descriptor({
                uuid: '2904',
                // uint16, exponent -2, unit uuid 0x27AD for percent, namespace, organization
                value : new Buffer([0x06, 0x00, 0x27, 0xAD, 0x01, 0x00, 0x00])
            })
        ]
    });
};

// define inhertance
util.inherits(HumidityCharacteristic, Characteristic);

/**
 * Override prototype method onReadRequest from class bleno.Characteristic
 * This method is called if the master initiates an onReadRequest on the body sensor location characteristic.
 * Creates a random number between 0 and 7 which are used for the position on the body
 */
HumidityCharacteristic.prototype.onReadRequest = function(offset, callback) {
    console.log("Get random value for humidity");
    // create random value
    createRandomValue(0.01, 0.1);
    humidity = humidity.toFixed(2);
    console.log("Humidity: " + humidity + " %");
    var data = new Buffer(2);
    data.writeUInt16LE(parseInt((humidity * 100), 10), 0);
    // crete buffer and write value into it
    // return value to master
    callback(this.RESULT_SUCCESS, data); //new Buffer(humidity));
};

/**
 * Override prototype method onSubscribe from class bleno.Characteristic
 * This method is called if the master subscribes to the characteristic so it gets a new value every 2s interval.
 * Creates a random number between 1 and 6 and adds or substracts the value form the heartRate value
 */
HumidityCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    // creates interval function
    this.intervalId = setInterval(function() {
        console.log("Get random value for humidity");
        // get random value
        createRandomValue(0.01, 0.1);
        humidity = humidity.toFixed(2);
        console.log("Humidity: " + humidity + " %");
        // crete buffer and write value into it
        var data = new Buffer(2);
        data.writeUInt16LE(parseInt((humidity * 100), 10), 0);
        // send data to master
        updateValueCallback(data); //new Buffer(humidity));
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


function createRandomValue(min, max) {
    console.log("Get randomized value for humidity");
    // create random value
    var delta = Math.random() * (max - min) + min;
    // check if even
    if( (delta % 2) === 0) {
        // add the value
        humidity = humidity + delta;
    } else {
        // substract the value
        humidity = humidity - delta;
    }
    //console.log("Humidity: " + humidity + " %");
}

// export class as HeartRateMeasurementCharacteristic
module.exports = HumidityCharacteristic;