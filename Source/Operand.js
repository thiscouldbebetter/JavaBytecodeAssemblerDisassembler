
class Operand
{
	constructor(defnName, value)
	{
		this.defnName = defnName;
		this.value = value;
	}

	defn()
	{
		return OperandDefn.byName(this.defnName);
	}

	toBytes()
	{
		var defn = this.defn();
		var bytes = defn.operandValueToBytes(this.value);
		return bytes;
	}

	toStringCode()
	{
		return ("" + this.value);
	}
}