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
const Characteristic = bleno.Characteristic;

// index counter for the values array
let arrayIndex = 0;

// variable for the value which is being sent to the client
let postValue;


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
    this.base = params.start || 0;
    // minimum value for step
    this.min = params.min || 1;
    // maximum value for step
    this.max = params.max || 6;

    this.index = 0;

    // class method to get next value from array at position index
    this.getNextValueFromArray = function () {
        console.log("Get next value:");

        let value = this.array[this.index];

        console.log(this.index + ". value: " + value);

        this.index = this.index + 1;

        if(this.index >= this.array.length) {
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

    this.createRandomIntValueFromBase = function () {
        console.log("Get randomized INT value:");
        // create random value
        const delta = parseInt(Math.floor((Math.random() * (this.max - this.min) + this.min)));
        // check if even
        if ((delta % 2) === 0) {
            // add the value
            this.base = this.base + delta;
        } else {
            // subtract the value
            this.base = this.base - delta;
        }

        console.log("INT: " + this.base);
        return this.base;
    };

    this.createRandomFloatValueInRange = function () {
        console.log("Get randomized FLOAT value");
        // create random value
        let value = (Math.random() * (this.max - this.min) + this.min).toFixed(this.precision);

        console.log("FLOAT: " + value);
        return value;
    };

    this.createRandomFloatValueFromBase = function () {
        console.log("Get randomized FLOAT value");
        // create random value
        const delta = (Math.random() * (this.max - this.min) + this.min).toFixed(this.precision);
        // check if even
        if ((delta % 2) === 0) {
            // add the value
            this.base = this.base + delta;
        } else {
            // subtract the value
            this.base = this.base - delta;
        }

        console.log("FLOAT: " + this.base);
        return this.base;
    };

    this.notificationInterval = function (updateValueCallback) {
        let arrayContainer = this.array;
        let charType = this.characteristic;
        let dataType = this.data;
        let precision = this.precision;
        const self = this;

        this.intervalId = setInterval(function () {
            console.log("Get next value:");

            if(charType === 'array') {
                postValue = arrayContainer[arrayIndex];
                console.log(arrayIndex + ". value: " + postValue);

                arrayIndex = arrayIndex + 1;

                if(arrayIndex >= arrayContainer.length) {
                    arrayIndex = 0;
                }
            }

            if (charType === 'base') {
                switch (dataType) {
                    case "float":
                        // create random value
                        postValue = self.createRandomFloatValueFromBase().toFixed(precision);
                        break;

                    case "int":
                        // create random value
                        postValue = self.createRandomIntValueFromBase().toFixed(precision);
                        break;

                    default:
                }
            }

            if (charType === 'range') {
                switch (dataType) {
                    case "float":
                        // create random value
                        postValue = self.createRandomFloatValueInRange().toFixed(precision);
                        break;

                    case "int":
                        // create random value
                        postValue = self.createRandomIntValueInRange().toFixed(precision);
                        break;

                    default:
                }
            }

            // convert value to correct buffer type
            let data = new Buffer(4);

            if (dataType === 'int') {
                // convert value to UInt16BigEndian
                data.writeUInt16BE(postValue, 0);
            } else {
                let value = parseInt((postValue * 100) , 10);
                data = new Buffer(4);
                data.writeUInt32BE(value, 0);
            }

            updateValueCallback(data);
        }, this.interval);
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
    console.log("Log: offset: " + offset);

    if (this.characteristic === 'base') {

        switch (this.data) {
            case "float":
                // create random value
                this.createRandomFloatValueFromBase();
                break;

            case "int":
                // create random value
                this.createRandomIntValueFromBase();
                break;

            default:
        }
    }

    if (this.characteristic === 'array') {

        postValue = this.getNextValueFromArray();
    }

    if (this.characteristic === 'range') {
        switch (this.data) {
            case "float":
                // create random value
                postValue = this.createRandomFloatValueInRange();
                break;

            case "int":
                // create random value
                postValue = this.createRandomIntValueInRange();
                break;

            default:
        }
    }

    if(this.data === 'int' && this.characteristic === 'array') {
        let data = new Buffer(4);
        data.writeInt16BE(postValue, 0);

        // send value to client
        callback(this.RESULT_SUCCESS, data);
    } else {
        let value = parseInt((postValue * 100), 10);
        let data = new Buffer(4);
        data.writeUInt16BE(value, 0);
        // send value to client
        callback(this.RESULT_SUCCESS, data);
    }
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

    console.log("Notify");
    console.log("Interval:" + this.interval);
    console.log("Log: characteristic type: " + this.characteristic);
    console.log("Log: data type: " + this.data);

    clearInterval(this.intervalId);
    // creates interval function and updates values inside at specific interval time
    this.notificationInterval(updateValueCallback);
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
        interval: this.interval,
        characteristic: this.characteristic,
        descriptors: this.descriptors
    });
};

util.inherits(BLECharacteristic, Characteristic);

// export class as BLECharacteristic
module.exports = BLECharacteristic;