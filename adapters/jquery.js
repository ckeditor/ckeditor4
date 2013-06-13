/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link adapters.jQuery jQuery adapter}.
 */

/**
 * @class adapters.jQuery
 *
 * jQuery adapter provides easy use of basic CKEditor functions and access to internal API.
 * To find more information about jQuery adapter go to [guide page](#!/guide/dev_jquery) or see the sample.
 *
 * @aside guide dev_jquery
 */

(function( $ ) {
	/**
	 * Allows CKEditor to override `jQuery.fn.val()`, making possible to use the val()
	 * function on textareas, as usual, having it synchronized with CKEditor.
	 *
	 * This configuration option is global and executed during the jQuery Adapter loading.
	 * It can't be customized across editor instances.
	 *
	 *		<script>
	 *			CKEDITOR.config.jqueryOverrideVal = true;
	 *		</script>
	 *
	 *		<!-- Important: The JQuery adapter is loaded *after* setting jqueryOverrideVal -->
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
	CKEDITOR.config.jqueryOverrideVal = typeof CKEDITOR.config.jqueryOverrideVal == 'undefined'  ?
				true
			:
				CKEDITOR.config.jqueryOverrideVal;

	if ( typeof $ == 'undefined' )
		return;

	// jQuery object methods.
	$.extend( $.fn, {
		/**
		 * Return existing CKEditor instance for first matched element.
		 * Allows to easily use internal API. Doesn't return jQuery object.
		 *
		 * Raised exception if editor doesn't exist or isn't ready yet.
		 *
		 * @method ckeditorGet
		 * @returns CKEDITOR.editor
		 * @deprecated Use {@link #editor editor property} instead.
		 */
		ckeditorGet: function() {
			var instance = this.eq( 0 ).data( 'ckeditorInstance' );

			if ( !instance )
				throw 'CKEditor not yet initialized, use ckeditor() with callback.';

			return instance;
		},

		/**
		 * jQuery function which triggers creation of CKEditor with `<textarea>` and {@link CKEDITOR.dtd#$editable editable elements}.
		 * Every `<textarea>` element will be converted to framed editor and any other supported element to inline editor.
		 * This method binds callback to `instanceReady` event of all instances.
		 * If editor is already created, then callback is fired right away.
		 *
		 * **Note**: jQuery chaining and mixed parameter order allowed.
		 *
		 * @method ckeditor
		 *
		 * @param {Function} callback
		 * Function to be run on editor instance. Callback takes source element as parameter.
		 *
		 *		$( 'textarea' ).ckeditor( function( textarea ) {
		 *			// callback function code
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
				throw new Error( 'Environment is incompatible.' );

			if ( !$.isFunction( callback ) ) {
				var tmp = config;
				config = callback;
				callback = tmp;
			}

			config = config || {};

			this.each( function() {
				var $element = $( this ),
					editor = $element.data( 'ckeditorInstance' ),
					instanceLock = $element.data( '_ckeditorInstanceLock' ),
					element = this;

				if ( editor && !instanceLock ) {
					if ( callback )
						callback.apply( editor, [ this ] );
				} else if ( !instanceLock ) {
					// CREATE NEW INSTANCE

					// Handle config.autoUpdateElement inside this plugin if desired.
					if ( config.autoUpdateElement
						|| ( typeof config.autoUpdateElement == 'undefined' && CKEDITOR.config.autoUpdateElement ) ) {
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
					editor.on( 'instanceReady', function( event ) {
						var editor = event.editor;

						setTimeout( function() {
							// Delay bit more if editor is still not ready.
							if ( !editor.element ) {
								setTimeout( arguments.callee, 100 );
								return;
							}

							// Remove this listener. Triggered when new instance is ready.
							event.removeListener( 'instanceReady', this.callee );

							/**
							 * Forwarded editor's {@link CKEDITOR.editor#event-dataReady dataReady event} as a jQuery event.
							 * @event dataReady
							 *
							 * @param {CKEDITOR.editor} editor Editor's instance.
							 */
							editor.on( 'dataReady', function() {
								$element.trigger( 'dataReady.ckeditor', [ editor ] );
							} );

							/**
							 * Forwarded editor's {@link CKEDITOR.editor#event-setData setData event} as a jQuery event.
							 * @event setData
							 *
							 * @param {CKEDITOR.editor} editor Editor's instance.
							 * @param data
							 * @param {String} data.dataValue The data that will be used.
							 */
							editor.on( 'setData', function( event ) {
								$element.trigger( 'setData.ckeditor', [ editor, event.data ] );
							} );

							/**
							 * Forwarded editor's {@link CKEDITOR.editor#event-getData getData event} as a jQuery event.
							 * @event getData
							 *
							 * @param {CKEDITOR.editor} editor Editor's instance.
							 * @param data
							 * @param {String} data.dataValue The data that will be returned.
							 */
							editor.on( 'getData', function( event ) {
								$element.trigger( 'getData.ckeditor', [ editor, event.data ] );
							}, 999 );

							/**
							 * Forwarded editor's {@link CKEDITOR.editor#event-destroy destroy event} as a jQuery event.
							 * @event destroy
							 *
							 * @param {CKEDITOR.editor} editor Editor's instance.
							 */
							editor.on( 'destroy', function() {
								$element.trigger( 'destroy.ckeditor', [ editor ] );
							} );

							// Overwrite save button to call jQuery submit instead of javascript submit.
							// Otherwise jQuery.forms does not work properly
							editor.on( 'save', function() {
								$( element.form ).submit();
								return false;
							}, null, null, 9 );

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
							 * Forwarded editor's {@link CKEDITOR.editor#event-instanceReady instanceReady event} as a jQuery event.
							 *
							 * @event instanceReady
							 * @param {CKEDITOR.editor} editor Editor's instance.
							 */
							$element.trigger( 'instanceReady.ckeditor', [ editor ] );

							// Run given (first) code.
							if ( callback )
								callback.apply( editor, [ element ] );
						}, 0 );
					}, null, null, 9999 );
				} else {
					// Editor is already during creation process, bind our code to the event.
					CKEDITOR.on( 'instanceReady', function( event ) {
						var editor = event.editor;
						setTimeout( function() {
							// Delay bit more if editor is still not ready.
							if ( !editor.element ) {
								setTimeout( arguments.callee, 100 );
								return;
							}

							// Run given code.
							if ( editor.element.$ == element && callback )
								callback.apply( editor, [ element ] );
						}, 0 );
					}, null, null, 9999 );
				}
			} );

			/**
			 * Existing CKEditor instance. Allows to easily use internal API.
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
	 * Overwritten jQuery `val()` method for `<textarea>` elements which have CKEditor instances bound.
	 * Method gets or sets editor's content using {@link CKEDITOR.editor#method-getData editor.getData()}
	 * or {@link CKEDITOR.editor#method-setData editor.setData()}.
	 *
	 * @method val
	 */
	if ( CKEDITOR.config.jqueryOverrideVal ) {
		$.valHooks[ 'textarea' ] = {
			get: function( elem ) {
				var $this = $( elem ),
					editor = $this.data( 'ckeditorInstance' );

				if ( editor )
					return editor.getData();
			},
			set: function( elem, value ) {
				var $this = $( elem ),
					editor = $this.data( 'ckeditorInstance' );

				if ( editor )
					editor.setData( value );
			}
		};
	}
})( window.jQuery );