var image2TestsTools = ( function() {
	'use strict';

	// Generates **all** possible widget state transitions and
	// transition assertions.
	//
	// @param {Object} tcs
	// @param {Object} states An object describing available states.
	function createStateTransitionTests( tcs, states, shiftState ) {
		for ( var s in states ) {
			// Cache state's HTML.
			states[ s ]._ = {
				html: fixHtml( CKEDITOR.document.getById( s ).getHtml() )
			};

			// Combine the first state with the rest of states.
			for ( var t in states ) {
				if ( s == t )
					continue;

				// Fill tcs with a new state-change test.
				tcs[ 'test shift state: [' + s + ' ⇒ ' + t + ']' ] = ( function( oldState, newState ) {
					return function() {
						assertStateChange( {
							bot: this.editorBot,
							oldState: oldState,
							newState: newState,
							shiftState: shiftState,
							msg: 'DOM must reflect the new state.'
						} );
					};
				} )( states[ s ], states[ t ] );
			}
		}
	}

	// Generates assertions for given context and state transition.
	// Assertions check whether DOM is correctly fixed once the transition
	// is performed.
	//
	// @param {Object} tcs
	// @param {Object} states An object describing available states.
	// @param {Object} context An object describing available contexts.
	function createContextualStateTransitionTests( tcs, states, contexts, shiftState ) {
		// Iterate over each setup: context, oldState and newState.
		for ( var i in contexts ) {
			// Fill tcs with a new context-driven state-change test.
			tcs[ i ] = ( function( testCase ) {
				return function() {
					var bot = this.editorBot,
						context = testCase.context,
						oldState = states[ testCase.oldState ],
						newState = states[ testCase.newState ];

					// Check whether the initial context (filled with initial state)
					// matches the final context (with the final state) once
					// the state of the widget has changed.
					bender.tools.testInputOut( context, function( contextBefore, contextAfter ) {
						assertStateChange( {
							bot: bot,
							oldState: oldState,
							newState: newState,
							htmlBefore: fillContext( contextBefore, oldState ),
							htmlAfter: fillContext( contextAfter, newState, true ),
							shiftState: shiftState,
							msg: 'DOM must be fixed after state change.'
						} );
					} );
				};
			} )( contexts[ i ] )
		}
	}

	function assertStateChange( config ) {
		var bot = config.bot,
			editor = bot.editor,
			editable = editor.editable();

		bot.setData( '', function() {
			editable.setHtml( config.htmlBefore || config.oldState._.html );

			// A state-change tool does it's job here.
			config.shiftState( {
				element: editor.document.getById( 'x' ),
				oldData: config.oldState,
				newData: config.newState,
				inflate: function() {},
				deflate: function() {}
			} );

			var expected = removeId( config.htmlAfter || config.newState._.html ),
				data = removeId( bot.getData() );

			assert.areSame( fixHtml( expected ), fixHtml( data ), config.msg )
		} );
	}

	function fixHtml( html ) {
		return bender.tools.compatHtml( bender.tools.fixHtml( html, true, true, true ), true, true, true );
	}

	function removeId( html ) {
		return html.replace( /id="x"/g, '' );
	}

	function fillContext( context, state, removeId ) {
		return new CKEDITOR.template( fixHtml( context ) ).output( { state: state._.html } );
	}

	return {
		createStateTransitionTests: createStateTransitionTests,
		createContextualStateTransitionTests: createContextualStateTransitionTests,
		fixHtml: fixHtml
	};
} )();