// Default script for custom communication protocol
function CommHandler()
{

    // private properties and methods:
    var my_name;
    var num_trigger = 0;
    var num_send;
    // public properties and methods:
    function onTimeout() {
        num_send = this.send(my_name + ': timer callback\r\n');
        this.setTimer(1.0);
    }



    function onTimeout2() {
        today = new Date();
        var msg = today.getSeconds() * 1000 + today.getMilliseconds();
        num_send = this.send(my_name + ': time is: ' + msg + '\r\n');
        dmccCommand("TRIGGER", true);
        this.setTimer(1.0);
    }

    function replace_crlf(input_str) {
        return input_str.replace(/\r/g, '\\r').replace(/\n/g, '\\n');
    }




	return {

        /*
            - Hàm kết nối: 
            + Nếu là kết nối COM thì để tên cổng COM, example "COM2"
            + Nếu là kết nối qua Ethernet thì để IP:Port_telnet, example "192.168.100.111:23"

            - Return: true -> kết nối ok; false -> kết nối error
        */
		onConnect: function (peerName)
		{
			// Disable the handler for this connection:
			//return false;


            my_name = peerName;
            // we may ignore the connection
            if (my_name == "COM1")
                return false;

            //Gửi data qua cổng com hoặc telnet
            num_send = this.send(my_name + ": connected\r\n");

            //Cấu hình frame data với start_data-length_stop: #data_max_64_char;\r\n
            this.expectFramed("#", ";\r\n", 64);
            return true;

		},

        /*
            - Hàm ngắt kết nối
        */
		onDisconnect: function ()
		{
		},


        /*
            - Hàm trả về các lỗi trong quá trình scanner hoạt động (nếu xảy ra)
        */
		onError: function (errorMsg)
		{
		},


        /*
            - Hàm xử lý các data mong muốn mà người dùng define
            - input: là chuỗi inputString
            - xét các case trong inputString để thực hiện các lệnh tương ứng

            VD:
            + close -> close, ngắt kết nối
            + stop -> tắt timer
            + start -> set timer
            + switch -> chuyển timer
            + time -> trả về time hiện tại
            + name -> trả về tên devices


            - Return: 
            + true -> clear buffer trong Dataman
            + false -> giữ buffer
        */
		onExpectedData: function (inputString) {
			//return true;

            var msg = 'ok';
            this.expectFramed("#", ";\r\n", 64);

            if (inputString == "name") {
                msg = dmccGet("DEVICE.NAME");

                this.send(my_name + ': issue a trigger...\r\n');
                dmccCommand("TRIGGER", true);
                msg = 'done';

            }
            else if (inputString == "close") {
                //Ngắt kết nối
                this.close();
            }
            else if (inputString == "stop") {
                //Set timer bằng 0 -> disable timer
                this.setTimer(0.0);
            }
            else if (inputString == "start") {

                //Set timer bằng 10s
                this.setTimer(10.0);
            }
            else if (inputString == "switch") {
                this.onTimer = onTimeout2;
            }
            else if (inputString == "time") {
                today = new Date();
                msg = today.getSeconds() * 1000 + today.getMilliseconds();
            }
            else if (inputString == "trigger") {
                today = new Date();
                msg = today.getSeconds() * 1000 + today.getMilliseconds();
                dmccCommand("TRIGGER", true);
                msg = "trigged at ms = " + msg;
            }
            else if (inputString == "ok") {
                today = new Date();
                msg = today.getSeconds() * 1000 + today.getMilliseconds();
                dmccCommand("OUTPUT.GOOD");
                msg = "OK set OUTPUT.GOOD at ms = " + msg;
            }
            else if (inputString == "ng") {
                today = new Date();
                msg = today.getSeconds() * 1000 + today.getMilliseconds();
                dmccCommand("OUTPUT.NOREAD");
                msg = "NG set OUTPUT.NOREAD at ms = " + msg;
            }
            else {
                msg = "unknown command: " + replace_crlf(inputString);
            }
            num_send = this.send(my_name + ': ' + msg + "\r\n");
            return inputString.length;
		},

        /*
            - Hàm đc gọi khi data không đúng frame truyền quy ước
        */
		onUnexpectedData: function (inputString) {
			//return true;
            this.expectFramed("#", ";\r\n", 128);
            msg = replace_crlf(inputString);
            num_send = this.send(my_name + ': ' + msg + "?\r\n");
            return true;
		},

        /*
            - Hàm được gọi khi timer đếm tới hạn đc setting
        */
		onTimer: onTimeout,

        /*
            - Hàm được gọi khi có cấu hình khoảng cách encoder: xung encoder -> đổi ra mm
        */
		onEncoder: function () {
		}
	};
}
