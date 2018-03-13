/**
 * Class BLESerice extends bleno.PrimaryService class
 * It is the main class for all created services.
 *
 * @class BLEService
 * @extends bleno
 *
 * @constructor BLEService
 * @param {Object} params Object params contains service uuid and characteristics array
 *
 * @author gwu
 * @version 0.1
 */

/**
 * Module dependencies
 *
 */
const bleno = require('bleno');
const util = require('util');

// define a variable from the bleno modul base class to inherit from
const BlenoPrimaryService = bleno.PrimaryService;

/**
 * Constructor for BLEService calls constructor from the bleno base class PrimaryService
 *
 */
function BLEService(params) {
    BLEService.super_.call(this, {
        uuid: params.uuid,
        characteristics: params.characteristics
    });
}

/**
 * Function toString returns a textual representation of a service and its containing characteristics.
 *
 * @method toString
 * @return {String} string
 */
BLEService.prototype.toString = function() {
    return JSON.stringify({
        uuid: this.uuid,
        characteristics: this.characteristics
    });
};

util.inherits(BLEService, BlenoPrimaryService);

// export class as BLEService
module.exports = BLEService;