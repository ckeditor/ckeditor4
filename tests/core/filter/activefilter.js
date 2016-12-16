/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: basicstyles,toolbar */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: 'strong em'
		}
	};

	bender.test( {
		'test editor.setActiveFilter': function() {
			var editor = this.editor,
				activeFilterChanged = 0,
				filter1 = new CKEDITOR.filter( 'b' );

			// IE, I hate you!
			editor.focus();

			assert.areSame( editor.filter, editor.activeFilter, 'default filter is active' );

			editor.on( 'activeFilterChange', function() {
				activeFilterChanged += 1;
			} );

			editor.setActiveFilter( filter1 );

			assert.areSame( filter1, editor.activeFilter, 'filter1 is active' );
			assert.areSame( 1, activeFilterChanged, 'activeFilterChange was fired once' );

			editor.setActiveFilter( filter1 );

			assert.areSame( filter1, editor.activeFilter, 'filter1 is still active' );
			assert.areSame( 1, activeFilterChanged, 'activeFilterChange was not fired' );

			editor.setActiveFilter( null );

			assert.areSame( editor.filter, editor.activeFilter, 'default filter is active again' );
			assert.areSame( 2, activeFilterChanged, 'activeFilterChange was fired once - 2' );

			editor.setActiveFilter( editor.filter );

			assert.areSame( editor.filter, editor.activeFilter, 'default filter is still active' );
			assert.areSame( 2, activeFilterChanged, 'activeFilterChange was not fired - 2' );
		},

		'test commands\' states are updated on filter change': function() {
			var editor = this.editor,
				cBold = editor.getCommand( 'bold' ),
				cItalic = editor.getCommand( 'italic' ),
				cUnderline = editor.getCommand( 'underline' ),
				filter = new CKEDITOR.filter( 'p em u' );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cBold.state, 'default filter - bold is enabled' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, cItalic.state, 'default filter - italic is enabled' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, cUnderline.state, 'default filter - underline is disabled' );

			editor.setActiveFilter( filter );

			assert.areSame( CKEDITOR.TRISTATE_DISABLED, cBold.state, 'custom filter - bold is disabled' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, cItalic.state, 'custom filter - italic is enabled' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, cUnderline.state, 'custom filter - underline is enabled' );

			cBold.enable();
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, cBold.state, 'bold cannot be enabled' );

			cBold.setState( CKEDITOR.TRISTATE_OFF );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, cBold.state, 'bold cannot be enabled by setState' );

			cItalic.disable();
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, cItalic.state, 'italic can be disabled' );

			cItalic.enable();
			assert.areSame( CKEDITOR.TRISTATE_OFF, cItalic.state, 'italic can be enabled' );

			cUnderline.disable();
			cItalic.disable();
			editor.setActiveFilter( null );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cBold.state, 'back to default filter - bold is enabled' );
			assert.areSame( CKEDITOR.TRISTATE_OFF, cItalic.state, 'back to default filter - italic is enabled' );
			assert.areSame( CKEDITOR.TRISTATE_DISABLED, cUnderline.state, 'back to default filter - underline is disabled' );
		},

		'test active filter change when selection is empty': function() {
			var editor = this.editor,
				refreshed = 0;

			editor.addCommand( 'testChangeWhenEmptySelection', {
				// Make the command contextual, so path is checked.
				context: 'p',
				refresh: function() {
					refreshed += 1;
				}
			} ).on( 'refresh', function() {
				// Check refresh at different stages of command#refresh - none should be executed
				// in second case.
				refreshed += 1;
			} );

			editor.setActiveFilter( new CKEDITOR.filter( 'p strong' ) );
			assert.areSame( 2, refreshed, 'command was refreshed' );


			// Replace editor#elementPath so it pretends there's no selection.
			var revert = bender.tools.replaceMethod( editor, 'elementPath', function() {
				return null;
			} );
			refreshed = 0;

			try {
				editor.setActiveFilter( null );
			} catch ( e ) {
				throw e;
			} finally {
				// Always undo the editor#elementPath replacement, even if test failed.
				revert();
				editor.setActiveFilter( null );
			}

			assert.areSame( 0, refreshed, 'command was not refreshed when selection was undefined' );
		}
	} );
} )();