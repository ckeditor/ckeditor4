/* bender-tags: editor */
/* bender-ckeditor-plugins: dialog */

( function() {
	'use strict';

	CKEDITOR.on( 'instanceLoaded', function() {
		CKEDITOR.dialog.add( 'testDialog2', '%TEST_DIR%_assets/testdialog.js' );
	} );

	bender.editor = {};

	bender.test( {
		_confirmMockup: null,
		// Native confirm object will be stored here.
		_originalConfirm: null,

		setUp: function() {
			var tc = this;

			this._confirmMockup = {
				calledTimes: 0,
				execute: function() {
					tc._confirmMockup.calledTimes++;
					return true;
				}
			};

			// Replacing browser native confirm with mockup.
			this._originalConfirm = window.confirm;
			window.confirm = this._confirmMockup.execute;
		},

		tearDown: function() {
			// Resotre original confirm funciton.
			window.confirm = this._originalConfirm;
		},

		// Performs standard operation which:
		// - opens dialog
		// - changes one field
		// - fires cancel event
		// - checks how manny times confirm function was called
		openAndCloseDialog: function( expectedConfirmsCount ) {
			this.editor.openDialog( 'testDialog2', function( dialog ) {
				dialog.once( 'show', function() {
					setTimeout( function() {
						resume( function() {
							var inputElement = dialog.getContentElement( 'info', 'foo' );

							inputElement.setValue( 'foo' + Math.random() );

							dialog.getButton( 'cancel' ).click();
							// Check how manny times confirm was called.
							assert.areSame( expectedConfirmsCount, this._confirmMockup.calledTimes, 'Invalid count of confirm() calls after dialog cancel.' );
						} );
					}, 50 );
				} );
			} );

			wait();
		},

		'test confirm appearance by default': function() {
			// Note that no config should be set in case of default settings.
			this.openAndCloseDialog( 1 );
		},

		'test confirm appearance with dialog_noConfirmCancel=true': function() {
			this.editor.config.dialog_noConfirmCancel = true;
			this.openAndCloseDialog( 0 );
		},

		'test confirm appearance with dialog_noConfirmCancel=false': function() {
			this.editor.config.dialog_noConfirmCancel = false;
			this.openAndCloseDialog( 1 );
		}
	} );
} )();
