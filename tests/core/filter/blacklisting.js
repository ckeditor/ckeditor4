/* bender-tags: editor,unit */

( function() {
	'use strict';

	var createFilter = acfTestTools.createFilter;

	function ruleSortCompare( ruleA, ruleB ) {
		var elementsA = CKEDITOR.tools.objectKeys( ruleA.elements ).sort().join( ',' ),
			elementsB = CKEDITOR.tools.objectKeys( ruleB.elements ).sort().join( ',' );

		return elementsA == elementsB ? 0 :
			elementsA > elementsB ? 1 : -1;
	}

	function getSortedRules( rules ) {
		rules = rules.slice(); // Clone.
		rules.sort( ruleSortCompare );
		return rules;
	}

	bender.test( {
		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( {
				editor: {
					name: 'editor1'
				},
				editorCustomAllowedContent: {
					name: 'editor2',
					config: {
						allowedContent: 'p b i'
					}
				},
				editorDisallowedContent: {
					name: 'editor3',
					config: {
						extraPlugins: 'basicstyles,toolbar',
						disallowedContent: 'strong; *[bar]'
					}
				},
				editorBothContents: {
					name: 'editor4',
					config: {
						allowedContent: 'p strong em[foo]; h1 h2',
						disallowedContent: 'strong; *[bar]'
					}
				},
				editorTransformations: {
					name: 'editor5',
					config: {
						extraPlugins: 'basicstyles,image,toolbar',
						extraAllowedContent: 'b; img[width,height]',
						disallowedContent: 'strong; img{width,height}'
					}
				},
			}, function( editors, bots ) {
				that.editorBots = bots;
				that.editors = editors;
				that.callback();
			} );
		},

		'test default values - editor\'s filter': function() {
			var filter = this.editors.editor.filter;

			assert.isArray( filter.disallowedContent );
			assert.areSame( 0, filter.disallowedContent.length );
		},

		'test default values - standalone filter': function() {
			var filter = new CKEDITOR.filter( 'p' );

			assert.isArray( filter.disallowedContent );
			assert.areSame( 0, filter.disallowedContent.length );
		},

		'test config.disallowedContent': function() {
			var filter = this.editors.editorDisallowedContent.filter;

			assert.isFalse( filter.customConfig, 'customConfig' );
			assert.isArray( filter.disallowedContent );
			assert.areSame( 2, filter.disallowedContent.length );

			assert.isTrue( filter.check( 'em' ) );
			assert.isFalse( filter.check( 'strong' ), 'check disallowed content' );
		},

		'test config.disallowedContent & config.allowedContent': function() {
			var filter = this.editors.editorBothContents.filter;

			assert.isTrue( filter.customConfig, 'customConfig' );
			assert.isArray( filter.disallowedContent );
			assert.areSame( 2, filter.disallowedContent.length );

			assert.isTrue( filter.check( 'em[foo]' ) );
			assert.isFalse( filter.check( 'strong' ), 'check disallowed content' );
		},

		'test disallow() returns false if rules not defined': function() {
			var filter = new CKEDITOR.filter( 'p' );

			assert.isFalse( filter.disallow() );
			assert.isFalse( filter.disallow( null ) );
			assert.isFalse( filter.disallow( null, 1 ) );
		},

		'test disallow() aborts if filter disabled': function() {
			var filter = new CKEDITOR.filter( 'p' );

			filter.disable();

			assert.isFalse( filter.disallow( 'b' ) );
			assert.areSame( 0, filter.disallowedContent.length );
		},

		'test disallow() adds rule if editor has custom config': function() {
			var filter = new CKEDITOR.filter( this.editors.editorCustomAllowedContent );

			assert.isTrue( filter.disallow( 'b' ) );
			assert.areSame( 1, filter.disallowedContent.length );
		},

		'test disallow() clears check() cache': function() {
			var filter = new CKEDITOR.filter( 'p[foo,bar]' );

			assert.isTrue( filter.check( 'p[foo]' ), 'p[foo]' );

			filter.disallow( 'p[foo]' );
			assert.isFalse( filter.check( 'p[foo]' ), 'p[foo]' );
			assert.isTrue( filter.check( 'p[bar]' ), 'p[bar]' );
		},

		'test disallow() adds a string rule': function() {
			var filter = new CKEDITOR.filter( 'p' );

			filter.disallow( 'b; i[foo, on*]' );

			assert.areSame( 2, filter.disallowedContent.length );

			var rules = getSortedRules( filter.disallowedContent );
			assert.isTrue( !!rules[ 0 ].elements.b, '1st rule elements.b' );
			assert.isTrue( !!rules[ 1 ].elements.i, '2nd rule elements.i' );
			assert.isTrue( !!rules[ 1 ].attributes.foo, '2nd rule attributes.foo' );
			assert.isTrue( !!rules[ 1 ].attributes[ 'on*' ], '2nd rule attributes.on*' );
		},

		'test disallow() adds an object rule': function() {
			var filter = new CKEDITOR.filter( 'p' );

			filter.disallow( {
				b: true,
				i: { attributes: 'foo' }
			} );

			assert.areSame( 2, filter.disallowedContent.length );

			var rules = getSortedRules( filter.disallowedContent );
			assert.isTrue( !!rules[ 0 ].elements.b, '1st rule elements.b' );
			assert.isTrue( !!rules[ 1 ].elements.i, '2nd rule elements.i' );
		},

		'test addFeature() - config.disallowedContent - conflicting rule': function() {
			var editor = this.editors.editorDisallowedContent,
				filter = editor.filter,
				allowedContentLength = filter.allowedContent.length;

			var ret = filter.addFeature( {
				allowedContent: 'h1[bar]',
				requiredContent: 'h1[bar]'
			} );
			assert.isFalse( ret, 'feature cannot be enabled' );
			// This may look wrong, but there's no other way. We cannot check feature before
			// adding it, to know if it should be added, because it has to be added before checking...
			assert.areNotSame( allowedContentLength, filter.allowedContent.length, 'feature has been added' );
			// Disallowed content has a precedence over allowed content, so even though ACR has been added
			// it didn't change anything.
			assert.isFalse( filter.check( 'h1[bar]' ) );
		},

		'test addFeature() - config.disallowedContent - not conflicting rule': function() {
			var editor = this.editors.editorDisallowedContent,
				filter = editor.filter,
				allowedContentLength = filter.allowedContent.length;

			var ret = filter.addFeature( {
				allowedContent: 'h2',
				requiredContent: 'h2'
			} );
			assert.isTrue( ret, 'feature can be enabled' );
			assert.areNotSame( allowedContentLength, filter.allowedContent.length, 'feature has been added' );
		},

		'test addFeature() - config.allowedContent && config.disallowedContent - conflicting rule': function() {
			var editor = this.editors.editorBothContents,
				filter = editor.filter,
				allowedContentLength = filter.allowedContent.length;

			var ret = filter.addFeature( {
				allowedContent: 'h1[bar]',
				requiredContent: 'h1[bar]'
			} );
			assert.isFalse( ret, 'feature cannot be enabled' );
			// In this case feature has not been added because filter.customConfig is true.
			assert.areSame( allowedContentLength, filter.allowedContent.length, 'feature has not been added' );
		},

		'test addFeature() - config.allowedContent && config.disallowedContent - not conflicting rule': function() {
			var editor = this.editors.editorBothContents,
				filter = editor.filter,
				allowedContentLength = filter.allowedContent.length;

			var ret = filter.addFeature( {
				allowedContent: 'h2',
				requiredContent: 'h2'
			} );
			assert.isTrue( ret, 'feature can be enabled' );
			// In this case feature has not been added because filter.customConfig is true.
			assert.areSame( allowedContentLength, filter.allowedContent.length, 'feature has not been added' );
		},

		'test filtering - attributes': function() {
			var filter = createFilter( 'p; i b[bar,foo]' );

			filter.disallow( 'b[foo,barxxx]' );

			filter( '<p><i bar="1" foo="1">A</i> <b>B</b></p>',			'<p><i bar="1" foo="1">A</i> <b>B</b></p>' );
			filter( '<p><i xxx="1">A</i></p>',							'<p><i>A</i></p>' );
			filter( '<p><b bar="1" barxxx="1" foo="1">A</b></p>',		'<p><b bar="1">A</b></p>' );
		},

		'test filtering - attributes with wildcards': function() {
			var filter = createFilter( 'p; i[*]; b[bar-*,foo-*]' );

			filter.disallow( 'i[on*]; b[bar-*,foo-x*,foo-a]' );

			filter( '<p><i a="1" b="1" bonb="1">A</i></p>',				'<p><i a="1" b="1" bonb="1">A</i></p>' );
			filter( '<p><i on="1" ona="1" onfoo="1">A</i></p>',			'<p><i>A</i></p>' );
			filter( '<p><b foo-a="1" foo-b="1" foo-xxx="1">A</b></p>',	'<p><b foo-b="1">A</b></p>' );
			filter( '<p><b bar-a="1" bar-bar="1">A</b></p>',			'<p><b>A</b></p>' );
			// #11780
			filter( '<p><i onx="1" data-x="1">A</i></p>',				'<p><i data-x="1">A</i></p>' );
		},

		'test filtering - required attributes': function() {
			var filter = createFilter( 'p; i b[!bar,foo]' );

			filter.disallow( 'b[foo]; i[bar]' );

			filter( '<p><i bar="1" foo="1">A</i></p>',					'<p>A</p>' );
			filter( '<p><b bar="1" foo="1">A</b></p>',					'<p><b bar="1">A</b></p>' );
		},

		'test filtering - attributes - no conflict with classes and styles': function() {
			var filter = createFilter( 'p; b[bar,foo]' );

			filter.disallow( 'b(bar,foo){*}[yyy]' );

			filter( '<p><b bar="1" foo="1" xxx="1">A</b></p>',			'<p><b bar="1" foo="1">A</b></p>' );
		},

		'test filtering - attributes - allow&disallow all': function() {
			var filter = createFilter( 'p; b[*]{*}(*)' );

			filter.disallow( 'b[*]' );

			filter( '<p><b bar="1" foo="1" xxx="1">A</b></p>',			'<p><b>A</b></p>' );
			filter( '<p><b class="foo" style="bar:1">A</b></p>',		'<p><b class="foo" style="bar:1">A</b></p>' );
		},

		'test filtering - attributes - match': function() {
			var filter = createFilter( 'p; b[bar,foo]' );

			// Remove bar attribute from <b> elements with foo attribute.
			filter.disallow( {
				b: {
					match: function( el ) {
						return !!el.attributes.foo;
					},
					attributes: 'bar'
				}
			} );

			filter( '<p><b bar="1">A</b> <b foo="1">B</b></p>',			'<p><b bar="1">A</b> <b foo="1">B</b></p>' );
			filter( '<p><b bar="1" foo="1">B</b></p>',					'<p><b foo="1">B</b></p>' );
		},

		'test filtering - classes': function() {
			var filter = createFilter( 'p; i b(bar,foo)' );

			filter.disallow( 'b(foo,barxxx)' );

			filter( '<p><i class="bar foo">A</i> <b>B</b></p>',			'<p><i class="bar foo">A</i> <b>B</b></p>' );
			filter( '<p><i class="xxx">A</i></p>',						'<p><i>A</i></p>' );
			filter( '<p><b class="bar barxxx foo">A</b></p>',			'<p><b class="bar">A</b></p>' );
		},

		'test filtering - classes with wildcards': function() {
			var filter = createFilter( 'p; i(*); b(bar-*,foo-*)' );

			filter.disallow( 'i(on*); b(bar-*,foo-x*,foo-a)' );

			filter( '<p><i class="a b bonb">A</i></p>',					'<p><i class="a b bonb">A</i></p>' );
			filter( '<p><i class="on ona onfoo">A</i></p>',				'<p><i>A</i></p>' );
			filter( '<p><b class="foo-a foo-b foo-xxx">A</b></p>',		'<p><b class="foo-b">A</b></p>' );
			filter( '<p><b class="bar-a bar-bar">A</b></p>',			'<p><b>A</b></p>' );
			// #11780
			filter( '<p><i class="onx data-x">A</i></p>',				'<p><i class="data-x">A</i></p>' );
		},

		'test filtering - required classes': function() {
			var filter = createFilter( 'p; i b(!bar,foo)' );

			filter.disallow( 'b(foo); i(bar)' );

			filter( '<p><i class="bar foo">A</i></p>',					'<p>A</p>' );
			filter( '<p><b class="bar foo">A</b></p>',					'<p><b class="bar">A</b></p>' );
		},

		'test filtering - styles': function() {
			var filter = createFilter( 'p; i b{bar,foo}' );

			filter.disallow( 'b{foo,barxxx}' );

			filter( '<p><i style="bar:1; foo:1">A</i> <b>B</b></p>',	'<p><i style="bar:1; foo:1">A</i> <b>B</b></p>' );
			filter( '<p><i style="xxx:1">A</i></p>',					'<p><i>A</i></p>' );
			filter( '<p><b style="bar:1; barxxx:1; foo:1">A</b></p>',	'<p><b style="bar:1">A</b></p>' );
		},

		'test filtering - styles with wildcards': function() {
			var filter = createFilter( 'p; i{*}; b{bar-*,foo-*}' );

			filter.disallow( 'i{on*}; b{bar-*,foo-x*,foo-a}' );

			filter( '<p><i style="a:1; b:1; bonb:1">A</i></p>',			'<p><i style="a:1; b:1; bonb:1">A</i></p>' );
			filter( '<p><i style="on:1; ona:1; onfoo:1">A</i></p>',		'<p><i>A</i></p>' );
			filter( '<p><b style="foo-a:1; foo-b:1; foo-xxx:1">A</b></p>',
				'<p><b style="foo-b:1">A</b></p>' );
			filter( '<p><b style="bar-a:1; bar-bar:1">A</b></p>',		'<p><b>A</b></p>' );
			// #11780
			filter( '<p><i style="onx:1; data-x:1">A</i></p>',			'<p><i style="data-x:1">A</i></p>' );
		},

		'test filtering - required styles': function() {
			var filter = createFilter( 'p; i b{!bar,foo}' );

			filter.disallow( 'b{foo}; i{bar}' );

			filter( '<p><i style="bar:1; foo:1">A</i></p>',					'<p>A</p>' );
			filter( '<p><b style="bar:1; foo:1">A</b></p>',					'<p><b style="bar:1">A</b></p>' );
		},

		'test filtering - match all elements': function() {
			var filter = createFilter( 'p; i b[bar,foo]; h1[bar]' );

			filter.disallow( '*[bar]' );

			filter( '<p><b bar="1" foo="1">A</b></p>',					'<p><b foo="1">A</b></p>' );
			filter( '<p><i bar="1" foo="1">A</i></p>',					'<p><i foo="1">A</i></p>' );
			filter( '<h1 bar="1">A</h1>',								'<h1>A</h1>' );
		},

		'test filtering - elements': function() {
			var filter = createFilter( 'p; i b; b[foo]; *[bar]' );

			filter.disallow( 'b u; i[bar]' );

			filter( '<p><i bar="1">A</i></p>',							'<p><i>A</i></p>' );
			filter( '<p><b>A</b></p>',									'<p>A</p>' );
			filter( '<p><b bar="1" foo="1">A</b></p>',					'<p>A</p>' );
		},

		'test filtering - elements - match': function() {
			var filter = createFilter( 'p; b[bar,foo]' );

			// Disallow only <b> elements with bar attribute.
			filter.disallow( {
				b: function( el ) {
					return !!el.attributes.bar;
				}
			} );

			filter( '<p><b>A</b> <b foo="1">B</b></p>',					'<p><b>A</b> <b foo="1">B</b></p>' );
			filter( '<p><b bar="1">A</b> <b bar="1" foo="1">B</b></p>',	'<p>A B</p>' );
		},

		'test check() - cache busting by disllow()': function() {
			var filter = new CKEDITOR.filter( 'p b' );

			assert.isTrue( filter.check( 'b' ) );

			filter.disallow( 'b' );
			assert.isFalse( filter.check( 'b' ) );
		},

		'test check() - diallowing entire elements': function() {
			var filter = new CKEDITOR.filter( 'p b; i[foo]; b[bar]; u[foo]; *[bom]; u[!foo]' );

			filter.disallow( 'b u i; b[foo]' );

			assert.isFalse( filter.check( 'b' ), 'b' );
			assert.isFalse( filter.check( 'u' ), 'u' );
			assert.isFalse( filter.check( 'i' ), 'i' );
			assert.isFalse( filter.check( 'u', false, true ), 'u - strict check' );
		},

		'test check() - disallowing attributes': function() {
			var filter = new CKEDITOR.filter( 'p b[foo]; i[bar]; *[bom]; u[!bim]' );

			filter.disallow( 'b[foo]; u[bim]; i[bom]' );

			assert.isFalse( filter.check( 'u', false, true ), 'u - strict check' );
			assert.isFalse( filter.check( 'i[bom]' ), 'i[bom]' );
			assert.isFalse( filter.check( 'b[foo]' ), 'b[foo]' );

			assert.isTrue( filter.check( 'b' ), 'b' );
			assert.isTrue( filter.check( 'i[bar]' ), 'i[bar]' );
		},

		'test check() - disallowing attributes - wildcards': function() {
			var filter = new CKEDITOR.filter( 'p b[foo]; i[*]; u[bim-*]' );

			filter.disallow( 'b[*]; u[bim-foo-*]; i[bom-*]' );

			assert.isFalse( filter.check( 'b[foo]' ), 'b[foo]' );
			assert.isFalse( filter.check( 'i[bom-x]' ), 'i[bom-x]' );
			assert.isFalse( filter.check( 'u[bim-foo-x]' ), 'u[bim-foo-x]' );

			assert.isTrue( filter.check( 'i[bom,bar]' ), 'i[bom,bar]' );
			assert.isTrue( filter.check( 'b' ), 'b' );
			assert.isTrue( filter.check( 'u[bim-x]' ), 'u[bim-x]' );
		},

		'test check() - disallowing styles': function() {
			var filter = new CKEDITOR.filter( 'p b{foo}; i{bar}; *{bom}; u{!bim}' );

			filter.disallow( 'b{foo}; u{bim}; i{bom}' );

			assert.isFalse( filter.check( 'u', false, true ), 'u - strict check' );
			assert.isFalse( filter.check( 'i{bom}' ), 'i{bom}' );
			assert.isFalse( filter.check( 'b{foo}' ), 'b{foo}' );

			assert.isTrue( filter.check( 'b' ), 'b' );
			assert.isTrue( filter.check( 'i{bar}' ), 'i{bar}' );
		},

		'test check() - disallowing classes': function() {
			var filter = new CKEDITOR.filter( 'p b(foo); i(bar); *(bom); u(!bim)' );

			filter.disallow( 'b(foo); u(bim); i(bom)' );

			assert.isFalse( filter.check( 'u', false, true ), 'u - strict check' );
			assert.isFalse( filter.check( 'i(bom)' ), 'i(bom)' );
			assert.isFalse( filter.check( 'b(foo)' ), 'b(foo)' );

			assert.isTrue( filter.check( 'b' ), 'b' );
			assert.isTrue( filter.check( 'i(bar)' ), 'i(bar)' );
		},

		'test transformations - content forms': function() {
			var bot = this.editorBots.editorTransformations;

			bot.setData( '<p><b>foo</b> <strong>bar</strong></p>', function() {
				assert.areSame( '<p><b>foo</b> <b>bar</b></p>', bot.getData() );
			} );
		},

		'test transformations - attributes': function() {
			var bot = this.editorBots.editorTransformations;

			bot.setData( '<p><img alt="" src="../../_assets/img.gif" style="height:100px; width:50px" /></p>', function() {
				assert.areSame( '<p><img alt="" height="100" src="../../_assets/img.gif" width="50" /></p>', bot.getData( true ) );
			} );
		}
	} );
} )();