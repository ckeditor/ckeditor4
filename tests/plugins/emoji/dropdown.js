/* bender-tags: emoji */
/* bender-ckeditor-plugins: emoji,toolbar,clipboard,undo */
/* bender-include: _helpers/tools.js */
/* global emojiTools */


( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		setUp: function() {
			if ( emojiTools.notSupportedEnvironment ) {
				assert.ignore();
			}
		},
		'test emoji dropdown has proper components': function() {
			var bot = this.editorBot;
			bot.panel( 'emojiPanel', function( panel ) {
				try {
					var doc = panel._.iframe.getFrameDocument();
					assert.areNotSame( 0, doc.find( '.cke_emoji-navigation_item' ).count(), 'There is no navigation in Emoji Panel.' );
					assert.areSame( 1, doc.find( 'input' ).count(), 'There is no search input in Emoji Panel.' );
					assert.areSame( 1, doc.find( '.cke_emoji-outer_emoji_block' ).count(), 'There is no emoji block in Emoji Panel.' );
					assert.areSame( 1, doc.find( '.cke_emoji-status_bar' ).count(), 'There is no emoji status bar in Emoji Panel.' );

					assert.isTrue( doc.findOne( 'input' ).hasListeners( 'input' ), 'Searchbox doesn\'t have listener.' );
					assert.isTrue( doc.findOne( '.cke_emoji-outer_emoji_block' ).hasListeners( 'mouseover' ), 'Emoji block doesn\'t have mouseover listener.' );
					assert.isTrue( doc.findOne( '.cke_emoji-outer_emoji_block' ).hasListeners( 'click' ), 'Emoji block doesn\'t have click listener.' );
					assert.isTrue( doc.findOne( '.cke_emoji-outer_emoji_block' ).hasListeners( 'scroll' ), 'Emoji block doesn\'t have scroll listener.' );
					assert.isTrue( doc.findOne( 'nav li' ).hasListeners( 'click' ), 'Navigation elements doesn\'t have click listener.' );
				}
				finally {
					panel.hide();
				}
			} );
		},

		'test emoji dropdown filter search results': function() {
			var bot = this.editorBot;
			bot.panel( 'emojiPanel', function( panel ) {
				try {
					var doc = panel._.iframe.getFrameDocument();
					var input = doc.findOne( 'input' );
					input.setValue( 'kebab' );
					input.fire( 'input', new CKEDITOR.dom.event( {
						sender: input
					} ) );
					assert.areSame( 2, doc.find( 'li.cke_emoji_item :not(.hidden)' ).count(), 'There should be returned 2 values for kebab `keyword`' );
					panel.hide();
					bot.panel( 'emojiPanel', function() {
						assert.areSame( '', input.getValue(), 'Search value should be reset after hidding panel.' );
						assert.areSame( 0, doc.find( 'li.cke_emoji_item.hidden' ).count(), 'All emoji items should be reset to visible state after closing panel.' );
					} );
				}
				finally {
					panel.hide();
				}
			} );
		},

		'test emoji dropdown update status': function() {
			var bot = this.editorBot;
			bot.panel( 'emojiPanel', function( panel ) {
				try {
					var doc = panel._.iframe.getFrameDocument(),
						statusBarIcon = doc.findOne( '.cke_emoji-status_icon' ),
						statusBarDescription = doc.findOne( 'p.cke_emoji-status_description' ),
						testElement;

					assert.areSame( '', statusBarIcon.getText(), 'Status bar icon should be empty when panel is open.' );
					assert.areSame( '', statusBarDescription.getText(), 'Status bar description should be empty when panel is open.' );

					testElement = doc.findOne( 'a[data-cke-emoji-name="star"]' );

					doc.findOne( '.cke_emoji-outer_emoji_block' ).fire( 'mouseover', new CKEDITOR.dom.event( {
						target: testElement.getParent().$
					} ) );

					assert.areSame( '⭐', statusBarIcon.getText(), 'Status bar icon should contain star after mouseover event.' );
					assert.areSame( 'star', statusBarDescription.getText(), 'Status bar description should contain "star" name after mouseover.' );
				}
				finally {
					panel.hide();
				}
			} );
		},

		'test emoji list scrolls when navigation is clicked': function() {
			var bot = this.editorBot;
			bot.panel( 'emojiPanel', function( panel ) {
				try {
					var doc = panel._.iframe.getFrameDocument(),
						emojiBlock = doc.findOne( '.cke_emoji-outer_emoji_block' );

					assert.areSame( 0, emojiBlock.$.scrollTop, 'Emoji elements should be scrolled to the top.' );

					doc.findOne( 'a[href="#flags"]' ).$.click();

					assert.areNotSame( 0, emojiBlock.$.scrollTop, 'Emoji elements should be scrolled somewhere down.' );
				}
				finally {
					panel.hide();
				}
			} );
		},

		'test navigation higlights proper section when scrolls': function() {
			var bot = this.editorBot;
			bot.panel( 'emojiPanel', function( panel ) {
				try {
					var doc = panel._.iframe.getFrameDocument(),
						testElement = doc.findOne( 'a[data-cke-emoji-name="star"]' );

					testElement.scrollIntoView( true );

					doc.findOne( '.cke_emoji-outer_emoji_block' ).fire( 'scroll', new CKEDITOR.dom.event() );

					assert.isTrue( doc.findOne( 'li[data-cke-emoji-group="travel"]' ).hasClass( 'active' ), 'Travel item in navigation should be highlighted' );

				}
				finally {
					panel.hide();
				}
			} );
		},

		'test click inserts emoji to editor': function() {
			var bot = this.editorBot;
			bot.setData( '', function() {
				bot.panel( 'emojiPanel', function( panel ) {
					try {
						var doc = panel._.iframe.getFrameDocument(),
							testElement = doc.findOne( 'a[data-cke-emoji-name="star"]' );

						doc.findOne( '.cke_emoji-outer_emoji_block' ).fire( 'click', new CKEDITOR.dom.event( {
							target: testElement.$
						} ) );
						assert.areSame( '<p>⭐</p>', bot.getData(), 'Star should be inserted in editor after click.' );

					}
					finally {
						panel.hide();
					}
				} );
			} );
		},

		'test keyboard event should inserts emoji to editor': function() {
			var bot = this.editorBot;
			bot.setData( '', function() {
				bot.panel( 'emojiPanel', function( panel ) {
					try {
						var doc = panel._.iframe.getFrameDocument(),
							testElement = doc.findOne( 'a[data-cke-emoji-name="star"]' ),
							panelBlock = emojiTools.getEmojiPanelBlock( panel );

						panelBlock._.focusIndex =  CKEDITOR.tools.getIndex( panelBlock._.getItems().toArray(), function( el ) {
							return el.data( 'cke-emoji-name' ) === 'star';
						} );

						doc.fire( 'keydown', new CKEDITOR.dom.event( {
							target: testElement.$,
							keyCode: 32
						} ) );

						assert.areSame( '<p>⭐</p>', bot.getData(), 'Star should be inserted in editor after pressing space.' );
					}
					finally {
						panel.hide();
					}
				} );
			} );
		}
	} );

} )();
