/* bender-tags: editor */

'use strict';

bender.editor = {
	config: {
		allowedContent: true, // Disable filter.
		removePlugins: 'htmlwriter'
	}
};

var simpleStyles = {
	inline: { element: 'span', attributes: { 'class': 'foo' }, styles: { 'font-weight': 'bold' } },
	block: { element: 'h1', attributes: { 'class': 'foo' }, styles: { 'text-align': 'right' } },
	object: { element: 'img', attributes: { 'class': 'foo' }, styles: { 'float': 'left' } }
};

function simpleStyle( type ) {
	return new CKEDITOR.style( simpleStyles[ type ] );
}

function expandShortcuts( html ) {
	return html
		.replace( /@c=t/g, 'contenteditable="true"' )
		.replace( /@c=f/g, 'contenteditable="false"' );
}

function makeShortcuts( html ) {
	return html
		.replace( /contenteditable="true"/g, '@c=t' )
		.replace( /contenteditable="false"/g, '@c=f' );
}


bender.test( {
	assertApplyStyle: function( source, expection, style, isRemoval ) {
		this.applyStyle( source, style, isRemoval );

		var output = this.editorBot.htmlWithSelection( this.editor );
		output = makeShortcuts( bender.tools.fixHtml( output ) );

		var msg = [];
		msg.push( ( isRemoval ? 'remove' : 'apply' ) + ' style fails on input:' );
		msg.push( source );
		msg.push( 'with style:' );
		msg.push( style.buildPreview() );
		msg = msg.join( '\n' );

		assert.areSame( expection, output, msg );
	},

	applyStyle: function( source, style, isRemoval ) {
		this.editorBot.setHtmlWithSelection( expandShortcuts( source ) );
		this.editor[ isRemoval ? 'removeStyle' : 'applyStyle' ]( style );
	},

	assertRemoveStyle: function( source, expection, style ) {
		this.assertApplyStyle( source, expection, style, 1 );
	},

	assertApplyStyleOnFake: function( source, expection, style, isRemoval ) {
		var editor = this.editor,
			bot = this.editorBot;

		bot.setData( expandShortcuts( source ), function() {
			editor.getSelection().fake( editor.document.getById( 'fake' ) );

			editor[ isRemoval ? 'removeStyle' : 'applyStyle' ]( style );

			var sel = editor.getSelection();
			assert.areSame( expection, makeShortcuts( bender.tools.compatHtml( editor.getData(), 0, 1 ) ), 'data' );
			assert.isTrue( !!sel.isFake, 'sel.isFake' );
			assert.areSame( editor.document.getById( 'fake' ), sel.getSelectedElement(), 'sel.getSelectedElement()' );
		} );
	},

	assertRemoveStyleFromFake: function( source, expection, style ) {
		this.assertApplyStyleOnFake( source, expection, style, 1 );
	},

	'test apply/remove style on editor - basic': function() {
		var inline = simpleStyle( 'inline' );

		// ranged
		this.assertApplyStyle( '<p>[foo]</p>', '<p><span class="foo" style="font-weight:bold;">[foo]</span></p>', inline );
		this.assertRemoveStyle( '<p><span class="foo" style="font-weight:bold;">[foo]</span></p>', '<p>[foo]</p>', inline );

		// collapsed
		this.assertApplyStyle( '<p>foo^</p>', '<p>foo<span class="foo" style="font-weight:bold;">^</span></p>', inline );
		this.assertApplyStyle( '<p>^</p>', '<p><span class="foo" style="font-weight:bold;">^</span></p>', inline );

		var block = simpleStyle( 'block' );

		// block
		this.assertApplyStyle( '<p>foo^</p>', '<h1 class="foo" style="text-align:right;">foo^</h1>', block );
		this.assertRemoveStyle( '<h1 class="foo" style="text-align:right;">foo^</h1>', '<p>foo^</p>', block );

		var obj = simpleStyle( 'object' );

		// object
		this.assertApplyStyle( '<p>[<img />]</p>', '<p>[<img class="foo" style="float:left;" />]</p>', obj );
		this.assertRemoveStyle( '<p>[<img class="foo" style="float:left;" />]</p>', '<p>[<img />]</p>', obj );
	},

	'test apply inline style on non-editable inline element - at non-editable inline boundary': function() {
		// https://dev.ckeditor.com/ticket/11242
		if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
			assert.ignore();
		}

		var style = new CKEDITOR.style( { element: 'b', includeReadonly: true } );

		this.assertApplyStyle( '<p>a[<i @c=f>a</i>x<u @c=f>a</u>]b</p>', '<p>a<b>[<i @c=f>a</i>x<u @c=f>a</u>]</b>b</p>', style );
	},

	'test remove inline style from non-editable inline element - at non-editable inline boundary': function() {
		// https://dev.ckeditor.com/ticket/11242
		if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
			assert.ignore();
		}

		var style = new CKEDITOR.style( { element: 'b', includeReadonly: true } );

		this.assertRemoveStyle( '<p>a<b>[<i @c=f>a</i>x<u @c=f>a</u>]</b>b</p>', '<p>a[<i @c=f>a</i>x<u @c=f>a</u>]b</p>', style );
	},

	'test apply inline style on inline element with non-editable element inside': function() {
		var style = new CKEDITOR.style( { element: 'b', includeReadonly: true } );

		this.assertApplyStyle( '<p>a[<s><i @c=f>a</i></s>]b</p>', '<p>a<b><s>[<i @c=f>a</i>]</s></b>b</p>', style );
	},

	'test remove inline style from inline element with non-editable element inside': function() {
		var style = new CKEDITOR.style( { element: 'b', includeReadonly: true } );

		this.assertRemoveStyle( '<p>a<b>[<s><i @c=f>a</i></s>]</b>b</p>', '<p>a<s>[<i @c=f>a</i>]</s>b</p>', style );
	},

	'test apply block style in block with non-editable inline element': function() {
		var style = new CKEDITOR.style( { element: 'h1' } );

		this.assertApplyStyle( '<p>a<i @c=f>b</i>c^d</p>', '<h1>a<i @c=f>b</i>c^d</h1>', style );
	},

	'test apply inline style on non-editable inline element': function() {
		var style = new CKEDITOR.style( { element: 'b', includeReadonly: true } );

		this.assertApplyStyleOnFake( '<p>a<i @c=f id="fake">a</i>b</p>', '<p>a<b><i @c=f id="fake">a</i></b>b</p>', style );
	},

	'test remove inline style from non-editable inline element': function() {
		var style = new CKEDITOR.style( { element: 'b', includeReadonly: true } );

		this.assertRemoveStyleFromFake( '<p>a<b><i @c=f id="fake">a</i></b>b</p>', '<p>a<i @c=f id="fake">a</i>b</p>', style );
	},

	'test apply inline style on non-editable block element': function() {
		var style = new CKEDITOR.style( { element: 'b', includeReadonly: true } );

		this.assertApplyStyleOnFake( '<p>x</p><div @c=f id="fake">a</div><p>x</p>', '<p>x</p><div @c=f id="fake">a</div><p>x</p>', style );
	},

	'test remove inline style from non-editable block element': function() {
		var style = new CKEDITOR.style( { element: 'b', includeReadonly: true } );

		this.assertRemoveStyleFromFake( '<p>x</p><div @c=f id="fake">a</div><p>x</p>', '<p>x</p><div @c=f id="fake">a</div><p>x</p>', style );
	},

	'test apply inline style on non-editable block element with nested editable': function() {
		var style = new CKEDITOR.style( { element: 'b', includeReadonly: true } );

		this.assertApplyStyleOnFake( '<p>x</p><div @c=f id="fake">a<div @c=t>b</div></div><p>x</p>', '<p>x</p><div @c=f id="fake">a<div @c=t><b>b</b></div></div><p>x</p>', style );
	},

	'test remove inline style from non-editable block element with nested editable': function() {
		var style = new CKEDITOR.style( { element: 'b', includeReadonly: true } );

		this.assertRemoveStyleFromFake( '<p>x</p><div @c=f id="fake">a<div @c=t><b>b</b></div></div><p>x</p>', '<p>x</p><div @c=f id="fake">a<div @c=t>b</div></div><p>x</p>', style );
	},

	'test apply block style on non-editable inline element': function() {
		var style = new CKEDITOR.style( { element: 'h1' } );

		this.assertApplyStyleOnFake( '<h1>a<i @c=f id="fake">a</i>b</h1>', '<h1>a<i @c=f id="fake">a</i>b</h1>', style );
	},

	'test remove block style from non-editable inline element': function() {
		var style = new CKEDITOR.style( { element: 'h1' } );
		style._.enterMode = CKEDITOR.ENTER_P; // We're forced to do here what format plugin does internally. This is bad!

		this.assertRemoveStyleFromFake( '<h1>a<i @c=f id="fake">a</i>b</h1>', '<p>a<i @c=f id="fake">a</i>b</p>', style );
	},

	'test apply block style on non-editable block element': function() {
		var style = new CKEDITOR.style( { element: 'h1' } );

		this.assertApplyStyleOnFake( '<p>x</p><div @c=f id="fake">a</div><p>x</p>', '<p>x</p><div @c=f id="fake">a</div><p>x</p>', style );
	},

	'test remove block style from non-editable block element': function() {
		var style = new CKEDITOR.style( { element: 'h1' } );
		style._.enterMode = CKEDITOR.ENTER_P; // We're forced to do here what format plugin does internally. This is bad!

		this.assertRemoveStyleFromFake( '<p>x</p><div @c=f id="fake">a</div><p>x</p>', '<p>x</p><div @c=f id="fake">a</div><p>x</p>', style );
	},

	'test apply block style on non-editable block element with nested editable': function() {
		var style = new CKEDITOR.style( { element: 'h1' } );

		this.assertApplyStyleOnFake( '<p>x</p><div @c=f id="fake">a<div @c=t>b</div></div><p>x</p>', '<p>x</p><div @c=f id="fake">a<div @c=t><h1>b</h1></div></div><p>x</p>', style );
	},

	'test remove block style from non-editable block element with nested editable': function() {
		var style = new CKEDITOR.style( { element: 'h1' } );
		style._.enterMode = CKEDITOR.ENTER_P; // We're forced to do here what format plugin does internally. This is bad!

		this.assertRemoveStyleFromFake( '<p>x</p><div @c=f id="fake">a<div @c=t><h1>b</h1></div></div><p>x</p>', '<p>x</p><div @c=f id="fake">a<div @c=t><p>b</p></div></div><p>x</p>', style );
	},

	'test apply block style in blockless nested editable': function() {
		var style = new CKEDITOR.style( { element: 'h1' } );

		this.assertApplyStyle( '<p>x</p><div @c=f><p @c=t>a^b</p></div>', '<p>x</p><div @c=f><p @c=t>a^b</p></div>', style );
	},

	'test remove block style in blockless nested editable': function() {
		var style = new CKEDITOR.style( { element: 'h1' } );

		this.assertRemoveStyle( '<p>x</p><div @c=f><h1 @c=t>a^b</h1></div>', '<p>x</p><div @c=f><h1 @c=t>a^b</h1></div>', style );
	},

	'test br filler is preserved when applying block style': function() {
		if ( !CKEDITOR.env.needsBrFiller )
			assert.ignore();

		this.applyStyle( '<p>^<br></p>', new CKEDITOR.style( { element: 'h1' } ) );

		assert.areSame( '<h1><br /></h1>', bender.tools.compatHtml( this.editor.editable().getHtml() ) );
	},

	'test editor#removeStyle for p mode': function() {
		this.editorBot.setHtmlWithSelection( '<h1>[foobar]</h1>' );
		this.editor.removeStyle( new CKEDITOR.style( { element: 'h1' } ) );

		assert.areEqual( '<p>foobar</p>', this.editor.getData(), 'Invalid editor#getData() result' );
	},

	'test editor#removeStyle with custom style._.enterMode': function() {
		/**
		 * In this TC styleObj has enterMode given explicitly, so it should
		 * not use enterMode of editor.
		 */
		var styleObj = new CKEDITOR.style( { element: 'h1' } );
		styleObj._.enterMode = CKEDITOR.ENTER_DIV;

		this.editorBot.setHtmlWithSelection( '<h1>[foobar]</h1>' );
		this.editor.removeStyle( styleObj );

		assert.areEqual( '<div>foobar</div>', this.editor.getData(), 'Invalid editor#getData() result' );
		assert.areSame( CKEDITOR.ENTER_DIV, styleObj._.enterMode, 'styleObj._.enterMode should not be changed' );
	},

	'test editor#removeStyle for div mode': function() {
		bender.editorBot.create( {
			name: 'editor_enter_div',
			config: {
				enterMode: CKEDITOR.ENTER_DIV
			}
		},
		function( bot ) {
			bot.setHtmlWithSelection( '<h1>[foobar]</h1>' );
			bot.editor.removeStyle( new CKEDITOR.style( { element: 'h1' } ) );
			assert.areEqual( '<div>foobar</div>', bot.editor.getData(), 'Invalid editor#getData() result for DIV enterMode' );

			bot.setHtmlWithSelection( '<h1>[foobar]</h1>' );
			var st = new CKEDITOR.style( { element: 'h1' } );
			st._.enterMode = CKEDITOR.ENTER_P;
			bot.editor.removeStyle( st );
			assert.areEqual( '<p>foobar</p>', bot.editor.getData(), 'Invalid editor#getData() result for style with hardcoded P enterMode' );
		} );
	},

	'test editor#removeStyle for br mode': function() {
		bender.editorBot.create( {
			name: 'editor_enter_br',
			config: {
				enterMode: CKEDITOR.ENTER_BR
			}
		},
		function( bot ) {
			bot.setHtmlWithSelection( '<h1>[foobar]</h1>' );
			bot.editor.removeStyle( new CKEDITOR.style( { element: 'h1' } ) );
			assert.areEqual( 'foobar', bot.editor.getData(), 'Invalid editor#getData() result for BR enterMode' );
		} );
	},

	'test editor#removeStyle, editor#applyStyle not changing styles _.enterMode value': function() {
		// We need to make sure that editor#removeStyle() will not revert original
		// enterMode value after it has done its job.
		this.editorBot.setHtmlWithSelection( '<h1>[foobar]</h1>' );
		var styleObj = new CKEDITOR.style( { element: 'h1' } );
		this.editor.removeStyle( styleObj );
		assert.areSame( undefined, styleObj._.enterMode, 'Invalid value for styleObj._.enterMode after editor#removeStyle()' );

		this.editor.applyStyle( styleObj );
		assert.areSame( undefined, styleObj._.enterMode, 'Invalid value for styleObj._.enterMode after editor#applyStyle()' );
	}
} );
