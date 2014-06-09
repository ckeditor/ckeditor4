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
	// document.caretRangeFromPoint returns null
	// for inline and divbased editor if viewport is too small.
	if ( CKEDITOR.env.webkit && editor.name != 'framed' && window.innerHeight < 300 )
		assert.ignore();

	// IE8 also has some problem with running test if the window is too small.
	if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 && editor.name != 'framed' && document.documentElement.clientHeight < 500 )
		assert.ignore();

	var editable = editor.editable(),
		dropTarget = ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) || editable.isInline() ? editable : editor.document,
		range = new CKEDITOR.dom.range( editor.document ),
		pasteEventCounter = 0,
		expectedPasteEventCount = typeof config.expectedPasteEventCount  !== 'undefined' ? config.expectedPasteEventCount : 1,
		x = config.x[ editor.name ] ? config.x[ editor.name ]  : config.x,
		y = config.y[ editor.name ] ? config.y[ editor.name ]  : config.y;

	// To simulate drop event we need to set selection (IE use it),
	// clientX and clientY (IE and Chrome use it),
	// rangeParent and rangeOffset (FF use it).
	range.setStart( config.element, config.offset );
	range.collapse( true );
	range.select();

	editor.focus();

	evt.$.clientX = x;
	evt.$.clientY = y;
	if ( CKEDITOR.env.gecko ) {
		evt.$.rangeParent = config.element.$;
		evt.$.rangeOffset = config.offset;
	}

	editor.on( 'paste', function() {
		pasteEventCounter++;
	} );

	dropTarget.fire( 'drop', evt );

	wait( function() {
		assert.areSame( expectedPasteEventCount, pasteEventCounter, 'paste event should be called ' + expectedPasteEventCount + ' time(s)' );

		callback();
	}, 100 );
}

var logViewTopBackup,
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
	contentsFrame = CKEDITOR.env.webkit && CKEDITOR.document && CKEDITOR.document.getWindow().$.frameElement;

	contentsFrame && ( contentsFrame.style.width = '1%' );
	contentsFrame && ( contentsFrame.style.width = '1000px' );

