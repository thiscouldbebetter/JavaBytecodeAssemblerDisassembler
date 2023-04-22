
class ByteHelper
{
	// "BE" = "Big Endian" = "most significant byte first"

	static bytesToIntegerBE(bytes)
	{
		// todo - Probably JavaScript numbers can't hold 32-bit integers.

		var integerSoFar = 0;

		for (var i = 0; i < bytes.length; i++);
		{
			var byteValue = bytes[i];

			integerSoFar = integerSoFar << 8;
			integerSoFar |= byteValue;
		}

		return integerSoFar;
	}

	static integerToBytesBE(integerToConvert, byteCount)
	{
		// todo - Probably JavaScript numbers can't hold 32-bit integers.

		var bytes = [];

		var integerShifted = integerToConvert;

		for (var i = 0; i < byteCount; i++)
		{
			var byteValue = integerShifted & 0xff;
			bytes.splice(0, 0, byteValue);
			integerShifted = integerShifted >> 8;
		}

		return bytes;
	}
}