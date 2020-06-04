/* bender-tags: editor */
/* bender-ckeditor-plugins: stylesheetparser,tableresize,wysiwygarea,undo */

'use strict';

function createMoveEventMock( table ) {
	var definedX;

	return {
		move: function() {
			definedX = this.getPageOffset().x + 20;
		},

		getPageOffset: function() {
			var pillars = table.getCustomData( '_cke_table_pillars' );

			return {
				x:
					// If x is defined use it.
					definedX ? definedX :
						// For the first run x does not matter, because we want to create pillars.
						pillars ? pillars[ 0 ].x :
							// Return 0 otherwise.
							0,
				y: pillars ? pillars[ 0 ].y : 0
			};
		},

		getTarget: function() {
			return {
				is: function() {
					return 'table';
				},

				getAscendant: function() {
					return table;
				},

				type: CKEDITOR.NODE_ELEMENT
			};
		},

		preventDefault: function() {
			// noop
		},
		// We need this because on build version magicline plugin
		// also listen on 'mousemove'.
		$: {
			clientX: 0,
			clientY: 0
		}
	};
}

function init( table, editor ) {
	var evtMock = createMoveEventMock( table ),
		mouseElement = !editor ? new CKEDITOR.dom.document( document ) :
						editor.editable().isInline() ? editor.editable() :
						editor.document;

	// Run for the first time to create pillars
	mouseElement.fire( 'mousemove', evtMock );
	// Run for the second time to create resizer
	mouseElement.fire( 'mousemove', evtMock );
}

function resize( table, callback ) {
	var doc = table.getDocument(),
		resizer = getResizer( doc ),
		moveEvtMock = createMoveEventMock( table ),
		evtMock = {
			// We need this as table improvements listens to mousedown events.
			$: {
				button: 0
			},
			getTarget: sinon.stub().returns( table ),
			preventDefault: sinon.stub()
		};

	resizer.fire( 'mousedown', evtMock );
	resizer.fire( 'mousemove', moveEvtMock );

	moveEvtMock.move();
	resizer.fire( 'mousemove', moveEvtMock );

	doc.fire( 'mouseup', evtMock );

	setTimeout( function() {
		callback();
	}, 1 );
}

function getResizer( doc ) {
	return doc.find( 'div[data-cke-temp]' ).getItem( 0 );
}

bender.editors = {
	classic: {
		name: 'classic'
	},
	classic2: {
		name: 'classic2'
	},
	inline: {
		name: 'inline',
		creator: 'inline'
	},
	intable: {
		name: 'intable',
		creator: 'inline'
	},
	undo: {
		name: 'undo'
	}
};

