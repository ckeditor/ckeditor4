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
					this.handlers.push( definition );
				},

				addPasteListener: function( editor ) {
					editor.on( 'paste', function( evt ) {
						var handler = CKEDITOR.tools.array.find( this.handlers, function( handler ) {
							return handler.canHandle( evt );
						} );

						if ( !handler ) {
							return;
						}

						var isLoaded = loadFilters( handler.filters, function() {
							return editor.fire( 'paste', evt.data );
						} );

						if ( !isLoaded ) {
							return evt.cancel();
						}

						handler.handle( evt );
					}, this, null, 3 );
				}
			}
		} );

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
	 * @since 4.13.0
	 */
	CKEDITOR.plugins.pastetools = {
		/**
		 * Collection of available filters
		 *
		 * @var {Object[]}
		 */
		filters: {},

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
		}
	};

	CKEDITOR.pasteFilters = {};
} )();
