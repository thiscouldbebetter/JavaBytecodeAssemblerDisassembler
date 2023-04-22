
class Opcode
{
	constructor
	(
		name,
		mnemonic,
		value,
		operandDefns,
		instructionExecuteAgainstRuntime
	)
	{
		this.name = name;
		this.mnemonic = mnemonic;
		this.value = value;
		this.operandDefns = operandDefns;
		this._instructionExecuteAgainstRuntime =
			instructionExecuteAgainstRuntime;
	}

	static fromByteStream(byteStream)
	{
		var opcodeValue = byteStream.readByte();
		var opcode = Opcode.fromValue(opcodeValue);
		return opcode;
	}

	static fromMnemonic(mnemonic)
	{
		return Opcode.Instances().fromMnemonic(mnemonic);
	}

	static fromValue(value)
	{
		return Opcode.Instances().fromValue(value);
	}

	static Instances()
	{
		if (Opcode._instances == null)
		{
			Opcode._instances = new Opcode_Instances();
		}
		return Opcode._instances;
	}

	instructionExecuteAgainstRuntime(instruction, runtime)
	{
		if (this._instructionExecuteAgainstRuntime == null)
		{
			var message =
				"Exec not implemented for opcode: "
				+ this.name;

			throw new Error(message);
		}
		else
		{
			runtime = this._instructionExecuteAgainstRuntime
			(
				instruction, runtime
			);
		}

		return runtime;
	}

	operandsReadFromByteStream(byteStream)
	{
		var operandsRead = [];
		for (var i = 0; i < this.operandDefns.length; i++)
		{
			var operandDefn = this.operandDefns[i];
			var operand = operandDefn.operandReadFromByteStream(byteStream);
			operandsRead.push(operand);
		}
		return operandsRead;
	}
}

