/* exported insertionDT */

'use strict';

var insertionDT = ( function() {
	var doc = CKEDITOR.document,
		tools = bender.tools;

	return {
		editablesNames: 'body,div,h1',
		modes: { html: 1, text: 1 },
		editorsPool: {},

		// Create all editors instances and run TCs.
		run: function( config, additionalTCs ) {
			var that = this,
				editablesNamesArray = this.editablesNames.split( ',' ),
				pending = 0,
				editableName, el, inline;

			CKEDITOR.tools.extend( this, additionalTCs );

			while ( editableName = editablesNamesArray.shift() ) {
				inline = editableName != 'body';
				el = new CKEDITOR.dom.element( inline ? editableName : 'textarea' );
				if ( inline )
					el.setAttribute( 'contenteditable', 'true' );
				doc.getBody().append( el );

				// Framed editor needs wysiwygarea plugin.
				config = CKEDITOR.tools.extend( {
					plugins: inline ? '' : 'wysiwygarea',
					// Trick to pass this value to #instanceReady without a closure.
					editableName: editableName
				}, config );

				CKEDITOR[ inline ? 'inline' : 'replace' ]( el, config )
					.on( 'instanceReady', function( evt ) {
						letsContinue( evt.editor.config.editableName, evt.editor );
					} );

				pending += 1;
			}

			function letsContinue( editableName, editor ) {
				// Set editor in editors pool here so we're sure all editors loaded successfuly.
				that.editorsPool[ editableName ] = editor;

				// Remeber the default enter mode so we'll be able to reset it later.
				editor._.defaultEnterMode = editor.enterMode;

				// Be sure that the data produced by the editor is not formatted.
				editor.dataProcessor.writer = new CKEDITOR.htmlParser.basicWriter();

				if ( --pending === 0 )
					bender.test( that );
			}
		},

		/**
		 * For each editable name found in editablesNames string and each content type given in expected
		 * argument or for all content types if string given test insertion into corresponding editor instance.
		 */
		assertInsertion: function( editablesNames, source, insertion, expected, enterMode, message ) {
			var editableName, result, editor, modes, mode,
				root, checkAllModes, rangeList, revertChanges, revertChanges2,
				expectedForMode, afterInsertCount, afterInsertData;

			editablesNames = editablesNames.split( ',' );
			// Check all supported modes if expected value is a string or regexp.
			checkAllModes = ( typeof expected === 'string' || !!expected.exec );
			modes = checkAllModes ? this.modes : expected;

			revertChanges = replaceMethods( CKEDITOR.dom.selection.prototype, {
				// Selection::getRanges is used by insert methods.
				// By mocking it we can force the insertion into prepared range.
				getRanges: function() {
					return rangeList;
				},

				// Selection::selectRanges creates special \u200B characters which
				// breaks assertions.
				selectRanges: function() {},

				scrollIntoView: function() {},

				// Required by editable#insertText. Works correctly only when
				// first child of editable matches the element in selection really starts.
				getStartElement: function() {
					var range = rangeList[ 0 ], node;
					if ( !range.collapsed ) {
						range.optimize();

						// Decrease the range content to exclude particial
						// selected node on the start which doesn't have
						// visual impact. ( #3231 )
						while ( 1 ) {
							var startContainer = range.startContainer,
								startOffset = range.startOffset;
							// Limit the fix only to non-block elements. (#3950)
							if (
								startOffset ==
								(
									startContainer.getChildCount ?
										startContainer.getChildCount() :
										startContainer.getLength()
								) &&
								!startContainer.isBlockBoundary()
							)
								range.setStartAfter( startContainer );
							else
								break;
						}

						node = range.startContainer;

						if ( node.type != CKEDITOR.NODE_ELEMENT )
							return node.getParent();

						node = node.getChild( range.startOffset );

						if ( !node || node.type != CKEDITOR.NODE_ELEMENT )
							node = range.startContainer;
						else {
							var child = node.getFirst();
							while ( child && child.type == CKEDITOR.NODE_ELEMENT ) {
								node = child;
								child = child.getFirst();
							}
						}
					} else {
						node = range.startContainer;
						if ( node.type != CKEDITOR.NODE_ELEMENT )
							node = node.getParent();
					}

					return node.$ ? node : null;
				}
			} );
			revertChanges2 = replaceMethods( CKEDITOR.dom.range.prototype, {
				// During ranges selecting browsers make changes to the editable content (e.g. insert bogus brs).
				select: function() {}
			} );

			while ( editableName = editablesNames.shift() ) {
				editor = this.editorsPool[ editableName ];
				root = editor.editable();

				editor.on( 'afterInsertHtml', function( evt ) {
					afterInsertCount++;
					afterInsertData = evt.data;
				} );

				// Set enter mode to the given value or reset to the default one.
				editor.enterMode = enterMode || editor._.defaultEnterMode;

				for ( mode in modes ) {
					// Selection::getRanges() will read from this variable.
					rangeList = new CKEDITOR.dom.rangeList( tools.setHtmlWithRange( root, source, root ) );

					afterInsertCount = 0;

					if ( mode == 'insertElement' )
						editor.insertElement( CKEDITOR.dom.element.createFromHtml( insertion, editor.document ) );
					else if ( mode == 'insertText' )
						editor.insertText( insertion );
					else
						editor.insertHtml( insertion, mode );

					result = bender.tools.getHtmlWithRanges( root, rangeList );

					// For easier tests redability and to align development and release
					// versions of the tests, replace non-breaking-space char with &nbsp;
					result = result.replace( /\u00a0/g, '&nbsp;' );

					expectedForMode = checkAllModes ? expected : expected[ mode ];

					// Use assert.isMatching if expected is a regexp (has exec method).
					assert[ expectedForMode.exec ? 'isMatching' : 'areSame' ]( expectedForMode, result,
						( message || 'editor\'s content should equal expected value' ) +
						' (editable: "' + editableName + '" & mode: "' + mode + '")' );

					if ( mode != 'insertElement' ) {
						assert.areSame( 1, afterInsertCount, 'There should be 1 afterInsertHtml event after every insertion.' );
						assert.isUndefined( afterInsertData.intoRange, 'intoRange parameter should be undefined.' );
					}
				}
			}

			revertChanges();
			revertChanges2();

			// Replace methods of given object with given functions.
			// Return function that allow to revert changes done to the object.
			function replaceMethods( obj, newFns ) {
				var name,
					oldFns = {};

				for ( name in newFns ) {
					oldFns[ name ] = obj[ name ];
					obj[ name ] = newFns[ name ];
				}

				return function() {
					for ( var name in oldFns )
						obj[ name ] = oldFns[ name ];
				};
			}
		},

		createAssertInsertionFunction: function( editablesNames, insertion, mode, enterMode ) {
			var that = this,
				fn = function( source, expected, message ) {
					// When mode is set and expected is a string or regexp, test
					// only given mode.
					if ( fn.mode && ( typeof expected === 'string' || !!expected.exec ) ) {
						var obj = {};
						obj[ fn.mode ] = expected;
						expected = obj;
					}

					that.assertInsertion( fn.editablesNames, source, fn.insertion, expected, fn.enterMode, message );
				};
			fn.editablesNames = editablesNames;
			fn.insertion = insertion;
			fn.mode = mode;
			fn.enterMode = enterMode;

			return fn;
		}
	};
} )();
