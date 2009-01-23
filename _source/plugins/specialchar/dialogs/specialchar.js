/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.dialog.add( 'specialchar', function( editor ) {
	return {
		title: editor.lang.specialChar.title,
		minWidth: 450,
		minHeight: 350,
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
			'{', '|', '}', '~', '&euro;', '&lsquo;', '&rsquo;', '&rsquo;', '&ldquo;',
			'&rdquo;', '&ndash;', '&mdash;', '&iexcl;', '&cent;', '&pound;',
			'&curren;', '&yen;', '&brvbar;', '&sect;', '&uml;', '&copy;', '&ordf;',
			'&laquo;', '&not;', '&reg;', '&macr;', '&deg;', '&plusmn;', '&sup2;',
			'&sup3;', '&acute;', '&micro;', '&para;', '&middot;', '&cedil;',
			'&sup1;', '&ordm;', '&raquo;', '&frac14;', '&frac12;', '&frac34;',
			'&iquest;', '&Agrave;', '&Aacute;', '&Acirc;', '&Atilde;', '&Auml;',
			'&Aring;', '&AElig;', '&Ccedil;', '&Egrave;', '&Eacute;', '&Ecirc;',
			'&Euml;', '&Igrave;', '&Iacute;', '&Icirc;', '&Iuml;', '&ETH;',
			'&Ntilde;', '&Ograve;', '&Oacute;', '&Ocirc;', '&Otilde;', '&Ouml;',
			'&times;', '&Oslash;', '&Ugrave;', '&Uacute;', '&Ucirc;', '&Uuml;',
			'&Yacute;', '&THORN;', '&szlig;', '&agrave;', '&aacute;', '&acirc;',
			'&atilde;', '&auml;', '&aring;', '&aelig;', '&ccedil;', '&egrave;',
			'&eacute;', '&ecirc;', '&euml;', '&igrave;', '&iacute;', '&icirc;',
			'&iuml;', '&eth;', '&ntilde;', '&ograve;', '&oacute;', '&ocirc;',
			'&otilde;', '&ouml;', '&divide;', '&oslash;', '&ugrave;', '&uacute;',
			'&ucirc;', '&uuml;', '&uuml;', '&yacute;', '&thorn;', '&yuml;',
			'&OElig;', '&oelig;', '&#372;', '&#374', '&#373', '&#375;', '&sbquo;',
			'&#8219;', '&bdquo;', '&hellip;', '&trade;', '&#9658;', '&bull;',
			'&rarr;', '&rArr;', '&hArr;', '&diams;', '&asymp;'
			],
		onLoad: function() {
			var columns = this.definition.charColumns,
				chars = this.definition.chars;

			var html = [ '<table style="width: 320px; height: 100%; border-collapse: separate;" align="center" cellspacing="2" cellpadding="2" border="0">' ];

			var i = 0;
			while ( i < chars.length ) {
				html.push( '<tr>' );

				for ( var j = 0; j < columns; j++, i++ ) {
					if ( chars[ i ] ) {
						html.push( '<td width="1%"' +
							' title="', chars[ i ].replace( /&/g, '&amp;' ), '"' +
							' value="', chars[ i ].replace( /&/g, "&amp;" ), '"' +
							' class="DarkBackground Hand">' );
						html.push( chars[ i ] );
					} else
						html.push( '<td class="DarkBackground">&nbsp;' );

					html.push( '</td>' );
				}
				html.push( '</tr>' );
			}

			html.push( '</tbody></table>' );

			this.getContentElement( 'info', 'charContainer' ).getElement().setHtml( html.join( '' ) );
		},
		contents: [
			{
			id: 'info',
			label: editor.lang.common.generalTab,
			title: editor.lang.common.generalTab,
			elements: [
				{
				type: 'hbox',
				align: 'top',
				widths: [ '300px', '90px' ],
				children: [
					{
					type: 'hbox',
					align: 'top',
					padding: 0,
					widths: [ '350px' ],
					children: [
						{
						type: 'html',
						id: 'charContainer',
						html: '',
						onMouseover: function( evt ) {
							var target = evt.data.getTarget(),
								targetName = target.getName(),
								value;

							if ( targetName == 'td' && ( value = target.getAttribute( 'value' ) ) ) {
								var dialog = this.getDialog(),
									preview = dialog.getContentElement( 'info', 'charPreview' ).getElement(),
									htmlPreview = dialog.getContentElement( 'info', 'htmlPreview' ).getElement();

								preview.setHtml( value );
								htmlPreview.setHtml( CKEDITOR.tools.htmlEncode( value ) );
								target.addClass( "LightBackground" );
							}
						},
						onMouseout: function( evt ) {
							var dialog = this.getDialog();
							var preview = dialog.getContentElement( 'info', 'charPreview' ).getElement();
							var htmlPreview = dialog.getContentElement( 'info', 'htmlPreview' ).getElement();
							var target = evt.data.getTarget();
							var targetName = target.getName();
							preview.setHtml( '&nbsp;' );
							htmlPreview.setHtml( '&nbsp;' );

							if ( targetName == 'td' )
								target.removeClass( "LightBackground" );
						},
						onClick: function( evt ) {
							var target = evt.data.getTarget();
							var targetName = target.getName();
							var editor = this.getDialog().getParentEditor();
							if ( targetName == 'td' ) {
								target = target.$;
								if ( value = target.getAttribute( 'value' ) ) {
									this.getDialog().restoreSelection();
									editor.insertHtml( value );
									this.getDialog().hide();
								}
							}
						}
					}
					]
				},
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
						style: 'border:1px solid #eeeeee;background-color:#EAEAD1;font-size:28px;height:40px;padding-top:9px;font-family:\'Microsoft Sans Serif\',Arial,Helvetica,Verdana;text-align:center;',
						html: '<div>&nbsp;</div>'
					},
						{
						type: 'html',
						id: 'htmlPreview',
						style: 'border:1px solid #eeeeee;background-color:#EAEAD1;font-size:14px;height:20px;padding-top:2px;font-family:\'Microsoft Sans Serif\',Arial,Helvetica,Verdana;text-align:center;',
						html: '<div>&nbsp;</div>'
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
