/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines {@link CKEDITOR#verbosity} and binary flags {@link CKEDITOR#VERBOSITY_WARN} and
 * {@link CKEDITOR#VERBOSITY_ERROR}. Defines also the {@link CKEDITOR#error} and {@link CKEDITOR#warn} functions
 * and the default handler for the {@link CKEDITOR#log} event.
 */

/* global console */

'use strict';

/**
 * Warning reporting verbosity level. When {@link CKEDITOR#verbosity} is set to this value, only {@link CKEDITOR#warn}
 * messages will be output to the console. It is a binary flag so it might be combined with
 * the {@link CKEDITOR#VERBOSITY_ERROR} flag.
 *
 * @since 4.5.4
 * @readonly
 * @property {Number} [=1]
 * @member CKEDITOR
 */
CKEDITOR.VERBOSITY_WARN = 1;

/**
 * Error reporting verbosity level. When {@link CKEDITOR#verbosity} is set to this value, only {@link CKEDITOR#error}
 * messages will be output to the console. It is a binary flag so it might be combined with
 * the {@link CKEDITOR#VERBOSITY_WARN} flag.
 *
 * @since 4.5.4
 * @readonly
 * @property {Number} [=2]
 * @member CKEDITOR
 */
CKEDITOR.VERBOSITY_ERROR = 2;

/**
 * Verbosity of {@link CKEDITOR#error} and {@link CKEDITOR#warn} methods. Accepts binary flags
 * {@link CKEDITOR#VERBOSITY_WARN} and {@link CKEDITOR#VERBOSITY_ERROR}.
 *
 * 			CKEDITOR.verbosity = 0; // No console output after CKEDITOR.warn and CKEDITOR.error methods.
 * 			CKEDITOR.verbosity = CKEDITOR.VERBOSITY_WARN; // Console output after CKEDITOR.warn only.
 * 			CKEDITOR.verbosity = CKEDITOR.VERBOSITY_ERROR; // Console output after CKEDITOR.error only.
 * 			CKEDITOR.verbosity = CKEDITOR.VERBOSITY_WARN | CKEDITOR.VERBOSITY_ERROR; // Console output after both methods.
 *
 * Default value enables both {@link CKEDITOR#VERBOSITY_WARN} and {@link CKEDITOR#VERBOSITY_ERROR}.
 *
 * @since 4.5.4
 * @member CKEDITOR
 * @type {Number}
 */
CKEDITOR.verbosity = CKEDITOR.VERBOSITY_WARN | CKEDITOR.VERBOSITY_ERROR;

/**
 * Warning reporting function. When {@link CKEDITOR#verbosity} has the {@link CKEDITOR#VERBOSITY_WARN} flag set, it fires
 * the {@link CKEDITOR#log} event with type set to `warn`. Fired event contains also provided `errorCode` and `additionalData`.
 *
 * @since 4.5.4
 * @member CKEDITOR
 * @param {String} errorCode Error code describing reported problem.
 * @param {Object} [additionalData] Additional data associated with reported problem.
 */
CKEDITOR.warn = function( errorCode, additionalData ) {
	if ( CKEDITOR.verbosity & CKEDITOR.VERBOSITY_WARN ) {
		CKEDITOR.fire( 'log', { type: 'warn', errorCode: errorCode, additionalData: additionalData } );
	}
};

/**
 * Error reporting function. When {@link CKEDITOR#verbosity} has {@link CKEDITOR#VERBOSITY_ERROR} flag set, it fires
 * {@link CKEDITOR#log} event with the type set to `error`. The fired event also contains the provided `errorCode` and
 * `additionalData`.
 *
 * @since 4.5.4
 * @member CKEDITOR
 * @param {String} errorCode Error code describing the reported problem.
 * @param {Object} [additionalData] Additional data associated with the reported problem.
 */
CKEDITOR.error = function( errorCode, additionalData ) {
	if ( CKEDITOR.verbosity & CKEDITOR.VERBOSITY_ERROR ) {
		CKEDITOR.fire( 'log', { type: 'error', errorCode: errorCode, additionalData: additionalData } );
	}
};

/**
 * Fired by {@link CKEDITOR#warn} and {@link CKEDITOR#error} methods.
 * Default listener logs provided information to the console.
 *
 * This event can be used to provide a custom error/warning handler:
 *
 * 			CKEDTIOR.on( 'log', function( evt ) {
 *			    	// Cancel default listener.
 *					evt.cancel();
 *					// Log event data.
 *					console.log( evt.data.type, evt.data.errorCode, evt.data.additionalData );
 * 			} );
 *
 * @since 4.5.4
 * @event log
 * @member CKEDITOR
 * @param data
 * @param {String} data.type Log type. Can be `error` or `warn`.
 * @param {String} data.errorCode Error code describing the reported problem.
 * @param {Object} [data.additionalData] Additional data associated with this log event.
 */
CKEDITOR.on( 'log', function( evt ) {
	if ( !window.console || !window.console.log ) {
		return;
	}

	var type = console[ evt.data.type ] ? evt.data.type : 'log',
		errorCode = evt.data.errorCode,
		additionalData = evt.data.additionalData,
		prefix = '[CKEDITOR] ',
		errorCodeLabel = 'Error code: ';

	if ( additionalData ) {
		console[ type ]( prefix + errorCodeLabel + errorCode + '.', additionalData );
	} else {
		console[ type ]( prefix + errorCodeLabel + errorCode + '.' );
	}

	console[ type ]( prefix + 'For more information about this error go to https://ckeditor.com/docs/ckeditor4/latest/guide/dev_errors.html#' + errorCode );
}, null, null, 999 );
