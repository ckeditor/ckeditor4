/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview jQuery plugin provides easy use of basic CKEditor functions
 *   and access to internal API. It also integrates some aspects of CKEditor with
 *   jQuery framework.
 */

(function() {
	CKEDITOR.plugins.add( 'jquery', {
		load: function() {
			if ( !this.onLoad._called ) {
				this.onLoad();
				this.onLoad._called = 1;
			}
		},
		onLoad: function() {
			if ( typeof jQuery == 'undefined' )
				return;

			// jQuery namespace methods.
			jQuery.extend( jQuery,
			/** @lends jQuery */ {
				/**
				 * Easily extend global CKEDITOR.config object.
				 *
				 * @name jQuery.ckeditorConfig
				 * @param myConfig
				 * @example
				 * jQuery.ckeditorConfig( { language: 'ar' } );
				 */
				ckeditorConfig: function( myConfig ) {
					jQuery.extend( CKEDITOR.config, myConfig );
				}
			});

			// jQuery object methods.
			jQuery.extend( jQuery.fn,
			/** @lends jQuery.fn */ {
				/**
				 * Return existing CKEditor instance for first matched element.
				 * Allows to easily use internal API. Doesn't return jQuery object.
				 *
				 * Raised exception if editor doesn't exist or isn't ready yet.
				 *
				 * @name jQuery.ckeditorGet
				 * @return CKEDITOR.editor
				 * @see CKEDITOR.editor
				 */
				ckeditorGet: function() {
					var instance = this.eq( 0 ).data( 'ckeditorInstance' );
					if ( !instance )
						throw "CKEditor not yet initialized, use ckeditor() with callback.";
					return instance;
				},
				/**
				 * Triggers creation of CKEditor in all matched elements (reduced to DIV, P and TEXTAREAs).
				 * Binds callback to instanceReady event of all instances. If editor is already created, than
				 * callback is fired right away.
				 *
				 * Mixed parameter order allowed.
				 *
				 * @param callback Function to be run on editor instance. Passed parameters: [ textarea ].
				 * Callback is fiered in "this" scope being ckeditor instance and having source textarea as first param.
				 *
				 * @param config Configuration options for new instance(s) if not already created.
				 * See URL
				 *
				 * @example
				 * $( 'textarea' ).ckeditor( function( textarea ) {
				 *   $( textarea ).val( this.getData() )
				 * } );
				 * 
				 * @name jQuery.fn.ckeditor
				 * @return jQuery.fn
				 */
				ckeditor: function( callback, config ) {
					if ( !jQuery.isFunction( callback ) ) {
						var tmp = config;
						config = callback;
						callback = tmp;
					}
					config = config || {};

					this.filter( 'textarea, div, p' ).each( function() {
						var $element = jQuery( this ),
							instance = $element.data( 'ckeditorInstance' ),
							element = this;

						if ( instance ) {
							if ( callback )
								callback.apply( instance, [ this ] );
						} else if ( $element.data( '_ckeditorInstanceLock' ) ) {
							// Editor is already during creation process, bind our code to the event.
							CKEDITOR.on( 'instanceReady', function( event ) {
								var editor = event.editor;
								setTimeout( function() {
									// Delay bit more if editor is still not ready.
									if ( !editor.element )
										return setTimeout( arguments.callee, 100 );

									if ( editor.element.$ == element ) {
										// Run given code.
										if ( callback )
											callback.apply( editor, [ element ] );
									}
								}, 0 );
							}, null, null, 9999 );
						} else {
							// CREATE NEW INSTANCE
							// Register callback.
							CKEDITOR.on( 'instanceReady', function( event ) {
								var editor = event.editor;
								setTimeout( function() {
									// Delay bit more if editor is still not ready.
									if ( !editor.element )
										return setTimeout( arguments.callee, 100 );

									if ( editor.element.$ != element )
										return;

									// Remove this listener.
									event.removeListener( 'instanceReady', this.callee );

									// Forward setData event for wysiwygarea mode.
									editor.on( 'contentDom', function( event ) {
										setTimeout( function() {
											$element.trigger( 'setData' + '.ckeditor', [ editor, editor.getData() ] );
										}, 100 );
									});

									// Forward setData only for sourcearea mode.
									editor.on( 'afterSetData', function( event ) {
										if ( editor.mode != 'wysiwyg' )
											$element.trigger( 'setData' + '.ckeditor', [ editor, event.data.dataValue ] );
									});

									// Forward getData.
									editor.on( 'getData', function( event ) {
										$element.trigger( 'getData' + '.ckeditor', [ editor, event.data.dataValue ] );
									});

									// Forward destroy event.
									editor.on( 'destroy', function( event ) {
										$element.trigger( 'destroy.ckeditor', [ editor ] );
									});

									// Integrate with form submit.
									if ( editor.config.autoUpdateElementJquery && $element.is( 'textarea' ) && $element.parents( 'form' ).length ) {
										var onSubmit = function() {
												$element.ckeditor( function() {
													editor.updateElement();
												});
											};

										// Bind to submit event.
										$element.parents( 'form' ).submit( onSubmit );

										// Unbind when editor destroyed.
										$element.bind( 'destroy.ckeditor', function() {
											$element.parents( 'form' ).unbind( 'submit', onSubmit );
										});
									}

									// Set instance reference in element's data.
									$element.data( 'ckeditorInstance', editor );

									// Garbage collect on destroy.
									$element.bind( 'destroy.ckeditor', function() {
										$element.data( 'ckeditorInstance', null );
									});

									// Remove lock.
									$element.data( '_ckeditorInstanceLock', null );

									// Fire instanceReady event.
									$element.trigger( 'instanceReady.ckeditor', [ editor ] );

									// Run given (first) code.
									if ( callback )
										callback.apply( editor, [ element ] );
								}, 0 );
							}, null, null, 9999 );

							// Trigger instance creation.

							// Handle config.autoUpdateElement inside this plugin if desired.
							if ( config.autoUpdateElement || ( typeof config.autoUpdateElement == 'undefined' && CKEDITOR.config.autoUpdateElement ) ) {
								config.autoUpdateElementJquery = true;
							}

							// Always disable config.autoUpdateElement.
							config.autoUpdateElement = false;
							$element.data( '_ckeditorInstanceLock', true );
							CKEDITOR.replace( element, config );
						}
					});
					return this;
				}
			});

			// New val() method for objects.
			if ( CKEDITOR.config.jqueryOverrideVal ) {
				jQuery.fn.val = CKEDITOR.tools.override( jQuery.fn.val, function( oldValMethod ) {
					/**
					 * CKEditor-aware val() method.
					 *
					 * Acts same as original jQuery val(), but for textareas which have CKEditor instances binded to them, method
					 * returns editor's content. It also works for settings values.
					 *
					 * @param oldValMethod
					 * @name jQuery.fn.val
					 */
					return function( newValue, forceNative ) {
						var isSetter = typeof newValue != 'undefined',
							result;

						this.each( function() {
							var $this = jQuery( this ),
								editor = $this.data( 'ckeditorInstance' );

							if ( !forceNative && $this.is( 'textarea' ) && editor ) {
								if ( isSetter )
									editor.setData( newValue );
								else {
									result = editor.getData();
									// break;
									return null;
								}
							} else {
								if ( isSetter )
									oldValMethod.call( $this, newValue );
								else {
									result = oldValMethod.call( $this );
									// break;
									return null;
								}
							}
						});
						return isSetter ? this : result;
					};
				});
			}
		}
	});
})();

/**
 * Allow CKEditor to override jQuery.fn.val(). This results in ability to use val()
 * function on textareas as usual and having those calls synchronized with CKEditor
 * Rich Text Editor component.
 *
 * This config option is global and executed during plugin load.
 * Can't be customized across editor instances.
 *
 * @type Boolean
 * @example
 * $( 'textarea' ).ckeditor();
 * // ...
 * $( 'textarea' ).val( 'New content' );
 */
CKEDITOR.config.jqueryOverrideVal = true;
