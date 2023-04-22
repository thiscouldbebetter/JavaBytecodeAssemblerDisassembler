
class UiEventHandler
{
	static buttonAssemble_Clicked()
	{
		var d = document;

		var textareaCode = d.getElementById("textareaCode");
		var code = textareaCode.value;

		var assemblerDisassembler =
			new JavaBytecodeAssemblerDisassembler();
		var programAsBytes =
			assemblerDisassembler.assembleCode(code);
		var programAsHexadecimals =
			programAsBytes.map(x => x.toString(16) );
		var programAsHexadecimal = programAsHexadecimals.join(" ");

		var textareaBytesAsHexadecimal =
			d.getElementById("textareaBytesAsHexadecimal");
		textareaBytesAsHexadecimal.value = programAsHexadecimal;
	}

	static buttonDisassemble_Clicked()
	{
		var d = document;

		var textareaBytesAsHexadecimal =
			d.getElementById("textareaBytesAsHexadecimal");
		var programAsHexadecimal =
			textareaBytesAsHexadecimal.value;
		var programAsHexadecimals =
			programAsHexadecimal.split(" ").filter(x => x != "");
		var programAsBytes =
			programAsHexadecimals.map(x => parseInt(x, 16) );

		var assemblerDisassembler =
			new JavaBytecodeAssemblerDisassembler();
		var programAsCode =
			assemblerDisassembler.disassembleBytes(programAsBytes);

		var textareaCode = d.getElementById("textareaCode");
		textareaCode.value = programAsCode;
	}
}
