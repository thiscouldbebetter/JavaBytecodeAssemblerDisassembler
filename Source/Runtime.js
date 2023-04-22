
class Runtime
{
	constructor()
	{
		this.classNames = [];

		this.scopeStack = new Stack();
		this.scopePush();
	}

	scope()
	{
		return this.scopeStack[0];
	}

	scopePop()
	{
		this.scopeStack.pop();
	}

	scopePush()
	{
		var scope = new RuntimeScope();
		this.scopeStack.push();
	}

	// Convenience methods.

	get(index)
	{
		return this.scope().get(index);
	}

	set(index, value)
	{
		this.scope().set(index, value);
	}

	obj(index)
	{
		return this.scope().obj(index);
	}

	pop()
	{
		return this.scope().pop();
	}

	push(value)
	{
		this.scope().push(value);
	}

	typ(index)
	{
		return this.classNames[index];
	}
}

class RuntimeScope
{
	constructor()
	{
		this.locals = [];
		this.objects = [];
		this.stack = new Stack();
	}

	// Convenience methods.

	get(index)
	{
		return this.locals[index];
	}

	set(index, value)
	{
		this.locals[index] = value;
	}

	obj(index)
	{
		return this.objects[index];
	}

	pop()
	{
		return this.stack.pop();
	}

	push(value)
	{
		this.stack.push(value);
	}
}

class Stack
{
	constructor()
	{
		this.arrayInner = [];
	}

	clear()
	{
		this.arrayInner.length = 0;
	}

	pop()
	{
		if (this.arrayInner.length == 0)
		{
			throw new Error("Cannot pop from empty stack.");
		}
		else
		{
			var returnValue = this.arrayInner[0];
			this.arrayInner.splice(0, 1);
			return returnValue;
		}
	}

	push(value)
	{
		this.arrayInner.splice(0, 0, value);
	}
}