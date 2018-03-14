/**
 * Class IPAddressCharacteristic extends bleno.Characteristic class
 * IPAddressCharacteristic include child process calls to get actual ip address
 * IPAddressCharacteristic is a self defined test characteristic
 *
 * @author gwu
 * @version 1.0
 */
const util = require('util');

// import ip library to get ip address
const ip = require('ip');
// get actual ip address
const address = ip.address();

// import bleno module for bluettoth low energy communication
const bleno = require('bleno');

// predefine the included descriptors of the service
const Descriptor = bleno.Descriptor;

// create the Characteristic class which the battery level characteristic inherits from
const Characteristic = bleno.Characteristic;

/**
* Constructor for IPAddressCharacteristic calls constructor from the parent class Characteristic
* Defines the UUID for the characteristic
* Includes descriptors used
*/
const IPAddressCharacteristic = function() {
  IPAddressCharacteristic.super_.call(this, {
    uuid: '34XY',
    value: address,
    properties: ['read'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Actual IP-Address of the server'
      })
    ]
  });
};

// inherit form bleno base class
util.inherits(IPAddressCharacteristic, Characteristic);

/**
* Override prototype method onReadRequest from class bleno.Characteristic 
* This method is called if the master initiates an onReadRequest on the battery level characteristic.
* We check the os if the application runs on linux, and if so, return the actual battery level
*/
IPAddressCharacteristic.prototype.onReadRequest = function(offset, callback) {
  callback(this.RESULT_SUCCESS, new Buffer(this.value));
};

// export class as IPAddressCharacteristic
module.exports = IPAddressCharacteristic;
             