class Opcode_Instances
{
	constructor()
	{
		// Abbreviated constructors.

		// Common operand definitions.

		var ods = OperandDefn.Instances();

		// Convenience methods for Opcodes;

		var operandDefnsNone = [];
		var execNone = null;

		var o = (nm, v, exec) => new Opcode(nm, nm, v, operandDefnsNone, exec);

		var o1 = (nm, v, operand0) =>
			new Opcode(nm, nm, v, [ operand0 ]);

		var o2 = (nm, v, operand0, operand1) =>
			new Opcode(nm, nm, v, [ operand0, operand1 ]);

		var o3 = (nm, v, operand0, operand1, operand2) =>
			new Opcode(nm, nm, v, [ operand0, operand1, operand2 ]);

		var o4 = (nm, v, operand0, operand1, operand2, operand3) =>
			new Opcode(nm, nm, v, [ operand0, operand1, operand2, operand3 ]);

		// Opcodes list taken from a document at the URL
		// "https://en.wikipedia.org/wiki/List_of_Java_bytecode_instructions".

		this.aaload 		= o("aaload", 		0x32, 				(n, r) => { var i = r.pop(); var arri = r.pop(); var arr = r.obj(arri); var val = arr[i]; r.push(val); } );
		this.aastore 		= o("aastore", 		0x53, 				(n, r) => { var i = r.pop(); var arri = r.pop(); var arr = r.obj(arri); arr[i] = val; } );
		this.aconst_null 	= o("aconst_null", 	0x01, 				(n, r) => { r.push(null); } );
		this.aload 			= o1("aload", 		0x19, ods.Index, 	(n, r) => { var i = n.opd(0); var obji = r.get(i); r.push(obji); } );
		this.aload_0 		= o("aload_0", 		0x2a, 				(n, r) => { var obji = r.get(0); r.push(obji); } );
		this.aload_1 		= o("aload_1", 		0x2b, 				(n, r) => { var obji = r.get(1); r.push(obji); } );
		this.aload_2 		= o("aload_2", 		0x2c, 				(n, r) => { var obji = r.get(2); r.push(obji); } );
		this.aload_3 		= o1("aload_3", 	0x2d, ods.Index16, 	(n, r) => { var obji = r.get(3); r.push(obji); } );
		this.anewarray 		= o("anewarray", 	0xbd, 				(n, r) => { var cnt = r.pop(); var i = n.opd(0); var typ = r.typ(i); var arr = []; r.push(arr) } );
		this.areturn 		= o("areturn", 		0xb0, 				(n, r) => { var ret = r.pop(); r.scopePop(); r.push(ret); }); // ? -"return a reference from a method"
		this.arraylength 	= o("arraylength", 	0xbe, 				(n, r) => { var arr = r.pop(); var len = arr.length; r.push(len); } );
		this.astore 		= o1("astore", 		0x3a, ods.Index, 	(n, r) => { var i = n.opd(0); var obji = r.pop(); r.set(i, obji); } );
		this.astore_0 		= o("astore_0", 	0x4b, 				(n, r) => { var obji = r.pop(); r.set(0, obji); } );
		this.astore_1 		= o("astore_1", 	0x4c, 				(n, r) => { var obji = r.pop(); r.set(1, obji); } );
		this.astore_2 		= o("astore_2", 	0x4d, 				(n, r) => { var obji = r.pop(); r.set(2, obji); } );
		this.astore_3 		= o("astore_3", 	0x4e, 				(n, r) => { var obji = r.pop(); r.set(3, obji); } );
		this.athrow 		= o("athrow", 		0xbf, 				(n, r) => { var ex = r.pop(); r.scopePop(); r.scopeStack.clear(); r.push(ex) } );

		this.baload 		= o("baload", 		0x33, 				(n, r) => { var i = r.pop(); var arr = r.pop(); var val = arr[i]; r.push(val); } );
		this.bastore 		= o("bastore", 		0x54, 				(n, r) => { var val = r.pop(); var i = r.pop(); var arr = r.pop(); arr[i] = val; } );
		this.bipush 		= o1("bipush", 		0x10, ods.Byte, 	(n, r) => { var val = n.opd(0); r.push(val); } );
		this.breakpoint 	= o("breakpoint", 	0xca, 				(n, r) => { } ); // todo

		this.caload 		= o("caload", 		0x34, 				(n, r) => { var i = r.pop(); var arr = r.pop(); var val = arr[i]; r.push(val); } );
		this.castore 		= o("castore", 		0x55, 				(n, r) => { var val = r.pop(); var i = r.pop(); var arr = r.pop(); arr[i] = val; } );
		this.checkcast 		= o1("checkcast", 	0xc0, ods.Index16, 	(n, r) => { var ref = r.pop(); } );

		this.d2f 			= o("d2f", 			0x90, 				execNone);
		this.d2i 			= o("d2i", 			0x8e, 				execNone);
		this.d2l 			= o("d2l", 			0x8f, 				execNone);
		this.dadd 			= o("dadd", 		0x63, 				execNone);
		this.daload 		= o("daload", 		0x31, 				execNone);
		this.dastore 		= o("dastore", 		0x52, 				execNone);
		this.dcmpg 			= o("dcmpg", 		0x98, 				execNone);
		this.dcmpl 			= o("dcmpl", 		0x97, 				execNone);
		this.dconst_0 		= o("dconst_0", 	0x0e, 				execNone);
		this.dconst_1 		= o("dconst_1", 	0x0f, 				execNone);
		this.ddiv 			= o("ddiv", 		0x6f, 				execNone);
		this.dload 			= o1("dload", 		0x18, ods.Index, 	execNone);
		this.dload_0 		= o("dload_0", 		0x26, 				execNone);
		this.dload_1 		= o("dload_1", 		0x27, 				execNone);
		this.dload_2 		= o("dload_2", 		0x28, 				execNone);
		this.dload_3 		= o("dload_3", 		0x29, 				execNone);
		this.dmul 			= o("dmul", 		0x6b, 				execNone);
		this.dneg 			= o("dneg", 		0x77, 				execNone);
		this.drem 			= o("drem", 		0x73, 				execNone);
		this.dreturn 		= o("dreturn", 		0xaf, 				execNone);
		this.dstore 		= o1("dstore", 		0x39, ods.Index, 	execNone);
		this.dstore_0 		= o("dstore_0", 	0x47, 				execNone);
		this.dstore_1 		= o("dstore_1", 	0x48, 				execNone);
		this.dstore_2 		= o("dstore_2", 	0x49, 				execNone);
		this.dstore_3 		= o("dstore_3", 	0x4a, 				execNone);
		this.dsub 			= o("dsub", 		0x67, 				execNone);
		this.dup 			= o("dup", 			0x59, 				execNone);
		this.dup_x1 		= o("dup_x1", 		0x5a, 				execNone);
		this.dup_x2 		= o("dup_x2", 		0x5b, 				execNone);
		this.dup2 			= o("dup2", 		0x5c, 				execNone);
		this.dup2_x1 		= o("dup2_x1", 		0x5d, 				execNone);
		this.dup2_x2 		= o("dup2_x2", 		0x5e, 				execNone);

		this.f2d 			= o("f2d", 			0x8d, 				execNone);
		this.f2i 			= o("f2i", 			0x8b, 				execNone);
		this.f2l 			= o("f2l", 			0x8c, 				execNone);
		this.fadd 			= o("fadd", 		0x62, 				execNone);
		this.faload 		= o("faload", 		0x30, 				execNone);
		this.fastore 		= o("fastore", 		0x51, 				execNone);
		this.fcmpg 			= o("fcmpg", 		0x96, 				execNone);
		this.fcmpl 			= o("fcmpl", 		0x95, 				execNone);
		this.fconst_0 		= o("fconst_0", 	0x0b, 				execNone);
		this.fconst_1 		= o("fconst_1", 	0x0c, 				execNone);
		this.fconst_2 		= o("fconst_2", 	0x0d, 				execNone);
		this.fdiv 			= o("fdiv", 		0x6e, 				execNone);
		this.fload 			= o1("fload", 		0x17, ods.Index, 	execNone);
		this.fload_0 		= o("fload_0", 		0x22, 				execNone);
		this.fload_1 		= o("fload_1", 		0x23, 				execNone);
		this.fload_2 		= o("fload_2", 		0x24, 				execNone);
		this.fload_3 		= o("fload_3", 		0x25, 				execNone);
		this.fmul 			= o("fmul", 		0x6a, 				execNone);
		this.fneg 			= o("fneg", 		0x76, 				execNone);
		this.frem 			= o("frem", 		0x72, 				execNone);
		this.freturn 		= o("freturn", 		0xae, 				execNone);
		this.fstore 		= o1("fstore", 		0x38, ods.Index, 	execNone);
		this.fstore_0 		= o("fstore_0", 	0x43, 				execNone);
		this.fstore_1 		= o("fstore_1", 	0x44, 				execNone);
		this.fstore_2 		= o("fstore_2", 	0x45, 				execNone);
		this.fstore_3 		= o("fstore_3", 	0x46, 				execNone);
		this.fsub 			= o("fsub", 		0x66, 				execNone);

		this.getfield 		= o1("getfield", 	0xb4, ods.Index16, 			execNone);
		this.getstatic 		= o1("getstatic", 	0xb2, ods.Index16, 			execNone);
		this._goto 			= o1("goto", 		0xa7, ods.BranchOffset16, 	execNone);
		this.goto_w 		= o1("goto_w", 		0xc8, ods.BranchOffset32, 	execNone);

		this.i2b 			= o("i2b", 			0x91, 						execNone);
		this.i2c 			= o("i2c", 			0x92, 						execNone);
		this.i2d 			= o("i2d", 			0x87, 						execNone);
		this.i2f 			= o("i2f", 			0x86, 						execNone);
		this.i2l 			= o("i2l", 			0x85, 						execNone);
		this.i2s 			= o("i2s", 			0x93, 						execNone);
		this.iadd 			= o("iadd", 		0x60, 						execNone);
		this.iaload 		= o("iaload", 		0x2e, 						execNone);
		this.iand 			= o("iand", 		0x7e, 						execNone);
		this.iastore 		= o("iastore", 		0x4f, 						execNone);
		this.iconst_m1 		= o("iconst_m1", 	0x02, 						execNone);
		this.iconst_0 		= o("iconst_0", 	0x03, 						execNone);
		this.iconst_1 		= o("iconst_1", 	0x04, 						execNone);
		this.iconst_2 		= o("iconst_2", 	0x05, 						execNone);
		this.iconst_3 		= o("iconst_3", 	0x06, 						execNone);
		this.iconst_4 		= o("iconst_4", 	0x07, 						execNone);
		this.iconst_5 		= o("iconst_5", 	0x08, 						execNone);
		this.idiv 			= o("idiv", 		0x6c, 						execNone);
		this.if_acmpeq 		= o1("if_acmpeq", 	0xa5, ods.BranchOffset16, 	execNone);
		this.if_acmpne 		= o1("if_acmpne", 	0xa6, ods.BranchOffset16, 	execNone);
		this.if_icmpeq 		= o1("if_icmpeq", 	0x9f, ods.BranchOffset16, 	execNone);
		this.if_icmpge 		= o1("if_icmpge", 	0xa2, ods.BranchOffset16, 	execNone);
		this.if_icmpgt 		= o1("if_icmpge", 	0xa3, ods.BranchOffset16, 	execNone);
		this.if_icmple 		= o1("if_icmple", 	0xa4, ods.BranchOffset16, 	execNone);
		this.if_icmplt 		= o1("if_icmplt", 	0xa1, ods.BranchOffset16, 	execNone);
		this.if_icmpne 		= o1("if_icmpne", 	0xa0, ods.BranchOffset16, 	execNone);
		this.ifeq 			= o1("ifeq", 		0x99, ods.BranchOffset16, 	execNone);
		this.ifge 			= o1("ifge", 		0x9c, ods.BranchOffset16, 	execNone);
		this.ifgt 			= o1("ifgt", 		0x9d, ods.BranchOffset16, 	execNone);
		this.ifle 			= o1("ifle", 		0x9e, ods.BranchOffset16, 	execNone);
		this.iflt 			= o1("iflt", 		0x9b, ods.BranchOffset16, 	execNone);
		this.ifne 			= o1("ifne", 		0x9a, ods.BranchOffset16, 	execNone);
		this.ifnonnull 		= o1("ifnonnull", 	0xc7, ods.BranchOffset16, 	execNone);
		this.ifnull 		= o1("ifnull", 		0xc6, ods.BranchOffset16, 	execNone);
		this.iinc 			= o2("iinc", 		0x84, ods.Index, ods.Const, execNone);
		this.iload 			= o1("iload", 		0x15, ods.Index, 			execNone);
		this.iload_0 		= o("iload_0", 		0x1a, 						execNone);
		this.iload_1 		= o("iload_1", 		0x1b, 						execNone);
		this.iload_2 		= o("iload_2", 		0x1c, 						execNone);
		this.iload_3 		= o("iload_3", 		0x1d, 						execNone);
		this.impdep1 		= o("impdep1", 		0xfe, 						execNone);
		this.impdep2 		= o("impdep2", 		0xff, 						execNone);
		this.imul 			= o("imul", 		0x68, 						execNone);
		this.ineg 			= o("ineg", 		0x74, 						execNone);
		this._instanceof 	= o1("instanceof", 			0xc1, ods.Index16, 	execNone);
		this.invokedynamic 	= o3("invokedynamic", 		0xba, ods.Index16, ods.Zero, ods.Zero, execNone);
		this.invokeinterface = o3("invokeinterface", 	0xb9, ods.Index16, ods.Count, ods.Zero, execNone);
		this.invokespecial 	= o1("invokespecial", 		0xb7, ods.Index16, 	execNone);
		this.invokestatic 	= o1("invokestatic", 		0xb8, ods.Index16, 	execNone);
		this.invokevirtual 	= o1("invokevirtual", 		0xb6, ods.Index16, 	execNone);
		this.ior 			= o("ior", 			0x80, 						execNone);
		this.irem 			= o("irem", 		0x70, 						execNone);
		this.ireturn 		= o("ireturn", 		0xac, 						execNone);
		this.ishl 			= o("ishl", 		0x78, 						execNone);
		this.ishr 			= o("ishr", 		0x7a, 						execNone);
		this.istore 		= o1("istore", 		0x36, ods.Index, 			execNone);
		this.istore_0 		= o("istore_0", 	0x3b, 						execNone);
		this.istore_1 		= o("istore_1", 	0x3c, 						execNone);
		this.istore_2 		= o("istore_2", 	0x3d, 						execNone);
		this.istore_3 		= o("istore_3", 	0x3e, 						execNone);
		this.isub 			= o("isub", 		0x64, 						execNone);
		this.iushr 			= o("iushr", 		0x7c, 						execNone);
		this.ixor 			= o("ixor", 		0x82, 						execNone);

		// jsr and jsr_w are deprecated in Java 7+.
		this.jsr 			= o1("jsr", 		0xa8, ods.BranchOffset16, 	execNone);
		this.jsr_w 			= o1("jsr_w", 		0xc9, ods.BranchOffset32, 	execNone);

		this.l2d 			= o("l2d", 			0x8a, 				execNone);
		this.l2f 			= o("l2f", 			0x89, 				execNone);
		this.l2i 			= o("l2i", 			0x88, 				execNone);
		this.ladd 			= o("ladd", 		0x61, 				execNone);
		this.laload 		= o("laload", 		0x2f, 				execNone);
		this.land 			= o("land", 		0x7f, 				execNone);
		this.lastore 		= o("lastore", 		0x50, 				execNone);
		this.lcmp 			= o("lcmp", 		0x94, 				execNone);
		this.lconst_0 		= o("lconst_0", 	0x09, 				execNone);
		this.lconst_1 		= o("lconst_1", 	0x0a, 				execNone);
		this.ldc 			= o1("ldc", 		0x12, ods.Index, 	execNone);
		this.ldc_w 			= o1("ldc_w", 		0x13, ods.Index16, 	execNone);
		this.ldc2_w 		= o1("ldc2_w", 		0x14, ods.Index16, 	execNone);
		this.ldiv 			= o("ldiv", 		0x6d, 				execNone);
		this.lload 			= o1("lload", 		0x16, ods.Index, 	execNone);
		this.lload_0 		= o("lload_0", 		0x1e, 				execNone);
		this.lload_1 		= o("lload_1", 		0x1f, 				execNone);
		this.lload_2 		= o("lload_2", 		0x20, 				execNone);
		this.lload_3 		= o("lload_3", 		0x21, 				execNone);
		this.lmul 			= o("lmul", 		0x69, 				execNone);
		this.lneg 			= o("lneg", 		0x75, 				execNone);
		//this.lookupswitch 	= o1("lookupswitch", 0xab, ods.LookupSwitch, execNone);
		this.lor 			= o("lor", 			0x81, 				execNone);
		this.lrem 			= o("lrem", 		0x71, 				execNone);
		this.lreturn 		= o("lreturn", 		0xad, 				execNone);
		this.lshl 			= o("lshl", 		0x79, 				execNone);
		this.lshr 			= o("lshr", 		0x7b, 				execNone);
		this.lstore 		= o1("lstore", 		0x37, ods.Index, 	execNone);
		this.lstore_0 		= o("lstore_0", 	0x3f, 				execNone);
		this.lstore_1 		= o("lstore_1", 	0x40, 				execNone);
		this.lstore_2 		= o("lstore_2", 	0x41, 				execNone);
		this.lstore_3 		= o("lstore_3", 	0x42, 				execNone);
		this.lsub 			= o("lsub", 		0x65, 				execNone);
		this.lushr 			= o("lushr", 		0x7d, 				execNone);
		this.lxor 			= o("lxor", 		0x83, 				execNone);

		this.monitorenter 	= o("monitorenter", 0xc2, 				execNone);
		this.monitorexit 	= o("monitorexit", 	0xc3, 				execNone);
		this.multianewarray = o2("multianewarray", 0xc5, ods.Index16, ods.Dimensions, execNone);

		this._new 			= o1("new", 		0xbb, ods.Index16, 	execNone);
		this.newarray 		= o1("newarray", 	0xbc, ods.AType, 	execNone);
		this.nop 			= o("nop", 			0x00, 				execNone);

		this.pop 			= o("pop", 			0x57, 				execNone);
		this.pop2 			= o("pop2", 		0x58, 				execNone);
		this.putfield 		= o1("putfield", 	0xb5, ods.Index16, 	execNone);
		this.putstatic 		= o1("putstatic", 	0xb3, ods.Index16, 	execNone);

		// "ret" is implicitly deprecated in Java 7+ by deprecation of jsr and jsr_w.
		this.ret 			= o1("ret", 		0xa9, ods.Index, 	execNone); 
		this._return 		= o("return", 		0xb1, 				execNone);

		this.saload 		= o("saload", 		0x35, 				execNone);
		this.sastore 		= o("sastore", 		0x56, 				execNone);
		this.sipush 		= o2("sipush", 		0x11, ods.Byte1, ods.Byte2, execNone);
		this.swap 			= o("swap", 		0x5f, 				execNone);

		//this.tableswitch 	= o1("tableswitch", 0xaa, ods.TableSwitch, execNone);

		//this.wide 			= o1("wide", 		0xc4, ods.Wide, execNone);

		// Opcodes are not currently assigned for values 0xcb - 0xfd.
		
		this._All =
		[
			this.aaload,
			this.aastore,
			this.aconst_null,
			this.aload,
			this.aload_0,
			this.aload_1,
			this.aload_2,
			this.aload_3,
			this.anewarray,
			this.areturn,
			this.arraylength,
			this.astore,
			this.astore_0,
			this.astore_1,
			this.astore_2,
			this.astore_3,
			this.athrow,

			this.baload,
			this.bastore,
			this.bipush,
			this.breakpoint,

			this.caload,
			this.castore,
			this.checkcast,

			this.d2f,
			this.d2i,
			this.d2l,
			this.dadd,
			this.daload,
			this.dastore,
			this.dcmpg,
			this.dcmpl,
			this.dconst_0,
			this.dconst_1,
			this.ddiv,
			this.dload,
			this.dload_0,
			this.dload_1,
			this.dload_2,
			this.dload_3,
			this.dmul,
			this.dneg,
			this.drem,
			this.dreturn,
			this.dstore,
			this.dstore_0,
			this.dstore_1,
			this.dstore_2,
			this.dstore_3,
			this.dsub,
			this.dup,
			this.dup_x1,
			this.dup_x2,
			this.dup2,
			this.dup2_x1,
			this.dup2_x2,

			this.f2d,
			this.f2i,
			this.f2l,
			this.fadd,
			this.faload,
			this.fastore,
			this.fcmpg,
			this.fcmpl,
			this.fconst_0,
			this.fconst_1,
			this.fconst_2,
			this.fdiv,
			this.fload,
			this.fload_0,
			this.fload_1,
			this.fload_2,
			this.fload_3,
			this.fmul,
			this.fneg,
			this.frem,
			this.freturn,
			this.fstore,
			this.fstore_0,
			this.fstore_1,
			this.fstore_2,
			this.fstore_3,
			this.fsub,

			this.getfield,
			this.getstatic,
			this._goto,
			this.goto_w,

			this.i2b,
			this.i2c,
			this.i2d,
			this.i2f,
			this.i2l,
			this.i2s,
			this.iadd,
			this.iaload,
			this.iand,
			this.iastore,
			this.iconst_m1,
			this.iconst_0,
			this.iconst_1,
			this.iconst_2,
			this.iconst_3,
			this.iconst_4,
			this.iconst_5,
			this.idiv,
			this.if_acmpeq,
			this.if_acmpne,
			this.if_icmpeq,
			this.if_icmpge,
			this.if_icmpgt,
			this.if_icmple,
			this.if_icmplt,
			this.if_icmpne,
			this.ifeq,
			this.ifge,
			this.ifgt,
			this.ifle,
			this.iflt,
			this.ifne,
			this.ifnonnull,
			this.ifnull,
			this.iinc,
			this.iload,
			this.iload_0,
			this.iload_1,
			this.iload_2,
			this.iload_3,
			this.impdep1,
			this.impdep2,
			this.imul,
			this.ineg,
			this._instanceof,
			this.invokedynamic,
			this.invokeinterface,
			this.invokespecial,
			this.invokestatic,
			this.invokevirtual,
			this.ior,
			this.irem,
			this.ireturn,
			this.ishl,
			this.ishr,
			this.istore,
			this.istore_0,
			this.istore_1,
			this.istore_2,
			this.istore_3,
			this.isub,
			this.iushr,
			this.ixor,

			this.jsr,
			this.jsr_w,

			this.l2d,
			this.l2f,
			this.l2i,
			this.ladd,
			this.laload,
			this.land,
			this.lastore,
			this.lcmp,
			this.lconst_0,
			this.lconst_1,
			this.ldc,
			this.ldc_w,
			this.ldc2_w,
			this.lload,
			this.lload_0,
			this.lload_1,
			this.lload_2,
			this.lload_3,
			this.lmul,
			this.lneg,
			//this.lookupswitch,
			this.lor,
			this.lrem,
			this.lreturn,
			this.lshl,
			this.lshr,
			this.lxor,

			this.monitorenter,
			this.monitorexit,
			this.multianewarray,

			this._new,
			this.newarray,
			this.nop,

			this.pop,
			this.pop2,
			this.putfield,
			this.putstatic,

			this.ret,
			this._return,

			this.saload,
			this.sastore,
			this.sipush,
			this.swap,

			//this.tableswitch,
			//this.wide
		];

		this._AllByMnemonic =
			new Map(this._All.map(x => [x.mnemonic, x]));

		this._AllByValue =
			new Map(this._All.map(x => [x.value, x]));

	}

	fromMnemonic(mnemonic)
	{
		return this._AllByMnemonic.get(mnemonic);
	}

	fromValue(value)
	{
		return this._AllByValue.get(value);
	}
}
