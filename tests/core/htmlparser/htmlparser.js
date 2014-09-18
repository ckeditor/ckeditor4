/* bender-tags: editor,unit */

( function() {
	'use strict';

	// Wrapper of the combination of htmlParser with htmlWriter, for convenience of
	// testing, formatting of writer has been disabled.
	function htmlParse( htmlString ) {
		var writer = new CKEDITOR.htmlParser.basicWriter(),
			fragment = CKEDITOR.htmlParser.fragment.fromHtml( htmlString );
		fragment.writeHtml( writer );
		return writer.getHtml();
	}

	bender.test( {
		test_parse_inline: function() {
			assert.areSame( '<span class="outer">text</span>',
					htmlParse( '<span class="outer"><span></span>text</span>' ) );
		},

		test_parse_inline_2: function() {
			assert.areSame( '<span class="outer">text</span>',
					htmlParse( '<span class="outer"><span><span></span></span>text</span>' ) );
		},

		test_parse_inline_3: function() {
			assert.areSame( '<span class="outer"><b>text</b></span>',
					htmlParse( '<span class="outer"><span><b></span>text</b></span>' ) );
		},

		test_parse_inline_4: function() {
			assert.areSame( '<span class="outer"><span><b>some</b></span>text</span>',
					htmlParse( '<span class="outer"><span><b>some</span></b>text</span>' ) );
		},

		test_parse_inline_5: function() {
			assert.areSame( '<strong>some</strong>text',
					htmlParse( '<strong>some</span></strong>text' ) );
		},

		test_survive_1: function() {
			assert.areSame( '<span class="outer"><span data-cke-survive="true"></span></span>',
					htmlParse( '<span class="outer"><span data-cke-survive="true"></span><span></span></span>' ) );
		},

		test_survive_2: function() {
			assert.areSame( '<span class="outer"><span class="cls" data-cke-survive="true"></span>text</span>',
					htmlParse( '<span class="outer"><span class="cls" data-cke-survive="true"><span></span></span>text<span><span class="cls"></span></span></span>' ) );
		},

		test_survive_3: function() {
			assert.areSame( '<span class="outer"><span data-cke-survive="true">text</span>text</span>',
					htmlParse( '<span class="outer"><span data-cke-survive="true">text</span>text</span>' ) );
		},

		// Attribute name may contains hypen and dot.(#4351)
		// Ref: http://www.w3.org/TR/xml/#NT-Name
		test_fromHtml_attribute_name: function() {
			var html = '<p attr-name="value" attr_name="value" attr.name="value" attr:name="value">text</p>';
			assert.areSame( html,
				htmlParse( html ),
				'Attributes doesn\'t match.' );
		},

		// Test white-spaces inside inline elements are well preserved, while
		// white-spaces before block-level elements are trimmed. (#4656)
		test_trim_whitespaces: function() {
			assert.areSame( '<div>some <strong>bold</strong> text<p>paragraph</p></div>',
				htmlParse( '<div>some <strong>bold</strong> text <p>\nparagraph</p></div>' ),
				'White-spaces don\'t match.' );
		},

		// Attributes may have the < or > character. (#7513)
		test_lt_gt_on_attributes: function() {
			assert.areSame( '<p title="a &lt; b &gt; c" class="test">Sample</p>',
				htmlParse( '<p title="a < b > c" class="test">Sample</p>' ) );
		},

		test_onTagOpen: function() {
			var counter = 0,
				parser = new CKEDITOR.htmlParser();

			parser.onTagOpen = function( tagName, attributes, selfClosing ) {
				counter += 1;

				assert.areSame( 'p', tagName, 'Tag name doesn\'t match' );
				assert.areSame( 'a\nb\r\nc', attributes[ 'class' ], 'Attribute class doesn\'t match' );
				assert.areSame( 'b', attributes.title, 'Attribute title doesn\'t match' );
				assert.areSame( 'c', attributes.name, 'Attribute name doesn\'t match' );
				assert.areSame( false, selfClosing );
			};

			// Chrome, Opera and Fx return attributes only in "" quotes.
			// But this case is properly parsed now so, as there maybe are
			// some other browsers that return attributes in different manner,
			// it can be usefull to test this for regressions.
			parser.parse( '<p class="a\nb\r\nc" title=\'b\' name=c></p>' );
			assert.areSame( 1, counter );

			parser.onTagOpen = function( tagName, attributes, selfClosing ) {
				counter += 1;

				assert.areSame( false, selfClosing, false );
				assert.areSame( 'p', tagName );
				assert.areSame( 'a', attributes.name );
				assert.areSame( 'b', attributes.title );
			};

			counter = 0;
			parser.parse( '<p\nname="a" title="b">' );
			parser.parse( '<p name="a"\r\ntitle="b">' );
			assert.areSame( 2, counter );

			parser.onTagOpen = function( tagName, attributes, selfClosing ) {
				counter += 1;

				assert.isTrue( selfClosing, 'Should be recognized as a self closing tag' );
				assert.areSame( 'br', tagName );
			};

			counter = 0;
			parser.parse( '<br />' );
			parser.parse( '<br class="a"/>' );
			assert.areSame( 2, counter );
			// shouldn't call onOpenTag
			parser.parse( '<!--<br />-->' );
			assert.areSame( 2, counter );
		},

		test_onTagClose: function() {
			var counter = 0,
				parser = new CKEDITOR.htmlParser();

			parser.onTagClose = function( tagName ) {
				counter += 1;
				assert.areSame( 'p', tagName );
			};

			parser.parse( '</p>' );
			parser.parse( '<!--</p-->' );
			assert.areSame( 1, counter );
		},

		test_onComment: function() {
			var counter = 0,
				parser = new CKEDITOR.htmlParser();

			parser.onComment = function() {
				counter += 1;
			};

			parser.parse( '<!--abc-->' );
			parser.parse( '\\<!--\\-->' );
			assert.areSame( 2, counter );
			// this is valid comment for Fx, Chrome and Opera
			// but in innerHTML they return <!---->
			parser.parse( '<!-->' );
			assert.areSame( 2, counter );
		},

		test_onCDATA: function() {
			var style_html = '<style>%s</style>',
				counter = 0,
				nodes_counter = 0,
				parser = new CKEDITOR.htmlParser();

			parser.onCDATA = function() {
				counter += 1;
			};

			parser.onTagOpen = parser.onTagClose = function( tagName ) {
				if ( tagName !== 'style' )
					nodes_counter += 1;
			};
			parser.onComment = parser.onText = function() {
				nodes_counter += 1;
			};

			parser.parse( style_html.replace( '%s', '<![CDATA[]]>' ) );
			assert.areSame( 1, counter );

			parser.parse( style_html.replace( '%s', '<![CDATA[a\r\nb\nc\n]]>' ) );
			assert.areSame( 2, counter );

			parser.parse( style_html.replace( '%s', '/*<![CDATA[<p></p><br /><!--abc<p>-->]]>*/' ) );
			assert.areSame( 3, counter );

			assert.areSame( 0, nodes_counter );
		},

		test_parse_cdata: function() {
			/* jshint ignore:start */
			assert.areSame( '\<script\><![CDATA[[abc]>\</script\>',
				htmlParse( '\<script\><![CDATA[[abc]>\</script\>' ) );
			/* jshint ignore:end */

			assert.areSame( '<style><![CDATA[[abc]></style>',
				htmlParse( '<style><![CDATA[[abc]></style>' ) );

			// In true XHTML mode this should be valid anywhere in code
			// (and it can be returned by browser - Fx and Chrome do this)
			// But this is really rare case to have this outside script or style
			// assert.areSame( '<![CDATA[[]>',
			// 	 htmlParse( '<![CDATA[[]>' ) );
		},

		test_6946_1: function() {
			assert.areSame( '<dl><dd>a</dd><dt>b</dt></dl>',
				htmlParse( '<dl><dd>a</dd><dt>b</dt></dl>' ) );
		},

		test_6946_2: function() {
			assert.areSame( '<ul><li><ol></ol></li></ul>',
				htmlParse( '<ul><ol></ul>' ) );
		},

		test_6946_3: function() {
			assert.areSame( '<ul><li>1</li></ul><dl><dt>2</dt><dd>3</dd></dl>',
				htmlParse( '<li>1</li><dt>2</dt><dd>3</dd>' ) );
		},

		test_6975: function() {
			assert.areSame( '<dl><dt>foo</dt><dd>bar</dd><dt>baz</dt><dd>quz</dd></dl>',
				htmlParse( '<dl><dt>foo<dd>bar<dt>baz<dd>quz</dl>' ) );
		},

		test_7494: function() {
			assert.areSame( '<ol><li>1<ol><li>2</li></ol></li><li>3</li></ol>',
				htmlParse( '<ol><li>1</li><ol><li>2</li></ol><li>3</li></ol>' ) );
		},

		test_7497: function() {
			assert.areSame( '<p>1</p><ul><li>2</li></ul><p>3</p>',
				htmlParse( '<p>1</p><li>2</li><p>3</p>' ) );
		},

		'test attributes are decoded': function() {
			var elP = CKEDITOR.htmlParser.fragment.fromHtml( '<p foo="&lt;&quot;&gt;">bar</p>' ).children[ 0 ];

			assert.areSame( '<">', elP.attributes.foo );
		}
	} );

} )();