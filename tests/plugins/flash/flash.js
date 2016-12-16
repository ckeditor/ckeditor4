/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: flash,toolbar */

'use strict';

bender.editor = true;

bender.test( {
	'test allowed content filter': function() {
		this.editorBot.assertInputOutput(
			'<p><object align="left" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" ' +
				'height="50" hspace="10" vspace="20" width="100">' +
			'<param name="quality" value="high" /><param name="wmode" value="window" /><param name="allowScriptAccess" value="always" />' +
			'<param name="scale" value="showall" /><param name="movie" value="http://t.t" />' +
			'<embed allowscriptaccess="always" height="50" hspace="10" pluginspage="http://www.macromedia.com/go/getflashplayer" quality="high" scale="showall" ' +
				'src="http://t.t" type="application/x-shockwave-flash" vspace="20" width="100" wmode="window" /></object></p>',

			// jscs:disable maximumLineLength
			/<p><img align="left" alt="[^"]+" class="cke_flash" data-cke-real-element-type="flash" data-cke-real-node-type="1" data-cke-realelement="[^"]+" data-cke-resizable="true" src="[^"]+" style="width:\s?100px;\s?height:\s?50px;?" title="[^"]+" \/><\/p>/i
			// jscs:enable maximumLineLength
		);
	}

} );