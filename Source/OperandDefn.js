
class OperandDefn
{
	constructor
	(
		name,
		operandReadFromByteStream,
		operandValueToBytes
	)
	{
		this.name = name;
		this._operandReadFromByteStream =
			operandReadFromByteStream;
		this._operandValueToBytes =
			operandValueToBytes;
	}

	static Instances()
	{
		if (OperandDefn._instances == null)
		{
			OperandDefn._instances = new OperandDefn_Instances();
		}
		return OperandDefn._instances;
	}

	static byName(name)
	{
		return OperandDefn.Instances().byName(name);
	}

	static operandReadFromByteStream1(byteStream)
	{
		var returnValue = byteStream.readByte();
		return returnValue;
	}

	static operandReadFromByteStream2(byteStream)
	{
		var returnValue = ByteHelper.bytesToIntegerBE
		(
			byteStream.readBytes(2)
		); 
		return returnValue;
	}

	static operandReadFromByteStream4(byteStream)
	{
		// todo - 32 bits may be too large for a JavaScript number.

		var returnValue = ByteHelper.bytesToIntegerBE
		(
			byteStream.readBytes(4)
		); 
		return returnValue;
	}

	operandReadFromByteStream(byteStream)
	{
		var operandValueRead = null;

		if (this._operandReadFromByteStream == null)
		{
			var message =
				"Method .operandReadFromByteStream() not implemented for: "
				+ this.name;
			throw new Error(message);
		}
		else
		{
			operandValueRead = this._operandReadFromByteStream(byteStream);
		}

		var operandRead = new Operand(this.name, operandValueRead);

		return operandRead;
	}

	static operandValueToBytes1(operandValue)
	{
		if (operandValue > 255)
		{
			throw new Exception("Operand value out of range: " + operandValue);
		}

		return [ operandValue ];
	}

	static operandValueToBytes2(operandValue)
	{
		if (operandValue > 65535)
		{
			throw new Exception("Operand value out of range: " + operandValue);
		}

		var operandValueAsBytes =
			ByteHelper.integerToBytesBE(operandValue, 2);

		return operandValueAsBytes;
	}

	static operandValueToBytes4(operandValue)
	{
		// todo - This may be too big to fit in a JavaScript number.
		var valueMax = Math.pow(2, 32) - 1;
	
		if (operandValue > valueMax)
		{
			throw new Exception("Operand value out of range: " + operandValue);
		}

		var operandValueAsBytes =
			ByteHelper.integerToBytesBE(operandValue, 4);

		return operandValueAsBytes;
	}

	operandValueToBytes(operandValue)
	{
		var returnBytes = null;

		if (this._operandValueToBytes == null)
		{
			var message =
				"Method .operandValueToBytes() not implemented for: "
				+ this.name;
			throw new Error(message);
		}
		else
		{
			returnBytes = this._operandValueToBytes(operandValue);
		}

		return returnBytes;
	}

	toStringCode()
	{
		return "todo";
	}
}

class OperandDefn_Instances
{
	constructor()
	{
		var od = (n, orfbs, ovtb) => new OperandDefn(n, orfbs, ovtb);

		var od1 = (n) => od(n, OperandDefn.operandReadFromByteStream1, OperandDefn.operandValueToBytes1);
		var od2 = (n) => od(n, OperandDefn.operandReadFromByteStream2, OperandDefn.operandValueToBytes2);
		var od4 = (n) => od(n, OperandDefn.operandReadFromByteStream4, OperandDefn.operandValueToBytes4);

		this.AType 				= od1("atype");
		this.BranchOffset16 	= od2("branchOffset16");
		this.BranchOffset32 	= od4("branchOffset32");
		this.Byte 				= od1("byte");
		this.Byte1 				= od1("byte1");
		this.Byte2 				= od1("byte2");
		this.Const 				= od1("const");
		this.Count 				= od1("count");
		this.Dimensions 		= od1("dimensions");
		this.Index 				= od1("index");
		this.Index16 			= od2("index16");
		this.Zero 				= od1("zero");

		// todo - These are complicated.

		this.LookupSwitch = new OperandDefn
		(
			"lookupSwitch",
			null // todo - 8+ bytes
		);

		this.TableSwitch = new OperandDefn
		(
			"tableSwitch",
			null // todo - 16+ bytes
		);

		this.Wide = new Operand
		(
			"wide",
			null // todo - 3-5 bytes")
		);

		this._All =
		[
			this.AType,
			this.BranchOffset16,
			this.BranchOffset32,
			this.Byte,
			this.Byte1,
			this.Byte2,
			this.Const,
			this.Count,
			this.Dimensions,
			this.Index,
			this.Index16,
			this.Zero
		];

		this._AllByName = new Map(this._All.map(x => [x.name, x]) );
	}

	byName(name)
	{
		return this._AllByName.get(name);
	}
}