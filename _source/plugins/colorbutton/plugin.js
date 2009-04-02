/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'colorbutton', {
	requires: [ 'panelbutton', 'floatpanel', 'styles' ],

	init: function( editor ) {
		var config = editor.config,
			lang = editor.lang.colorButton;

		var clickFn;

		addButton( 'TextColor', 'fore', lang.textColorTitle );
		addButton( 'BGColor', 'back', lang.bgColorTitle );

		function addButton( name, type, title ) {
			editor.ui.add( name, CKEDITOR.UI_PANELBUTTON, {
				label: lang.label,
				title: title,
				className: 'cke_button_' + name.toLowerCase(),

				panel: {
					css: [ CKEDITOR.getUrl( editor.skinPath + 'editor.css' ) ]
				},

				onBlock: function( panel, blockName ) {
					var block = panel.addBlock( blockName );
					block.autoSize = true;
					block.element.addClass( 'cke_colorblock' );
					block.element.setHtml( renderColors( panel, type ) );

					var keys = block.keys;
					keys[ 39 ] = 'next'; // ARROW-RIGHT
					keys[ 9 ] = 'next'; // TAB
					keys[ 37 ] = 'prev'; // ARROW-LEFT
					keys[ CKEDITOR.SHIFT + 9 ] = 'prev'; // SHIFT + TAB
					keys[ 32 ] = 'click'; // SPACE
				}
			});
		}


		function renderColors( panel, type ) {
			var output = [],
				colors = CKEDITOR.config.colorButton_colors.split( ',' );

			var clickFn = CKEDITOR.tools.addFunction( function( color, type ) {
				if ( color == '?' ) {
					// TODO : Implement the colors dialog.
					// editor.openDialog( '' );
					return;
				}

				editor.focus();

				panel.hide();

				var style = new CKEDITOR.style( config[ 'colorButton_' + type + 'Style' ], { color: color || '#000' } );

				editor.fire( 'saveSnapshot' );
				if ( color )
					style.apply( editor.document );
				else
					style.remove( editor.document );
			});

			// Render the "Automatic" button.
			output.push( '<a class="cke_colorauto" _cke_focus=1 hidefocus=true' +
				' title="', lang.auto, '"' +
				' onclick="CKEDITOR.tools.callFunction(', clickFn, ',null,\'', type, '\');return false;"' +
				' href="javascript:void(\'', lang.auto, '\')">' +
				'<table cellspacing=0 cellpadding=0 width="100%">' +
					'<tr>' +
						'<td>' +
							'<span class="cke_colorbox" style="background-color:#000"></span>' +
						'</td>' +
						'<td colspan=7 align=center>', lang.auto, '</td>' +
					'</tr>' +
				'</table>' +
				'</a>' +
				'<table cellspacing=0 cellpadding=0 width="100%">' );

			// Render the color boxes.
			for ( var i = 0; i < colors.length; i++ ) {
				if ( ( i % 8 ) === 0 )
					output.push( '</tr><tr>' );

				var color = colors[ i ];
				output.push( '<td>' +
					'<a class="cke_colorbox" _cke_focus=1 hidefocus=true' +
						' title="', color, '"' +
						' onclick="CKEDITOR.tools.callFunction(', clickFn, ',\'#', color, '\',\'', type, '\'); return false;"' +
						' href="javascript:void(\'', color, '\')">' +
						'<span class="cke_colorbox" style="background-color:#', color, '"></span>' +
					'</a>' +
					'</td>' );
			}

			// Render the "More Colors" button.
			if ( config.colorButton_enableMore ) {
				output.push( '</tr>' +
					'<tr>' +
						'<td colspan=8 align=center>' +
							'<a class="cke_colormore" _cke_focus=1 hidefocus=true' +
								' title="', lang.more, '"' +
								' onclick="CKEDITOR.tools.callFunction(', clickFn, ',\'?\',\'', type, '\');return false;"' +
								' href="javascript:void(\'', lang.more, '\')">', lang.more, '</a>' +
						'</td>' ); // It is later in the code.
			}

			output.push( '</tr></table>' );

			return output.join( '' );
		}
	}
});

CKEDITOR.config.colorButton_enableMore = false;
CKEDITOR.config.colorButton_colors = '000,930,330,030,036,000080,339,333,' +
	'800000,F60,808000,808080,008080,00F,669,808080,' +
	'F00,F90,9C0,396,3CC,36F,800080,999,' +
	'F0F,FC0,FF0,0F0,0FF,0CF,936,C0C0C0,' +
	'F9C,FC9,FF9,CFC,CFF,9CF,C9F,FFF';

CKEDITOR.config.colorButton_foreStyle = {
	element: 'span',
	styles: { 'color': '#(color)' },
	overrides: [ {
		element: 'font', attributes: { 'color': null }
	}]
};

CKEDITOR.config.colorButton_backStyle = {
	element: 'span',
	styles: { 'background-color': '#(color)' }
};
