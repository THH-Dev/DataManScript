//Mã barcode cần so sánh
const master_code = "S0000909E";

const ng_code = "NG";
const ng_event_output = Event.system.validationFailure;


function onResult (decodeResults, readerProperties, output)
{
	//Trường hợp đọc được barcode -> So sánh barcode và master_code
	if (decodeResults[0].decoded)
	{
		
        //Kiểm tra xem mã code mà DataMan đọc về có giống master_code hay không?
		var is_equal = false;
		var is_equal = decodeResults[0].content === master_code;
		

        //Nếu giống master code -> output: OK + master_code
		if(is_equal)
		{
			output.content = decodeResults[0].content;
		}

        //Nếu khác master code -> output: NG + NG
		else
		{
			output.events.system = ng_event_output;
			output.content = ng_code;
		}
	}
    //Trường hợp không đọc được barcode -> NG
	else
	{
		output.content = ng_code;	
	}
}