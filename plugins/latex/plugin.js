"use strict";

(function() {

	var stylesLoaded = false;

	// Taken this from image plugin https://github.com/ckeditor/ckeditor4/blob/major/plugins/imagebase/plugin.js
	function loadStyles( editor, plugin ) {
		if ( !stylesLoaded ) {
			CKEDITOR.document.appendStyleSheet( plugin.path + 'styles/latex.css' );
			stylesLoaded = true;
		}

		if ( editor.addContentsCss ) {
			editor.addContentsCss( plugin.path + 'styles/latex.css' );
		}
	}


	CKEDITOR.plugins.add("latex", {
		requires: "dialog",
		icons: "latex",

		init: function(editor) {

			// Load styles
			loadStyles( editor, this );


			/*
			 * This command can be executed using
			 * editor.execCommand('formulaeCmd', data) whenever you want to
			 * adds a toolbar icon for to add math expressions.
			 */
			editor.addCommand("formulaeCmd", new CKEDITOR.dialogCommand('latex'));

			editor.ui.addButton("Latex", {
				label: "Math formulae",
				command: "formulaeCmd",
				toolbar: "formulae",
				icon: this.path + 'icons/latex.png'
			});

			// Add dialog.
			CKEDITOR.dialog.add("latex", this.path + "dialogs/latex.js");
		},

		afterInit: function(editor) {
			editor.execCommand("formulaeCmd");
		}
	});
})();
