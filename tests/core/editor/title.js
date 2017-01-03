/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,floatingspace,toolbar */

( function() {
	'use strict';

	CKEDITOR.disableAutoInline = true;

	function getTitleElement( editor ) {
		var	editable = editor.editable();

		return editable.isInline() ? editable : editor.window.getFrame();
	}

	function getVoiceLabel( editor ) {
		return CKEDITOR.document.getById( 'cke_' + editor.name + '_arialbl' );
	}

	function assertTitle( expected, editor, msg ) {
		assert.areSame(
			expected,
			bender.editors[ editor ].title, msg || 'editor.title of ' + bender.editors[ editor ].name + ' based on editor.config' );
	}

	function assertTitleInherited( editor ) {
		assert.isTrue( !!~bender.editors[ editor ].title.indexOf( bender.editors[ editor ].name ), 'editor.title of ' + editor.name + ' based on editor.name' );
	}

	function assertTitleSetOnEditable( editor ) {
		var	element = getTitleElement( editor );

		// There should be no title attribute or original title is preserved
		// when editor.title === false or '' (empty string).
		if ( editor.title === false || editor.title === '' ) {
			if ( element.data( 'startup-title' ) )
				assert.areSame( element.data( 'startup-title' ), element.getAttribute( 'title' ), 'Startup title of ' + editor.name + ' preserved' );
			else
				assert.isFalse( element.hasAttribute( 'title' ), 'Title attribute set on editable of ' + editor.name );
		} else {
			assert.isTrue( !!~element.getAttribute( 'title' ).indexOf( editor.title ), 'editor.title used as an attribute of editable of ' + editor.name );
		}
	}

	function assertVoiceLabelIsBasedOnTitle( editor ) {
		var element = getVoiceLabel( editor );

		if ( !editor.title ) {
			assert.isNull( element, 'editor: ' + editor.name );
		} else {
			assert.isNotNull( element, 'editor: ' + editor.name + ' - element' );
			assert.areSame( editor.title, element.getText(), 'editor: ' + editor.name + ' - value' );
		}
	}

	bender.editors = {
		editor1: {
			name: 'editor1',
			config: { title: 'foo' }
		},
		editor2: {
			name: 'editor2',
			config: { title: 'bar' }
		},
		editor3: {
			name: 'editor3',
			creator: 'inline',
			config: { title: 'boom' }
		},
		editor4: {
			name: 'editor4',
			creator: 'inline',
			config: { title: 'bang' }
		},

		// Title attribute "inherited".
		inherited1: {
			name: 'inherited1',
			config: {}
		},
		inherited2: {
			name: 'inherited2',
			creator: 'inline',
			config: {}
		},

		// Title attribute disabled on purpose.
		disabled1: {
			name: 'disabled1',
			config: { title: false }
		},
		disabled2: {
			name: 'disabled2',
			creator: 'inline',
			config: { title: false }
		},

		// Empty string
		disabled3: {
			name: 'disabled3',
			config: { title: '' }
		},

		// Invalid titles, inline.
		invalid1: {
			name: 'invalid1',
			creator: 'inline',
			config: { title: true }
		},
		invalid2: {
			name: 'invalid2',
			creator: 'inline',
			config: { title: null }
		},
		invalid3: {
			name: 'invalid3',
			creator: 'inline',
			config: { title: 42 }
		},

		// Invalid titles, framed.
		invalid4: {
			name: 'invalid4',
			config: { title: true }
		},
		invalid5: {
			name: 'invalid5',
			config: { title: null }
		},
		invalid6: {
			name: 'invalid6',
			config: { title: 42 }
		},

		// Created from existing DOM elements.
		existing1: {
			name: 'existing1',
			creator: 'inline',
			config: { title: 'bar' }
		},
		existing2: {
			name: 'existing2',
			creator: 'inline',
			config: { title: 'boom' }
		},
		existing3: {
			name: 'existing3',
			creator: 'inline',
			config: { title: false }
		},
		existing4: {
			name: 'existing4',
			creator: 'inline'
		}
	};

	for ( var name in bender.editors ) {
		// Save startup title for further comparison.
		var element = CKEDITOR.document.getById( name );

		if ( element )
			element.data( 'startup-title', element.getAttribute( 'title' ) || '' );
	}

	bender.test( {
		'init': function() {
			var initialDelay = CKEDITOR.focusManager._.blurDelay;

			// Due to asynchronous nature of editor's blurring,
			// blur handler is called after switching focus to the next editor.
			// In case of inline editors in Chrome it causes to clear the selection
			// and breaks the editor.
			CKEDITOR.focusManager._.blurDelay = 0;

			for ( var name in bender.editors ) {
				bender.editors[ name ].insertText( name );
			}

			CKEDITOR.focusManager._.blurDelay = initialDelay;
		},

		'test config.title implies editor.title': function() {
			assertTitle( 'foo',		'editor1' );
			assertTitle( 'bar',		'editor2' );
			assertTitle( 'boom',	'editor3' );
			assertTitle( 'bang',	'editor4' );

			assertTitle( false,		'disabled1' );
			assertTitle( false,		'disabled2' );
			assertTitle( '',		'disabled3' );

			assertTitle( 'bar',		'existing1' );
			assertTitle( 'boom',	'existing2' );
			assertTitle( false,		'existing3',	'The original title of the element remains untouched.' );
		},

		'test editor.name implies editor.title': function() {
			// config.title not set, using editor.name
			assertTitleInherited( 'inherited1' );
			assertTitleInherited( 'inherited2' );

			// Invalid config.title, also "inherit" editor.name
			assertTitleInherited( 'invalid4' );
			assertTitleInherited( 'invalid5' );
			assertTitleInherited( 'invalid6' );
			assertTitleInherited( 'invalid1' );
			assertTitleInherited( 'invalid2' );
			assertTitleInherited( 'invalid3' );
		},

		'test editor.title transferred to editable element': function() {
			for ( var i in this.editors )
				assertTitleSetOnEditable( this.editors[ i ] );
		},

		'test voice label have properly set title': function() {
			for ( var i in this.editors ) {
				assertVoiceLabelIsBasedOnTitle( this.editors[ i ] );
			}
		},

		'test restore title after instance is destroyed': function() {
			var tcs = {
					existing1: 'foo',
					existing2: null,
					existing3: 'moo',
					existing4: 'boo'
				},
				names = CKEDITOR.tools.objectKeys( tcs );

			function next() {
				var name = names.shift();

				if ( !name ) {
					resume();
					return;
				}

				var element = getTitleElement( bender.editors[ name ] );

				bender.editors[ name ].once( 'destroy', function() {
					resume( function() {
						assert.areSame( tcs[ name ], element.getAttribute( 'title' ), 'Original title correctly restored once instance ' + name + ' destroyed.' );

						next();
						wait();
					} );
				} );

				bender.editors[ name ].destroy();
			}

			next();
			wait();
		}
	} );
} )();
