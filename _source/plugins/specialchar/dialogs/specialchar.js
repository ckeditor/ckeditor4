/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.dialog.add( 'specialchar', function( editor ) {
	/**
	 * Simulate "this" of a dialog for non-dialog events.
	 * @type {CKEDITOR.dialog}
	 */
	var dialog,
		lang = editor.lang.specialChar;

	var insertSpecialChar = function( specialChar ) {
			var selection = editor.getSelection(),
				ranges = selection.getRanges( true ),
				range, textNode;

			editor.fire( 'saveSnapshot' );

			for ( var i = ranges.length - 1; i >= 0; i-- ) {
				range = ranges[ i ];
				range.deleteContents();

				textNode = CKEDITOR.dom.element.createFromHtml( specialChar );
				range.insertNode( textNode );
			}

			if ( range ) {
				range.moveToPosition( textNode, CKEDITOR.POSITION_AFTER_END );
				range.select();
			}

			editor.fire( 'saveSnapshot' );
		};

	var onChoice = function( evt ) {
			var target, value;
			if ( evt.data )
				target = evt.data.getTarget();
			else
				target = new CKEDITOR.dom.element( evt );

			if ( target.getName() == 'a' && ( value = target.getChild( 0 ).getHtml() ) ) {
				target.removeClass( "cke_light_background" );
				dialog.hide();

				// Firefox has bug on insert chars into a element use its own API. (#5170)
				if ( CKEDITOR.env.gecko )
					insertSpecialChar( value );
				else
					editor.insertHtml( value );
			}
		};

	var onClick = CKEDITOR.tools.addFunction( onChoice );

	var focusedNode;

	var onFocus = function( evt, target ) {
			var value;
			target = target || evt.data.getTarget();

			if ( target.getName() == 'span' )
				target = target.getParent();

			if ( target.getName() == 'a' && ( value = target.getChild( 0 ).getHtml() ) ) {
				// Trigger blur manually if there is focused node.
				if ( focusedNode )
					onBlur( null, focusedNode );

				var htmlPreview = dialog.getContentElement( 'info', 'htmlPreview' ).getElement();

				dialog.getContentElement( 'info', 'charPreview' ).getElement().setHtml( value );
				htmlPreview.setHtml( CKEDITOR.tools.htmlEncode( value ) );
				target.getParent().addClass( "cke_light_background" );

				// Memorize focused node.
				focusedNode = target;
			}
		};

	var onBlur = function( evt, target ) {
			target = target || evt.data.getTarget();

			if ( target.getName() == 'span' )
				target = target.getParent();

			if ( target.getName() == 'a' ) {
				dialog.getContentElement( 'info', 'charPreview' ).getElement().setHtml( '&nbsp;' );
				dialog.getContentElement( 'info', 'htmlPreview' ).getElement().setHtml( '&nbsp;' );
				target.getParent().removeClass( "cke_light_background" );

				focusedNode = undefined;
			}
		};

	var onKeydown = CKEDITOR.tools.addFunction( function( ev ) {
		ev = new CKEDITOR.dom.event( ev );

		// Get an Anchor element.
		var element = ev.getTarget();
		var relative, nodeToMove;
		var keystroke = ev.getKeystroke();
		var rtl = editor.lang.dir == 'rtl';

		switch ( keystroke ) {
			// UP-ARROW
			case 38:
				// relative is TR
				if ( ( relative = element.getParent().getParent().getPrevious() ) ) {
					nodeToMove = relative.getChild( [ element.getParent().getIndex(), 0 ] );
					nodeToMove.focus();
					onBlur( null, element );
					onFocus( null, nodeToMove );
				}
				ev.preventDefault();
				break;
				// DOWN-ARROW
			case 40:
				// relative is TR
				if ( ( relative = element.getParent().getParent().getNext() ) ) {
					nodeToMove = relative.getChild( [ element.getParent().getIndex(), 0 ] );
					if ( nodeToMove && nodeToMove.type == 1 ) {
						nodeToMove.focus();
						onBlur( null, element );
						onFocus( null, nodeToMove );
					}
				}
				ev.preventDefault();
				break;
				// SPACE
				// ENTER is already handled as onClick
			case 32:
				onChoice({ data: ev } );
				ev.preventDefault();
				break;

				// RIGHT-ARROW
			case rtl ? 37:
				39 :
				// TAB
			case 9:
				// relative is TD
				if ( ( relative = element.getParent().getNext() ) ) {
					nodeToMove = relative.getChild( 0 );
					if ( nodeToMove.type == 1 ) {
						nodeToMove.focus();
						onBlur( null, element );
						onFocus( null, nodeToMove );
						ev.preventDefault( true );
					} else
						onBlur( null, element );
				}
				// relative is TR
				else if ( ( relative = element.getParent().getParent().getNext() ) ) {
					nodeToMove = relative.getChild( [ 0, 0 ] );
					if ( nodeToMove && nodeToMove.type == 1 ) {
						nodeToMove.focus();
						onBlur( null, element );
						onFocus( null, nodeToMove );
						ev.preventDefault( true );
					} else
						onBlur( null, element );
				}
				break;

				// LEFT-ARROW
			case rtl ? 39:
				37 :
				// SHIFT + TAB
			case CKEDITOR.SHIFT + 9:
				// relative is TD
				if ( ( relative = element.getParent().getPrevious() ) ) {
					nodeToMove = relative.getChild( 0 );
					nodeToMove.focus();
					onBlur( null, element );
					onFocus( null, nodeToMove );
					ev.preventDefault( true );
				}
				// relative is TR
				else if ( ( relative = element.getParent().getParent().getPrevious() ) ) {
					nodeToMove = relative.getLast().getChild( 0 );
					nodeToMove.focus();
					onBlur( null, element );
					onFocus( null, nodeToMove );
					ev.preventDefault( true );
				} else
					onBlur( null, element );
				break;
			default:
				// Do not stop not handled events.
				return;
		}
	});

	return {
		title: lang.title,
		minWidth: 430,
		minHeight: 280,
		buttons: [ CKEDITOR.dialog.cancelButton ],
		charColumns: 17,
		chars: [
			'!', '&quot;', '#', '$', '%', '&amp;', "'", '(', ')', '*', '+', '-', '.', '/',
			'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';',
			'&lt;', '=', '&gt;', '?', '@',
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
			'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
			'[', ']', '^', '_', '`',
			'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
			'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
			'{', '|', '}', '~', '&euro;(EURO SIGN)', '&lsquo;(LEFT SINGLE QUOTATION MARK)', '&rsquo;(RIGHT SINGLE QUOTATION MARK)', '&ldquo;(LEFT DOUBLE QUOTATION MARK)',
			'&rdquo;(RIGHT DOUBLE QUOTATION MARK)', '&ndash;(EN DASH)', '&mdash;(EM DASH)', '&iexcl;(INVERTED EXCLAMATION MARK)', '&cent;(CENT SIGN)', '&pound;(POUND SIGN)',
			'&curren;(CURRENCY SIGN)', '&yen;(YEN SIGN)', '&brvbar;(BROKEN BAR)', '&sect;(SECTION SIGN)', '&uml;(DIAERESIS)', '&copy;(COPYRIGHT SIGN)', '&ordf;(FEMININE ORDINAL INDICATOR)',
			'&laquo;(LEFT-POINTING DOUBLE ANGLE QUOTATION MARK)', '&not;(NOT SIGN)', '&reg;(REGISTERED SIGN)', '&macr;(MACRON)', '&deg;(DEGREE SIGN)', '&plusmn;(PLUS-MINUS SIGN)', '&sup2;(SUPERSCRIPT TWO)',
			'&sup3;(SUPERSCRIPT THREE)', '&acute;(ACUTE ACCENT)', '&micro;(MICRO SIGN)', '&para;(PILCROW SIGN)', '&middot;(MIDDLE DOT)', '&cedil;(CEDILLA)',
			'&sup1;(SUPERSCRIPT ONE)', '&ordm;(MASCULINE ORDINAL INDICATOR)', '&raquo;(RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK)', '&frac14;(VULGAR FRACTION ONE QUARTER)', '&frac12;(VULGAR FRACTION ONE HALF)', '&frac34;(VULGAR FRACTION THREE QUARTERS)',
			'&iquest;(INVERTED QUESTION MARK)', '&Agrave;(LATIN CAPITAL LETTER A WITH GRAVE)', '&Aacute;(LATIN CAPITAL LETTER A WITH ACUTE)', '&Acirc;(LATIN CAPITAL LETTER A WITH CIRCUMFLEX)', '&Atilde;(LATIN CAPITAL LETTER A WITH TILDE)', '&Auml;(LATIN CAPITAL LETTER A WITH DIAERESIS)',
			'&Aring;(LATIN CAPITAL LETTER A WITH RING ABOVE)', '&AElig;(LATIN CAPITAL LETTER AE)', '&Ccedil;(LATIN CAPITAL LETTER C WITH CEDILLA)', '&Egrave;(LATIN CAPITAL LETTER E WITH GRAVE)', '&Eacute;(LATIN CAPITAL LETTER E WITH ACUTE)', '&Ecirc;(LATIN CAPITAL LETTER E WITH CIRCUMFLEX)',
			'&Euml;(LATIN CAPITAL LETTER E WITH DIAERESIS)', '&Igrave;(LATIN CAPITAL LETTER I WITH GRAVE)', '&Iacute;(LATIN CAPITAL LETTER I WITH ACUTE)', '&Icirc;(LATIN CAPITAL LETTER I WITH CIRCUMFLEX)', '&Iuml;(LATIN CAPITAL LETTER I WITH DIAERESIS)', '&ETH;(LATIN CAPITAL LETTER ETH)',
			'&Ntilde;(LATIN CAPITAL LETTER N WITH TILDE)', '&Ograve;(LATIN CAPITAL LETTER O WITH GRAVE)', '&Oacute;(LATIN CAPITAL LETTER O WITH ACUTE)', '&Ocirc;(LATIN CAPITAL LETTER O WITH CIRCUMFLEX)', '&Otilde;(LATIN CAPITAL LETTER O WITH TILDE)', '&Ouml;(LATIN CAPITAL LETTER O WITH DIAERESIS)',
			'&times;(MULTIPLICATION SIGN)', '&Oslash;(LATIN CAPITAL LETTER O WITH STROKE)', '&Ugrave;(LATIN CAPITAL LETTER U WITH GRAVE)', '&Uacute;(LATIN CAPITAL LETTER U WITH ACUTE)', '&Ucirc;(LATIN CAPITAL LETTER U WITH CIRCUMFLEX)', '&Uuml;(LATIN CAPITAL LETTER U WITH DIAERESIS)',
			'&Yacute;(LATIN CAPITAL LETTER Y WITH ACUTE)', '&THORN;(LATIN CAPITAL LETTER THORN)', '&szlig;(LATIN SMALL LETTER SHARP S)', '&agrave;(LATIN SMALL LETTER A WITH GRAVE)', '&aacute;(LATIN SMALL LETTER A WITH ACUTE)', '&acirc;(LATIN SMALL LETTER A WITH CIRCUMFLEX)',
			'&atilde;(LATIN SMALL LETTER A WITH TILDE)', '&auml;(LATIN SMALL LETTER A WITH DIAERESIS)', '&aring;(LATIN SMALL LETTER A WITH RING ABOVE)', '&aelig;(LATIN SMALL LETTER AE)', '&ccedil;(LATIN SMALL LETTER C WITH CEDILLA)', '&egrave;(LATIN SMALL LETTER E WITH GRAVE)',
			'&eacute;(LATIN SMALL LETTER E WITH ACUTE)', '&ecirc;(LATIN SMALL LETTER E WITH CIRCUMFLEX)', '&euml;(LATIN SMALL LETTER E WITH DIAERESIS)', '&igrave;(LATIN SMALL LETTER I WITH GRAVE)', '&iacute;(LATIN SMALL LETTER I WITH ACUTE)', '&icirc;(LATIN SMALL LETTER I WITH CIRCUMFLEX)',
			'&iuml;(LATIN SMALL LETTER I WITH DIAERESIS)', '&eth;(LATIN SMALL LETTER ETH)', '&ntilde;(LATIN SMALL LETTER N WITH TILDE)', '&ograve;(LATIN SMALL LETTER O WITH GRAVE)', '&oacute;(LATIN SMALL LETTER O WITH ACUTE)', '&ocirc;(LATIN SMALL LETTER O WITH CIRCUMFLEX)',
			'&otilde;(LATIN SMALL LETTER O WITH TILDE)', '&ouml;(LATIN SMALL LETTER O WITH DIAERESIS)',
			'&divide;(DIVISION SIGN)', '&oslash;(LATIN SMALL LETTER O WITH STROKE)',
			'&ugrave;(LATIN SMALL LETTER U WITH GRAVE)', '&uacute;(LATIN SMALL LETTER U WITH ACUTE)',
			'&ucirc;(LATIN SMALL LETTER U WITH CIRCUMFLEX)', '&uuml;(LATIN SMALL LETTER U WITH DIAERESIS)',
			'&uuml;(LATIN SMALL LETTER U WITH DIAERESIS)', '&yacute;(LATIN SMALL LETTER Y WITH ACUTE)', '&thorn;(LATIN SMALL LETTER THORN)', '&yuml;(LATIN SMALL LETTER Y WITH DIAERESIS)',
			'&OElig;(LATIN CAPITAL LIGATURE OE)',
			'&oelig;(LATIN SMALL LIGATURE OE)', '&#372;(LATIN CAPITAL LETTER W WITH CIRCUMFLEX)',
			'&#374(LATIN CAPITAL LETTER Y WITH CIRCUMFLEX)', '&#373(LATIN SMALL LETTER W WITH CIRCUMFLEX)',
			'&#375;(LATIN SMALL LETTER Y WITH CIRCUMFLEX)', '&sbquo;(SINGLE LOW-9 QUOTATION MARK)',
			'&#8219;(SINGLE HIGH-REVERSED-9 QUOTATION MARK)', '&bdquo;(DOUBLE LOW-9 QUOTATION MARK)', '&hellip;(HORIZONTAL ELLIPSIS)',
			'&trade;(TRADE MARK SIGN)', '&#9658;(BLACK RIGHT-POINTING POINTER)', '&bull;(BULLET)',
			'&rarr;(RIGHTWARDS ARROW)', '&rArr;(RIGHTWARDS DOUBLE ARROW)', '&hArr;(LEFT RIGHT DOUBLE ARROW)', '&diams;(BLACK DIAMOND SUIT)', '&asymp;(ALMOST EQUAL TO)'
			],
		onLoad: function() {
			var columns = this.definition.charColumns,
				chars = this.definition.chars;

			var charsTableLabel = CKEDITOR.tools.getNextId() + '_specialchar_table_label';
			var html = [ '<table role="listbox" aria-labelledby="' + charsTableLabel + '"' +
													' style="width: 320px; height: 100%; border-collapse: separate;"' +
													' align="center" cellspacing="2" cellpadding="2" border="0">' ];

			var i = 0,
				size = chars.length,
				character, charDesc;

			while ( i < size ) {
				html.push( '<tr>' );

				for ( var j = 0; j < columns; j++, i++ ) {
					if ( ( character = chars[ i ] ) ) {
						charDesc = '';
						character = character.replace( /\((.*?)\)/, function( match, desc ) {
							charDesc = desc;
							return '';
						});

						// Use character in case description unavailable.
						charDesc = charDesc || character;

						var charLabelId = 'cke_specialchar_label_' + i + '_' + CKEDITOR.tools.getNextNumber();

						html.push( '<td class="cke_dark_background" style="cursor: default" role="presentation">' +
							'<a href="javascript: void(0);" role="option"' +
							' aria-posinset="' + ( i + 1 ) + '"', ' aria-setsize="' + size + '"', ' aria-labelledby="' + charLabelId + '"', ' style="cursor: inherit; display: block; height: 1.25em; margin-top: 0.25em; text-align: center;" title="', CKEDITOR.tools.htmlEncode( charDesc ), '"' +
							' onkeydown="CKEDITOR.tools.callFunction( ' + onKeydown + ', event, this )"' +
							' onclick="CKEDITOR.tools.callFunction(' + onClick + ', this); return false;"' +
							' tabindex="-1">' +
							'<span style="margin: 0 auto;cursor: inherit">' +
							character +
							'</span>' +
							'<span class="cke_voice_label" id="' + charLabelId + '">' +
							charDesc +
							'</span></a>' );
					} else
						html.push( '<td class="cke_dark_background">&nbsp;' );

					html.push( '</td>' );
				}
				html.push( '</tr>' );
			}

			html.push( '</tbody></table>', '<span id="' + charsTableLabel + '" class="cke_voice_label">' + lang.options + '</span>' );

			this.getContentElement( 'info', 'charContainer' ).getElement().setHtml( html.join( '' ) );
		},
		contents: [
			{
			id: 'info',
			label: editor.lang.common.generalTab,
			title: editor.lang.common.generalTab,
			padding: 0,
			align: 'top',
			elements: [
				{
				type: 'hbox',
				align: 'top',
				widths: [ '320px', '90px' ],
				children: [
					{
					type: 'html',
					id: 'charContainer',
					html: '',
					onMouseover: onFocus,
					onMouseout: onBlur,
					focus: function() {
						var firstChar = this.getElement().getElementsByTag( 'a' ).getItem( 0 );
						setTimeout( function() {
							firstChar.focus();
							onFocus( null, firstChar );
						});
					},
					onShow: function() {
						var firstChar = this.getElement().getChild( [ 0, 0, 0, 0, 0 ] );
						setTimeout( function() {
							firstChar.focus();
							onFocus( null, firstChar );
						});
					},
					onLoad: function( event ) {
						dialog = event.sender;
					}
				},
					{
					type: 'hbox',
					align: 'top',
					widths: [ '100%' ],
					children: [
						{
						type: 'vbox',
						align: 'top',
						children: [
							{
							type: 'html',
							html: '<div></div>'
						},
							{
							type: 'html',
							id: 'charPreview',
							className: 'cke_dark_background',
							style: 'border:1px solid #eeeeee;font-size:28px;height:40px;width:70px;padding-top:9px;font-family:\'Microsoft Sans Serif\',Arial,Helvetica,Verdana;text-align:center;',
							html: '<div>&nbsp;</div>'
						},
							{
							type: 'html',
							id: 'htmlPreview',
							className: 'cke_dark_background',
							style: 'border:1px solid #eeeeee;font-size:14px;height:20px;width:70px;padding-top:2px;font-family:\'Microsoft Sans Serif\',Arial,Helvetica,Verdana;text-align:center;',
							html: '<div>&nbsp;</div>'
						}
						]
					}
					]
				}
				]
			}
			]
		}
		]
	};
});
