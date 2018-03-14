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

/**
 * Module dependencies
 *
 */
const bleno = require('bleno');
const util = require('util');

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

    // class method to get next value from array at position index
    this.getNextValueFromArray = function () {
        console.log("Get next value:");

        let value = this.array[this.index];

        console.log(this.index + ". value: " + value);

        this.index = this.index + 1;

        if (this.index >= this.array.length) {
            this.index = 0;
        }
        return value;
    };

    this.createRandomIntValueInRange = function () {
        console.log("Get randomized INT value:");
        // create random value
        let value = parseInt(Math.floor((Math.random() * (this.max - this.min) + this.min)));

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
        let charType = this.characteristicType;
        let dataType = this.data;
        let precision = this.precision;
        const self = this;

        this.intervalId = setInterval(function () {
            console.log("Get next value:");

            if (charType === 'array') {
                postValue = arrayContainer[arrayIndex];
                console.log(arrayIndex + ". value: " + postValue);

                arrayIndex = arrayIndex + 1;

                if (arrayIndex >= arrayContainer.length) {
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
            let data;

            if (dataType === 'int') {
                // convert value to UInt16BigEndian
                data = new Buffer.alloc(2);
                data.writeUInt16BE(postValue, 0);
            } else {
                data = new Buffer(8);
                data.write('' + postValue, 0);
            }

            updateValueCallback(data);

        }, this.interval);
    };
};

/**
 * Override prototype method onReadRequest from class bleno.Characteristic
 * This method is called if the master initiates an onReadRequest on the body sensor location type.
 * Creates a random number between 0 and 7 which are used for the position on the body
 */
BLECharacteristic.prototype.onReadRequest = function (offset, callback) {
    console.log("Read");
    console.log("Log: type type: " + this.characteristicType);
    console.log("Log: data type: " + this.datatype);
    console.log("Log: offset: " + offset);
    console.log("Log: value: " + this.value);

    if (this.characteristicType === 'base') {

        switch (this.datatype) {
            case "float":
                // create random value
                postValue = this.createRandomFloatValueFromBase();
                break;

            case "int":
                // create random value
                postValue = this.createRandomIntValueFromBase();
                break;
        }
    }

    if (this.characteristicType === 'array') {

        postValue = this.getNextValueFromArray();
    }

    if (this.characteristicType === 'range') {
        switch (this.datatype) {
            case "float":
                // create random value
                postValue = this.createRandomFloatValueInRange();
                break;

            case "int":
                // create random value
                postValue = this.createRandomIntValueInRange();
                break;
        }
    }

    let data;

    if(this.characteristicType === 'single') {
        switch(this.datatype) {
            case 'uint8':
                data = new Buffer([this.value]); //.writeUInt8(this.value, 0);

                break;
            case 'uint16':
                data.writeUInt16LE(this.value, 0);
        }
        callback(this.RESULT_SUCCESS, data);
    }

    if (this.data === 'int') {
        data = new Buffer.alloc(2);
        data.writeInt16BE(postValue, 0);
    } else {
        data = new Buffer(8);
        data.write('' + postValue, 0);
    }
    // send value to client
    callback(this.RESULT_SUCCESS, data);
};

// Accept a new value for the type's value
BLECharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    this.value = data;
    console.log('Write request: value = ' + this.value.toString("utf-8"));
    callback(this.RESULT_SUCCESS);
};


/**
 * Override prototype method onSubscribe from class bleno.Characteristic
 * This method is called if the master subscribes to the type so it gets a new value every 2s interval.
 * Creates a random number between 1 and 6 and adds or substracts the value form the heartRate value
 */
BLECharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {

    console.log("Notify");
    console.log("Interval:" + this.interval);
    console.log("Log: type type: " + this.characteristicType);
    console.log("Log: data type: " + this.data);

    clearInterval(this.intervalId);
    // creates interval function and updates values inside at specific interval time
    this.notificationInterval(updateValueCallback);
};

/**
 * Override prototype method onUnsubscribe from class bleno.Characteristic
 * This method is called if the master unsubscribes from the type.
 * Interval is cleared and no data will be transmitted
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
        data: this.data,
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