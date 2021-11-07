//The following example uses the dmccSet functions to issue a beep signal, set the ftp server IP for image storage and adds the MAC to the output response
//In case the DMCC set command for the IP address fails, a non-zero status will be returned, and a script exception will be thrown that is reported by the DataMan Setup Tool.
//If you use the Throw() command, like in the example above, to report the occurrence of an anomalous situation (exception), the error will appear in the Setup Tool’s error log. 
//To access the error log, in the Setup Tool’s menu bar, click System and then click Show Device Log.
function onResult(decodeResults, readerProperties, output) {

    var myoutput;
    var result_tmp = dmccCommand("BEEP", 1, 1);
    result_tmp = dmccSet("FTP - IMAGE.IP - ADDRESS", "192.168.23.42");
    if (result_tmp.status != 0) {
        throw ("FATAL: failed to set the ftp server address");
    }

    var mac = dmccGet("DEVICE.MAC - ADDRESS");

    myoutput = 'Result ="' + decodeResults[0].content + '", MAC ='+mac.response;

    output.content = myoutput;

}