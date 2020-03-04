/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function( bender ) {
	'use strict';

	bender.editorBot = function( tc, editor ) {
		this.testCase = tc;
		this.editor = editor;
	};

	bender.editorBot.create = function( profile, callback ) {
		var creator = profile.creator || 'replace',
			name = profile.name || 'test_editor',
			tc = bender.testCase,
			element,
			config;

		element = CKEDITOR.document.getById( name ) || CKEDITOR.document.getBody().append(
			CKEDITOR.dom.element.createFromHtml( creator == 'replace' ?
				'<textarea id="' + name + '"' + '></textarea>' :
				'<div id="' + name + '"' + ' contenteditable="true"></div>' )
		);

		if ( creator == 'replace' && !element.is( 'textarea' ) ) {
			throw new Error(
				'[EditorBot:' + name + '] Are you sure you want to replace element with a classic editor?' );
		}

		if ( typeof profile.startupData == 'string' ) {
			element[ element.is( 'textarea' ) ? 'setValue' : 'setHtml' ]( profile.startupData );
		}

		CKEDITOR.once( 'instanceReady', function( event ) {
			var editor = event.editor,
				writer,
				bot;

			// Output compact output by default.
			if ( !profile.formattedOutput && CKEDITOR.htmlWriter &&
				editor.dataProcessor.writer instanceof CKEDITOR.htmlWriter ) {
				writer = editor.dataProcessor.writer = new CKEDITOR.htmlParser.basicWriter();

				writer.attribute = CKEDITOR.tools.override( writer.attribute, function( org ) {
					return function( name, val ) {
						if ( editor.config.forceSimpleAmpersand ) {
							val = val.replace( /&amp;/g, '&' );
						}
						return org.call( this, name, val );
					};
				} );

				writer.sortAttributes = 1;
			}

			// Accept bookmarks created e.g. by tools.setHtmlWithSelection.
			editor.filter.allow( {
				span: {
					match: function( element ) {
						var id = element.attributes.id;

						return id && id.match( /^cke_bm_/ );
					},
					attributes: 'id',
					styles: 'display'
				}
			}, 'editorbot', true );

			// Add special rules.
			if ( profile.allowedForTests ) {
				editor.filter.allow( profile.allowedForTests, 'allowedfortests' );
			}

			bot = new bender.editorBot( tc, editor );

			// Allow all instantiation tasks to complete.
			setTimeout( function() {
				if ( bender.runner._inTest && !profile.ignoreEditorWaits ) {
					resume( function() {
						callback( bot );
					} );
				} else {
					callback( bot );
				}
			} );
		}, this );

		if ( profile === true ) {
			profile = {};
		}

		if ( !profile.config ) {
			profile.config = {};
		}

		config = profile.config;

		// For convenience, load here creator dedicated plugin, to avoid having them defined by test.
		config.extraPlugins = ( ( creator == 'replace' || creator == 'append' ) ?
			'wysiwygarea' : 'floatingspace' ) + ',' + ( config.extraPlugins || '' );

		if ( profile.formattedOutput ) {
			config.extraPlugins += 'htmlwriter';
		}

		CKEDITOR[ creator ]( element, profile.config );

		if ( bender.runner._inTest && !profile.ignoreEditorWaits ) {
			tc.wait();
		}
	};

	bender.editorBot.createAsync = function( profile ) {
		return new CKEDITOR.tools.promise( function( resolve, reject ) {
			// By default this editor, should be surrounded with `promise`, so wait statements are generated inside that function,
			// and shouldn't be call inside creation of new editor.
			profile.ignoreEditorWaits = profile.ignoreEditorWaits === undefined ? true : profile.ignoreEditorWaits;

			try {
				bender.editorBot.create( profile, function( bot ) {
					resolve( bot );
				} );
			} catch ( e ) {
				reject( e );
			}
		} );
	};

	/**
	 * Open a menu button drop down.
	 * @param {String} name Name of the panel button.
	 * @param {Function} callback The function invoked when panel is opened.
	 */
	function menuOrPanel( isPanel ) {
		return function( name, callback ) {

			var editor = this.editor,
				btn = editor.ui.get( name ),
				tc = this.testCase,
				btnEl,
				leftMouseButton = CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? 1 : CKEDITOR.MOUSE_BUTTON_LEFT;

			editor.once( 'panelShow', function() {
				// Make sure resume comes after wait.
				setTimeout( function() {
					tc.resume(
						function() {
							callback.call( tc, isPanel ? btn._.panel : btn._.menu );
						}
						);
				} );
			} );

			btnEl = CKEDITOR.document.getById( btn._.id );

			btnEl.fireEventHandler( CKEDITOR.env.ie ? 'mouseup' : 'click', { button: leftMouseButton } );

			// combo panel opening is synchronous.
			tc.wait();
		};
	}


	bender.editorBot.prototype = {
		dialog: function( dialogName, callback ) {
			var tc = this.testCase,
				editor = this.editor;

			editor.on( 'dialogShow', function( event ) {
				var dialog = event.data;

				event.removeListener();

				setTimeout( function() {
					tc.resume( function() {
						callback.call( tc, dialog );
					} );
				} );
			} );

			editor.execCommand( dialogName );

			// Note: 1000ms isn't quite enough, i.e. in some slow browsers like MS Edge to run
			// some heavy tests. It causes "wait() called but resume() never called"
			// sort of errors because it takes longer to fire `dialogShow` than 1000ms,
			// especially in build version of CKEditor (https://dev.ckeditor.com/ticket/13920).
			tc.wait();
		},

		asyncDialog: function( dialogName ) {
			var editor = this.editor;

			return new CKEDITOR.tools.promise( function( resolve, reject ) {
				var resolveTimeout,
					rejectTimeout,
					// IE 11 requires some delay to fully show up and initialize dialog. From testing it looks like 10ms is enough,
					// however, the value is increased 5 times to have safe margin.
					resolveDelay = CKEDITOR.env.ie && CKEDITOR.env.version === 11 ? 50 : 0;

				editor.on( 'dialogShow', function( event ) {
					var dialog = event.data;

					event.removeListener();

					resolveTimeout = CKEDITOR.tools.setTimeout( function() {
						if ( rejectTimeout !== undefined ) {
							window.clearTimeout( rejectTimeout );
						}
						resolve( dialog );
					}, resolveDelay );
				} );

				rejectTimeout = CKEDITOR.tools.setTimeout( function() {
					if ( resolveTimeout !== undefined ) {
						window.clearTimeout( resolveTimeout );
					}
					reject( new Error( 'There was no "dialogShow" event for at least 5 seconds.' ) );
				}, 5000 );

				editor.execCommand( dialogName );
			} );
		},

		getData: function( fixHtml, compatHtml ) {
			var data = this.editor.getData();

			if ( fixHtml ) {
				data = bender.tools.fixHtml( data );
			}

			if ( compatHtml ) {
				data = bender.tools.compatHtml( data );
			}

			return data;
		},

		setData: function( data, callback ) {
			var tc = this.testCase,
				editor = this.editor;

			// Ensure that setData() is async.
			wait( function() {
				editor.setData( data, function() {
					// Make sure the resume is invoked after wait.
					resume( function() {
						callback.call( tc );
					} );
				} );
			} );
		},

		/*
		 * Open a rich combo dropdown, returns the combo instance.
		 * @param {String} name Name of the combo button.
		 * @param {Function} callback The function invoked when dropdown is shown.
		 */
		combo: function( name, callback ) {
			var editor = this.editor,
				combo = editor.ui.get( name ),
				tc = this.testCase,
				leftMouseButton = CKEDITOR.tools.normalizeMouseButton( CKEDITOR.MOUSE_BUTTON_LEFT, true ),
				item;

			editor.once( 'panelShow', function() {
				// Make sure resume comes after wait.
				setTimeout( function() {
					tc.resume(
						function() {
							callback.call( tc, combo );
						}
					);
				} );
			} );

			item = CKEDITOR.document.getById( 'cke_' + combo.id );
			item = item.getElementsByTag( 'a' ).getItem( 0 );
			item.fireEventHandler( CKEDITOR.env.ie ? 'mouseup' : 'click', { button: leftMouseButton } );

			// combo panel opening is synchronous.
			tc.wait();
		},

		/**
		 * Open a menu button drop down.
		 * @param {String} name Name of the panel button.
		 * @param {Function} callback The function invoked when panel is opened.
		 */
		menu: menuOrPanel( false ),

		/**
		 * Open a menu button drop down.
		 * @param {String} name Name of the panel button.
		 * @param {Function} callback The function invoked when panel is opened.
		 */
		panel: menuOrPanel( true ),

		/**
		 * Open the context menu on current editor.
		 * @param {Function} callback The function invoked when panel is opened.
		 */
		contextmenu: function( callback ) {
			var editor = this.editor,
				tc = this.testCase,
				range;

			editor.once( 'panelShow', function() {
				// Make sure resume comes after wait.
				setTimeout( function() {
					tc.resume(
						function() {
							callback.call( tc, editor.contextMenu );
						}
					);
				} );
			} );

			// Force selection in the editor as opening menu
			// by user always results in selection in non readonly editor.
			if ( !editor.readOnly && editor.getSelection().getType() === CKEDITOR.SELECTION_NONE ) {
				range = editor.createRange();

				range.selectNodeContents( editor.editable() );
				range.collapse( true );
				range.select();
			}

			// Open context menu on editable element.
			editor.contextMenu.open( editor.editable() );

			// Combo panel opening is asynchronous.
			tc.wait();
		},

		setHtmlWithSelection: function( html ) {
			bender.tools.setHtmlWithSelection( this.editor, html );
		},

		htmlWithSelection: function( html ) {
			return typeof html == 'string' ?
				bender.tools.setHtmlWithSelection( this.editor, html ) :
				bender.tools.getHtmlWithSelection( this.editor );
		},

		execCommand: function() {
			this.editor.execCommand.apply( this.editor, arguments );

			if ( this.editor.focusManager.hasFocus &&
				// Don't fire selectionChange in source mode, because there's no valid selection then.
				this.editor.mode == 'wysiwyg' ) {
				this.fireSelectionChange();
			}
		},

		/**
		 * Delegate to {@link bender.tools.focus}, on the editor instance.
		 * @param callback
		 */
		focus: function( callback ) {
			var tc = this.testCase;

			bender.tools.focus( this.editor, function() {
				callback.call( tc );
			} );
		},

		fireSelectionChange: function() {
			var sel = this.editor.getSelection(),
				currentPath = this.editor.elementPath();

			this.editor.fire( 'selectionChange', {
				selection: sel,
				path: currentPath,
				element: currentPath.lastElement
			} );
		},

		assertInputOutput: function( input, expectedHtml, expectedData ) {
			var that = this;

			this.editor.setData( input, function() {
				resume( function() {
					// Test html after data->html conversion.
					assert[ typeof expectedHtml == 'string' ? 'areSame' : 'isMatching' ](
						expectedHtml,
						bender.tools.compatHtml( that.editor.getSnapshot(), 0, 1 ),
						'Editor\'s html'
					);

					// Test if output data are equal to input or given expectedData.
					assert.areSame(
						expectedData || input,
						bender.tools.compatHtml( that.getData(), 0, 1 ),
						'Editor\'s data'
					);
				} );
			} );

			wait();
		}
	};

} )( bender );
