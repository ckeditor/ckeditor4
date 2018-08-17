/* bender-tags: editor */
/* bender-ckeditor-remove-plugins: link,basicstyles */

( function() {
	'use strict';

	// Returns first ACR added by specified feature.
	function getByFeature( filter, featureName ) {
		for ( var i = 0, acrs = filter.allowedContent; i < acrs.length; ++i ) {
			if ( acrs[ i ].featureName == featureName )
				return acrs[ i ];
		}
		return null;
	}

	function st( def ) {
		return new CKEDITOR.style( def );
	}

	var defaultRule = {
		styles: null,
		attributes: null,
		classes: null,
		match: null,
		propertiesOnly: false,
		requiredAttributes: null,
		requiredStyles: null,
		requiredClasses: null
	};

	function assertRule( filter, featureName, expected ) {
		var rule = getByFeature( filter, featureName );

		// Extend without overwriting.
		CKEDITOR.tools.extend( expected, defaultRule );

		for ( var name in expected ) {
			var expectedValue = expected[ name ],
				actualValue = rule[ name ],
				msg = featureName + ' - ' + name;

			if ( CKEDITOR.tools.isArray( expectedValue ) )
				arrayAssert.itemsAreEqual( expectedValue, actualValue, msg );
			else if ( typeof expectedValue == 'object' && expectedValue !== null )
				assert.isTrue( CKEDITOR.tools.objectCompare( expectedValue, actualValue ), msg );
			else
				assert.areSame( expectedValue, actualValue, msg );
		}
	}

	bender.editor = true;

	bender.test( {
		'test filters instances are registered': function() {
			assert.areSame( this.editor.filter, CKEDITOR.filter.instances[ this.editor.filter.id ], 'editor.filter' );

			var filter = new CKEDITOR.filter( 'b' );

			assert.isNumber( filter.id, 'filter.id is a number' );
			assert.areSame( filter, CKEDITOR.filter.instances[ filter.id ], 'standalone filter' );
		},

		'test allow() returns false if rules not defined': function() {
			assert.isFalse( this.editor.filter.allow() );
			assert.isFalse( this.editor.filter.allow( null ) );
			assert.isFalse( this.editor.filter.allow( null, 1 ) );
		},

		'test add array of rules': function() {
			bender.editorBot.create( {
				name: 'test_add_array_of_rules'
			}, function( bot ) {
				var editor = bot.editor,
					filter = editor.filter;

				assert.isTrue( filter.allow( [ 'a', 'b(red)' ] ) );

				assert.isTrue( filter.check( 'a' ) );
				assert.isTrue( filter.check( 'b(red)' ) );
				assert.isFalse( filter.check( 'a(red)' ) );

				filter.customConfig = true;

				assert.isFalse( filter.allow( [ 'i', 'u(red)' ] ) );

				assert.isFalse( filter.check( 'u' ) );
				assert.isFalse( filter.check( 'i' ) );

				assert.isTrue( filter.allow( [ { i: true }, 'u(red)' ], null, 1 ) );

				assert.isTrue( filter.check( 'u' ) );
				assert.isTrue( filter.check( 'i' ) );
			} );
		},

		'test addFeature - default configuration': function() {
			bender.editorBot.create( {
				name: 'test_addFeature_default_config'
			}, function( bot ) {
				var editor = bot.editor,
					filter = editor.filter;

				assert.isTrue( filter.addFeature( {} ) );

				// Even if 'b' isn't allowed when filter has default configuration
				// filter accepts all content definitions, because it assumes that plugins extend
				// default configuration for their needs.
				assert.isTrue( filter.addFeature( { requiredContent: 'b' } ) );

				assert.isFalse( filter.check( 'b' ) );

				assert.isTrue( filter.addFeature( { requiredContent: 'b', allowedContent: 'b' } ) );

				assert.isTrue( filter.check( 'b' ) );

				assert.isTrue( filter.addFeature( { allowedContent: 'i' } ) );

				assert.isTrue( filter.check( 'i' ) );
			} );
		},

		'test addFeature - custom configuration': function() {
			bender.editorBot.create( {
				name: 'test_addFeature_custom_config',
				config: {
					allowedContent: 'b'
				}
			}, function( bot ) {
				var editor = bot.editor,
					filter = editor.filter;

				assert.isTrue( filter.addFeature( {} ) );

				assert.isTrue( filter.addFeature( { requiredContent: 'b' } ) );

				assert.isFalse( filter.addFeature( { requiredContent: 'i' } ) );

				assert.isFalse( filter.check( 'i' ) );

				assert.isTrue( filter.addFeature( { requiredContent: 'b', allowedContent: 'i' } ) );

				// In custom configuration contentDef.allowed is ignored.
				assert.isFalse( filter.check( 'i' ) );

				assert.isTrue( filter.addFeature( { allowedContent: 'i' } ) );

				assert.isFalse( filter.check( 'i' ) );
			} );
		},

		'test addFeature': function() {
			var editor = this.editor,
				filter = editor.filter;

			assert.isTrue( filter.addFeature() );

			assert.isTrue( filter.addFeature( {
				toFeature: function( e ) {
					assert.areSame( editor, e );
					return {
						allowedContent: 'foo1'
					};
				},
				allowedContent: 'foo2'
			} ) );

			assert.isTrue( filter.check( 'foo1' ) );
			assert.isFalse( filter.check( 'foo2' ) ); // toFeature() has higher priority.
		},

		'test allowedContent array - string format': function() {
			var filter = new CKEDITOR.filter( 'p' );

			filter.allow( 'a b-c d', 'rule1' );
			assertRule( filter, 'rule1', {
				elements: { a: true, 'b-c': true, d: true }
			} );

			filter.allow( '*[attr1]', 'rule2' );
			assertRule( filter, 'rule2', {
				elements: true,
				propertiesOnly: true,
				attributes: { attr1: true }
			} );

			filter.allow( 'c[attr1,attr2]', 'rule3' );
			assertRule( filter, 'rule3', {
				elements: { c: true },
				attributes: { attr1: true, attr2: true }
			} );

			filter.allow( 'd(cl1,cl2)', 'rule4' );
			assertRule( filter, 'rule4', {
				elements: { d: true },
				classes: { cl1: true, cl2: true }
			} );

			filter.allow( 'e{st1,st2}', 'rule5' );
			assertRule( filter, 'rule5', {
				elements: { e: true },
				styles: { st1: true, st2: true }
			} );

			filter.allow( 'f{!st1,st2}(cl1,!cl2,!cl3)[attr1,!attr2]', 'rule6' );
			assertRule( filter, 'rule6', {
				elements: { f: true },
				styles: { st1: true, st2: true },
				classes: { cl1: true, cl2: true, cl3: true },
				attributes: { attr1: true, attr2: true },
				requiredStyles: { st1: true },
				requiredClasses: { cl2: true, cl3: true },
				requiredAttributes: { attr2: true }
			} );

			filter.allow( 'g[foo-*,*b*a*r*,!bom-*]', 'rule7' );
			assertRule( filter, 'rule7', {
				elements: { g: true },
				attributes: { 'foo-*': true, '*b*a*r*': true, 'bom-*': true },
				requiredAttributes: { 'bom-*': true }
			} );

			filter.allow( 'h{foo*}(bar*)', 'rule8' );
			assertRule( filter, 'rule8', {
				elements: { h: true },
				styles: { 'foo*': true },
				classes: { 'bar*': true }
			} );

			filter.allow( 'i{*}(*)[*]', 'rule9' );
			assertRule( filter, 'rule9', {
				elements: { i: true },
				styles: true,
				classes: true,
				attributes: true
			} );

			/*
			Not supported yet.
			filter.allow( 'j*,*j[foo]', 'rule10' );
			assertRule( filter, 'rule10', {
				elements: { 'j*': true, '*j': true },
				attributes: { foo: true }
			} );
			*/
		},

		'test allowedContent array - object format - elements': function() {
			var filter = new CKEDITOR.filter( 'p' );

			filter.allow( { 'a b': true }, 'rule1' );
			assertRule( filter, 'rule1', {
				elements: { a: true, b: true }
			} );

			filter.allow( { '*': true }, 'rule2' );
			assertRule( filter, 'rule2', {
				elements: true,
				propertiesOnly: true
			} );

			filter.allow( { '$1': {
				elements: [ 'c', 'd' ]
			} }, 'rule3' );
			assertRule( filter, 'rule3', {
				elements: { c: true, d: true }
			} );

			filter.allow( { '$1': {
				elements: { e: true, f: true }
			} }, 'rule4' );
			assertRule( filter, 'rule4', {
				elements: { e: true, f: true }
			} );

			var fn = function() {};
			filter.allow( { '$1': {
				match: fn
			} }, 'rule5' );
			assertRule( filter, 'rule5', {
				elements: null,
				match: fn
			} );

			filter.allow( { g: fn }, 'rule6' );
			assertRule( filter, 'rule6', {
				elements: { g: true },
				match: fn
			} );

			/*
			Not supported yet.
			filter.allow( { 'h*': true, 'h*a *hb': true }, 'rule7' );
			assertRule( filter, 'rule7', {
				elements: { 'h*': true, 'h*a': true, '*hb': true }
			} );
			*/
		},

		'test allowedContent array - object format - properties': function() {
			var filter = new CKEDITOR.filter( 'p' );

			filter.allow( { a: { attributes: 'attr1,attr2' } }, 'rule1' );
			assertRule( filter, 'rule1', {
				elements: { a: true },
				attributes: { attr1: true, attr2: true }
			} );

			filter.allow( { b: { classes: [ 'cl1', 'cl2' ] } }, 'rule2' );
			assertRule( filter, 'rule2', {
				elements: { b: true },
				classes: { cl1: true, cl2: true }
			} );

			filter.allow( { c: { styles: { st1: true, st2: true } } }, 'rule3' );
			assertRule( filter, 'rule3', {
				elements: { c: true },
				styles: { st1: true, st2: true }
			} );

			filter.allow( {
				d: {
					styles: '!st1,st2',
					classes: [ 'cl1', '!cl2', '!cl3' ],
					attributes: { attr1: true, '!attr2': true }
				}
			} , 'rule4' );
			assertRule( filter, 'rule4', {
				elements: { d: true },
				styles: { st1: true, st2: true },
				classes: { cl1: true, cl2: true, cl3: true },
				attributes: { attr1: true, attr2: true },
				requiredStyles: { st1: true },
				requiredClasses: { cl2: true, cl3: true },
				requiredAttributes: { attr2: true }
			} );

			filter.allow( {
				d: {
					styles: { st1: true, st2: true },
					requiredStyles: 'st1,st2'
				}
			}, 'rule5' );
			assertRule( filter, 'rule5', {
				elements: { d: true },
				styles: { st1: true, st2: true },
				requiredStyles: { st1: true, st2: true }
			} );

			filter.allow( { e: { propertiesOnly: true } }, 'rule6' );
			assertRule( filter, 'rule6', {
				elements: { e: true },
				propertiesOnly: true
			} );

			filter.allow( {
				'$0': {
					propertiesOnly: true,
					attributes: 'title'
				}
			}, 'rule7' );
			assertRule( filter, 'rule7', {
				elements: null,
				propertiesOnly: true,
				attributes: { title: true }
			} );

			filter.allow( {
				'$0': {
					attributes: 'title'
				}
			}, 'rule7b' );
			assertRule( filter, 'rule7b', {
				elements: null,
				attributes: { title: true }
			} );

			filter.allow( {
				f: {
					styles: '!st1,st2',
					requiredStyles: 'st3',
					attributes: [ '!attr1' ],
					requiredAttributes: { attr1: true, attr2: true },
					requiredClasses: 'cl1'
				}
			}, 'rule8' );
			assertRule( filter, 'rule8', {
				elements: { f: true },
				styles: { st1: true, st2: true },
				requiredStyles: { st1: true, st3: true },
				attributes: { attr1: true },
				requiredAttributes: { attr1: true, attr2: true },
				requiredClasses: { cl1: true }
			} );

			filter.allow( {
				g: {
					styles: [],
					attributes: {},
					requiredAttributes: {},
					requiredClasses: []
				}
			}, 'rule9' );
			assertRule( filter, 'rule9', {
				elements: { g: true }
			} );

			filter.allow( {
				h: {
					styles: '*',
					requiredStyles: 'st1,st2'
				}
			}, 'rule10' );
			assertRule( filter, 'rule10', {
				elements: { h: true },
				styles: true,
				requiredStyles: { st1: true, st2: true }
			} );

			filter.allow( {
				i: {
					styles: true,
					requiredStyles: 'st1,st2'
				}
			}, 'rule11' );
			assertRule( filter, 'rule11', {
				elements: { i: true },
				styles: true,
				requiredStyles: { st1: true, st2: true }
			} );

			filter.allow( {
				j: {
					attributes: 'attr1*',
					styles: [ 'st1*', '*st2' ],
					classes: { 'cl1*': true }
				}
			}, 'rule12' );
			assertRule( filter, 'rule12', {
				elements: { j: true },
				attributes: { 'attr1*': true },
				styles: { 'st1*': true, '*st2': true },
				classes: { 'cl1*': true }
			} );

			filter.allow( {
				g: {
					attributes: '!attr1*',
					requiredAttributes: { 'attr2*': true }
				}
			}, 'rule13' );
			assertRule( filter, 'rule13', {
				elements: { g: true },
				attributes: { 'attr1*': true },
				requiredAttributes: { 'attr1*': true, 'attr2*': true }
			} );
		},

		'test allowedContent array - object format - styles': function() {
			var filter = new CKEDITOR.filter( 'p' );

			filter.allow( st( {
				element: 'h2', styles: { 'font-style': 'italic' }
			} ), 'rule1' );
			assertRule( filter, 'rule1', {
				elements: { h2: true },
				styles: { 'font-style': 'italic' },
				requiredStyles: { 'font-style': true }
			} );

			filter.allow( st( {
				element: 'span', attributes: { 'class': 'marker' }
			} ), 'rule2' );
			assertRule( filter, 'rule2', {
				elements: { span: true },
				classes: { marker: true },
				requiredClasses: { marker: true }
			} );

			filter.allow( st( {
				element: 'span', attributes: { 'dir': 'rtl' }
			} ), 'rule3' );
			assertRule( filter, 'rule3', {
				elements: { span: true },
				attributes: { dir: 'rtl' },
				requiredAttributes: { dir: true }
			} );
		},

		'test allowedContent array - styles - toAllowedContentRules': function() {
			var filter = new CKEDITOR.filter( 'p' ),
				style;

			style = st( { element: 'p', styles: { 'font-style': 'italic' } } );
			style.toAllowedContentRules = function() {
				return 'h1(foo)';
			};
			filter.allow( style, 'rule1' );
			assertRule( filter, 'rule1', {
				elements: { h1: true },
				classes: { foo: true }
			} );

			style = st( { element: 'p', styles: { 'font-style': 'italic' } } );
			style.toAllowedContentRules = function() {
				return {
					h2: {
						classes: '!bar'
					}
				};
			};
			filter.allow( style, 'rule2' );
			assertRule( filter, 'rule2', {
				elements: { h2: true },
				classes: { bar: true },
				requiredClasses: { bar: true }
			} );
		},

		'test allow - styles - editor instance is passed to toAllowedContentRules': function() {
			var editor = this.editor,
				style = st( { element: 'p', styles: { 'font-style': 'italic' } } );

			style.toAllowedContentRules = function( arg ) {
				assert.areSame( editor, arg );
			};
			editor.filter.allow( style );
		},

		'test getAllowedEnterMode': function() {
			var filter1 = new CKEDITOR.filter( 'p div' ),
				filter2 = new CKEDITOR.filter( 'br' ),
				filter3 = new CKEDITOR.filter( 'i' ),
				filter4 = new CKEDITOR.filter( 'p div br' );

			assert.areSame( CKEDITOR.ENTER_P, filter1.getAllowedEnterMode( CKEDITOR.ENTER_P ), 'f1a' );
			assert.areSame( CKEDITOR.ENTER_DIV, filter1.getAllowedEnterMode( CKEDITOR.ENTER_DIV ), 'f1b' );
			assert.areSame( CKEDITOR.ENTER_P, filter1.getAllowedEnterMode( CKEDITOR.ENTER_BR ), 'f1c' );

			assert.areSame( CKEDITOR.ENTER_P, filter1.getAllowedEnterMode( CKEDITOR.ENTER_P, true ), 'f1a - reverse' );
			assert.areSame( CKEDITOR.ENTER_DIV, filter1.getAllowedEnterMode( CKEDITOR.ENTER_DIV, true ), 'f1b - reverse' );
			assert.areSame( CKEDITOR.ENTER_DIV, filter1.getAllowedEnterMode( CKEDITOR.ENTER_BR, true ), 'f1c - reverse' );

			assert.areSame( CKEDITOR.ENTER_BR, filter2.getAllowedEnterMode( CKEDITOR.ENTER_P ), 'f2' );
			assert.areSame( CKEDITOR.ENTER_BR, filter2.getAllowedEnterMode( CKEDITOR.ENTER_P, true ), 'f2 - reverse' );
			assert.areSame( CKEDITOR.ENTER_BR, filter3.getAllowedEnterMode( CKEDITOR.ENTER_P ), 'f3' );
			assert.areSame( CKEDITOR.ENTER_BR, filter3.getAllowedEnterMode( CKEDITOR.ENTER_P, true ), 'f3 - reverse' );
			assert.areSame( CKEDITOR.ENTER_P, filter4.getAllowedEnterMode( CKEDITOR.ENTER_P ), 'f4' );
			assert.areSame( CKEDITOR.ENTER_P, filter4.getAllowedEnterMode( CKEDITOR.ENTER_P, true ), 'f4a - reverse' );
			assert.areSame( CKEDITOR.ENTER_BR, filter4.getAllowedEnterMode( CKEDITOR.ENTER_BR, true ), 'f4b - reverse' );
		},

		'test destroy': function() {
			var filter = new CKEDITOR.filter( 'p' ),
				id = filter.id;

			assert.areSame( filter, CKEDITOR.filter.instances[ id ], 'filter is registered before destroy' );

			filter.destroy();
			assert.isFalse( id in CKEDITOR.filter.instances, 'filter is not registered after destroy' );
			assert.isFalse( '_' in filter, 'filter\'s private parts are deleted' );
			assert.isFalse( 'allowedContent' in filter, 'filter.allowedContent is deleted' );
			assert.isFalse( 'disallowedContent' in filter, 'filter.disallowedContent is deleted' );
		}
	} );
} )();
