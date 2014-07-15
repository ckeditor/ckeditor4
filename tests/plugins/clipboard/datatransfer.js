/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,clipboard */

'use strict';

var setWithHtml = bender.tools.selection.setWithHtml,
	getWithHtml = bender.tools.selection.getWithHtml,
	htmlMatchOpts = {
		compareSelection: false,
		fixStyles: true
	};

function createDragDropEventMock() {
	return {
		data: {
			$: {
				dataTransfer: {
					_dataTypes : [],
					// Emulate browsers native behavior for getDeta/setData.
					setData: function( type, data ) {
						if ( CKEDITOR.env.ie && type != 'Text' && type != 'URL' )
							throw "Unexpected call to method or property access.";

						if ( CKEDITOR.env.ie && CKEDITOR.env.version > 9 && type == 'URL' )
							return;

						this._dataTypes[ type ] = data;
					},
					getData: function( type ) {
						if ( CKEDITOR.env.ie && type != 'Text' && type != 'URL' )
							throw "Invalid argument.";

						if ( !this._dataTypes[ type ] )
							return '';

						return this._dataTypes[ type ];
					}
				}
			}
		}
	}
}

bender.test( {
	'async:init': function() {
		var that = this;

		bender.tools.setUpEditors( {
			editor1: {
				name: 'editor1'
			},
			editor2: {
				name: 'editor2'
			}
		}, function( editors, bots ) {
			that.bots = bots;
			that.editors = editors;

			that.callback();
		} );
	},

	setUp: function() {
		CKEDITOR.plugins.clipboard.resetDragDataTransfer();
	},

	assertDataTransfer: function( expected, dataTransfer ) {
		assert.areSame( expected.transferType, dataTransfer.getTransferType(), 'transferType' );
		assert.areSame( expected.sourceEditor, dataTransfer.sourceEditor, 'sourceEditor' );
		assert.areSame( expected.targetEditor, dataTransfer.targetEditor, 'targetEditor' );
		assert.areSame( expected.text, dataTransfer.getData( 'text/plain' ), 'getData( \'text/plain\' )' );
		assert.isInnerHtmlMatching( expected.html,  dataTransfer.getData( 'text/html' ), htmlMatchOpts, 'getData( \'text/html\' )' );
	},

	'test id': function() {
		var evt1 = createDragDropEventMock(),
			evt2 = createDragDropEventMock(),
			dataTransfer1a = new CKEDITOR.plugins.clipboard.dataTransfer( evt1 ),
			dataTransfer1b = new CKEDITOR.plugins.clipboard.dataTransfer( evt1 ),
			dataTransfer2 = new CKEDITOR.plugins.clipboard.dataTransfer( evt2 );

		assert.areSame( dataTransfer1a.id, dataTransfer1b.id, 'Ids for object based on the same event should be the same.' );

		// In IE10+ we can not use any data type besides text, so id is fixed.
		if ( !CKEDITOR.env.ie || CKEDITOR.env.version < 10 )
			assert.areNotSame( dataTransfer1a.id, dataTransfer2.id, 'Ids for object based on different events should be different.' );
	},

	'test internal drag drop': function() {
		var bot = this.bots.editor1,
			editor = this.editors.editor1,
			evt, dataTransfer;

		bot.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );

		evt = createDragDropEventMock();
		evt.data.$.dataTransfer.setData( 'Text', 'bar' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt, editor );
		dataTransfer.setTargetEditor( editor );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				sourceEditor: editor,
				targetEditor: editor,
				text: 'bar',
				html: 'x<b>foo</b>x' },
			dataTransfer );
	},

	'test internal drag drop, no event': function() {
		var bot = this.bots.editor1,
			editor = this.editors.editor1,
			dataTransfer;

		bot.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( null, editor );
		dataTransfer.setTargetEditor( editor );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				sourceEditor: editor,
				targetEditor: editor,
				text: ( CKEDITOR.env.ie && CKEDITOR.env.version > 9 ) ? '' : 'xfoox',
				html: 'x<b>foo</b>x' },
			dataTransfer );
	},

	'test drop text from external source': function() {
		var editor = this.editors.editor1,
			evt, dataTransfer;

		evt = createDragDropEventMock();
		evt.data.$.dataTransfer.setData( 'Text', 'x<b>foo</b>x' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );
		dataTransfer.setTargetEditor( editor );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_EXTERNAL,
				sourceEditor: undefined,
				targetEditor: editor,
				text: 'x<b>foo</b>x',
				html: '' },
			dataTransfer );
	},

	'test drop html from external source': function() {
		var editor = this.editors.editor1,
			evt, dataTransfer;

		evt = createDragDropEventMock();
		evt.data.$.dataTransfer.setData( 'Text', 'bar' );
		if ( !CKEDITOR.env.ie ) {
			evt.data.$.dataTransfer.setData( 'text/html', 'x<b>foo</b>x' );
		}

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );
		dataTransfer.setTargetEditor( editor );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_EXTERNAL,
				sourceEditor: undefined,
				targetEditor: editor,
				text: 'bar',
				html: CKEDITOR.env.ie ? '' : 'x<b>foo</b>x' },
			dataTransfer );
	},

	'test drag drop between editors': function() {
		var bot1 = this.bots.editor1,
			editor1 = this.editors.editor1,
			editor2 = this.editors.editor2,
			evt, dataTransfer;

		bot1.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );

		evt = createDragDropEventMock();
		evt.data.$.dataTransfer.setData( 'Text', 'bar' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt, editor1 );
		dataTransfer.setTargetEditor( editor2 );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_CROSS_EDITORS,
				sourceEditor: editor1,
				targetEditor: editor2,
				text: 'bar',
				html: 'x<b>foo</b>x' },
			dataTransfer );
	},

	'test drag drop between editors, no event': function() {
		var bot1 = this.bots.editor1,
			editor1 = this.editors.editor1,
			editor2 = this.editors.editor2,
			dataTransfer;

		bot1.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );
		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( null, editor1 );
		dataTransfer.setTargetEditor( editor2 );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_CROSS_EDITORS,
				sourceEditor: editor1,
				targetEditor: editor2,
				text: ( CKEDITOR.env.ie && CKEDITOR.env.version > 9 ) ? '' : 'xfoox',
				html: 'x<b>foo</b>x' },
			dataTransfer );
	},

	'test set-get data, data type: Text, dataTransfer with event': function() {
		var evt = createDragDropEventMock(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );

		dataTransfer.setData( 'Text', 'foo' );
		assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'Text - Text' );
		assert.areSame( 'foo', dataTransfer.getData( 'text/plain' ), 'Text - text/plain' );
		assert.areSame( 'foo', dataTransfer.getData( 'text' ), 'Text - text' );
	},

	'test set-get data, data type: text/plain, dataTransfer with event': function() {
		var evt = createDragDropEventMock(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );

		dataTransfer.setData( 'text/plain', 'foo2' );
		assert.areSame( 'foo2', dataTransfer.getData( 'Text' ), 'text/plain - text' );
		assert.areSame( 'foo2', dataTransfer.getData( 'text/plain' ), 'text/plain - text/plain' );
		assert.areSame( 'foo2', dataTransfer.getData( 'text' ), 'text/plain - text' );
	},

	'test set-get data, data type: text, dataTransfer with event': function() {
		var evt = createDragDropEventMock(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );

		dataTransfer.setData( 'text', 'foo3' );
		assert.areSame( 'foo3', dataTransfer.getData( 'Text' ), 'text - Text' );
		assert.areSame( 'foo3', dataTransfer.getData( 'text/plain' ), 'text - text/plain' );
		assert.areSame( 'foo3', dataTransfer.getData( 'text' ), 'text - text' );
	},

	'test set-get data, data type: CKE/custom, dataTransfer with event': function() {
		var evt = createDragDropEventMock(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );

		dataTransfer.setData( 'CKE/custom', 'bar' );
		assert.areSame( 'bar', dataTransfer.getData( 'cke/custom' ), 'CKE/custom - cke/custom' );
		assert.areSame( 'bar', dataTransfer.getData( 'CKE/Custom' ), 'CKE/custom - CKE/Custom' );
	},

	'test set-get data, data type: text/html, dataTransfer with event': function() {
		var evt = createDragDropEventMock(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );

		dataTransfer.setData( 'text/html', 'html' );
		assert.areSame( 'html', dataTransfer.getData( 'text/html' ), 'text/html - text/html' );
	},

	'test set-get data, undefined data, dataTransfer with event': function() {
		var evt = createDragDropEventMock(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );

		assert.areSame( '', dataTransfer.getData( 'cke/undefined' ), 'undefined' );
	},

	'test set-get data, data type: Text, dataTransfer without event': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		dataTransfer.setData( 'Text', 'foo' );
		assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'Text - Text' );
		assert.areSame( 'foo', dataTransfer.getData( 'text/plain' ), 'Text - text/plain' );
		assert.areSame( 'foo', dataTransfer.getData( 'text' ), 'Text - text' );
	},

	'test set-get data, data type: text/plain, dataTransfer without event': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		dataTransfer.setData( 'text/plain', 'foo2' );
		assert.areSame( 'foo2', dataTransfer.getData( 'Text' ), 'text/plain - text' );
		assert.areSame( 'foo2', dataTransfer.getData( 'text/plain' ), 'text/plain - text/plain' );
		assert.areSame( 'foo2', dataTransfer.getData( 'text' ), 'text/plain - text' );
	},

	'test set-get data, data type: text, dataTransfer without event': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		dataTransfer.setData( 'text', 'foo3' );
		assert.areSame( 'foo3', dataTransfer.getData( 'Text' ), 'text - Text' );
		assert.areSame( 'foo3', dataTransfer.getData( 'text/plain' ), 'text - text/plain' );
		assert.areSame( 'foo3', dataTransfer.getData( 'text' ), 'text - text' );
	},

	'test set-get data, data type: CKE/custom, dataTransfer without event': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		dataTransfer.setData( 'CKE/custom', 'bar' );
		assert.areSame( 'bar', dataTransfer.getData( 'cke/custom' ), 'CKE/custom - cke/custom' );
		assert.areSame( 'bar', dataTransfer.getData( 'CKE/Custom' ), 'CKE/custom - CKE/Custom' );
	},

	'test set-get data, data type: plain/html, dataTransfer without event': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		dataTransfer.setData( 'plain/html', 'html' );
		assert.areSame( 'html', dataTransfer.getData( 'plain/html' ), 'plain/html - plain/html' );
	},

	'test set-get data, data type: undefined data, dataTransfer without event': function() {
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();

		assert.areSame( '', dataTransfer.getData( 'cke/undefined' ), 'undefined' );
	},

	'test initDragDataTransfer binding': function() {
		var evt1 = createDragDropEventMock(),
			evt2 = createDragDropEventMock(),
			dataTransferA = CKEDITOR.plugins.clipboard.initDragDataTransfer( evt1 ),
			dataTransferB = CKEDITOR.plugins.clipboard.initDragDataTransfer( evt1 );

		assert.areSame( dataTransferA, dataTransferB, 'If we init dataTransfer object twice on the same event this should be the same object.' );

		CKEDITOR.plugins.clipboard.resetDragDataTransfer();

		dataTransferB = CKEDITOR.plugins.clipboard.initDragDataTransfer( evt2 );

		assert.areNotSame( dataTransferA, dataTransferB, 'If we init dataTransfer object twice on different events these should be different objects.' );
	},

	'test initDragDataTransfer constructor': function() {
		var bot = this.bots.editor1,
			editor = this.editors.editor1;

		bot.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );

		var evt = createDragDropEventMock(),
			dataTransfer = CKEDITOR.plugins.clipboard.initDragDataTransfer( evt, editor );
		dataTransfer.setTargetEditor( editor );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				sourceEditor: editor,
				targetEditor: editor,
				text: ( CKEDITOR.env.ie && CKEDITOR.env.version > 9 ) ? '' : 'xfoox',
				html: 'x<b>foo</b>x' },
			dataTransfer );
	},

	'test initDragDataTransfer constructor, no event': function() {
		var bot = this.bots.editor1,
			editor = this.editors.editor1;

		bot.setHtmlWithSelection( '<p>x[x<b>foo</b>x]x</p>' );

		var dataTransfer = CKEDITOR.plugins.clipboard.initDragDataTransfer( null, editor );
		dataTransfer.setTargetEditor( editor );

		this.assertDataTransfer( {
				transferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				sourceEditor: editor,
				targetEditor: editor,
				text: ( CKEDITOR.env.ie && CKEDITOR.env.version > 9 ) ? '' : 'xfoox',
				html: 'x<b>foo</b>x'	},
		dataTransfer );
	}
} );