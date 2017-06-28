var device1 = require('bleno');

console.log("Program started");

device1.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    console.log("Advertising started");
       device1.startAdvertising('FirstDevice',['12ab']);
      
  } else {
      console.log("Advertising stopped");
  }
});

// Notify the console that we've accepted a connection
device1.on('accept', function(clientAddress) {
    console.log("Accepted connection from address: " + clientAddress);
});

// Notify the console that we have disconnected from a client
device1.on('disconnect', function(clientAddress) {
    console.log("Disconnected from address: " + clientAddress);
});

// When we begin advertising, create a new service and characteristic
device1.on('advertisingStart', function(error) {
    if (error) {
        console.log("Advertising start error:" + error);
    } else {
        console.log("Advertising start success");
        device1.setServices([
            
            // Define a new service
            new device1.PrimaryService({
                uuid : '12ab',
                characteristics : [
                    
                    // Define a new characteristic within that service
                    new device1.Characteristic({
                        value : null,
                        uuid : '34cd',
                        properties : ['notify', 'read', 'write'],
                        
                        // If the client subscribes, we send out a message every 1 second
                        onSubscribe : function(maxValueSize, updateValueCallback) {
                            console.log("Device subscribed");
                            this.intervalId = setInterval(function() {
                                console.log("Sending: Hi!");
                                updateValueCallback(new Buffer("Hi!"));
                            }, 1000);
                        },
                        
                        // If the client unsubscribes, we stop broadcasting the message
                        onUnsubscribe : function() {
                            console.log("Device unsubscribed");
                            clearInterval(this.intervalId);
                        },
                        
                        // Send a message back to the client with the characteristic's value
                        onReadRequest : function(offset, callback) {
                            console.log("Read request received");
                            callback(this.RESULT_SUCCESS, new Buffer("Echo: " + 
                                    (this.value ? this.value.toString("utf-8") : "")));
                        },
                        
                        // Accept a new value for the characterstic's value
                        onWriteRequest : function(data, offset, withoutResponse, callback) {
                            this.value = data;
                            console.log('Write request: value = ' + this.value.toString("utf-8"));
                            callback(this.RESULT_SUCCESS);
                        }
 
                    })
                    
                ]
            })
        ]);
    }
});
