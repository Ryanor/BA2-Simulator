/**
* Class IPAddressCharacteristic extends bleno.Characteristic class
* IPAddressCharacteristic include child process calls to get actual ip address
* IPAddressCharacteristic is a self defined test characteristic
*
* @author gwu
* @version 1.0
*/

// import utility library to build classes
var util = require('util');

// import ip library to get ip address
var ip = require('ip');

// uses child process library to open a command shell and execute system commands
var exec = require('child_process').exec;

// import bleno module for bluettoth low energy communication
var bleno = require('bleno');

// predefine the included descriptors of the service
var Descriptor = bleno.Descriptor;

// create the Characteristic class which the battery level characteristic inherits from
var Characteristic = bleno.Characteristic;

/**
* Constructor for IPAddressCharacteristic calls constructor from the parent class Characteristic
* Defines the UUID for the characteristic
* Includes descriptors used
*/ 
var IPAddressCharacteristic = function() {
  IPAddressCharacteristic.super_.call(this, {
    uuid: '34XY',
    value: null,
    properties: ['read','write'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Actual IP-Address of the slave'
      })
    ]
  });
};

// define inhertance
util.inherits(IPAddressCharacteristic, Characteristic);


/**
* Override prototype method onReadRequest from class bleno.Characteristic 
* This method is called if the master initiates an onReadRequest on the battery level characteristic.
* We check the os if the application runs on linux, and if so, return the actual battery level
*/
IPAddressCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log("Get IP address of device");
  var address = ip.address();
  console.log("IP: " + address);
  callback(this.RESULT_SUCCESS, new Buffer(address));
};

// Accept a new value for the characterstic's value
IPAddressCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this.value = data;
  console.log('Write request: value = ' + this.value.toString("utf-8"));
  callback(this.RESULT_SUCCESS);
};

// export class as IPAddressCharacteristic
module.exports = IPAddressCharacteristic;
             