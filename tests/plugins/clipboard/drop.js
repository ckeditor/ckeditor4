/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,clipboard,undo */

'use strict';

CKEDITOR.disableAutoInline = true;

function createDnDEventMock() {
 	return {
		$: {
			clientX: 0,
			clientY: 0,

			dataTransfer: {
				setData: function( type, data ) {
					this.type = data;
				},
				getData: function( type ) {
					return this.type;
				},
			}
		},
		preventDefault: function() {
			// noop
		}
	}
 }

function drag( editor, evt ) {
	var editable = editor.editable(),
		dropTarget = ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) || editable.isInline() ? editable : editor.document;

	dropTarget.fire( 'dragstart', evt );
}

function drop( editor, evt, config, callback ) {
	var editable = editor.editable(),
		dropTarget = ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) || editable.isInline() ? editable : editor.document,
		range = new CKEDITOR.dom.range( editor.document ),
		pasteEventCounter = 0,
		expectedPasteEventCount = typeof config.expectedPasteEventCount  !== 'undefined' ?
			config.expectedPasteEventCount :
			1;

	range.setStart( config.element, config.offset );
	range.collapse( true );
	range.select();

	editor.focus();

	evt.testRange = range;

	editor.on( 'paste', function() {
		pasteEventCounter++;
	} );

	dropTarget.fire( 'drop', evt );

	wait( function() {
		assert.areSame( expectedPasteEventCount, pasteEventCounter, 'paste event should be called ' + expectedPasteEventCount + ' time(s)' );

		callback();
	}, 100 );
}

