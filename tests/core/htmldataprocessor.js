/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,list,htmlwriter */

( function() {
	'use strict';

	CKEDITOR.tools.enableHtml5Elements( document );

	/**
	 * IE always returning CRLF for linefeed, so remove it when retrieve pre-formated text from text area.
	 * @param {Object} id
	 */
	function getTextAreaValue( id ) {
		return CKEDITOR.document.getById( id ).getValue().replace( /\r/gi, '' );
	}

	// Use inline editor for this test to ensure that testXss function will be always accessible,
	// regardless on how test is ran and in which place (htmlDP or editable) it is executed.
	function addXssTC( tcs, name, input, output ) {
		name = 'test xss - ' + name;
		if ( tcs[ name ] )
			throw 'Test called "' + name + '" already exists.';

		input = input.replace( /%xss%/g, 'testXss()' );
		if ( output !== false )
			output = output ? output.replace( /%xss%/g, 'testXss()' ) : input;

		tcs[ name ] = function() {
			var editor = this.editor2,
				xssed = false;

			window.testXss = function() {
				xssed = true;
			};

			this.editorBot2.setData( input, function() {
				// Wait, because onxxx may not be synchronous.
				wait( function() {
					assert.isFalse( xssed, 'XSSed!' );
					if ( output !== false )
						assert.areSame( output.toLowerCase(), editor.getData().toLowerCase(), 'output is ok' );
				}, 10 );
			} );
		};
	}

	// Sets editor content full HTML containing bodyHtml, then checks if editor#getData() returns
	// exactly the same HTML at output.
	// @param {String} bodyHtml A HTML string which will be placed inside <body/> element.
	// @param {String} title A value for a title element.
	function addProtectedSourceTC( bodyHtml, title ) {
		return function() {
			title = title || 'foo';
			var input = '<!DOCTYPE html>' + '\n' +
					'<html>' +
					'<head>' +
					'<title>' + title + '</title>' +
					'</head>' +
					'<body>' +
					bodyHtml +
					'</body>' +
					'</html>',
				editor = this.editor3;

			this.editorBot3.setData( input, function() {
				this.assertHtml( input, editor.getData(), 'Editor data does not match.' );
			} );
		};
	}

	var tcs = {
		// These tests go far beyond the strict htmlDataProcessor code testing. We
		// are actually testing the entire parsing system here. The combination of
		// htmlParser and htmlWriter inside htmlDataProcessor is useful in this
		// sense.

//		shouldIgnoreAllBut : [ 'test_toDataFormat_ticket_2886_1' ],

		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( {
				editor: {
					name: 'test_editor',
					config: {
						enterMode: CKEDITOR.ENTER_BR,
						allowedContent: true
					}
				},
				editor2: {
					creator: 'inline',
					name: 'test_editor2',
					config: {
						allowedContent: true
					}
				},
				editor3: {
					name: 'test_editor3',
					config: {
						protectedSource: [ /\[\[[^\]]*?\]\]/g ],
						fullPage: true,
						allowedContent: true
					}
				},
				editor4: {
					creator: 'inline',
					name: 'test_editor4',
					config: {
						fillEmptyBlocks: false,
						allowedContent: true
					}
				},
				editor5: {
					creator: 'inline',
					name: 'test_editor5',
					config: {
						fillEmptyBlocks: function( el ) {
							// Do not refactor - should return undefined in other cases.
							if ( el.name == 'h1' )
								return false;
						},
						allowedContent: true
					}
				}
			}, function( editors, bots ) {
				var num, name;

				for ( name in editors ) {
					num = name.match( /\d+/ );
					num = num ? num[ 0 ] : '';

					that[ name ] = editors[ name ];
					that[ 'editorBot' + num ] = bots[ name ];
				}

				that.callback();
			} );
		},

		setUp: function() {
			// Force result data un-formatted.
			this.editor.dataProcessor.writer._.rules = {};
			this.editor.focus();
		},

		createProcessorAssertion: function( type ) {

			assert.isTrue( type == 'input' || type == 'output', 'known processing type' );

			var isToHtml = type == 'input';

			var ed = this.editor, tc = this;

			function processBogus( html ) {
				return html.replace( /@/g, tc.createBogus( isToHtml ) );
			}

			return function( expected, source, msg ) {
				assert.areSame( processBogus( expected ),
				ed.dataProcessor[ isToHtml ? 'toHtml' : 'toDataFormat' ]( processBogus( source ) ),
				msg );
			};
		},

		assertHtml: function( expected, actual, msg ) {
			assert.areEqual( bender.tools.fixHtml( expected ), bender.tools.fixHtml( actual ), msg );
		},

		createBogus: function( toHtml ) {
			return CKEDITOR.env.needsNbspFiller ? ( toHtml ? '\u00a0' : '&nbsp;' ) : '<br />';
		},

		test_toDataFormat_ticket_2886_1: function() {
			assert.areSame( '<p>&nbsp;</p>', this.editor.dataProcessor.toDataFormat( '<p></p>' ) );
		},

		test_toDataFormat_1a: function() {
			var element = new CKEDITOR.dom.element.createFromHtml( '<div><p>Test</p></div>' );

			assert.areSame( '<p>Test</p>', this.editor.dataProcessor.toDataFormat( element.getHtml() ) );
		},

		test_toDataFormat_1b: function() {
			var element = new CKEDITOR.dom.element.createFromHtml( '<div><x:x>Test</x:x></div>' );

			assert.areSame( '<x:x>Test</x:x>', this.editor.dataProcessor.toDataFormat( element.getHtml() ) );
		},

		'test bogus nodes output in pseudo block': function() {
			var o = this.createProcessorAssertion( 'output' );

			o( '<div>&nbsp;<p>foo</p></div>', '<div>@<p>foo</p></div>', 'Converted filler (1)' );
			o( '<div>foo<br />&nbsp;<p>bar</p></div>', '<div>foo<br />@<p>bar</p></div>', 'Converted filler (2)' );
			o( '<hr /><br />&nbsp;', '<hr /><br />@', 'Converted filler (3)' );
			o( '<ul><li>&nbsp;<ol><li>foo</li></ol></li></ul>', '<ul><li>@<ol><li>foo</li></ol></li></ul>', 'Converted filler (4)' );
			o( '<div>foo<p>bar</p></div>', '<div>foo@<p>bar</p></div>', 'Removed bogus' );
			o( '<hr />foo<hr />', '<hr />foo@<hr />', 'Removed bogus (2)' );
		},

		'test bogus nodes input in pseudo block': function() {
			var i = this.createProcessorAssertion( 'input' );

			i( '<div>@<p>foo</p></div>', '<div><br /><p>foo</p></div>', 'Converted filler (1)' );
			i( '<div>@<p>foo</p></div>', '<div>&nbsp;<p>foo</p></div>', 'Converted filler (2)' );

			i( '<div>foo<br />@<p>bar</p></div>', '<div>foo<br />&nbsp;<p>bar</p></div>', 'Converted filler (3)' );
			i( '<div>foo<br />@<p>bar</p></div>', '<div>foo<br /><br /><p>bar</p></div>', 'Converted filler (4)' );

			i( '<hr /><br />@', '<hr /><br />&nbsp;', 'Converted filler (5)' );
			i( '<hr /><br />@', '<hr /><br /><br />', 'Converted filler (6)' );

			i( '<ul><li>@<ol><li>foo</li></ol></li></ul>', '<ul><li>&nbsp;<ol><li>foo</li></ol></li></ul>', 'Converted filler (7)' );

			i( '<div>foo<p>bar</p></div>', '<div>foo<br /><p>bar</p></div>', 'Removed bogus' );

			i( '<div>foo&nbsp;<p>bar</p></div>', '<div>foo&nbsp;<p>bar</p></div>', 'Kept non-filler NBSP' );
			i( '<p>foo&nbsp;</p>', '<p>foo&nbsp;</p>', 'Kept non-filler NBSP (2)' );
		},

		test_toDataFormat_2b: function() {
			var element = new CKEDITOR.dom.element.createFromHtml( '<div><x:x></x:x><p>Test</p></div>' );

			assert.areSame( '<x:x></x:x><p>Test</p>', this.editor.dataProcessor.toDataFormat( element.getHtml() ) );
		},

		test_toDataFormat_3: function() {
			assert.areSame( '<div><x:x><p>Test</p></x:x></div>', this.editor.dataProcessor.toDataFormat( '<div><x:x><p>Test</p></div>' ) );
		},

		test_toDataFormat_ticket_2774: function() {
			var element = new CKEDITOR.dom.element.createFromHtml( '<div><P class=MsoNormal><B><I><SPAN lang=EN-US><o:p>Test</o:p></SPAN></I></B></P></div>' );

			assert.areSame( '<p class="MsoNormal"><b><i><span lang="EN-US"><o:p>Test</o:p></span></i></b></p>', this.editor.dataProcessor.toDataFormat( element.getHtml() ) );
		},

		test_toDataFormat_ticket_3036_1: function() {
			assert.areSame( '<input autocomplete="off" checked="checked" type="checkbox" />',
				this.editor.dataProcessor.toDataFormat( '<INPUT type="checkbox" CHECKED  autocomplete=off>' ) );
		},

		test_toDataFormat_ticket_3036_2: function() {
			assert.areSame( '<input autocomplete="off" type="checkbox" unknown="" />',
				this.editor.dataProcessor.toDataFormat( '<INPUT type="checkbox" UNKNOWN  autocomplete=off>' ) );
		},

		test_toDataFormat_ticket_2886_2: function() {
			var dataProcessor = this.editor.dataProcessor;

			var source = '<p>Some text<br><br><br></p>';
			if ( CKEDITOR.env.needsNbspFiller )
				source = '<p>Some text<br><br></p>';
			assert.areSame( '<p>Some text<br /><br />&nbsp;</p>',
				dataProcessor.toDataFormat( source ) );
		},

		test_toDataFormat_ticket_2886_3: function() {
			var dataProcessor = this.editor.dataProcessor;

			assert.areSame( '<p>Some text<br /><br /><br />Some more text</p>',
				dataProcessor.toDataFormat( '<p>Some text<br><br><br>Some more text</p>' ) );
		},

		test_toDataFormat_ticket_2886_4: function() {
			var dataProcessor = this.editor.dataProcessor;

			assert.areSame( '<p>Some text<br /><br />&nbsp;</p>',
				dataProcessor.toDataFormat( '<p>Some text<br><br>&nbsp;</p>' ) );
		},

		test_toDataFormat_ticket_2886_5: function() {
			CKEDITOR.env.ie && assert.ignore();

			var dataProcessor = this.editor.dataProcessor;

			assert.areSame( '<p>&nbsp;</p>',
				dataProcessor.toDataFormat( '<p><br></p>' ) );
		},

		test_toDataFormat_ticket_2886_6: function() {
			var dataProcessor = this.editor.dataProcessor;

			var source = '<p><br><br></p>';
			if ( CKEDITOR.env.needsNbspFiller )
				source = '<p><br></p>';

			assert.areSame( '<p><br />&nbsp;</p>',
				dataProcessor.toDataFormat( source ) );
		},

		test_toHtml_ticket_2886_1: function() {
			var dataProcessor = this.editor.dataProcessor;

			var expected = '<p><br /></p>';

			if ( CKEDITOR.env.needsNbspFiller ) {
				expected = '<p></p>';
			}

			assert.areSame( expected, dataProcessor.toHtml( '<p></p>' ) );
		},

		test_toHtml_ticket_2886_2: function() {
			var dataProcessor = this.editor.dataProcessor;

			var expected = '<p>Some text<br />Some other text</p>';
			assert.areSame( expected, dataProcessor.toHtml( '<p>Some text<br>Some other text</p>' ) );
		},

		test_toHtml_ticket_2886_3: function() {
			var dataProcessor = this.editor.dataProcessor;

			var expected = '<p>Some text<br />' + this.createBogus( 1 ) + '</p>';
			assert.areSame( expected, dataProcessor.toHtml( '<p>Some text<br>&nbsp;</p>' ) );
		},

		test_toHtml_ticket_2886_4: function() {
			var dataProcessor = this.editor.dataProcessor;

			var expected = '<p>Some text</p>';
			assert.areSame( expected, dataProcessor.toHtml( '<p>Some text<br></p>' ) );
		},

		test_toHtml_ticket_7243: function() {
			var dataProcessor = this.editor.dataProcessor;

			var input = '<p><img onmouseout="this.src=\'out.png\'" onmouseover="this.src=\'over.png\'" src="http://t/image.png" /></p>',
				output = '<p><img data-cke-pa-onmouseout="this.src=\'out.png\'" data-cke-pa-onmouseover="this.src=\'over.png\'" data-cke-saved-src="http://t/image.png" src="http://t/image.png" /></p>';

			assert.areSame( output, bender.tools.fixHtml( dataProcessor.toHtml( input ) ) );
		},

		// Spaces between filler brs should be ignored.(#4344)
		test_spaces_between_filler_br: function() {
			var dataProcessor = this.editor.dataProcessor;
			assert.areSame( '<p><br />&nbsp;</p>',
				dataProcessor.toDataFormat( dataProcessor.toHtml( '<p><br /><br /></p>' ) ) );
		},


/*		test_ticket_3407: function()
		{
			var editor = this.editor,
				dataProcessor = editor.dataProcessor,
				config = editor.config;

			config.protectedSource.push( /<\?[\s\S]*?\?>/g );   // PHP Code
			config.protectedSource.push( /<%[\s\S]*?%>/g );   // ASP Code
			config.protectedSource.push( /(<asp:[^\>]+>[\s|\S]*?<\/asp:[^\>]+>)|(<asp:[^\>]+\/>)/gi );   // ASP.Net Code
			dataProcessor.writer = new CKEDITOR.htmlParser.basicWriter();
			var html = getTextAreaValue( '_TEXTAREA1' );
			var protectedHtml = dataProcessor.toHtml( html );
			assert.areSame( html , dataProcessor.toDataFormat( protectedHtml ) );
		},

		test_ticket_3591: function()
		{
			var editor = this.editor,
				dataProcessor = editor.dataProcessor;

			dataProcessor.writer = new CKEDITOR.htmlParser.basicWriter();
			var html = getTextAreaValue( '_TEXTAREA_3591' );
			var protectedHtml = dataProcessor.toHtml( html );

			assert.areSame( getTextAreaValue( '_TEXTAREA_3591_protected' ), protectedHtml );
			assert.areSame( getTextAreaValue( '_TEXTAREA_3591' ), dataProcessor.toDataFormat( protectedHtml ) );
		}, */

		test_ticket_3591_2: function() {
			var editor = this.editor,
				dataProcessor = editor.dataProcessor;

			dataProcessor.writer = new CKEDITOR.htmlParser.basicWriter();
			dataProcessor.writer.sortAttributes = true;

			var html = getTextAreaValue( '_TEXTAREA_3591_2' );
			var protectedHtml = dataProcessor.toHtml( html );

			assert.areSame( getTextAreaValue( '_TEXTAREA_3591_2' ),
				dataProcessor.toDataFormat( protectedHtml ) );
		},

		test_ticket_3869_1: function() {
			var editor = this.editor,
				dataProcessor = editor.dataProcessor;

			dataProcessor.writer = new CKEDITOR.htmlParser.basicWriter();
			var html = getTextAreaValue( '_TEXTAREA_3869_1' );
			var protectedHtml = dataProcessor.toHtml( html );

			assert.areSame( html , dataProcessor.toDataFormat( protectedHtml ) );
		},

		test_ticket_3869_2: function() {
			var editor = this.editor,
				dataProcessor = editor.dataProcessor,
				config = editor.config;

			config.protectedSource.push( /<\?[\s\S]*?\?>/g );   // PHP Code
			config.protectedSource.push( /<%[\s\S]*?%>/g );   // ASP Code
			config.protectedSource.push( /(<asp:[^\>]+>[\s|\S]*?<\/asp:[^\>]+>)|(<asp:[^\>]+\/>)/gi );   // ASP.Net Code
			config.protectedSource.push( /<gallery[\s\S]*?<\/gallery>/gi );	// custom protected source
			config.protectedSource.push( /<options[\s\S]*?<\/options>/gi );
			dataProcessor.writer = new CKEDITOR.htmlParser.basicWriter();
			var html = getTextAreaValue( '_TEXTAREA_3869_2' );
			var protectedHtml = dataProcessor.toHtml( html );

			assert.areSame( html , dataProcessor.toDataFormat( protectedHtml ) );
		},

		/**
		 * Test empty value attributes.
		 */
		test_ticket_3884: function() {
			var editor = this.editor,
				dataProcessor = editor.dataProcessor;
			dataProcessor.writer = new CKEDITOR.htmlParser.basicWriter();
			dataProcessor.writer.sortAttributes = true;

			assert.areSame( '<p><a href="" name="">emptylink</a></p>',
				dataProcessor.toDataFormat( dataProcessor.toHtml( '<p><a href="" name="">emptylink</a></p>' ) ) );
		},

		test_innerHtmlComments_ticket_3801: function() {
			var editor = this.editor,
				dataProcessor = editor.dataProcessor;

			dataProcessor.writer = new CKEDITOR.htmlParser.basicWriter();

			for ( var i = 1; i <= 7; i++ ) {
				var html = getTextAreaValue( '_TEXTAREA_3801_' + i );
				var protectedHtml = dataProcessor.toHtml( html );

				assert.areSame( getTextAreaValue( '_TEXTAREA_3801_' + i ),
					dataProcessor.toDataFormat( protectedHtml ) );
			}
		},

		/**
		 *	 Leading spaces in <pre> should be well preserved.
		 */
		test_pre_leading_whitespaces_toHtml: function() {
			var editor = this.editor,
				dataProcessor = editor.dataProcessor,
				source = '<pre>\n\n\tOne visible line break.</pre>';
			dataProcessor.writer = new CKEDITOR.htmlParser.basicWriter();
			assert.areSame( source, bender.tools.fixHtml( dataProcessor.toHtml( source ), false, false ) );
		},

		/**
		 *	 Leading spaces in <pre> should be well preserved.
		 */
		test_pre_leading_whitespaces_toDataFormat: function() {
			var editor = this.editor,
				dataProcessor = editor.dataProcessor,
				source = '<pre>\n\tOne visible line break.</pre>\n',
				output = '<pre>\n\n\tOne visible line break.</pre>\n';
			dataProcessor.writer = new CKEDITOR.htmlWriter();
			assert.areSame( output, dataProcessor.toDataFormat( source ) );
		},

		// (#3165)
		'test bogus node output in nested list': function() {
			var processor = this.editor.dataProcessor;
			var source;

			// Create filler node.
			source = '<ol><li>level1</li><li>' + this.createBogus() + '<ol><li>level2</li></ol></li></ol>';
			assert.areSame( '<ol><li>level1</li><li>&nbsp;<ol><li>level2</li></ol></li></ol>',
								bender.tools.fixHtml( processor.toDataFormat( source ), true, true ) );

			// Bogus removed.
			source = '<ol><li>level1</li><li>foo' + this.createBogus() + '<ol><li>level2</li></ol></li></ol>';
			assert.areSame( '<ol><li>level1</li><li>foo<ol><li>level2</li></ol></li></ol>',
								bender.tools.fixHtml( processor.toDataFormat( source ), true, true ) );

			// Real BR preserved.
			source = '<ol><li>level1</li><li>foo<br />' + this.createBogus() + '<ol><li>level2</li></ol></li></ol>';
			assert.areSame( '<ol><li>level1</li><li>foo<br />&nbsp;<ol><li>level2</li></ol></li></ol>',
								bender.tools.fixHtml( processor.toDataFormat( source ), true, true ) );
		},

		// #4096
		'test output embedded/object element': function() {
			assert.areSame( '<div>some<object classid="id1"><param /><param /><embed /></object>text</div>',
				this.editor.dataProcessor.toDataFormat( '<div>some<object classid="id1"><param><param><embed /></object>text</div>' ) );
		},

		// #4614
		'test protect "href" attributes': function() {
			assert.areSame( '<a data-cke-saved-href="http://ckeditor.com" href="http://ckeditor.com">foo</a>',
							bender.tools.fixHtml( this.editor.dataProcessor.toHtml( '<a\n href="http://ckeditor.com">foo</a>' ) ) );
		},

		// #11508
		'test don\'t search for protected in attribute value': function() {
			var escaped = [
					'&lt;span onclick=&quot;x&quot;&gt;y&lt;span&gt;',
					'&lt;input name=&quot;x&quot; /&gt;',
					'&lt;img src=&quot;x&quot; /&gt;',
					'&lt;a href=&quot;x&quot;&gt;y&lt;/a&gt;'
				],
				html;

			for ( var i = escaped.length; i--; ) {
				html = '<img data-foo="' + escaped[ i ] + '" />';

				assert.areSame( html,
					bender.tools.fixHtml( this.editor.dataProcessor.toHtml( html ) ), 'Escaped text is not processed.' );

				html = '<img data-cke-saved-src="' + escaped[ i ] + '" src="' + escaped[ i ] + '" />';

				assert.areSame( html,
					bender.tools.fixHtml( this.editor.dataProcessor.toHtml( html ) ), 'Escaped text is not processed.' );
			}
		},

		// #4243
		'test custom protected source': function() {
			var source = '<p>some<protected>protected</protected>text</p>';
			var org = this.editor.config.protectedSource;
			this.editor.config.protectedSource = [ ( /<protected>.*?<\/protected>/g ) ];
			var processor = this.editor.dataProcessor;
			assert.areSame( source, processor.toDataFormat( processor.toHtml( source ) ) );
			this.editor.config.protectedSource = org;
		},

		// #9250, #8216, #7805
		'test protect source does not break real comments next to \"\' characters': function() {
			var sources = [
				// #9250
				'<p>A\'B<!-- comment -->C\'D</p>',
				// #8216
				'<script>/*\'*/</scr' + 'ipt><!-- comment --><script>/*\'*/</scr' + 'ipt>',
				// #7805
				'<p><span a="1\n">A<!-- comment -->B"</span></p>',
				// More funny version of #7850 - assuming that regexp finding attributes won't accept new line (it doesn't match /./)
				// it may find `" b="` and then `">A<!-- ....`.
				'<p><span a="1\n1" b="2">A<!-- comment -->B"</span></p>'
			];

			var results = [
				'<p>A\'B<!--{cke_protected}{C}%3C!%2D%2D%20comment%20%2D%2D%3E-->C\'D</p>',
				'<!--{cke_protected}%3Cscript%3E%2F*\'*%2F%3C%2Fscript%3E--><!--{cke_protected}{C}%3C!%2D%2D%20comment%20%2D%2D%3E--><!--{cke_protected}%3Cscript%3E%2F*\'*%2F%3C%2Fscript%3E-->',
				'<p><span a="1\n">A<!--{cke_protected}{C}%3C!%2D%2D%20comment%20%2D%2D%3E-->B"</span></p>',
				'<p><span a="1\n1" b="2">A<!--{cke_protected}{C}%3C!%2D%2D%20comment%20%2D%2D%3E-->B"</span></p>'
			];

			for ( var i = 0, processor = this.editor.dataProcessor; i < sources.length; ++i ) {
				assert.areSame(
					results[ i ],
					bender.tools.compatHtml( processor.toHtml( sources[ i ] ), false, true )
						// IE encodes \n in attributes.
						.replace( /&#10;/g, '\n' ),
					'tc ' + i
				);
			}
		},

		// Some elements should not have protected source markup inside. (#11223)
		'test protected source in title': addProtectedSourceTC( '<p>[[mytag]]</p>', '[[mytag]]' ),
		'test protected source in iframe': addProtectedSourceTC( '<p><iframe name="aa">[[mytag]]</iframe></p>' ),
		'test protected source in textarea': addProtectedSourceTC( '<p><textarea name="aa">[[mytag]]</textarea></p>' ),
		'test protected source in textarea multiline': addProtectedSourceTC( '<p><textarea name="aa">[[aa]]\n[[bb]]</textarea></p>' ),
		// Meta tags should be allowed in any element. (#8117)
		'test meta tag in paragraph': addProtectedSourceTC( '<p><meta itemprop="best" content="10" /></p>' ),
		'test meta tag directly in body': addProtectedSourceTC( '<meta itemprop="familyName" content="McFoobar" /><p>x</p>' ),
		'test specially formatted meta tag': addProtectedSourceTC( '<META itemprop="familyName"\tcontent="McFoobar"><p>x</p>' ),

		'test values of attributes are not protected': function() {
			var processor = this.editor.dataProcessor,
				script = '<script>foo</scr' + 'ipt>',
				prot = '{cke_protected_x}';

			assert.areSame(
				'<p foo="' + prot + '">x</p>',
				toHtml( '<p foo="' + script + '">x</p>' ),
				'tc1'
			);

			assert.areSame(
				'<p a="1\n1" foo="' + prot + '">x</p>',
				// Use compatHtml in order to sort attributes (yep, IE again).
				bender.tools.compatHtml( toHtml( '<p a="1\n1" foo="' + script + '">x</p>' ), false, true ),
				'tc2'
			);

			assert.areSame(
				'<p bar="' + prot + prot + '" foo="' + prot + '">x</p>',
				// Use fixHtml in order to sort attributes (yep, IE again).
				bender.tools.compatHtml( toHtml( '<p bar="' + script + script + '" foo="' + script + '">x</p>' ), false, true ),
				'tc3'
			);

			function toHtml( source ) {
				return processor.toHtml( source )
					// For easier comparison.
					.replace( /_\d+/g, '_x' )
					// IE encodes \n in attributes.
					.replace( /&#10;/g, '\n' );
			}
		},

		// #11754, #11846
		'test browser does not hang up when processing malformed attributes list': function() {
			var processor = this.editor.dataProcessor;
			processor.toHtml( '<table border=0 cellspacing=0 cellpadding=0 style=\'border-collapse:collapse;></table>' );
			processor.toHtml( '<span id="sample" overflow="hidden" ;"="" style="font-size:8pt; font-weight:normal; font-style:normal; color:#808080; background:transparent">Text</span>' );

			// If the issue occurs, browser would hang up.
			assert.isTrue( true );
		},

		// #7243
		'test protect inline event handlers': function() {
			var source = '<img onmouseout="this.src=\'out.png\'" onmouseover="this.src=\'over.png\'" src="http://t/image.png" />';
			var processor = this.editor.dataProcessor;
			assert.areSame( source, processor.toDataFormat( processor.toHtml( source ) ) );
		},

		// #5305
		'test processing br in front of inline': function() {
			var source = '<p>line one<br /><br /><img src="http://a.cksource.com/c/1/inc/img/demo-little-red.jpg" /><br />line four</p>';
			var processor = this.editor.dataProcessor;
			assert.areSame( source, processor.toDataFormat( processor.toHtml( source ) ) );
		},

		// #6975
		'test process definition list': function() {
			var source = '<dl><dt>foo</dt><dd>bar</dd><dt>baz</dt><dd>quz</dd></dl>';
			var processor = this.editor.dataProcessor;
			assert.areSame( source, processor.toDataFormat( processor.toHtml( source ) ) );
		},

		'test toHtml preserves cases inside of attribute value ': function() {
			var source = 'background-image: url(http://somedomain/SomeBackground.jpg);';
			var processor = this.editor.dataProcessor;
			assert.areSame( source, processor.toHtml( source ) );
		},

		// #9312
		'test process table with multiple tbody keeps order': function() {
			var processor = this.editor.dataProcessor;
			bender.tools.testInputOut( 'table-multi-tbody', function( source, expected ) {
				assert.areSame( bender.tools.compatHtml( expected ), processor.toDataFormat( source ) );
			} );
		},

		// #9995
		'test process textarea': function() {
			var p = this.editor.dataProcessor,
				ss = '<p>X</p><textarea cols="20" rows="10">',
				se = '</textarea><p>X</p>',
				os = '<p>X</p><textarea cols="20" contenteditable="false" data-cke-editable="1" rows="10">',
				oe = '</textarea><p>X</p>';

			assert.areSame( os + '\n\tfoo\nbar\t' + oe,						toHtml( ss + '\n\tfoo\nbar\t' + se ),			't1' );
			assert.areSame( os + '&lt;p&gt;foo&lt;/p&gt;' + oe,				toHtml( ss + '<p>foo</p>' + se ),				't2' );
			assert.areSame( os + '&lt;img src="a" alt="b" /&gt;' + oe,		toHtml( ss + '<img src="a" alt="b" />' + se ),	't3' );
			assert.areSame( os + 'a&lt;!--b--&gt;c' + oe,					toHtml( ss + 'a<!--b-->c' + se ),				't4' );
			assert.areSame( os + 'a&lt;a href="b"&gt;c&lt;/a&gt;d' + oe,	toHtml( ss + 'a<a href="b">c</a>d' + se ),		't5' );

			assert.areSame(
				os + '&lt;!--a--&gt;' + oe + os + '&lt;!--b--&gt;' + oe,
				toHtml( ss + '<!--a-->' + se + ss + '<!--b-->' + se ),														't6' );

			assert.areSame(
				'<textarea contenteditable="false" data-cke-editable="1">a&lt;!--b--&gt;c</textarea>',
				toHtml( '<textarea>a<!--b-->c</textarea>' ),																't7' );

			assert.areSame(
				os + 'a&lt;?php echo(1); ?&gt;b' + oe,
				toHtml( ss + 'a<?php echo(1); ?>b' + se ),																	't8' );

			assert.areSame( ss + 'foo\nbar' + se,							toDF( os + 'foo\nbar' + oe ),					't9' );

			assert.areSame(
				ss + '&lt;img src=&quot;a&quot; alt=&quot;b&quot; /&gt;' + se,
				toDF( os + '&lt;img src="a" alt="b" /&gt;' + oe ),															't10' );

			function toHtml( html ) {
				return bender.tools.compatHtml( p.toHtml( html ), false, true );
			}
			function toDF( html ) {
				return bender.tools.compatHtml( p.toDataFormat( html ), false, true );
			}
		},

		'test process style': function() {
			var p = this.editor.dataProcessor,
				ss = '<p>X</p><style>',
				se = '</style><p>X</p>';

			assert.areSame( ss + 'a{}' + se,								toHtml( ss + 'a{}' + se ),						's1' );

			assert.areSame( ss + 'a{}</style><p><img data-cke-saved-src="http://t/image.png" src="http://t/image.png" /></p><style>b{}' + se,
				toHtml( ss + 'a{}</style><p><img src="http://t/image.png" /></p><style>b{}' + se ),							's2' );

			function toHtml( html ) {
				return bender.tools.compatHtml( p.toHtml( html ), false, true );
			}
		},

		'test removing apple style span': function() {
			assert.areSame( '<p>abc</p>', this.editor.dataProcessor.toDataFormat( '<p>a<span class="Apple-style-span">b</span>c</p>' ) );
			// Test that it does not happen because of all spans stripping.
			assert.areSame( '<p>a<span>b</span>c</p>', this.editor.dataProcessor.toDataFormat( '<p>a<span>b</span>c</p>' ) );
		},

		// #10298
		'test process attributes containing protected parts': function() {
			var dataP = this.editor.dataProcessor;

			assert.areSame( '<p><a data-cke-saved-href="#" data-href="x" href="#" src-foo="y">a</a></p>',
				bender.tools.fixHtml( dataP.toHtml( '<p><a data-href="x" href="#" src-foo="y">a</a></p>' ) ) );
		},

		'test toHtml event': function() {
			var editor = this.editor,
				calls = 0;

			var lst1 = editor.on( 'toHtml', function( evt ) {
				assert.areSame( '<p onclick="1">A</p>', evt.data.dataValue );
				calls++;
			}, null, null, 1 );

			var lst2 = editor.on( 'toHtml', function( evt ) {
				assert.areSame( '1', evt.data.dataValue.children[ 0 ].attributes.onclick );

				var el = CKEDITOR.htmlParser.fragment.fromHtml( 'B', 'p' ); // <p>B</p>
				el.insertAfter( evt.data.dataValue.children[ 0 ] );
				calls++;
			}, null, null, 5 );

			var lst3 = editor.on( 'toHtml', function( evt ) {
				assert.isTrue( !evt.data.dataValue.children[ 0 ].attributes.onclick );
				calls++;
			}, null, null, 10 );

			var lst4 = editor.on( 'toHtml', function( evt ) {
				assert.areSame( '<p data-cke-pa-onclick="1">A</p><p>B</p>', evt.data.dataValue );
				calls++;
			}, null, null, 15 );

			assert.areSame( '<p data-cke-pa-onclick="1">A</p><p>B</p>', editor.dataProcessor.toHtml( '<p onclick="1">A</p>' ) );
			assert.areSame( 4, calls );

			lst1.removeListener();
			lst2.removeListener();
			lst3.removeListener();
			lst4.removeListener();
		},

		'test toDataFormat event': function() {
			var editor = this.editor,
				calls = 0;

			var lst1 = editor.on( 'toDataFormat', function( evt ) {
				assert.areSame( '<p data-cke-pa-onclick="1">A</p><p>B</p>', evt.data.dataValue );
				calls++;
			}, null, null, 1 );

			var lst2 = editor.on( 'toDataFormat', function( evt ) {
				assert.isTrue( !evt.data.dataValue.children[ 0 ].attributes.onclick );

				evt.data.dataValue.children[ 1 ].remove();
				calls++;
			}, null, null, 5 );

			var lst3 = editor.on( 'toDataFormat', function( evt ) {
				assert.areSame( '1', evt.data.dataValue.children[ 0 ].attributes.onclick );
				calls++;
			}, null, null, 10 );

			var lst4 = editor.on( 'toDataFormat', function( evt ) {
				assert.areSame( '<p onclick="1">A</p>', evt.data.dataValue );
				calls++;
			}, null, null, 15 );

			assert.areSame( '<p onclick="1">A</p>', editor.dataProcessor.toDataFormat( '<p data-cke-pa-onclick="1">A</p><p>B</p>' ) );
			assert.areSame( 4, calls );

			lst1.removeListener();
			lst2.removeListener();
			lst3.removeListener();
			lst4.removeListener();
		},

		'test toHtml - arguments backward compatibility': function() {
			var editor = this.editor,
				data;

			editor.once( 'toHtml', function( evt ) {
				data = evt.data;
				evt.cancel();
			}, null, null, 1 );

			editor.dataProcessor.toHtml( 'a', 'b', true, true );

			assert.areSame( 'a', data.dataValue, 'dataValue' );
			assert.areSame( 'b', data.context, 'context' );
			assert.isTrue( data.fixForBody, 'fixForBody' );
			assert.isTrue( data.dontFilter, 'dontFilter' );
		},

		'test toHtml - arguments passed to event': function() {
			var editor = this.editor,
				data,
				filter = new CKEDITOR.filter( 'a' );

			editor.once( 'toHtml', function( evt ) {
				data = evt.data;
				evt.cancel();
			}, null, null, 1 );

			editor.dataProcessor.toHtml( 'a', {
				context: 'b',
				fixForBody: true,
				dontFilter: true,
				filter: filter
			} );

			assert.areSame( 'a', data.dataValue, 'dataValue' );
			assert.areSame( 'b', data.context, 'context' );
			assert.isTrue( data.fixForBody, 'fixForBody' );
			assert.isTrue( data.dontFilter, 'dontFilter' );
			assert.areSame( filter, data.filter, 'filter' );
		},

		'test toHtml - automatic context': function() {
			var editor = this.editor,
				data;

			editor.once( 'toHtml', function( evt ) {
				data = evt.data;
				evt.cancel();
			}, null, null, 1 );

			editor.dataProcessor.toHtml( 'a', {
				// Pass whathever to be sure that new options object will be used.
				fixForBody: true
			} );

			assert.areSame( 'body', data.context, 'context' );
		},

		// There's a difference between null and undefined context.
		'test toHtml - null context': function() {
			var editor = this.editor,
				data;

			editor.once( 'toHtml', function( evt ) {
				data = evt.data;
				evt.cancel();
			}, null, null, 1 );

			editor.dataProcessor.toHtml( 'a', {
				context: null
			} );

			assert.areSame( 'a', data.dataValue, 'dataValue' );
			assert.areSame( null, data.context, 'context' );
		},

		'test toHtml - automatic context - backward compatibility': function() {
			var editor = this.editor,
				data;

			editor.once( 'toHtml', function( evt ) {
				data = evt.data;
				evt.cancel();
			}, null, null, 1 );

			editor.dataProcessor.toHtml( 'a' );

			assert.areSame( 'body', data.context, 'context' );
		},

		'test toHtml - options.filter': function() {
			var editor = this.editor, html;

			html = editor.dataProcessor.toHtml( '<p><i class="options-filter">A</i><b>B</b></p>', {
				filter: new CKEDITOR.filter( 'p; i(options-filter)' )
			} );
			assert.areSame( '<p><i class="options-filter">A</i>B</p>', html );
		},

		'test toHtml - options.filter - defaults to': function() {
			var editor = this.editor,
				filters = [],
				customFilter = new CKEDITOR.filter( 'a' );

			var listener = editor.on( 'toHtml', function( evt ) {
				filters.push( evt.data.filter );
				evt.cancel();
			}, null, null, 1 );

			editor.dataProcessor.toHtml( 'a' );
			editor.dataProcessor.toHtml( 'a', { filter: customFilter } );

			editor.setActiveFilter( new CKEDITOR.filter( 'b' ) );
			editor.dataProcessor.toHtml( 'a' );
			editor.dataProcessor.toHtml( 'a', { filter: customFilter } );

			editor.setActiveFilter( null );

			listener.removeListener();

			assert.areSame( editor.filter, filters[ 0 ], 'defaults to the main filter' );
			assert.areSame( customFilter, filters[ 1 ], 'custom filter passed' );

			assert.areSame( editor.filter, filters[ 2 ], 'defaults to the main filter instead of active filter' );
			assert.areSame( customFilter, filters[ 3 ], 'custom filter passed 2' );
		},

		'test toDataFormat - options.filter': function() {
			var editor = this.editor,
				data,
				filter = new CKEDITOR.filter( 'p i' );

			// Test transformations, because filtering is not done on output.
			filter.addContentForms( [ 'i', 'em' ] );

			data = editor.dataProcessor.toDataFormat( '<p><i>A</i><em>B</em></p>', {
				filter: filter
			} );
			assert.areSame( '<p><i>A</i><i>B</i></p>', data );
		},

		'test toDataFormat - options.filter - defaults to': function() {
			var editor = this.editor,
				filters = [],
				customFilter = new CKEDITOR.filter( 'a' );

			var listener = editor.on( 'toDataFormat', function( evt ) {
				filters.push( evt.data.filter );
				evt.cancel();
			}, null, null, 1 );

			editor.dataProcessor.toDataFormat( 'a' );
			editor.dataProcessor.toDataFormat( 'a', { filter: customFilter } );

			editor.setActiveFilter( new CKEDITOR.filter( 'b' ) );
			editor.dataProcessor.toDataFormat( 'a' );
			editor.dataProcessor.toDataFormat( 'a', { filter: customFilter } );

			editor.setActiveFilter( null );

			listener.removeListener();

			assert.areSame( editor.filter, filters[ 0 ], 'defaults to the main filter' );
			assert.areSame( customFilter, filters[ 1 ], 'custom filter passed' );

			assert.areSame( editor.filter, filters[ 2 ], 'defaults to the main filter instead of active filter' );
			assert.areSame( customFilter, filters[ 3 ], 'custom filter passed 2' );
		},

		'test toDataFormat - options.context': function() {
			bender.editorBot.create( {
				name: 'test_todf_ctx'
			}, function( bot ) {
				var editor = bot.editor,
					dataProcessor = editor.dataProcessor,
					context;

				editor.once( 'toDataFormat', function( evt ) {
					context = evt.data.context;
				}, null, null, 1 );
				assert.areSame( '<p>foo</p>', dataProcessor.toDataFormat( 'foo' ), 'data was processed in body context' );
				assert.areSame( 'body', context, 'context defaults to editor.editable' );

				editor.once( 'toDataFormat', function( evt ) {
					context = evt.data.context;
				}, null, null, 1 );
				assert.areSame( 'foo', dataProcessor.toDataFormat( 'foo', { context: 'p' } ), 'data was processed in p context' );
				assert.areSame( 'p', context, 'custom context' );
			} );
		},

		'test toHtml - options.enterMode': function() {
			bender.editorBot.create( {
				name: 'test_tohtml_entermode'
			}, function( bot ) {
				var editor = bot.editor, html;

				html = editor.dataProcessor.toHtml( 'foo' );
				assert.areSame( '<p>foo</p>', html, 'default mode was used' );

				editor.setActiveEnterMode( CKEDITOR.ENTER_DIV );
				html = editor.dataProcessor.toHtml( 'foo' );
				assert.areSame( '<p>foo</p>', html, 'dynamic mode was used instead of active mode' );

				html = editor.dataProcessor.toHtml( 'foo', { enterMode: CKEDITOR.ENTER_BR } );
				assert.areSame( 'foo', html, 'passed mode was used' );
			} );
		},

		'test toDataFormat - options.enterMode': function() {
			bender.editorBot.create( {
				name: 'test_todf_entermode'
			}, function( bot ) {
				var editor = bot.editor, html;

				html = editor.dataProcessor.toDataFormat( 'foo' );
				assert.areSame( '<p>foo</p>', html, 'default mode was used' );

				editor.setActiveEnterMode( CKEDITOR.ENTER_DIV );
				html = editor.dataProcessor.toDataFormat( 'foo' );
				assert.areSame( '<p>foo</p>', html, 'default mode was used instead of active mode' );

				html = editor.dataProcessor.toDataFormat( 'foo', { enterMode: CKEDITOR.ENTER_BR } );
				assert.areSame( 'foo', html, 'passed mode was used' );
			} );
		},

		'test toHtml passes enterMode to ACF so elements are stripped correctly': function() {
			var data = '<div>foo</div><div>bar</div>';

			assert.areSame( '<p>foo</p><p>bar</p>', this.editor.dataProcessor.toHtml( data, {
				enterMode: CKEDITOR.ENTER_P,
				filter: new CKEDITOR.filter( 'p br' )
			} ), 'p mode' );

			assert.areSame( 'foo<br />bar', this.editor.dataProcessor.toHtml( data, {
				enterMode: CKEDITOR.ENTER_BR,
				filter: new CKEDITOR.filter( 'p br' )
			} ), 'br mode' );
		},

		'test leading br is removed by toDataFormat in ENTER_P and ENTER_DIV': function() {
			var htmlDP = this.editor.dataProcessor,
				opts = { enterMode: CKEDITOR.ENTER_P };

			assert.areSame( '', htmlDP.toDataFormat( '<br>', opts ), 'single <br>' );
			assert.areSame( '', htmlDP.toDataFormat( '<BR>', opts ), 'single <BR>' );
			assert.areSame( '', htmlDP.toDataFormat( '<br />', opts ), 'single <br />' );

			assert.areSame( '<p>foo</p>', htmlDP.toDataFormat( '<br><p>foo</p>', opts ), '<br> followed by a block' );
			assert.areSame( '<p><b>foo</b></p>', htmlDP.toDataFormat( '<br><b>foo</b>', opts ), '<br> followed by an inline element' );
			assert.areSame( '<p>foo</p>', htmlDP.toDataFormat( '<br>foo', opts ), '<br> followed by a text' );

			assert.areSame( '<div>foo</div>', htmlDP.toDataFormat( '<br>foo', { enterMode: CKEDITOR.ENTER_DIV } ), '<br> followed by a block - ENTER_DIV' );

			assert.areSame( '<br />foo', htmlDP.toDataFormat( '<br>foo', { enterMode: CKEDITOR.ENTER_BR } ), '<br> is not removed in ENTER_BR' );
		},

		'test data-cke-expando is always stripped': function() {
			var htmlDP = this.editor.dataProcessor;

			assert.areSame( '<p>foo</p>', htmlDP.toHtml( '<p data-cke-expando="1">foo</p>' ), 'toHtml' );
			assert.areSame( '<p>foo</p>', htmlDP.toDataFormat( '<p data-cke-expando="1">foo</p>' ), 'toDF' );
			assert.areSame( '<p contenteditable="false">foo</p>', htmlDP.toHtml( '<p contenteditable="false" data-cke-expando="1">foo</p>' ), 'toHtml - non editable' );
			assert.areSame( '<p contenteditable="false">foo</p>', htmlDP.toHtml( '<p contenteditable="false" data-cke-expando="1">foo</p>' ), 'toDF - non editable' );
		},

		'test config.fillEmptyBlocks - default': function() {
			var htmlDP = this.editor.dataProcessor,
				bogus = CKEDITOR.env.needsBrFiller ? '<br />' : '';

			assert.areSame( '<p>' + bogus + '</p>', htmlDP.toHtml( '<p></p>' ), 'toHtml 1' );
			assert.areSame( '<div><h1>' + bogus + '</h1></div>', htmlDP.toHtml( '<div><h1></h1></div>' ), 'toHtml 2' );

			bogus = '&nbsp;';

			assert.areSame( '<p>' + bogus + '</p>', htmlDP.toDataFormat( '<p></p>' ), 'toDF 1' );
			assert.areSame( '<div><h1>' + bogus + '</h1></div>', htmlDP.toDataFormat( '<div><h1></h1></div>' ), 'toDF 2' );
		},

		'test config.fillEmptyBlocks - false': function() {
			var htmlDP = this.editor4.dataProcessor,
				bogus = CKEDITOR.env.needsBrFiller ? '<br />' : '';

			// Even though filler fillEmptyBlocks is set to false, we should still put bogus to HTML,
			// which will be displayed in editable. (#12735)
			assert.areSame( '<p>' + bogus + '</p>', htmlDP.toHtml( '<p></p>' ), 'toHtml 1' );
			assert.areSame( '<div><h1>' + bogus + '</h1></div>', htmlDP.toHtml( '<div><h1></h1></div>' ), 'toHtml 1' );

			assert.areSame( '<p></p>', htmlDP.toDataFormat( '<p></p>' ), 'toDF 1' );
			assert.areSame( '<div><h1></h1></div>', htmlDP.toDataFormat( '<div><h1></h1></div>' ), 'toDF 2' );
		},

		'test config.fillEmptyBlocks - callback': function() {
			var htmlDP = this.editor5.dataProcessor,
				bogus = CKEDITOR.env.needsBrFiller ? '<br />' : '';

			assert.areSame( '<p>' + bogus + '</p>', htmlDP.toHtml( '<p></p>' ), 'toHtml 1' );
			assert.areSame( '<h1>' + bogus + '</h1>', htmlDP.toHtml( '<h1></h1>' ), 'toHtml 2' );

			bogus = '&nbsp;';

			assert.areSame( '<p>' + bogus + '</p>', htmlDP.toDataFormat( '<p></p>' ), 'toDF 1' );
			assert.areSame( '<h1></h1>', htmlDP.toDataFormat( '<h1></h1>' ), 'toDF 2' );
		},

		'test empty root - context: body, enterMode: P': function() {
			var htmlDP = this.editor.dataProcessor;

			assert.isInnerHtmlMatching( '<p>@</p>', htmlDP.toHtml( '', {
				context: 'body',
				enterMode: CKEDITOR.ENTER_P
			} ), 'toHtml' );
		},

		'test empty root - context: body, enterMode: DIV': function() {
			var htmlDP = this.editor.dataProcessor;

			assert.isInnerHtmlMatching( '<div>@</div>', htmlDP.toHtml( '', {
				context: 'body',
				enterMode: CKEDITOR.ENTER_DIV
			} ), 'toHtml' );
		},

		'test empty root - context: body, enterMode: BR': function() {
			var htmlDP = this.editor.dataProcessor;

			assert.isInnerHtmlMatching( '@', htmlDP.toHtml( '', {
				context: 'body',
				enterMode: CKEDITOR.ENTER_BR
			} ), 'toHtml' );
		},

		'test empty root - context: div, enterMode: P': function() {
			var htmlDP = this.editor.dataProcessor;

			assert.isInnerHtmlMatching( '<p>@</p>', htmlDP.toHtml( '', {
				context: 'div',
				enterMode: CKEDITOR.ENTER_P
			} ), 'toHtml' );
		},

		'test empty root - context: h1, enterMode: BR': function() {
			var htmlDP = this.editor.dataProcessor;

			assert.isInnerHtmlMatching( '@', htmlDP.toHtml( '', {
				context: 'h1',
				enterMode: CKEDITOR.ENTER_BR
			} ), 'toHtml' );
		}
	};

	// #8630
	addXssTC( tcs, 'img onerror', '<p><img onerror="%xss%" src="produce404" /></p>' );
	addXssTC( tcs, 'img ONERROR', '<p><img ONERROR="%xss%" src="produce404" /></p>' );
	addXssTC( tcs, 'img onerror without quotes',
		'<p><img onerror=%xss% src="produce404" /></p>',
		'<p><img onerror="%xss%" src="produce404" /></p>' );
	addXssTC( tcs, 'img onerror with white spaces',
		'<p><img \nonerror\n =\n "%xss%" src="produce404" /></p>',
		'<p><img onerror="%xss%" src="produce404" /></p>' );
	addXssTC( tcs, 'img onerror without quotes and with white spaces',
		'<p><img onerror =\n  \t%xss% src="produce404" /></p>',
		'<p><img onerror="%xss%" src="produce404" /></p>' );

	// #11635
	addXssTC( tcs, 'video onerror', '<p><video onerror="%xss%">foo</video></p>' );
	addXssTC( tcs, 'video onerror + src', '<p><video onerror="%xss%" src="produce404">foo</video></p>' );
	addXssTC( tcs, 'video src + onerror',
		'<p><video src="produce404" onerror="%xss%">foo</video></p>',
		'<p><video onerror="%xss%" src="produce404">foo</video></p>' );
	addXssTC( tcs, 'video 2 x onerror',
		'<p><video onerror="%xss%" onerror="%xss%" src="produce404">foo</video></p>',
		'<p><video onerror="%xss%" src="produce404">foo</video></p>' );
	addXssTC( tcs, 'video with source onerror', '<p><video><source onerror="%xss%" /></video></p>' );
	addXssTC( tcs, 'video with source onerror 2',
		'<p><video><source onerror="%xss%" src="produce404" /><source src="produce404" onerror="%xss%" /></video></p>',
		'<p><video><source onerror="%xss%" src="produce404" /><source onerror="%xss%" src="produce404" /></video></p>' );
	addXssTC( tcs, 'video with incorrect source onerror 1', '<p><video><source onerror.="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 2', '<p><video><source onerror&="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 3', '<p><video><source onerror%3D"%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 4', '<p><video><source on error="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 5', '<p><video><source on\nerror="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 6', '<p><video><source o\rnerror="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 7a', '<p><video><source o\x00nerror="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 7b', '<p><video><source onerror\x00="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 7c', '<p><video><source onerror\x02="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 8', '<p><video><source o\u0000nerror="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 9', '<p><video><source o\u0009nerror="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 10', '<p><video><source o\u0008onerror="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 11', '<p><video><source onerror %xss% src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 12', '<p><video><source onerror "%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 13', '<p><video><source onerror=="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 14', '<p><video><source onerror= ="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 15', '<p><video><source onerror ==="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 16', '<p><video><source foo=1onerror="%xss%" src="produce404" /></video></p>', false );
	// Important to have src first, because Chrome timeouts if it cannot be found.
	addXssTC( tcs, 'video with incorrect source onerror 17', '<p><video><source src="produce404" foo="1\n onerror="%xss%" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 18', '<p><video><source <onerror="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 19', '<p><video><source _onerror="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with incorrect source onerror 20', '<p><video><source /onerror="%xss%" src="produce404" /></video></p>', false );
	addXssTC( tcs, 'video with spacy source onerror 1',
		'<p><video><source onerror = "%xss%" src="produce404" /></video></p>',
		'<p><video><source onerror="%xss%" src="produce404" /></video></p>' );
	addXssTC( tcs, 'video with spacy source onerror 2',
		'<p><video><source onerror\r\n \t="%xss%" src="produce404" /></video></p>',
		'<p><video><source onerror="%xss%" src="produce404" /></video></p>' );
	addXssTC( tcs, 'video with spacy source onerror 3',
		'<p><video><source onerror=\n\r \t"%xss%" src="produce404" /></video></p>',
		'<p><video><source onerror="%xss%" src="produce404" /></video></p>' );
	addXssTC( tcs, 'video with spacy source onerror 4',
		'<p><video><source foo="x"onerror="%xss%" src="produce404" /></video></p>',
		'<p><video><source foo="x" onerror="%xss%" src="produce404" /></video></p>' );

	// False positive cases.

	// IE8 will lose custom element.
	if ( !CKEDITOR.env.ie || CKEDITOR.env.version > 8 ) {
		addXssTC( tcs, 'false positive 1',
			'<p><onxxx>foo</onxxx>bar</p>',
			'<p><onxxx>foo</onxxx>bar</p>' );
	}

	bender.test( tcs );
} )();