
class Program
{
	constructor(instructions)
	{
		this.instructions = instructions;
	}

	executeAgainstRuntime(runtime)
	{
		for (var i = 0; i < this.instructions.length; i++)
		{
			var instruction = this.instructions[i];
			runtime = instruction.executeAgainstRuntime(runtime);
		}

		return runtime;
	}

	// Conversions from and to bytes.

	static fromBytes(bytes)
	{
		var byteStream = new ByteStreamFromBytes(bytes);

		var instructions = [];

		while (byteStream.hasMore() )
		{
			var instruction = Instruction.fromByteStream(byteStream);
			instructions.push(instruction);
		}

		var returnProgram = new Program(instructions);

		return returnProgram;
	}

	toBytes()
	{
		var instructionsAsByteArrays =
			this.instructions.map(x => x.toBytes());
		var instructionsAsBytes = [];
		instructionsAsByteArrays.forEach
		(
			x => instructionsAsBytes.push(...x)
		);
		return instructionsAsBytes;
	}

	// Conversions from and to code.

	static fromCode(code)
	{
		var lineCommentStartToken = ";";

		var codeLines = code.split("\n");

		codeLines = codeLines.map
		(
			codeLine =>
			{
				var indexOfCommentStart =
					codeLine.indexOf(lineCommentStartToken);
				if (indexOfCommentStart >= 0)
				{
					codeLine = codeLine.substr(0,  indexOfCommentStart)
				}
				return codeLine.trim();
			}
		).filter
		(
			x => (x != "")
		);

		var instructions = [];

		for (var i = 0; i < codeLines.length; i++)
		{
			var codeLine = codeLines[i];
			var instruction = Instruction.fromCodeLine(codeLine);
			instructions.push(instruction);
		}

		var returnProgram = new Program(instructions);

		return returnProgram;
	}

	toCode()
	{
		var codeLines = this.instructions.map
		(
			x => x.toCodeLine()
		);

		var code = codeLines.join("\n");

		return code;

	}
}
