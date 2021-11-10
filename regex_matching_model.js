var regex = '.*';

const regexp = new RegExp(regex,'g');

const str_test = [
    "821-10026-1R D	1A1733PP323906	00D0244ECA9A",
    "821-10026-1R D	1A1733PP323906	00D0244ECA9A",
    "821-10026-1R D	1A1733PP323906	00D0244ECA9A",
    "821-10026-1R D	1A1733PP323906	00D0244ECA9A"
  ];

// Default script for custom communication protocol
function CommHandler()
{
	function replace_crlf(input_str) {
        return input_str.replace(/\r/g, '\\r').replace(/\n/g, '\\n');
    }
	
	return {
		onConnect: function (peerName)
		{
			my_name = peerName;
			//Gửi data qua cổng com hoặc telnet
            num_send = this.send(my_name + ": connected\r\n");

            //Cấu hình frame data với start_data-length_stop: #data_max_64_char;\r\n
            this.expectFramed("#", ";\r\n", 64);
            return true;
		},
		onDisconnect: function ()
		{
		},
		onError: function (errorMsg)
		{
			num_send = this.send('Error: '+ errorMsg + '\r\n');
		},
		onExpectedData: function (inputString) {
			var msg = 'ok';
            this.expectFramed("#", ";\r\n", 64);

            if (inputString == "name") {
                msg = dmccGet("DEVICE.NAME");

                this.send(my_name + ': issue a trigger...\r\n');
                dmccCommand("TRIGGER", true);
                msg = 'done';

            }
			else if (inputString == "time") {
               today = new Date();
               msg = today.getSeconds() * 1000 + today.getMilliseconds();
            }
			else if(inputString == "change")
			{
				regex = '/^[0-9]*$/';
			}
			
			num_send = this.send(my_name + ': ' + msg + "\r\n");
            return inputString.length;
		},
		onUnexpectedData: function (inputString) {
			//return true;
            this.expectFramed("#", ";\r\n", 128);
            msg = replace_crlf(inputString);
            num_send = this.send(my_name + ': ' + msg + "?\r\n");
            return true;
		},
		onTimer: function () {
		},
		onEncoder: function () {
		}
	};
}
