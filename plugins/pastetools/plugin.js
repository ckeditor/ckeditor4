/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview This plugin allows to register new paste handlers.
 */

( function() {
	var loadedFilters = [],
		PasteTools = CKEDITOR.tools.createClass( {
			$: function() {
				this.handlers = [];
			},

			proto: {
				register: function( definition ) {
					if ( typeof definition.priority !== 'number' ) {
						definition.priority = 10;
					}

					this.handlers.push( definition );
				},

				addPasteListener: function( editor ) {
					editor.on( 'paste', function( evt ) {
						var handlers = getMatchingHandlers( this.handlers, evt ),
							filters,
							isLoaded;

						if ( handlers.length === 0 ) {
							return;
						}

						filters = getFilters( handlers );

						isLoaded = loadFilters( filters, function() {
							return editor.fire( 'paste', evt.data );
						} );

						if ( !isLoaded ) {
							return evt.cancel();
						}

						handlePaste( handlers, evt );
					}, this, null, 3 );
				}
			}
		} );

	CKEDITOR.plugins.add( 'pastetools', {
		requires: 'clipboard',
		beforeInit: function( editor ) {
			editor.pasteTools = new PasteTools();

			editor.pasteTools.addPasteListener( editor );
		}
	} );

	/**
	 * Set of pastetools helpers.
	 *
	 * @member CKEDITOR.plugins
	 * @since 4.13.0
	 */
	CKEDITOR.plugins.pastetools = {
		/**
		 * Collection of available filters
		 *
		 * @member CKEDITOR.plugins.pastetools
		 * @property {Object.<String,Object>}
		 */
		filters: {},

		/**
		 * Load external scripts, containing filters' definitions, in given order.
		 *
		 * @param filters {String[]} Array of filters' URLs.
		 * @param callback {Function} Callback that will be invoked after loading all scripts.
		 * @member CKEDITOR.plugins.pastetools
		 */
		loadFilters: loadFilters,

		/**
		 * Creates filter based on passed rules.
		 *
		 * @param options {Object}
		 * @param options.rules {Function} Function returning filter's rules.
		 * @param options.additionalTransforms {Function} Function transforming HTML before passing it to the filter.
		 * @returns {Function} Function that wraps filter invocation.
		 * @member CKEDITOR.plugins.pastetools
		 */
		createFilter: function( options ) {
			var rules = CKEDITOR.tools.array.isArray( options.rules ) ? options.rules : [ options.rules ],
				additionalTransforms = options.additionalTransforms;

			return function( html, editor ) {
				var writer = new CKEDITOR.htmlParser.basicWriter(),
					filter = new CKEDITOR.htmlParser.filter(),
					fragment;

				if ( additionalTransforms ) {
					html = additionalTransforms( html, editor );
				}

				CKEDITOR.tools.array.forEach( rules, function( rule ) {
					filter.addRules( rule( html, editor, filter ) );
				} );

				fragment = CKEDITOR.htmlParser.fragment.fromHtml( html );

				filter.applyTo( fragment );
				fragment.writeHtml( writer );

				return writer.getHtml();
			};
		},

		/**
		 * Get clipboard data.
		 *
		 * @param data {Object} Paste event `data` property.
		 * @param type {String} MIME type of requested data.
		 * @returns {mixed} Raw clipboard data.
		 * @member CKEDITOR.plugins.pastetools
		 */
		getClipboardData: function( data, type ) {
			var dataTransfer;

			if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported && type !== 'text/html' ) {
				return null;
			}

			dataTransfer = data.dataTransfer.getData( type, true );

			// Some commands fire paste event without setting dataTransfer property. In such case
			// dataValue should be used for retrieving HTML.
			if ( !dataTransfer && type === 'text/html' ) {
				return data.dataValue;
			}

			return dataTransfer;
		}
	};

	function getMatchingHandlers( handlers, evt ) {
		return CKEDITOR.tools.array.filter( handlers, function( handler ) {
			return handler.canHandle( evt );
		} ).sort( function( handler1, handler2 ) {
			if ( handler1.priority === handler2.priority ) {
				return 0;
			}

			return handler1.priority > handler2.priority ? 1 : -1;
		} );
	}

	function handlePaste( handlers, evt ) {
		var handler = handlers.shift();

		if ( !handler ) {
			return;
		}

		handler.handle( evt, function() {
			handlePaste( handlers, evt );
		} );
	}

	// Join all filters in one big array and then filter out duplicates.
	function getFilters( handlers ) {
		var filters = CKEDITOR.tools.array.reduce( handlers, function( filters, handler ) {
			if ( !CKEDITOR.tools.array.isArray( handler.filters ) ) {
				return filters;
			}

			return filters.concat( handler.filters );
		}, [] );

		return CKEDITOR.tools.array.filter( filters, function( filter, i ) {
			return CKEDITOR.tools.array.indexOf( filters, filter ) === i;
		} );
	}

	function loadFilters( filters, callback ) {
		var loaded = 0,
			toLoad,
			i;

		if ( !CKEDITOR.tools.array.isArray( filters ) || filters.length === 0 ) {
			return true;
		}

		toLoad = CKEDITOR.tools.array.filter( filters, function( filter ) {
			return CKEDITOR.tools.array.indexOf( loadedFilters, filter ) === -1;
		} );

		if ( toLoad.length > 0 ) {
			for ( i = 0; i < toLoad.length; i++ ) {
				( function( current ) {
					CKEDITOR.scriptLoader.queue( current, function( isLoaded ) {
						if ( isLoaded ) {
							loadedFilters.push( current );
						}

						if ( ++loaded === toLoad.length ) {
							callback();
						}
					} );
				}( toLoad[ i ] ) );
			}
		}

		return toLoad.length === 0;
	}

	CKEDITOR.pasteFilters = {};
} )();
