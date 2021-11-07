I. Đấu nối input, output

1. Input to trigger: cần nối 2 dây là Input Common và Input 0
+ Nếu Input Common -> 0VDC, thì Input 0 -> Button -> 24VDC
+ Nếu Input Common -> 24VDC, thì Input 0 -> Button -> 0VDC

2. Output ngõ ra là tải còi, đèn..: Cần nối 2 dây là Output Common và Output 0
+ Output Common -> 0VDC
+ Output 0 <- Tải <- 24VDC



II. Sử dụng script
1. sử dụng ddmc
dmccGet -> is always returned as a single string even for multi-value responses.
dmccSet -> It supports multiple and type correct parameters.
dmccCommand -> send ddcc Command
dmccSend ->  function can be used in a similar way, but without splitting the command and type correct arguments:

Ví dụ:
dmccGet(”DEVICE.NAME”);
dmccSend(”GET DEVICE.NAME”);
dmccSet(”DECODER.ROI”, 16, 1280, 16, 1024);
dmccCommand(”BEEP”, 1, 1);


2. Một số hàm bổ trợ
Tham khảo link: https://support.cognex.com/docs/dmst_625/web/EN/Comms_Prog_Manual/Content/Topics/PDF/DMCAP/ScriptBasedDataFormatting.htm?TocPath=DataMan%20Application%20Development|Scripting|_____1
2.1. Hàm decode_sequences(encodedString)
- Được sử dụng để thêm các lệnh điều khiển bàn phím khi truyền ký tự thông qua kết nối HID 

\ALT- for &lt;ALT-key&gt; sequences
\CTRL- for &lt;CTRL-key&gt; sequences
\SHIFT- for &lt;SHIFT-key&gt; sequences
\K for special keys

Ngoài ra có thể add thêm các tập lệnh như Alt, Ctrl, Shift...hoặc các tổ hợp phím khác
VD: To pre- or post-pend a Ctrl-B keyboard control command, the following code example can be used


2.2 Hàm encode_base64(encodedString)
Hàm mã hóa base64


III. Script
Formatting Script
When script-based formatting is enabled, a user-defined JavaScript module is responsible for data formatting. 
The parsing function, which defaults to onResult, is called with three objects as arguments holding:
 + the array of DecodeResult objects, ReaderProperties objects such as trigger mode or statistics, and the output object. 
 
There is only one entry point for both single and multicode results.
Class hierarchy is structured in the following way:


function onResult [decodeResults, readerProperties, output]

DecodeResult

SymbologyProperties
Point
ValidationResult
GS1Validation
DoDValidation
QualityMetrics
Metric
ReaderProperties
Trigger
Statistics

Output
Event


1. Hàm onResult [decodeResults, readerProperties, output]
=> This is the event handler for decode events, with zero, one or more decoded results.

***Ở hàm này chúng ta có thể:
- format lại data trước khi gửi
- tùy biến data cho từng loại output interface (Telnet, Serial,...)

var mymsg = decodeResults[0].content;
// output[’Serial’] is identical to output.Serial
output[’Serial’] = ”serial: ”+mymsg;
output.content = mymsg;


- decodeResults: là một mảng của các đối tượng DecodeResult, mỗi khi decoded được 1 code thì mỗi DecodeResult chứa tất cả thông tin liên quan tới code đó
- readerProperties: là một ReaderProperties, chứa các thuộc tính của reader, không liên quan tới kết quả decoded
- output: là một object dùng để update kết quả decoded hoặc raise các event

2. Hàm onGenerateFTPFilename [decodeResults, readerProperties, output]
=> The name of the file to be sent to the FTP server can be generated with this function.

function onGenerateFTPFilename(decodeResults, readerProperties, output) {
    var ftp_filename = readerPRoperties.name + "-";
    ftp_filename += readerProperties.trigger.index + "-" + decodeResults[0].image.index;
    return ftp_filename;
}

function onGenerateFTPPCMReportFilename(decodeResults, readerProperties, output) {
    var ftp_filename = readerPRoperties.name + "-";
    ftp_filename += readerProperties.trigger.index + "-" + decodeResults[0].image.index;
    return ftp_filename;
}


3. CommHandler
=> Custom communication scripting can be activated by a boolean VT entry that can be accessed in the DataMan Setup Tool.
The constructor function of the communication object, CommHandler, contains a list of functions that the script must contain:
onConnect -> Hàm kết nối interface
onDisconnect -> ngắt kết nối
onExpectedData -> Cấu hình frame data với this.expectFramed("#", ";\r\n", 64);  #data_max_64_char;\r\n
onTimer -> khi timer đếm tới thời gian
onUnexpectedData -> data không đúng định dạng mà mình mong muốn
onError -> lỗi 
onEncoder -> Hàm được gọi khi có cấu hình khoảng cách encoder: xung encoder -> đổi ra mm

The user must implement these functions, as the custom communications function will call them.
There are five member functions that the reader script engine offers, implemented by the reader:
send -> gửi data ra interface (cổng com hoặc telnet...)
close -> ngắt kết nối với reader
setTimer -> tạo timer; Set timer bằng 0 -> disable timer
expectFramed -> cấu hình frame data với start_data-length_stop: #data_max_64_char;\r\n
setEncoder -> 
