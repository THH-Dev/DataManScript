// Default script for custom communication protocol
function CommHandler()
{
	var my_name = "";
	var result_tmp;
	return {
		onConnect: function (peerName)
		{
			my_name = peerName;
			this.setTimer(1.0);
			this.send(my_name + ": connected\r\n");
			this.expectFramed("#", ";", 64);
			return true;

		},
		onDisconnect: function ()
		{
		},
		onError: function (errorMsg)
		{
		},
		onExpectedData: function (inputString) {
			this.expectFramed("#", ";", 64);
			
			if(inputString == "en")
			{
				result_tmp = dmccSet("COM.SCRIPT-ENABLED", 1);
				this.send(my_name + ": COM.SCRIPT-ENABLED = true" + result_tmp);
			}
			else if(inputString == "dis")
			{
				result_tmp = dmccSet("COM.SCRIPT-ENABLED", 0);
				this.send(my_name + ": COM.SCRIPT-ENABLED = false" + result_tmp);
			}
			else if(inputString == "get")
			{
				var xxx = dmccGet("COM.SCRIPT-ENABLED");
				this.send(my_name + "->" + xxx);
			}
			else
			{
				this.send(my_name + "->" + inputString);
			}
			
			
			return true;
		},
		onUnexpectedData: function (inputString) {
			this.send(my_name + "#" + inputString);
			return true;
		},
		onTimer: function () {
			this.send(my_name + ': timer callback\r\n');
        	this.setTimer(1.0);
		},
		onEncoder: function () {
		}
	};
}