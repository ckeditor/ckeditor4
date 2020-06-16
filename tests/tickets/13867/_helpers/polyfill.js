( function() {
	'use strict';

	if ( !( 'Element' in window ) ) {
		return;
	}

	var sinonStub = window.parent.sinon.stub;

	window.classListStub = {
		add: sinonStub(),
		remove: sinonStub(),
		toggle: sinonStub(),
		contains: sinonStub(),
		item: sinonStub()
	};

	if ( !( 'classList' in document.createElement( '_' ) ) ) {
		var descriptor = {
				get: function() {
					return window.classListStub;
				},
				enumerable: false,
				configurable: true
			};

		Object.defineProperty( Element.prototype, 'classList', descriptor );
	}
} )();
