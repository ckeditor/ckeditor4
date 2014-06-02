/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: dialog,filebrowser */

( function() {
	'use strict';

	CKEDITOR.on( 'instanceLoaded', function() {
		CKEDITOR.dialog.add( 'testDialog', function() {
			return {
				title: 'Test Dialog',
				contents: [
					{
						id: 'info',
						label: 'Info Tab',
						elements: [
							{
								type: 'button',
								id: 'browse',
								filebrowser: 'info:src',
								hidden: true,
								label: 'Browse Button'
							}
						]
					}
				]
			};
		} );
	} );

	// The trick to reproduce issue is to load plugin using tags, but remove it in editor
	// config, that way no filebrowser#init() will be called.
	bender.editor = {
		config: {
			filebrowserBrowseUrl: 'foo',
			removePlugins: 'filebrowser'
		}
	};

	bender.test( {
		'test browse button visibility if no filebrowser plugin is loaded': function() {
			CKEDITOR.on( 'dialogDefinition', function( evt ) {
				var def = evt.data.definition;

				def.onShow = function() {
					var dialog = this;

					resume( function() {
						try {
							assert.isTrue( dialog.getContentElement( 'info', 'browse' ).hidden, 'Browse button in the dialog should remain hidden.' );
						} catch ( e ) {
							throw e;
						} finally {
							dialog.hide();
						}
					} );
				}
			} );

			this.editor.openDialog( 'testDialog' );

			wait();
		}
	} );
} )();