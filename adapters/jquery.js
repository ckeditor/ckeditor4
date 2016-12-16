/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR_Adapters.jQuery jQuery Adapter}.
 */

/**
 * @class CKEDITOR_Adapters.jQuery
 * @singleton
 *
 * The jQuery Adapter allows for easy use of basic CKEditor functions and access to the internal API.
 * To find more information about the jQuery Adapter, go to the [jQuery Adapter section](#!/guide/dev_jquery)
 * of the Developer's Guide or see the "Create Editors with jQuery" sample.
 *
 * @aside guide dev_jquery
 */

( function( $ ) {
	if ( typeof $ == 'undefined' ) {
		throw new Error( 'jQuery should be loaded before CKEditor jQuery adapter.' );
	}

	if ( typeof CKEDITOR == 'undefined' ) {
		throw new Error( 'CKEditor should be loaded before CKEditor jQuery adapter.' );
	}

	/**
	 * Allows CKEditor to override `jQuery.fn.val()`. When set to `true`, the `val()` function
	 * used on textarea elements replaced with CKEditor uses the CKEditor API.
	 *
	 * This configuration option is global and is executed during the loading of the jQuery Adapter.
	 * It cannot be customized across editor instances.
	 *
	 * Read more in the [documentation](#!/guide/dev_jquery).
	 *
	 *		<script>
	 *			CKEDITOR.config.jqueryOverrideVal = true;
	 *		</script>
	 *
	 *		<!-- Important: The jQuery Adapter is loaded *after* setting jqueryOverrideVal. -->
	 *		<script src="/ckeditor/adapters/jquery.js"></script>
	 *
	 *		<script>
	 *			$( 'textarea' ).ckeditor();
	 *			// ...
	 *			$( 'textarea' ).val( 'New content' );
	 *		</script>
	 *
	 * @cfg {Boolean} [jqueryOverrideVal=true]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.jqueryOverrideVal =
		typeof CKEDITOR.config.jqueryOverrideVal == 'undefined' ? true : CKEDITOR.config.jqueryOverrideVal;

	// jQuery object methods.
	$.extend( $.fn, {
		/**
		 * Returns an existing CKEditor instance for the first matched element.
		 * Allows to easily use the internal API. Does not return a jQuery object.
		 *
		 * Raises an exception if the editor does not exist or is not ready yet.
		 *
		 * @returns CKEDITOR.editor
		 * @deprecated Use {@link #editor editor property} instead.
		 */
		ckeditorGet: function() {
			var instance = this.eq( 0 ).data( 'ckeditorInstance' );

			if ( !instance )
				throw 'CKEditor is not initialized yet, use ckeditor() with a callback.';

			return instance;
		},

		/**
		 * A jQuery function which triggers the creation of CKEditor with `<textarea>` and
		 * {@link CKEDITOR.dtd#$editable editable} elements.
		 * Every `<textarea>` element will be converted to a classic (`iframe`-based) editor,
		 * while any other supported element will be converted to an inline editor.
		 * This method binds the callback to the `instanceReady` event of all instances.
		 * If the editor has already been created, the callback is fired straightaway.
		 * You can also create multiple editors at once by using `$( '.className' ).ckeditor();`.
		 *
		 * **Note**: jQuery chaining and mixed parameter order is allowed.
		 *
		 * @param {Function} callback
		 * Function to be run on the editor instance. Callback takes the source element as a parameter.
		 *
		 *		$( 'textarea' ).ckeditor( function( textarea ) {
		 *			// Callback function code.
		 *		} );
		 *
		 * @param {Object} config
		 * Configuration options for new instance(s) if not already created.
		 *
		 *		$( 'textarea' ).ckeditor( {
		 *			uiColor: '#9AB8F3'
		 *		} );
		 *
		 * @returns jQuery.fn
		 */
		ckeditor: function( callback, config ) {
			if ( !CKEDITOR.env.isCompatible )
				throw new Error( 'The environment is incompatible.' );

			// Reverse the order of arguments if the first one isn't a function.
			if ( !$.isFunction( callback ) ) {
				var tmp = config;
				config = callback;
				callback = tmp;
			}

			// An array of instanceReady callback promises.
			var promises = [];

			config = config || {};

			// Iterate over the collection.
			this.each( function() {
				var $element = $( this ),
					editor = $element.data( 'ckeditorInstance' ),
					instanceLock = $element.data( '_ckeditorInstanceLock' ),
					element = this,
					dfd = new $.Deferred();

				promises.push( dfd.promise() );

				if ( editor && !instanceLock ) {
					if ( callback )
						callback.apply( editor, [ this ] );

					dfd.resolve();
				} else if ( !instanceLock ) {
					// CREATE NEW INSTANCE

					// Handle config.autoUpdateElement inside this plugin if desired.
					if ( config.autoUpdateElement || ( typeof config.autoUpdateElement == 'undefined' && CKEDITOR.config.autoUpdateElement ) ) {
						config.autoUpdateElementJquery = true;
					}

					// Always disable config.autoUpdateElement.
					config.autoUpdateElement = false;
					$element.data( '_ckeditorInstanceLock', true );

					// Set instance reference in element's data.
					if ( $( this ).is( 'textarea' ) )
						editor = CKEDITOR.replace( element, config );
					else
						editor = CKEDITOR.inline( element, config );

					$element.data( 'ckeditorInstance', editor );

					// Register callback.
					editor.on( 'instanceReady', function( evt ) {
						var editor = evt.editor;

						setTimeout( function() {
							// Delay bit more if editor is still not ready.
							if ( !editor.element ) {
								setTimeout( arguments.callee, 100 );
								return;
							}

							// Remove this listener. Triggered when new instance is ready.
							evt.removeListener();

							/**
							 * Forwards the CKEditor {@link CKEDITOR.editor#event-dataReady dataReady event} as a jQuery event.
							 *
							 * @event dataReady
							 * @param {CKEDITOR.editor} editor Editor instance.
							 */
							editor.on( 'dataReady', function() {
								$element.trigger( 'dataReady.ckeditor', [ editor ] );
							} );

							/**
							 * Forwards the CKEditor {@link CKEDITOR.editor#event-setData setData event} as a jQuery event.
							 *
							 * @event setData
							 * @param {CKEDITOR.editor} editor Editor instance.
							 * @param data
							 * @param {String} data.dataValue The data that will be used.
							 */
							editor.on( 'setData', function( evt ) {
								$element.trigger( 'setData.ckeditor', [ editor, evt.data ] );
							} );

							/**
							 * Forwards the CKEditor {@link CKEDITOR.editor#event-getData getData event} as a jQuery event.
							 *
							 * @event getData
							 * @param {CKEDITOR.editor} editor Editor instance.
							 * @param data
							 * @param {String} data.dataValue The data that will be returned.
							 */
							editor.on( 'getData', function( evt ) {
								$element.trigger( 'getData.ckeditor', [ editor, evt.data ] );
							}, 999 );

							/**
							 * Forwards the CKEditor {@link CKEDITOR.editor#event-destroy destroy event} as a jQuery event.
							 *
							 * @event destroy
							 * @param {CKEDITOR.editor} editor Editor instance.
							 */
							editor.on( 'destroy', function() {
								$element.trigger( 'destroy.ckeditor', [ editor ] );
							} );

							// Overwrite save button to call jQuery submit instead of javascript submit.
							// Otherwise jQuery.forms does not work properly
							editor.on( 'save', function() {
								$( element.form ).submit();
								return false;
							}, null, null, 20 );

							// Integrate with form submit.
							if ( editor.config.autoUpdateElementJquery && $element.is( 'textarea' ) && $( element.form ).length ) {
								var onSubmit = function() {
									$element.ckeditor( function() {
										editor.updateElement();
									} );
								};

								// Bind to submit event.
								$( element.form ).submit( onSubmit );

								// Bind to form-pre-serialize from jQuery Forms plugin.
								$( element.form ).bind( 'form-pre-serialize', onSubmit );

								// Unbind when editor destroyed.
								$element.bind( 'destroy.ckeditor', function() {
									$( element.form ).unbind( 'submit', onSubmit );
									$( element.form ).unbind( 'form-pre-serialize', onSubmit );
								} );
							}

							// Garbage collect on destroy.
							editor.on( 'destroy', function() {
								$element.removeData( 'ckeditorInstance' );
							} );

							// Remove lock.
							$element.removeData( '_ckeditorInstanceLock' );

							/**
							 * Forwards the CKEditor {@link CKEDITOR.editor#event-instanceReady instanceReady event} as a jQuery event.
							 *
							 * @event instanceReady
							 * @param {CKEDITOR.editor} editor Editor instance.
							 */
							$element.trigger( 'instanceReady.ckeditor', [ editor ] );

							// Run given (first) code.
							if ( callback )
								callback.apply( editor, [ element ] );

							dfd.resolve();
						}, 0 );
					}, null, null, 9999 );
				} else {
					// Editor is already during creation process, bind our code to the event.
					editor.once( 'instanceReady', function() {
						setTimeout( function() {
							// Delay bit more if editor is still not ready.
							if ( !editor.element ) {
								setTimeout( arguments.callee, 100 );
								return;
							}

							// Run given code.
							if ( editor.element.$ == element && callback )
								callback.apply( editor, [ element ] );

							dfd.resolve();
						}, 0 );
					}, null, null, 9999 );
				}
			} );

			/**
			 * The [jQuery Promise object]((http://api.jquery.com/promise/)) that handles the asynchronous constructor.
			 * This promise will be resolved after **all** of the constructors.
			 *
			 * @property {Function} promise
			 */
			var dfd = new $.Deferred();

			this.promise = dfd.promise();

			$.when.apply( this, promises ).then( function() {
				dfd.resolve();
			} );

			/**
			 * Existing CKEditor instance. Allows to easily use the internal API.
			 *
			 * **Note**: This is not a jQuery object.
			 *
			 *		var editor = $( 'textarea' ).ckeditor().editor;
			 *
			 * @property {CKEDITOR.editor} editor
			 */
			this.editor = this.eq( 0 ).data( 'ckeditorInstance' );

			return this;
		}
	} );

	/**
	 * Overwritten jQuery `val()` method for `<textarea>` elements that have bound CKEditor instances.
	 * This method gets or sets editor content by using the {@link CKEDITOR.editor#method-getData editor.getData()}
	 * or {@link CKEDITOR.editor#method-setData editor.setData()} methods. To handle
	 * the {@link CKEDITOR.editor#method-setData editor.setData()} callback (as `setData` is asynchronous),
	 * `val( 'some data' )` will return a [jQuery Promise object](http://api.jquery.com/promise/).
	 *
	 * @method val
	 * @returns String|Number|Array|jQuery.fn|function(jQuery Promise)
	 */
	if ( CKEDITOR.config.jqueryOverrideVal ) {
		$.fn.val = CKEDITOR.tools.override( $.fn.val, function( oldValMethod ) {
			return function( value ) {
				// Setter, i.e. .val( "some data" );
				if ( arguments.length ) {
					var _this = this,
						promises = [], //use promise to handle setData callback

						result = this.each( function() {
							var $elem = $( this ),
								editor = $elem.data( 'ckeditorInstance' );

							// Handle .val for CKEditor.
							if ( $elem.is( 'textarea' ) && editor ) {
								var dfd = new $.Deferred();

								editor.setData( value, function() {
									dfd.resolve();
								} );

								promises.push( dfd.promise() );
								return true;
								// Call default .val function for rest of elements
							} else {
								return oldValMethod.call( $elem, value );
							}
						} );

					// If there is no promise return default result (jQuery object of chaining).
					if ( !promises.length )
						return result;
					// Create one promise which will be resolved when all of promises will be done.
					else {
						var dfd = new $.Deferred();

						$.when.apply( this, promises ).done( function() {
							dfd.resolveWith( _this );
						} );

						return dfd.promise();
					}
				}
				// Getter .val();
				else {
					var $elem = $( this ).eq( 0 ),
						editor = $elem.data( 'ckeditorInstance' );

					if ( $elem.is( 'textarea' ) && editor )
						return editor.getData();
					else
						return oldValMethod.call( $elem );
				}
			};
		} );
	}
} )( window.jQuery );
