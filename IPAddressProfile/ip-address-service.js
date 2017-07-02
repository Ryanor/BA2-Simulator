/**
* Class IPAddressService extends bleno.PrimaryService class
* Main class for the IPAddressService including 
* IPAddressCharacteristic.
* IPAddressService is a self defined service for test purposes.
*
* @author gwu
* @version 1.0
*/

// import utility library to build classes
var util = require('util');

// import bleno module for bluettoth low energy communication
var bleno = require('bleno');

// create the PrimaryService class which the battery class inherits from
var BlenoPrimaryService = bleno.PrimaryService;

// predefine the included characteristics of the service
var IPAddressCharacteristic = require('./ip-address-characteristic');

/**
* Constructor for IPAddressService calls constructor from the parent class PrimaryService
* Defines the UUID for the service
* Includes characteristics used
*/ 
function IPAddressService() {
  IPAddressService.super_.call(this, {
      uuid: '34AB',
      characteristics: [
          new IPAddressCharacteristic()
      ]
  });
}

// define inhertance
util.inherits(IPAddressService, BlenoPrimaryService);

// export class as IPAddressService
module.exports = IPAddressService;
