/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Increase and decrease indent commands.
 */

(function() {
	'use strict';

	CKEDITOR.plugins.add( 'indent', {
		lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		icons: 'indent,indent-rtl,outdent,outdent-rtl', // %REMOVE_LINE_CORE%

		init: function( editor ) {
			var that = this;

			// Register generic commands.
			setupGenericListeners( editor.addCommand( 'indent', new CKEDITOR.plugins.indent.genericDefinition( editor, 'indent', true ) ) );
			setupGenericListeners( editor.addCommand( 'outdent', new CKEDITOR.plugins.indent.genericDefinition( editor, 'outdent' ) ) );

			// Register dirChanged listener.
			editor.on( 'dirChanged', function( evt ) {
				var range = editor.createRange();
				range.setStartBefore( evt.data.node );
				range.setEndAfter( evt.data.node );

				var walker = new CKEDITOR.dom.walker( range ),
					node;

				while ( ( node = walker.next() ) ) {
					if ( node.type == CKEDITOR.NODE_ELEMENT ) {
						// A child with the defined dir is to be ignored.
						if ( !node.equals( evt.data.node ) && node.getDirection() ) {
							range.setStartAfter( node );
							walker = new CKEDITOR.dom.walker( range );
							continue;
						}

						// Switch alignment classes.
						var classes = editor.config.indentClasses;
						if ( classes ) {
							var suffix = ( evt.data.dir == 'ltr' ) ? [ '_rtl', '' ] : [ '', '_rtl' ];
							for ( var i = 0; i < classes.length; i++ ) {
								if ( node.hasClass( classes[ i ] + suffix[ 0 ] ) ) {
									node.removeClass( classes[ i ] + suffix[ 0 ] );
									node.addClass( classes[ i ] + suffix[ 1 ] );
								}
							}
						}

						// Switch the margins.
						var marginLeft = node.getStyle( 'margin-right' ),
							marginRight = node.getStyle( 'margin-left' );

						marginLeft ? node.setStyle( 'margin-left', marginLeft ) : node.removeStyle( 'margin-left' );
						marginRight ? node.setStyle( 'margin-right', marginRight ) : node.removeStyle( 'margin-right' );
					}
				}
			} );
		}
	} );

	var listNodeNames = { ol: 1, ul: 1 };

	/**
	 * Global command class definitions and global helpers.
	 *
	 * @class
	 * @singleton
	 */
	CKEDITOR.plugins.indent = {
		listNodeNames: listNodeNames,

		/**
		 * A base class for generic command definition, mainly responsible for creating indent
		 * UI buttons, and refreshing UI states.
		 *
		 * Commands of this class do not perform any indentation itself. They
		 * delegate job to content-specific indentation commands (i.e. indentlist).
		 *
		 * @class CKEDITOR.plugins.indent.genericDefinition
		 * @extends CKEDITOR.command
		 * @param {CKEDITOR.editor} editor The editor instance this command will be
 		 * related to.
		 * @param {String} name Name of the command.
		 * @param {Boolean} [isIndent] Define command as indenting or outdenting.
		 */
		genericDefinition: function( editor, name, isIndent ) {
			this.name = name;
			this.editor = editor;

			/**
			 * Determines whether the command belongs to indentation family.
			 * Otherwise it's assumed as an outdenting one.
			 *
			 * @readonly
			 * @property {Boolean} [=false]
			 */
			this.isIndent = !!isIndent;

			this.startDisabled = !this.isIndent;

			// Create and register toolbar button if possible.
			if ( editor.ui.addButton ) {
				editor.ui.addButton( name.charAt( 0 ).toUpperCase() + name.slice( 1 ), {
					label: editor.lang.indent[ name ],
					command: name,
					directional: true,
					toolbar: 'indent,' + ( this.isIndent ? '20' : '10' )
				} );
			}
		},

		/**
		 * A base class for specific indentation command definitions responsible for
		 * handling a limited set of elements i.e. indentlist or indentblock.
		 *
		 * Commands of this class perform real indentation and modify DOM structure.
		 * They observe events fired by {@link CKEDITOR.plugins.indent.genericDefinition}
		 * and execute defined actions.
		 *
		 * **NOTE**: This is not an {@link CKEDITOR.command editor command}.
		 * Context-specific commands are internal, for indentation system only.
		 *
		 * @class CKEDITOR.plugins.indent.specificDefinition
		 * @param {CKEDITOR.editor} editor The editor instance this command will be
 		 * related to.
		 * @param {String} name Name of the command.
		 * @param {Boolean} [isIndent] Define command as indenting or outdenting.
		 */
		specificDefinition: function( editor, name, isIndent ) {
			this.name = name;
			this.editor = editor;

			/**
			 * Determines whether the editor that command belongs to has
			 * config.enterMode set to CKEDITOR.ENTER_BR.
			 *
			 * @readonly
			 * @see CKEDITOR.config#enterMode
			 * @property {Boolean} [=false]
			 */
			this.enterBr = editor.config.enterMode == CKEDITOR.ENTER_BR;

			/**
			 * Determines whether the command belongs to indentation family.
			 * Otherwise it's assumed as an outdenting one.
			 *
			 * @readonly
			 * @property {Boolean} [=false]
			 */
			this.isIndent = !!isIndent;

			/**
			 * The global command's name related to this one.
			 *
			 * @readonly
			 */
			this.relatedGlobal = isIndent ? 'indent' : 'outdent';

			/**
			 * A keystroke associated with this command (TAB or SHIFT+TAB).
			 *
			 * @readonly
			 */
			this.indentKey = isIndent ? 9 : CKEDITOR.SHIFT + 9;

			/**
			 * Priority of command execution. The lower the number, the higher
			 * is the priority. The priority must be within 1-99.
			 *
			 * @readonly
			 * @see setupGenericListeners
			 * @property {Number} [=10]
			 */
			this.execPriority = 10;

			/**
			 * Stores created markers for the command so they can eventually be
			 * purged after exec.
			 */
			this.database = {};

			/**
			 * Refers to the configured indentClasses of the editor instance this
			 * command belongs to.
			 *
			 * @readonly
			 * @see CKEDITOR.config#indentClasses
			 * @property {Array} [=null]
			 */
			this.indentClasses = editor.config.indentClasses;

			/**
			 * Determines whether {@link CKEDITOR.config#indentClasses} are in use.
			 *
			 * @readonly
			 * @property {Boolean} [=false]
			 */
			this.useIndentClasses = this.indentClasses && 0 in this.indentClasses;

			/**
			 * A map of {@link CKEDITOR.config#indentClasses} used by indentation
			 * commands.
			 *
			 * @readonly
			 * @property {Object} [={}]
			 */
			this.indentClassMap = {};

			/**
			 * A state of the command.
			 *
			 * @readonly
			 * @property {Number} [=CKEDITOR.TRISTATE_DISABLED]
			 */
			this.state = CKEDITOR.TRISTATE_DISABLED;

			if ( this.useIndentClasses ) {
				/**
				 * A regular expression used used by indentation procedure for determining
				 * actual indentation level of an element.
				 *
				 * @readonly
				 * @property {Object} [=null]
				 */
				this.classNameRegex = new RegExp( '(?:^|\\s+)(' + editor.config.indentClasses.join( '|' ) + ')(?=$|\\s)' );

				for ( var i = 0; i < this.indentClasses.length; i++ )
					this.indentClassMap[ editor.config.indentClasses[ i ] ] = i + 1;
			}
		},

		/**
		 * Registers content-specific commands as a part of indentation system
		 * directed by generic commands. Once a command is registered,
		 * it observes for events of a related generic command.
		 *
		 *		CKEDITOR.plugins.indent.registerCommands( editor, {
		 *			'indentlist': new indentListCommand( editor, 'indentlist' ),
		 *			'outdentlist': new indentListCommand( editor, 'outdentlist' )
		 *		} );
		 *
		 * Content-specific commands listen on generic command's `exec` and
		 * try to execute itself, one after another. If some execution is
		 * successful, `evt.data.done` is set so no more commands are involved.
		 *
		 * Content-specific commands also listen on generic command's `refresh`
		 * and fill `evt.data.states` object with own states. A generic command
		 * uses these data to determine own state and update UI.
		 *
		 * @member CKEDITOR.plugins.indent
		 * @param {CKEDITOR.editor} editor The editor instance this command is
 		 * related to.
		 * @param {Object} commands An object of {@link CKEDITOR.command}.
		 */
		registerCommands: function( editor, commands ) {
			editor.on( 'pluginsLoaded', function() {
				for ( var name in commands ) {
					( function( editor, command ) {
						var relatedGlobal = editor.getCommand( command.relatedGlobal );

						// Observe generic exec event and execute command when necessary.
						// If the command was successfully handled by the command and
						// DOM has been modified, stop event propagation so no other plugin
						// will bother. Job is done.
						relatedGlobal.on( 'exec', function( evt ) {
							if ( evt.data.done )
								return;

							// Make sure that anything this command will do is invisible
							// for undoManager. What undoManager only can see and
							// remember is the execution of the global command (relatedGlobal).
							editor.fire( 'lockSnapshot' );

							if ( command.exec( editor ) )
								evt.data.done = true;

							editor.fire( 'unlockSnapshot' );

							// Clean up the markers.
							CKEDITOR.dom.element.clearAllMarkers( command.database );
						}, this, null, command.execPriority );

						// Observe generic refresh event and force command refresh.
						// Once refreshed, save command state in event data
						// so generic command plugin can update its own state and UI.
						relatedGlobal.on( 'refresh', function( evt ) {
							command.refresh( editor, evt.data.path );

							if ( !evt.data.states )
								evt.data.states = {};

							evt.data.states[ command.name ] = command.state;
						} );

						// Since specific indent commands have no UI elements,
						// they need to be manually registered as a editor feature.
						editor.addFeature( command );
					} )( this, commands[ name ] );
				}
			} );
		},

		/**
		 * Determines whether a node is a list LI element.
		 *
		 * @param {CKEDITOR.dom.node} node A node to be checked.
		 * @returns {Boolean}
		 */
		isListItem: isListItem,

		/**
		 * Determines indent CSS property for an element according to
		 * what is the direction of such element. It can be either `margin-left`
		 * or `margin-right`.
		 *
		 *		// Get indent CSS property of an element.
		 *		var element = CKEDITOR.document.getById( 'foo' );
		 *		command.getIndentCssProperty( element );	// 'margin-left'
		 *
		 * @param {CKEDITOR.dom.element} element An element to be checked.
		 * @param {String} [dir] Element direction.
		 * @returns {String}
		 */
		getIndentCssProperty: function( element, dir ) {
			return ( dir || element.getComputedStyle( 'direction' ) ) == 'ltr' ? 'margin-left' : 'margin-right';
		},

		/**
		 * Return the numerical indent value of margin-left|right of an element,
		 * considering element's direction. If element has no margin specified,
		 * NaN is returned.
		 *
		 * @param {CKEDITOR.dom.element} element An element to be checked.
		 * @returns {Number}
		 */
		getNumericalIndentLevel: function ( element ) {
			return parseInt( element.getStyle( CKEDITOR.plugins.indent.getIndentCssProperty( element ) ), 10 );
		},

		/**
		 * Check whether a first child of a list is in the path.
		 *
		 * @param {CKEDITOR.dom.elementPath} path A path to be checked.
		 * @param {CKEDITOR.dom.element} [list] A list to be used as a reference.
		 * @returns {Boolean}
		 */
		isFirstListItemInPath: function( path, list ) {
			if ( !list )
				list = path.contains( listNodeNames );

			return list && path.block && path.block.equals( list.getFirst( isListItem ) );
		}
	};

	CKEDITOR.plugins.indent.genericDefinition.prototype = {
		context: 'p',

		exec: function() {}
	};

	CKEDITOR.plugins.indent.specificDefinition.prototype = {
		/**
		 * Executes the content-specific procedure if the
		 * context is correct. It refreshes the state of the command
		 * first to be up-to-date. Then it calls
		 * {@link CKEDITOR.plugins.indent.specificDefinition#indent method}
		 * defined for the command that modifies DOM.
		 *
		 * @param {CKEDITOR.editor} editor The editor instance this command will be
 		 * related to.
		 * @returns {Boolean}
		 */
		exec: function( editor ) {
			this.refresh( editor, editor.elementPath() );

			if ( this.state == CKEDITOR.TRISTATE_DISABLED || !editor.filter.checkFeature( this ) )
				return false;

			return this.indent( editor );
		},

		/**
		 * Generic indentation procedure for any element shared across
		 * content-specific indentation commands.
		 *
		 *		// Indent element of id equal foo
		 *		var element = CKEDITOR.document.getById( 'foo' );
		 *		command.indentElement( element );
		 *
		 * @param {CKEDITOR.dom.element} element An element to be indented.
		 * @param {String} [dir] Element direction.
		 * @returns {Boolean}
		 */
		indentElement: function( element, dir ) {
			if ( element.getCustomData( 'indent_processed' ) )
				return false;

			var editor = this.editor;

			if ( this.useIndentClasses ) {
				// Transform current class f to indent step index.
				var indentClass = element.$.className.match( this.classNameRegex ),
					indentStep = 0;
				if ( indentClass ) {
					indentClass = indentClass[ 1 ];
					indentStep = this.indentClassMap[ indentClass ];
				}

				// Operate on indent step index, transform indent step index back to class
				// name.
				if ( !this.isIndent )
					indentStep--;
				else
					indentStep++;

				if ( indentStep < 0 )
					return false;

				indentStep = Math.min( indentStep, this.indentClasses.length );
				indentStep = Math.max( indentStep, 0 );
				element.$.className = CKEDITOR.tools.ltrim( element.$.className.replace( this.classNameRegex, '' ) );

				if ( indentStep > 0 )
					element.addClass( this.indentClasses[ indentStep - 1 ] );
			} else {
				var indentCssProperty = CKEDITOR.plugins.indent.getIndentCssProperty( element, dir ),
					currentOffset = parseInt( element.getStyle( indentCssProperty ), 10 ),
					indentOffset = editor.config.indentOffset || 40;

				if ( isNaN( currentOffset ) )
					currentOffset = 0;

				currentOffset += ( this.isIndent ? 1 : -1 ) * indentOffset;

				if ( currentOffset < 0 )
					return false;

				currentOffset = Math.max( currentOffset, 0 );
				currentOffset = Math.ceil( currentOffset / indentOffset ) * indentOffset;

				element.setStyle( indentCssProperty, currentOffset ? currentOffset + ( editor.config.indentUnit || 'px' ) : '' );

				if ( element.getAttribute( 'style' ) === '' )
					element.removeAttribute( 'style' );
			}

			CKEDITOR.dom.element.setMarker( this.database, element, 'indent_processed', 1 );

			return true;
		},

		/**
		 * Method that checks if current indentation level for an element
		 * reached the limit determined by {@link CKEDITOR.config#indentClasses}.
		 *
		 * @param {CKEDITOR.dom.element} node An element to be checked.
		 * @returns {Boolean}
		 */
		checkIndentClassLeft: function( node ) {
			var indentClass = node.$.className.match( this.classNameRegex ),
				extraConditions = this.indentClassLeftConditions,
				indentStep = 0;

			// If node has one of the indentClasses:
			//		\-> If it holds the topmost indentClass, then
			//		    no more classes have left.
			//		\-> If it holds any other indentClass, it can use the next one
			//		    or the previous one.
			//		\-> Outdent is always possible. We can remove indentClass.
			if ( indentClass ) {
				indentClass = indentClass[ 1 ];

				return this.isIndent ?
						this.indentClassMap[ indentClass ] != this.indentClasses.length
					:
						true;
			}

			// If node has no class which belongs to indentClasses,
			// then it is at 0-level. It can be indented but not outdented.
			else
				return this.isIndent;
		},

		/**
		 * Method that checks if the element path contains an element handled
		 * by this indentation command.
		 *
		 * @param {CKEDITOR.dom.elementPath} node A path to be checked.
		 * @returns {CKEDITOR.dom.element}
		 */
		getContext: function( path ) {
			return path.contains( this.indentContext );
		}

		/**
		 * Refreshes the state of the content-specific command
		 * similarly to {@link CKEDITOR.command#method-refresh}. It updates
		 * the {@link CKEDITOR.plugins.indent.specificDefinition#state} property.
		 *
		 * @method refresh
		 * @param {CKEDITOR.editor} editor
		 * @param {CKEDITOR.dom.elementPath} path
		 */

		/**
		 * Performs indentation (outdentation) in DOM.
		 *
		 * @method indent
		 * @param {CKEDITOR.editor} editor
		 */
	};

	/**
	 * Attaches event listeners for this generic command. Since indentation
	 * system is event-oriented, generic commands communicate with
	 * content-specific commands using own `exec` and `refresh` events.
	 *
	 * Listener priorities are crucial. Different indentation phases
	 * are executed whit different priorities.
	 *
	 * For `exec` event:
	 *
	 * * 0: Selection and bookmarks are saved by generic command.
	 * * 1-99: Content-specific commands try to indent the code by executing
	 * 	 own {@link CKEDITOR.command#method-exec} methods.
	 * * 100: Bookmarks are re-selected by generic command.
	 *
	 * For `refresh` event:
	 *
	 * * <100: Content-specific commands refresh their states according
	 * 	 to the given path by executing {@link CKEDITOR.command#method-refresh}.
	 * 	 They save their states in `evt.data.states` object passed along.
	 * 	 with the event.
	 * * 100: Command state is determined according to what states
	 * 	 have been returned by content-specific commands (`evt.data.states`).
	 * 	 UI elements are updated at this stage.
	 *
	 * @param {CKEDITOR.command} command Command to be set up.
	 * @private
	 */
	function setupGenericListeners( command ) {
		var editor = command.editor,
			selection, bookmarks;

		// Set the command state according to content-specific
		// command states.
		command.on( 'refresh', function( evt ) {
			// If no state comes with event data, disable command.
			var states = [ CKEDITOR.TRISTATE_DISABLED ];

			for ( var s in evt.data.states )
				states.push( evt.data.states[ s ] );

			// Maybe a little bit shorter?
			if ( CKEDITOR.tools.search( states, CKEDITOR.TRISTATE_ON ) )
				this.setState( CKEDITOR.TRISTATE_ON );
			else if ( CKEDITOR.tools.search( states, CKEDITOR.TRISTATE_OFF ) )
				this.setState( CKEDITOR.TRISTATE_OFF );
			else
				this.setState( CKEDITOR.TRISTATE_DISABLED );
		}, command, null, 100 );

		// Initialization. Save bookmarks and mark event as not handled
		// by any plugin (command) yet.
		command.on( 'exec', function( evt ) {
			selection = editor.getSelection();
			bookmarks = selection.createBookmarks( 1 );

			// Mark execution as not handled yet.
			if ( !evt.data )
				evt.data = {};

			evt.data.done = false;
		}, command, null, 0 );

		// Housekeeping. Make sure selectionChange will be called.
		// Also re-select previously saved bookmarks.
		command.on( 'exec', function( evt ) {
			editor.forceNextSelectionCheck();
			selection.selectBookmarks( bookmarks );
		}, command, null, 100 );
	}

	function isListItem( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT && node.is( 'li' );
	}
})();

/**
 * Size of each indentation step.
 *
 *		config.indentOffset = 4;
 *
 * @cfg {Number} [indentOffset=40]
 * @member CKEDITOR.config
 */

/**
 * Unit for the indentation style.
 *
 *		config.indentUnit = 'em';
 *
 * @cfg {String} [indentUnit='px']
 * @member CKEDITOR.config
 */

/**
 * List of classes to use for indenting the contents. If it's `null`, no classes will be used
 * and instead the {@link #indentUnit} and {@link #indentOffset} properties will be used.
 *
 *		// Use the classes 'Indent1', 'Indent2', 'Indent3'
 *		config.indentClasses = ['Indent1', 'Indent2', 'Indent3'];
 *
 * @cfg {Array} [indentClasses=null]
 * @member CKEDITOR.config
 */
