/* bender-tags: editor,unit,lineutils */
/* bender-ckeditor-plugins: lineutils */

( function() {
	'use strict';

	var liner;

	CKEDITOR.addCss(
		// Note: body margin and position:relative are crucial for getClientRect tests.
		'body { padding: 0px !important; margin: 10px 20px !important; position: relative; }' +
		'body * { outline: 1px solid #ccc } '
	);

	bender.editor = {
		config: {
			allowedContent: true,
			autoParagraph: false,
			on: {
				instanceReady: function() {
					liner = new CKEDITOR.plugins.lineutils.liner( this );
				}
			}
		}
	};

	var lines = [],
		line;

	bender.test( {
		'test addLine': function() {
			var body = CKEDITOR.document.getBody();

			for ( var i = 0; i < 10; i++ ) {
				line = liner.addLine();
				lines.push( line );
				assert.areSame( body, line.getParent(), 'Line added to DOM.' );
			}
		},

		'test remove lines (destroy)': function() {
			var bot = this.editorBot,
				i;

			for ( i = lines.length; i--; )
				liner[ i % 2 ? 'visible' : 'hidden' ][ lines[ i ].getUniqueId() ] = lines[ i ];

			assert.areSame( 5, CKEDITOR.tools.objectKeys( liner.visible ).length );
			assert.areSame( 5, CKEDITOR.tools.objectKeys( liner.hidden ).length );

			bot.editor.destroy();

			for ( i = lines.length; i--; )
				assert.isNull( lines[ i ].getParent(), 'Line removed from DOM.' );
		},

		'test showLine': function() {
			var line, uid;

			line = liner.addLine();
			uid = line.getUniqueId();

			assert.isUndefined( liner.hidden[ uid ], 'Line not registered in visible.' );
			assert.isUndefined( liner.visible[ uid ], 'Line not registered in hidden.' );

			liner.showLine( line );

			assert.isUndefined( liner.hidden[ uid ], 'Line not added to hidden.' );
			assert.areSame( liner.visible[ uid ], line, 'Line properly added to visible.' );

			assert.isTrue( line.isVisible(), 'Line hidden in DOM.' );
		},


		'test hideLine': function() {
			var line, uid;

			line = liner.addLine();
			uid = line.getUniqueId();

			assert.isUndefined( liner.hidden[ uid ], 'Line not registered in visible.' );
			assert.isUndefined( liner.visible[ uid ], 'Line not registered in hidden.' );

			liner.visible[ uid ] = line;
			liner.hideLine( line );

			assert.isUndefined( liner.visible[ uid ], 'Line properly removed from visible.' );
			assert.areSame( liner.hidden[ uid ], line, 'Line properly added to hidden.' );

			assert.isFalse( line.isVisible(), 'Line hidden in DOM.' );
		},

		'test hideVisible': function() {
			var line1, line2;

			// Clean-up liner first.
			liner.removeAll();

			// One to hidden.
			line1 = liner.addLine();
			liner.hidden[ line1.getUniqueId() ] = line2;

			// One to visible.
			line2 = liner.addLine();
			liner.visible[ line2.getUniqueId()  ] = line2;

			liner.hideVisible();

			assert.isTrue( CKEDITOR.tools.isEmpty( liner.visible ), 'Line removed from visible.' );
			assert.isFalse( line2.isVisible(), 'Line hidden in DOM.' );
			assert.areSame( 2, CKEDITOR.tools.objectKeys( liner.hidden ).length, 'Line moved to hidden.' );
		},

		// #12812
		'test the constructor does not access window\'s parent frame in case of inline editor': function() {
			bender.editorBot.create( {
				creator: 'inline',
				name: 'inline1'
			}, function( bot ) {
				var editor = bot.editor,
					spy = sinon.spy( editor.window, 'getFrame' ),
					liner = new CKEDITOR.plugins.lineutils.liner( editor );

				assert.isFalse( spy.called, 'the editor.window.getFrame() was not called' );
				assert.isFalse( 'frame' in liner, 'liner.frame was not set' );
			} );
		},

		'test relative getClientRect': function() {
			var el = CKEDITOR.dom.element.createFromHtml( '<div>getClientRect test</div>', CKEDITOR.document ),
				body = CKEDITOR.document.getBody();

			el.appendTo( body );

			var defaultClientRect = el.getClientRect(),
				linerClientRect = liner.getClientRect( el ),
				bodyComputedPosition = body.getDocumentPosition();

			assert.areSame( bodyComputedPosition.x, linerClientRect.relativeX, 'Rect relativeX shift is stored.' );
			assert.areSame( bodyComputedPosition.y, linerClientRect.relativeY, 'Rect relativeY shift is stored.' );

			assert.areSame( defaultClientRect.left, linerClientRect.left + bodyComputedPosition.x, 'Rect left is shifted.' );
			assert.areSame( defaultClientRect.right, linerClientRect.right + bodyComputedPosition.x, 'Rect right is shifted.' );
			assert.areSame( defaultClientRect.top, linerClientRect.top + bodyComputedPosition.y, 'Rect top is shifted.' );
			assert.areSame( defaultClientRect.bottom, linerClientRect.bottom + bodyComputedPosition.y, 'Rect bottom is shifted.' );
			assert.areSame( defaultClientRect.width, linerClientRect.width, 'Rect width remains.' );
			assert.areSame( defaultClientRect.height, linerClientRect.height, 'Rect height remains.' );
		}
	} );
} )();