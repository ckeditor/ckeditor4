/* bender-tags: balloontoolbar */
/* bender-ckeditor-plugins: balloontoolbar,button,richcombo */
/* bender-include: _helpers/default.js */

( function() {
	'use strict';

	bender.editor = {};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'balloontoolbar' );
		},

		'test adding buttion': function() {
			var panel = new CKEDITOR.ui.balloonToolbar( this.editor );
			panel.addItems( {
				cut: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'cut'
				} )
			} );
			assert.isInstanceOf( CKEDITOR.ui.button, panel.getItem( 'cut' ), 'Registered button type.' );
		},

		'test removing buttion': function() {
			var panel = new CKEDITOR.ui.balloonToolbar( this.editor );
			panel.addItems( {
				cut: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'cut'
				} )
			} );
			assert.isInstanceOf( CKEDITOR.ui.button, panel.getItem( 'cut' ), 'Registered button type.' );
			panel.deleteItem( 'cut' );
			assert.isUndefined( panel.getItem( 'cut' ), 'The button should be deleted.' );
		},

		'test button group wrapping': function() {
			var panel = new CKEDITOR.ui.balloonToolbar( this.editor );
			panel.addItems( {
				cut: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'cut'
				} )
			} );
			panel._view.renderItems( panel._items );
			assert.isNotNull( panel._view.parts.content.findOne( '.cke_toolgroup' ), 'Button should be wrapped in group' );
		},

		'test group wrapping omitting rich combo': function() {
			var panel = new CKEDITOR.ui.balloonToolbar( this.editor );
			panel.addItems( {
				rich: new CKEDITOR.ui.richCombo( {
					className: 'richCombo',
					panel: {
						css: [],
						multiSelect: false
					},
					init: function() {},
					onClick: function() {},
					onRender: function() {}
				} )
			} );
			panel._view.renderItems( panel._items );
			assert.isNull( panel._view.parts.content.findOne( '.cke_toolgroup' ), 'Checkbox should not be wrapped in group' );
		},

		'test group wrapping omiting rich combo at the beginning': function() {
			var panel = new CKEDITOR.ui.balloonToolbar( this.editor );
			panel.addItems( {
				rich: new CKEDITOR.ui.richCombo( {
					className: 'richCombo',
					panel: {
						css: [],
						multiSelect: false
					},
					init: function() {},
					onClick: function() {},
					onRender: function() {}
				} ),
				cut: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'cut'
				} )
			} );
			panel._view.renderItems( panel._items );
			assert.areEqual( 1, panel._view.parts.content.find( '.cke_toolgroup' ).count(), 'There should be only one toolgroup' );
			assert.isNull( panel._view.parts.content.findOne( '.cke_toolgroup' ).findOne( '.richCombo' ), 'Rich combo should not be inside toolgroup' );

		},

		'test mixed group': function() {
			var panel = new CKEDITOR.ui.balloonToolbar( this.editor );
			panel.addItems( {
				test: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'cut'
				} ),
				rich: new CKEDITOR.ui.richCombo( {
					className: 'richCombo',
					panel: {
						css: [],
						multiSelect: false
					},
					init: function() {},
					onClick: function() {},
					onRender: function() {}
				} ),
				cut: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'cut'
				} )
			} );
			panel._view.renderItems( panel._items );
			assert.areEqual( 2, panel._view.parts.content.find( '.cke_toolgroup' ).count(), 'There should be two toolgroups' );
		}
	};

	bender.test( tests );
} )();
