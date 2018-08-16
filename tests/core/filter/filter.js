/* bender-tags: editor */
/* global acfTestTools */

( function() {
	'use strict';

	var createFilter = acfTestTools.createFilter,
		st = acfTestTools.st,
		createFilterTester = acfTestTools.createFilterTester;


	bender.editors = {
		themed: {
			name: 'test_editor_themed',
			config: {
				allowedContent: 'h1 b blockquote',
				protectedSource: [ ( /<\?[\s\S]*?\?>/g ) ]
			}
		},
		inline_h1: {
			creator: 'inline',
			name: 'test_editor_inline_h1',
			config: {
				plugins: 'table,basicstyles,toolbar'
			}
		},
		themed_ul: {
			name: 'test_editor_themed_ul',
			config: {
				plugins: 'basicstyles,list,toolbar',
				removeButtons: 'NumberedList'
			}
		},
		themed_table: {
			name: 'test_editor_themed_table',
			config: {
				allowedContent: 'table tr td',
				removePlugins: 'tabletools,table,showborders'
			}
		},
		themed_brmode: {
			name: 'test_editor_themed_brmode',
			config: {
				enterMode: CKEDITOR.ENTER_BR,
				plugins: 'basicstyles,toolbar',
				extraAllowedContent: 'blockquote'
			}
		},
		themed_divmode: {
			name: 'test_editor_themed_divmode',
			config: {
				enterMode: CKEDITOR.ENTER_DIV,
				plugins: 'basicstyles,toolbar',
				extraAllowedContent: 'blockquote'
			}
		},
		themed_cleanup: {
			name: 'test_editor_themed_cleanup',
			config: {
				allowedContent: 'p img b; a[name]',
				removePlugins: 'link,image'
			}
		},
		themed_protected: {
			name: 'test_editor_themed_protected',
			config: {
				plugins: 'basicstyles,toolbar',
				extraAllowedContent: 'script noscript',
				protectedSource: [ ( /<\?[\s\S]*?\?>/g ) ]
			}
		}
	};

	bender.test( {
		'test standalone filter': function() {
			var filter = new CKEDITOR.filter( 'p; div[title]' );

			// This property doesn't make sense for standalone filter, but let's be sure it's false.
			assert.isFalse( filter.customConfig );

			assert.areEqual( 2, filter.allowedContent.length );

			assert.isTrue( filter.allow( 'a' ), 'Rule added' );
			assert.areEqual( 3, filter.allowedContent.length );

			assert.isTrue( filter.allow( 'b', null, true ), 'Rule added in overwriteCustom mode' );
			assert.areEqual( 4, filter.allowedContent.length );
		},

		'test elements filter - string': function() {
			var filter = createFilter( 'p b i; ul li' );

			filter( '<p><b>foo</b> <i>bar</i> <u>bum</u></p>',			'<p><b>foo</b> <i>bar</i> bum</p>' );
			filter( '<ul><li>foo <b>bar</b></li></ul>',					'<ul><li>foo <b>bar</b></li></ul>' );
		},

		'test elements filter - object': function() {
			var filter = createFilter( {
				'p b i': true,
				'ul li': true
			} );

			filter( '<p><b>foo</b> <i>bar</i> <u>bum</u></p>',			'<p><b>foo</b> <i>bar</i> bum</p>' );
			filter( '<ul><li>foo <b>bar</b></li></ul>',					'<ul><li>foo <b>bar</b></li></ul>' );
		},

		'test elements filter - object with fns': function() {
			var filter = createFilter( {
				'p b i': function() {
					return true;
				},
				'ul li': function() {
					return false;
				}
			} );

			filter( '<p><b>foo</b> <i>bar</i> <u>bum</u></p>',			'<p><b>foo</b> <i>bar</i> bum</p>' );
			filter( '<ul><li>foo <b>bar</b></li></ul>',					'<p>foo <b>bar</b></p>' );
		},

		'test elements filter - object with unnamed rules': function() {
			var filter = createFilter( {
				'$1': {
					elements: 'p i'
				},
				'$2': {
					elements: [ 'ul', 'li' ]
				},
				'$3': {
					elements: { b: true }
				}
			} );

			filter( '<p><b>foo</b> <i>bar</i> <u>bum</u></p>',			'<p><b>foo</b> <i>bar</i> bum</p>' );
			filter( '<ul><li>foo <b>bar</b></li></ul>',					'<ul><li>foo <b>bar</b></li></ul>' );
		},

		'test elements filter - style': function() {
			var filter = createFilter( st( { element: 'b' } ) );

			filter( '<p><b>foo</b> <i>bar</i> <u>bum</u></p>',			'<p><b>foo</b> bar bum</p>' );

			filter.allow( [ st( { element: 'i' } ), st( { element: 'u' } ) ] );

			filter( '<p><b>foo</b> <i>bar</i> <u>bum</u></p>',			'<p><b>foo</b> <i>bar</i> <u>bum</u></p>' );
		},

		'test elements "*" filter - string': function() {
			var filter = createFilter( 'p div; *[title]' );

			filter( '<p title="a"><b title="c">foo</b></p>',			'<p title="a">foo</p>' );
			filter( '<div title="e" lang="pl">bar</div>',				'<div title="e">bar</div>' );
		},

		'test elements "*" filter - object': function() {
			var filter = createFilter( {
				'p div': true,
				'$0': {
					propertiesOnly: true,
					attributes: 'title'
				}
			} );

			filter( '<p title="a"><b title="c">foo</b></p>',			'<p title="a">foo</p>' );
			filter( '<div title="e" lang="pl">bar</div>',				'<div title="e">bar</div>' );
		},

		'test elements "*" filter 2 - object': function() {
			// This rule allows all elements, because it does not contain neither propertiesOnly nor elements.
			var filter = createFilter( {
				'$0': {
					attributes: 'title'
				}
			} );

			filter( '<p title="a"><b title="c">foo</b></p>',			'<p title="a"><b title="c">foo</b></p>' );
			filter( '<div title="e" lang="pl">bar</div>',				'<div title="e">bar</div>' );
		},

		'test elements "*" filter 2 - string': function() {
			var filter = createFilter( 'h1; *(red); b' );

			filter( '<h1 class="red">foo <b class="red">bar</b></h1>',	'<h1 class="red">foo <b class="red">bar</b></h1>' );
		},

		'test elements propertiesOnly filter - object': function() {
			var filter = createFilter( {
				'p b i': true,

				'$0': {
					match: function( el ) {
						return el.name == 'b';
					},
					propertiesOnly: true,
					attributes: 'foo'
				}
			} );

			filter( '<p><b foo="1" bar="2">A</b> <i foo="1" bar="2">B</i></p>',
				'<p><b foo="1">A</b> <i>B</i></p>' );
		},

		'test attributes filter - string': function() {
			var filter = createFilter( 'p[title,data-custom]; h1 [lang]' ); // Space after h1 is intentional.

			filter( '<p title="a" id="b" data-custom="c">foo</p>',		'<p data-custom="c" title="a">foo</p>' );
			filter( '<h1 title="a" id="b" lang="pl">foo</h1>',			'<h1 lang="pl">foo</h1>' );
		},

		'test attributes filter - string with wildcards': function() {
			var filter = createFilter( 'p[foo*bar,data-*]; h1[lang*]' );

			filter( '<p data-foo="b" data-x="a" boo="b">foo</p>',		'<p data-foo="b" data-x="a">foo</p>' );
			filter( '<p foobar="a" fooxbar="b" foo="c">foo</p>',		'<p foobar="a" fooxbar="b">foo</p>' );
			filter( '<h1 lang="pl" language="pl">foo</h1>',				'<h1 lang="pl" language="pl">foo</h1>' );
		},

		'test attributes filter - object': function() {
			var filter = createFilter( {
				p: { attributes: 'title,data-custom' },
				h1: { attributes: 'lang' }
			} );

			filter( '<p title="a" id="b" data-custom="c">foo</p>',		'<p data-custom="c" title="a">foo</p>' );
			filter( '<h1 title="a" id="b" lang="pl">foo</h1>',			'<h1 lang="pl">foo</h1>' );
		},

		'test attributes filter - object 2': function() {
			var filter = createFilter( {
				p: { attributes: [ 'title', 'data-custom' ] },
				h1: { attributes: [ 'lang' ] }
			} );

			filter( '<p title="a" id="b" data-custom="c">foo</p>',		'<p data-custom="c" title="a">foo</p>' );
			filter( '<h1 title="a" id="b" lang="pl">foo</h1>',			'<h1 lang="pl">foo</h1>' );
		},

		'test attributes filter - object with widlcards': function() {
			var filter = createFilter( {
				p: { attributes: 'foo*bar,data-*' },
				h1: { attributes: 'lang*' }
			} );

			filter( '<p data-foo="b" data-x="a" boo="b">foo</p>',		'<p data-foo="b" data-x="a">foo</p>' );
			filter( '<p foobar="a" fooxbar="b" foo="c">foo</p>',		'<p foobar="a" fooxbar="b">foo</p>' );
			filter( '<h1 lang="pl" language="pl">foo</h1>',				'<h1 lang="pl" language="pl">foo</h1>' );
		},

		'test attributes filter - style': function() {
			var filter = createFilter( [
				st( { element: 'p', attributes: { title: 'foo', 'data-custom': 'bar' } } ),
				st( { element: 'h1', attributes: { lang: 'pl' } } )
			] );

			filter( '<p title="a" id="b" data-custom="c">foo</p>',		'<p data-custom="c" title="a">foo</p>' );
			filter( '<h1 title="a" id="b" lang="pl">foo</h1>',			'<h1 lang="pl">foo</h1>' );
			filter( '<h1>foo</h1>',										'<p>foo</p>' ); // Attr lang is required.
		},

		'test classes filter - string': function() {
			var filter = createFilter( 'h1 p (a,B); h2' ); // Classes are case sensitive.

			filter( '<h1 class="a B b">foo</h1><p class="a c">bar</p>',	'<h1 class="B a">foo</h1><p class="a">bar</p>' );
			filter( '<h2 class="a b">foo</h2>',							'<h2>foo</h2>' );
		},

		'test classes filter - string with wildcards': function() {
			var filter = createFilter( 'h1 p (a*,*B); h2' ); // Classes are case sensitive.

			filter( '<h1 class="axy cb dB dx">foo</h1><p class="a c">bar</p>',
					'<h1 class="axy dB">foo</h1><p class="a">bar</p>' );
			filter( '<h2 class="a b">foo</h2>',							'<h2>foo</h2>' );
		},

		'test classes filter - object': function() {
			var filter = createFilter( {
				'h1 p': { classes: 'a,B' },
				h2: true
			} );

			filter( '<h1 class="a B b">foo</h1><p class="a c">bar</p>',	'<h1 class="B a">foo</h1><p class="a">bar</p>' );
			filter( '<h2 class="a b">foo</h2>',							'<h2>foo</h2>' );
		},

		'test classes filter - style': function() {
			var filter = createFilter( [
				st( { element: 'h1', attributes: { 'class': 'a B' } } ),
				st( { element: 'h2' } )
			] );

			filter( '<h1 class="a B b">foo</h1>',						'<h1 class="B a">foo</h1>' );
			filter( '<h1 class="a b">foo</h1>',							'<p>foo</p>' ); // All style's classes are required.
			filter( '<h2 class="a b">foo</h2>',							'<h2>foo</h2>' );
		},

		'test styles filter - string': function() {
			var filter = createFilter( 'h1 p{width,height}; h2{width}' );

			filter( '<h1 style="height:0; width:0">foo</h1>',			'<h1 style="height:0; width:0">foo</h1>' );
			filter( '<h2 style="height:0; width:0">foo</h2>',			'<h2 style="width:0">foo</h2>' );
			filter( '<p style="height:0; color:red">foo</p>',			'<p style="height:0">foo</p>' );
		},

		'test styles filter - string with wildcards': function() {
			var filter = createFilter( 'h1 p{font-*}; h2{border*}' );

			filter( '<h1 style="font-size:11px; height:0">foo</h1>',	'<h1 style="font-size:11px">foo</h1>' );
			filter( '<h2 style="border:solid">foo</h2>',				'<h2 style="border:solid">foo</h2>' );
			filter( '<h2 style="border-style:solid">foo</h2>',			'<h2 style="border-style:solid">foo</h2>' );
			filter( '<p style="font-color:red; font-size:11px">foo</p>',
					'<p style="font-color:red; font-size:11px">foo</p>' );
		},

		'test styles filter - object': function() {
			var filter = createFilter( {
				'h1 p': {
					styles: [ 'width', 'height' ]
				},
				h2: {
					styles: { width: true }
				}
			} );

			filter( '<h1 style="height:0; width:0">foo</h1>',			'<h1 style="height:0; width:0">foo</h1>' );
			filter( '<h2 style="height:0; width:0">foo</h2>',			'<h2 style="width:0">foo</h2>' );
			filter( '<p style="height:0; color:red">foo</p>',			'<p style="height:0">foo</p>' );
		},

		'test styles filter - style': function() {
			// Example from font plugin.
			var filter = createFilter( st( {
				element: 'span',
				styles: { 'font-size': '#(size)' }
			} ) );

			filter( '<p><span style="font-size:10px; color:red">A</span></p>',
					'<p><span style="font-size:10px">A</span></p>' );
			filter( '<p><span style="color:red">A</span></p>',			'<p>A</p>' );
		},

		'test combined and spacey filter - string': function() {
			var filter = createFilter( ' p h1 ( c1, c2 ) [ attr1, attr2 ] { color, width } ;\n h2(c3) ' );

			filter(
				'<p attr1="1" attr2="2" attr3="3" style="color:red; width:0; height:0" class="c1 c2 c3">foo</p>',
				'<p attr1="1" attr2="2" class="c1 c2" style="color:red; width:0">foo</p>' );
			filter(
				'<h1 attr1="1" attr2="2" attr3="3" style="color:red; width:0; height:0" class="c1 c2 c3">foo</h1>',
				'<h1 attr1="1" attr2="2" class="c1 c2" style="color:red; width:0">foo</h1>' );
			filter(
				'<h2 class="c1 c2 c3" attr1="1" attr2="2" attr3="3" style="color:red; width:0; height:0">foo</h1>',
				'<h2 class="c3">foo</h2>' );
		},

		'test required properties': function() {
			var filter = createFilter( 'p; a[!href]; img[!src,alt]; b(!foo)' );

			filter(
				'<p><a href="1" name="2">A</a><a name="2">B</a><a>C</a></p>',
				'<p><a href="1">A</a>BC</p>' );
			filter( '<p><img alt="2" src="1" />X<img alt="2"></p>',		'<p><img alt="2" src="1" />X</p>' );
			filter( '<p><b class="foo bar">A</b><b>B</b></p>',			'<p><b class="foo">A</b>B</p>' );
		},

		'test required properties with wildcards': function() {
			var filter = createFilter( 'p; b[!foo-*]; i[foo-*](!bar-*)' );

			filter( '<p><b>x</b> <i>y</i> <i foo-x="1">z</i></p>',		'<p>x y z</p>' );
			filter( '<p><b foo-x="1">x</b></p>',						'<p><b foo-x="1">x</b></p>' );
			filter( '<p><b foo-x="1" foo-y="1">x</b></p>',				'<p><b foo-x="1" foo-y="1">x</b></p>' );
			filter( '<p><i class="bar-x">x</i></p>',					'<p><i class="bar-x">x</i></p>' );
			filter( '<p><i class="bar-x bar-y" foo-x="1">x</i></p>',	'<p><i class="bar-x bar-y" foo-x="1">x</i></p>' );
		},

		'test dynamic rules adding after filter rule was added to htmlParser.filter': function() {
			var filter = createFilter( 'h1' );

			filter( '<h1 class="red"><i>foo</i> <b>bar</b></h1>',		'<h1>foo bar</h1>' );

			filter.allow( '*(red); b' );

			filter( '<h1 class="red"><i>foo</i> <b>bar</b></h1>',		'<h1 class="red">foo <b>bar</b></h1>' );
		},

		'test match rule': function() {
			var filter = createFilter( {
				b: {
					match: function( element ) {
						return element.attributes.foo == '1';
					},

					classes: 'bar'
				},

				// This rule will be executed before rule 'i'.
				'i x': {
					classes: 'bar',
					attributes: '*' // Ensure that this rule will have high priority.
				},

				i: {
					match: function() {
						return false;
					},

					classes: 'foo'
				}
			} );

			// Pass <b> which has foo attrib, but foo isn't allowed itself, so strip it.
			// Reject <b> without foo attrib.
			filter( '<p><b>A</b>B<b foo="1">C</b></p>',					'<p>AB<b>C</b></p>' );

			filter( '<p><b class="bar">A</b><b foo="1" class="bar">B</b></p>', '<p>A<b class="bar">B</b></p>' );

			// First rule accepts 'bar', but second shouldn't accept 'foo', because it doesn't match.
			filter( '<p><i class="foo bar">A</i></p>',					'<p><i class="bar">A</i></p>' );
		},

		'test rule\'s priorities': function() {
			var order = '',
				filter = createFilter( {
					p: true,

					x: {
						match: function() {
							order += '2';
							return true;
						}
					},
					'x b': {
						match: function() {
							order += '1';
						},
						classes: '*'
					},
					'x c': {
						match: function() {
							order += '2';
						}
					},
					'x d': {
						match: function() {
							order += '1';
						},
						attributes: '*'
					}
				} );

			filter( '<p><x>A</x></p>',									'<p><x>A</x></p>' );
			assert.areSame( '1122', order );
		},

		'test validate all rules - string': function() {
			var filter = createFilter( {
				b: { classes: '*', attributes: '*', styles: '*' },
				u: { attributes: '*' },
				i: { classes: '*' },
				s: { styles: '*' }
			} );

			filter( '<p><b>A</b><u>A</u><i>A</i><s>A</s></p>',
					'<p><b>A</b><u>A</u><i>A</i><s>A</s></p>' );
			filter( '<p><b class="x y" foo="1" style="color:red">A</b></p>',
					'<p><b class="x y" foo="1" style="color:red">A</b></p>' );
			filter( '<p><u class="x y" foo="1" style="color:red">A</u></p>',
					'<p><u foo="1">A</u></p>' );
			filter( '<p><i class="x y" foo="1" style="color:red">A</i></p>',
					'<p><i class="x y">A</i></p>' );
			filter( '<p><s class="x y" foo="1" style="color:red">A</s></p>',
					'<p><s style="color:red">A</s></p>' );
		},

		'test validate all rules - object': function() {
			var filter = createFilter( {
				b: { classes: '*', attributes: '*', styles: '*' },
				u: { attributes: '*' },
				i: { classes: '*' },
				s: { styles: '*' }
			} );

			filter( '<p><b>A</b><u>A</u><i>A</i><s>A</s></p>',
					'<p><b>A</b><u>A</u><i>A</i><s>A</s></p>' );
			filter( '<p><b class="x y" foo="1" style="color:red">A</b></p>',
					'<p><b class="x y" foo="1" style="color:red">A</b></p>' );
			filter( '<p><u class="x y" foo="1" style="color:red">A</u></p>',
					'<p><u foo="1">A</u></p>' );
			filter( '<p><i class="x y" foo="1" style="color:red">A</i></p>',
					'<p><i class="x y">A</i></p>' );
			filter( '<p><s class="x y" foo="1" style="color:red">A</s></p>',
					'<p><s style="color:red">A</s></p>' );
		},

		'test strip divs': function() {
			assert.areSame( CKEDITOR.ENTER_P, this.editors.themed.enterMode );

			var t = createFilterTester( this.editors.themed );
			t( '<div>A</div>',										'<p>A</p>',							'strip div' );
			t( '<div><div><b>A</b></div></div>',					'<p><b>A</b></p>',					'strip div>div' );
			t( '<div><div>A</div><div>B</div></div>',				'<p>A</p><p>B</p>',					'strip div>div+div' );
			t( '<div><h1>A</h1><div>B</div></div>',					'<h1>A</h1><p>B</p>',				'strip div>h1+div' );
			t( '<div><b>A</b>B<br />C<div>D</div>E</div>',
				'<p><b>A</b>B<br />C</p><p>D</p><p>E</p>',												'strip div>various' );
			t( '<div>A</div><blockquote><div>B</div><div>C</div></blockquote><div>D</div>',
				'<p>A</p><blockquote><p>B</p><p>C</p></blockquote><p>D</p>',							'replace div in blockquote' );
		},

		'test strip hr': function() {
			var t = createFilterTester( this.editors.themed );
			t( '<p>A</p><hr><p>B</p>',								'<p>A</p><p>B</p>',					'strip hr' );
		},

		'test strip list': function() {
			var t = createFilterTester( this.editors.themed );
			t( '<p>X</p><ul><li>A</li><li>B</li></ul><p>X</p>',		'<p>X</p><p>A</p><p>B</p><p>X</p>',	'strip ul>li+li' );
			t( '<ul><li><b>A</b><ol><li>B</li><li>C</li></ol></li><li>D</li></ul>',
				'<p><b>A</b></p><p>B</p><p>C</p><p>D</p>',												'strip ul>li>ol>li' );
		},

		'test strip list 2': function() {
			var t = createFilterTester( this.editors.themed_ul );
			t( '<ul><li>A</li><li>B</li></ul>',						'<ul><li>A</li><li>B</li></ul>',	'leave ul>li+li' );
			// li is allowed, because ul>li is allowed. This may cause problems.
			t( '<ol><li>A</li><li>B</li></ol>',						'<p>A</p><p>B</p>',					'strip ol>li+li' );
		},

		'test strip table': function() {
			var t = createFilterTester( this.editors.themed );
			t( '<table><tr><td>A</td><td><b>B</b></td></tr><tr><th>C</th><th>D</th></tr></table>',
				'<p>A<b>B</b></p><p>CD</p>',															'strip table' );
		},

		'test strip table 2': function() {
			var t = createFilterTester( this.editors.themed_table );
			t( '<table><tr><td>A</td><td>B</td></tr></table>',
				'<table><tr><td>A</td><td>B</td></tr></table>',											'leave table' );
			t( '<table><thead><tr><td>A</td><td>B</td></tr></thead><tbody><tr><td>C</td><td>D</td></tr></tbody></table>',
				'<table><tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></table>',			'strip thead,tbody' );
		},

		'test strip elements and clean up props': function() {
			var t = createFilterTester( this.editors.themed );
			t( '<h2 foo="1">A <i style="color:red">B</i></h2>',		'<p>A B</p>',						'strip h2 and attribute' );
			t( '<table><tbody><tr style="color:red"><td>C</td><td foo="1">D</td></tr></tbody></table>',
				'<p>CD</p>',																			'strip table and attributes' );
			t( '<div class="Y">A <p foo="1">B</p> <div class="X">C</div></div>',
				'<p>A</p><p>B</p><p>C</p>',																'strip divs and attributes' );
			t( '<ul align="right"><li foo="1">A</li><li bar="2">B <ol class="X"><li class="Y">C</li></ol></ul>',
				'<p>A</p><p>B</p><p>C</p>',																'strip list and attributes' );
		},

		'test strip in br mode': function() {
			assert.areSame( CKEDITOR.ENTER_BR, this.editors.themed_brmode.enterMode );

			var t = createFilterTester( this.editors.themed_brmode );
			t( '<strong>A</strong><br />B<em>C</em>D',
				'<strong>A</strong><br />B<em>C</em>D',													'leave' );

			t( '<span>A</span>B<kbd>C</kbd>D<hr />E',				'ABCD<br />E',						'strip inlines and hr' );
			t( '<h1>A</h1><p>B</p><p><em>C</em></p>',				'A<br />B<br /><em>C</em>',			'strip paragraphs and header' );
			t( '<ul><li>A</li><li>B</li></ul>',						'A<br />B',							'strip list' );
			t( 'A<table><tbody><tr><td>X</td><td>Y</td></tr><tr><td>W</td><td>Z</td></tr></tbody></table>C<br />D',
				'A<br />XY<br />WZ<br />C<br />D',														'strip table' );
			t( '<p>A</p><blockquote><p>B</p><p>C</p></blockquote><p>D</p>',
				'A<blockquote>B<br />C</blockquote>D',													'strip paragraphs from blockquote' );
			t( '<p>X</p><div><div>A</div><div>B</div></div><p>X<p>',
				'X<br />A<br />B<br />X',																'strip div>div+div' );
		},

		'test strip in div mode': function() {
			assert.areSame( CKEDITOR.ENTER_DIV, this.editors.themed_divmode.enterMode );

			var t = createFilterTester( this.editors.themed_divmode );
			t( '<p>X</p><div><div>A</div><div>B</div></div><p>X<p>',
				'<div>X</div><div><div>A</div><div>B</div></div><div>X</div>',							'leave div>div+div, replace p' );

			t( '<h1>A</h1><p>B</p><p><em>C</em></p>',
				'<div>A</div><div>B</div><div><em>C</em></div>',										'replace paragraphs and header' );
			t( '<ul><li>A</li><li>B</li></ul>',
				'<div><div>A</div><div>B</div></div>',													'strip list' );
			t( '<p>A</p><table><tbody><tr><td>X</td><td>Y</td></tr><tr><td>W</td><td>Z</td></tr></tbody></table><p>C<br />D</p>',
				'<div>A</div><div><div>XY</div><div>WZ</div></div><div>C<br />D</div>',					'strip table' );
			t( '<p>A</p><blockquote><p>B</p><p>C</p></blockquote><p>D</p>',
				'<div>A</div><blockquote><div>B</div><div>C</div></blockquote><div>D</div>',			'replace paragraphs in blockquote' );
		},

		'test strip in blockless editor': function() {
			assert.areSame( CKEDITOR.ENTER_BR, this.editors.inline_h1.enterMode );

			var t = createFilterTester( this.editors.inline_h1 );
			t( '<strong>A</strong><br />B<em>C</em>D',
				'<strong>A</strong><br />B<em>C</em>D',													'leave' );

			t( '<span>A</span>B<kbd>C</kbd>D<hr />E',				'ABCD<br />E',						'strip inlines and hr' );
			t( '<h1>A</h1><p>B</p><p><em>C</em></p>',				'A<br />B<br /><em>C</em>',			'strip paragraphs and header' );
			t( '<ul><li>A</li><li>B</li></ul>',						'A<br />B',							'strip list' );
			t( 'A<table><tbody><tr><td>X</td><td>Y</td></tr><tr><td>W</td><td>Z</td></tr></tbody></table>C<br />D',
				'A<br />XY<br />WZ<br />C<br />D',														'strip table' );
			t( '<p>A</p><blockquote><p>B</p><p>C</p></blockquote><p>D</p>',
				'A<br />B<br />C<br />D',																'strip paragraphs and blockquote' );
			t( '<p>X</p><div><div>A</div><div>B</div></div><p>X<p>',

				'X<br />A<br />B<br />X',																'strip div>div+div' );
		},

		'test clean up invalid link/anchor': function() {
			var filter = createFilter( 'p; a[!name]' );

			filter( '<p>X<a href="">A</a>X</p>',					'<p>XAX</p>' );
			filter( '<p>X<a href="x">A</a>X</p>',					'<p>XAX</p>' );
			filter( '<p>X<a href="x"><img src="x" /></a>X</p>',		'<p>XX</p>' );
			filter( '<p>X<a href="x"><img /></a>X</p>',				'<p>XX</p>' );
			filter( '<p>X<a href="x"><b>A</b></a>X</p>',			'<p>XAX</p>' );
			// https://dev.ckeditor.com/ticket/10224 - <a> element doesn't have to have any attribute if it isn't empty.
			// Empty name attribute make this element valid (name is required).
			filter( '<p>X<a name="">A</a>X</p>',					'<p>X<a name="">A</a>X</p>' );
			// Keep empty anchor (it has non-empty name attr).
			filter( '<p>X<a name="x"></a>X</p>',					'<p>X<a name="x"></a>X</p>' );
			filter( '<p>X<a name="x">A</a>X</p>',					'<p>X<a name="x">A</a>X</p>' );
			filter( '<p>X<a name="x"><img src="x" /></a>X</p>',		'<p>X<a name="x"></a>X</p>' );
			filter( '<p>X<a href="x" name="x">A</a>X</p>',			'<p>X<a name="x">A</a>X</p>' );
			// Empty <a> element isn't correct unless it is an anchor (has non-empty name or id attrbiute).
			// This behaviour conforms to the htmlDP's htmlFilter.
			filter( '<p>X<a href="x" name=""></a>X</p>',			'<p>XX</p>' );
			filter( '<p>X<a name="x" href="x"><img /></a>X</p>',	'<p>X<a name="x"></a>X</p>' );

			filter = createFilter( 'p; a[!id]' );
			filter( '<p>X<a name="x"></a>X</p>',					'<p>XX</p>' );
			filter( '<p>X<a id=""></a>X</p>',						'<p>XX</p>' );
			filter( '<p>X<a id="x"></a>X</p>',						'<p>X<a id="x"></a>X</p>' );
			filter( '<p>X<a id="x" name="x"></a>X</p>',				'<p>X<a id="x"></a>X</p>' );
			filter( '<p>X<a id="x" name="x">foo</a>X</p>',			'<p>X<a id="x">foo</a>X</p>' );

			filter = createFilter( 'p; a[!href]' );

			filter( '<p>X<a href="">A</a>X</p>',					'<p>X<a href="">A</a>X</p>' );
			filter( '<p>X<a href="x">A</a>X</p>',					'<p>X<a href="x">A</a>X</p>' );
			filter( '<p>X<a href="x"><img src="x" /></a>X</p>',		'<p>XX</p>' );
			filter( '<p>X<a href="x"><img /></a>X</p>',				'<p>XX</p>' );
			filter( '<p>X<a href="x"><b>A</b></a>X</p>',			'<p>X<a href="x">A</a>X</p>' );
			filter( '<p>X<a name="">A</a>X</p>',					'<p>XAX</p>' );
			filter( '<p>X<a name="x">A</a>X</p>',					'<p>XAX</p>' );
			filter( '<p>X<a name="x"><img src="x" /></a>X</p>',		'<p>XX</p>' );
			filter( '<p>X<a href="x" name="x">A</a>X</p>',			'<p>X<a href="x">A</a>X</p>' );
			filter( '<p>X<a href="x" name=""></a>X</p>',			'<p>XX</p>' );
			filter( '<p>X<a href="x" name="x"></a>X</p>',			'<p>XX</p>' );
			filter( '<p>X<a name="x" href="x"><img /></a>X</p>',	'<p>XX</p>' );

			filter = createFilter( 'p a' );

			filter( '<p>X<a href="">A</a>X</p>',					'<p>X<a>A</a>X</p>' );
			filter( '<p>X<a>A</a>X</p>',							'<p>X<a>A</a>X</p>' );
			filter( '<p>X<a></a>X</p>',								'<p>XX</p>' );
			filter( '<p>X<a><img src="x" /></a>X</p>',				'<p>XX</p>' );

			// AC: 'a[name]'.
			var t = createFilterTester( this.editors.themed_cleanup );
			t( '<p>X<a href="x">A</a>X</p>',						'<p>X<a>A</a>X</p>',				'remove href, but not link' );
			t( '<p>X<a name="x">A</a>X</p>',
				'<p>X<a data-cke-saved-name="x" name="x">A</a>X</p>',									'do not remove a[name]' );
			t( '<p>X<a name="x"></a>X</p>',
				'<p>X<a data-cke-saved-name="x" name="x"></a>X</p>',									'do not remove empty a[name]' );
		},

		'test clean up invalid img': function() {
			var filter = createFilter( 'p img' );
			filter( '<p><img src="a" /></p>',						'<p></p>' );
			filter( '<p><img src="" /></p>',						'<p></p>' );
			filter( '<p><img /></p>',								'<p></p>' );

			var t = createFilterTester( this.editors.themed_cleanup );
			t( '<p><img src="x" /></p>',							'<p>@</p>',							'remove img and add bogus' );
			t( '<p><a href="a"><img src="x" /></a></p>',			'<p>@</p>',							'remove a>img and add bogus' );
		},

		'test clean up empty elements from dtd.$removeEmpty': function() {
			var filter = createFilter( 'p b' );

			filter( '<p><b>A</b></p>',								'<p><b>A</b></p>' );
			filter( '<p><b></b></p>',								'<p></p>' );
			filter( '<p><i>A</i></p>',								'<p>A</p>' );
			filter( '<p><i></i></p>',								'<p></p>' );
			filter( '<p><i><b>A</b></i></p>',						'<p><b>A</b></p>' );
			filter( '<p><b><i>A</i></b></p>',						'<p><b>A</b></p>' );
			filter( '<p><b><i></i></b></p>',						'<p></p>' );
			filter( '<p><b><i><img src="x" /></i>A</b></p>',		'<p><b>A</b></p>' );
			filter( '<p><b><img src="x" /></b></p>',				'<p></p>' );
			filter( '<p><b><img src="x" />A</b></p>',				'<p><b>A</b></p>' );

			var t = createFilterTester( this.editors.themed_cleanup );
			t( '<p><b></b></p>',									'<p>@</p>',							'remove empty b and add bogus' );
			t( '<p><b><img src="x" /></b></p>',						'<p>@</p>',							'remove empty b>img and add bogus' );
			t( '<p><b><i><img src="x" /></i></b></p>',				'<p>@</p>',							'remove empty b>i>img and add bogus' );
		},

		'test clean up data-cke-saved attributes': function() {
			var filter = createFilter( 'p' );
			filter( '<p data-cke-saved-foo="1">A</p>',				'<p>A</p>' );
			filter( '<p data-cke-custom="1">A</p>',					'<p data-cke-custom="1">A</p>' );

			filter = createFilter( 'p[foo]' );
			filter( '<p data-cke-saved-foo="1">A</p>',				'<p>A</p>' );
			filter( '<p data-cke-saved-foo="1" foo="1">A</p>',		'<p data-cke-saved-foo="1" foo="1">A</p>' );
			filter( '<p data-cke-custom="1">A</p>',					'<p data-cke-custom="1">A</p>' );
		},

		'test strip table after its content have been rejected': function() {
			// This case may be caused by styles introducing table, but not the rest of it.
			var filter = createFilter( 'p table' );

			filter( '<p>X</p><table><caption>C</caption><tbody><tr><td>1A</td><td>1B</td></tr><tr><td>2A</td><td>2B</td></tr></tbody></table><p>X</p>',
				'<p>X</p><p>C</p><p>1A1B</p><p>2A2B</p><p>X</p>' );
		},

		'test strip protected elements': function() {
			var t = createFilterTester( this.editors.themed );

			t( '<p>X<script>alert(1);</scr' + 'ipt>Y</p>',			'<p>XY</p>',						'strip entire script' );
			t( '<p>X<script>alert(1);</scr' + 'ipt><script>alert(1);</scr' + 'ipt>Y</p>',
				'<p>XY</p>',																			'strip entire scripts' );
			t( '<p>X<noscript>foo</noscr' + 'ipt>Y</p>',			'<p>XY</p>',						'strip entire noscript' );
			t( '<p>X<script>alert("<? echo 1; ?>");</scr' + 'ipt>Y</p>',
				'<p>XY</p>',																			'strip entire script with protected like fragment' );
			t( '<p>X<!--foo-->Y</p>',
				'<p>X<!--{cke_protected}{C}%3C!%2D%2Dfoo%2D%2D%3E-->Y</p>',								'leave real comment' );
			t( '<p>X<? echo 1; ?>Y</p>',
				'<p>X<!--{cke_protected}%3C%3F%20echo%201%3B%20%3F%3E-->Y</p>',							'leave entire PHP code' );
			t( '<script>alert(1);',									'@',								'strip entire script (no closing)' );
			t( '<script><iframe src="foo"></iframe>',				'@',								'strip entire script (no closing, iframe inside)' );
		},

		'test leave protected elements': function() {
			var t = createFilterTester( this.editors.themed_protected );

			t( '<p>X<script>alert(1);</scr' + 'ipt>Y</p>',
				'<p>X<!--{cke_protected}%3Cscript%3Ealert(1)%3B%3C%2Fscript%3E-->Y</p>',				'leave entire script' );
			t( '<p>X<noscript>foo</noscr' + 'ipt>Y</p>',
				'<p>X<!--{cke_protected}%3Cnoscript%3Efoo%3C%2Fnoscript%3E-->Y</p>',					'leave entire noscript' );
			t( '<p>X<!--foo-->Y</p>',
				'<p>X<!--{cke_protected}{C}%3C!%2D%2Dfoo%2D%2D%3E-->Y</p>',								'leave real comment' );
			t( '<p>X<? echo 1; ?>Y</p>',
				'<p>X<!--{cke_protected}%3C%3F%20echo%201%3B%20%3F%3E-->Y</p>',							'leave entire PHP code' );
		},

		// https://dev.ckeditor.com/ticket/13393
		// The script's body may not be encoded if htmlDP was not used or if the encoding didn't work.
		'test script removed completely when its body is not encoded': function() {
			var filter = createFilter( 'p', false );

			filter( '<p>X<script>alert(1);</scr' + 'ipt>X</p>',		'<p>XX</p>',						'strip whole element' );
		},

		'test strip entire elements which may contain cdata': function() {
			var t = createFilterTester( this.editors.themed );

			t( '<p>X</p><style>#d{color:red}</style><p>Y</p>',		'<p>X</p><p>Y</p>',					'strip entire style' );
		},

		'test no filtering on output': function() {
			var t = createFilterTester( this.editors.themed, true );

			t( '<h2>X</h2><p><i>A</i> <img alt="y" src="x" /></p><div foo="1">C</div>',
				'<h2>X</h2><p><i>A</i> <img alt="y" src="x" /></p><div foo="1">C</div>',				'leave all' );
		},

		'test no filtering with dontFilter argument': function() {
			var t = createFilterTester( this.editors.themed, false, true );

			t( '<h2>X</h2><p><i>A</i></p><div foo="1">C</div>',
				'<h2>X</h2><p><i>A</i></p><div foo="1">C</div>',										'leave all' );
		},

		'test leave data-cke-* spans like markers and bookmarks - toHtml': function() {
			var t = createFilterTester( this.editors.themed );

			t( 'X<span data-cke-marker="1">&nbsp;</span>X',
				'X<span data-cke-marker="1">&nbsp;</span>X',											'leave markers' );

			t( 'X<span data-cke-bookmark="1">&nbsp;</span>X',
				'X<span data-cke-bookmark="1">&nbsp;</span>X',											'leave bookmarks' );

			t( 'X<span data-cke-moo="1">Y</span>X',
				'X<span data-cke-moo="1">Y</span>X',													'leave data-cke-* spans' );

			// B is allowed.
			t( 'X<b data-cke-marker="1" foo="2">Y</b>X',			'X<b data-cke-marker="1">Y</b>X',	'leave b, but strip foo attribute' );

			t( 'X<span data-="1" cke-="1" data-cke="1">Y</span>X',	'XYX',								'strip tricky spans' );

			// I is not allowed.
			t( 'X<i data-cke-marker="1">Y</i>X',					'XYX',								'strip other elements - i' );
		},

		'test leave data-cke-* spans like markers and bookmarks - toDataFormat': function() {
			var filter = createFilter( 'b', false );

			filter( 'X<span data-cke-marker="1">&nbsp;</span>X',		'X&nbsp;X',							'strip markers' );

			filter( 'X<span data-cke-bookmark="1">&nbsp;</span>X',		'X&nbsp;X',							'strip bookmarks' );

			filter( 'X<b data-cke-marker="1" foo="2">Y</b>X',			'X<b data-cke-marker="1">Y</b>X',	'strip not allowed attribute' );

			filter( 'X<span data-="1" cke-="1" data-cke="1">Y</span>X',	'XYX',								'strip tricky spans' );

			filter( 'X<i data-cke-marker="1">Y</i>X',					'XYX',								'strip other elements - i' );
		},

		'test disabling filter with data-cke-filter="off" attribute': function() {
			var filter = createFilter( 'p' );

			filter( '<p><i data-cke-filter="off">X</i><i>Y</i></p>',
				'<p><i data-cke-filter="off">X</i>Y</p>',												'protect marked i' );

			filter( '<p class="xyz" data-cke-filter="off" foo="1" style="color: red"><i bar="2">X</i></p>',
				'<p class="xyz" data-cke-filter="off" foo="1" style="color: red"><i bar="2">X</i></p>',	'protect attributes and descendants' );

			filter( '<div><div data-cke-filter="off">Y</div></div>',
				'<div data-cke-filter="off">Y</div>',													'strip wrapper' );

			filter( '<h6><i data-cke-filter="off">Y</i></h6>',
				'<p><i data-cke-filter="off">Y</i></p>',												'strip wrapper 2' );

			// Disabling filter by data-cke-filter should not conflict with omitting normal
			// spans with data-cke-* attributes (like bookmarks).
			var t = createFilterTester( this.editors.themed );

			t( '<p><span data-cke-filter="off"><i foo="1">x</i></span></p>',
				'<p><span data-cke-filter="off"><i foo="1">x</i></span></p>',							'protect span with data-cke-* and its contents' );
		},

		'test forcing enter mode': function() {
			var filter = createFilter( 'p br' );
			filter( '<div>A</div><div>B</div>',							'<p>A</p><p>B</p>',				'divs were replaced with p' );

			filter = createFilter( 'p br', false, CKEDITOR.ENTER_BR );
			filter( '<div>A</div><div>B</div>',							'A<br />B',						'br was inserted between blocks' );
		},

		'test enter mode defaults to editor.enterMode': function() {
			var filter = createFilter( this.editors.themed.filter );

			filter( '<div>A</div><div>B</div>',							'<p>A</p><p>B</p>',				'divs were replaced with p when active mode equals defailt' );

			this.editors.themed.setActiveEnterMode( CKEDITOR.ENTER_BR );

			try {
				filter( '<div>A</div><div>B</div>',						'<p>A</p><p>B</p>',				'divs were replaced with p when active mode is br' );
			} catch ( e ) {
				throw e;
			} finally {
				// Make sure we reset the enter mode even if test fails.
				this.editors.themed.setActiveEnterMode( null );
			}
		},

		'test filtering custom tags': function() {
			var filter = createFilter( 'p bar' );

			filter( '<p><bar>bar</bar></p>',						'<p><bar>bar</bar></p>' );
			filter( '<bar><foo>bar</foo></bar>',					'<bar>bar</bar>' );
			// https://dev.ckeditor.com/ticket/12683
			filter( '<bar><h1>bar</h1></bar>',						'<p>bar</p>' );
		},

		// https://dev.ckeditor.com/ticket/13886
		'test filter styles validation with none or empty styles': function() {
			var filter = new CKEDITOR.filter( 'a {color}' );

			assert.isTrue( filter.check( new CKEDITOR.style( { element: 'a' } ) ) );
			assert.isTrue( filter.check( new CKEDITOR.style( { element: 'a', styles: {} } ) ) );
			assert.isTrue( filter.check( new CKEDITOR.style( { element: 'a', styles: { color: 'red' } } ) ) );
		},

		'test filter.check handles array': function() {
			var filter = new CKEDITOR.filter( 'a {color}' ),
				aStyle = new CKEDITOR.style( { element: 'a' } ),
				bStyle = new CKEDITOR.style( { element: 'b' } );

			assert.isTrue( filter.check( [ bStyle, aStyle ] ) );
			assert.isFalse( filter.check( [ bStyle ] ) );
		}
	} );
} )();
