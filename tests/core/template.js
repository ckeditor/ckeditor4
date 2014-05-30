/* bender-tags: editor,unit,template */

( function() {
	'use strict';

	bender.test( {
		'template output string' : function() {
			var tpl = new CKEDITOR.template( '<a href="#" id="{id}" title="{text}">{text}</a>' );

			// Unspecified variables should remain.
			assert.areSame( '<a href="#" id="{id}" title="{text}">{text}</a>', tpl.output( {} ) );
			assert.areSame( '<a href="#" id="btn" title="{text}">{text}</a>', tpl.output( { id : 'btn' } ) );

			assert.areSame( '<a href="#" id="btn" title="foo">foo</a>', tpl.output( { id : 'btn', text : 'foo' } ) );
		},

		'add/retrieve global template' : function() {
			// Customize one of the following templates.
			CKEDITOR.on( 'template', function( evt ) {
				var data = evt.data;
				if ( data.name == 'tpl2' )
					data.source = '{foo},{foo}';
			} );

			// Define new templates.
			var tpl = CKEDITOR.addTemplate( 'tpl1', '{foo}' );
			var params = { foo : 'bar' };
			assert.areSame( 'bar', tpl.output( params ) );

			tpl = CKEDITOR.addTemplate( 'tpl2', '{foo}' );
			assert.areSame( 'bar,bar', tpl.output( params ) );

			// Retrieval.
			tpl = CKEDITOR.getTemplate( 'tpl1' );
			assert.areSame( 'bar', tpl.output( params ) );
			tpl = CKEDITOR.getTemplate( 'tpl2' );
			assert.areSame( 'bar,bar', tpl.output( params ) );
		},

		'undefined placeholder replacement': function() {
			// If variable is not specified in variables object, it should
			// left untouched.
			this.assertTemplateOutput( '{name}', '{name}', {} );
		},

		'special characters: single quote': function() {
			this.assertTemplateOutput( '\'', '\'' );
		},

		'special characters (in replacement): single quote': function() {
			this.assertTemplateOutput( "'", "{str}", { str: "'" } );
		},

		'special characters: escaped single quote': function() {
			this.assertTemplateOutput( "\\'", "\\'" );
		},

		'special characters: escaped double quote': function() {
			this.assertTemplateOutput( '\\"', '\\"' );
		},

		'special characters: new line': function() {
			this.assertTemplateOutput( '\n', '\n' );
		},

		'special characters: new line (windows-style)': function() {
			this.assertTemplateOutput( '\r\n', '\r\n' );
		},

		'special characters: new line (mac-style)': function() {
			this.assertTemplateOutput( '\r', '\r' );
		},

		'special characters (in replacement): new line': function() {
			this.assertTemplateOutput( '\n', '{str}', { str: '\n' } );
		},

		'special characters: space': function() {
			this.assertTemplateOutput( ' ', ' ' );
		},

		'check unicode replacement': function() {
			this.assertTemplateOutput( '¥¦¨«µåæî ¥¦¨«µåæî!', '¥¦¨«µåæî {replacement}!', { replacement: '¥¦¨«µåæî' } );
		},

		'code replacement': function() {
			this.assertTemplateOutput( "alert('foo!')", '{code}', { code: "alert('foo!')" } );
		},

		'code replacement double quotes': function() {
			this.assertTemplateOutput( 'alert("foo!")', '{code}', { code: 'alert("foo!")' } );
		},

		// Creates a template for given string and checks its output
		// @param {String} expected Expected template output.
		// @param {String} templateString Template input string.
		// @param {Object} replacementObject Optional object containing variables.
		assertTemplateOutput: function( expected, templateString, replacementObject ) {
			var tpl = new CKEDITOR.template( templateString );
			replacementObject = replacementObject || {};
			assert.areEqual( expected, tpl.output( replacementObject ) );
		}
	} );
} )();