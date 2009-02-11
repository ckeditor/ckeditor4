/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'link', {
	init: function( editor, pluginPath ) {
		// Add the link and unlink buttons.
		editor.addCommand( 'link', new CKEDITOR.dialogCommand( 'link' ) );
		editor.addCommand( 'anchor', new CKEDITOR.dialogCommand( 'anchor' ) );
		editor.addCommand( 'unlink', new CKEDITOR.unlinkCommand() );
		editor.ui.addButton( 'Link', {
			label: editor.lang.link.toolbar,
			command: 'link'
		});
		editor.ui.addButton( 'Unlink', {
			label: editor.lang.unlink,
			command: 'unlink'
		});
		editor.ui.addButton( 'Anchor', {
			label: editor.lang.anchor.toolbar,
			command: 'anchor'
		});
		CKEDITOR.dialog.add( 'link', this.path + 'dialogs/link.js' );
		CKEDITOR.dialog.add( 'anchor', this.path + 'dialogs/anchor.js' );

		// Add the CSS styles for anchor placeholders.
		editor.addCss( 'img.cke_anchor' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/anchor.gif' ) + ');' +
				'background-position: center center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'width: 18px;' +
				'height: 18px;' +
			'}\n' +
			'a.cke_anchor' +
			'{' +
				'background-image: url(' + CKEDITOR.getUrl( this.path + 'images/anchor.gif' ) + ');' +
				'background-position: 0 center;' +
				'background-repeat: no-repeat;' +
				'border: 1px solid #a9a9a9;' +
				'padding-left: 18px;' +
			'}'
				);

		// Register selection change handler for the unlink button.
		editor.on( 'selectionChange', function( evt ) {
			/*
			 * Despite our initial hope, document.queryCommandEnabled() does not work
			 * for this in Firefox. So we must detect the state by element paths.
			 */
			var command = editor.getCommand( 'unlink' ),
				element = evt.data.path.lastElement.getAscendant( 'a', true );
			if ( element && element.getName() == 'a' && element.getAttribute( 'href' ) )
				command.state = CKEDITOR.TRISTATE_OFF;
			else
				command.state = CKEDITOR.TRISTATE_DISABLED;
			command.fire( 'state' );
		});

		// Register a contentDom handler for displaying placeholders after mode change.
		editor.on( 'contentDom', function() {
			var rawAnchors = editor.document.$.anchors;
			for ( var i = rawAnchors.length - 1, anchor; i >= 0; i-- ) {
				anchor = new CKEDITOR.dom.element( rawAnchors[ i ] );

				// IE BUG: When an <a> tag doesn't have href, IE would return empty string
				// instead of null on getAttribute.
				if ( !anchor.getAttribute( 'href' ) )
					editor.createFakeElement( anchor, 'cke_anchor', 'anchor' ).replace( anchor );
				else
					anchor.addClass( 'cke_anchor' );
			}
		});
	},

	requires: [ 'fakeobjects' ]
});

CKEDITOR.unlinkCommand = function() {};
CKEDITOR.unlinkCommand.prototype = {
	/** @ignore */
	exec: function( editor ) {
		/*
		 * execCommand( 'unlink', ... ) in Firefox leaves behind <span> tags at where
		 * the <a> was, so again we have to remove the link ourselves. (See #430)
		 *
		 * TODO: Use the style system when it's complete. Let's use execCommand()
		 * as a stopgap solution for now.
		 */
		var selection = editor.getSelection(),
			bookmarks = selection.createBookmarks(),
			ranges = selection.getRanges(),
			rangeRoot, element;

		for ( var i = 0; i < ranges.length; i++ ) {
			rangeRoot = ranges[ i ].getCommonAncestor( true );
			element = rangeRoot.getAscendant( 'a', true );
			if ( !element )
				continue;
			ranges[ i ].selectNodeContents( element );
		}

		selection.selectRanges( ranges );
		editor.document.$.execCommand( 'unlink', false, null );
		selection.selectBookmarks( bookmarks );
	}
};

CKEDITOR.tools.extend( CKEDITOR.config, {
	linkUploadTab: true,
	linkBrowseServer: true,
	linkUploadAction: 'nowhere.php',
	linkShowAdvancedTab: true,
	linkShowTargetTab: true
});
