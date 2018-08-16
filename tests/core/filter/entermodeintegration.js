/* bender-tags: editor */

( function() {
	'use strict';

	var ENTER_BR = CKEDITOR.ENTER_BR,
		ENTER_P = CKEDITOR.ENTER_P,
		ENTER_DIV = CKEDITOR.ENTER_DIV;

	// Count enter mode changes on every editor.
	CKEDITOR.on( 'instanceCreated', function( evt ) {
		var editor = evt.editor;

		editor._activeEnterModeChanged = 0;

		editor.on( 'activeEnterModeChange', function() {
			editor._activeEnterModeChanged += 1;
		} );
	} );

	bender.test( {
		'test default configuration': function() {
			bender.editorBot.create( {
				name: 'test_default_config',
				config: {
					plugins: ''
				}
			}, function( bot ) {
				var editor = bot.editor;

				assert.areSame( 0, editor._activeEnterModeChanged, 'no enter mode changes before ready' );
				assert.areSame( ENTER_P, editor.activeEnterMode, 'initial activeEnterMode' );
				assert.areSame( ENTER_BR, editor.activeShiftEnterMode, 'initial activeShiftEnterMode' );
				assert.isTrue( editor.filter.check( 'p' ), 'check p' );
				assert.isTrue( editor.filter.check( 'br' ), 'check br' );
				assert.isFalse( editor.filter.check( 'div' ), 'check div' );
			} );
		},

		'test custom enter mode configuration': function() {
			bender.editorBot.create( {
				name: 'test_custom_activeEnter_config',
				config: {
					plugins: '',
					enterMode: ENTER_DIV,
					shiftEnterMode: ENTER_DIV
				}
			}, function( bot ) {
				var editor = bot.editor;

				assert.areSame( 0, editor._activeEnterModeChanged, 'no enter mode changes before ready' );
				assert.areSame( ENTER_DIV, editor.activeEnterMode, 'initial activeEnterMode' );
				assert.areSame( ENTER_DIV, editor.activeShiftEnterMode, 'initial activeShiftEnterMode' );
				assert.isFalse( editor.filter.check( 'p' ), 'check p' );
				assert.isFalse( editor.filter.check( 'br' ), 'check br' );
				assert.isTrue( editor.filter.check( 'div' ), 'check div' );
			} );
		},

		'test custom acf configuration - only divs allowed': function() {
			bender.editorBot.create( {
				name: 'test_custom_acf_config_div',
				config: {
					plugins: '',
					allowedContent: 'div'
				}
			}, function( bot ) {
				var editor = bot.editor;

				assert.areSame( 0, editor._activeEnterModeChanged, 'no enter mode changes before ready' );
				assert.areSame( ENTER_P, editor.activeEnterMode, 'initial activeEnterMode' );
				assert.areSame( ENTER_BR, editor.activeShiftEnterMode, 'initial activeShiftEnterMode' );
				assert.isTrue( editor.filter.check( 'p' ), 'check p' );
				assert.isTrue( editor.filter.check( 'br' ), 'check br' );
				assert.isTrue( editor.filter.check( 'div' ), 'check div' );
			} );
		},

		'test custom acf and enter mode configuration': function() {
			bender.editorBot.create( {
				name: 'test_custom_acf_activeEnter_config',
				config: {
					plugins: '',
					enterMode: ENTER_DIV,
					allowedContent: 'p'
				}
			}, function( bot ) {
				var editor = bot.editor;

				assert.areSame( 0, editor._activeEnterModeChanged, 'no enter mode changes before ready' );
				assert.areSame( ENTER_DIV, editor.activeEnterMode, 'initial activeEnterMode' );
				assert.areSame( ENTER_BR, editor.activeShiftEnterMode, 'initial activeShiftEnterMode' );
				assert.isTrue( editor.filter.check( 'p' ), 'check p' );
				assert.isTrue( editor.filter.check( 'br' ), 'check br' );
				assert.isTrue( editor.filter.check( 'div' ), 'check div' );
			} );
		},

		'test blockless editor always works in BR mode': function() {
			bender.editorBot.create( {
				name: 'test_blockless_activeEnter',
				creator: 'inline',
				config: {
					allowedContent: 'strong',
					plugins: ''
				}
			}, function( bot ) {
				var editor = bot.editor;

				assert.areSame( 0, editor._activeEnterModeChanged, 'no enter mode changes before ready' );
				assert.areSame( ENTER_BR, editor.activeEnterMode, 'initial activeEnterMode' );
				assert.areSame( ENTER_BR, editor.activeShiftEnterMode, 'initial activeShiftEnterMode' );
				assert.isFalse( editor.filter.check( 'p' ), 'check p' );
				assert.isTrue( editor.filter.check( 'br' ), 'check br' );
				assert.isFalse( editor.filter.check( 'div' ), 'check div' );
			} );
		},

		'test changing enter modes by active filter': function() {
			bender.editorBot.create( {
				name: 'test_active_filter_changes_activeEnter_mode',
				creator: 'inline',
				config: {
					plugins: ''
				}
			}, function( bot ) {
				var editor = bot.editor,
					filter1 = new CKEDITOR.filter( 'div br' ),
					filter2 = new CKEDITOR.filter( 'p' );

				assert.areSame( ENTER_P, editor.activeEnterMode, 'initial activeEnterMode' );
				assert.areSame( ENTER_BR, editor.activeShiftEnterMode, 'initial activeShiftEnterMode' );

				editor.setActiveFilter( filter1 );

				assert.areSame( 1, editor._activeEnterModeChanged, 'enter mode changed' );
				assert.areSame( ENTER_DIV, editor.activeEnterMode, 'filter1 enterMode' );
				assert.areSame( ENTER_BR, editor.activeShiftEnterMode, 'filter1 shiftEnterMode' );

				editor.setActiveFilter( filter2 );

				assert.areSame( 2, editor._activeEnterModeChanged, 'enter mode changed' );
				assert.areSame( ENTER_P, editor.activeEnterMode, 'filter2 enterMode' );
				assert.areSame( ENTER_P, editor.activeShiftEnterMode, 'filter2 shiftEnterMode' );

				editor.setActiveFilter( null );

				assert.areSame( 3, editor._activeEnterModeChanged, 'enter mode changed' );
				assert.areSame( ENTER_P, editor.activeEnterMode, 'back to initial activeEnterMode' );
				assert.areSame( ENTER_BR, editor.activeShiftEnterMode, 'back to initial activeShiftEnterMode' );
			} );
		},

		'test changing enter modes by active filter - custom config': function() {
			bender.editorBot.create( {
				name: 'test_active_filter_changes_activeEnter_mode_custom_config',
				creator: 'inline',
				config: {
					plugins: '',
					enterMode: ENTER_DIV,
					shiftEnterMode: ENTER_P
				}
			}, function( bot ) {
				var editor = bot.editor,
					filter1 = new CKEDITOR.filter( 'br' ),
					filter2 = new CKEDITOR.filter( 'p br' );

				assert.areSame( ENTER_DIV, editor.activeEnterMode, 'initial activeEnterMode' );
				assert.areSame( ENTER_P, editor.activeShiftEnterMode, 'initial activeShiftEnterMode' );

				editor.setActiveFilter( filter1 );

				assert.areSame( 1, editor._activeEnterModeChanged, 'enter mode changed' );
				assert.areSame( ENTER_BR, editor.activeEnterMode, 'filter1 enterMode' );
				assert.areSame( ENTER_BR, editor.activeShiftEnterMode, 'filter1 shiftEnterMode' );

				editor.setActiveFilter( filter2 );

				assert.areSame( 2, editor._activeEnterModeChanged, 'enter mode changed' );
				assert.areSame( ENTER_P, editor.activeEnterMode, 'filter2 enterMode' );
				assert.areSame( ENTER_P, editor.activeShiftEnterMode, 'filter2 shiftEnterMode' );

				editor.setActiveFilter( null );

				assert.areSame( 3, editor._activeEnterModeChanged, 'enter mode changed' );
				assert.areSame( ENTER_DIV, editor.activeEnterMode, 'back to initial activeEnterMode' );
				assert.areSame( ENTER_P, editor.activeShiftEnterMode, 'back to initial activeShiftEnterMode' );
			} );
		},

		'test changing enter modes by active filter in blockless editor': function() {
			bender.editorBot.create( {
				name: 'test_active_filter_changes_activeEnter_mode_blockless',
				creator: 'inline',
				config: {
					plugins: ''
				}
			}, function( bot ) {
				var editor = bot.editor,
					filter1 = new CKEDITOR.filter( 'div br' ),
					filter2 = new CKEDITOR.filter( 'p' );

				assert.areSame( ENTER_BR, editor.activeEnterMode, 'initial activeEnterMode' );
				assert.areSame( ENTER_BR, editor.activeShiftEnterMode, 'initial activeShiftEnterMode' );

				editor.setActiveFilter( filter1 );

				assert.areSame( 0, editor._activeEnterModeChanged, 'enter mode has not been changed' );
				assert.areSame( ENTER_BR, editor.activeEnterMode, 'filter1 enterMode' );
				assert.areSame( ENTER_BR, editor.activeShiftEnterMode, 'filter1 shiftEnterMode' );

				editor.setActiveFilter( filter2 );

				assert.areSame( 0, editor._activeEnterModeChanged, 'enter mode has not been changed' );
				assert.areSame( ENTER_BR, editor.activeEnterMode, 'filter2 enterMode' );
				assert.areSame( ENTER_BR, editor.activeShiftEnterMode, 'filter2 shiftEnterMode' );

				editor.setActiveFilter( null );

				assert.areSame( 0, editor._activeEnterModeChanged, 'enter mode has not been changed' );
				assert.areSame( ENTER_BR, editor.activeEnterMode, 'back to initial activeEnterMode' );
				assert.areSame( ENTER_BR, editor.activeShiftEnterMode, 'back to initial activeShiftEnterMode' );
			} );
		}
	} );
} )();
