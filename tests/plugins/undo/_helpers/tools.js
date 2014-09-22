/* exported undoEventDispatchTestsTools */

'use strict';

/**
 * These tools stores functions explicitly for Events dispatching, therefore names does not
 * begin with prefix like 'fire'.
 *
 * This function has name `undoEventDispatchingTestsTools` rather than `undoTestsTools` to
 * put emphesise that it members are designed to fire event.
 *
 * Currently all the events fires only on editable.
 */
var undoEventDispatchTestsTools = function( testSuite ) {
	var event = {
		/**
		 * Generic function to fire event on editable. Note it will automatically add type property to
		 * `eventProperties`.
		 * @param {String} eventType
		 * @param {Object} eventProperties Object which will be passed to CKEDITOR.dom.event constructor.
		 */
		editableEvent: function( eventType, eventProperties ) {
			eventProperties = eventProperties || {};
			eventProperties.type = eventType;
			var ckEvent = new CKEDITOR.dom.event( eventProperties );

			testSuite.editor.editable().fire( eventType, ckEvent );
			// Fire event on the <html> element - pretend event's bubbling.
			testSuite.editor.document.getDocumentElement().fire( eventType, ckEvent );
		}
	};

	var keyboard = {
		singleKeyEvent: function( keyCode, eventInfo, editor ) {
			editor = editor || testSuite.editor;
			eventInfo = eventInfo || {};

			if ( !eventInfo.type )
				throw new TypeError( 'keyEvent(): eventInfo must have type property' );

			eventInfo.keyCode = keyCode;
			event.editableEvent( eventInfo.type, eventInfo );
		},

		/**
		 * @param {domModificationFn} function which will be executed before input / keyup event. It has to
		 * mimic dom modification.
		 */
		keyEvent: function( keyCode, eventInfo, skipInputEvent, domModificationFn ) {
			eventInfo = eventInfo || {};
			// Make sure that we wont modify input parameter.
			eventInfo = CKEDITOR.tools.clone( eventInfo );

			eventInfo.type = 'keydown';
			this.singleKeyEvent( keyCode, eventInfo );

			// IE: keypress acts as a input event, so we need to skip it.
			if ( !CKEDITOR.env.ie || !skipInputEvent ) {
				// Note in theory keypress should have changed keyCode.
				eventInfo.type = 'keypress';
				this.singleKeyEvent( keyCode, eventInfo );
			}

			// If any DOM operation should be performed before input.
			if ( domModificationFn )
				domModificationFn();

			if ( !skipInputEvent ) {
				// Eventually we might fire textInput right before input event.
				eventInfo.type = 'input';
				event.editableEvent( 'input' );
			}

			eventInfo.type = 'keyup';
			this.singleKeyEvent( keyCode, eventInfo );
		},

		/**
		 * Calls keyEvent() with given ammount of times.
		 */
		keyEventMultiple: function( repeatTimes, keyCode, eventInfo, skipInputEvent, domModificationFn ) {
			for ( var i = 0; i < repeatTimes; i++ )
				this.keyEvent( keyCode, eventInfo, skipInputEvent, domModificationFn );
		},

		/**
		 * Generic function to fire event. Note it will automatically add type property to
		 * `eventProperties`.
		 * @param {String} eventType
		 * @param {Object} eventProperties Object which will be passed to CKEDITOR.dom.event constructor.
		 */
		singleEvent: function( eventType, eventProperties ) {
			eventProperties = eventProperties || {};
			eventProperties.type = eventType;
			var ckEvent = new CKEDITOR.dom.event( eventProperties );

			testSuite.editor.editable().fire( eventType, ckEvent );
		},

		/**
		 * This function ties to mimic standard typing event. It will fire events like
		 * keydown, keypress, input, keyup for all given characters.
		 */
		typingEvents: function( inputText ) {
			for ( var i = 0; i < inputText.length; i++ ) {
				var keyCode = this._keyCodeFromChar( inputText[ i ] );
				this.keyEvent( keyCode );
			}
		},

		/**
		 * Note: this function works only for a-zA-Z strings.
		 * Returns the keyCode for given char. It may also return keyCode for `keypress` event, which is
		 * slightly diffent from `keydown`/`keyup`.
		 *
		 * @param {String} char Description
		 * @param {Boolean} forKeyPressEvent Whether keypress compilant keyCode should be returned or normal?
		 * @returns {Number}
		 */
		_keyCodeFromChar: function( character, forKeyPressEvent ) {
			if ( forKeyPressEvent )
				return character.charCodeAt( 0 );

			return character.toUpperCase().charCodeAt( 0 );
		},

		/**
		 * Simple mapping of key codes to human readable identifiers. Moved to the end of object,
		 * because it might get long.
		 */
		keyCodesEnum: {
			BACKSPACE: 8,
			DELETE: 46,

			KEY_D: 68,
			KEY_G: 71,

			RIGHT: 39,
			LEFT: 37,
			DOWN: 40,
			UP: 38,

			HOME: 36,
			END: 35,
			PAGEUP: 33,
			PAGEDOWN: 34,

			F4: 115
		}
	};

	var mouse = {
		/**
		 * Simulates full click events set on editable: mousedown, click, mouseup.
		 * @param {CKEDITOR.dom.element} target Clicked element.
		 * @param {Function} domModificationFn Function called between mousedown and click event. Most of the time youl'll
		 * want change range here.
		 */
		click: function( target, domModificationFn ) {

			if ( !target )
				target = testSuite.editor.editable();

			var domEventMockup = {
				target: target.$
			};

			event.editableEvent( 'mousedown', domEventMockup );

			if ( domModificationFn )
				domModificationFn();

			event.editableEvent( 'click', domEventMockup );
			event.editableEvent( 'mouseup', domEventMockup );
		}
	};

	return {
		// Keyboard event dispatching functions.
		key: keyboard,
		// Standard event functions.
		event: event,
		mouse: mouse
	};
};