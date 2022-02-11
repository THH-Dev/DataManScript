//Mã barcode để thay đổi master_code
const change_master_code = "RESET";

//Event khi Invalid
const ng_event_output = Event.system.validationFailure;


//Mã barcode cần so sánh, mặc định là null
var master_code = null ;


//Biến cho phép update master_code
var enable_update_master_code = false

//Biến cho phép chạy debug
const enable_debug = true

//Mã tiền tố để them vào lúc Invalid
const ng_code = "Invalid";
//Mã tiền tố để thêm vào lúc thay đổi master_code, dùng để debug chương trình
const pre_change_master_code = "set_master_code=";



function onResult (decodeResults, readerProperties, output)
{
	//Trường hợp đọc được barcode -> So sánh barcode và master_code
	if (decodeResults[0].decoded)
	{
		
		//Check change_master_code?
		var is_enable_update_master_code = decodeResults[0].content === change_master_code
		if(is_enable_update_master_code)
		{
			enable_update_master_code = true;
			if(enable_debug)
			{
				output.content = "prepare_change_code_" + decodeResults[0].content;
			}
			else
			{
				output.content = decodeResults[0].content;
			}
			
			return;
		}
		
		//Update master_code
		if(enable_update_master_code)
		{
			//change master code
			master_code = decodeResults[0].content;
			
			if(enable_debug)
			{
				output.content = pre_change_master_code + decodeResults[0].content;
			}
			else
			{
				output.content = decodeResults[0].content;
			}
			
			//clear enable_update_master_code
			enable_update_master_code = false;
			return;
		}
		
		if (master_code == null)
		{
			if(enable_debug)
			{
				output.content = decodeResults[0].content+"_mastercode=null";
			}
			else
			{
				output.content = decodeResults[0].content;
			}
			
			return;
		}
			
		
        //Kiểm tra xem mã code mà DataMan đọc về có giống master_code hay không?
		var is_equal = decodeResults[0].content === master_code;
		

        //Nếu giống master code -> output: OK + master_code
		if(is_equal)
		{
			if(enable_debug)
			{
				output.content = decodeResults[0].content+"_mastercode="+master_code;
			}
			else
			{
				output.content = decodeResults[0].content;
			}
		}

        //Nếu khác master code -> output: NG + NG
		else
		{
			output.events.system = ng_event_output;
			//output.content = ng_code;   //hiển thị NG
			output.content = ng_code + "_" + decodeResults[0].content + "_mastercode=" + master_code;   //hiển thị NG_thongtincode
		}
	}
    //Trường hợp không đọc được barcode -> NG
	else
	{
		output.content = "Noread";	
	}
}