/* bender-ckeditor-plugins: widget */

(function() {
	'use strict';

	bender.test( {
		'async:init': function() {
			var tc = this;

			bender.tools.setUpEditors( {
				editor: {
					name: 'editor1',
					startupData: '<b id="one" data-widget="testwidget">foo</b><b id="two" data-widget="testwidget">foo</b>',
					config: {
						allowedContent: true,
						on: {
							pluginsLoaded: function( evt ) {
								var ed = evt.editor;

								ed.widgets.add( 'testwidget', {} );
							}
						}
					}
				}
			}, function( editors, bots ) {
				tc.editor = bots.editor.editor;

				tc.callback();
			} );
		},

		'test check dirty is false after widget focus': function() {
			var widget = this.editor.widgets.instances[ 1 ];

			assert.isFalse( this.editor.checkDirty() );
			widget.focus();
			assert.isFalse( this.editor.checkDirty() );
		},

		'test check dirty is true after modifications': function() {
			var widget = this.editor.widgets.instances[ 1 ];

			assert.isFalse( this.editor.checkDirty() );

			// Clear selection
			var range = this.editor.createRange();
			var lastElement = this.editor.document.getById( 'two' );
			range.moveToPosition( lastElement, CKEDITOR.POSITION_BEFORE_END );
			this.editor.getSelection().selectRanges( [ range ] );

			assert.isFalse( this.editor.checkDirty() );

			// Make some changes in editor
			widget.addClass( 'test' );

			assert.isTrue( this.editor.checkDirty() );
			widget.focus();
			assert.isTrue( this.editor.checkDirty() );
		}
	} );

})();