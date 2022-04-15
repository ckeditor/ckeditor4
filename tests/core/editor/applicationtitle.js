/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea,floatingspace,toolbar */

( function() {
	'use strict';

	CKEDITOR.disableAutoInline = true;

	bender.editors = {
		editor1: {
			name: 'editor1',
			config: { applicationTitle: 'foo' }
		},
		editor2: {
			name: 'editor2',
			config: { applicationTitle: 'bar' }
		},
		editor3: {
			name: 'editor3',
			creator: 'inline',
			config: { applicationTitle: 'boom' }
		},
		editor4: {
			name: 'editor4',
			creator: 'inline',
			config: { applicationTitle: 'bang' }
		},

		// applicationTitle attribute "inherited".
		inherited1: {
			name: 'inherited1',
			config: {}
		},
		inherited2: {
			name: 'inherited2',
			creator: 'inline',
			config: {}
		},

		// applicationTitle attribute disabled on purpose.
		disabled1: {
			name: 'disabled1',
			config: { applicationTitle: false }
		},
		disabled2: {
			name: 'disabled2',
			creator: 'inline',
			config: { applicationTitle: false }
		},

		// Empty string
		disabled3: {
			name: 'disabled3',
			config: { applicationTitle: '' }
		},

		// Invalid applicationTitles, inline.
		invalid1: {
			name: 'invalid1',
			creator: 'inline',
			config: { applicationTitle: true }
		},
		invalid2: {
			name: 'invalid2',
			creator: 'inline',
			config: { applicationTitle: null }
		},
		invalid3: {
			name: 'invalid3',
			creator: 'inline',
			config: { applicationTitle: 42 }
		},

		// Invalid applicationTitles, framed.
		invalid4: {
			name: 'invalid4',
			config: { applicationTitle: true }
		},
		invalid5: {
			name: 'invalid5',
			config: { applicationTitle: null }
		},
		invalid6: {
			name: 'invalid6',
			config: { applicationTitle: 42 }
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

		'test config.applicationTitle implies editor.applicationTitle': function() {
			assertApplicationTitle( 'foo', 'editor1' );
			assertApplicationTitle( 'bar', 'editor2' );
			assertApplicationTitle( 'boom',	'editor3' );
			assertApplicationTitle( 'bang',	'editor4' );

			assertApplicationTitle( false, 'disabled1' );
			assertApplicationTitle( false, 'disabled2' );
			assertApplicationTitle( '', 'disabled3' );
		},

		'test editor.name implies editor.applicationTitle': function() {
			// config.title not set, using editor.name
			assertApplicationTitleInherited( 'inherited1' );
			assertApplicationTitleInherited( 'inherited2' );

			// Invalid config.title, also "inherit" editor.name
			assertApplicationTitleInherited( 'invalid4' );
			assertApplicationTitleInherited( 'invalid5' );
			assertApplicationTitleInherited( 'invalid6' );
			assertApplicationTitleInherited( 'invalid1' );
			assertApplicationTitleInherited( 'invalid2' );
			assertApplicationTitleInherited( 'invalid3' );
		},

		'test voice label have properly set application title': function() {
			for ( var i in this.editors ) {
				assertVoiceLabelIsBasedOnApplicationTitle( this.editors[ i ] );
			}
		}
	} );

	function assertApplicationTitle( expected, editor, msg ) {
		assert.areSame(
			expected,
			bender.editors[ editor ].applicationTitle,
			msg || 'editor.applicationTitle of ' + bender.editors[ editor ].name + ' based on editor.config' );
	}

	function assertApplicationTitleInherited( editor ) {
		assert.isTrue( !!~bender.editors[ editor ].applicationTitle.indexOf( bender.editors[ editor ].name ),
			'editor.applicationTitle of ' + editor.name + ' based on editor.name' );
	}

	function assertVoiceLabelIsBasedOnApplicationTitle( editor ) {
		var element = getVoiceLabel( editor );

		if ( !editor.applicationTitle ) {
			assert.isNull( element, 'editor: ' + editor.name );
		} else {
			assert.isNotNull( element, 'editor: ' + editor.name + ' - element' );
			assert.areSame( editor.applicationTitle, element.getText(), 'editor: ' + editor.name + ' - value' );
		}
	}

	function getVoiceLabel( editor ) {
		return CKEDITOR.document.getById( 'cke_' + editor.name + '_arialbl' );
	}
} )();
