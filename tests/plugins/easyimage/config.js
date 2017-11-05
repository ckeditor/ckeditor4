/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar */

( function() {
	'use strict';

	bender.editors = {
		classCustomized: {
			config: {
				easyimage_class: 'customClass',
				easyimage_sideClass: 'customSideClass'
			}
		}
	};

	/*
	 * Checks the count of `widget` widgets created after setting editor value to `data`.
	 *
	 * @param {Object} bot Editor bot instance.
	 * @param {String} data Data to be set in the editor instance.
	 * @param {String} widget Name of widget to be counted.
	 * @param {Function} [callback] Callback to be called after widget count is asserted. Gets editor and bot as a parameter.
	 */
	function assertUpcast( bot, data, widget, callback ) {
		var editor = bot.editor;

		bot.setData( data, function() {
			var widgets = editor.editable().find( '[data-widget="' + widget + '"]' );

			assert.areSame( 1, widgets.count(), 'Widget is properly upcasted' );

			if ( callback ) {
				callback( editor, bot );
			}
		} );
	}

	var tests = {
			tearDown: function() {
				var currentDialog = CKEDITOR.dialog.getCurrent();

				if ( currentDialog ) {
					currentDialog.hide();
				}
			},

			'test easyimage_class - changed': function() {
				assertUpcast( this.editorBots.classCustomized, CKEDITOR.document.getById( 'changedClass' ).getHtml(), 'easyimage' );
			},

			'test easyimage_sideClass - changed': function() {
				assertUpcast( this.editorBots.classCustomized, CKEDITOR.document.getById( 'changedClass' ).getHtml(), 'easyimage', function( editor ) {
					var widgetInstance =  editor.widgets.instances[ 1 ];

					widgetInstance.focus();

					editor.execCommand( 'easyimageSide' );

					assert.beautified.html( CKEDITOR.document.getById( 'expectedCustomSideClass' ).getHtml(), editor.getData() );
				} );
			}
		};

	bender.test( tests );
} )();
