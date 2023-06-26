/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: image2 */
/* global widgetTestsTools, image2TestsTools */

( function() {
	'use strict';

	function assertWidgetDom( config ) {
		assert.isMatching( config.dom, fixHtml( config.bot.editor.editable().getHtml().replace( /title="[^"]+"/g, '' ) ) );
	}

	function assertWrapperAlignFloat( expected, msg ) {
		return function( widget ) {
			assert.areSame( expected, CKEDITOR.tools.trim( widget.wrapper.getStyle( 'float' ) ), msg );
		};
	}

	function assertWrapperAlignClasses( expected, checkElement ) {
		return function( widget ) {
			var config = widget.editor.config,
				falseClasses = CKEDITOR.tools.convertArrayToObject( config.image2_alignClasses );

			assert.areSame( '', widget.wrapper.getStyle( 'float' ),
				'Widget.wrapper is not floated' );
			assert.areSame( '', widget.element.getStyle( 'float' ),
				'Widget.element is not floated' );

			var elType = checkElement ? 'element' : 'wrapper',
				el = widget[ elType ];

			if ( expected ) {
				assert.isTrue( el.hasClass( expected ),
					'.' + expected + ' class is present on widget.' + elType );
				delete falseClasses[ expected ];
			}

			for ( var f in falseClasses )
				assert.isFalse( el.hasClass( f ),
					'.' + f + ' class is not present on widget.' + elType );
		};
	}

	function assertWidget( config ) {
		// By default we use id 'x' in this testcase.
		config.widgetId = config.widgetId || 'x';

		config.nameCreated = 'image';
		config.nameNewData = 'image';

		// Assert widget HTML once destroyed.
		config.callback = assertWidgetDom;

		widgetTestsTools.assertWidget( config );
	}

	var fixHtml = image2TestsTools.fixHtml,
		htmls = {
			image: '<img src="_assets/foo.png" id="x" />',

			imageAlignedLeft:
				'<img src="_assets/foo.png" id="x" style="float:left" />',
			imageAlignedClassLeft:
				'<img class="l" src="_assets/foo.png" id="x" />',

			imageCentered:
				'<p style="text-align:center;">' +
					'<img src="_assets/foo.png" id="x" />' +
				'</p>',
			imageCenteredClass:
				'<p class="c">' +
					'<img src="_assets/foo.png" id="x" />' +
				'</p>',

			imageAlignedRight:
				'<img src="_assets/foo.png" id="x" style="float:right" />',
			imageAlignedClassRight:
				'<img class="r" src="_assets/foo.png" id="x" />',

			captioned:
				'<figure class="image">' +
					'<img src="_assets/foo.png" id="x" />' +
					'<figcaption>bar</figcaption>' +
				'</figure>',

			captionedAlignLeft:
				'<figure class="image" style="float:left">' +
					'<img src="_assets/foo.png" id="x" />' +
					'<figcaption>bar</figcaption>' +
				'</figure>',
			captionedAlignedClassLeft:
				'<figure class="l image">' +
					'<img src="_assets/foo.png" id="x" />' +
					'<figcaption>bar</figcaption>' +
				'</figure>',

			captionedCentered:
				'<div style="text-align:center">' +
					'<figure class="image">' +
						'<img src="_assets/foo.png" id="x" />' +
						'<figcaption>bar</figcaption>' +
					'</figure>' +
				'</div>',
			captionedCenteredClass:
				'<div class="c">' +
					'<figure class="image">' +
						'<img src="_assets/foo.png" id="x" />' +
						'<figcaption>bar</figcaption>' +
					'</figure>' +
				'</div>',

			captionedAlignedClassRight:
				'<figure class="r image">' +
					'<img src="_assets/foo.png" id="x" />' +
					'<figcaption>bar</figcaption>' +
				'</figure>'
		},

		doms = {
			image: new RegExp(
				'<img alt=""( class="[lr]")? data-cke-saved-src="_assets/foo.png"( data-cke-widget-upcasted="1")? id="x" src="_assets/foo.png" />' ),
			imageCentered: new RegExp(
				'<p( style="text-align:center;")|(class="c")>' +
					'<span class="cke_image_resizer_wrapper">' +
						'<img alt="" data-cke-saved-src="_assets/foo.png"( data-cke-widget-upcasted="1")? id="x" src="_assets/foo.png" />' +
						'<span class="cke_image_resizer"></span>' +
					'</span>' +
				'</p>' ),
			captioned: new RegExp(
				'<figure class="image"( data-cke-widget-upcasted="1")?>' +
					'<span class="cke_image_resizer_wrapper">' +
						'<img alt="" data-cke-saved-src="_assets/foo.png"( data-cke-widget-upcasted="1")? id="x" src="_assets/foo.png" />' +
						'<span class="cke_image_resizer( cke_image_resizer_left)?"></span>' +
					'</span>' +
					'<figcaption data-cke-display-name="caption" data-cke-filter="\\d+">[^<]+</figcaption>' +
					'(<br(?: type="_moz")? />)?' +
				'</figure>' ),
			captionedCentered: new RegExp(
				'<figure class="image"( data-cke-widget-upcasted="1")?( style="display:inline-block;")?>' +
					'<span class="cke_image_resizer_wrapper">' +
						'<img alt="" data-cke-saved-src="_assets/foo.png"( data-cke-widget-upcasted="1")? id="x" src="_assets/foo.png" />' +
						'<span class="cke_image_resizer( cke_image_resizer_left)?"></span>' +
					'</span>' +
					'<figcaption data-cke-display-name="caption" data-cke-filter="\\d+">[^<]+</figcaption>' +
					'(<br(?: type="_moz")? />)?' +
				'</figure>' )
		};

	bender.editors = {
		alignInline: {
			name: 'alignInline',
			config: {}
		},
		alignClasses: {
			name: 'alignClasses',
			config: {
				image2_alignClasses: [ 'l', 'c', 'r' ]
			}
		}
	};

	bender.editorsConfig = {
		allowedContent: true,
		autoParagraph: false,
		language: 'en'
	};

	bender.test( {
		'test non-captioned: center unaligned image': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.image,
				data: { align: 'center' },
				assertCreated: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				assertNewData: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				dom: doms.imageCentered
			} );
		},

		'test non-captioned: center floated image': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.imageAlignedRight,
				data: { align: 'center' },
				assertCreated: assertWrapperAlignFloat( 'right', 'Widget\'s wrapper has float.' ),
				assertNewData: assertWrapperAlignFloat( '', 'Widget\'s wrapper has float.' ),
				dom: doms.imageCentered
			} );
		},

		'test non-captioned: float centered image': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.imageCentered,
				data: { align: 'right' },
				assertCreated: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				assertNewData: assertWrapperAlignFloat( 'right', 'Widget\'s wrapper has float.' ),
				dom: doms.image
			} );
		},

		'test non-captioned: remove align of centered image': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.imageCentered,
				data: { align: 'none' },
				assertCreated: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				assertNewData: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				dom: doms.image
			} );
		},

		'test non-captioned: remove align of floated image': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.imageAlignedLeft,
				data: { align: 'none' },
				assertCreated: assertWrapperAlignFloat( 'left', 'Widget\'s wrapper has float.' ),
				assertNewData: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				dom: doms.image
			} );
		},

		'test captioned: center unaligned figure': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.captioned,
				data: { align: 'center' },
				assertCreated: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				assertNewData: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				dom: doms.captionedCentered
			} );
		},

		'test captioned: center floated figure': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.captionedAlignLeft,
				data: { align: 'center' },
				assertCreated: assertWrapperAlignFloat( 'left', 'Widget\'s wrapper has float.' ),
				assertNewData: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				dom: doms.captionedCentered
			} );
		},

		'test captioned: float centered figure': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.captionedCentered,
				data: { align: 'right' },
				assertCreated: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				assertNewData: assertWrapperAlignFloat( 'right', 'Widget\'s wrapper has float.' ),
				dom: doms.captioned
			} );
		},

		'test captioned: remove align of centered figure': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.captionedCentered,
				data: { align: 'none' },
				assertCreated: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				assertNewData: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				dom: doms.captioned
			} );
		},

		'test captioned: remove align of floated figure': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.captionedAlignLeft,
				data: { align: 'none' },
				assertCreated: assertWrapperAlignFloat( 'left', 'Widget\'s wrapper has float.' ),
				assertNewData: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				dom: doms.captioned
			} );
		},

		// Transitions ------------------------------------------------

		'test transition: center, add caption to unaligned image': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.image,
				data: { align: 'center', hasCaption: true },
				assertCreated: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				assertNewData: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				dom: doms.captionedCentered
			} );
		},

		'test transition: remove align and caption of centered figure': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.captionedCentered,
				data: { align: 'none', hasCaption: false },
				assertCreated: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				assertNewData: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				dom: doms.image
			} );
		},

		'test transition: remove caption of centered figure': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.captionedCentered,
				data: { hasCaption: false },
				assertCreated: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				assertNewData: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				dom: doms.imageCentered
			} );
		},

		'test transition: add caption to centered image': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.imageCentered,
				data: { hasCaption: true },
				assertCreated: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				assertNewData: assertWrapperAlignFloat( '', 'Widget\'s wrapper has no float.' ),
				dom: doms.captionedCentered
			} );
		},

		'test transition: add caption to floated image': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.imageAlignedLeft,
				data: { hasCaption: true },
				assertCreated: assertWrapperAlignFloat( 'left', 'Widget\'s wrapper has float.' ),
				assertNewData: assertWrapperAlignFloat( 'left', 'Widget\'s wrapper has float.' ),
				dom: doms.captioned
			} );
		},

		// Block wrapping ------------------------------------------------

		'test block wrapping: wrap widget in a block when it becomes inline (caption lost)': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.captionedAlignLeft,
				data: { hasCaption: false },
				dom: new RegExp(
					'<p>' +
						'<img alt="" data-cke-saved-src="_assets/foo.png" id="x" src="_assets/foo.png" />' +
					'</p>' )
			} );
		},

		'test block wrapping: wrap widget in a block when it becomes inline (align lost)': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.imageCentered,
				data: { align: 'none' },
				dom: new RegExp(
					'<p>' +
						'<img alt="" data-cke-saved-src="_assets/foo.png" id="x" src="_assets/foo.png" />' +
					'</p>' )
			} );
		},

		'test block wrapping: wrap widget in a block when it becomes inline (caption and align lost)': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.captionedAlignLeft,
				data: {
					hasCaption: false,
					align: 'none'
				},
				dom: new RegExp(
					'<p>' +
						'<img alt="" data-cke-saved-src="_assets/foo.png" id="x" src="_assets/foo.png" />' +
					'</p>' )
			} );
		},

		'test block wrapping: de-wrap widget from block when it becomes a block (gets captioned)': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: htmls.image,
				data: { hasCaption: true },
				dom: doms.captioned
			} );
		},

		'test block wrapping: de-wrap widget from block when it becomes a block (gets captioned, siblings before)': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: '<p>xx' + htmls.image + '</p>',
				data: { hasCaption: true },
				dom: new RegExp(
					'<p>xx</p>' +
					'<figure class="image">' +
						'<span class="cke_image_resizer_wrapper">' +
							'<img alt="" data-cke-saved-src="_assets/foo.png" data-cke-widget-upcasted="1" id="x" src="_assets/foo.png" />' +
							'<span class="cke_image_resizer"></span>' +
						'</span>' +
						'<figcaption data-cke-display-name="caption" data-cke-filter="\\d+">caption</figcaption>' +
						'(<br(?: type="_moz")? />)?' +
					'</figure>' )
			} );
		},

		'test block wrapping: de-wrap widget from block when it becomes a block (gets captioned, siblings after)': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: '<p>' + htmls.image + 'xx</p>',
				data: { hasCaption: true },
				dom: new RegExp(
					'<figure class="image">' +
						'<span class="cke_image_resizer_wrapper">' +
							'<img alt="" data-cke-saved-src="_assets/foo.png" data-cke-widget-upcasted="1" id="x" src="_assets/foo.png" />' +
							'<span class="cke_image_resizer"></span>' +
						'</span>' +
						'<figcaption data-cke-display-name="caption" data-cke-filter="\\d+">caption</figcaption>' +
						'(<br(?: type="_moz")? />)?' +
					'</figure>' +
					'<p>xx</p>' )
			} );
		},

		'test block wrapping: de-wrap widget from block when it becomes a block (gets captioned, two siblings)': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: '<p>x' + htmls.image + 'x</p>',
				data: { hasCaption: true },
				dom: new RegExp(
					'<p>x(<br(?: type="_moz")? />)?</p>' +
					'<figure class="image">' +
						'<span class="cke_image_resizer_wrapper">' +
							'<img alt="" data-cke-saved-src="_assets/foo.png" data-cke-widget-upcasted="1" id="x" src="_assets/foo.png" />' +
							'<span class="cke_image_resizer"></span>' +
						'</span>' +
						'<figcaption data-cke-display-name="caption" data-cke-filter="\\d+">caption</figcaption>' +
						'(<br(?: type="_moz")? />)?' +
					'</figure>' +
					'<p>x</p>' )
			} );
		},

		'test block wrapping: de-wrap widget from block when it becomes a block (gets centered)': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: '<p>' + htmls.image + '</p>',
				data: { align: 'center' },
				dom: new RegExp(
					'<p style="text-align:center;">' +
						'<span class="cke_image_resizer_wrapper">' +
							'<img alt="" data-cke-saved-src="_assets/foo.png" data-cke-widget-upcasted="1" id="x" src="_assets/foo.png" />' +
							'<span class="cke_image_resizer"></span>' +
						'</span>' +
					'</p>'  )
			} );
		},

		'test block wrapping: de-wrap widget from block when it becomes a block (gets centered, siblings before)': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: '<p>xx' + htmls.image + '</p>',
				data: { align: 'center' },
				dom: new RegExp(
					'<p>xx</p>' +
					'<p style="text-align:center;">' +
						'<span class="cke_image_resizer_wrapper">' +
							'<img alt="" data-cke-saved-src="_assets/foo.png" data-cke-widget-upcasted="1" id="x" src="_assets/foo.png" />' +
							'<span class="cke_image_resizer"></span>' +
						'</span>' +
					'</p>'  )
			} );
		},

		'test block wrapping: de-wrap widget from block when it becomes a block (gets centered, siblings after)': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: '<p>' + htmls.image + 'xx</p>',
				data: { align: 'center' },
				dom: new RegExp(
					'<p style="text-align:center;">' +
						'<span class="cke_image_resizer_wrapper">' +
							'<img alt="" data-cke-saved-src="_assets/foo.png" data-cke-widget-upcasted="1" id="x" src="_assets/foo.png" />' +
							'<span class="cke_image_resizer"></span>' +
						'</span>' +
					'</p>' +
					'<p>xx</p>' )
			} );
		},

		'test block wrapping: de-wrap widget from block when it becomes a block (gets centered, two siblings)': function() {
			assertWidget( {
				bot: this.editorBots.alignInline,
				html: '<p>x' + htmls.image + 'x</p>',
				data: { align: 'center' },
				dom: new RegExp(
					'<p>x(<br(?: type="_moz")? />)?</p>' +
					'<p style="text-align:center;">' +
						'<span class="cke_image_resizer_wrapper">' +
							'<img alt="" data-cke-saved-src="_assets/foo.png" data-cke-widget-upcasted="1" id="x" src="_assets/foo.png" />' +
							'<span class="cke_image_resizer"></span>' +
						'</span>' +
					'</p>' +
					'<p>x</p>' )
			} );
		},

		// AlignClasses ------------------------------------------------

		'test non-captioned (alignClasses): center unaligned image': function() {
			assertWidget( {
				bot: this.editorBots.alignClasses,
				html: htmls.image,
				data: { align: 'center' },
				assertCreated: assertWrapperAlignClasses( null ),
				assertNewData: assertWrapperAlignClasses( 'c', true ),
				dom: doms.image
			} );
		},

		'test non-captioned (alignClasses): center aligned image': function() {
			assertWidget( {
				bot: this.editorBots.alignClasses,
				html: htmls.imageAlignedClassLeft,
				data: { align: 'center' },
				assertCreated: assertWrapperAlignClasses( 'l' ),
				assertNewData: assertWrapperAlignClasses( 'c', true ),
				dom: doms.imageCentered
			} );
		},

		'test non-captioned (alignClasses): align centered image': function() {
			assertWidget( {
				bot: this.editorBots.alignClasses,
				html: htmls.imageCenteredClass,
				data: { align: 'right' },
				assertCreated: assertWrapperAlignClasses( 'c', true ),
				assertNewData: assertWrapperAlignClasses( 'r' ),
				dom: doms.image
			} );
		},

		'test non-captioned (alignClasses): remove align of centered image': function() {
			assertWidget( {
				bot: this.editorBots.alignClasses,
				html: htmls.imageCenteredClass,
				data: { align: 'none' },
				assertCreated: assertWrapperAlignClasses( 'c', true ),
				assertNewData: assertWrapperAlignClasses( null ),
				dom: doms.image
			} );
		},

		'test non-captioned (alignClasses): remove align of aligned image': function() {
			assertWidget( {
				bot: this.editorBots.alignClasses,
				html: htmls.imageAlignedClassRight,
				data: { align: 'none' },
				assertCreated: assertWrapperAlignClasses( 'r' ),
				assertNewData: assertWrapperAlignClasses( null ),
				dom: doms.image
			} );
		},

		'test captioned (alignClasses): center unaligned figure': function() {
			assertWidget( {
				bot: this.editorBots.alignClasses,
				html: htmls.captioned,
				data: { align: 'center' },
				assertCreated: assertWrapperAlignClasses( null ),
				assertNewData: assertWrapperAlignClasses( 'c' ),
				dom: doms.captionedCentered
			} );
		},

		'test captioned (alignClasses): center aligned figure': function() {
			assertWidget( {
				bot: this.editorBots.alignClasses,
				html: htmls.captionedAlignedClassLeft,
				data: { align: 'center' },
				assertCreated: assertWrapperAlignClasses( 'l' ),
				assertNewData: assertWrapperAlignClasses( 'c' ),
				dom: doms.captionedCentered
			} );
		},

		'test captioned (alignClasses): align centered figure': function() {
			assertWidget( {
				bot: this.editorBots.alignClasses,
				html: htmls.captionedCenteredClass,
				data: { align: 'right' },
				assertCreated: assertWrapperAlignClasses( 'c' ),
				assertNewData: assertWrapperAlignClasses( 'r' ),
				dom: doms.captioned
			} );
		},

		'test captioned (alignClasses): remove align of centered figure': function() {
			assertWidget( {
				bot: this.editorBots.alignClasses,
				html: htmls.captionedCenteredClass,
				data: { align: 'none' },
				assertCreated: assertWrapperAlignClasses( 'c' ),
				assertNewData: assertWrapperAlignClasses( null ),
				dom: doms.captioned
			} );
		},

		'test captioned (alignClasses): remove align of aligned figure': function() {
			assertWidget( {
				bot: this.editorBots.alignClasses,
				html: htmls.captionedAlignedClassRight,
				data: { align: 'none' },
				assertCreated: assertWrapperAlignClasses( 'r' ),
				assertNewData: assertWrapperAlignClasses( null ),
				dom: doms.captioned
			} );
		}
	} );
} )();