var editors, editorBots,
	editorsDefinitions = {
		framed: {
			name: 'framed',
			creator: 'replace',
			config: {
				allowedContent: true,
				toolbarGroups: [ { name: 'clipboard', groups: [ 'clipboard', 'undo' ] } ]
			}
		},
		inline: {
			name: 'inline',
			creator: 'inline',
			config: {
				allowedContent: true,
				toolbarGroups: [ { name: 'clipboard', groups: [ 'clipboard', 'undo' ] } ]
			}
		},
		divarea: {
			name: 'divarea',
			creator: 'replace',
			config: {
				extraPlugins: 'divarea',
				allowedContent: true,
				toolbarGroups: [ { name: 'clipboard', groups: [ 'clipboard', 'undo' ] } ]
			}
		},
		cross: {
			name: 'cross',
			creator: 'replace',
			config: {
				allowedContent: true,
				toolbarGroups: [ { name: 'clipboard', groups: [ 'clipboard', 'undo' ] } ]
			}
		}
	},
	testsForMultipleEditor = {
		'test drop to header': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<h1 id="h1">Header1</h1>' +
			'<p>Lorem ipsum [dolor] sit amet.</p>' );

			drag( editor, evt );

			drop( editor, evt, {
				element:  editor.document.getById( 'h1' ).getChild( 0 ),
				offset: 7
			}, function() {
				assert.areSame( '<h1 id="h1">Header1dolor^</h1><p>Lorem ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<h1 id="h1">Header1</h1><p>Lorem ipsum dolor sit amet.</p>', bender.tools.compatHtml( editor.getData(), 0, 1, 0, 1 ), 'after undo' );
			} );
		},

		'test drop the same line, before': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum [dolor] sit amet.</p>' );

			drag( editor, evt );

			drop( editor, evt, {
				element:  editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6
			}, function() {
				assert.areSame( '<p id="p">Lorem dolor^ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum dolor sit amet.</p>', bender.tools.compatHtml( editor.getData(), 0, 1, 0, 1 ), 'after undo' );
			} );
		},

		'test drop the same line, after': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem [ipsum] dolor sit amet.</p>' );

			drag( editor, evt );

			drop( editor, evt, {
				element:  editor.document.getById( 'p' ).getChild( 2 ),
				offset: 11
			}, function() {
				assert.areSame( '<p id="p">Lorem dolor sit ipsum^amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum dolor sit amet.</p>', bender.tools.compatHtml( editor.getData(), 0, 1, 0, 1 ), 'after undo' );
			} );
		},

		'test drop after paragraph': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem [ipsum] dolor sit amet.</p>' );

			drag( editor, evt );

			drop( editor, evt, {
				element:  editor.document.getById( 'p' ).getChild( 2 ),
				offset: 16
			}, function() {
				assert.areSame( '<p id="p">Lorem dolor sit amet.ipsum^</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum dolor sit amet.</p>', bender.tools.compatHtml( editor.getData(), 0, 1, 0, 1 ), 'after undo' );
			} );
		},

		'test drop on the left from paragraph': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p" style="margin-left: 20px">Lorem [ipsum] dolor sit amet.</p>' );

			drag( editor, evt );

			drop( editor, evt, {
				element:  editor.document.getById( 'p' ).getChild( 0 ),
				offset: 0
			}, function() {
				assert.isMatching( /<p id="p" style="margin-left: ?20px;?">ipsum\^Lorem dolor sit amet\.<\/p>/, bender.tools.compatHtml( bender.tools.getHtmlWithSelection( editor ), 0, 1, 0, 1 ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.isMatching( '<p id="p" style="margin-left:20px;?">Lorem ipsum dolor sit amet.</p>', bender.tools.compatHtml( editor.getData(), 1, 1, 1, 1 ), 'after undo' );
			} );
		},

		'test drop from external source': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum sit amet.</p>' );

			if ( CKEDITOR.env.ie )
				evt.$.dataTransfer.setData( 'Text', 'dolor' );
			else
				evt.$.dataTransfer.setData( 'text/html', 'dolor' );

			drop( editor, evt, {
				element:  editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6
			}, function() {
				assert.areSame( '<p id="p">Lorem dolor^ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum sit amet.</p>', bender.tools.compatHtml( editor.getData(), 0, 1, 0, 1 ), 'after undo' );
			} );
		},

		'test drop html from external source': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum sit amet.</p>' );

			if ( CKEDITOR.env.ie )
				evt.$.dataTransfer.setData( 'Text', '<b>dolor</b>' );
			else
				evt.$.dataTransfer.setData( 'text/html', '<b>dolor</b>' );

			drop( editor, evt, {
				element:  editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6
			}, function() {
				assert.areSame( '<p id="p">Lorem <b>dolor^</b>ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum sit amet.</p>', bender.tools.compatHtml( editor.getData(), 0, 1, 0, 1 ), 'after undo' );
			} );
		},

		'test drop empty element from external source': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem ^ipsum sit amet.</p>' );

			drop( editor, evt, {
				element:  editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6,
				expectedPasteEventCount: 0
			}, function() {
				assert.areSame( '<p id="p">Lorem ^ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );
			} );
		},

		'test cross editor drop': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock(),
				botCross = editorBots[ 'cross' ],
				editorCross = botCross.editor;

			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum sit amet.</p>' );
			botCross.setHtmlWithSelection( '<p id="p">Lorem [ipsum <b>dolor</b>] sit amet.</p>' );

			drag( editorCross, evt );

			drop( editor, evt, {
				element:  editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6
			}, function() {
				assert.areSame( '<p id="p">Lorem ipsum <b>dolor^</b>ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				assert.areSame( '<p id="p">Lorem sit amet.</p>', bender.tools.compatHtml( editorCross.getData(), 0, 1, 0, 1 ), 'after drop - editor cross' );

				editor.execCommand( 'undo' );
				editorCross.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum sit amet.</p>', bender.tools.compatHtml( editor.getData(), 0, 1, 0, 1 ), 'after undo' );
				assert.areSame( '<p id="p">Lorem ipsum <b>dolor</b> sit amet.</p>', bender.tools.compatHtml( editorCross.getData(), 0, 1, 0, 1 ), 'after undo - editor cross' );
			} );
		}
	},
	testsForOneEditor = {
		'test fixIESplittedNodes': function() {
			var editor = editors.framed,
				bot = editorBots[ editor.name ],
				dragRange = editor.createRange(),
				dropRange = editor.createRange(),
				p, text;

			// Create DOM
			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum sit amet.</p>' );
			p = editor.document.getById( 'p' );

			// Set drag range.
			dragRange.setStart( p.getChild( 0 ), 11 );
			dragRange.collapse( true );

			// Break content like IE do.
			p.getChild( 0 ).setText( 'Lorem' );
			text = new CKEDITOR.dom.text( ' ipsum sit amet.' );
			text.insertAfter( p.getChild( 0 ) );

			// Set drop range.
			dropRange.setStart( p, 1 );
			dropRange.collapse( true );

			// Fix nodes.
			CKEDITOR.plugins.clipboard.fixIESplittedNodes( dragRange, dropRange );

			// Asserts.
			assert.areSame( 1, p.getChildCount() );
			dragRange.select();
			assert.areSame( '<p>Lorem ipsum{} sit amet.</p>', bender.tools.selection.getWithHtml( editor ) );
			dropRange.select();
			assert.areSame( '<p>Lorem{} ipsum sit amet.</p>', bender.tools.selection.getWithHtml( editor ) );
		},

		'test rangeBefore 1': function() {
			var editor = editors.framed,
				bot = editorBots[ editor.name ],
				firstRange = editor.createRange(),
				secondRange = editor.createRange(),
				p;

			// "Lorem[1] ipsum[2] sit amet."
			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum sit amet.</p>' );
			p = editor.document.getById( 'p' );

			firstRange.setStart( p.getChild( 0 ), 5 );
			firstRange.collapse( true );

			secondRange.setStart( p.getChild( 0 ), 11 );
			secondRange.collapse( true );

			assert.isTrue( CKEDITOR.plugins.clipboard.rangeBefore( firstRange, secondRange ) );
		},

		'test rangeBefore 2': function() {
			var editor = editors.framed,
				bot = editorBots[ editor.name ],
				firstRange = editor.createRange(),
				secondRange = editor.createRange(),
				p, text;

			// "Lorem " [1] " ipsum" [2] "sit amet."
			bot.setHtmlWithSelection( '<p id="p">Lorem </p>' );
			p = editor.document.getById( 'p' );
			text = new CKEDITOR.dom.text( ' ipsum' );
			text.insertAfter( p.getChild( 0 ) );
			text = new CKEDITOR.dom.text( ' sit amet.' );
			text.insertAfter( p.getChild( 0 ) );

			firstRange.setStart( p, 1 );
			firstRange.collapse( true );

			secondRange.setStart( p, 2 );
			secondRange.collapse( true );

			assert.isTrue( CKEDITOR.plugins.clipboard.rangeBefore( firstRange, secondRange ) );
		},

		'test rangeBefore 3': function() {
			var editor = editors.framed,
				bot = editorBots[ editor.name ],
				firstRange = editor.createRange(),
				secondRange = editor.createRange(),
				p, text;

			// "Lorem[1] ipsum" [2] "sit amet."
			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum</p>' );
			p = editor.document.getById( 'p' );
			text = new CKEDITOR.dom.text( ' sit amet.' );
			text.insertAfter( p.getChild( 0 ) );

			firstRange.setStart( p.getChild( 0 ), 5 );
			firstRange.collapse( true );

			secondRange.setStart( p, 1 );
			secondRange.collapse( true );

			assert.isTrue( CKEDITOR.plugins.clipboard.rangeBefore( firstRange, secondRange ) );
		}
	};

bender.tools.setUpEditors( editorsDefinitions, function( e, eb ) {
	editors = e;
	editorBots = eb;

	bender.test( CKEDITOR.tools.extend(
		bender.tools.createTestsForEditors(
			[ editors.framed, editors.inline, editors.divarea ],
			testsForMultipleEditor ),
		testsForOneEditor )
	);
} );