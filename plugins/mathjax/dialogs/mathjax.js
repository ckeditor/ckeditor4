/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.dialog.add( 'mathjax', function( editor ) {

	var preview,
		lang = editor.lang.mathjax;

	return {
		title: lang.title,
		minWidth: 350,
		minHeight: 100,
		contents: [
			{
				id: 'info',
				elements: [
					{
						id: 'equation',
						type: 'textarea',
						label: lang.dialogInput,

						onLoad: function( widget ) {
							var that = this;

							if ( !( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) ) {
								this.getInputElement().on( 'keyup', function() {
									// Add \( and \) for preview.
									preview.setValue( '\\(' + that.getInputElement().getValue() + '\\)' );
								} );
							}
						},

						setup: function( widget ) {
							// Remove MathJax prefix and suffix (e.g. \( \) or \[ \])
							this.setValue( CKEDITOR.plugins.mathjax.trim( widget.data.math ) );
                            // Set equation_type based on equation
                            var equation_type = CKEDITOR.plugins.mathjax.get_equation_type(widget.data.math);
                            widget.setData('equation_type', equation_type);
						},

						commit: function( widget ) {
                            // Get value from equation_type box
                            var equation_type = this.getDialog().getContentElement('info', 'equation_type').getValue();

							// Add prefix and suffix to make TeX be parsed by MathJax by default.
                            if (equation_type == 'display') {
                                widget.setData('math', '\\[' + this.getValue() + '\\]');
                            } else {
                                // Default to inline
                                widget.setData( 'math', '\\(' + this.getValue() + '\\)' );
                            }

						}
					},
                    {
                        id: 'equation_type',
                        type: 'select',
                        label: 'Type of equation',
                        items: [
                            ['Inline equation', 'inline'],
                            ['Display equation', 'display']
                        ],
                        setup: function(widget) {
                            this.setValue(widget.data.equation_type);
                        },
                        commit: function(widget) {
                            widget.setData('equation_type', this.getValue());
                        }
                    },
					{
						id: 'documentation',
						type: 'html',
						html:
							'<div style="width:100%;text-align:right;margin:-8px 0 10px">' +
								'<a class="cke_mathjax_doc" href="' + lang.docUrl + '" target="_black" style="cursor:pointer;color:#00B2CE;text-decoration:underline">' +
									lang.docLabel +
								'</a>' +
							'</div>'
					},
					( !( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) ) && {
						id: 'preview',
						type: 'html',
						html:
							'<div style="width:100%;text-align:center;">' +
								'<iframe style="border:0;width:0;height:0;font-size:20px" scrolling="no" frameborder="0" allowTransparency="true" src="' + CKEDITOR.plugins.mathjax.fixSrc + '"></iframe>' +
							'</div>',

						onLoad: function( widget ) {
							var iFrame = CKEDITOR.document.getById( this.domId ).getChild( 0 );
							preview = new CKEDITOR.plugins.mathjax.frameWrapper( iFrame, editor );
						},

						setup: function( widget ) {
							preview.setValue( widget.data.math );
						}
					}
				]
			}
		]
	};
} );