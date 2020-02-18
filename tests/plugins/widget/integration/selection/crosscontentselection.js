/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,undo */
/* bender-ckeditor-remove-plugins: tableselection */

( function() {
	'use strict';

	CKEDITOR.plugins.addExternal( 'customwidget', '%BASE_PATH%plugins/widget/integration/selection/_helpers/customwidget.js' );

	bender.editor = {
		config: {
			extraPlugins: 'customwidget'
		}
	};

	bender.test( {
		setUp: function() {
			if ( CKEDITOR.env.ie || CKEDITOR.env.safari ) {
				assert.ignore();
			}

			this.editor.widgets.destroyAll( true );
		},

		// (#3498)
		'test selection from content to widget': function() {
			var editor = this.editor,
				range = editor.createRange(),
				widget;

			bender.tools.setHtmlWithSelection( editor, '<p id="test">Hello, World!</p>^' );

			var contentNode = editor.editable().findOne( '#test' );

			editor.execCommand( 'customwidget' );

			widget = CKEDITOR.tools.object.values( editor.widgets.instances )[ 0 ];

			range.setStartAt( contentNode, CKEDITOR.POSITION_AFTER_START );
			range.setEndAt( widget.wrapper, CKEDITOR.POSITION_AFTER_START );
			range.select();

			var expectedRange = editor.createRange();

			expectedRange.setStartAt( contentNode, CKEDITOR.POSITION_AFTER_START );
			expectedRange.setEndAt( widget.wrapper, CKEDITOR.POSITION_BEFORE_START );

			assert.isTrue( expectedRange.equals( editor.getSelectedRanges()[ 0 ] ) );
		},

		// (#3498)
		'test selection from widget to content': function() {
			var editor = this.editor,
				range = editor.createRange(),
				widget;

			bender.tools.setHtmlWithSelection( editor, '^<p id="test">Hello, World!</p>' );

			var contentNode = editor.editable().findOne( '#test' );

			editor.execCommand( 'customwidget' );

			widget = CKEDITOR.tools.object.values( editor.widgets.instances )[ 0 ];

			range.setStartAt( widget.wrapper, CKEDITOR.POSITION_AFTER_START );
			range.setEndAt( contentNode, CKEDITOR.POSITION_BEFORE_END );
			range.select();

			var expectedRange = editor.createRange();

			expectedRange.setStartAt( widget.wrapper, CKEDITOR.POSITION_AFTER_END );
			expectedRange.setEndAt( contentNode, CKEDITOR.POSITION_BEFORE_END );

			assert.isTrue( expectedRange.equals( editor.getSelectedRanges()[ 0 ] ) );
		},

		// (#3498)
		'test selection from content to content': function() {
			var editor = this.editor,
				range = editor.createRange(),
				editable = editor.editable();

			bender.tools.setHtmlWithSelection( editor, '<p id="test1">Hello, World!</p><p>^</p><p id="test2">Hello, World!</p>' );

			var startContentNode = editable.findOne( '#test1' ),
				endContentNode = editable.findOne( '#test2' );

			editor.execCommand( 'customwidget' );

			range.setStartAt( startContentNode, CKEDITOR.POSITION_AFTER_START );
			range.setEndAt( endContentNode, CKEDITOR.POSITION_BEFORE_END );
			range.select();

			assert.isTrue( range.equals( editor.getSelectedRanges()[ 0 ] ) );
		},

		// (#3498)
		'test selection inside widget': function() {
			var editor = this.editor,
				range = editor.createRange();

			editor.execCommand( 'customwidget' );

			var widget = CKEDITOR.tools.object.values( editor.widgets.instances )[ 0 ],
				widgetTitle = widget.wrapper.findOne( '.customwidget__title' ),
				widgetContent = widget.wrapper.findOne( '.customwidget__content' );

			range.setStartAt( widgetTitle, CKEDITOR.POSITION_AFTER_START );
			range.setEndAt( widgetContent, CKEDITOR.POSITION_BEFORE_END );
			range.select();

			assert.isTrue( range.equals( editor.getSelectedRanges()[ 0 ] ) );
		}
	} );

} )();
