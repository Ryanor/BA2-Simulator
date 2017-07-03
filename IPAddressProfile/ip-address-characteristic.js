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
  // check operating system to be linux
 
  if (os.platform() === 'linux') {
    // execute child process and get ip address from stdout
    exec("hostname -i", function (error, stdout, stderr) {
    console.log("Get ip address from slave");
    // read data from console
    var data = new Buffer(stdout.toString("utf-8").trim());
    // e.g. 192.168.14.23
    // if more than two ip addresses are available take the first one
    console.log(data);
    //if(data.length > 15) {
      //  data = data.split(' ')[0];
    //} 
    //console.log("IP address: " + data);
    // return value to master
    console.log(data.toString());
    callback(this.RESULT_SUCCESS, data);
    });
  } else {
    callback(this.RESULT_SUCCESS, new Buffer("No ip found!"));
  }
};

// Accept a new value for the characterstic's value
IPAddressCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this.value = data;
  console.log('Write request: value = ' + this.value.toString("utf-8"));
  callback(this.RESULT_SUCCESS);
};

// export class as IPAddressCharacteristic
module.exports = IPAddressCharacteristic;
             