bender.test( {
	assertIsResized: function( table, name ) {
		var width = parseInt( table.getStyle( 'width' ), 10 );
		assert.isTrue( width > 40, name + ' should be resized.' );
	},

	assertIsNotTouched: function( table, name ) {
		assert.areSame( '', table.getStyle( 'width' ), name + ' should not be touched.' );
	},

	'test classic editor': function() {
		var editor = this.editors.classic,
			doc = editor.document,
			globalDoc = new CKEDITOR.dom.document( document ),
			insideTable = doc.getElementsByTag( 'table' ).getItem( 0 ),
			outsideTable = globalDoc.getById( 'outside' );

		init( insideTable, editor );

		assert.areSame( 1, doc.find( 'div[data-cke-temp]' ).count(), 'Resizer should be inited.' );
		assert.areSame( 0, globalDoc.find( 'div[data-cke-temp]' ).count(), 'Global document should not be touched.' );

		this.assertIsNotTouched( insideTable, 'insideTable' );
		this.assertIsNotTouched( outsideTable, 'outsideTable' );

		resize( insideTable, function() {
			resume( function() {
				this.assertIsResized( insideTable, 'insideTable' );
				this.assertIsNotTouched( outsideTable, 'outsideTable' );

				// With true to avoid updating textarea what may cause test fail after refreshing window -
				// Firefox will load the cached old value.
				editor.destroy( true );

				assert.areSame( 0, doc.find( 'div[data-cke-temp]' ).count(), 'Resizer should be removed.' );
			} );
		} );

		wait();
	},

	'test inline editor': function() {
		var editor = this.editors.inline,
			doc = editor.document,
			insideTable = editor.document.getById( 'inside' ),
			outsideTable = CKEDITOR.document.getById( 'outside' );

		init( insideTable, editor );

		assert.areSame( 1, doc.find( 'div[data-cke-temp]' ).count(), 'Resizer should be inited.' );

		this.assertIsNotTouched( insideTable, 'outsideTable' );
		this.assertIsNotTouched( outsideTable, 'outsideTable' );

		resize( insideTable, function() {
			resume( function() {
				this.assertIsResized( insideTable, 'insideTable' );

				init( outsideTable );
				resize( outsideTable, function() {
					resume( function() {
						this.assertIsNotTouched( outsideTable, 'outsideTable' );

						editor.destroy();

						assert.areSame( 0, doc.find( 'div[data-cke-temp]' ).count(), 'Resizer should be removed.' );
					} );
				} );

				wait();
			} );
		} );

		wait();
	},

	'test preventing creating pillars on tables out of editor': function() {
		var editor = this.editors.intable,
			wrapperTable = editor.editable().getAscendant( 'table' );

		var evt = new CKEDITOR.dom.event( {
			target: editor.editable().findOne( 'h1' ).$
		} );
		editor.editable().fire( 'mousemove', evt );

		assert.isNull( wrapperTable.getCustomData( '_cke_table_pillars' ) );
	},

	// https://dev.ckeditor.com/ticket/13388.
	'test undo/redo table resize': function() {
		var editor = this.editors.undo,
			doc = editor.document,
			insideTable = doc.getElementsByTag( 'table' ).getItem( 0 );

		init( insideTable, editor );

		insideTable.findOne( 'td' ).setHtml( 'foo' );

		resize( insideTable, function() {
			resume( function() {
				var table;

				// Step 1: undo table resizing.
				editor.execCommand( 'undo' );
				table = doc.findOne( 'table' );
				this.assertIsNotTouched( table, 'insideTable' );
				// Contents of table cell should remain not undone.
				assert.isInnerHtmlMatching( 'foo@', table.findOne( 'td' ).getHtml() );

				// Step 2: undo text insert.
				editor.execCommand( 'undo' );
				// Bogus elements may be present.
				assert.isInnerHtmlMatching( '@', doc.findOne( 'td' ).getHtml() );

				// Get back to the "final" state with redo commands.
				// Redo text insert.
				editor.execCommand( 'redo' );
				// Redo table resize.
				editor.execCommand( 'redo' );

				// Table should be resized.
				this.assertIsResized( doc.findOne( 'table' ), 'insideTable' );
			} );
		} );

		wait();
	},

	// https://dev.ckeditor.com/ticket/14762
	'test empty table': function() {
		var editor = this.editors.classic2;

		editor.setData( CKEDITOR.document.findOne( '#empty' ).getOuterHtml(), {
			callback: function() {
				resume( function() {
					var editable = editor.editable();

					editor.document.fire( 'mousemove', new CKEDITOR.dom.event( {
						target: editable.findOne( 'table' ).$
					} ) );

					assert.pass();
				} );
			}
		} );

		wait();
	},

	// #417
	'test resizing table with thead only': function() {
		var editor = this.editors.classic2,
			editable = editor.editable();

		editor.setData( CKEDITOR.document.findOne( '#headeronly' ).getOuterHtml(), {

			callback: function() {
				resume( function() {
					editor.document.fire( 'mousemove', new CKEDITOR.dom.event( {
						target: editable.findOne( 'table' ).$
					} ) );

					assert.pass();
				} );
			}
		} );

		wait();
	},

	// #417
	'test resizing table with tfoot only': function() {
		var editor = this.editors.classic2,
			editable = editor.editable();

		editor.setData( CKEDITOR.document.findOne( '#footeronly' ).getOuterHtml(), {

			callback: function() {
				resume( function() {
					editor.document.fire( 'mousemove', new CKEDITOR.dom.event( {
						target: editable.findOne( 'table' ).$
					} ) );

					assert.pass();
				} );
			}
		} );

		wait();
	}
} );
