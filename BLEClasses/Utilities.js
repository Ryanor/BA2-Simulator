/**
 * Utilities class contains functions used by other classes.
 *
 * @class Utilities
 *
 * @author gwu
 * @version 0.5
 */

function Utilities() {
};

Utilities.writeBuffer = function (value, datatype) {
    let data;

    console.log("Utilities class called");
    switch (datatype) {
        case 'uint8' :
            data = new Buffer(1);
            data.writeUInt8(value, 0);
            break;
        case 'uint16' :
            data = new Buffer(2);
            data.writeUInt16LE(value, 0);
            break;
        case 'uint32' :
            data = new Buffer(4);
            data.writeUInt32LE(value, 0);
            break;
        case 'sint8' :
            data = new Buffer(2);
            data.writeInt8(value, 0);
            break;
        case 'sint16' :
            data = new Buffer(2);
            data.writeInt16LE(value, 0);
            break;
        case 'sint32' :
            data = new Buffer(4);
            data.writeInt32LE(value, 0);
            break;

        default :
            if (typeof value === 'string') {
                data = new Buffer(value);
            } else {
                data = new Buffer([value]);
            }

    }
    console.log(data);
    return data;
};

module.exports = Utilities;