
class Instruction
{
	constructor(opcode, operands)
	{
		this.opcode = opcode;
		this.operands = operands;
	}

	executeAgainstRuntime(runtime)
	{
		runtime =
			this.opcode.instructionExecuteAgainstRuntime(this, runtime);

		return runtime;
	}

	// Convenience methods.

	opd(index)
	{
		return this.operands[index].value;
	}

	// Conversions.

	static fromByteStream(byteStream)
	{
		var opcode = Opcode.fromByteStream(byteStream);
		var operandDefns = opcode.operandDefns;
		var operands = operandDefns.map
		(
			x => x.operandReadFromByteStream(byteStream)
		);
		var instruction = new Instruction(opcode, operands);
		return instruction;
	}

	static fromCodeLine(codeLine)
	{
		var fields = codeLine.split(" ");

		var opcodeAsStringMnemonic = fields[0];
		var opcode = Opcode.fromMnemonic(opcodeAsStringMnemonic);

		var operandDefns = opcode.operandDefns;
		var operandsAsStrings = fields.slice(1);
		if (operandsAsStrings.length != operandDefns.length)
		{
			var message =
				"Line had unexpected number of operands: " + codeLine;
			throw new Error(message);
		}

		var operands = [];
		for (var i = 0; i < operandsAsStrings.length; i++)
		{
			var operandAsString = operandsAsStrings[i];
			var operandDefn = operandDefns[i];

			var operandValue = parseFloat(operandAsString);

			var operand = new Operand(operandDefn.name, operandValue);
			operands.push(operand);
		}

		var instruction = new Instruction(opcode, operands);
		return instruction;
	}

	toBytes()
	{
		var bytes = [ this.opcode.value ];
		this.operands.forEach(x => bytes.push(...x.toBytes()) )
		return bytes;
	}

	toCodeLine()
	{
		var operandsAsStrings = this.operands.map(
			x => x.toStringCode()
		)
		var operandsAsCode = operandsAsStrings.join(" ");

		var returnValue =
			this.opcode.mnemonic
			+ " "
			+ operandsAsCode;

		return returnValue;
	}
}

