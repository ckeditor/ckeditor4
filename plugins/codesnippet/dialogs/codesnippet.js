/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

( function() {
	CKEDITOR.dialog.add( 'codeSnippet', function( editor ) {

		var snippetLangs = editor._.codesnippet.langs,
			lang = editor.lang.codesnippet,
			clientHeight = document.documentElement.clientHeight,
			tabulationString = editor.config.codesnippet_tabulation || '    ',
			langSelectItems = [],
			langSelectDefaultValue,
			snippetLangId;

		for ( snippetLangId in snippetLangs )
			langSelectItems.push( [ snippetLangs[ snippetLangId ], snippetLangId ] );

		if ( langSelectItems.length )
			langSelectDefaultValue = langSelectItems[ 0 ][ 1 ];

		// Size adjustments.
		var size = CKEDITOR.document.getWindow().getViewPaneSize(),
			// Make it maximum 800px wide, but still fully visible in the viewport.
			width = Math.min( size.width - 70, 800 ),
			// Make it use 2/3 of the viewport height.
			height = size.height / 1.5;
			// Low resolution settings.
			if ( clientHeight < 650 )
				height = clientHeight - 220;

		return  {
			title: lang.title,
			minHeight: 200,
			resizable: CKEDITOR.DIALOG_RESIZE_NONE,
			contents: [
				{
					id: 'info',
					elements: [
						{
							id: 'lang',
							type: 'select',
							label: lang.language,
							items: langSelectItems,
							'default': langSelectDefaultValue,
							setup: function( widget ) {
								if ( widget.ready )
									this.setValue( widget.data.lang );
							},
							commit: function( widget ) {
								widget.setData( 'lang', this.getValue() );
							}
						},
						{
							id: 'code',
							type: 'textarea',
							label: lang.codeContents,
							onLoad: function() {
								var textarea = CKEDITOR.document.getById( this.domId ).findOne( 'textarea' );

								textarea.on( 'keydown', function( evt ) {
									var tabKeystroke = 9, // Tab.
										changeFocusKeystroke = CKEDITOR.CTRL + 190, // Ctrl + dot.
										eventKeystroke = evt.data.getKeystroke();

									if ( eventKeystroke == tabKeystroke || eventKeystroke == changeFocusKeystroke ) {
										// We should insert tab char or move focus to next
										// dialog element, and prevent default browser actions.
										eventKeystroke == tabKeystroke ?
											insertCharacterToTextarea( textarea.$, tabulationString ) :
											editor._.storedDialogs.codeSnippet.changeFocus( 1 );

										evt.data.preventDefault();
										evt.data.stopPropagation();
									}
								} );
							},
							setup: function( widget ) {
								this.setValue( widget.data.code );
							},
							commit: function( widget ) {
								widget.setData( 'code', this.getValue() );
							},
							required: true,
							validate: CKEDITOR.dialog.validate.notEmpty( lang.emptySnippetError ),
							inputStyle: 'cursor:auto;' +
								'width:' + width + 'px;' +
								'height:' + height + 'px;' +
								'tab-size:4;' +
								'text-align:left;',
							'class': 'cke_source'
						},
						{
							type: 'html',
							id: 'hotkeyMsg',
							html: '<div>' + lang.hotkeyMsg + '</div>'
						}
					]
				}
			]
		};
	} );

	// Inserts value into given field at its current range position. It will replace
	// selection text with given value.
	// @param {HTMLTextAreaElement} field The textarea element.
	// @param {String} insertValue Value to be inserted.
	function insertCharacterToTextarea( field, insertValue ) {
		var valueLength = insertValue.length,
			sel;

		if ( field.selectionStart !== undefined  ) {
			// Modern browsers.
			var startPos = field.selectionStart,
				endPos = field.selectionEnd;
			field.value = field.value.slice( 0, startPos ) + insertValue + field.value.slice( endPos );
			field.selectionStart = field.selectionEnd = startPos + valueLength;
		} else if ( document.selection ) {
			// Older IE.
			field.focus();
			sel = document.selection.createRange();
			sel.text = insertValue;
			sel.move( 'character', 0 );
			sel.select();
		} else {
			// No selection info.
			field.value += insertValue;
		}
	}
}() );