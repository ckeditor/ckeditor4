/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,clipboard */

'use strict';

function createDnDEventMock() {
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

	'test dataTransfer id': function() {
		var evt1 = createDnDEventMock(),
			evt2 = createDnDEventMock(),
			dataTransfer1a = new CKEDITOR.plugins.clipboard.dataTransfer( evt1 ),
			dataTransfer1b = new CKEDITOR.plugins.clipboard.dataTransfer( evt1 ),
			dataTransfer2 = new CKEDITOR.plugins.clipboard.dataTransfer( evt2 );

		assert.areSame( dataTransfer1a.id, dataTransfer1b.id );

		// In IE10+ we can not use any data type besides text, so id is fixed.
		if ( !CKEDITOR.env.ie || CKEDITOR.env.version < 10 )
			assert.areNotSame( dataTransfer1a.id, dataTransfer2.id );
	},

	'test dataTransfer internal': function() {
		var bot = this.bots.editor1,
			editor = this.editors.editor1,
			evt, dataTransfer;

		bot.setHtmlWithSelection( '[<b>foo</b>]' );

		evt = createDnDEventMock();
		evt.data.$.dataTransfer.setData( 'Text', 'foo' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt, editor );
		dataTransfer.setTargetEditor( editor );

		assert.areSame( CKEDITOR.DATA_TRANSFER_INTERNAL, dataTransfer.getTransferType() );
		assert.areSame( '<b>foo</b>', dataTransfer.dataValue, 'dataValue' );
		assert.areSame( 'html', dataTransfer.dataType, 'dataType' );
		assert.areSame( editor, dataTransfer.sourceEditor, 'sourceEditor' );
		assert.areSame( editor, dataTransfer.targetEditor, 'targetEditor' );
		assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'getData( \'Text\' )' );

	},

	'test dataTransfer external text': function() {
		var editor = this.editors.editor1,
			evt, dataTransfer;

		evt = createDnDEventMock();
		evt.data.$.dataTransfer.setData( 'Text', 'foo' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );
		dataTransfer.setTargetEditor( editor );

		assert.areSame( CKEDITOR.DATA_TRANSFER_EXTERNAL, dataTransfer.getTransferType() );
		assert.areSame( 'foo', dataTransfer.dataValue, 'dataValue' );
		assert.areSame( 'text', dataTransfer.dataType, 'dataType' );
		assert.isUndefined( dataTransfer.sourceEditor, 'sourceEditor' );
		assert.areSame( editor, dataTransfer.targetEditor, 'targetEditor' );
		assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'getData( \'Text\' )' );
	},

	'test dataTransfer external html': function() {
		var editor = this.editors.editor1,
			evt, dataTransfer;

		evt = createDnDEventMock();
		evt.data.$.dataTransfer.setData( 'Text', 'foo' );
		if ( !CKEDITOR.env.ie ) {
			evt.data.$.dataTransfer.setData( 'text/html', '<b>foo</b>' );
		}

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );
		dataTransfer.setTargetEditor( editor );

		assert.areSame( CKEDITOR.DATA_TRANSFER_EXTERNAL, dataTransfer.getTransferType() );
		assert.isUndefined( dataTransfer.sourceEditor, 'sourceEditor' );
		assert.areSame( editor, dataTransfer.targetEditor, 'targetEditor' );

		if ( CKEDITOR.env.ie ) {
			assert.areSame( 'foo', dataTransfer.dataValue, 'dataValue' );
			assert.areSame( 'text', dataTransfer.dataType, 'dataType' );
			assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'getData( \'Text\' )' );
		} else {
			assert.areSame( '<b>foo</b>', dataTransfer.dataValue, 'dataValue' );
			assert.areSame( 'html', dataTransfer.dataType, 'dataType' );
			assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'getData( \'Text\' )' );
			assert.areSame( '<b>foo</b>', dataTransfer.getData( 'text/html' ), 'getData( \'text/html\' )' );
		}
	},

	'test dataTransfer cross': function() {
		var bot1 = this.bots.editor1,
			editor1 = this.editors.editor1,
			editor2 = this.editors.editor2,
			evt, dataTransfer;

		bot1.setHtmlWithSelection( '[<b>foo</b>]' );

		evt = createDnDEventMock();
		evt.data.$.dataTransfer.setData( 'Text', 'foo' );

		dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt, editor1 );
		dataTransfer.setTargetEditor( editor2 );

		assert.areSame( CKEDITOR.DATA_TRANSFER_CROSS_EDITORS, dataTransfer.getTransferType() );
		assert.areSame( '<b>foo</b>', dataTransfer.dataValue, 'dataValue' );
		assert.areSame( 'html', dataTransfer.dataType, 'dataType' );
		assert.areSame( editor1, dataTransfer.sourceEditor, 'sourceEditor' );
		assert.areSame( editor2, dataTransfer.targetEditor, 'targetEditor' );
		assert.areSame( 'foo', dataTransfer.getData( 'Text' ), 'getData( \'Text\' )' );
	},

	'test setData getData': function() {
		var evt = createDnDEventMock(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt );

		dataTransfer.setData( 'Text', 'foo' );

		assert.areSame( 'foo', dataTransfer.getData( 'Text' ) );

	},

	'test initDataTransfer binding': function() {
		var evt1 = createDnDEventMock(),
			evt2 = createDnDEventMock(),
			dataTransferA = CKEDITOR.plugins.clipboard.initDataTransfer( evt1 ),
			dataTransferB = CKEDITOR.plugins.clipboard.initDataTransfer( evt1 );

		assert.areSame( dataTransferA, dataTransferB );

		CKEDITOR.plugins.clipboard.resetDataTransfer();

		dataTransferB = CKEDITOR.plugins.clipboard.initDataTransfer( evt2 );

		assert.areNotSame( dataTransferA, dataTransferB );

		CKEDITOR.plugins.clipboard.resetDataTransfer();
	},

	'test initDataTransfer constructor': function() {
		var bot = this.bots.editor1,
			editor = this.editors.editor1;

		bot.setHtmlWithSelection( '[<b>foo</b>]' );

		var evt = createDnDEventMock(),
			dataTransfer = CKEDITOR.plugins.clipboard.initDataTransfer( evt, editor );
		dataTransfer.setTargetEditor( editor );

		assert.areSame( CKEDITOR.DATA_TRANSFER_INTERNAL, dataTransfer.getTransferType() );
		assert.areSame( '<b>foo</b>', dataTransfer.dataValue, 'dataValue' );
		assert.areSame( 'html', dataTransfer.dataType, 'dataType' );
		assert.areSame( editor, dataTransfer.sourceEditor, 'sourceEditor' );
		assert.areSame( editor, dataTransfer.targetEditor, 'targetEditor' );

		CKEDITOR.plugins.clipboard.resetDataTransfer();
	}
} );