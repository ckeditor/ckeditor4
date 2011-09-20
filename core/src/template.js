/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.template = function( editor, source ) {
	// Builds an optimized function body for the output() method, focused on performance.
	// For example, if we have this "source":
	//	'<div style="{style}">{editorName}</div>'
	// ... the resulting function body will be (apart from the "buffer" handling):
	//	return [ '<div style="', data['style'] == undefined ? '$style' : data['style'], '">', data['editorName'] == undefined ? '$editorName' : data['editorName'], '</div>' ].join('');

	var fn = source
	// Escape all quotation marks (").
	.replace( /"/g, '\\"' )
	// Inject the template keys replacement.
	.replace( /{([^}]+)}/g, function( m, key ) {
		return "',data['" + key + "']==undefined?'$" + key + "':data['" + key + "'],'";
	});

	fn = "return buffer?buffer.push('" + fn + "'):['" + fn + "'].join('');";

	this.output = Function( 'data', 'buffer', fn );
};
