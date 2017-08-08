/* bender-tags: editor */
/* bender-ckeditor-plugins: stylescombo,toolbar */

bender.editor = true;

function assertComboValue( editor, comboName, expectedValue ) {
	var combo = editor.ui.get( comboName );

	assert.areSame( expectedValue, combo.getValue(), 'Combo ' + comboName + ' has appropriate value' );
}

bender.test( {
	// #525
	'test multiple same styled blocks': function() {
		var editor = this.editor;

		bender.tools.selection.setWithHtml( editor, '<h3 style="color:#aaaaaa; font-style:italic">Bl{ock</h3><h3 style="color:#aaaaaa; font-style:italic">Blo}ck</h3>' );
		assertComboValue( editor, 'Styles', 'Subtitle' );
	},

	// #525
	'test multiple different styled blocks': function() {
		var editor = this.editor;

		bender.tools.selection.setWithHtml( editor, '<h3 style="color:#aaaaaa; font-style:italic">Bl{ock</h3><h2 style="font-style:italic">Blo}ck</h2>' );
		assertComboValue( editor, 'Styles', '' );
	},

	// #525
	'test nested inline style in block': function() {
		var editor = this.editor;

		bender.tools.selection.setWithHtml( editor, '<h2 style="font-style:italic">foo<tt>b{a}r</tt></h2>' );
		assertComboValue( editor, 'Styles', 'Typewriter' );
	},

	// #525
	'test nested inline style in inline': function() {
		var editor = this.editor;

		bender.tools.selection.setWithHtml( editor, '<tt>foo<span class="marker">b{a}r</span></tt>' );
		assertComboValue( editor, 'Styles', 'Marker' );
	}
} );
