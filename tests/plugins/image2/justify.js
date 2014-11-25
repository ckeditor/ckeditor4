/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: image2,justify,toolbar */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'img figure[id]',
			autoParagraph: false
		}
	};

	var getWidgetById = widgetTestsTools.getWidgetById,
		inlineHtml = '<img src="_assets/foo.png" alt="foo" width="100" id="x" />',
		captionedHtml = '<figure class="image" id="x"><img src="_assets/bar.png" alt="foo" /><figcaption>bar</figcaption></figure>';

	function justifyTester( editor, cases ) {
		var j = 0;

		function runCase() {
			var	testCase = cases.shift();

			if ( !testCase )
				return;

			// Select the widget.
			var widget = getWidgetById( editor, 'x' );

			// Make sure widget is focused.
			widget.focus();

			// Justify focused widget.
			editor.execCommand( 'justify' + testCase.justify );

			// Select the widget again as it could've changed (a new instance).
			widget = getWidgetById( editor, 'x' );

			for ( var i in testCase.data )
				assert.areSame( testCase.data[ i ], widget.data[ i ],	'[' + j + '] ' + 'Widget.data.' + i + ' properly set.' );

			assert.areSame( testCase.inline, widget.inline,				'[' + j + '] ' + 'Widget must have a proper inline property.' );
			assert.areSame( widget, editor.widgets.focused,				'[' + j + '] ' + 'Widget remains focused.' );

			j++;

			// Run another test case.
			runCase( cases );
		}

		runCase( cases );
	}

	bender.test( {
		'test justify inline widget': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bot.setData( inlineHtml, function() {
				justifyTester( editor, [
					{
						justify: 'left',
						data: { align: 'left', hasCaption: false },
						inline:	true
					},
					{
						justify: 'right',
						data: { align: 'right', hasCaption: false },
						inline: true
					},
					{
						justify: 'block',
						data: { align: 'right', hasCaption: false },
						inline: true
					},
					{
						justify: 'center',
						data: { align: 'center', hasCaption: false },
						inline: false
					},
					{
						justify: 'left',
						data: { align: 'left', hasCaption: false },
						inline: true
					}
				] );
			} );
		},

		'test justify captioned widget': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bot.setData( captionedHtml, function() {
				justifyTester( editor, [
					{
						justify: 'left',
						data: { align: 'left', hasCaption: true },
						inline: false
					},
					{
						justify: 'right',
						data: { align: 'right', hasCaption: true },
						inline: false
					},
					{
						justify: 'block',
						data: { align: 'right', hasCaption: true },
						inline: false
					},
					{
						justify: 'center',
						data: { align: 'center', hasCaption: true },
						inline: false
					},
					{
						justify: 'left',
						data: { align: 'left', hasCaption: true },
						inline: false
					}
				] );
			} );
		}
	} );
} )();