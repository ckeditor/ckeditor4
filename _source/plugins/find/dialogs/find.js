/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	// Element tag names which prevent characters counting.
	var characterBoundaryElementsEnum = { address:1,blockquote:1,dl:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,p:1,pre:1,li:1,dt:1,de:1,div:1,td:1,th:1 };

	var guardDomWalkerNonEmptyTextNode = function( evt ) {
			if ( evt.data.to && evt.data.to.type == CKEDITOR.NODE_TEXT && evt.data.to.$.length > 0 )
				this.stop();
			CKEDITOR.dom.domWalker.blockBoundary( { br:1 } ).call( this, evt );
		};


	/**
	 * Get the cursor object which represent both current character and it's dom
	 * position thing.
	 */
	var cursorStep = function() {
			var obj = {
				textNode: this.textNode,
				offset: this.offset,
				character: this.textNode ? this.textNode.getText().charAt( this.offset ) : null,
				hitMatchBoundary: this._.matchBoundary
			};
			return obj;
		};

	var pages = [ 'find', 'replace' ],
		fieldsMapping = [
			[ 'txtFindFind', 'txtFindReplace' ],
			[ 'txtFindCaseChk', 'txtReplaceCaseChk' ],
			[ 'txtFindWordChk', 'txtReplaceWordChk' ],
			[ 'txtFindCyclic', 'txtReplaceCyclic' ] ];

	/**
	 * Synchronize corresponding filed values between 'replace' and 'find' pages.
	 * @param {String} currentPageId	The page id which receive values.
	 */
	function syncFieldsBetweenTabs( currentPageId ) {
		var sourceIndex, targetIndex, sourceField, targetField;

		sourceIndex = currentPageId === 'find' ? 1 : 0;
		targetIndex = 1 - sourceIndex;
		var i,
			l = fieldsMapping.length;
		for ( i = 0; i < l; i++ ) {
			var sourceField = this.getContentElement( pages[ sourceIndex ], fieldsMapping[ i ][ sourceIndex ] );
			var targetField = this.getContentElement( pages[ targetIndex ], fieldsMapping[ i ][ targetIndex ] );

			targetField.setValue( sourceField.getValue() );
		}
	}

	var findDialog = function( editor, startupPage ) {
			// Style object for highlights.
			var highlightStyle = new CKEDITOR.style( editor.config.find_highlight );

			/**
			 * Iterator which walk through document char by char.
			 * @param {Object} start
			 * @param {Number} offset
			 */
			var characterWalker = function( start, offset ) {
					var isCursor = typeof( start.textNode ) !== 'undefined';
					this.textNode = isCursor ? start.textNode : start;
					this.offset = isCursor ? start.offset : offset;
					this._ = {
						walker: new CKEDITOR.dom.domWalker( this.textNode ),
						matchBoundary: false
					};
				};

			characterWalker.prototype = {
				next: function() {
					// Already at the end of document, no more character available.
					if ( this.textNode == null )
						return cursorStep.call( this );

					this._.matchBoundary = false;

					// If there are more characters in the text node, get it and
					// raise an event.
					if ( this.textNode.type == CKEDITOR.NODE_TEXT && this.offset < this.textNode.getLength() - 1 ) {
						this.offset++;
						return cursorStep.call( this );
					}

					// If we are at the end of the text node, use dom walker to get
					// the next text node.
					var data = null;
					while ( !data || ( data.node && data.node.type != CKEDITOR.NODE_TEXT ) ) {
						data = this._.walker.forward( guardDomWalkerNonEmptyTextNode );

						// Block boundary? BR? Document boundary?
						if ( !data.node || ( data.node.type !== CKEDITOR.NODE_TEXT && data.node.getName() in characterBoundaryElementsEnum ) )
							this._.matchBoundary = true;
					}
					this.textNode = data.node;
					this.offset = 0;
					return cursorStep.call( this );
				},

				back: function() {
					this._.matchBoundary = false;

					// More characters -> decrement offset and return.
					if ( this.textNode.type == CKEDITOR.NODE_TEXT && this.offset > 0 ) {
						this.offset--;
						return cursorStep.call( this );
					}

					// Start of text node -> use dom walker to get the previous text node.
					var data = null;
					while ( !data || ( data.node && data.node.type != CKEDITOR.NODE_TEXT ) ) {
						data = this._.walker.reverse( guardDomWalkerNonEmptyTextNode );

						// Block boundary? BR? Document boundary?
						if ( !data.node || ( data.node.type !== CKEDITOR.NODE_TEXT && data.node.getName() in characterBoundaryElementsEnum ) )
							this._.matchBoundary = true;
					}
					this.textNode = data.node;
					this.offset = data.node.length - 1;
					return cursorStep.call( this );
				}
			};

			/**
			 * A range of cursors which represent a trunk of characters which try to
			 * match, it has the same length as the pattern  string.
			 */
			var characterRange = function( characterWalker, rangeLength ) {
					this._ = {
						walker: characterWalker,
						cursors: [],
						rangeLength: rangeLength,
						highlightRange: null,
						isMatched: false
					};
				};

			characterRange.prototype = {
				/**
				 * Translate this range to {@link CKEDITOR.dom.range}
				 */
				toDomRange: function() {
					var cursors = this._.cursors;
					if ( cursors.length < 1 )
						return null;

					var first = cursors[ 0 ],
						last = cursors[ cursors.length - 1 ],
						range = new CKEDITOR.dom.range( editor.document );

					range.setStart( first.textNode, first.offset );
					range.setEnd( last.textNode, last.offset + 1 );
					return range;
				},

				updateFromDomRange: function( domRange ) {
					var startNode = domRange.startContainer,
						startIndex = domRange.startOffset,
						endNode = domRange.endContainer,
						endIndex = domRange.endOffset,
						boundaryNodes = domRange.getBoundaryNodes();

					if ( startNode.type != CKEDITOR.NODE_TEXT ) {
						startNode = boundaryNodes.startNode;
						while ( startNode.type != CKEDITOR.NODE_TEXT )
							startNode = startNode.getFirst();
						startIndex = 0;
					}

					if ( endNode.type != CKEDITOR.NODE_TEXT ) {
						endNode = boundaryNodes.endNode;
						while ( endNode.type != CKEDITOR.NODE_TEXT )
							endNode = endNode.getLast();
						endIndex = endNode.getLength();
					}

					// If the endNode is an empty text node, our walker would just walk through
					// it without stopping. So need to backtrack to the nearest non-emtpy text
					// node.
					if ( endNode.getLength() < 1 ) {
						while ( ( endNode = endNode.getPreviousSourceNode() ) && !( endNode.type == CKEDITOR.NODE_TEXT && endNode.getLength() > 0 ) )
							;
						endIndex = endNode.getLength();
					}

					var cursor = new characterWalker( startNode, startIndex );
					this._.cursors = [ cursor ];
					if ( !( cursor.textNode.equals( endNode ) && cursor.offset == endIndex - 1 ) ) {
						do {
							cursor = new characterWalker( cursor );
							cursor.next();
							this._.cursors.push( cursor );
						}
						while ( !( cursor.textNode.equals( endNode ) && cursor.offset == endIndex - 1 ) );
					}

					this._.rangeLength = this._.cursors.length;
				},

				setMatched: function() {
					this._.isMatched = true;
					this.highlight();
				},

				clearMatched: function() {
					this._.isMatched = false;
					this.removeHighlight();
				},

				isMatched: function() {
					return this._.isMatched;
				},

				/**
				 * Hightlight the current matched chunk of text.
				 */
				highlight: function() {
					// Do not apply if nothing is found.
					if ( this._.cursors.length < 1 )
						return;

					// Remove the previous highlight if there's one.
					if ( this._.highlightRange )
						this.removeHighlight();

					// Apply the highlight.
					var range = this.toDomRange();
					highlightStyle.applyToRange( range );
					this._.highlightRange = range;

					// Scroll the editor to the highlighted area.
					var element = range.startContainer;
					if ( element.type != CKEDITOR.NODE_ELEMENT )
						element = element.getParent();
					element.scrollIntoView();

					// Update the character cursors.
					this.updateFromDomRange( range );
				},

				/**
				 * Remove highlighted find result.
				 */
				removeHighlight: function() {
					if ( this._.highlightRange == null )
						return;

					highlightStyle.removeFromRange( this._.highlightRange );
					this.updateFromDomRange( this._.highlightRange );
					this._.highlightRange = null;
				},

				moveBack: function() {
					var retval = this._.walker.back(),
						cursors = this._.cursors;

					if ( retval.hitMatchBoundary )
						this._.cursors = cursors = [];

					cursors.unshift( retval );
					if ( cursors.length > this._.rangeLength )
						cursors.pop();

					return retval;
				},

				moveNext: function() {
					var retval = this._.walker.next(),
						cursors = this._.cursors;

					// Clear the cursors queue if we've crossed a match boundary.
					if ( retval.hitMatchBoundary )
						this._.cursors = cursors = [];

					cursors.push( retval );
					if ( cursors.length > this._.rangeLength )
						cursors.shift();

					return retval;
				},

				getEndCharacter: function() {
					var cursors = this._.cursors;
					if ( cursors.length < 1 )
						return null;

					return cursors[ cursors.length - 1 ].character;
				},

				getNextRange: function( maxLength ) {
					var cursors = this._.cursors;
					if ( cursors.length < 1 )
						return null;

					var next = new characterWalker( cursors[ cursors.length - 1 ] );
					return new characterRange( next, maxLength );
				},

				getCursors: function() {
					return this._.cursors;
				}
			};

			var KMP_NOMATCH = 0,
				KMP_ADVANCED = 1,
				KMP_MATCHED = 2;
			/**
			 * Examination the occurrence of a word which implement KMP algorithm.
			 */
			var kmpMatcher = function( pattern, ignoreCase ) {
					var overlap = [ -1 ];
					if ( ignoreCase )
						pattern = pattern.toLowerCase();
					for ( var i = 0; i < pattern.length; i++ ) {
						overlap.push( overlap[ i ] + 1 );
						while ( overlap[ i + 1 ] > 0 && pattern.charAt( i ) != pattern.charAt( overlap[ i + 1 ] - 1 ) )
							overlap[ i + 1 ] = overlap[ overlap[ i + 1 ] - 1 ] + 1;
					}

					this._ = {
						overlap: overlap,
						state: 0,
						ignoreCase: !!ignoreCase,
						pattern: pattern
					};
				};

			kmpMatcher.prototype = {
				feedCharacter: function( c ) {
					if ( this._.ignoreCase )
						c = c.toLowerCase();

					while ( true ) {
						if ( c == this._.pattern.charAt( this._.state ) ) {
							this._.state++;
							if ( this._.state == this._.pattern.length ) {
								this._.state = 0;
								return KMP_MATCHED;
							}
							return KMP_ADVANCED;
						} else if ( this._.state == 0 )
							return KMP_NOMATCH;
						else
							this._.state = this._.overlap[ this._.state ];
					}

					return null;
				},

				reset: function() {
					this._.state = 0;
				}
			};

			var wordSeparatorRegex = /[.,"'?!;: \u0085\u00a0\u1680\u280e\u2028\u2029\u202f\u205f\u3000]/;

			var isWordSeparator = function( c ) {
					if ( !c )
						return true;
					var code = c.charCodeAt( 0 );
					return ( code >= 9 && code <= 0xd ) || ( code >= 0x2000 && code <= 0x200a ) || wordSeparatorRegex.test( c );
				};

			var finder = {
				startCursor: null,
				range: null,
				find: function( pattern, matchCase, matchWord, matchCyclic ) {
					if ( !this.range )
						this.range = new characterRange( new characterWalker( this.startCursor ), pattern.length );
					else {
						this.range.removeHighlight();
						this.range = this.range.getNextRange( pattern.length );
					}

					var matcher = new kmpMatcher( pattern, !matchCase ),
						matchState = KMP_NOMATCH,
						character = '%';

					while ( character != null ) {
						this.range.moveNext();
						while ( ( character = this.range.getEndCharacter() ) ) {
							matchState = matcher.feedCharacter( character );
							if ( matchState == KMP_MATCHED )
								break;
							if ( this.range.moveNext().hitMatchBoundary )
								matcher.reset();
						}

						if ( matchState == KMP_MATCHED ) {
							if ( matchWord ) {
								var cursors = this.range.getCursors(),
									tail = cursors[ cursors.length - 1 ],
									head = cursors[ 0 ],
									headWalker = new characterWalker( head ),
									tailWalker = new characterWalker( tail );

								if ( !( isWordSeparator( headWalker.back().character ) && isWordSeparator( tailWalker.next().character ) ) )
									continue;
							}

							this.range.setMatched();
							return true;
						}
					}

					this.range.clearMatched();

					// clear current session and restart from beginning
					if ( matchCyclic )
						this.range = null;

					return false;
				},

				/**
				 * Record how much replacement occurred toward one replacing.
				 */
				replaceCounter: 0,

				replace: function( dialog, pattern, newString, matchCase, matchWord, matchCyclic, matchReplaceAll ) {
					var replaceResult = false;
					if ( this.range && this.range.isMatched() ) {
						var domRange = this.range.toDomRange();
						var text = editor.document.createText( newString );
						domRange.deleteContents();
						domRange.insertNode( text );
						this.range.updateFromDomRange( domRange );

						this.replaceCounter++;
						replaceResult = true;
					}

					var findResult = this.find( pattern, matchCase, matchWord, matchCyclic );
					if ( findResult && matchReplaceAll )
						this.replace.apply( this, Array.prototype.slice.call( arguments ) );
					return matchReplaceAll ? this.replaceCounter : replaceResult || findResult;
				}
			};

			/**
			 * Get the default cursor which is the start of this document.
			 */
			function getDefaultStartCursor() {
				return { textNode: editor.document.getBody(), offset: 0 };
			}

			/**
			 * Get cursor that indicate search begin with, receive from user
			 * selection prior.
			 */
			function getStartCursor() {
				if ( CKEDITOR.env.ie )
					this.restoreSelection();

				var sel = editor.getSelection();
				if ( sel ) {
					var lastRange = sel.getRanges()[ sel.getRanges().length - 1 ];
					return {
						textNode: lastRange.getBoundaryNodes().endNode,
						offset: lastRange.endContainer.type === CKEDITOR.NODE_ELEMENT ? 0 : lastRange.endOffset
					};
				} else
					return getDefaultStartCursor();
			}

			return {
				title: editor.lang.findAndReplace.title,
				resizable: CKEDITOR.DIALOG_RESIZE_NONE,
				minWidth: 400,
				minHeight: 255,
				buttons: [ CKEDITOR.dialog.cancelButton ], //Cancel button only.
				contents: [
					{
					id: 'find',
					label: editor.lang.findAndReplace.find,
					title: editor.lang.findAndReplace.find,
					accessKey: '',
					elements: [
						{
						type: 'hbox',
						widths: [ '230px', '90px' ],
						children: [
							{
							type: 'text',
							id: 'txtFindFind',
							label: editor.lang.findAndReplace.findWhat,
							isChanged: false,
							labelLayout: 'horizontal',
							accessKey: 'F'
						},
							{
							type: 'button',
							align: 'left',
							style: 'width:100%',
							label: editor.lang.findAndReplace.find,
							onClick: function() {
								var dialog = this.getDialog();
								if ( !finder.find( dialog.getValueOf( 'find', 'txtFindFind' ), dialog.getValueOf( 'find', 'txtFindCaseChk' ), dialog.getValueOf( 'find', 'txtFindWordChk' ), dialog.getValueOf( 'find', 'txtFindCyclic' ) ) )
									alert( editor.lang.findAndReplace.notFoundMsg );
							}
						}
						]
					},
						{
						type: 'vbox',
						padding: 0,
						children: [
							{
							type: 'checkbox',
							id: 'txtFindCaseChk',
							isChanged: false,
							style: 'margin-top:28px',
							label: editor.lang.findAndReplace.matchCase
						},
							{
							type: 'checkbox',
							id: 'txtFindWordChk',
							isChanged: false,
							label: editor.lang.findAndReplace.matchWord
						},
							{
							type: 'checkbox',
							id: 'txtFindCyclic',
							isChanged: false,
							'default': true,
							label: editor.lang.findAndReplace.matchCyclic
						}
						]
					}
					]
				},
					{
					id: 'replace',
					label: editor.lang.findAndReplace.replace,
					accessKey: 'M',
					elements: [
						{
						type: 'hbox',
						widths: [ '230px', '90px' ],
						children: [
							{
							type: 'text',
							id: 'txtFindReplace',
							label: editor.lang.findAndReplace.findWhat,
							isChanged: false,
							labelLayout: 'horizontal',
							accessKey: 'F'
						},
							{
							type: 'button',
							align: 'left',
							style: 'width:100%',
							label: editor.lang.findAndReplace.replace,
							onClick: function() {
								var dialog = this.getDialog();
								if ( !finder.replace( dialog, dialog.getValueOf( 'replace', 'txtFindReplace' ), dialog.getValueOf( 'replace', 'txtReplace' ), dialog.getValueOf( 'replace', 'txtReplaceCaseChk' ), dialog.getValueOf( 'replace', 'txtReplaceWordChk' ), dialog.getValueOf( 'replace', 'txtReplaceCyclic' ) ) )
									alert( editor.lang.findAndReplace.notFoundMsg );
							}
						}
						]
					},
						{
						type: 'hbox',
						widths: [ '230px', '90px' ],
						children: [
							{
							type: 'text',
							id: 'txtReplace',
							label: editor.lang.findAndReplace.replaceWith,
							isChanged: false,
							labelLayout: 'horizontal',
							accessKey: 'R'
						},
							{
							type: 'button',
							align: 'left',
							style: 'width:100%',
							label: editor.lang.findAndReplace.replaceAll,
							isChanged: false,
							onClick: function() {
								var dialog = this.getDialog();
								var replaceNums;

								finder.replaceCounter = 0;
								if ( ( replaceNums = finder.replace( dialog, dialog.getValueOf( 'replace', 'txtFindReplace' ), dialog.getValueOf( 'replace', 'txtReplace' ), dialog.getValueOf( 'replace', 'txtReplaceCaseChk' ), dialog.getValueOf( 'replace', 'txtReplaceWordChk' ), dialog.getValueOf( 'replace', 'txtReplaceCyclic' ), true ) ) )
									alert( editor.lang.findAndReplace.replaceSuccessMsg.replace( /%1/, replaceNums ) );
								else
									alert( editor.lang.findAndReplace.notFoundMsg );
							}
						}
						]
					},
						{
						type: 'vbox',
						padding: 0,
						children: [
							{
							type: 'checkbox',
							id: 'txtReplaceCaseChk',
							isChanged: false,
							label: editor.lang.findAndReplace.matchCase
						},
							{
							type: 'checkbox',
							id: 'txtReplaceWordChk',
							isChanged: false,
							label: editor.lang.findAndReplace.matchWord
						},
							{
							type: 'checkbox',
							id: 'txtReplaceCyclic',
							isChanged: false,
							'default': true,
							label: editor.lang.findAndReplace.matchCyclic
						}
						]
					}
					]
				}
				],
				onLoad: function() {
					var dialog = this;

					//keep track of the current pattern field in use.
					var patternField, wholeWordChkField;

					//Ignore initial page select on dialog show
					var isUserSelect = false;
					this.on( 'hide', function() {
						isUserSelect = false;
					});
					this.on( 'show', function() {
						isUserSelect = true;
					});

					this.selectPage = CKEDITOR.tools.override( this.selectPage, function( originalFunc ) {
						return function( pageId ) {
							originalFunc.call( dialog, pageId );

							var currPage = dialog._.tabs[ pageId ];
							var patternFieldInput, patternFieldId, wholeWordChkFieldId;
							patternFieldId = pageId === 'find' ? 'txtFindFind' : 'txtFindReplace';
							wholeWordChkFieldId = pageId === 'find' ? 'txtFindWordChk' : 'txtReplaceWordChk';

							patternField = dialog.getContentElement( pageId, patternFieldId );
							wholeWordChkField = dialog.getContentElement( pageId, wholeWordChkFieldId );

							// prepare for check pattern text filed 'keyup' event
							if ( !currPage.initialized ) {
								patternFieldInput = CKEDITOR.document.getById( patternField._.inputId );
								currPage.initialized = true;
							}

							if ( isUserSelect )
								// synchronize fields on tab switch.
								syncFieldsBetweenTabs.call( this, pageId );
						};
					});

				},
				onShow: function() {
					// Establish initial searching start position.
					finder.startCursor = getStartCursor.call( this );

					if ( startupPage == 'replace' )
						this.getContentElement( 'replace', 'txtFindReplace' ).focus();
					else
						this.getContentElement( 'find', 'txtFindFind' ).focus();
				},
				onHide: function() {
					if ( finder.range && finder.range.isMatched() ) {
						finder.range.removeHighlight();
						editor.getSelection().selectRanges( [ finder.range.toDomRange() ] );
					}

					// Clear current session before dialog close
					delete finder.range;
				}
			};
		};

	CKEDITOR.dialog.add( 'find', function( editor ) {
		return findDialog( editor, 'find' )
	});

	CKEDITOR.dialog.add( 'replace', function( editor ) {
		return findDialog( editor, 'replace' )
	});
})();