bender.tools.setUpEditors( editorsDefinitions, function( editors, editorBots ) {
	bender.test( bender.tools.createTestsForEditors(
		[ editors.framed, editors.inline, editors.divarea ], {
		setUp: function() {
			CKEDITOR.document.getById( 'framed-container' ).hide();
			CKEDITOR.document.getById( 'divarea-container' ).hide();
			CKEDITOR.document.getById( 'inline-container' ).hide();

			logViewTopBackup = CKEDITOR.document.findOne( '.results' ).getStyle( 'top' );
			CKEDITOR.document.findOne( '.results' ).setStyle( 'top', 'auto' );
		},

		tearDown: function() {

			CKEDITOR.document.findOne( '.results' ).setStyle( 'top', logViewTopBackup );
		},

		'test drop to header': function( editor ) {
			CKEDITOR.document.getById( editor.name + '-container' ).show();

			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<h1 id="h1">Header1</h1>' +
			'<p>Lorem ipsum [dolor] sit amet.</p>' );

			drag( editor, evt );

			drop( editor, evt, {
				x: 260,
				y: { framed: 33, inline: 111, divarea: 172 },
				element:  editor.document.getById( 'h1' ).getChild( 0 ),
				offset: 7
			}, function() {
				assert.areSame( '<h1 id="h1">Header1dolor^</h1><p>Lorem ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<h1 id="h1">Header1</h1><p>Lorem ipsum dolor sit amet.</p>', bender.tools.compatHtml( editor.getData(), 0, 1, 0, 1 ), 'after undo' );
			} );
		},

		'test drop the same line, before': function( editor ) {
			CKEDITOR.document.getById( editor.name + '-container' ).show();

			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum [dolor] sit amet.</p>' );

			drag( editor, evt );

			drop( editor, evt, {
				x: { framed: 60, inline: 45, divarea: 54 },
				y: { framed: 131, inline: 112, divarea: 216 },
				element:  editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6
			}, function() {
				assert.areSame( '<p id="p">Lorem dolor^ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum dolor sit amet.</p>', bender.tools.compatHtml( editor.getData(), 0, 1, 0, 1 ), 'after undo' );
			} );
		},

		'test drop the same line, after': function( editor ) {
			CKEDITOR.document.getById( editor.name + '-container' ).show();

			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem [ipsum] dolor sit amet.</p>' );

			drag( editor, evt );

			drop( editor, evt, {
				x: { framed: 151, inline: ( CKEDITOR.env.webkit ? 142 : 139 ), divarea: 151 },
				y: { framed: 38, inline: 112, divarea: 224 },
				element:  editor.document.getById( 'p' ).getChild( 2 ),
				offset: 11
			}, function() {
				assert.areSame( '<p id="p">Lorem dolor sit ipsum^amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum dolor sit amet.</p>', bender.tools.compatHtml( editor.getData(), 0, 1, 0, 1 ), 'after undo' );
			} );
		},

		'test drop after paragraph': function( editor ) {
			CKEDITOR.document.getById( editor.name + '-container' ).show();

			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem [ipsum] dolor sit amet.</p>' );

			drag( editor, evt );

			drop( editor, evt, {
				x: { framed: 251, inline: 240, divarea: 251 },
				y: { framed: 38, inline: 112, divarea: 224 },
				element:  editor.document.getById( 'p' ).getChild( 2 ),
				offset: 16
			}, function() {
				assert.areSame( '<p id="p">Lorem dolor sit amet.ipsum^</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum dolor sit amet.</p>', bender.tools.compatHtml( editor.getData(), 0, 1, 0, 1 ), 'after undo' );
			} );
		},

		'test drop on the left from paragraph': function( editor ) {
			CKEDITOR.document.getById( editor.name + '-container' ).show();

			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p" style="margin-left: 20px">Lorem [ipsum] dolor sit amet.</p>' );

			drag( editor, evt );

			drop( editor, evt, {
				x: 15,
				y: { framed: 38, inline: 112, divarea: 224 },
				element:  editor.document.getById( 'p' ).getChild( 0 ),
				offset: 0
			}, function() {
				assert.isMatching( /<p id="p" style="margin-left: ?20px;?">ipsum\^Lorem dolor sit amet\.<\/p>/, bender.tools.compatHtml( bender.tools.getHtmlWithSelection( editor ), 0, 1, 0, 1 ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.isMatching( '<p id="p" style="margin-left:20px;?">Lorem ipsum dolor sit amet.</p>', bender.tools.compatHtml( editor.getData(), 1, 1, 1, 1 ), 'after undo' );
			} );
		},

		'test drop from external source': function( editor ) {
			CKEDITOR.document.getById( editor.name + '-container' ).show();

			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum sit amet.</p>' );

			if ( CKEDITOR.env.ie )
				evt.$.dataTransfer.setData( 'Text', 'dolor' );
			else
				evt.$.dataTransfer.setData( 'text/html', 'dolor' );

			drop( editor, evt, {
				x: { framed: 60, inline: 45, divarea: 54 },
				y: { framed: 131, inline: 112, divarea: 216 },
				element:  editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6
			}, function() {
				assert.areSame( '<p id="p">Lorem dolor^ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum sit amet.</p>', bender.tools.compatHtml( editor.getData(), 0, 1, 0, 1 ), 'after undo' );
			} );
		},

		'test drop html from external source': function( editor ) {
			CKEDITOR.document.getById( editor.name + '-container' ).show();

			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum sit amet.</p>' );

			if ( CKEDITOR.env.ie )
				evt.$.dataTransfer.setData( 'Text', '<b>dolor</b>' );
			else
				evt.$.dataTransfer.setData( 'text/html', '<b>dolor</b>' );

			drop( editor, evt, {
				x: { framed: 60, inline: 45, divarea: 54 },
				y: { framed: 131, inline: 112, divarea: 216 },
				element:  editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6
			}, function() {
				assert.areSame( '<p id="p">Lorem <b>dolor^</b>ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum sit amet.</p>', bender.tools.compatHtml( editor.getData(), 0, 1, 0, 1 ), 'after undo' );
			} );
		},

		'test drop empty element from external source': function( editor ) {
			CKEDITOR.document.getById( editor.name + '-container' ).show();

			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem ^ipsum sit amet.</p>' );

			drop( editor, evt, {
				x: { framed: 60, inline: 45, divarea: 54 },
				y: { framed: 131, inline: 112, divarea: 216 },
				element:  editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6,
				expectedPasteEventCount: 0
			}, function() {
				assert.areSame( '<p id="p">Lorem ^ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );
			} );
		},

		'test cross editor drop': function( editor ) {
			CKEDITOR.document.getById( editor.name + '-container' ).show();

			var bot = editorBots[ editor.name ],
				evt = createDnDEventMock(),
				botCross = editorBots[ 'cross' ],
				editorCross = botCross.editor;

			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum sit amet.</p>' );
			botCross.setHtmlWithSelection( '<p id="p">Lorem [ipsum <b>dolor</b>] sit amet.</p>' );

			drag( editorCross, evt );

			drop( editor, evt, {
				x: { framed: 60, inline: 45, divarea: 54 },
				y: { framed: 131, inline: 112, divarea: 216 },
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
	} ) );
} );