/* bender-tags: editor,unit,balloonpanel */
/* bender-ckeditor-plugins: balloonpanel */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		},
		startupData: '<strong>foo</strong><em>bar</em>'
	};

	var panels = [];

	bender.test( {
		'test panel create': function() {
			var panel = new CKEDITOR.ui.balloonPanel( bender.editor, {
				title: 'Test panel #1',
				width: 100,
				height: 200
			} );

			assert.areSame( bender.editor, panel.editor, 'Panel belongs to an editor' );
			assert.areSame( panel.parts.panel.getParent(), CKEDITOR.document.getBody(), 'Panel in top-most document' );
			assert.isTrue( CKEDITOR.tools.isEmpty( panel.activeShowListeners ), 'Has no listeners until shown' );

			assert.areSame( 100, panel.width, 'Definition passed to the panel (width)' );
			assert.areSame( 200, panel.height, 'Definition passed to the panel (height)' );

			assert.isFalse( panel.parts.panel.isVisible(), 'Panel is not visible until attached' );
			assert.isFalse( panel.rect.visible, 'Panel is not visible until attached (rect)' );

			var anotherPanel = new CKEDITOR.ui.balloonPanel( bender.editor, {
				title: 'Test panel #1a'
			} );

			assert.areSame( 360, anotherPanel.width, 'Definition is passed per-panel (width)' );
			assert.areSame( 'auto', anotherPanel.height, 'Definition is passed per-panel (height)' );

			panels.push( panel, anotherPanel );
		},

		'test panel events': function() {
			var panel = new CKEDITOR.ui.balloonPanel( bender.editor, {
				title: 'Test panel #2'
			} );

			var shows = 0,
				hides = 0,
				attaches = 0;

			function assertEvents( expectedShows, expectedHides, expectedAttaches, msg ) {
				assert.areSame( expectedShows, shows, 'Shows: ' + msg );
				assert.areSame( expectedHides, hides, 'Hides: ' + msg );
				assert.areSame( expectedAttaches, attaches, 'Attaches: ' + msg );
			}

			panel.on( 'show', function() {
				++shows;
			} );

			panel.on( 'hide', function() {
				++hides;
			} );

			panel.on( 'attach', function() {
				++attaches;
			} );

			panel.show();
			assertEvents( 1, 0, 0, 'show fired once' );
			panel.show();
			assertEvents( 1, 0, 0, 'show not fired is panel is visible' );

			panel.hide();
			assertEvents( 1, 1, 0, 'hide fired once' );
			panel.hide();
			assertEvents( 1, 1, 0, 'hide not fired if panel is hidden' );

			var strong = bender.editor.document.findOne( 'strong' ),
				em = bender.editor.document.findOne( 'em' );

			panel.attach( strong );
			assertEvents( 2, 1, 1, 'attach and show are fired' );
			panel.attach( em );
			assertEvents( 2, 1, 2, 'attach is fired' );
			panel.attach( em );
			assertEvents( 2, 1, 3, 'attach is fired' );
			panel.hide();
			assertEvents( 2, 2, 3, 'hide fired once' );
			panel.attach( em );
			assertEvents( 3, 2, 4, 'attach is fired' );

			panels.push( panel );
		},

		'test panel listeners': function() {
			var panel = new CKEDITOR.ui.balloonPanel( bender.editor, {
				title: 'Test panel #3'
			} );

			var listenerRemoved = false;

			panel.addShowListener( function() {
				return {
					removeListener: function() {
						listenerRemoved = true;
					}
				};
			} );

			assert.areSame( 1, CKEDITOR.tools.objectKeys( panel.showListeners ).length, 'Before #show: Registered one listener' );
			assert.areSame( 0, CKEDITOR.tools.objectKeys( panel.activeShowListeners ).length, 'Before #show: No active listeners' );
			assert.isFalse( listenerRemoved, 'Before #show: Listener not removed yet.' );
			panel.show();

			assert.areSame( 1, CKEDITOR.tools.objectKeys( panel.showListeners ).length, 'After #show: Registered one listener' );
			assert.areSame( 1, CKEDITOR.tools.objectKeys( panel.activeShowListeners ).length, 'After #show: Listener activated on show' );
			assert.isFalse( listenerRemoved, 'After #show: Listener not removed yet.' );

			panel.show();
			assert.areSame( 1, CKEDITOR.tools.objectKeys( panel.showListeners ).length, 'After another #show: Registered one listener' );
			assert.areSame( 1, CKEDITOR.tools.objectKeys( panel.activeShowListeners ).length, 'After another #show: Listener activated on show' );
			assert.isFalse( listenerRemoved, 'After another #show: Listener not removed yet.' );

			panel.hide();
			assert.areSame( 1, CKEDITOR.tools.objectKeys( panel.showListeners ).length, 'After #hide: Registered one listener' );
			assert.areSame( 0, CKEDITOR.tools.objectKeys( panel.activeShowListeners ).length, 'After #hide: Deactivated listener' );
			assert.isTrue( listenerRemoved, 'After #hide: Listener removed.' );

			panels.push( panel );
		},

		// (#4)
		'test panel attach focus': function() {
			var panel = new CKEDITOR.ui.balloonPanel( bender.editor, {
					title: 'Sample panel'
				} ),
				doc = CKEDITOR.document,
				strong = bender.editor.document.findOne( 'strong' ),
				panelElement = panel.parts.panel,
				closeElement = panel.parts.close;

			panels.push( panel );

			// Test default call.
			panel.attach( strong );
			assert.isTrue( doc.getActive().equals( panelElement ), 'Panel element is focused' );

			// Giving focus element explicitly.
			panel.attach( strong, closeElement );
			assert.isTrue( doc.getActive().equals( closeElement ), 'Close element is focused' );

			// Blur focused element, so the body will be focused.
			closeElement.$.blur();

			// Ensure that focus is not changed when giving false.
			panel.attach( strong, false );
			assert.isTrue( doc.getActive().equals( doc.getBody() ), 'Focus remains on body element' );
		},

		'test panel destroy': function() {
			var panel = new CKEDITOR.ui.balloonPanel( bender.editor, {
				title: 'Test panel #4'
			} );

			panels.push( panel );
			bender.editor.destroy();

			var p;
			while ( ( p = panels.pop() ) ) {
				assert.areSame( 0, CKEDITOR.tools.objectKeys( p.activeShowListeners ).length, p.title + ': no active listeners once panel is destroyed' );
				assert.isNull( p.parts.panel.getParent(), p.title + ': panel out of DOM' );
			}
		}
	} );
} )();