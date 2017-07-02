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

// import os library to test operating system
var os = require('os');

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
    uuid: '34CD',
    value: null,
    properties: ['read'],
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
  // check operating system to be linux
  if (os.platform() === 'linux') {
    // execute child process and get ip address from stdout
    exec("hostname -i", function (error, stdout, stderr) {
      // read data from console
      this.value = new Buffer([stdout.toString("utf-8")]);
      // e.g. 192.168.14.23
      if(this.value != null) {
        console.log(this.value);
      } else {
        console.log("Value is null!");
      }
      callback(this.RESULT_SUCCESS, this.value);
      
    });
  } else {
    
    callback(this.RESULT_SUCCESS, new Buffer("No ip found!"));
  }
};

// export class as IPAddressCharacteristic
module.exports = IPAddressCharacteristic;
             