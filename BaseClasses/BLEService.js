/**
 * Class BLESerice extends bleno.PrimaryService class
 * It is the main class for all created services.
 *
 * @author gwu
 * @version 0.1
 */

// import utility library to build classes
var util = require('util');

// import bleno module for bluetooth low energy communication
var bleno = require('bleno');

// create the PrimaryService class which the BLEService class inherits from
var BlenoPrimaryService = bleno.PrimaryService;

/**
 * Constructor for BatteryService calls constructor from the parent class PrimaryService
 * Defines the UUID for the service
 * Includes characteristics used
 */
function BLEService(params) {
    BLEService.super_.call(this, {
        uuid: params.uuid,
        characteristics: params.characteristics
    });
}

util.inherits(BLEService, BlenoPrimaryService);

// export class as BLEService
module.exports = BLEService;