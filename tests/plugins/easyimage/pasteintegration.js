/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar, clipboard */

( function() {
	'use strict';
	// jscs:disable maximumLineLength
	var IMG = {
		JPEG: '<img src="data:image/jpeg;base64,foo">',
		GIF: '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">',
		PNG: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=">',
		BMP: '<img src="data:image/bmp;base64,foo">',
		SVG: '<img src="data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Awrs%3D%22http%3A%2F%2Fwww.wiris.com%2Fxml%2Fcvs-extension%22%20height%3D%2248%22%20width%3D%2270%22%20wrs%3Abaseline%3D%2229%22%3E%3C!--MathML%3A%20%3Cmath%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F1998%2FMath%2FMathML%22%3E%3Cmsubsup%3E%3Cmo%3E%26%23x222B%3B%3C%2Fmo%3E%3Cmn%3E10%3C%2Fmn%3E%3Cmn%3E13%3C%2Fmn%3E%3C%2Fmsubsup%3E%3Cmn%3E2%3C%2Fmn%3E%3Cmi%3Ex%3C%2Fmi%3E%3Cmo%3Ed%3C%2Fmo%3E%3Cmi%3Ex%3C%2Fmi%3E%3C%2Fmath%3E--%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%40font-face%7Bfont-family%3A\'math1fa95123aa5f89781ed4e89a55e\'%3Bsrc%3Aurl(data%3Afont%2Ftruetype%3Bcharset%3Dutf-8%3Bbase64%2CAAEAAAAMAIAAAwBAT1MvMi7iBBMAAADMAAAATmNtYXDEvmKUAAABHAAAADRjdnQgDVUNBwAAAVAAAAA6Z2x5ZoPi2VsAAAGMAAAAhmhlYWQQC2qxAAACFAAAADZoaGVhCGsXSAAAAkwAAAAkaG10eE2rRkcAAAJwAAAACGxvY2EAHTwYAAACeAAAAAxtYXhwBT0FPgAAAoQAAAAgbmFtZaBxlY4AAAKkAAABn3Bvc3QB9wD6AAAERAAAACBwcmVwa1uragAABGQAAAAUAAADSwGQAAUAAAQABAAAAAAABAAEAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAgICAAAAAg1UADev96AAAD6ACWAAAAAAACAAEAAQAAABQAAwABAAAAFAAEACAAAAAEAAQAAQAAIiv%2F%2FwAAIiv%2F%2F93WAAEAAAAAAAABVAMsAIABAABWACoCWAIeAQ4BLAIsAFoBgAKAAKAA1ACAAAAAAAAAACsAVQCAAKsA1QEAASsABwAAAAIAVQAAAwADqwADAAcAADMRIRElIREhVQKr%2FasCAP4AA6v8VVUDAAABAEv%2FawILA0AAGQAAASYOAQMCDgEjJjQ2BiMWPgETEj4BMxYOATYB9TU1ICAgQDZAKlULNTU2ICAgQDVAKwFVCwMVFiuL%2FuD%2BwIogFUAVQBUrigEgAUCLIBVAFT8AAAABAAAAAQAA1XjOQV8PPPUAAwQA%2F%2F%2F%2F%2F9Y6E3P%2F%2F%2F%2F%2F1joTcwAA%2FyAEgAOrAAAACgACAAEAAAAAAAEAAAPo%2F2oAABdwAAD%2FtgSAAAEAAAAAAAAAAAAAAAAAAAACA1IAVQH0AEsAAAAAAAAAKAAAAIYAAQAAAAIAXgAFAAAAAAACAIAEAAAAAAAEAADeAAAAAAAAABUBAgAAAAAAAAABABIAAAAAAAAAAAACAA4AEgAAAAAAAAADADAAIAAAAAAAAAAEABIAUAAAAAAAAAAFABYAYgAAAAAAAAAGAAkAeAAAAAAAAAAIABwAgQABAAAAAAABABIAAAABAAAAAAACAA4AEgABAAAAAAADADAAIAABAAAAAAAEABIAUAABAAAAAAAFABYAYgABAAAAAAAGAAkAeAABAAAAAAAIABwAgQADAAEECQABABIAAAADAAEECQACAA4AEgADAAEECQADADAAIAADAAEECQAEABIAUAADAAEECQAFABYAYgADAAEECQAGAAkAeAADAAEECQAIABwAgQBNAGEAdABoACAARgBvAG4AdABSAGUAZwB1AGwAYQByAE0AYQB0AGgAcwAgAEYAbwByACAATQBvAHIAZQAgAE0AYQB0AGgAIABGAG8AbgB0AE0AYQB0AGgAIABGAG8AbgB0AFYAZQByAHMAaQBvAG4AIAAxAC4AME1hdGhfRm9udABNAGEAdABoAHMAIABGAG8AcgAgAE0AbwByAGUAAAMAAAAAAAAB9AD6AAAAAAAAAAAAAAAAAAAAAAAAAAC5BxEAAI2FGACyAAAAFRQTsQABPw%3D%3D)format(\'truetype\')%3Bfont-weight%3Anormal%3Bfont-style%3Anormal%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Ctext%20font-family%3D%22math1fa95123aa5f89781ed4e89a55e%22%20font-size%3D%2232%22%20text-anchor%3D%22middle%22%20x%3D%228.5%22%20y%3D%2233%22%3E%26%23x222B%3B%3C%2Ftext%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%20x%3D%2217.5%22%20y%3D%2244%22%3E10%3C%2Ftext%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%20x%3D%2224.5%22%20y%3D%2211%22%3E13%3C%2Ftext%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20x%3D%2236.5%22%20y%3D%2229%22%3E2%3C%2Ftext%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-style%3D%22italic%22%20text-anchor%3D%22middle%22%20x%3D%2245.5%22%20y%3D%2229%22%3Ex%3C%2Ftext%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20x%3D%2255.5%22%20y%3D%2229%22%3Ed%3C%2Ftext%3E%3Ctext%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-style%3D%22italic%22%20text-anchor%3D%22middle%22%20x%3D%2264.5%22%20y%3D%2229%22%3Ex%3C%2Ftext%3E%3C%2Fsvg%3E">'
	};
	// jscs:enable maximumLineLength

	bender.editor = true;

	function assertEasyImageUpcast( config ) {
		var editor = config.editor,
			pastedData = config.pastedData,
			shouldUpcast = config.shouldUpcast,
			// spy checks if paste listener in easyimage plugin activated an early return,
			// by attaching to method available after the early return statement.
			spy = sinon.spy( editor.widgets.registered.easyimage, '_spawnLoader' );

		bender.tools.range.setWithHtml( editor.editable(), '<p>[]</p>' );

		bender.tools.emulatePaste( editor, pastedData );

		editor.once( 'afterPaste', function() {
			resume( function() {
				spy.restore();

				if ( shouldUpcast ) {
					sinon.assert.calledOnce( spy );

					assert.areNotSame( -1, editor.getData().indexOf( 'easyimage' ), 'there should be the image upcasted to the easyimage widget' );
				} else {
					sinon.assert.notCalled( spy );

					assert.areSame( -1, editor.getData().indexOf( 'easyimage' ), 'there should not be an image upcasted to the easyimage widget' );
				}
			} );
		} );

		wait();
	}

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );
		},

		'test easyimage upcasts image/jpeg': function() {
			assertEasyImageUpcast( {
				editor: this.editor,
				pastedData: IMG.JPEG,
				shouldUpcast: true
			} );
		},

		'test easyimage upcasts image/gif': function() {
			assertEasyImageUpcast( {
				editor: this.editor,
				pastedData: IMG.GIF,
				shouldUpcast: true
			} );
		},

		'test easyimage upcasts image/png': function() {
			assertEasyImageUpcast( {
				editor: this.editor,
				pastedData: IMG.PNG,
				shouldUpcast: true
			} );
		},

		'test easyimage upcasts image/bmp': function() {
			assertEasyImageUpcast( {
				editor: this.editor,
				pastedData: IMG.BMP,
				shouldUpcast: true
			} );
		},

		'test easyimage not upcasts image/svg': function() {
			assertEasyImageUpcast( {
				editor: this.editor,
				pastedData: IMG.SVG,
				shouldUpcast: false
			} );
		}
	} );
} )();
