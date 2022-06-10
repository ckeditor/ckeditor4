/* bender-tags: emoji */
/* bender-ckeditor-plugins: emoji,ajax,toolbar,clipboard,undo */
/* bender-include: _helpers/tools.js */
/* global emojiTools */


( function() {
	'use strict';

	bender.editor = {
		config: {
			language: 'en'
		}
	};

	bender.test( {
		_should: {
			ignore: {
				// (#2528).
				'test click inserts emoji to editor and has proper focus': CKEDITOR.env.safari,
				'test keyboard event should inserts emoji to editor and had proper focus': CKEDITOR.env.safari,
				'test clicking into navigation list item does not throw an error': CKEDITOR.env.safari,
				'test input is focused element when dropdown opens': CKEDITOR.env.safari,
				'test navigation highlights proper section when scrolls': CKEDITOR.env.safari || CKEDITOR.env.gecko // Firefox (#2831).
			}
		},

		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'emoji' );
		},

		// This test should be on top of test suite, cause other tests will cache emojis (#2583).
		'test emoji names cache': function() {
			var bot = this.editorBot,
				collision = CKEDITOR.tools.array.filter( bot.editor._.emoji.list, function( item ) {
				return item.id === ':collision:';
			} )[ 0 ];

			assert.isUndefined( collision.name, 'Emoji name should be undefined.' );

			bot.panel( 'EmojiPanel', function( panel ) {
				panel.hide();
				assert.areEqual( 'collision', collision.name, 'Emoji name should be cached.' );
			} );
		},

		// This test case fail if performed later in this suite (#5188).
		'test navigation highlights proper section when scrolls': function() {
			var bot = this.editorBot;

			waitForEmoji( bot.editor, function() {
				bot.panel( 'EmojiPanel', function( panel ) {
					var doc = panel._.iframe.getFrameDocument(),
						testElement = doc.findOne( 'a[data-cke-emoji-name="star"]' );

					testElement.scrollIntoView( true );

					// Scroll event is throttled that's why we need wait a little bit.
					CKEDITOR.tools.setTimeout( function() {
						resume( function() {
							panel.hide();
							assert.isTrue( doc.findOne( 'li[data-cke-emoji-group="travel"]' ).hasClass( 'active' ), 'Travel item in navigation should be highlighted' );
						} );
					}, 160 );
					wait();
				} );
			} );
		},

		'test emoji dropdown has proper components': function() {
			var bot = this.editorBot;

			waitForEmoji( bot.editor, function() {
				bot.panel( 'EmojiPanel', function( panel ) {
					try {
						var doc = panel._.iframe.getFrameDocument();
						assert.areNotSame( 0, doc.find( '.cke_emoji-navigation_item' ).count(), 'There is no navigation in Emoji Panel.' );
						assert.areSame( 1, doc.find( 'input' ).count(), 'There is no search input in Emoji Panel.' );
						assert.areSame( 1, doc.find( '.cke_emoji-outer_emoji_block' ).count(), 'There is no emoji block in Emoji Panel.' );
						assert.areSame( 1, doc.find( '.cke_emoji-status_bar' ).count(), 'There is no emoji status bar in Emoji Panel.' );

						assert.isTrue( doc.findOne( 'input' ).hasListeners( 'input' ), 'Searchbox doesn\'t have listener.' );
						assert.isTrue( doc.findOne( '.cke_emoji-outer_emoji_block' ).hasListeners( 'mouseover' ), 'Emoji block should have mouseover listener.' );
						assert.isTrue( doc.findOne( '.cke_emoji-outer_emoji_block' ).hasListeners( 'click' ), 'Emoji block should have click listener.' );
						assert.isTrue( doc.findOne( '.cke_emoji-outer_emoji_block' ).hasListeners( 'scroll' ), 'Emoji block should have scroll listener.' );
						assert.isTrue( doc.findOne( 'nav' ).hasListeners( 'click' ), 'Navigation element should have click listener.' );
					} finally {
						panel.hide();
					}
				} );
			} );
		},

		'test emoji dropdown filter search results': function() {
			var bot = this.editorBot;

			waitForEmoji( bot.editor, function() {
				bot.panel( 'EmojiPanel', function( panel ) {
					var doc = panel._.iframe.getFrameDocument(),
						input = doc.findOne( 'input' );

					input.setValue( 'kebab' );
					input.fire( 'input', new CKEDITOR.dom.event( {
						sender: input
					} ) );
					// Timeouts are necessary for IE11, which has problem with refreshing DOM. That's why asserts run asynchronously.
					CKEDITOR.tools.setTimeout( function() {
						resume( function() {
							assert.areSame( 2, doc.find( 'li.cke_emoji-item :not(.hidden)' ).count(), 'There should be returned 2 values for kebab `keyword`' );
							panel.hide();
							bot.panel( 'EmojiPanel', function() {
								CKEDITOR.tools.setTimeout( function() {
									resume( function() {
										panel.hide();
										assert.areSame( '', input.getValue(), 'Search value should be reset after hiding panel.' );
										assert.areSame( 0, doc.find( 'li.cke_emoji-item.hidden' ).count(), 'All emoji items should be reset to visible state after closing panel.' );
									} );
								}, 200 );
								wait();
							} );
						} );
					}, 200 );
					wait();
				} );
			} );
		},

		'test emoji dropdown update status': function() {
			var bot = this.editorBot;

			waitForEmoji( bot.editor, function() {
				// Overlay is required to not trigger mouse event what happens on CI (#3744).
				var overlay = addOverlayCover();

				bot.panel( 'EmojiPanel', function( panel ) {
					try {
						var doc = panel._.iframe.getFrameDocument(),
							statusBarIcon = doc.findOne( '.cke_emoji-status_icon' ),
							statusBarDescription = doc.findOne( 'p.cke_emoji-status_description' ),
							testElement;

						assert.areSame( '', statusBarIcon.getText(), 'Status bar icon should be empty when panel is open.' );
						assert.areSame( '', statusBarDescription.getText(), 'Status bar description should be empty when panel is open.' );

						testElement = doc.findOne( 'a[data-cke-emoji-name="star"]' );

						doc.findOne( '.cke_emoji-outer_emoji_block' ).fire( 'mouseover', new CKEDITOR.dom.event( {
							target: testElement.$
						} ) );

						assert.areSame( '⭐', statusBarIcon.getText(), 'Status bar icon should contain star after mouseover event.' );
						assert.areSame( 'star', statusBarDescription.getText(), 'Status bar description should contain "star" name after mouseover.' );
					} finally {
						panel.hide();
						overlay.remove();
					}
				} );
			} );
		},

		'test emoji list scrolls when navigation is clicked': function() {
			var bot = this.editorBot;

			waitForEmoji( bot.editor, function() {
				bot.panel( 'EmojiPanel', function( panel ) {
					try {
						var doc = panel._.iframe.getFrameDocument(),
							emojiBlock = doc.findOne( '.cke_emoji-outer_emoji_block' );

						assert.areSame( 0, emojiBlock.$.scrollTop, 'Emoji elements should be scrolled to the top.' );

						doc.findOne( 'a[title="Flags"]' ).$.click();

						assert.areNotSame( 0, emojiBlock.$.scrollTop, 'Emoji elements should be scrolled somewhere down.' );
					} finally {
						panel.hide();
					}
				} );
			} );
		},

		'test input is focused element when dropdown opens': function() {
			var bot = this.editorBot;

			waitForEmoji( bot.editor, function() {
				bot.panel( 'EmojiPanel', function( panel ) {
					var doc = panel._.iframe.getFrameDocument(),
						inputElement = doc.findOne( 'input' ),
						panelBlock = emojiTools.getEmojiPanelBlock( panel ),
						inputIndex = CKEDITOR.tools.getIndex( panelBlock._.getItems().toArray(), function( el ) {
							return el.equals( inputElement );
						} );

					assert.areNotSame( 0, panelBlock._.focusIndex, 'Focus should not be in first element which is navigation.' );
					assert.areSame( inputIndex, panelBlock._.focusIndex, 'First selected item should be input.' );
					CKEDITOR.tools.setTimeout( function() {
						resume( function() {
							try {
								assert.isTrue( inputElement.equals( new CKEDITOR.dom.element( doc.$.activeElement ) ), 'Input should be focused element.' );
							} finally {
								panel.hide();
							}
						} );
					}, 100 );
					wait();
				} );
			} );
		},

		'test click inserts emoji to editor and has proper focus': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( '', function() {
				waitForEmoji( bot.editor, function() {
					bot.panel( 'EmojiPanel', function( panel ) {
						try {
							var doc = panel._.iframe.getFrameDocument(),
								testElement = doc.findOne( 'a[data-cke-emoji-name="star"]' );

							doc.findOne( '.cke_emoji-outer_emoji_block' ).fire( 'click', new CKEDITOR.dom.event( {
								target: testElement.$
							} ) );
							assert.areSame( '<p>⭐</p>', bot.getData().replace( /<p>\s<\/p>/, '' ), 'Star should be inserted in editor after click.' );
						} finally {
							panel.hide();
						}

						CKEDITOR.tools.setTimeout( function() {
							resume( function() {
								assert.isTrue( editor.editable().hasFocus, 'Editable should have focus after emoji insertion.' );
							} );
						}, 100 );

						wait();
					} );
				} );
			} );
		},

		'test keyboard event should inserts emoji to editor and had proper focus': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setData( '', function() {
				waitForEmoji( bot.editor, function() {
					bot.panel( 'EmojiPanel', function( panel ) {
						try {
							var doc = panel._.iframe.getFrameDocument(),
								testElement = doc.findOne( 'a[data-cke-emoji-name="star"]' ),
								panelBlock = emojiTools.getEmojiPanelBlock( panel );

							panelBlock._.focusIndex = CKEDITOR.tools.getIndex( panelBlock._.getItems().toArray(), function( el ) {
								return el.data( 'cke-emoji-name' ) === 'star';
							} );

							doc.fire( 'keydown', new CKEDITOR.dom.event( {
								target: testElement.$,
								keyCode: 32
							} ) );

							assert.areSame( '<p>⭐</p>', bot.getData().replace( /<p>\s<\/p>/, '' ), 'Star should be inserted in editor after pressing space.' );
						} finally {
							panel.hide();
						}

						CKEDITOR.tools.setTimeout( function() {
							resume( function() {
								assert.isTrue( editor.editable().hasFocus, 'Editable should have focus after emoji insertion.' );
							} );
						}, 100 );

						wait();
					} );
				} );
			} );
		},

		'test clicking into navigation list item does not throw an error': function() {
			var bot = this.editorBot;

			waitForEmoji( bot.editor, function() {
				bot.panel( 'EmojiPanel', function( panel ) {
					try {
						var doc = panel._.iframe.getFrameDocument(),
							focusedElement = doc.findOne( 'a[data-cke-emoji-group="flags"' );

						doc.findOne( 'a[title="Flags"]' ).getAscendant( 'li' ).$.click();
						assert.isTrue( focusedElement.equals( new CKEDITOR.dom.element( doc.$.activeElement ) ), 'First flag should be focused.' );
					} finally {
						panel.hide();
					}
				} );
			} );
		},

		'test left and right arrow does not change focus on input element': function() {
			var bot = this.editorBot;

			waitForEmoji( bot.editor, function() {
				bot.panel( 'EmojiPanel', function( panel ) {
					var doc = panel._.iframe.getFrameDocument(),
						input = doc.findOne( 'input' );

					// Input is focused asynchronously, that's why we need to run test asynchronously.
					CKEDITOR.tools.setTimeout( function() {
						resume( function() {
							try {
								doc.fire( 'keydown', new CKEDITOR.dom.event( {
									target: input.$,
									keyCode: 37
								} ) );
								assert.isTrue( input.equals( new CKEDITOR.dom.element( doc.$.activeElement ), 'Input should be focused after pressing left arrow.' ) );

								doc.fire( 'keydown', new CKEDITOR.dom.event( {
									target: input.$,
									keyCode: 39
								} ) );
								assert.isTrue( input.equals( new CKEDITOR.dom.element( doc.$.activeElement ), 'Input should be focused after pressing right arrow.' ) );
							} finally {
								panel.hide();
							}
						} );
					}, 100 );
					wait();
				} );
			} );
		},

		'test navigation click scrolls entire page': function() {
			var bot = this.editorBot,
				win = CKEDITOR.document.getWindow(),
				body = CKEDITOR.document.getBody(),
				parentIframe = win.getFrame(),
				parentHeight;

			// There is need to resize iframe with test run from dashboard. To prevent situation,
			// where focusing element will additionally scroll page
			if ( parentIframe ) {
				parentHeight = parentIframe.getStyle( 'height' );
				parentIframe.setStyle( 'height', '1000px' );
			}

			body.setStyle( 'height', '10000px' );

			waitForEmoji( bot.editor, function() {
				bot.panel( 'EmojiPanel', function( panel ) {
					try {
						var doc = panel._.iframe.getFrameDocument(),
							scrollPosition = win.getScrollPosition().y;

						doc.findOne( 'a[title="Flags"]' ).$.click();
						assert.areEqual( scrollPosition, win.getScrollPosition().y, 'Window should not be scrolled down after clicking into navigation' );
					} finally {
						if ( parentHeight ) {
							parentIframe.setStyle( 'height', parentHeight );
						}
						body.removeStyle( 'height' );
						panel.hide();
					}
				} );
			} );
		},

		// (#2607)
		'test SVG icons support': function() {
			if ( !this.editor.plugins.emoji.isSVGSupported() ) {
				assert.ignore();
			}

			var bot = this.editorBot;

			bot.panel( 'EmojiPanel', function( panel ) {
				var doc = panel._.iframe.getFrameDocument();

				CKEDITOR.ajax.load( this.editor.plugins.emoji.path + 'assets/iconsall.svg', function( html ) {
					var container = new CKEDITOR.dom.element( 'div' );

					container.setHtml( html );

					resume( function() {
						var icons = doc.findOne( '.cke_emoji-navigation_icons' );

						assert.beautified.html( container.getHtml(), icons.getHtml(), 'Icons should be loaded as a part of panel' );

						panel.hide();
					} );
				} );

				wait();
			} );
		}
	} );

	// Loading emoji list is asynchronous, we can't run tests without making sure they are loaded (#3094).
	function waitForEmoji( editor, callback ) {
		if ( editor._.emoji ) {
			callback();
		} else {
			setTimeout( function() {
				resume( function() {
					waitForEmoji( editor, callback );
				} );
			}, 50 );

			wait();
		}
	}

	function addOverlayCover() {
		var overlay = CKEDITOR.dom.element.createFromHtml( '<div style="width:1000px;height:1000px;z-index:20000;position:fixed;top:0;left:0;"></div>' );
		CKEDITOR.document.getBody().append( overlay );
		return overlay;
	}
} )();
