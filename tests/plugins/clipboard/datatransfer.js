/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,clipboard */

'use strict';

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
					},
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

		bot.setHtmlWithSelection( '[x<b>foo</b>x]' );

		evt = createDragDropEventMock();
		evt.data.$.dataTransfer.setData( 'Text', 'foo' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt, editor );
		dataTransfer.setTargetEditor( editor );

		assert.areSame( CKEDITOR.DATA_TRANSFER_INTERNAL, dataTransfer.getTransferType(), 'transferType' );
		assert.areSame( 'x<b>foo</b>x', bender.tools.fixHtml( dataTransfer.dataValue ), 'dataValue' );
		assert.areSame( 'html', dataTransfer.dataType, 'dataType' );
		assert.areSame( editor, dataTransfer.sourceEditor, 'sourceEditor' );
		assert.areSame( editor, dataTransfer.targetEditor, 'targetEditor' );
		assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'getData( \'Text\' )' );

	},

	'test drop text from external source': function() {
		var editor = this.editors.editor1,
			evt, dataTransfer;

		evt = createDragDropEventMock();
		evt.data.$.dataTransfer.setData( 'Text', 'x<b>foo</b>x' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );
		dataTransfer.setTargetEditor( editor );

		assert.areSame( CKEDITOR.DATA_TRANSFER_EXTERNAL, dataTransfer.getTransferType(), 'transferType' );
		assert.areSame( 'x&lt;b&gt;foo&lt;/b&gt;x', dataTransfer.dataValue, 'dataValue' );
		assert.areSame( 'text', dataTransfer.dataType, 'dataType' );
		assert.isUndefined( dataTransfer.sourceEditor, 'sourceEditor' );
		assert.areSame( editor, dataTransfer.targetEditor, 'targetEditor' );
		assert.areSame( 'x<b>foo</b>x', dataTransfer.getData( 'Text' ), 'getData( \'Text\' )' );
	},

	'test drop html from external source': function() {
		var editor = this.editors.editor1,
			evt, dataTransfer;

		evt = createDragDropEventMock();
		evt.data.$.dataTransfer.setData( 'Text', 'foo' );
		if ( !CKEDITOR.env.ie ) {
			evt.data.$.dataTransfer.setData( 'text/html', 'x<b>foo</b>x' );
		}

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );
		dataTransfer.setTargetEditor( editor );

		assert.areSame( CKEDITOR.DATA_TRANSFER_EXTERNAL, dataTransfer.getTransferType(), 'transferType' );
		assert.isUndefined( dataTransfer.sourceEditor, 'sourceEditor' );
		assert.areSame( editor, dataTransfer.targetEditor, 'targetEditor' );

		if ( CKEDITOR.env.ie ) {
			assert.areSame( 'foo', dataTransfer.dataValue, 'dataValue' );
			assert.areSame( 'text', dataTransfer.dataType, 'dataType' );
			assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'getData( \'Text\' )' );
		} else {
			assert.areSame( 'x<b>foo</b>x', dataTransfer.dataValue, 'dataValue' );
			assert.areSame( 'html', dataTransfer.dataType, 'dataType' );
			assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'getData( \'Text\' )' );
			assert.areSame( 'x<b>foo</b>x', dataTransfer.getData( 'text/html' ), 'getData( \'text/html\' )' );
		}
	},

	'test drag drop between editors': function() {
		var bot1 = this.bots.editor1,
			editor1 = this.editors.editor1,
			editor2 = this.editors.editor2,
			evt, dataTransfer;

		bot1.setHtmlWithSelection( '[x<b>foo</b>x]' );

		evt = createDragDropEventMock();
		evt.data.$.dataTransfer.setData( 'Text', 'foo' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt, editor1 );
		dataTransfer.setTargetEditor( editor2 );

		assert.areSame( CKEDITOR.DATA_TRANSFER_CROSS_EDITORS, dataTransfer.getTransferType(), 'transferType' );
		assert.areSame( 'x<b>foo</b>x', bender.tools.fixHtml( dataTransfer.dataValue ), 'dataValue' );
		assert.areSame( 'html', dataTransfer.dataType, 'dataType' );
		assert.areSame( editor1, dataTransfer.sourceEditor, 'sourceEditor' );
		assert.areSame( editor2, dataTransfer.targetEditor, 'targetEditor' );
		assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'getData( \'Text\' )' );
	},

	'test setData getData': function() {
		var evt = createDragDropEventMock(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );

		dataTransfer.setData( 'Text', 'foo' );

		assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'data should match set data' );

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

		bot.setHtmlWithSelection( '[x<b>foo</b>x]' );

		var evt = createDragDropEventMock(),
			dataTransfer = CKEDITOR.plugins.clipboard.initDragDataTransfer( evt, editor );
		dataTransfer.setTargetEditor( editor );

		assert.areSame( CKEDITOR.DATA_TRANSFER_INTERNAL, dataTransfer.getTransferType(), 'transferType' );
		assert.areSame( 'x<b>foo</b>x', bender.tools.fixHtml( dataTransfer.dataValue ), 'dataValue' );
		assert.areSame( 'html', dataTransfer.dataType, 'dataType' );
		assert.areSame( editor, dataTransfer.sourceEditor, 'sourceEditor' );
		assert.areSame( editor, dataTransfer.targetEditor, 'targetEditor' );
		assert.isTrue( dataTransfer.isDrag, 'isDrag' );
	}
} );