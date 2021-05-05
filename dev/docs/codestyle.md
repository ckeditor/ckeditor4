# Code style guide for [CKEditor 4](https://ckeditor.com/ckeditor/ckeditor4)

**Table of contents**

* [1. Introduction](#1-introduction)
	* [1.1. Mottos](#11-mottos)
* [2. Code style guide](#2-code-style-guide)
	* [2.1. Whitespace](#21-whitespace)
	* [2.2. Beautiful Syntax](#22-beautiful-syntax)
	* [2.3. Type Checking (Courtesy jQuery Core Style Guidelines)](#23-type-checking)
	* [2.4. Conditional Evaluation](#24-conditional-evaluation)
	* [2.5. Practical Style](#25-practical-style)
	* [2.6. Naming](#26-naming)
	* [2.7. Faces of `this`](#27-faces-of-this)
	* [2.8. Misc](#28-misc)
	* [2.9. Native & Host Objects](#29-native--host-objects)
	* [2.10. Comments](#210-comments)
* [3. Tests](#3-tests)
	* [3.1. Manual tests](#31-manual-tests)

## 1. Introduction

**This document is based on [Idiomatic.JS](https://github.com/rwldrn/idiomatic.js).** However, it contains many clarifications and rules specific for projects maintained by [CKSource](https://cksource.com/) like [CKEditor 4](https://github.com/ckeditor/ckeditor4).

### 1.1. Mottos

> #### All code in any code-base should look like a single person typed it, no matter how many people contributed.
> _Unknown author_

> #### Arguments over style are pointless. There should be a style guide, and you should follow it.
>_Rebecca_ _Murphey_

> #### Part of being a good steward to a successful project is realizing that writing code for yourself is a Bad Idea™. If thousands of people are using your code, then write your code for maximum clarity, not your personal preference of how to get clever within the spec.
>_Idan_ _Gazit_

## 2. Code style guide

### 2.1 Whitespace
- Always use tabs. Never use spaces for indentation (for both - code and comments).
- Do not leave trailing spaces (**note:** empty lines should not contain any spaces).
- Always use LF line endings. Never use CRLF.
- Each file end up with an empty line character EOL.
- If your editor supports it, always work with the "show invisibles" setting turned on. The benefits of this practice are:
  - Enforced consistency.
  - Eliminating end of line whitespace.
  - Eliminating blank line whitespace.
  - Commits and diffs that are easier to read.

Related settings for [Editor Config](https://editorconfig.org/):

```
root = true

[*]
end_of_line = lf
insert_final_newline = true

indent_style = tab
trim_trailing_whitespace = true
```

### 2.2. Beautiful syntax

#### 2.2.1. Parens, Braces, Linebreaks

##### 2.2.1.1. Use whitespace to promote readability

```javascript
if ( condition ) {
	// statements
}

if ( true ) {
	// statements
} else {
	// statements
}

if ( true ) {
	// statements
}
// Comments regarding what "else" means and does.
else {
	// statements
}

while ( condition ) {
	// statements
}

for ( var i = 0; i < 100; i++ ) {
	// statements
}

try {
	// statements
} catch ( e ) {
	// statements
}

```

##### 2.2.1.2. Always use brackets even for a single line statements

```javascript
// Bad
if ( true ) // statement

// Good
if ( true ) {
	// statement
}

// Bad
if ( false ) // statement
else // statement

// Good
if ( false ) {
	// statement
} else {
	// statement
}
```

##### 2.2.1.3. Split long conditional statements

```javascript
if ( condition1 ||
	condition2 ||
	condition3 ) {
	// statement
}
```

#### 2.2.2. Assignments, Declarations, Functions

##### 2.2.2.1. Single line per declaration

Declaring one variable per line improves debugging experience. Multiple variables declared in the same line won't allow you to place breakpoint at the definition computation. The same goes to object literals.

```javascript
// Bad
var foo = 'foo', bar = 'bar',
	object = {
		foo: 'foo', bar = 'bar' // Also bad
	};

// Good
var foo = 'foo',
	bar = 'bar',
	object = {
		foo: 'foo',
		bar: 'bar'
	};

```

##### 2.2.2.2. One variable per scope

Using only one variable per scope (function) promotes readability and keeps your declaration list free of clutter (also saves a few keystrokes). However, if a scope have [early returns](281-early-returns) statements, it will be more readable and performance wise declaring variable later, when definition is needed.

```javascript
// Bad.
function foo() {
	// 2 statements

	var bar = '';

	// 2 statements

	var foo = '';

	// 10 statements

	var bom = '';

	// some statements
}

// Good
function foo() {
	var bar = '',
		foo = '';

	// some statements
}

// Bad
function bar( x ) {
	var foo = doSomethingSlow();

	if ( x < 2 ) {
		return;
	}

	// some statements
}

// Good
function bar( x ) {
	if ( x < 2 ) {
		return;
	}

	var foo = doSomethingSlow();

	// some statements
}
```

##### 2.2.2.3. Function declaration

Prefer function declaration instead of function expression to avoid issues with executing function before it has been defined.

```javascript
// Good
square( 10 );

function square( number ) {
	return number * number;
}

// Bad
square( 10 );

var square = function( number ) {
	return number * number;
};
```

##### 2.2.2.4. Continuation-Passing style

If your function should be executed asynchronously or requires additional callback (e.g. filter function) as an function argument, pass it as the last argument in function signature. Prefer [Promises](#2225-promises) for asynchronous code when possible.

```javascript
// Declaration.
function square( number, callback ) {
	callback( number * number );
}

// Usage.
square( 10, function( square ) {
	// callback statements
} );
```

##### 2.2.2.5. Promises

Preferably, asynchronous code is written using Promises. It's not always possible when maintaining code, however, prefer Promise based code for new features and everythere where you have control over API structure consumer. Always use [`CKEDITOR.tools.promise`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_tools_promise.html) instead of native `Promise` object for wider browser support.

```javascript
var promise = new CKEDITOR.tools.promise( function( resolve, reject ) {
    getContentFromFileServer( options, function( result ) {
        if ( result.status === 200 ) {
            resolve( result.data );
        } else {
            reject( result.error );
        }
    } );
} );
```

##### 2.2.2.6 Constructor declaration

Prefer using [`CKEDITOR.tools.createClass`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_tools.html#method-createClass) API instead of native constructor declaration.

```javascript
// Good
var FooBar = CKEDITOR.tools.createClass( {
	$: function( message ) {
		this.message = message;
	},

	proto: {
		greeting: function() {
			console.log( this.message );
		}
	}
} );

var fooBar = new FooBar( 'Hello, World!' );

fooBar.greeting();
// 'Hello, World!'

// Bad
function FooBar( message ) {
	this.message = message;
}

FooBar.prototype.greeting = function() {
	console.log( this.message );
};

var fooBar = new FooBar( 'Hello, World!' );

fooBar.greeting();
// 'Hello, World'
```

#### 2.2.3. Code structure

##### 2.2.3.1. Public API

Exposing public API should have much higher priority in file structure than private members. It improves API discoverability and hides private members.

```javascript
// Simple module.
CKEDITOR.module1 = {
	pubFoo: function() {
		this.privFoo();
	},

	pubBar: function() {
		this.privBar();
	},

	privFoo: function() {
		// ...
	},

	privBar: function() {
		// ...
	}
};

// Using module pattern.
var module = ( function() {
	// Exposing public API.
	return {
		foo: foo,
		bar: bar
	}

	function foo() {
		bar();
	}

	// Private helpers.
	function bar() {
		// ...
	}
} )();
```

##### 2.2.3.2. Helper functions

When extracting helper function, move it right after the first usage inside the nearest scope which won't affect code performance and memory usage. In most cases, you want to keep helper functions on the same scope level as a public one unless they are used somewhere else in the same file. Do not forget about [public API](#2231-public-api) rule where main code flow have higher priority than private helpers.

```javascript
CKEDITOR.module1 = {
	doSomething: function() {
		// Good
		foo();

		bar();

		// Bad thus the function object will be created every time when doSomething function executed.
		function bar() {
			// ...
		}
	}
};

CKEDITOR.module2 = {
	doSomething: function() {
		// Note that despite this function is used in another module later,
		// it has been correctly declared as close as possible to the first usage.
		foo();
	}
}

// We are moving helper functions lower in correct order to keep main code flow happy.
function foo() {
	baz();
	quix();
}

function baz() {
	// ...
}

function quix() {
	// ...
}
```

Note that the same practice applies to objects:

```javascript
CKEDITOR.module1 = {
	foo: function() {
		this.bar();
	},

	bar: function() {
		// ...
	},

	baz: function() {
		// ...
	}
};
```

##### 2.2.3.3. Configuration members

Configuration members exposed by [`CKEDITOR.config`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html) object should be moved at the end of the code file. It's adapted practice in CKEditor code base which improves configuration options discoverability.

```javascript
CKEDITOR.plugins.add( 'myplugin', definition );

// ... some code goes here ...
// ... more lines of code ...
// ... just don't wake up Cthulhu ...

CKEDITOR.config.foo = 'foo';
CKEDITOR.config.bar = 'bar';
```

#### 2.2.4. Quotes

Always use single quotes in JavaScript, but double quotes in HTML.

### 2.3. Type checking

#### 2.3.1. Actual Types

String:

```javascript
typeof variable === 'string'
```

Number:

```javascript
typeof variable === 'number'
```

Boolean:

```javascript
typeof variable === 'boolean'
```

Object:

```javascript
typeof variable === 'object'
```

Array:

```javascript
// In CKEditor:
CKEDITOR.tools.isArray( arrayLikeObject )
// In other cases:
Array.isArray( arrayLikeObject )
(wherever possible)
```

Node:

```javascript
// In CKEditor:
elem.type === CKEDITOR.NODE_ELEMENT
// In other cases:
elem.nodeType === Node.ELEMENT_NODE
```

null:

```javascript
variable === null
```

undefined:

```javascript
variable === undefined
```

#### 2.3.2. Coerced Types

Use coercion with caution. In most cases prefer explicit type casting than using implicit operator coercion. Note that some practices are more common than the others, so use common sense to choose correct casting method.

##### 2.3.2.1. Boolean coercion

Boolean coercion leveraged by double `!!` is widely adopted in CKEditor 4 codebase and it's one of the exception where you should use implicit coercion to its popularity.

Small explanation how double `!!` works:

1. The first `!` negates value and parses it into boolean value.
2. The second `!` flips negation.

```javascript
var string = 'some string value',
	object = {
		foo: 'foo'
	},
	number = 0,
	nothing = null;

!!string
// true

!!number
// false

!!object
// true

!!nothing
// false
```

#### 2.3.3. Coercion practices to avoid

Avoid using unpopular coercion operators due to lacking readability. Most of them have explicit versions, which are much more readable.

##### 2.3.3.1. Bitwise NOT operator

Instead of bitwise NOT operator `~` prefer explicit aproach by comparing returned value.

```javascript
var array = [ 'a', 'b', 'c' ];

// Bad
if ( ~array.indexOf( 'a' ) ) {
	// ...
}

// Good
if ( array.indexOf( 'a' ) >= 0 ) {
  // ...
}
```

##### 2.3.3.2. Double bitwise NOT operator
Instead of double bitwise NOT operator `~~` resulting in numerical substitution, use `Math.floor` or `parseInt` methods.

```javascript
var num = 2.5;

// Bad
~~num;

// Good
parseInt( num, 10 );

// Good
Math.floor( num );
```

##### 2.3.3.3. String coercion

Do not use empty string concatenation to convert primitive values into strings.

```javascript

// Bad
number + '';

// Good
String( number );

var boolean = true;

// Bad
boolean + '';

// Good

String( boolean );
```

##### 2.3.3.4. Number coercion

Do not use numeric operators to convert primitive values into numbers.

```javascript
var string = '5';

// Bad
+string;

// Good
Number( string );

var boolean = true;

// Bad
+boolean;

// Good
Number( boolean );
```

##### 2.3.3.5. Null or undefined coercion

Do not use double `==` to match both `undefined` and `null` values. Prefer explicit comparison instead.

```javascript
// Bad
if ( value == null ) ...

// Good
if ( foo === null || foo === undefined ) ...
```

##### 2.3.3.5 Types coercion

Preserve extra caution using types coercion, where it doesn't make logical sense.

```javascript
Number( [] );
// 0
[] == false
// true
```

### 2.4. Conditional Evaluation

#### 2.4.1. Boolean array evaluation

```javascript
// When only evaluating that an array has length,
// instead of this:
if ( array.length > 0 ) ...

// ...evaluate truthiness, like this:
if ( array.length ) ...

// When only evaluating that an array is empty,
// instead of this:
if ( array.length === 0 ) ...

// ...evaluate truthiness, like this:
if ( !array.length ) ...
```

#### 2.4.2. Boolean string evaluation
```javascript
// When only evaluating that a string is not empty,
// instead of this:
if ( string !== '' ) ...

// ...evaluate truthiness, like this:
if ( string ) ...

// When only evaluating that a string _is_ empty,
// instead of this:
if ( string === '' ) ...

// ...evaluate falsyness, like this:
if ( !string ) ...
```

#### 2.4.3. Boolean evaluation

```javascript
// When only evaluating that a reference is true, instead of this:
if ( foo === true ) ...

// ...evaluate like you mean it, take advantage of built in capabilities:
if ( foo ) ...

// When evaluating that a reference is false, instead of this:
if ( foo === false ) ...

// ...use negation to coerce a true evaluation
if ( !foo ) ...

// ...Be careful, this will also match: 0, '', null, undefined, NaN. If you MUST test for a boolean false, then use:
if ( foo === false ) ...
```

#### 2.4.4. Boolean ref evaluation

In most cases [Boolean evaluation](#243-boolean-evaluation) for falsy reference is enough, but if you really need to check if value is not `undefined` or `null` (like when `false` is an expected value) preferexplicit comparison. See [Null or undefined coercion](2335-null-or-undefined-coercion).

```javascript
// When evaluating that reference is null or undefined, prefer explicit comparison:
if ( foo === null || foo === undefined ) ...

// instead of == type coercion:
if ( foo == null ) ...
```

#### 2.4.5. Loose equality coercion
Use loose equality operator to simplify your code when you want to leverage type coercion. Remember that strict equality comparator `===` is checking if both the type and the value you are comparing are the same. In a constract, loose equality operator `==` will try to do type coercion which may be useful in some cases when comparing values where types are less revelant than values.

```javascript
false === 'false'
// false

false == 'false'
// true

// 1 === '1'
// false

// 1 == '1'
// true
```

#### 2.4.6. Booleans, Truthies & Falsies
```javascript
// Booleans:
true, false

// Truthy:
"foo", 1

// Falsy:
"", 0, null, undefined, NaN, void 0
```

### 2.5. Practical Style

#### 2.5.1. Module pattern

```javascript
( function() {
	var Module = ( function() {
		var data = "secret";

		return {
			// This is some boolean property.
			bool: true,
			// Some string value.
			string: 'a string',
			// An array property.
			array: [ 1, 2, 3, 4 ],
			// An object property.
			object: {
				lang: 'en-Us'
			},

			getData: function() {
				// Get the current value of `data`.
				return data;
			},

			setData: function( value ) {
				this.value = value;
			}
		};
	} )();

	// Other things might happen here.

	// Expose our module to the global object.
	CKEDITOR.module = Module;
} )();
```
#### 2.5.2. Practical constructor

```javascript
( function() {
	var FooBar = CKEDITOR.tools.createClass( {
		$: function( foo ) {
			this.foo = foo;
		},

		proto: {
			getFoo: function() {
				return this.foo;
			},

			setFoo: function( val ) {
				this.foo = val;
			}
		}
	} );

	// Expose our constructor to the global object.
	CKEDITOR.fooBar = FooBar;
} )();
```

#### 2.5.3. Prototype extension

```javascript
( function() {
	var FooBar = CKEDITOR.tools.createClass( {
		// class definition
	} );

	CKEDITOR.tools.extend( FooBar.prototype, {
		getFoo: function() {
			return this.foo;
		},

		setFoo: function( val ) {
			this.foo = val;
		}
	} );

	// Expose our constructor with extended prototype to the global object.
	CKEDITOR.fooBar = FooBar;
} )();
```

### 2.6. Naming

You are not a human code compiler/compressor, so don't try to be one.

The following code is an example of egregious naming:

```javascript
function q(s) {
	return document.querySelectorAll(s);
}
var i,a=[],els=q("#foo");
for(i=0;i<els.length;i++){a.push(els[i]);}
```

Here's the same piece of logic, but with kinder, more thoughtful naming (and a readable structure):
```javascript

function query( selector ) {
	return document.querySelectorAll( selector );
}

var elements = [],
	matches = query( '#foo' ),
	length = matches.length;

for ( var i = 0; i < length; i++ ) {
	elements.push( matches[ i ] );
}
```

#### 2.6.1. Methods and functions

Methods and functions are **almost always** verbs/actions in `camelCase` notation:

```javascript
// Good
execute();
this.getNextNumber();

// Bad
this.editable();
this.status();
```

The exception for the above are get/set methods that are used very often, where the first parameter is the thing to get/set and the second is the optional value (set with it and get without):

```javascript
this.data( 'name' );  // get
this.data( 'name', 'John' );  // set

this.attr( 'title' );  // get
this.attr( 'title', 'Flying plane' );  // set
```

#### 2.6.2. Properties and variables

Properties and variables are **almost always** nouns in `camelCase` notation:

```javascript
var editor;
this.name;
this.editable;
```
Boolean properties and variables are **always** prefixed by an auxiliary verb:

```javascript
this.isDirty;
this.hasChildren;
this.isFake;
```
Properties that require computation, instead of having them as `getXXX()` and `setXXX()` accessing methods, can be named as nouns, when are programmatically and conceptually simple:

```javascript
editor.setStatus( 404 ); // setter
this.status; // getter

editor.setReadOnly( true ); // setter
editor.readOnly; // getter
```

#### 2.6.3. Private members

Only use underscore `_` name as an object member with private properties:

```javascript
var object = {
	// Public member.
	foo: {},
	// Also public member.
	bar: {},
	// Private member and everything contained inside this object is also private.
	_: {}
}
```

Avoid using underscore `_` with private variables, methods and functions. Note that all undocumented members are private by default, so there is no need beeing explicit here.

```javascript
// Bad
var object = {
	_foo: {}
};

// Good
var object = {
	foo: {}
};

// Also good, but note that explicitivness is only needed for easier distinction between public and private members.
var object = {
	/*
	 * @private
	 */
	 foo: {},

	/*
	 * Some nice description here.
	 * @property {Object}
	 */
	 bar: {}
};
```

#### 2.6.4. Constants

Constants are **always** nouns in `UNDERSCORE_SNAKE_CASE` notation:

```javascript
// Constant variables.
var CONSTANT_VARIABLE = 999;

// Constant enum.
CKEDITOR.sth.CONSTANT_ENUM = 1;
```

#### 2.6.5. Configuration members

If configuration member is a part of core codebase, go with `camelCaseNaming` notation.

```javascript
CKEDITOR.config.fooBarBaz = true;
```

If configuration member is a part of [plugin](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_plugins.html) functionality, use `pluginName_optionName` pattern consisting of mixed `camelCase` plugin and option naming separated with underscore `_`.

```javascript
CKEDITOR.config.myPlugin_myProperty = true;
```

#### 2.6.6. Types

Constructors created with [`CKEDITOR.tools.createClass`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_tools.html#method-createClass) API are **always** nouns in `PascalCase` notation:

```javascript
var FooBar = CKEDITOR.tools.createClass( {
	$: function( message ) {
		this.message = message;
	},

	proto: {
		greeting: function() {
			console.log( this.message );
		}
	}
} );
```
Constructor functions are **always** nouns in `PascalCase` notation:

```javascript
function FooBar( message ) {
	this.message = message;
}

FooBar.prototype = {
	greeting: function() {
		console.log( this.message );
	}
};
```

But should **always** be exposed in `camelCase` notation publicly:

```javascript
CKEDITOR.fooBar = FooBar;
```

### 2.7. Faces of `this`

#### 2.7.1. Event listeners

Keep `this` "local" to the class. This means &ndash; do not bind e.g. a function in `selection.js` file to editor instance and do not create a function which should be ran in editor context. This way you'll avoid confusion what `this` refers to.

```javascript
function Selection() {
	var editor = this.editor;

	// Bad:
	this.editor.on( 'setData', someCallback, editor );

	// Still bad:
	this.editor.on( 'setData', CKEDITOR.tools.bind( someCallback, editor ) );

	// Good:
	this.editor.on( 'setData', someCallback, this );

	// Good:
	this.getEditor().on( 'setData', function( evt ) {
		evt.editor.doSomething();
	} );
}

function someCallback() {
	// Should refer to Selection, not Editor.
	var editor = this.editor;
	// ...
}
```

#### 2.7.2. Use `thisArg` argument

Several prototype methods of ES 5.1 built-ins come with a special `thisArg` signature. CKEditor follows this practice too, which should be used whenever possible. For example [`eventTarget.on`](http://docs.ckeditor.com/#!/api/CKEDITOR.event-method-on) also accepts context as an argument.

```javascript
var obj = {
	f: 'foo',
	b: 'bar',
	q: 'qux'
};

Object.keys( obj ).forEach( function( key ) {

	// |this| now refers to `obj`

	console.log( this[ key ] );

}, obj ); // <-- the last arg is `thisArg`

// Prints...

// 'foo'
// 'bar'
// 'qux'
```

`thisArg` can be used with most [Object](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_tools_object.html) and [Array](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_tools_array.html) CKEditor 4 helpers.

#### 2.7.3. Binding `this` to the function scope

Beyond the generally well known use cases of `call` and `apply`, always prefer [`CKEDITOR.tools.bind( fn, this )`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_tools.html#method-bind) for creating `BoundFunction` definitions for later invocation.

```javascript
function Device( opts ) {
	stream.read( opts.path, CKEDITOR.tools.bind( function( value ) {
		this.value = value;
	}, this ) );
}
```

Only resort to aliasing when no preferable option is available.

```javascript
function Device( opts ) {
	var self = this;
	stream.read( opts.path, function( value ) {
		self.value = value;
	} );
}
```

### 2.8. Misc

This section will serve to illustrate ideas and concepts that should not be considered dogma, but instead exists to encourage questioning practices in an attempt to find better ways to do common JavaScript programming tasks.

#### 2.8.1. Early returns

Early returns promote code readability with negligible performance difference.
```javascript
// Bad:
function returnLate( range ) {
	var docFragment = range.cloneContents();

	if ( range.collapsed ) {
		return;
	}

	// ...
}

// Good:
function returnEarly( range ) {
	if ( range.collapsed ) {
		return;
	}

	var docFragment = range.cloneContents();

	// ...
}
```

### 2.9. Native & Host Objects

The basic principle here is:

	Don't extend native objects and everything will be ok.

CKEditor is a widget - an application inside someone's system &ndash; so... do not touch anything except `CKEDITOR.*` namespace.


### 2.10. Comments
- Single line above the code that is subject (except for long expressions like conditions).
- Comment is a sentence - start it with capital leter, end with period.
- Use multiline comments only for API documentation.
- Comments should be **almost always** put above code, not below.
- Check the [JSDuck documentation guide](http://dev.ckeditor.com/wiki/CodeDocumentation).
- You can use JSDuck documentation style for private functions, but then use single line comments.

```javascript
// Some docs for private functions.
// @param {Object} foo
// @param {object} bar
// returns {Number}
```

- Justify end line comments with tabs:

```javascript
if ( some != really.complex &&      // Comment line 1.
	condition || with &&            // Comment line 2.
	( multiple == !lines ) )        // Comment line 3.

// Of course it's better to avoid this spaghetti at all.
```

- Fixing a bug should result in additional ticket reference comment written as `(#1345)` comment.

```javascript
// (#1345)
if ( requiresPromisePolyfill() ) {
	// ...
}
```

## 3. Tests

### 3.1. Manual tests

Manual tests reproduction steps should be structured in one, ubiquitous way, to unify test files, so they are easy to read and modify. Manual test file should consist only of a single test suite. Also, avoid putting many test cases in the same file, extract common logic instead using helper methods or template files.

Example of the correct manual test:

```md
@bender-tags: 4.14.0, feature, 999
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles
@bender-include: helpers/utils.js

1. Focus the editor.
1. Type `Hello, World!`.
1. Press `enter`.

**Expected**

* Editor is responsive.
* Typed text has been registered by the editor.

**Unexpected**

* Editor loses focus.
* Typed text is in the reverse order.
```

You can also inline `Expected/Unexpected` if they are consist of the single sentence line:

```md
@bender-tags: 4.14.0, feature, 999
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles
@bender-include: helpers/utils.js

1. Focus the editor.
1. Type `Hello, World!`.
1. Press `enter`.

**Expected** Editor is responsive.

**Unexpected** Editor is not responsive.
```

And even skip `Unexpected` if `Expected` result is obvious enough to guess `Unexpected`:

```md
@bender-tags: 4.14.0, feature, 999
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles
@bender-include: helpers/utils.js

1. Focus the editor.
1. Type `Hello, World!`.
1. Press `enter`.

**Expected** Editor is responsive.
```

If you need to repeat some test steps for the same test case, make it obvious enough by numbering test steps instead of using `1` everywhere. But note, that such practice should be also used when test is very simple and additional test case won't add too much complexity to the test file:

```md
@bender-tags: 4.14.0, feature, 999
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles
@bender-include: helpers/utils.js

1. Focus the editor.
2. Type `Hello, World!`.
3. Press `enter`.

**Expected** Editor is responsive.

4. Repeat 1-2.
5. Press `tab`.

**Expected** Editor is responsive.
```

But **NEVER** put more than one test suite into the same manual test file:

```md
@bender-tags: 4.14.0, feature, 999
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles
@bender-include: helpers/utils.js

### Classic editor

1. Focus the editor.
2. Type `Hello, World!`.
3. Press `enter`.

**Expected** Editor is responsive.

### Inline editor

1. Focus the editor.

**Expected** Toolbar shows up.
```

Extract common logic instead using helper functions for HTML files or use `__template__.html` feature which will share the same HTML file among manual tests in the same folder. It's better to accept some small duplication than overrun manual testing due to high test complexity.

In test scenarios indentation with tabs is preferred most of the time. However, to force bender to properly render nested lists, use spaces instead.

----------


<a rel="license" href="http://creativecommons.org/licenses/by/3.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/3.0/80x15.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Principles of Writing Consistent, Idiomatic JavaScript</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/rwldrn/idiomatic.js" property="cc:attributionName" rel="cc:attributionURL">Rick Waldron and Contributors</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/3.0/deed.en_US">Creative Commons Attribution 3.0 Unported License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="https://github.com/rwldrn/idiomatic.js" rel="dct:source">github.com/rwldrn/idiomatic.js</a>.
