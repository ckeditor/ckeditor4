/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "showblocks" plugin. Enable it will make all block level
 *               elements being decorated with a border and the element name
 *               displayed on the left-right corner.
 */

(function() {
	var cssTemplate = '.%2 p,' +
		'.%2 div,' +
		'.%2 pre,' +
		'.%2 address,' +
		'.%2 blockquote,' +
		'.%2 h1,' +
		'.%2 h2,' +
		'.%2 h3,' +
		'.%2 h4,' +
		'.%2 h5,' +
		'.%2 h6' +
		'{' +
			'background-repeat: no-repeat;' +
			'border: 1px dotted gray;' +
			'padding-top: 8px;' +
			'padding-left: 8px;' +
		'}' +

		'.%2 p' +
		'{' +
			'%1p.png);' +
		'}' +

		'.%2 div' +
		'{' +
			'%1div.png);' +
		'}' +

		'.%2 pre' +
		'{' +
			'%1pre.png);' +
		'}' +

		'.%2 address' +
		'{' +
			'%1address.png);' +
		'}' +

		'.%2 blockquote' +
		'{' +
			'%1blockquote.png);' +
		'}' +

		'.%2 h1' +
		'{' +
			'%1h1.png);' +
		'}' +

		'.%2 h2' +
		'{' +
			'%1h2.png);' +
		'}' +

		'.%2 h3' +
		'{' +
			'%1h3.png);' +
		'}' +

		'.%2 h4' +
		'{' +
			'%1h4.png);' +
		'}' +

		'.%2 h5' +
		'{' +
			'%1h5.png);' +
		'}' +

		'.%2 h6' +
		'{' +
			'%1h6.png);' +
		'}';

	var cssTemplateRegex = /%1/g,
		cssClassRegex = /%2/g;

	var commandDefinition = {
		exec: function( editor ) {
			var isOn = ( this.state == CKEDITOR.TRISTATE_ON );
			var funcName = isOn ? 'removeClass' : 'addClass';
			editor.document.getBody()[ funcName ]( 'cke_show_blocks' );

			this.toggleState();
			editor._.showBlocks = !isOn;
		}
	};

	CKEDITOR.plugins.add( 'showblocks', {
		requires: [ 'wysiwygarea' ],

		init: function( editor ) {
			var command = editor.addCommand( 'showblocks', commandDefinition );

			editor.addCss( cssTemplate.replace( cssTemplateRegex, 'background-image: url(' + CKEDITOR.getUrl( this.path ) + 'images/block_' ).replace( cssClassRegex, 'cke_show_blocks ' ) );

			// Set a flag in the editor object for remembering the show block state on
			// mode switches.
			editor._.showBlocks = editor.config.startupOutlineBlocks;

			editor.ui.addButton( 'ShowBlocks', {
				label: editor.lang.showBlocks,
				command: 'showblocks'
			});

			editor.on( 'contentDom', function() {
				// Restore show blocks state after mode switches.
				command.setState( CKEDITOR.TRISTATE_OFF );
				if ( this._.showBlocks )
					command.exec();
			});
		}
	});
})();

CKEDITOR.config.startupOutlineBlocks = false;
