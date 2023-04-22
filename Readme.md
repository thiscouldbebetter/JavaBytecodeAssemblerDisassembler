JavaBytecodeAssemblerDisassembler
=================================

The JavaScript code in this repository, provides an interface
that allows the user to assemble and disassemble Java bytecode.

As of this writing, all but three of the opcodes in the instruction
set can be assembled and disassembled.  The missing instructions
involve variable-length operands, and are a bit complicated.

Also partially implemented is a Java Virtual Machine that,
in theory, may someday run these instructions.  However,
as of this writing, only the first few opcodes have the execute
methods to support being run, and none of those are tested.


