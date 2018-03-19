/**
 * Utilities class contains static functions used by other classes.
 *
 * @class Utilities
 *
 * @author gwu
 * @version 0.5
 */

function Utilities() {
};

/**
 * Functions is used to write a value to a buffer using different
 * datatype representations.
 *
 * @method writeBuffer
 * @static
 * @param value Value which is written to the buffer
 * @param datatype Datatype of the value
 * @return {*} buffer Buffer containing the value in the correct datatype representation.
 */
Utilities.writeBuffer = function (value, datatype) {
    let data;

    console.log("Utilities class called");
    switch (datatype) {
        //case 'uint8' :
        case 'uint16' :
            data = Buffer.allocUnsafe(2);
            data.writeUInt16LE(value, 0);
            break;
        case 'uint32' :
            data = Buffer.allocUnsafe(4);
            data.writeUInt32LE(value, 0);
            break;
        case 'sint8' :
        case 'sint16' :
            data = Buffer.allocUnsafe(2);
            data.writeInt16LE(value, 0);
            break;
        case 'sint32' :
            data = Buffer.allocUnsafe(4);
            data.writeInt32LE(value, 0);
            break;
        case 'float' :
            data = Buffer.allocUnsafe(value.length);
            data.writeFloatLE(value, 0);
            break;

        default :
            if (typeof value === 'string') {
                data = Buffer.allocUnsafe(value.length);
                data =  data.write(value,0);
            } else {
                data = Buffer.from([value]);
            }

    }
    console.log(data);
    return data;
};

module.exports = Utilities;