/* bender-tags: editor */
/* bender-ckeditor-plugins: floatingspace,easyimage,toolbar */

( function() {
	'use strict';

	var buttonCreated = false,
		commonConfig = {
			easyimage_styles: {
				test: {
					icon: 'tests/_assets/sample_icon.png',
					iconHiDpi: 'tests/_assets/sample_icon.hidpi.png'
				}
			},
			easyimage_toolbar: [ 'EasyImageTest' ]
		};

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );

			var addButton = CKEDITOR.ui.prototype.addButton;
			this.addButtonStub = sinon.stub( CKEDITOR.ui.prototype, 'addButton', function( name, definition ) {
				if ( definition.command === 'easyimageTest' ) {
					buttonCreated = true;
					assert.areSame( 'tests/_assets/sample_icon.png', definition.icon, 'button definition.icon has proper value' );
					assert.areSame( 'tests/_assets/sample_icon.hidpi.png', definition.iconHiDpi, 'button definition.iconHiDpi has proper value' );
				}
				addButton.call( this, name, definition );
			} );
		},

		tearDown: function() {
			buttonCreated = false;
			if ( this.addButtonStub ) {
				this.addButtonStub.restore();
				this.addButtonStub = null;
			}
		},

		'test easyimage styles button icons are properly passed to button element (classic)': function() {
			bender.editorBot.create( {
				name: 'editor1',
				creator: 'replace',
				config: commonConfig
			}, function() {
				assert.isTrue( buttonCreated, 'button was created' );
			} );
		},

		'test easyimage styles button icons are properly passed to button element (divarea)': function() {
			bender.editorBot.create( {
				name: 'editor2',
				creator: 'replace',
				config: CKEDITOR.tools.object.merge( {
					extraPlugins: 'divarea'
				}, commonConfig )
			}, function() {
				assert.isTrue( buttonCreated, 'button was created' );
			} );
		},

		'test easyimage styles button icons are properly passed to button element (inline)': function() {
			bender.editorBot.create( {
				name: 'editor3',
				creator: 'inline',
				config: commonConfig
			}, function() {
				assert.isTrue( buttonCreated, 'button was created' );
			} );
		}
	} );
} )();
