/**
 * Class BLECharacteristic is the base class for all Characteristics and extends bleno.Characteristic class
 * BLECharacteristic provides functions to propagate the value to the client device.
 *
 * @author gwu
 * @version 0.1
 */

// import utility library to build classes
var util = require('util');

// import bleno module for bluettoth low energy communication
var bleno = require('bleno');

// predefine the included descriptors of the service
var Descriptor = bleno.Descriptor;

// create the Characteristic class which the battery level characteristic inherits from
var Characteristic = bleno.Characteristic;

var index = 0;

/**
 * Constructor for BLECharacteristic calls super constructor from parent class bleno.Characteristic
 *
 */
var BLECharacteristic = function(params) {
    BLECharacteristic.super_.call(this, {
        uuid: params.uuid,
        value: null,
        properties: params.properties,
        descriptors: params.descriptors
    });

    this.type = params.type;
    this.values = params.values;
    this.interval = params.interval;
    this.characteristic = 'random';
};

/**
 * Override prototype method onReadRequest from class bleno.Characteristic
 * This method is called if the master initiates an onReadRequest on the body sensor location characteristic.
 * Creates a random number between 0 and 7 which are used for the position on the body
 */
BLECharacteristic.prototype.onReadRequest = function(offset, callback) {

    if(this.characteristic === 'random') {
        // create random value
        createRandomValue(0.01, 0.1);
    }
    if(this.characteristic === 'values') {
        getNextValue();
        index = index + 1;
    }

    // send value to client
    callback(this.RESULT_SUCCESS, new Buffer(this.value));
};

/**
 * Override prototype method onSubscribe from class bleno.Characteristic
 * This method is called if the master subscribes to the characteristic so it gets a new value every 2s interval.
 * Creates a random number between 1 and 6 and adds or substracts the value form the heartRate value
 */
BLECharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    // creates interval function
    this.intervalId = setInterval(function() {
        if(this.characteristic === 'random') {
            // create random value
            createRandomValue(0.01, 0.1);
        }
        if(this.characteristic === 'values') {
            getNextValue();
            index = index + 1;
        }
        // notify client value changed
        updateValueCallback(new Buffer(this.value));

        // wait interval ms
    }, this.interval);
};

/**
 * Override prototype method onUnsubscribe from class bleno.Characteristic
 * This method is called if the master unsubscribes from the characteristic.
 * Interval is cleared and no data will be transmitted
 */
BLECharacteristic.prototype.onUnsubscribe = function() {
    clearInterval(this.intervalId);
};

Characteristic.prototype.toString = function() {
    return JSON.stringify({
        uuid: this.uuid,
        properties: this.properties,
        type: this.type,
        value: this.value,
        values: this.values,
        interval: this.interval,
        characteristic : this.characteristic,
        descriptors: this.descriptors
    });
};

function getNextValue() {

    if(index > this.values.length || index < 0) {
        index = 0;
    }
    this.value = this.values[index];
}

function createRandomValue(min, max) {
    console.log("Get randomized value for humidity");
    // create random value
    var delta = (Math.random() * (max - min) + min).toFixed(2);
    // check if even
    if( (delta % 2) === 0) {
        // add the value
        this.value = this.value + delta;
    } else {
        // substract the value
        this.value = this.value - delta;
    }
    console.log("Humidity: " + this.value + " %");
}


util.inherits(BLECharacteristic, Characteristic);

// export class as BLECharacteristic
module.exports = BLECharacteristic;