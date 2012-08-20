/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Spell checker.
 */

// Register a plugin named "wsc".
CKEDITOR.plugins.add( 'wsc', {
	requires: 'dialog',
	lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en-au,en-ca,en-gb,en,eo,es,et,eu,fa,fi,fo,fr-ca,fr,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,lt,lv,mk,mn,ms,nb,nl,no,pl,pt-br,pt,ro,ru,sk,sl,sr-latn,sr,sv,th,tr,ug,uk,vi,zh-cn,zh', // %REMOVE_LINE_CORE%
	icons: 'spellchecker', // %REMOVE_LINE_CORE%
	init: function( editor ) {
		var commandName = 'checkspell';

		var command = editor.addCommand( commandName, new CKEDITOR.dialogCommand( commandName ) );

		// SpellChecker doesn't work in Opera and with custom domain
		command.modes = { wysiwyg: ( !CKEDITOR.env.opera && !CKEDITOR.env.air && document.domain == window.location.hostname ) };

		editor.ui.addButton && editor.ui.addButton( 'SpellChecker', {
			label: editor.lang.wsc.toolbar,
			command: commandName,
			toolbar: 'spellchecker,10'
		});
		CKEDITOR.dialog.add( commandName, this.path + 'dialogs/wsc.js' );
	}
});

CKEDITOR.config.wsc_customerId = CKEDITOR.config.wsc_customerId || '1:ua3xw1-2XyGJ3-GWruD3-6OFNT1-oXcuB1-nR6Bp4-hgQHc-EcYng3-sdRXG3-NOfFk';
CKEDITOR.config.wsc_customLoaderScript = CKEDITOR.config.wsc_customLoaderScript || null;
