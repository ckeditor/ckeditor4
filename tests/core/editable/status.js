/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: sourcearea */

( function() {
	'use strict';

	var editorsDefinitions = {
		framed: {
			name: 'framed'
		},
		inline: {
			name: 'inline',
			creator: 'inline'
		},
		divarea: {
			name: 'divarea',
			config: {
				extraPlugins: 'divarea'
			}
		}
	};

	CKEDITOR.disableAutoInline = true;

	bender.tools.setUpEditors( editorsDefinitions, function( editors ) {
		bender.test( bender.tools.createTestsForEditors( editors, tests ) );
	} );

	var tests = {
		// We could test this more precisely (status right after contentDom/instanceReady),
		// but we'll test nearly ideantical cases in mode switching.
		'test status after editor init': function( editor ) {
			assert.areSame( 'ready', editor.editable().status, 'status after init' );
		},

		'test status during switching mode to source': function( editor ) {
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				assert.ignore();

			var statuses = {
					dataReady: []
				},
				dataReadyListener,
				editableWysiwyg = editor.editable();

			dataReadyListener = editor.on( 'dataReady', function() {
				statuses.dataReady.push( editor.editable().status );
			} );

			editor.setMode( 'source', function() {
				var editableSource = editor.editable();

				statuses.editableSourceAfterModeReady = editableSource.status;

				dataReadyListener.removeListener();

				editor.setMode( 'wysiwyg', function() {
					resume( function() {
						assert.areSame( 'detached', statuses.editableWysiwygAfterSetMode,
							'old editable status after changing mode to source' );

						// It's already ready, because switching to sourcearea is synchronous.
						assert.areSame( 'ready', statuses.editableSourceAfterSetMode,
							'new editable status after changing mode to source' );

						assert.areSame( 'ready', statuses.editableSourceAfterModeReady,
							'source editable status after source mode is ready' );

						assert.areSame( 'ready', statuses.dataReady.join( ',' ),
							'statuses on dataReady' );
					} );
				} );
			} );

			statuses.editableWysiwygAfterSetMode = editableWysiwyg.status;
			statuses.editableSourceAfterSetMode = editor.editable().status;

			wait();
		},

		'test status during switching mode to wysiwyg': function( editor ) {
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				assert.ignore();

			var statuses = {
					beforeSetData: [],
					contentDom: [],
					setData: [],
					dataReady: []
				},
				setDataListener,
				contentDomListener,
				dataReadyListener;

			editor.setMode( 'source', function() {
				var editableSource = editor.editable();

				setDataListener = editor.on( 'setData', function() {
					statuses.setData.push( editor.editable().status );
				} );

				contentDomListener = editor.on( 'contentDom', function() {
					statuses.contentDom.push( editor.editable().status );
				} );

				dataReadyListener = editor.on( 'dataReady', function() {
					statuses.dataReady.push( editor.editable().status );
				} );

				editor.setMode( 'wysiwyg', function() {
					var editableSource = editor.editable();

					statuses.editableWysiwygAfterModeReady = editableSource.status;

					setDataListener.removeListener();
					contentDomListener.removeListener();
					dataReadyListener.removeListener();

					resume( function() {
						assert.areSame( 'detached', statuses.editableSourceAfterSetMode,
							'old editable status after changing mode to wysiwyg' );

						assert.areSame( 'ready', statuses.editableWysiwygAfterModeReady,
							'wysiwyg editable status after wysiwyg mode is ready' );

						assert.areSame( 'unloaded', statuses.setData.join( ',' ),
							'statuses on setData' );

						assert.areSame( 'ready', statuses.contentDom.join( ',' ),
							'statuses on contentDom' );

						assert.areSame( 'ready', statuses.dataReady.join( ',' ),
							'statuses on dataReady' );
					} );
				} );

				statuses.editableSourceAfterSetMode = editableSource.status;
			} );

			wait();
		},

		'test status after destroy': function( editor ) {
			var editable = editor.editable();

			editor.destroy();

			assert.areSame( 'detached', editable.status, 'status after destroy' );
		}
	};

} )();