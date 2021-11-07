var ctrl_b = decode_sequences("\\Ctrl-B;");
function onResult(decodeResults, readerProperties, output) {

    if (decodeResults[0].decoded) {

        output.content = ctrl_b + decodeResults[0].content + ctrl_b;
    }
}