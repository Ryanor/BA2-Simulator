/**
* Class BatteryLevelCharacteristic extends bleno.Characteristic class
* BatteryLevelCharacteristic include operating system calls to get actual battery level
* Uses SIG defined UUID for the characteristic
*
* @author gwu
* @version 1.0
*/

// import utility library to build classes
var util = require('util');

var async = require('async');

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

var battery = 23;

/**
* Constructor for BatteryLevelCharacteristic calls constructor from the parent class Characteristic
* Defines the UUID for the characteristic
* Includes descriptors used
*/ 
var BatteryLevelCharacteristic = function() {
  BatteryLevelCharacteristic.super_.call(this, {
    uuid: '2A19',
    value: null,
    properties: ['read'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Battery level between 0 and 100 percent'
      })
    ]
  });
};

// define inhertance
util.inherits(BatteryLevelCharacteristic, Characteristic);

/**
* Override prototype method onReadRequest from class bleno.Characteristic 
* This method is called if the master initiates an onReadRequest on the battery level characteristic.
* We check the os if the application runs on linux, and if so, return the actual battery level
*/
BatteryLevelCharacteristic.prototype.onReadRequest = async function(offset, callback) {
 
  // asynchronous waterfall principle do async function after the previous finished
  async.waterfall([
    function(callback) {
      // check operating system to be linux
      if (os.platform() === 'linux') {
        console.log("Get battery level");
        // get battery level from os command shell
        exec("acpi battery | head -n 1 | cut -d ',' -f2", function (error, stdout, stderr) {
          // Expected output => 95%
          // error handling
          if (error instanceof Error) {
            console.log(error);
          } else {  
            // return shell outout to caller
            console.log("Inside: " + stdout.toString());
            callback(null, stdout.toString());   
          }
        });
      } else {
        // other os than linux create random value for battery level
        var rand = parseInt(Math.floor(Math.random() * 100) + 1);
        console.log("Randomized battery level: " + rand);
        callback(null, rand);
      }
    }
      // return value from internal callback are stored in result
    ], function(error, result) {
      if(error != null) {
        console.log(error);
      } else { 
      console.log("Inside finished: " + result);
      battery = result;
      // send data to master
      callback(this.RESULT_SUCCESS, new Buffer([battery]));
      }
    });   
};

// export class as BatteryLevelCharacteristic
module.exports = BatteryLevelCharacteristic;