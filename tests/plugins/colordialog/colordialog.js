/* bender-tags: editor */
/* bender-ckeditor-plugins: colordialog,wysiwygarea */

( function() {
	'use strict';

	bender.editor = {};

	var test = {
		'test colordialog add hash to colors 6 digits': function() {
			var editor = this.editor;

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;
				dialog.setValueOf( 'picker', 'selectedColor', '123456' );
				dialog.getButton( 'ok' ).click();

			} );

			editor.getColorFromDialog( function( color ) {
				resume( function() {
					assert.areSame( '#123456', color );
				} );
			} );
			wait();
		},

		'test colordialog add hash to colors 3 digits': function() {
			var editor = this.editor;

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;
				dialog.setValueOf( 'picker', 'selectedColor', 'FDE' );
				dialog.getButton( 'ok' ).click();

			} );

			editor.getColorFromDialog( function( color ) {
				resume( function() {
					assert.areSame( '#FDE', color );
				} );
			} );
			wait();
		},

		'test colordialog does not add hash 1 digit': function() {
			var editor = this.editor;

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;
				dialog.setValueOf( 'picker', 'selectedColor', '3' );
				dialog.getButton( 'ok' ).click();

			} );

			editor.getColorFromDialog( function( color ) {
				resume( function() {
					assert.areSame( '3', color );
				} );
			} );
			wait();
		},

		'test colordialog does not add hash color name': function() {
			var editor = this.editor;

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;
				dialog.setValueOf( 'picker', 'selectedColor', 'red' );
				dialog.getButton( 'ok' ).click();

			} );

			editor.getColorFromDialog( function( color ) {
				resume( function() {
					assert.areSame( 'red', color );
				} );
			} );
			wait();
		},

		'test colordialog does not add hash rgb': function() {
			var editor = this.editor;

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;
				dialog.setValueOf( 'picker', 'selectedColor', 'rgb(10, 20, 30)' );
				dialog.getButton( 'ok' ).click();

			} );

			editor.getColorFromDialog( function( color ) {
				resume( function() {
					assert.areSame( 'rgb(10, 20, 30)', color );
				} );
			} );
			wait();
		},

		'test colordialog does not add hash empty value': function() {
			var editor = this.editor;

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;
				dialog.setValueOf( 'picker', 'selectedColor', '' );
				dialog.getButton( 'ok' ).click();

			} );

			editor.getColorFromDialog( function( color ) {
				resume( function() {
					assert.areSame( '', color );
				} );
			} );
			wait();
		}
	};

	bender.test( test );

} )();
