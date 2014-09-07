/* bender-ckeditor-plugins: undo */

( function() {
	'use strict';

	var editor = {
			config: {
				undoStackSize: 20
			}
		},
		um,
		UNDO = true,
		REDO = false;

	bender.test( {
		setUp: function() {
			um = new CKEDITOR.plugins.undo.UndoManager( editor );
		},

		'test getNextImage: no snapshots': function() {
			um.snapshots = [];
			um.index = -1;
			um.currentImage = {
				equalsContent: function() { return true; }
			};

			assert.isNull( um.getNextImage( REDO ) );
			assert.isNull( um.getNextImage( UNDO ) );
		},

		'test getNextImage: one snapshot ahead for -1 index': function() {
			um.snapshots = [ {} ];
			um.index = -1;

			um.currentImage = {
				equalsContent: function() { return false; }
			};
			assert.isNull( um.getNextImage( UNDO ) );
			assert.areSame( um.snapshots[ 0 ], um.getNextImage( REDO ) );

			um.currentImage = {
				equalsContent: function() { return true; }
			};
			assert.isNull( um.getNextImage( UNDO ) );
			assert.isNull( um.getNextImage( REDO ) );
		},

		'test getNextImage: no snapshot ahead for index 0': function() {
			um.snapshots = [ {} ];
			um.index = 0;

			um.currentImage = {
				equalsContent: function() { return false; }
			};
			// Assert below is a bit confusing, but there shouldn't be such situation.
			// assert.areSame( um.snapshots[ 0 ], um.getNextImage( UNDO ) );
			assert.isNull( um.getNextImage( REDO ) );

			um.currentImage = {
				equalsContent: function() { return true; }
			};
			assert.isNull( um.getNextImage( UNDO ) );
			assert.isNull( um.getNextImage( REDO ) );
		},

		'test getNextImage: omit snapshots with same content': function() {
			um.snapshots = [ { equals: false }, { equals: true }, { equals: false }, { equals: true } ];
			um.index = 0;

			um.currentImage = {
				equalsContent: function ( img ) { return img.equals; }
			};
			assert.isNull( um.getNextImage( UNDO ) );
			assert.areSame( um.snapshots[ 2 ], um.getNextImage( REDO ) );
		},

		'test getNextImage: omit snapshots with same content backward': function() {
			um.snapshots = [ { equals: false }, { equals: true }, { equals: false }, { equals: true } ];
			um.index = 2;

			um.currentImage = {
				equalsContent: function ( img ) { return img.equals; }
			};

			// Assert below is a bit confusing, but there shouldn't be such situation.
			// assert.areSame( um.snapshots[ 2 ], um.getNextImage( UNDO ) );
			assert.isNull( um.getNextImage( REDO ) );
		}
	} );
} )();