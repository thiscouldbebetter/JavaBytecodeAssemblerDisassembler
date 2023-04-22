
class JavaBytecodeAssemblerDisassembler
{
	assembleCode(code)
	{
		var program = Program.fromCode(code);
		var programAsBytes = program.toBytes();
		return programAsBytes;
	}

	disassembleBytes(bytes)
	{
		var program = Program.fromBytes(bytes);
		var programAsCode = program.toCode();
		return programAsCode;
	}
}
