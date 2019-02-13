/* bender-tags: emoji */
/* bender-ckeditor-plugins: emoji,toolbar,clipboard,undo */
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
				'test navigation highlights proper section when scrolls': CKEDITOR.env.safari
			}
		},

		setUp: function() {
			if ( emojiTools.notSupportedEnvironment ) {
				assert.ignore();
			}
		},
		'test emoji dropdown has proper components': function() {
			var bot = this.editorBot;
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
		},

		'test emoji dropdown filter search results': function() {
			var bot = this.editorBot;
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
		},

		'test emoji dropdown update status': function() {
			var bot = this.editorBot;
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
				}
			} );
		},

		'test emoji list scrolls when navigation is clicked': function() {
			var bot = this.editorBot;
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
		},

		'test navigation highlights proper section when scrolls': function() {
			var bot = this.editorBot;
			bot.panel( 'EmojiPanel', function( panel ) {
				var doc = panel._.iframe.getFrameDocument(),
					testElement = doc.findOne( 'a[data-cke-emoji-name="star"]' );

				testElement.scrollIntoView( true );

				doc.findOne( '.cke_emoji-outer_emoji_block' ).fire( 'scroll', new CKEDITOR.dom.event() );
				// Scroll event is throttled that's why we need wait a little bit.
				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						panel.hide();
						assert.isTrue( doc.findOne( 'li[data-cke-emoji-group="travel"]' ).hasClass( 'active' ), 'Travel item in navigation should be highlighted' );
					} );
				}, 160 );
				wait();
			} );
		},

		'test input is focused element when dropdown opens': function() {
			var bot = this.editorBot;
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
		},

		'test click inserts emoji to editor and has proper focus': function() {
			var bot = this.editorBot,
				editor = this.editor;
			bot.setData( '', function() {
				bot.panel( 'EmojiPanel', function( panel ) {
					try {
						var doc = panel._.iframe.getFrameDocument(),
							testElement = doc.findOne( 'a[data-cke-emoji-name="star"]' );

						doc.findOne( '.cke_emoji-outer_emoji_block' ).fire( 'click', new CKEDITOR.dom.event( {
							target: testElement.$
						} ) );
						assert.areSame( '<p>⭐</p>', bot.getData(), 'Star should be inserted in editor after click.' );
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
		},

		'test keyboard event should inserts emoji to editor and had proper focus': function() {
			var bot = this.editorBot,
				editor = this.editor;
			bot.setData( '', function() {
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

						assert.areSame( '<p>⭐</p>', bot.getData(), 'Star should be inserted in editor after pressing space.' );
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
		},

		'test clicking into navigation list item does not throw an error': function() {
			var bot = this.editorBot;
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
		},

		'test left and right arrow does not change focus on input element': function() {
			var bot = this.editorBot;
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
		}
	} );

} )();
