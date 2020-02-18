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

	// Due the fact how incomparable Safari output selection is when selecting content between editables,
	// we are going with less strict selection comparison in this test file.
	// So, instead of verifying if selection is placed in expected position, we are checking if it gives expected results
	// when doing cross selection between content and widget. Note that this test file should only contain Safari
	// unit tests. See crosscontentselection.js file for Chrome and Firefox unit tests.
	bender.test( {
		setUp: function() {
			if ( bender.tools.env.mobile || !CKEDITOR.env.safari ) {
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

			editor.execCommand( 'customwidget' );

			widget = CKEDITOR.tools.object.values( editor.widgets.instances )[ 0 ];

			range.setStartAt( editor.editable().findOne( '#test' ), CKEDITOR.POSITION_AFTER_START );
			range.setEndAt( widget.wrapper, CKEDITOR.POSITION_AFTER_START );
			range.select();

			assert.isNull( editor.getSelectedHtml().findOne( '[data-cke-widget-wrapper]' ), 'Selected HTML should not contain widget' );
		},

		// (#3498)
		'test selection from widget to content': function() {
			var editor = this.editor,
				range = editor.createRange(),
				widget;

			bender.tools.setHtmlWithSelection( editor, '^<p id="test">Hello, World!</p>' );

			editor.execCommand( 'customwidget' );

			widget = CKEDITOR.tools.object.values( editor.widgets.instances )[ 0 ];

			// Place selection at the first editable from the buttom because Safari is unable to select between two editables inclusive.
			range.setStartAt( widget.wrapper.findOne( '.customwidget__content' ), CKEDITOR.POSITION_AFTER_START );
			range.setEndAt( editor.editable().findOne( '#test' ), CKEDITOR.POSITION_BEFORE_END );
			range.select();

			assert.isNull( editor.getSelectedHtml().findOne( '[data-cke-widget-wrapper]' ), 'Selected HTML should not contain widget' );
		},

		// (#3498)
		'test selection from content to content': function() {
			var editor = this.editor,
				range = editor.createRange(),
				editable = editor.editable();

			bender.tools.setHtmlWithSelection( editor, '<p id="test1">Hello, World!</p><p>^</p><p id="test2">Hello, World!</p>' );

			editor.execCommand( 'customwidget' );

			range.setStartAt( editable.findOne( '#test1' ), CKEDITOR.POSITION_AFTER_START );
			range.setEndAt( editable.findOne( '#test2' ), CKEDITOR.POSITION_BEFORE_END );
			range.select();

			assert.isNotNull( editor.getSelectedHtml().findOne( '[data-cke-widget-wrapper]' ), 'Selected HTML should contain widget' );
		},

		// (#3498)
		'test selection inside widget': function() {
			var editor = this.editor,
				range = editor.createRange(),
				widget;

			editor.execCommand( 'customwidget' );

			widget = CKEDITOR.tools.object.values( editor.widgets.instances )[ 0 ];

			range.setStartAt( widget.wrapper.findOne( '.customwidget__title' ), CKEDITOR.POSITION_AFTER_START );
			range.setEndAt( widget.wrapper.findOne( '.customwidget__content' ), CKEDITOR.POSITION_BEFORE_END );
			range.select();

			var frag = editor.getSelectedHtml();

			assert.isNotNull( frag.findOne( '.customwidget__title' ), 'Selected title widget part should be within selection' );
			assert.isNotNull( frag.findOne( '.customwidget__content' ), 'Selected content widget part should be within selection' );
		}
	} );

} )();
