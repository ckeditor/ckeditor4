/* bender-tags: skin, button, 13361 */
/* bender-ckeditor-plugins: button, toolbar */

( function() {
	'use strict';

	var globalPath = window.location.protocol + '//' + window.location.host + '%TEST_DIR%' + '_assets/',
		saveIcon = globalPath + '(.png',
		pasteIcon = globalPath + '\'.png',
		undoIcon = globalPath + ').png';

	bender.editor = {
		config: {
			toolbar: [ [ 'custom_save', 'custom_paste', 'custom_undo' ] ],
			on: {
				pluginsLoaded: function( evt ) {
					var ed = evt.editor;

					CKEDITOR.skin.addIcon( 'custom_save',  saveIcon );
					CKEDITOR.skin.addIcon( 'custom_paste',  pasteIcon );
					CKEDITOR.skin.addIcon( 'custom_undo', undoIcon );

					ed.ui.addButton( 'custom_save', {
						label: 'simple button with save icon'
					} );
					ed.ui.addButton( 'custom_paste', {
						label: 'simple button with paste icon'
					} );
					ed.ui.addButton( 'custom_undo', {
						label: 'simple button with undo icon'
					} );
				}
			}
		}
	};

	bender.test( {
		'test icon with opening parenthesis': function() {
			var saveBtn = this.editor.ui.get( 'custom_save' ),
				saveBtnEl = CKEDITOR.document.getById( saveBtn._.id ),
				saveBtnIcon = saveBtnEl.$.firstChild;

			// Strict comparision doesn't make sense as old IEs return URI in other format;
			// yet all browsers set elem.style.backgroundImage only if string is syntactically correct.
			assert.areNotSame( '', saveBtnIcon.style.backgroundImage,
				'check if custom_save button has correctly defined background-image' );
		},

		'test icon with closing parenthesis': function() {
			var undoBtn = this.editor.ui.get( 'custom_undo' ),
				undoBtnEl = CKEDITOR.document.getById( undoBtn._.id ),
				undoBtnIcon = undoBtnEl.$.firstChild;

			assert.areNotSame( '', undoBtnIcon.style.backgroundImage,
				'check if custom_undo button has correctly defined background-image' );
		},

		'test icon with apostrophe': function() {
			var pasteBtn = this.editor.ui.get( 'custom_paste' ),
				pasteBtnEl = CKEDITOR.document.getById( pasteBtn._.id ),
				pasteBtnIcon = pasteBtnEl.$.firstChild;

			assert.areNotSame( '', pasteBtnIcon.style.backgroundImage,
				'check if custom_paste button has correctly defined background-image' );
		}
	} );
} )();
