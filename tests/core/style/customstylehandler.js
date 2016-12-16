/* bender-tags: editor,unit */

( function() {
	'use strict';

	bender.editors = {
		editor: {
			name: 'editor1'
		}
	};

	bender.test( {
		'test addCustomHandler registers custom handler': function() {
			CKEDITOR.style.addCustomHandler( {
				type: 'testAdd1'
			} );

			assert.isTrue( 'testAdd1' in CKEDITOR.style.customHandlers );
		},

		'test addCustomHandler returns class inheriting from CKEDITOR.style': function() {
			var styleClass = CKEDITOR.style.addCustomHandler( {
					type: 'testAdd2',
					foo: 1,
					apply: 2
				} ),
				style = new styleClass( {} );

			assert.isInstanceOf( CKEDITOR.style, style, 'returned class inherits from CKEDITOR.style' );
			assert.isInstanceOf( styleClass, style, 'returned constructor creates proper instances' );
			assert.areSame( 'testAdd2', style.type, 'style instance has a type' );
			assert.areSame( 1, styleClass.prototype.foo, 'prototype of style class contains properties defined in custom handler' );
			assert.areSame( 2, style.apply, 'existing CKEDITOR.style\'s method has been overriden' );
		},

		'test custom style constructor sets _.definition': function() {
			var styleClass = CKEDITOR.style.addCustomHandler( {
					type: 'testCustomStyleConstructor1'
				} ),
				styleDefinition = {},
				style = new styleClass( styleDefinition );

			assert.areSame( styleDefinition, style._.definition );
		},

		'test CKEDITOR.style constructor returns custom styles if styleDefinition.type is set': function() {
			var styleClass1 = CKEDITOR.style.addCustomHandler( {
					type: 'testStyleConstructor1'
				} ),
				styleClass2 = CKEDITOR.style.addCustomHandler( {
					type: 'testStyleConstructor2'
				} );

			var instance = new CKEDITOR.style( {
				type: 'testStyleConstructor1'
			} );
			assert.isInstanceOf( styleClass1, instance );

			instance = new CKEDITOR.style( {
				type: 'testStyleConstructor2'
			} );
			assert.isInstanceOf( styleClass2, instance );
		},

		'test setup': function() {
			var setupCalled = [],
				styleClass = CKEDITOR.style.addCustomHandler( {
					type: 'testSetup1',
					setup: function( definition ) {
						setupCalled.push( definition.foo );
						assert.isInstanceOf( styleClass, this, 'setup executed in style class context' );
					}
				} );

			new styleClass( { foo: 'a' } );
			assert.areSame( 'a', setupCalled.join( ',' ), 'setup called when instantiating style directly' );

			new CKEDITOR.style( { type: 'testSetup1', foo: 'b' } );
			assert.areSame( 'a,b', setupCalled.join( ',' ), 'setup called when instantiating style with CKEDITOR.style' );
		},

		'test assignedTo': function() {
			var styleClass1 = CKEDITOR.style.addCustomHandler( {
					type: 'testAssignedTo1'
				} ),
				styleClass2 = CKEDITOR.style.addCustomHandler( {
					type: 'testAssignedTo2',
					assignedTo: CKEDITOR.STYLE_INLINE
				} );

			var style1a = new styleClass1( {} ),
				style1b = new CKEDITOR.style( { type: 'testAssignedTo1' } ),
				style2a = new styleClass2( {} ),
				style2b = new CKEDITOR.style( { type: 'testAssignedTo2' } );

			assert.areSame( CKEDITOR.STYLE_OBJECT, style1a.assignedTo, 'default - custom class constructor' );
			assert.areSame( CKEDITOR.STYLE_OBJECT, style1b.assignedTo, 'default - CKEDITOR.style constructor' );
			assert.areSame( CKEDITOR.STYLE_INLINE, style2a.assignedTo, 'specified - custom class constructor' );
			assert.areSame( CKEDITOR.STYLE_INLINE, style2b.assignedTo, 'specified - CKEDITOR.style constructor' );
		},

		'test editor#applyStyle and editor#removeStyle execute custom style methods': function() {
			var applied = 0,
				removed = 0;

			CKEDITOR.style.addCustomHandler( {
				type: 'testEditorMethods1',
				apply: function() {
					applied += 1;
				},
				remove: function() {
					removed += 1;
				}
			} );

			var style = new CKEDITOR.style( { type: 'testEditorMethods1' } );

			this.editors.editor.applyStyle( style );
			assert.areSame( 1, applied, 'custom apply method was executed' );

			this.editors.editor.removeStyle( style );
			assert.areSame( 1, removed, 'custom remove method was executed' );
		}
	} );
} )();