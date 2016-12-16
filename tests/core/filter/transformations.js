/* bender-tags: editor,unit */
/* bender-ckeditor-remove-plugins: basicstyles,image,table,showborders,tabletools,fakeobjects,flash,forms,iframe,link,pagebreak */

( function() {
	'use strict';

	function assertToHtml( editor, input, html,  msg ) {
		assert[ typeof html == 'string' ? 'areSame' : 'isMatching' ]( html, bender.tools.compatHtml( editor.dataProcessor.toHtml( input ), 0, 1 ), msg + ' - toHtml' );
	}

	function assertToDF( editor, html, output, msg ) {
		assert[ typeof output == 'string' ? 'areSame' : 'isMatching' ]( output, bender.tools.compatHtml( editor.dataProcessor.toDataFormat( html ), 0, 1 ), msg + ' - toDF' );
	}

	bender.test( {
		'test size transformations': function() {
			bender.editorBot.create( {
				name: 'test_size_transformations'
			}, function( bot ) {
				var editor = bot.editor,
					filter = editor.filter;

				filter.addFeature( {
					// Filter accepts styles and attrs for table's size.
					allowedContent: 'img[width,height,alt,src,foo]; table{color,width,height}[width,height]; tr td tbody',
					contentTransformations: [
						[
							{
								check: 'img{width}',
								right: function( el, tools ) {
									tools.sizeToStyle( el );
								}
							},
							{
								check: 'img[width]',
								right: function( el, tools ) {
									tools.sizeToAttribute( el );
								}
							}
						],
						// All groups for img should be executed.
						[
							{
								check: 'img',
								right: function( el ) {
									el.attributes.foo = '1';
								}
							}
						],
						// Simplified format.
						[
							'table{width}: sizeToStyle',
							// Second rule shouldn't be executed if first was.
							'table[width]: sizeToAttribute'
						]
					]
				} );

				assertToHtml( editor,
					'<p><img alt="A" src="B" /></p>',
					'<p><img alt="A" data-cke-saved-src="B" foo="1" src="B" /></p>',
					'img 0' );
				assertToHtml( editor,
					'<p><img alt="A" height="10" src="B" width="50" /></p>',
					'<p><img alt="A" data-cke-saved-src="B" foo="1" height="10" src="B" width="50" /></p>',
					'img 1' );
				assertToHtml( editor,
					'<p><img alt="A" height="10" src="B" /></p>',
					'<p><img alt="A" data-cke-saved-src="B" foo="1" height="10" src="B" /></p>',
					'img 2' );
				// Do not overwrite attribute.
				assertToHtml( editor,
					'<p><img alt="A" height="10" src="B" style="height:20px" /></p>',
					'<p><img alt="A" data-cke-saved-src="B" foo="1" height="10" src="B" /></p>',
					'img 3' );
				// Only px values are valid.
				assertToHtml( editor,
					'<p><img alt="A" src="B" style="height:20em; width:50%" /></p>',
					'<p><img alt="A" data-cke-saved-src="B" foo="1" src="B" /></p>',
					'img 4' );
				assertToHtml( editor,
					'<p><img alt="A" src="B" style="height:20px; width:50px" /></p>',
					'<p><img alt="A" data-cke-saved-src="B" foo="1" height="20" src="B" width="50" /></p>',
					'img 5' );
				assertToHtml( editor,
					'<p><img alt="A" src="B" style="width:50px" /></p>',
					'<p><img alt="A" data-cke-saved-src="B" foo="1" src="B" width="50" /></p>',
					'img 6' );
				assertToHtml( editor,
					'<p><img alt="A" src="B" style="width:50.5px" /></p>',
					'<p><img alt="A" data-cke-saved-src="B" foo="1" src="B" width="50" /></p>',
					'img 7' );
				assertToDF( editor,
					'<p><img alt="A" data-cke-saved-src="B" src="B" style="height:20px; width:50px" /></p>',
					'<p><img alt="A" foo="1" height="20" src="B" width="50" /></p>',
					'img 8' );

				assertToHtml( editor,
					'<table><tbody><tr><td>A</td></tr></tbody></table>',
					'<table><tbody><tr><td>A</td></tr></tbody></table>',
					'table 0' );
				assertToHtml( editor,
					'<table style="height:200px; width:50%"><tbody><tr><td>A</td></tr></tbody></table>',
					'<table style="height:200px; width:50%"><tbody><tr><td>A</td></tr></tbody></table>',
					'table 1' );
				assertToHtml( editor,
					'<table style="width:50%" width="20"><tbody><tr><td>A</td></tr></tbody></table>',
					'<table style="width:50%"><tbody><tr><td>A</td></tr></tbody></table>',
					'table 2' );
				assertToHtml( editor,
					'<table style="width:50%"><tbody><tr><td>A</td></tr></tbody></table>',
					'<table style="width:50%"><tbody><tr><td>A</td></tr></tbody></table>',
					'table 3' );
				assertToHtml( editor,
					'<table height="20" width="50"><tbody><tr><td>A</td></tr></tbody></table>',
					'<table style="height:20px; width:50px"><tbody><tr><td>A</td></tr></tbody></table>',
					'table 4' );
				// Percantage width/height isn't valid, but it's supported by browsers.
				assertToHtml( editor,
					'<table width="50%"><tbody><tr><td>A</td></tr></tbody></table>',
					'<table style="width:50%"><tbody><tr><td>A</td></tr></tbody></table>',
					'table 5' );
				assertToHtml( editor,
					'<table style="color:red" width="50"><tbody><tr><td>A</td></tr></tbody></table>',
					'<table style="color:red; width:50px"><tbody><tr><td>A</td></tr></tbody></table>',
					'table 6' );
				assertToDF( editor,
					'<table height="20" width="50"><tbody><tr><td>A</td></tr></tbody></table>',
					'<table style="height:20px; width:50px"><tbody><tr><td>A</td></tr></tbody></table>',
					'table 7' );
			} );
		},

		'test advanced transformations': function() {
			bender.editorBot.create( {
				name: 'test_advanced_transformations'
			}, function( bot ) {
				var editor = bot.editor,
					filter = editor.filter;

				filter.allow( 'b i s [*](*)' );

				filter.addTransformations( [
					// Group 1.
					[
						// Transformation 1.1.
						{
							element: 'b',
							left: function( el ) {
								return !!el.attributes.foo;
							},
							right: function( el ) {
								el.attributes.ok = '1';
							}
						},
						// Transformation 1.2.
						{
							element: 'b',
							left: function( el ) {
								return !!el.attributes.bar;
							},
							right: function( el ) {
								el.attributes.ok = '2';
							}
						}
					],
					// Group 2.
					[
						// Transformation 2.1.
						{
							left: new CKEDITOR.style( { element: 'i', attributes: { bar: '2' } } ),
							right: function( el ) {
								el.attributes.ok = '3';
							}
						}
					],
					// Group 3.
					[
						// Transformation 3.1.
						{
							left: new CKEDITOR.style( { element: 's', attributes: { 'class': 'xyz abc' } } ),
							right: function( el ) {
								el.attributes.ok = '4';
							}
						}
					]
				] );

				assertToHtml( editor,
					'<p><b>A</b> <b foo="1">B</b> <b bar="1">C</b> <b bar="1" foo="1">D</b></p>',
					'<p><b>A</b> <b foo="1" ok="1">B</b> <b bar="1" ok="2">C</b> <b bar="1" foo="1" ok="1">D</b></p>',
					'b' );

				assertToHtml( editor,
					'<p><i>A</i> <i bar="1">B</i> <i bar="2">C</i></p>',
					'<p><i>A</i> <i bar="1">B</i> <i bar="2" ok="3">C</i></p>',
					'i' );

				assertToHtml( editor,
					'<p><s>A</s> <s class="xyz">B</s> <s class="abc def xyz">C</s></p>',
					'<p><s>A</s> <s class="xyz">B</s> <s class="abc def xyz" ok="4">C</s></p>',
					's' );
			} );
		},

		'test form transformations': function() {
			bender.editorBot.create( {
				name: 'test_form_transformations'
			}, function( bot ) {
				var editor = bot.editor;

				editor.addFeature( {
					allowedContent: 'strong[foo]',
					contentForms: [
						'strong',
						'b',
						[ 'span', function( el ) {
							var fw = el.styles[ 'font-weight' ];
							return fw == 'bold' || +fw >= 700;
						} ]
					]
				} );

				var emStyle = new CKEDITOR.style( { element: 'span', attributes: { 'class': 'i' } } );
				editor.addFeature( {
					allowedContent: 'em',
					contentForms: [
						'em',
						emStyle
					]
				} );

				var sStyle = new CKEDITOR.style( { element: 's', attributes: { 'class': 'X', foo: '1' }, styles: { color: 'red' } } );
				editor.addFeature( {
					allowedContent: sStyle,
					contentForms: [
						sStyle,
						'sup'
					]
				} );

				// This will check if not understood forms
				// don't break filter.
				// xyz isn't allowed so filter will check sup+fn and it
				// shouldn't fail on that.
				editor.addFeature( {
					contentForms: [
						'xyz',
						[ 'sup', function() {} ]
					]
				} );

				assertToHtml( editor,
					'<p><strong>A</strong></p>',
					'<p><strong>A</strong></p>',
					'strong' );
				assertToHtml( editor,
					'<p><b>A</b> <b foo="1">B</b></p>',
					'<p><strong>A</strong> <strong foo="1">B</strong></p>',
					'b' );
				assertToHtml( editor,
					'<p><span style="font-weight:bold">A</span> <span style="font-weight:700" foo="1">B</span></p>',
					'<p><strong>A</strong> <strong foo="1">B</strong></p>',
					'span{font-weight:bold&700}' );
				assertToHtml( editor,
					'<p><span style="font-weight:normal">A</b></p>',
					'<p>A</p>',
					'span{font-weight:normal}' );
				assertToDF( editor,
					'<p><b>A</b> <b>B</b></p>',
					'<p><strong>A</strong> <strong>B</strong></p>',
					'b' );

				assertToHtml( editor,
					'<p><em>A</em></p>',
					'<p><em>A</em></p>',
					'em' );
				assertToHtml( editor,
					'<p><span class="i">A</span> <span class="xxx i">B</span></p>',
					'<p><em>A</em> <em>B</em></p>',
					'span(i)' );

				assertToHtml( editor,
					'<p><sup>A</sup></p>',
					'<p><s class="X" foo="1" style="color:red">A</s></p>',
					'sup' );
			} );
		},

		'test form transformations with custom config': function() {
			bender.editorBot.create( {
				name: 'test_form_transformations_custom_config',
				config: {
					allowedContent: 'p b em'
				}
			}, function( bot ) {
				var editor = bot.editor;

				editor.addFeature( {
					allowedContent: 'strong[foo]',
					contentForms: [
						'strong',
						'b',
						[ 'span', function( el ) {
							var fw = el.styles[ 'font-weight' ];
							return fw == 'bold' || +fw >= 700;
						} ]
					]
				} );

				var emStyle = new CKEDITOR.style( { element: 'span', attributes: { 'class': 'i' } } );
				editor.addFeature( {
					allowedContent: emStyle,
					contentForms: [
						emStyle,
						'em'
					]
				} );

				assertToHtml( editor,
					'<p><strong>A</strong></p>',
					'<p><b>A</b></p>',
					'strong' );
				assertToHtml( editor,
					'<p><b>A</b> <b foo="1">B</b></p>',
					'<p><b>A</b> <b>B</b></p>',
					'b' );
				assertToHtml( editor,
					'<p><span style="font-weight:bold">A</span> <span style="font-weight:700" foo="1">B</b></p>',
					'<p><b>A</b> <b>B</b></p>',
					'span{font-weight:bold&700}' );
				assertToHtml( editor,
					'<p><span style="font-weight:normal">A</span></p>',
					'<p>A</p>',
					'span{font-weight:normal}' );
				assertToHtml( editor,
					'<p><strong style="font-weight:bold">A</strong></p>',
					'<p><b>A</b></p>',
					'strong{font-weight:bold}' );
				assertToDF( editor,
					'<p><strong>A</strong> <strong>B</strong></p>',
					'<p><b>A</b> <b>B</b></p>',
					'strong' );

				assertToHtml( editor,
					'<p><span class="i">A</span></p>',
					'<p><em>A</em></p>',
					'em' );
				assertToHtml( editor,
					'<p><span class="i">A</span> <span class="xxx i">B</span></p>',
					'<p><em>A</em> <em>B</em></p>',
					'span(i)' );
			} );
		},

		'test alignment transformations': function() {
			bender.editorBot.create( {
				name: 'test_alignment_transformations',
				config: {
					allowedContent: 'h1{float}; h2[align]; h3[align]{float}; h4[*]{*}'
				}
			}, function( bot ) {
				var editor = bot.editor;

				editor.filter.addTransformations( [
					[ 'h1{float}: alignmentToStyle', 'h1[align]: alignmentToAttribute' ],
					[ 'h2{float}: alignmentToStyle', 'h2[align]: alignmentToAttribute' ],
					[ 'h3{float}: alignmentToStyle', 'h3[align]: alignmentToAttribute' ],
					[ 'h4{float}: alignmentToStyle', 'h4[align]: alignmentToAttribute' ]
				] );

				assertToHtml( editor, '<h1 style="float:left">A</h1>',	'<h1 style="float:left">A</h1>',	'h1 1' );
				assertToHtml( editor, '<h1 style="float:right">A</h1>',	'<h1 style="float:right">A</h1>',	'h1 2' );
				assertToHtml( editor, '<h1 style="float:none">A</h1>',	'<h1 style="float:none">A</h1>',	'h1 3' );
				assertToHtml( editor, '<h1 align="left">A</h1>',		'<h1 style="float:left">A</h1>',	'h1 4' );
				assertToHtml( editor, '<h1 align="right">A</h1>',		'<h1 style="float:right">A</h1>',	'h1 5' );
				assertToHtml( editor, '<h1 align="middle">A</h1>',		'<h1>A</h1>',						'h1 6' );
				assertToHtml( editor, '<h1 align="bottom">A</h1>',		'<h1>A</h1>',						'h1 7' );
				assertToHtml( editor, '<h1 align="left" style="float:right">A</h1>',
					'<h1 style="float:right">A</h1>',														'h1 8' );

				assertToHtml( editor, '<h2 style="float:left">A</h2>',	'<h2 align="left">A</h2>',			'h2 1' );
				assertToHtml( editor, '<h2 style="float:right">A</h2>',	'<h2 align="right">A</h2>',			'h2 2' );
				assertToHtml( editor, '<h2 style="float:none">A</h2>',	'<h2>A</h2>',						'h2 3' );
				assertToHtml( editor, '<h2 align="left">A</h2>',		'<h2 align="left">A</h2>',			'h2 4' );
				assertToHtml( editor, '<h2 align="right">A</h2>',		'<h2 align="right">A</h2>',			'h2 5' );
				// FF converts align=middle to center.
				assertToHtml( editor, '<h2 align="middle">A</h2>',
					/<h2 align="(middle|center)">A<\/h2>/,													'h2 6' );
				assertToHtml( editor, '<h2 align="bottom">A</h2>',		'<h2 align="bottom">A</h2>',		'h2 7' );
				assertToHtml( editor, '<h2 align="left" style="float:right">A</h2>',
					'<h2 align="left">A</h2>',																'h2 8' );

				assertToHtml( editor, '<h3 style="float:left">A</h3>',	'<h3 style="float:left">A</h3>',	'h3 1' );
				assertToHtml( editor, '<h3 align="left">A</h3>',		'<h3 style="float:left">A</h3>',	'h3 2' );
				assertToHtml( editor, '<h3 align="left" style="float:right">A</h3>',
					'<h3 style="float:right">A</h3>',														'h3 3' );

				assertToHtml( editor, '<h4 style="float:left">A</h4>',	'<h4 style="float:left">A</h4>',	'h4 1' );
				assertToHtml( editor, '<h4 align="left">A</h4>',		'<h4 style="float:left">A</h4>',	'h4 2' );
				assertToHtml( editor, '<h4 align="left" style="float:right">A</h4>',
					'<h4 style="float:right">A</h4>',														'h4 3' );
			} );
		}
	} );
} )();