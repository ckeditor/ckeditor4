/* bender-tags: htmldataprocessor,htmlwriter */
/* bender-ckeditor-plugins: htmlwriter */

var attrValue = '<p x="1&quot;2">\'"& &lt;a y="3"&gt;&amp;&lt;/a&gt;</p>';

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
	var editor = bot.editor;

	editor.editable().setHtml( '<p><span>foo</span></p>' );

	editor.dataProcessor.htmlFilter.addRules( {
		elements: {
			span: function( el ) {
				el.attributes[ 'data-foo' ] = attrValue;
			}
		}
	} );

	bot.setData( editor.getData(), function() {
		var span = editor.editable().findOne( 'span' );

		assert.areSame( attrValue, span.data( 'foo' ) );
	} );
}

bender.test( {
	'test inline editor with htmlwriter preserves attribute': function() {
		doTestProcessorAttributeIsPreserved( bender.editorBots.htmlWriter );
	},

	'test inline editor with basicwriter preserves attribute': function() {
		doTestProcessorAttributeIsPreserved( bender.editorBots.basicWriter );
	},

	'test browser preserves attribute': function() {
		var el = CKEDITOR.document.createElement( 'span' );
		el.data( 'foo', attrValue );

		var el2 = CKEDITOR.document.createElement( 'span' );
		el2.setHtml( el.getOuterHtml() );
		assert.areSame( attrValue, el2.getFirst().data( 'foo' ) );
		assert.areSame(
			'<span data-foo="<p x=&quot;1&amp;quot;2&quot;>\'&quot;&amp; &amp;lt;a y=&quot;3&quot;&amp;gt;&amp;amp;&amp;lt;/a&amp;gt;</p>"></span>',
			el.getOuterHtml().toLowerCase() );
	}
} );