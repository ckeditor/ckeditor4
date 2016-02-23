/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
/* bender-include: _helpers/tools.js*/
( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				allowedContent: true
			}
		},

		inline: {
			creator: 'inline',
			config: {
				allowedContent: true
			}
		}
	};

	var tests = {
		'test applying style on collapsed selection': function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' ),
				style, element, range;

			bender.tools.selection.setWithHtml( editor, '<p><s>Copy t{}hat format</s> to <b>this element</b></p>' );

			editor.execCommand( 'copyFormatting' );
			assert.areSame( CKEDITOR.TRISTATE_ON, cmd.state );
			assert.isArray( cmd.styles );
			assert.areSame( 1, cmd.styles.length );
			assert.isInstanceOf( CKEDITOR.style, cmd.styles[ 0 ] );
			style = cmd.styles[ 0 ];

			// Select text node inside element (as the text is selected when element is clicked).
			element = editor.editable().findOne( 'b' ).getChild( 0 );
			range = editor.createRange();
			range.setStart( element, 1 );
			range.setEnd( element, 1 );
			range.collapse();
			range.select();

			editor.execCommand( 'applyFormatting' );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state );
			assert.isNull( cmd.styles );
			assert.isTrue( style.checkActive( new CKEDITOR.dom.elementPath( element, editor.editable() ), editor ) );
		},

		'test applying style by on uncollapsed selection': function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' ),
				style, element, range;

			bender.tools.selection.setWithHtml( editor, '<p><s>Copy t{}hat format</s> to <b>this element</b></p>' );

			editor.execCommand( 'copyFormatting' );
			assert.areSame( CKEDITOR.TRISTATE_ON, cmd.state );
			assert.isArray( cmd.styles );
			assert.areSame( 1, cmd.styles.length );
			assert.isInstanceOf( CKEDITOR.style, cmd.styles[ 0 ] );
			style = cmd.styles[ 0 ];

			// Select text node inside element (as user would click on it, not element itself).
			element = editor.editable().findOne( 'b' ).getChild( 0 );
			range = editor.createRange();
			range.setStart( element, 0 );
			range.setEnd( element, 6 );
			range.select();

			editor.execCommand( 'applyFormatting' );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state );
			assert.isNull( cmd.styles );
			assert.isTrue( style.checkActive( new CKEDITOR.dom.elementPath( element, editor.editable() ), editor ) );
		},

		'test applying style from ambiguous initial selection': function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' ),
				style, element, range;

			bender.tools.selection.setWithHtml( editor, '<p><s>Copy {t</s><span class="font-weight: bold">h}at</span> format</s> to <b>this element</b></p>' );

			editor.execCommand( 'copyFormatting' );
			assert.areSame( CKEDITOR.TRISTATE_ON, cmd.state );
			assert.isArray( cmd.styles );
			assert.areSame( 1, cmd.styles.length );
			assert.isInstanceOf( CKEDITOR.style, cmd.styles[ 0 ] );
			style = cmd.styles[ 0 ];
			objectAssert.areDeepEqual( {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			}, style._.definition );

			// Select text node inside element (as user would click on it, not element itself).
			element = editor.editable().findOne( 'b' ).getChild( 0 );
			range = editor.createRange();
			range.setStart( element, 1 );
			range.setEnd( element, 1 );
			range.collapse();
			range.select();

			editor.execCommand( 'applyFormatting' );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state );
			assert.isNull( cmd.styles );
			assert.isTrue( style.checkActive( new CKEDITOR.dom.elementPath( element, editor.editable() ), editor ) );
		},

		'test applying style using keystrokes': function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' ),
				style, element, range;

			bender.tools.selection.setWithHtml( editor, '<p><s>Copy t{}hat format</s> to <b>this element</b></p>' );

			editor.execCommand( 'copyFormatting', { from: 'keystrokeHandler' } );
			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state );
			assert.isArray( cmd.styles );
			assert.areSame( 1, cmd.styles.length );
			assert.isInstanceOf( CKEDITOR.style, cmd.styles[ 0 ] );
			style = cmd.styles[ 0 ];
			objectAssert.areDeepEqual( {
				element: 's',
				attributes: {},
				styles: {},
				type: CKEDITOR.STYLE_INLINE
			}, style._.definition );

			// Select text node inside element (as user would click on it, not element itself).
			element = editor.editable().findOne( 'b' ).getChild( 0 );
			range = editor.createRange();
			range.setStart( element, 1 );
			range.setEnd( element, 1 );
			range.collapse();
			range.select();

			editor.execCommand( 'applyFormatting', { from: 'keystrokeHandler' } );

			assert.areSame( CKEDITOR.TRISTATE_OFF, cmd.state );
			assert.isArray( cmd.styles );
			assert.isTrue( style.checkActive( new CKEDITOR.dom.elementPath( element, editor.editable() ), editor ) );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
}() );
