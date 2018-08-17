/* bender-tags: editor */
/* bender-ckeditor-plugins: list,toolbar,table,format */

bender.editor = {
	config: {
		enterMode: CKEDITOR.ENTER_P
	}
};

var BACKSPACE = 8,
	DEL = 46;

var tests = {
	assertBackspace: function( name, key, keyModifiers, assertFn ) {
		var bot = this.editorBot;
		bender.tools.testInputOut( name, function( source, expected ) {
			bot.setHtmlWithSelection( source );

			bot.editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
				keyCode: key,
				ctrlKey: keyModifiers & CKEDITOR.CTRL,
				shiftKey: keyModifiers & CKEDITOR.SHIFT
			} ) );

			assert.isInnerHtmlMatching( bender.tools.compatHtml( expected ), bender.tools.selection.getWithHtml( bot.editor ), {
				compareSelection: true,
				normalizeSelection: true
			}, name );

			if ( typeof assertFn === 'function' ) {
				assertFn( bot.editor );
			}
		}, false );
	}
};

// Start of https://dev.ckeditor.com/ticket/8248
addTests( 'test backspace join list items', 'join_list1', BACKSPACE );
addTests( 'test backspace join list items', 'join_list2', BACKSPACE );
addTests( 'test backspace join list items', 'join_list3', BACKSPACE );
addTests( 'test backspace join list items', 'join_list4', BACKSPACE );
addTests( 'test backspace join list items', 'join_list5', BACKSPACE );
addTests( 'test backspace join list items', 'join_list6', BACKSPACE );
addTests( 'test backspace join list items', 'join_list7', BACKSPACE );
addTests( 'test backspace join list items', 'join_list8', BACKSPACE );
addTests( 'test backspace join list items', 'join_list9', BACKSPACE );
addTests( 'test backspace join list items', 'join_list10', BACKSPACE );
addTests( 'test backspace join list items', 'join_list11', BACKSPACE );
addTests( 'test backspace join list items', 'join_list15', BACKSPACE, undefined, assertNotNestedAnchors );
addTests( 'test backspace join list items', 'join_list16', BACKSPACE, undefined, assertNotNestedAnchors );
addTests( 'test backspace join list items', 'join_list17', BACKSPACE );
addTests( 'test backspace join list items', 'join_list18', BACKSPACE );

function assertNotNestedAnchors( editor ) {
	assert.isNull( editor.editable().findOne( 'a a' ) );
}

addTests( 'test backspace outdent list item', 'outdent_list', BACKSPACE );
addTests( 'test backspace outdent list item', 'outdent_list2', BACKSPACE );
addTests( 'test backspace outdent list item', 'outdent_list3', BACKSPACE );
addTests( 'test backspace outdent list item', 'outdent_list4', BACKSPACE );
addTests( 'test backspace outdent list item', 'outdent_list5', BACKSPACE );
addTests( 'test backspace outdent list item', 'outdent_list6', BACKSPACE );

addTests( 'test backspace NOT outdent list item', 'no_outdent_list', BACKSPACE );
addTests( 'test backspace NOT outdent list item', 'no_outdent_list2', BACKSPACE );

addTests( 'test del join list items', 'join_list1_del', DEL );
addTests( 'test del join list items', 'join_list2_del', DEL );
addTests( 'test del join list items', 'join_list3_del', DEL );
addTests( 'test del join list items', 'join_list4_del', DEL );
addTests( 'test del join list items', 'join_list5_del', DEL );
addTests( 'test del join list items', 'join_list6_del', DEL );
addTests( 'test del join list items', 'join_list7_del', DEL );
addTests( 'test del join list items', 'join_list8_del', DEL );
addTests( 'test del join list items', 'join_list9_del', DEL );
addTests( 'test del join list items', 'join_list10_del', DEL );
addTests( 'test del join list items', 'join_list11_del', DEL );
addTests( 'test del join list items', 'join_list12_del', DEL );
addTests( 'test del join list items', 'join_list13_del', DEL );
addTests( 'test del join list items', 'join_list14_del', DEL );
addTests( 'test del join list items', 'join_list15_del', DEL, undefined, assertNotNestedAnchors );
addTests( 'test del join list items', 'join_list16_del', DEL, undefined, assertNotNestedAnchors );
addTests( 'test del join list items', 'join_list17_del', DEL );
addTests( 'test del join list items', 'join_list18_del', DEL );
addTests( 'test del join list items', 'join_list19_del', DEL );
addTests( 'test del join list items', 'join_list20_del', DEL );
addTests( 'test del join list items', 'join_list21_del', DEL );

addTests( 'test del join with next list item', 'merge_next_list', DEL );
addTests( 'test del join with next list item', 'merge_next_list2', DEL );
addTests( 'test del join with next list item', 'merge_next_list3', DEL );
addTests( 'test del join with next list item', 'merge_next_list4', DEL );

// On IE8 this test fails due to https://dev.ckeditor.com/ticket/13098.
if ( !CKEDITOR.env.ie || CKEDITOR.env.version > 8 ) {
	addTests( 'test del join with next list item', 'merge_next_list5', DEL );
}

addTests( 'test del remove empty block', 'remove_empty_block', DEL );
addTests( 'test del remove empty block', 'remove_empty_block2', DEL );

addTests( 'test del do nothing', 'del_no_action', DEL );
addTests( 'test del do nothing', 'del_no_action2', DEL );

// Make sure that the modifiers are ignored.
// https://dev.ckeditor.com/ticket/11861#comment:13
addTests( 'test backspace join list items - CTRL', 'join_list1', BACKSPACE, CKEDITOR.CTRL );
addTests( 'test backspace outdent list item - SHIFT', 'outdent_list', BACKSPACE, CKEDITOR.SHIFT );
addTests( 'test del join list items - CTRL', 'join_list1_del', DEL, CKEDITOR.CTRL );
addTests( 'test del join with next list item - SHIFT', 'merge_next_list', DEL, CKEDITOR.SHIFT );

function addTests( title, source, key, keyModifiers, assertFn ) {
	tests[ title + ' (' + source + ')' ] = function() {
		this.assertBackspace( source, key, keyModifiers, assertFn );
	};
}

bender.test( tests );
