/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget,elementspath */
/* bender-include: ../elementspath/_helpers/tools.js */
/* global elementspathTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	// IE other than 10 has an issue on performing multiple tests here (can not fetch widget properly later on).
	var ignoreTests = CKEDITOR.env.ie && CKEDITOR.env.version < 10;

	bender.test( {
		// Assertion picked from elementspathTestsTools.
		assertPath: elementspathTestsTools.assertPath,

		setUp: function() {
			this.mockupWidgetDefinition = {
				editables: {
					header: {
						selector: '.mockup_header',
						allowedContent: 'span[id]'
					},
					content: {
						selector: '.mockup_content',
						allowedContent: 'strong[id]'
					}
				},
				// Template contains extra ul li div elements to make sure that they are stripped from path.
				template: '<div>' +
					'<h2 class="mockup_header">fooo</h2>' +
					'<ul>' +
						'<li>' +
							'<div>' +
								'<p class="mockup_content"></p>' +
							'</div>' +
						'</li>' +
					'</ul>' +
				'</div>',

				upcast: function( element ) {
					return element.name == 'div' && element.hasClass( 'mockup_widget' );
				}
			};
		},

		_should: {
			ignore: {
				'test widgets wrapper default name': ignoreTests,
				'test widget editable path name overriding': ignoreTests,
				'test widget path name overriding': ignoreTests
			}
		},

		// Note that function registers 'mockupWidget' using this.mockupWidgetDefinition property.
		// @param {String} sourceTextareaId Id of textarea which contents will be placed into editor.
		// @param {String} selectElementId Id of element which should be selected.
		// @param {String} expectedElementsPath Expected elements path as string i.e. 'p,strong,span'
		// (excludding body).
		__testMockupWidgetPath: function( sourceTextareaId, selectElementId, expectedElementsPath ) {
			var editor = this.editor,
				that = this;

			editor.widgets.add( 'mockupWidget', this.mockupWidgetDefinition );

			this.editorBot.setData( bender.tools.getValueAsHtml( sourceTextareaId ), function() {
				var headerSpan = editor.document.getById( selectElementId );
				// Puts selection on span element.
				editor.getSelection().selectElement( headerSpan );
				that.assertPath( expectedElementsPath );
			} );
		},

		'test widget path without overriding': function() {
			this.__testMockupWidgetPath( 'editorContent', 'headerspan', 'div,h2,span' );
		},

		'test widget path name overriding': function() {
			// When pathName for widgets definition is changed, it should be displayed in
			// elementspath instead of template root element (which is div).
			this.mockupWidgetDefinition.pathName = 'customWIDGETname';
			this.__testMockupWidgetPath( 'editorContent', 'headerspan', 'customWIDGETname,h2,span' );
		},

		'test widget editable path name overriding': function() {
			// When pathName for content editables definition is changed, it should be
			// displayed instead of contents editable root element (which is p).
			this.mockupWidgetDefinition.editables.content.pathName = 'customWIDGETname';
			this.__testMockupWidgetPath( 'editorContent', 'contentstrong', 'div,customWIDGETname,strong' );
		},

		'test widgets wrapper default name': function() {
			// As a default, widgets main element name should be shown in elements
			// path, rather than wrapper name.
			var dtdFixtureNeeded = !CKEDITOR.dtd.$editable.dd;

			if ( dtdFixtureNeeded )
				// Adding dd to editable, otherwise it would not be applied.
				CKEDITOR.dtd.$editable.dd = 1;

			// In this case we will use diffrent mockup widget definition.
			this.mockupWidgetDefinition = {
				editables: {
					description: {
						selector: 'dd',
						allowedContent: 'span[id]'
					}
				},
				upcast: function( element ) {
					return element.name == 'dl';
				},
				template: '<dl class="mockup_widget">' +
					'<dt>Sample Topic</dt>' +
					'<dd></dd>' +
				'</dl>'
			};

			this.__testMockupWidgetPath( 'editorContent2', 'dt_mockup_descr_span', 'dl,dd,span' );

			if ( dtdFixtureNeeded )
				delete CKEDITOR.dtd.$editable.dd;
		}

	} );
} )();