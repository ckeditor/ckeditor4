/* bender-tags: htmldataprocessor,htmlwriter */
/* bender-ckeditor-plugins: htmlwriter */

'use strict';

var attrValue = '<p x="1&quot;2">\'"& &lt;a y="3"&gt;&amp;&lt;/a&gt;</p>',
	encodedAttrValue = '&lt;p x=&quot;1&amp;quot;2&quot;&gt;\'&quot;&amp; &amp;lt;a y=&quot;3&quot;&amp;gt;&amp;amp;&amp;lt;/a&amp;gt;&lt;/p&gt;';

bender.editors = {
	htmlWriter: {
		name: 'editor_htmlwriter',
		creator: 'inline',
		config: {
			allowedContent: true,
			extraPlugins: 'htmlwriter',
			enterMode: CKEDITOR.ENTER_P
		}
	},

	basicWriter: {
		name: 'editor_basicwriter',
		creator: 'inline',
		config: {
			allowedContent: true,
			removePlugins: 'htmlwriter',
			enterMode: CKEDITOR.ENTER_P
		}
	}
};

function doTestProcessorAttributeIsPreserved( bot ) {
	var editor = bot.editor,
		enabled = false;

	editor.editable().setHtml( '<p><span>foo</span></p>' );

	editor.dataProcessor.htmlFilter.addRules( {
		elements: {
			span: function( el ) {
				// Affect only this test.
				if ( enabled ) {
					el.attributes[ 'data-foo' ] = attrValue;
				}
			}
		}
	} );

	enabled = true;

	var data = editor.getData();
	assert.areSame( '<p><span data-foo="' + encodedAttrValue + '">foo</span></p>', data, 'attribute was properly encoded when getting data' );

	bot.setData( data, function() {
		enabled = false;
		var span = editor.editable().findOne( 'span' );

		assert.areSame( attrValue, span.data( 'foo' ), 'attribute was properly preserved when loading data' );
	} );
}

bender.test( {
	'test inline editor with htmlwriter preserves attribute set in htmlFilter': function() {
		doTestProcessorAttributeIsPreserved( bender.editorBots.htmlWriter );
	},

	'test inline editor with basicwriter preserves attribute set in htmlFilter': function() {
		doTestProcessorAttributeIsPreserved( bender.editorBots.basicWriter );
	},

	'test editor preserves attribute set in DOM': function() {
		var bot = bender.editorBots.basicWriter,
			editor = bot.editor;

		editor.editable().setHtml( '<p><span>x</span></p>' );
		editor.editable().findOne( 'span' ).setAttribute( 'data-bar', attrValue );

		bot.setData( editor.getData(), function() {
			var span = editor.editable().findOne( 'span' );

			assert.areSame( attrValue, span.data( 'bar' ) );
		} );
	},

	'test browser preserves attribute': function() {
		var el = CKEDITOR.document.createElement( 'span' );
		el.data( 'foo', attrValue );

		var el2 = CKEDITOR.document.createElement( 'span' );
		el2.setHtml( el.getOuterHtml() );
		assert.areSame( attrValue, el2.getFirst().data( 'foo' ) );
	}
} );