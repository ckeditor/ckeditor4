
'use strict';

CKEDITOR.plugins.add( 'customMsg', {

	init: function( editor ) {
		// Overwrites default `editor.showAlert`.
		editor.showAlert = function( message, callback ) {
			var customMsg = new CKEDITOR.plugins.customMsg( editor, {
				message: message,
				type: 'alertDialog',
				callback: callback
			} );

			customMsg.show();
			return customMsg;
		};

		// Overwrites default `editor.showConfirm`.
		editor.showConfirm = function( message, callback ) {
			var customMsg = new CKEDITOR.plugins.customMsg( editor, {
				message: message,
				type: 'confirmDialog',
				callback: callback
			} );

			customMsg.show();
			return customMsg;
		};
	}
} );

/**
 * CustomMsg class. 
 */
function CustomMsg( editor, options ) {
	CKEDITOR.tools.extend( this, options, {
		editor: editor
	} );

	this.ok = false;	// set as default value
	this.callback = options.callback;
	this.element = this._createElement();
}

CustomMsg.prototype = {
	/**
	 * shows an alert or confirmation dialog element. 
	 */
	show: function() {
		CKEDITOR.document.getBody().append( this.element );
	},

	/**
	 * Creates a dialog DOM element.
	 *
	 * @private
	 * @returns {CKEDITOR.dom.element} dialog DOM element.
	 */
	_createElement: function() {
		var customMsg = this,
			userDialogElement, modalElement, contentElement, messageElement, footerElement, okElement,
			alertOkButtonElement, confirmOkButtonElement, confirmCancelButtonElement,
			ok = this.editor.lang.common.ok,
			cancel = this.editor.lang.common.cancel;

		userDialogElement = new CKEDITOR.dom.element( 'div' );

		userDialogElement.setAttribute( 'id', 'overlay' );
		userDialogElement.setStyle( 'display', 'block' );		
		userDialogElement.setStyle( 'z-index', 11000 );

		modalElement = new CKEDITOR.dom.element( 'div' );
		modalElement.setAttribute( 'id', this.type );	//(alertDialog / confirmDialog)
		modalElement.setStyle( 'display', 'block' );
		modalElement.setStyle( 'z-index', 12000 );

		contentElement = new CKEDITOR.dom.element( 'div' );
		contentElement.addClass( 'cke_customMsg_content' );

		footerElement = new CKEDITOR.dom.element( 'footer' );
		if ( this.type == 'alertDialog' ) {
			alertOkButtonElement = this._createButton( 'alertDialogButton',ok );
			footerElement.append( alertOkButtonElement );

			alertOkButtonElement.on( 'click', function() {
				modalElement.setStyle( 'display', 'none' );
				userDialogElement.setStyle( 'display', 'none' );
				customMsg.ok = true;
				customMsg.callback && ( customMsg.callback( true ) );
			} );

			if ( this.editor.lang.dir == 'rtl' )
				alertOkButtonElement.setStyle( 'float','left' );
			else
				alertOkButtonElement.setStyle( 'float','right' );
		}
		if ( this.type == 'confirmDialog' ) {
			confirmOkButtonElement = this._createButton( 'confirmDialogOk', ok );
			confirmOkButtonElement.addClass( 'cke_cutomMsg_button_ok' );
			confirmCancelButtonElement = this._createButton( 'confirmDialogCancel', cancel );
			confirmCancelButtonElement.addClass( 'cke_customMsg_button_cancel' );
			footerElement.append( confirmCancelButtonElement );
			footerElement.append( confirmOkButtonElement );

			confirmOkButtonElement.on( 'click', function() {
				modalElement.setStyle( 'display', 'none' );
				userDialogElement.setStyle( 'display', 'none' );
				customMsg.ok = true;
				customMsg.callback && ( customMsg.callback( true ) );
			} );
			confirmCancelButtonElement.on( 'click', function() {
				modalElement.setStyle( 'display', 'none' );
				userDialogElement.setStyle( 'display', 'none' );
				customMsg.ok = false;
				customMsg.callback && ( customMsg.callback(false) );				
			} );

			if ( this.editor.lang.dir == 'rtl' ) {
				confirmCancelButtonElement.setStyle( 'float','left' );
				confirmOkButtonElement.setStyle( 'float','left' );
			}
			else {
				confirmCancelButtonElement.setStyle( 'float','right' );
				confirmOkButtonElement.setStyle( 'float','right' );
			}
		}

		messageElement = new CKEDITOR.dom.element( 'p' );
		messageElement.setHtml( this.message );
		if ( this.editor.lang.dir == 'rtl' ) 
			messageElement.setAttribute( 'dir', 'rtl' );
		contentElement.append( messageElement );

		modalElement.append ( contentElement );
		modalElement.append ( footerElement );
		userDialogElement.append ( modalElement );

		return userDialogElement; 
	},

	/**
	 * Create and return button element
	 *
	 * @param {String} text
	 * @param {String} cssClasses
	 * @returns {CKEDITOR.dom.element}
	 */
	_createButton: function( id, text ) {
		var button = new CKEDITOR.dom.element( 'button' );
		button.setHtml( text );
		button.setAttributes( {
			id: id
		} );
		button.addClass( 'cke_customMsg_button' );
		return button;
	}
};

CKEDITOR.plugins.customMsg = CustomMsg;