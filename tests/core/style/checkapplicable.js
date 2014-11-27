/* bender-tags: editor,unit */

( function() {

	'use strict';

	bender.editor = true;

	var doc = CKEDITOR.document,
		tcs = {};

	function getStyle( definitionOrStyle, enterMode ) {
		if ( definitionOrStyle instanceof CKEDITOR.style )
			return definitionOrStyle;

		var style = new CKEDITOR.style( definitionOrStyle );

		// We need to do what stylescombo/format plugins do internally.
		style._.enterMode = enterMode || CKEDITOR.ENTER_P;

		return style;
	}

	function assertCheckApplicable( containerName, definitionOrStyle, expected, htmlWithRange, filter ) {
		var container = new CKEDITOR.dom.element( containerName );
		container.setAttribute( 'contenteditable', 'true' );
		doc.getBody().append( container );

		var range = bender.tools.setHtmlWithRange( container, expandShortcuts( htmlWithRange ), container )[ 0 ],
			start = range.startContainer;

		if ( start.type != CKEDITOR.NODE_ELEMENT )
			start = start.getParent();

		var applicable = getStyle( definitionOrStyle ).checkApplicable( new CKEDITOR.dom.elementPath( start, container ), filter );

		assert.areSame( expected, applicable );
	}

	function createAssertionFunction( tcs, tcsGroupName, definitionOrStyle ) {
		var style = getStyle( definitionOrStyle );

		return function( expected, containerName, htmlWithRange, filterRules, msg ) {
			var name = tcsGroupName + ' - ' + msg,
				filter;

			if ( filterRules )
				filter = new CKEDITOR.filter( filterRules );

			if ( tcs[ name ] )
				throw new Error( 'Test named "' + name + '" already exists' );

			tcs[ name ] = function() {
				assertCheckApplicable( containerName, style, expected, htmlWithRange, filter );
			};
		};
	}

	function expandShortcuts( html ) {
		return html
			.replace( /@c=t/g, 'contenteditable="true"' )
			.replace( /@c=f/g, 'contenteditable="false"' )
			.replace( /@f=(\d+)/g, 'data-cke-filter="$1"' );
	}

	var a = createAssertionFunction( tcs, 'test block style', { element: 'h1' } );

	a( true, 'div', '<p>a^b</p>', null, 'tc1' );
	a( true, 'div', '<div @c=f><div @c=t>a^b</div></div>', null, 'tc2' );
	a( false, 'p', 'a^b', null, 'tc3' );
	a( false, 'div', '<div @c=f><p @c=t>a^b</p></div>', null, 'tc4' );

	a = createAssertionFunction( tcs, 'test inline style', { element: 'b' } );

	a( true, 'div', '<p>a^b</p>', null, 'tc1' );
	a( true, 'div', '<div @c=f><div @c=t>a^b</div></div>', null, 'tc2' );
	a( true, 'p', 'a^b', null, 'tc3' );
	a( true, 'div', '<div @c=f><p @c=t>a^b</p></div>', null, 'tc4' );

	a = createAssertionFunction( tcs, 'test filter', { element: 'p', attributes: { 'class': 'foo' } } );

	a( true, 'div', '<div>a^b</div>', 'p(foo)', 'tc1' );
	a( false, 'div', '<div>a^b</div>', 'p(bar)', 'tc2' );

	CKEDITOR.tools.extend( tcs, {
		// Since CKEditor 4.4 editor instance replaced filter  as checkApplicable's second argument.
		// Make sure that discovering arguments order works.
		'test checkApplicable arguments (filter vs editor) discovery': function() {
			var editor = this.editor,
				style = getStyle( { element: 'p', attributes: { 'class': 'foo' } } ),
				filter = new CKEDITOR.filter( 'p(bar)' );

			this.editorBot.setHtmlWithSelection( '<p>^foo</p>' );
			assert.isTrue( style.checkApplicable( editor.elementPath(), editor ), 'style is applicable' );
			assert.isFalse( style.checkApplicable( editor.elementPath(), editor, filter ),
				'style is not applicable when filter does not allow it' );
			assert.isFalse( style.checkApplicable( editor.elementPath(), filter ),
				'style is not applicable when filter passed as 2nd argument does not allow it' );
		}
	} );

	bender.test( tcs );

} )();