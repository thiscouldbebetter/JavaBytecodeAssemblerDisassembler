
class ByteStreamFromBytes
{
	constructor(bytes)
	{
		this.bytes = bytes;

		this.byteIndex = 0;
	}

	hasMore()
	{
		return (this.byteIndex < this.bytes.length);
	}

	readByte()
	{
		var byteRead = this.bytes[this.byteIndex];
		this.byteIndex++;
		return byteRead;
	}

	readBytes(byteCount)
	{
		var bytesRead = [];
		for (var i = 0; i < byteCount; i++)
		{
			var byteRead = this.readByte();
			bytesRead.push(byteRead);
		}
		return bytesRead;
	}
}
