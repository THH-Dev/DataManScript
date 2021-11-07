// Default script for data formatting

var comm_handler = new Array(0);

function onResult (decodeResults, readerProperties, output)
{
	if (decodeResults[0].decoded)
	{
        output.content = decodeResults[0].content + '\r\n';
        for (var i = 0; i < comm_handler.length; i++) {
            comm_handler[i].resetHeartBeat();
        }
	}
}

// Heart beat example without disturbing the DMCC communication
// Default script for custom communication protocol
function CommHandler()
{

    var beat_timer = 10.0; // beat timer in sec
    var peer_name;

	return {

        /*
            - Hàm kết nối: 
            + Nếu là kết nối COM thì để tên cổng COM, example "COM2"
            + Nếu là kết nối qua Ethernet thì để IP:Port_telnet, example "192.168.100.111:23"

            - Return: true -> kết nối ok; false -> kết nối error
        */
        onConnect: function (peerName) {
            peer_name = peerName;
            this.resetHeartBeat(); // initial timer
            this.expectFramed("\0", "\0", 128); // some pattern unlikely to happen
            comm_handler.push(this); // register the handler for results
            // enable the handler for this connection:
            return true;

		},

        /*
            - Hàm ngắt kết nối
        */
		onDisconnect: function ()
		{
            var index = comm_handler.indexOf(this)
            comm_handler.splice(index, 1);
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
			return false;
		},

        /*
            - Hàm đc gọi khi data không đúng frame truyền quy ước
        */
		onUnexpectedData: function (inputString) {
			return false;
		},

        /*
            - Hàm được gọi khi timer đếm tới hạn đc setting
        */
		onTimer: function()
        {
            today = new Date();
            var msg = today.getSeconds() * 1000 + today.getMilliseconds();
            num_send = this.send(peer_name + ': time is: ' + msg + '\r\n');
            this.resetHeartBeat(); // schedule next timer event [sec]
        },

        resetHeartBeat: function () {
            this.setTimer(beat_timer); // schedule next timer event [sec]
        },

        /*
            - Hàm được gọi khi có cấu hình khoảng cách encoder: xung encoder -> đổi ra mm
        */
		onEncoder: function () {
		}
	};
}

