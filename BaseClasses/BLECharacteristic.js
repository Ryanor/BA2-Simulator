/**
 * Class BLECharacteristic is the base class for all Characteristics and extends bleno.Characteristic class
 * BLECharacteristic provides functions to propagate the value to the client device.
 *
 * @author gwu
 * @version 0.1
 */
const util = require('util');

// import bleno module for bluetooth low energy communication
const bleno = require('bleno');

// create the Characteristic class which the battery level characteristic inherits from
//const Characteristic = bleno.Characteristic;

// array for values
//let array;

// index counter for the values array
//let index = 0;

// variable for the value which is being sent to the client
let postValue;

// notification interval time
//var interval;

/**
 * Constructor for BLECharacteristic calls super constructor from parent class bleno.Characteristic
 *
 * @param params      Object of parameters including
 * uuid ............. Characteristic UUID
 * value ............ Value for value, usually null
 * properties ....... Array of properties: read, write and notify
 * descriptors ...... Array of descriptors for the characteristic
 * data ............. Data type : Integer, Float or String (Buffer)
 * values ........... Array containing an amount of values for read or notify
 * interval ......... Notification interval in ms
 * precision ........ Digits after the comma, for float values
 * characteristic ... Kind of data types which are sent by the characteristic
 *      array of values
 *      random values: created from a start value stepping up and down within a range min and max
 *
 */
const BLECharacteristic = function (params) {
    BLECharacteristic.super_.call(this, {
        uuid: params.uuid,
        value: null,
        properties: params.properties,
        descriptors: params.descriptors
    });

    // data type of value
    this.data = params.data;
    // notification interval time
    this.interval = params.interval;
    // type of the characteristic
    this.characteristic = params.characteristic || 'random';
    // number of digits for float values after the comma
    this.precision = params.precision || 0;

    // values array
    this.array = params.values;
    // base value
    postValue = params.start || 0;
    // minimum value for step
    this.min = params.min || 1;
    // maximum value for step
    this.max = params.max || 6;

    // index counter for the values array
    this.index = 0;


    // class method to get next value from array at position index
    this.getNextValue = function() {
        console.log("Get next value:");

        let value = this.array[this.index];

        console.log(this.index + ". value: " + value);
        
        this.index = this.index + 1;

        if(this.index > this.array.length) {
            this.index = 0;
        }
        return value;
    };

    this.createRandomIntValueInRange = function () {
        console.log("Get randomized INT value:");
        // create random value

        let value =  parseInt(Math.floor((Math.random() * (this.max - this.min) + this.min)));

        console.log("INT: " + value);
        return value;
    };
};

/**
 * Override prototype method onReadRequest from class bleno.Characteristic
 * This method is called if the master initiates an onReadRequest on the body sensor location characteristic.
 * Creates a random number between 0 and 7 which are used for the position on the body
 */
BLECharacteristic.prototype.onReadRequest = function (offset, callback) {
    console.log("Read");
    console.log("Log: characteristic type: " + this.characteristic);
    console.log("Log: data type: " + this.data);

    if (this.characteristic === 'base') {

        switch (this.data) {
            case "float":
                // create random value
                createRandomFloatValueFromBase(this.min, this.max, this.precision);
                break;

            case "int":
                // create random value
                createRandomIntValueFromBase(this.min, this.max);
                break;

            default:
        }
    }

    if (this.characteristic === 'array') {

        postValue = this.getNextValue();
    }

    if (this.characteristic === 'range') {
        switch (this.data) {
            case "float":
                // create random value
                createRandomFloatValueInRange(this.min, this.max, this.precision);
                break;

            case "int":
                // create random value
                postValue = this.createRandomIntValueInRange();
                break;

            default:
        }
    }

    // send value to client
    callback(this.RESULT_SUCCESS, new Buffer([postValue]));
};

// Accept a new value for the characteristic's value
BLECharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    this.value = data;
    console.log('Write request: value = ' + this.value.toString("utf-8"));
    callback(this.RESULT_SUCCESS);
};


/**
 * Override prototype method onSubscribe from class bleno.Characteristic
 * This method is called if the master subscribes to the characteristic so it gets a new value every 2s interval.
 * Creates a random number between 1 and 6 and adds or substracts the value form the heartRate value
 */
BLECharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
    // create new Buffer for value
    const data = new Buffer(2);
    // set interval time
    const interval = this.interval;

    const dataType = this.data;
    const charType = this.characteristic;
    const minimum = this.min;
    const maximum = this.max;
    const precision = this.precision;

    console.log("Notify");
    console.log("Interval:" + this.interval);
    console.log("Log: characteristic type: " + charType);
    console.log("Log: data type: " + dataType);
    console.log("Max value size: " + maxValueSize);

    // creates interval function and updates values inside at specific interval time
    this.intervalId = setInterval(function () {

        if (charType === 'base') {
            switch (dataType) {
                case "float":
                    // create random value
                    createRandomFloatValueFromBase(minimum, maximum, precision);
                    break;

                case "int":
                    // create random value
                    createRandomIntValueFromBase(minimum, maximum);
                    break;

                default:
            }
        }

        if (charType === 'range') {
            switch (dataType) {
                case "float":
                    // create random value
                    createRandomFloatValueInRange(minimum, maximum, precision);
                    break;

                case "int":
                    // create random value
                    postValue = this.createRandomIntValueInRange();
                    break;

                default:
            }
        }

        if (charType === 'array') {
            postValue = this.getNextValue();
        }

        // convert value to correct buffer type
        if (dataType === 'int') {

            // convert value to UInt16BigEndian
            data.writeUInt16BE(postValue, precision);

        } else {
            // convert value to FloatBigEndian
            data.writeFloatBE(postValue, precision, false);
        }
        // notify client value changed
        updateValueCallback(data);

        // wait interval ms
    }, interval);
};

/**
 * Override prototype method onUnsubscribe from class bleno.Characteristic
 * This method is called if the master unsubscribes from the characteristic.
 * Interval is cleared and no data will be transmitted
 */
BLECharacteristic.prototype.onUnsubscribe = function () {
    clearInterval(this.intervalId);
};

BLECharacteristic.prototype.toString = function () {
    return JSON.stringify({
        uuid: this.uuid,
        properties: this.properties,
        data: this.data,
        value: this.value,
        array: this.array,
        // interval: interval,
        characteristic: this.characteristic,
        descriptors: this.descriptors
    });
};

function createRandomFloatValueFromBase(min, max, precision) {
    console.log("Get randomized FLOAT value");
    // create random value

    postValue = (Math.random() * (max - min) + min).toFixed(precision);

    console.log("FLOAT: " + postValue);
}

function createRandomFloatValueInRange(min, max, precision) {
    console.log("Get randomized FLOAT value");
    // create random value

    const delta = (Math.random() * (max - min) + min).toFixed(precision);
    // check if even
    if ((delta % 2) === 0) {
        // add the value
        postValue = postValue + delta;
    } else {
        // subtract the value
        postValue = postValue - delta;
    }

    console.log("FLOAT: " + postValue);
}


function createRandomIntValueFromBase(min, max) {
    console.log("Get randomized INT value:");
    // create random value

    const delta = parseInt(Math.floor((Math.random() * (max - min) + min)));
    // check if even
    if ((delta % 2) === 0) {
        // add the value
        postValue = postValue + delta;
    } else {
        // subtract the value
        postValue = postValue - delta;
    }

    console.log("INT: " + postValue);
}

util.inherits(BLECharacteristic, bleno.Characteristic);

// export class as BLECharacteristic
module.exports = BLECharacteristic;