/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: image2,justify,toolbar */
/* global widgetTestsTools, image2TestsTools */

( function() {
	'use strict';

	var getWidgetById = widgetTestsTools.getWidgetById,
		fixHtml = image2TestsTools.fixHtml,
		defs = {
			src_only: {
				name: 'src_only',
				config: {
					allowedContent: 'img[src,alt]'
				},
				fields: {
					src: true,
					alt: true,
					align: false,
					width: false,
					height: false,
					hasCaption: false
				}
			},
			no_dimensions: {
				name: 'no_dimensions',
				config: {
					allowedContent: 'img[src,alt]{float};figure(image){float};figcaption;div p{text-align}'
				},
				fields: {
					src: true,
					alt: true,
					align: true,
					width: false,
					height: false,
					hasCaption: true
				}
			},
			no_align: {
				name: 'no_align',
				config: {
					allowedContent: 'img[src,alt,width,height];figure(image);figcaption;div'
				},
				fields: {
					src: true,
					alt: true,
					align: false,
					width: true,
					height: true,
					hasCaption: true
				}
			},
			all_allowed: {
				name: 'all_allowed',
				config: {
					allowedContent: 'img[src,alt,width,height]{float};figure(image){float};figcaption;div p{text-align}'
				},
				fields: {
					src: true,
					alt: true,
					align: true,
					width: true,
					height: true,
					hasCaption: true
				}
			}
		}, bots;

	for ( var d in defs ) {
		CKEDITOR.tools.extend( defs[ d ].config, {
			language: 'en',
			extraAllowedContent: 'figure img[id]; p{text-align}',
			autoParagraph: false
		} );
	}

	function assertVisibleFields( bot, fields ) {
		bot.editor.once( 'dialogShow', function( evt ) {
			var dialog = evt.data;

			resume( function() {
				try {
					for ( var f in fields )
						assert.areSame( fields[ f ], dialog.getContentElement( 'info', f ).isVisible(), 'Visibility of "' + f + '" must be correct.' );
				} catch ( e ) {
					throw e;
				} finally {
					dialog.hide();
				}
			} );
		} );

		bot.editor.execCommand( 'image' );

		wait();
	}

	function test( name, html, data, expected ) {
		var bot = bots[ name ];

		bot.setData( html, function() {
			var widget = getWidgetById( bot.editor, 'x' ),
				fields = defs[ name ].fields;

			widget.setData( data );

			assert.areSame( fixHtml( expected ),
				fixHtml( bot.getData() ), 'Widget data considers ACF rules.' );

			assert.areEqual( !!( fields.width && fields.height ),
				!!widget.resizer, 'Resizer displayed according to ACF rules.' );

			assertVisibleFields( bot, fields );
		} );
	}

	function assertCommandState( editor, left, right, center, justify ) {
		var leftCmd = editor.getCommand( 'justifyleft' );
		var rightCmd = editor.getCommand( 'justifyright' );
		var centerCmd = editor.getCommand( 'justifycenter' );
		var justifyCmd = editor.getCommand( 'justifyblock' );

		assert.areSame( left, leftCmd.state, 'leftCmd.state' );
		assert.areSame( right, rightCmd.state, 'rightCmd.state' );
		assert.areSame( center, centerCmd.state, 'centerCmd.state' );
		assert.areSame( justify, justifyCmd.state, 'justifyCmd.state' );
	}

	bender.test( {
		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( defs, function( editors, botCollection ) {
				bots = botCollection;
				that.callback( editors );
			} );
		},
		'test image: src only': function() {
			test( 'src_only',
				'<img id="x" src="_assets/foo.png" alt="b" width="1" height="2" />',
				{
					src: '_assets/bar.png',
					alt: 'c',
					align: 'left',
					width: 3,
					height: 4,
					hasCaption: true
				},
				'<img alt="c" id="x" src="_assets/bar.png" />'
			);
		},

		'test image: no dimensions (inline)': function() {
			test( 'no_dimensions',
				'<img alt="b" height="2" id="x" src="_assets/foo.png" width="1" />',
				{
					src: '_assets/bar.png',
					alt: 'c',
					align: 'none',
					width: 3,
					height: 4,
					hasCaption: false
				},
				'<img alt="c" id="x" src="_assets/bar.png" />'
			);
		},

		'test image: no dimensions (block)': function() {
			test( 'no_dimensions',
				'<figure class="image"><img alt="b" height="1" id="x" src="_assets/foo.png" width="2" /><figcaption>c</figcaption></figure>',
				{
					src: '_assets/bar.png',
					alt: 'c',
					align: 'none',
					width: 3,
					height: 4,
					hasCaption: true
				},
				'<figure class="image"><img alt="c" id="x" src="_assets/bar.png" /><figcaption>c</figcaption></figure>'
			);
		},

		'test image: no float (inline)': function() {
			test( 'no_align',
				'<img alt="b" height="2" id="x" src="_assets/foo.png" style="float:left" width="1" />',
				{
					src: '_assets/bar.png',
					alt: 'c',
					align: 'left',
					width: 3,
					height: 4,
					hasCaption: false
				},
				'<img alt="c" height="4" id="x" src="_assets/bar.png" width="3" />'
			);
		},

		'test image: no float (block)': function() {
			test( 'no_align',
				'<figure class="image"><img alt="b" height="1" id="x" src="_assets/foo.png" width="2" /><figcaption>c</figcaption></figure>',
				{
					src: '_assets/bar.png',
					alt: 'c',
					align: 'left',
					width: 3,
					height: 4,
					hasCaption: true
				},
				'<figure class="image"><img alt="c" height="4" id="x" src="_assets/bar.png" width="3" /><figcaption>c</figcaption></figure>'
			);
		},

		'test image: no centering (inline)': function() {
			test( 'no_align',
				'<img alt="b" height="2" id="x" src="_assets/foo.png" style="float:left" width="1" />',
				{
					src: '_assets/bar.png',
					alt: 'c',
					align: 'center',
					width: 3,
					height: 4,
					hasCaption: false
				},
				'<img alt="c" height="4" id="x" src="_assets/bar.png" width="3" />'
			);
		},

		'test image: no centering (block)': function() {
			test( 'no_align',
				'<figure class="image"><img alt="b" height="1" id="x" src="_assets/foo.png" width="2" /><figcaption>c</figcaption></figure>',
				{
					src: '_assets/bar.png',
					alt: 'c',
					align: 'center',
					width: 3,
					height: 4,
					hasCaption: true
				},
				'<figure class="image"><img alt="c" height="4" id="x" src="_assets/bar.png" width="3" /><figcaption>c</figcaption></figure>'
			);
		},

		'test image: all allowed': function() {
			test( 'all_allowed',
				'<img alt="b" height="2" id="x" src="_assets/foo.png" width="1" />',
				{
					src: '_assets/bar.png',
					alt: 'c',
					align: 'right',
					width: 3,
					height: 4,
					hasCaption: true
				},
				'<figure class="image" style="float:right;"><img alt="c" height="4" id="x" src="_assets/bar.png" width="3" /><figcaption>caption</figcaption></figure>'
			);
		},

		'test justify plugin integration when (alignment disallowed)': function() {
			var bot = bots.no_align;

			bot.setData( 'x<img alt="b" height="2" id="x" src="_assets/foo.png" width="1" />', function() {
				getWidgetById( bot.editor, 'x' ).focus();
				assertCommandState( bot.editor, 0, 0, 0, 0 );
			} );
		},

		'test justify plugin integration (alignment allowed)': function() {
			var bot = bots.all_allowed;

			bot.setData( 'x<img alt="b" height="2" id="x" style="float:left" src="_assets/foo.png" width="1" />', function() {
				getWidgetById( bot.editor, 'x' ).focus();
				assertCommandState( bot.editor, 1, 2, 2, 0 );
			} );
		}
	} );
} )();