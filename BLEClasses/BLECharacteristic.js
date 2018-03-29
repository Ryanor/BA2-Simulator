/**
 * Class BLECharacteristic is the base class for all Characteristics and extends bleno.Characteristic class
 * BLECharacteristic provides functions to propagate the value to the client device.
 *
 * @class BLECharacteristic
 * @extends bleno
 * @constructor
 * @param {Object} params Object params contains characteristic data and descriptors array
 * params             Object of parameters including
 * uuid ............. Characteristic UUID
 * value ............ Value for value, usually null
 * properties ....... Array of properties: read, write and notify
 * descriptors ...... Array of descriptors for the type
 * data ............. Data type : Integer, Float or String (Buffer)
 * values ........... Array containing an amount of values for read or notify
 * interval ......... Notification interval in ms
 * offset ........... Offset used for some data types
 * type ... Kinds of characteristic types which are sent by the type
 *      array of values
 *      random values: random values within a range min and max
 *      base values: created from a start value stepping up and down within a range min and max
 *
 * @author gwu
 * @version 1.0
 */

// Module dependencies
const bleno = require('bleno');
const util = require('util');
const BLEUtilities = require('./BLEUtilities');

// define a variable for the bleno modul base class
const Characteristic = bleno.Characteristic;

// index counter for the values array
let arrayIndex = 0;

// variable for the value which is being sent to the client
let postValue;

/**
 * Constructor for BLECharacteristic calls super constructor from parent class bleno.Characteristic
 *
 * params             Object of parameters including
 * uuid ............. Characteristic UUID
 * value ............ Value for value, usually null
 * properties ....... Array of properties: read, write and notify
 * descriptors ...... Array of descriptors for the type
 * data ............. Data type : Integer, Float or String (Buffer)
 * values ........... Array containing an amount of values for read or notify
 * interval ......... Notification interval in ms
 * offset ........... Offset used for some data types
 * type ... Kinds of characteristic types which are sent by the type
 *      array of values
 *      random values: random values within a range min and max
 *      base values: created from a start value stepping up and down within a range min and max
 */
