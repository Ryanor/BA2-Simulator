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

// index counter for the values array
var index = 0;

// variable for the value which is being sent to the client
var postValue = 0;

var array = [];

/**
 * Constructor for BLECharacteristic calls super constructor from parent class bleno.Characteristic
 *
 * @param params      Object of parameters including
 * uuid ............. Characteristic UUID
 * value ............ Value for value, usually null
 * properties ....... Array of properties: read, write and notify
 * descriptors ...... Array of descriptors for the characteristic
 * type ............. Data type : Integer, Float or String (Buffer)
 * values ........... Array containing an amount of values for read or notify
 * interval ......... Notification interval in ms
 * precision ........ Digits after the comma, for float values
 * characteristic ... Kind of data types which are sent by the characteristic
 *      array of values
 *      random values: created from a start value stepping up and down within a range min and max
 *
 */
var BLECharacteristic = function (params) {
    BLECharacteristic.super_.call(this, {
        uuid: params.uuid,
        value: null,
        properties: params.properties,
        descriptors: params.descriptors
    });

    this.type = params.type;
    // values array
    array = params.values;
    // notification interval time
    this.interval = params.interval;
    // type of the characteristic
    this.characteristic = params.characteristic || 'random';
    // number of digits for float values after the comma
    this.precision = params.precision || 2;
    postValue = params.start || 0;
    this.min = params.min || 1;
    this.max = params.max || 6;
};

/**
 * Override prototype method onReadRequest from class bleno.Characteristic
 * This method is called if the master initiates an onReadRequest on the body sensor location characteristic.
 * Creates a random number between 0 and 7 which are used for the position on the body
 */
BLECharacteristic.prototype.onReadRequest = function (offset, callback) {

    if (this.characteristic === 'random') {
        switch (this.type) {
            case "float":
                // create random value
                createRandomFloatValue(0.01, 0.1, this.precision);
                break;

            case "int":
                // create random value
                createRandomIntValueFromBase(1, 6);
                break;

            default:
        }
    }

    if (this.characteristic === 'array') {
        console.log("Get next value:");

        postValue = array[index];
        index = index + 1;

        console.log(index + ".: " + postValue);

        // send value to client
        callback(this.RESULT_SUCCESS, new Buffer([postValue]));
    }

    if (this.characteristic === 'range') {
        switch (this.type) {
            case "float":
                // create random value
                createRandomFloatValue(0.01, 0.1, this.precision);
                break;

            case "int":
                // create random value
                createRandomIntValueInRange(this.min, this.max);
                break;

            default:
        }
    }

    // send value to client
    callback(this.RESULT_SUCCESS, new Buffer(postValue));
};

/**
 * Override prototype method onSubscribe from class bleno.Characteristic
 * This method is called if the master subscribes to the characteristic so it gets a new value every 2s interval.
 * Creates a random number between 1 and 6 and adds or substracts the value form the heartRate value
 */
BLECharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
    // creates interval function
    this.intervalId = setInterval(function () {
        if (this.characteristic === 'random') {
            switch (this.type) {
                case "float":
                    // create random value
                    createRandomFloatValue(0.01, 0.1, this.precision);
                    break;

                case "int":
                    // create random value
                    createRandomIntValueFromBase(this.min, this.max);

                    createRandomIntValueInRange(this.min, this.max);
                    break;

                default:
            }
        }
        if (this.characteristic === 'values') {
            console.log("Get next value:");

            postValue = array[index];
            index = index + 1;

            console.log(index + ".: " + postValue);

            // send value to client
            callback(this.RESULT_SUCCESS, new Buffer([postValue]));
        }

        if (this.characteristic === 'range') {
            switch (this.type) {
                case "float":
                    // create random value
                    createRandomFloatValue(0.01, 0.1, this.precision);
                    break;

                case "int":
                    // create random value
                    createRandomIntValueInRange(this.min, this.max);
                    break;

                default:
            }
        }

        // notify client value changed
        updateValueCallback(new Buffer(postValue));

        // wait interval ms
    }, this.interval);
};

/**
 * Override prototype method onUnsubscribe from class bleno.Characteristic
 * This method is called if the master unsubscribes from the characteristic.
 * Interval is cleared and no data will be transmitted
 */
BLECharacteristic.prototype.onUnsubscribe = function () {
    clearInterval(this.intervalId);
};

Characteristic.prototype.toString = function () {
    return JSON.stringify({
        uuid: this.uuid,
        properties: this.properties,
        type: this.type,
        value: this.value,
        values: this.values,
        interval: this.interval,
        characteristic: this.characteristic,
        descriptors: this.descriptors
    });
};


function createRandomFloatValue(min, max, precision) {
    console.log("Get randomized FLOAT value");
    // create random value

    var delta = (Math.random() * (max - min) + min).toFixed(precision);
    // check if even
    if ((delta % 2) === 0) {
        // add the value
        postValue = postValue + delta;
    } else {
        // substract the value
        postValue = postValue - delta;
    }

    console.log("FLOAT: " + postValue);
}

function createRandomIntValueFromBase(min, max) {
    console.log("Get randomized INT value:");
    // create random value

    var delta = parseInt(Math.floor((Math.random() * (max - min) + min)));
    // check if even
    if ((delta % 2) === 0) {
        // add the value
        postValue = postValue + delta;
    } else {
        // substract the value
        postValue = postValue - delta;
    }

    console.log("INT: " + postValue);
}

function createRandomIntValueInRange(min, max) {
    console.log("Get randomized INT value:");
    // create random value

    var postValue = parseInt(Math.floor((Math.random() * (max - min) + min)));

    console.log("INT: " + postValue);
}

util.inherits(BLECharacteristic, Characteristic);

// export class as BLECharacteristic
module.exports = BLECharacteristic;