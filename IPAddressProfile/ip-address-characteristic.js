/**
 * Class IPAddressCharacteristic extends bleno. Characteristic class
 * IPAddressCharacteristic is used to get the actual ip address
 * of the Raspberry Pi 3 and make it visible as a self defined service.
 *
 * @class ip-address-characteristic
 * @uses bleno
 * @uses utils
 * @extends bleno
 *
 * @constructor IPAddressCharacteristic
 * @param {Object} characteristic Object containing all characteristic data
 *
 * @author gwu
 * @version 1.0
 */
// Module dependencies
const bleno = require('bleno');
const util = require('util');
const ip = require('ip');

// get actual ip address
const address = ip.address();

// create descriptor from the modul bleno base class
const Descriptor = bleno.Descriptor;

// create characteristic from the modul bleno base class
const Characteristic = bleno.Characteristic;

/**
 * Constructor for IPAddressCharacteristic calls constructor from the parent class Characteristic
 * Defines the UUID for the characteristic
 * Includes descriptors
*/
const IPAddressCharacteristic = function() {
  IPAddressCharacteristic.super_.call(this, {
    uuid: '34BD',
    value: address,
    properties: ['read'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Actual IP-Address of the Raspberry Pi 3.'
      })
    ]
  });
};

// inherit form bleno base class
util.inherits(IPAddressCharacteristic, Characteristic);

/**
 * Override prototype method onReadRequest from class bleno.Characteristic
 * This method is called if the master initiates an onReadRequest on the ip address characteristic.
 *
 * @method onReadRequest
 * @param {Number} offset Offset for writing data to the buffer
 * @param {Object} callback Callback function
 * @for ip-address-characteristic
 */
IPAddressCharacteristic.prototype.onReadRequest = function(offset, callback) {
  callback(this.RESULT_SUCCESS, new Buffer(this.value));
};

// export class as IPAddressCharacteristic
module.exports = IPAddressCharacteristic;
             