const BLECharacteristic = function (params) {
    BLECharacteristic.super_.call(this, {
        /**
         * @property uuid
         * @type String
         */
        uuid: params.uuid,
        /**
         * @property value
         * @type String|Number
         * @default null
         */
        value: params.value,
        /**
         * @property properties
         * @type Array
         */
        properties: params.properties,
        /**
         * @property descriptors
         * @type Array
         */
        descriptors: params.descriptors
    });

    /**
     * @property datatype
     * @type String
     */
    this.datatype = params.datatype;

    /**
     * @property interval
     * @type number
     * @default 1000
     */
    this.interval = params.interval;

    /**
     * @property characteristicType
     * @type String
     */
    this.characteristicType = params.characteristicType;

    /**
     * @property offset
     * @type Number
     */
    this.offset = params.offset || 0;

    /**
     * @property values
     * @type Array
     */
    this.array = params.values;

    /**
     * @property base
     * @type Number
     */
    this.base = params.base || 0;

    /**
     * @property min
     * @type Number
     */
    this.min = params.min || 0;

    /**
     * @property max
     * @type Number
     */
    this.max = params.max || 0;

    /**
     * @property index
     * @type Number
     * @default 0
     */
    this.index = 0;

    /**
     * Function returns next value at current index position from the array of values.
     * If last position is reached the index starts from position 0 again.
     *
     * @method getNextValueFromArray
     * @return {*} value Actual value at index position
     */
    this.getNextValueFromArray = function () {
        let value = this.array[this.index];

        this.index ++;

        if (this.index >= this.array.length) {
            this.index = 0;
        }
        return value;
    };

    /**
     * Function creates a random integer number within the min and max values.
     *
     * @method createRandomIntValueInRange
     * @return {number} value Random value
     */
    this.createRandomIntValueInRange = function () {
        console.log("Get randomized range INT value:");
        // create random value
        let value = parseInt(Math.floor((Math.random() * (this.max - this.min) + this.min)));

        console.log("INT: " + value);
        return value;
    };

    /**
     * Function creates a random integer number, which starts at the base value
     * and steps up and down at the range of the min and max values.
     *
     * @method createRandomIntValueFromBase
     * @return {number} this.base New base value
     */
    this.createRandomIntValueFromBase = function () {
        console.log("Get randomized base INT value:");
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

    /**
     * Function creates a random float number within the min and max values.
     *
     * @method createRandomFloatValueInRange
     * @return {number} value Random value
     */
    this.createRandomFloatValueInRange = function () {
        console.log("Get randomized range FLOAT value");
        // create random value
        let value = (Math.random() * (this.max - this.min) + this.min).toFixed(2);

        console.log("FLOAT: " + value);
        return value;
    };

    /**
     * Function creates a random float number , which starts at the base value
     * and steps up and down within the range of the min and max values.
     *
     * @method createRandomFloatValueFromBase
     * @return {number} this.base New base value
     */
    this.createRandomFloatValueFromBase = function () {
        console.log("Get randomized base FLOAT value");
        // create random value
        const delta = (Math.random() * (this.max - this.min) + this.min).toFixed(2);
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

    /**
     * Function is called from onSubscribe to send data to the client within an specified interval.
     * This can't be done from the onSubscribe function because of callback issues about the current value.
     * Loops inside the setInterval function till the client unsubscribes.
     *
     * @method notificationInterval
     * @param updateValueCallback Callback function
     */
    this.notificationInterval = function (updateValueCallback) {
        // used to get 'this' to the next scope
        const self = this;

        this.intervalId = setInterval(function () {
            console.log("Get next value:");

            switch (self.characteristicType) {
                case 'single':
                    postValue = self.value;
                    break;

                case 'array':
                    postValue = self.array[self.index];
                    console.log(self.index + ". value: " + postValue);

                    self.index++;

                    if (self.index >= self.array.length) {
                        self.index = 0;
                    }
                    break;

                case 'base':
                    if (self.datatype === 'float') {
                        postValue = self.createRandomFloatValueFromBase().toFixed(2);
                    } else {
                        postValue = self.createRandomIntValueFromBase();
                    }

                    break;

                case 'range':
                    if (self.datatype === 'float') {
                        postValue = self.createRandomFloatValueInRange().toFixed(2);
                    } else {
                        postValue = self.createRandomIntValueInRange();
                    }
                    break;
            }

            // convert value to correct buffer type
            let data;

            data = BLEUtilities.writeBuffer(postValue, self.datatype);
            updateValueCallback(data);

        }, this.interval);
    };
};

/**
 * Overrides prototype method onReadRequest from class bleno.Characteristic
 * This method is called if the master initiates an onReadRequest.
 * Depeding on the characteristic type the function returns random numbers,
 * a number from an array or the characteristic value.
 *
 * @method onReadRequest
 * @param offset Offset for the data
 * @param callback Callback function
 */
BLECharacteristic.prototype.onReadRequest = function (offset, callback) {
    console.log("Read request");

    switch (this.characteristicType) {
        case 'single':
            console.log("Single type access...");
            postValue = this.value;
            break;

        case 'array':
            console.log("Array type access...");
            postValue = this.getNextValueFromArray();
            break;

        case 'base':
            console.log("Base type access...");
            if (this.datatype === "float") {
                postValue = this.createRandomFloatValueFromBase();
            } else {
                postValue = this.createRandomIntValueFromBase();
            }
            break;

        case 'range':
            console.log("Range type access...");
            if (this.datatype === "float") {
                postValue = this.createRandomFloatValueInRange();
            } else {
                postValue = this.createRandomIntValueInRange();
            }
            break;

        default:
    }

    let data;
    data = BLEUtilities.writeBuffer(postValue, this.datatype);

    // send value to client
    callback(this.RESULT_SUCCESS, data);
};

/**
 * Function receives data from the client and updates the actual value of the characteristic.
 *
 * @method onWriteRequest
 * @param data Received data from the client
 * @param offset Offset for the data
 * @param withoutResponse Parameter to write value without sending an acknowledgement to the client.
 * @param callback Callback function
 */
BLECharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    this.value = data;
    console.log('Write request: value = ' + this.value.toString());
    callback(this.RESULT_SUCCESS);
};


/**
 * Override prototype method onSubscribe from class bleno.Characteristic
 * This method is called if the client subscribes to the characteristic notification to receive new value.
 * New values are sent after an interval time.
 *
 * @method onSubscribe
 * @param maxValueSize Maximum size of the value
 * @param updateValueCallback Callback function
 */
BLECharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {

    console.log("Notify");
    console.log("Interval:" + this.interval);

    clearInterval(this.intervalId);
    // creates interval function and updates values within a specified interval time
    this.notificationInterval(updateValueCallback);
};

/**
 * Override prototype method onUnsubscribe from class bleno.Characteristic
 * This method is called if the client unsubscribes from the characteristic.
 * IntervalID is cleared and no further data is sent.
 *
 * @method onUnsubscribe
 */
BLECharacteristic.prototype.onUnsubscribe = function () {
    clearInterval(this.intervalId);
};

/**
 * Function toString returns a textual representation of a characteristic and its containing descriptors.
 *
 * @method toString
 * @return {String} string
 */
BLECharacteristic.prototype.toString = function () {
    return JSON.stringify({
        uuid: this.uuid,
        properties: this.properties,
        datatype: this.datatype,
        value: this.value,
        array: this.array,
        interval: this.interval,
        characteristicType: this.characteristicType,
        descriptors: this.descriptors
    });
};

util.inherits(BLECharacteristic, Characteristic);

// export class as BLECharacteristic
module.exports = BLECharacteristic;