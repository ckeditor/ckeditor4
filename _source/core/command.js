/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.command = function( editor, commandDefinition ) {
	this.state = CKEDITOR.TRISTATE_OFF;

	this.exec = function() {
		commandDefinition.exec.call( this, editor );
	};

	CKEDITOR.tools.extend( this, commandDefinition );

	// Call the CKEDITOR.event constructor to initialize this instance.
	CKEDITOR.event.call( this );
};

CKEDITOR.event.implementOn( CKEDITOR.command.prototype );
