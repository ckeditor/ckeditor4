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
	},

	// (#4941)
	'test entitles_processNumerical correct converts HTML entity to a numerical HTML entity': function() {
		if ( CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var inputHtml = '<p>👍😄😍💗</p>',
			expectedHtml = '<p>&#128077;&#128516;&#128525;&#128151;</p>',
			editor = this.editor,
			bot = this.editorBot;

		bot.setData( inputHtml, function() {
			assert.areEqual( expectedHtml, editor.getData() );
		} );
	},

	'test entitles_processNumerical="true" and entities_greek="false" converts greek letters to numeric HTML entities': function() {
		bender.editorBot.create( {
			name: 'entities_true2',
			config: {
				entities_processNumerical: true,
				entities_greek: false
			}
		}, function( bot ) {
			var inputHtml = '<p>αβγδεζηθικλμνξοπρστυφχψω</p>',
				expectedHtml =  '<p>&#945;&#946;&#947;&#948;&#949;&#950;&#951;&#952;&#953;&#954;&#955;&#956;&#957;&#958;&#959;&#960;&#961;&#963;&#964;&#965;&#966;&#967;&#968;&#969;</p>',
				editor = bot.editor;

			bot.setData( inputHtml, function() {
				assert.areEqual( expectedHtml, editor.getData() );
			} );
		} );
	},

	'test entitles_processNumerical="true" and entities_latin="false" converts some of latin letters entities to numeric HTML entities': function() {
		bender.editorBot.create( {
			name: 'entities_true3',
			config: {
				entities_processNumerical: true,
				entities_latin: false
			}
		}, function( bot ) {
			var inputHtml = '<p>&Agrave;&Aacute;&Icirc;&Iuml;&ETH;',
				expectedHtml =  '<p>&#192;&#193;&#206;&#207;&#208;</p>',
				editor = bot.editor;

			bot.setData( inputHtml, function() {
				assert.areEqual( expectedHtml, editor.getData() );
			} );
		} );
	},

	'test entitles_processNumerical="force" converts entities to numerical HTML entity': function() {
		bender.editorBot.create( {
			name: 'entities_force',
			config: {
				entities_processNumerical: 'force'
			}
		}, function( bot ) {
			var inputHtml = '<p>&nbsp; &gt; &lt; &amp; &quot;</p>',
				expectedHtml = '<p>&#160; &#62; &#60; &#38; &#34;</p>',
				editor = bot.editor;

			bot.setData( inputHtml, function() {
				assert.areEqual( expectedHtml, editor.getData() );
			} );
		} );
	},

	'test entitles_processNumerical="force" converts greek letters to numeric HTML entities': function() {
		bender.editorBot.create( {
			name: 'entities_force2',
			config: {
				entities_processNumerical: 'force',
				entities_greek: true
			}
		}, function( bot ) {
			var inputHtml = '<p>αβγδεζηθικλμνξοπρστυφχψω</p>',
				expectedHtml =  '<p>&#945;&#946;&#947;&#948;&#949;&#950;&#951;&#952;&#953;&#954;&#955;&#956;&#957;&#958;&#959;&#960;&#961;&#963;&#964;&#965;&#966;&#967;&#968;&#969;</p>',
				editor = bot.editor;

			bot.setData( inputHtml, function() {
				assert.areEqual( expectedHtml, editor.getData() );
			} );
		} );
	},

	'test entitles_processNumerical="force" converts latin entities to numerical HTML entity': function() {
		bender.editorBot.create( {
			name: 'entities_force3',
			config: {
				entities_processNumerical: 'force',
				entities_latin: true
			}
		}, function( bot ) {
			var inputHtml = '<p>&Agrave;&Aacute;&Icirc;&Iuml;&ETH;</p>',
				expectedHtml =  '<p>&#192;&#193;&#206;&#207;&#208;</p>',
				editor = bot.editor;

			bot.setData( inputHtml, function() {
				assert.areEqual( expectedHtml, editor.getData() );
			} );
		} );
	},

	'test entitles_processNumerical="force" with filters off converts entities to numerical HTML entity': function() {
		bender.editorBot.create( {
			name: 'entities_force4',
			config: {
				entities_processNumerical: 'force',
				allowedContent: true
			}
		}, function( bot ) {
			var inputHtml = '<p>&quot;&lt;&gt;&amp;</p>',
				expectedHtml =  '<p>&#34;&#60;&#62;&#38;</p>',
				editor = bot.editor;

			bot.setData( inputHtml, function() {
				assert.areEqual( expectedHtml, editor.getData() );
			} );
		} );
	},

	'test entitles_processNumerical="force" with removed filters should leave entities untouched': function() {
		bender.editorBot.create( {
			name: 'entities_force5',
			config: {
				entities_processNumerical: 'force',
				allowedContent: true,
				on: {
					instanceReady: function() {
						this.dataProcessor.htmlFilter = {};
					}
				}
			}
		}, function( bot ) {
			var inputHtml = '<p>&lt;&gt;&amp;</p>',
				expectedHtml = '<p>&lt;&gt;&amp;</p>',
				editor = bot.editor;

			bot.setData( inputHtml, function() {
				assert.areEqual( expectedHtml, editor.getData() );
			} );
		} );
	},

	'test entities="false" and entities_processNumerical="force" converts entities to numerical HTML entity': function() {
		bender.editorBot.create( {
			name: 'entities_1',
			config: {
				entities_processNumerical: 'force',
				entities: false
			}
		}, function( bot ) {
			var inputHtml = '<p>&lt;&gt;&amp;</p>',
				expectedHtml = '<p>&#60;&#62;&#38;</p>',
				editor = bot.editor;

			bot.setData( inputHtml, function() {
				assert.areEqual( expectedHtml, editor.getData() );
			} );
		} );
	},

	'test entities="false" leaves entities untouched': function() {
		bender.editorBot.create( {
			name: 'entities_2',
			config: {
				entities: false
			}
		}, function( bot ) {
			var inputHtml = '<p>&lt;&gt;&amp;</p>',
				expectedHtml = '<p>&lt;&gt;&amp;</p>',
				editor = bot.editor;

			bot.setData( inputHtml, function() {
				assert.areEqual( expectedHtml, editor.getData() );
			} );
		} );
	},

	'test entities="true" and entities_processNumerical="false" leaves entities untouched': function() {
		bender.editorBot.create( {
			name: 'entities_3',
			config: {
				entities_processNumerical: false,
				entities: true
			}
		}, function( bot ) {
			var inputHtml = '<p>&lt;&gt;&amp;</p>',
				expectedHtml = '<p>&lt;&gt;&amp;</p>',
				editor = bot.editor;

			bot.setData( inputHtml, function() {
				assert.areEqual( expectedHtml, editor.getData() );
			} );
		} );
	}
} );
