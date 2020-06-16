/* bender-tags: editor */
/* bender-ckeditor-plugins: entities */

bender.editor = {
	config: {
		extraAllowedContent: 'textarea; p[contenteditable]',
		removePlugins: 'htmlwriter',
		autoParagraph: false,
		basicEntities: false,
		entities_processNumerical: true,
		// Add euro symbol to verify if symbols are correctly escaped (#2448).
		entities_additional: 'euro,lt,gt,amp,apos,quot',
		entities_latin: false,
		entities_greek: false
	}
};

bender.test( {
	assertBackspace: function( name, key ) {
		var bot = this.editorBot;
		bender.tools.testInputOut( name, function( source, expected ) {
			bot.setHtmlWithSelection( source );
			bender.Y.Event.simulate( bot.editor.editable().$, 'keydown', { keyCode: key } );
			assert.areSame( bender.tools.compatHtml( expected ), bot.getData( true ) );
		} );
	},

	'test XML Entities': function() {
		var xmlEntities = '\'"&lt;&gt;&amp;';

		// XML predefined entities are encoded as character reference.
		assert.areEqual( '&apos;&quot;&lt;&gt;&amp;', this.editor.dataProcessor.toDataFormat( xmlEntities ) );
	},

	'test Other Special Characters': function() {
		var specials = ' ¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿×÷ƒ•…′″‾⁄℘ℑℜ™ℵ←↑→↓↔↵⇐⇑⇒⇓⇔∀∂∃∅∇∈∉∋∏∑−∗√∝∞∠∧∨' + // jshint ignore:line
			'∩∪∫∴∼≅≈≠≡≤≥⊂⊃⊄⊆⊇⊕⊗⊥⋅⌈⌉⌊⌋⟨⟩◊♠♣♥♦ˆ˜   ‌‍‎‏–—‘’‚“”„†‡‰‹›'; // jshint ignore:line
		// Other characters are encoded as numeric entities.
		assert.isFalse( /&\w+?;/.test( this.editor.dataProcessor.toDataFormat( specials ) ) );
	},

	'test quotes encoded in textarea': function() {
		var inputHtml = '<p><textarea>"\'</textarea>"\'</p>',
			expectedHtml = '<p><textarea>&quot;&apos;</textarea>&quot;&apos;</p>',
			editor = this.editor,
			bot = this.editorBot;

		bot.setData( inputHtml, function() {
			assert.areEqual( expectedHtml, editor.getData() );
		} );
	},

	'test HTML encoded in textarea': function() {
		var inputHtml = '<p><textarea> <b style="font-color: red"> aa </b> cc </textarea></p>',
			expectedHtml = '<p><textarea> &lt;b style=&quot;font-color: red&quot;&gt; aa &lt;/b&gt; cc </textarea></p>',
			editor = this.editor,
			bot = this.editorBot;

		bot.setData( inputHtml, function() {
			assert.areEqual( expectedHtml, editor.getData() );
		} );
	},

	'test HTML encoded in element with contenteditable=true': function() {
		var inputHtml = '<p contenteditable="true">"\'</p>',
			expectedHtml = '<p contenteditable="true">&quot;&apos;</p>',
			editor = this.editor,
			bot = this.editorBot;

		bot.setData( inputHtml, function() {
			assert.areEqual( expectedHtml, editor.getData() );
		} );
	},

	// (#2448)
	"test entities_additional doesn't break escaping": function() {
		var inputHtml = "<p>apos'</p>",
			expectedHtml = '<p>apos&apos;</p>',
			editor = this.editor,
			bot = this.editorBot;

		bot.setData( inputHtml, function() {
			assert.areEqual( expectedHtml, editor.getData() );
		} );
	}
} );
