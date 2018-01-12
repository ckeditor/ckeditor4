/* bender-tags: editor,clipboard,widget */
/* bender-ckeditor-plugins: easyimage,toolbar, */
/* bender-include: %BASE_PATH%/plugins/clipboard/_helpers/pasting.js */
/* global pasteFiles */

( function() {
	'use strict';

	var tests,
		commonConfig = {
			// Disable pasteFilter on Webkits (pasteFilter defaults semantic-text on Webkits).
			pasteFilter: null
		};

	bender.editors = {
		classic: {
			name: 'classic',
			config: commonConfig
		},
		divarea: {
			name: 'divarea',
			config: CKEDITOR.tools.extend( { extraPlugins: 'divarea' }, commonConfig )
		},
		inline: {
			name: 'inline',
			creator: 'inline',
			config: commonConfig
		}
	};

	tests = {
		setUp: function() {
			if ( !CKEDITOR.plugins.clipboard.isFileApiSupported ) {
				assert.ignore();
			}

			this.createSpy = sinon.spy( URL, 'createObjectURL' );
			this.revokeSpy = sinon.spy( URL, 'revokeObjectURL' );
			this.uploadStub = sinon.stub( CKEDITOR.plugins.cloudservices.cloudServicesLoader.prototype, 'upload' );
		},

		tearDown: function() {
			this.createSpy.restore();
			this.revokeSpy.restore();
			this.uploadStub.restore();
		},

		'test objectURL management during successful image upload': function( editor, bot ) {
			resetEditor( editor );

			pasteFiles( editor, [ bender.tools.getTestPngFile( 'test1.png' ) ] );

			var tc = bot.testCase,
				uploadWidget = getWidgetByName( editor.widgets.instances, 'uploadeasyimage' ),
				loader = editor.uploadRepository.loaders[ 0 ];

			loader.data = bender.tools.pngBase64;

			assert.areSame( 0, tc.createSpy.callCount );
			assert.areSame( 0, tc.revokeSpy.callCount );

			uploadWidget.onUploading( loader );

			assert.areSame( 1, tc.createSpy.callCount );

			uploadWidget.onUploading( loader );
			uploadWidget.onUploading( loader );

			assert.areSame( 1, tc.createSpy.callCount );

			mockResponse( loader );
			uploadWidget.onUploaded( loader );

			wait( function() {
				assert.areSame( 1, tc.createSpy.callCount );
				assert.areSame( 1, tc.revokeSpy.callCount );
			}, 10 );
		},

		'test objectURL management during aborted image upload': function( editor, bot ) {
			resetEditor( editor );

			pasteFiles( editor, [ bender.tools.getTestPngFile( 'test2.png' ) ] );

			var tc = bot.testCase,
				uploadWidget = getWidgetByName( editor.widgets.instances, 'uploadeasyimage' ),
				loader = editor.uploadRepository.loaders[ 0 ];

			loader.data = bender.tools.pngBase64;

			assert.areSame( 0, tc.createSpy.callCount );
			assert.areSame( 0, tc.revokeSpy.callCount );

			uploadWidget.onUploading( loader );

			assert.areSame( 1, tc.createSpy.callCount );

			uploadWidget.onAbort( loader );

			wait( function() {
				assert.areSame( 1, tc.createSpy.callCount );
				assert.areSame( 1, tc.revokeSpy.callCount );
			}, 10 );
		},

		'test objectURL management during canceled image upload': function( editor, bot ) {
			resetEditor( editor );

			pasteFiles( editor, [ bender.tools.getTestPngFile( 'test3.png' ) ] );

			var tc = bot.testCase,
				uploadWidget = getWidgetByName( editor.widgets.instances, 'uploadeasyimage' ),
				loader = editor.uploadRepository.loaders[ 0 ];

			loader.data = bender.tools.pngBase64;

			assert.areSame( 0, tc.createSpy.callCount );
			assert.areSame( 0, tc.revokeSpy.callCount );

			uploadWidget.onUploading( loader );

			assert.areSame( 1, tc.createSpy.callCount );

			uploadWidget.onCancel( loader );

			wait( function() {
				assert.areSame( 1, tc.createSpy.callCount );
				assert.areSame( 1, tc.revokeSpy.callCount );
			}, 10 );
		},

		'test objectURL is set as image src only once': function( editor ) {
			resetEditor( editor );

			pasteFiles( editor, [ bender.tools.getTestPngFile( 'test4.png' ) ] );

			var uploadWidget = getWidgetByName( editor.widgets.instances, 'uploadeasyimage' ),
				loader = editor.uploadRepository.loaders[ 0 ],
				setAttributeSpy = sinon.spy( uploadWidget.parts.img, 'setAttribute' );

			loader.data = bender.tools.pngBase64;

			assert.areSame( 0, setAttributeSpy.callCount );

			uploadWidget.onUploading( loader );
			uploadWidget.onUploading( loader );
			uploadWidget.onUploading( loader );

			assert.areSame( 1, setAttributeSpy.callCount );

			setAttributeSpy.restore();
		},

		'test objectURL management during many images upload': function( editor, bot ) {
			resetEditor( editor );

			var file1 = bender.tools.getTestPngFile( 'test5-1.png' ),
				file2 = bender.tools.getTestPngFile( 'test5-2.png' ),
				file3 = bender.tools.getTestPngFile( 'test5-3.png' );

			pasteFiles( editor, [ file1, file2, file3 ] );

			var tc = bot.testCase,
				uploadWidget = getWidgetByName( editor.widgets.instances, 'uploadeasyimage' ),
				loader1 = editor.uploadRepository.loaders[ 0 ],
				loader2 = editor.uploadRepository.loaders[ 1 ],
				loader3 = editor.uploadRepository.loaders[ 2 ];

			loader1.data = bender.tools.pngBase64;
			loader2.data = bender.tools.pngBase64;
			loader3.data = bender.tools.pngBase64;

			assert.areSame( 0, tc.createSpy.callCount );
			assert.areSame( 0, tc.revokeSpy.callCount );

			uploadWidget.onUploading( loader1 );
			uploadWidget.onUploading( loader2 );
			uploadWidget.onUploading( loader2 );
			uploadWidget.onUploading( loader3 );

			assert.areSame( 3, tc.createSpy.callCount );
			assert.isTrue( tc.createSpy.calledWith( file1 ) );
			assert.isTrue( tc.createSpy.calledWith( file2 ) );
			assert.isTrue( tc.createSpy.calledWith( file3 ) );

			mockResponse( loader2 );
			uploadWidget.onCancel( loader1 );
			uploadWidget.onUploaded( loader2 );
			uploadWidget.onAbort( loader3 );

			wait( function() {
				assert.areSame( 3, tc.createSpy.callCount );
				assert.areSame( 3, tc.revokeSpy.callCount );

				assert.isTrue( tc.revokeSpy.calledWith( tc.createSpy.firstCall.returnValue ) );
				assert.isTrue( tc.revokeSpy.calledWith( tc.createSpy.secondCall.returnValue ) );
				assert.isTrue( tc.revokeSpy.calledWith( tc.createSpy.thirdCall.returnValue ) );
			}, 10 );
		}
	};

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );

	function getWidgetByName( widgets, name ) {
		var tools = CKEDITOR.tools,
			array = tools.array,
			widgetsArr = array.map( tools.objectKeys( widgets ), function( val ) {
				return widgets[ val ];
			} );

		return array.filter( widgetsArr, function( val ) {
			return val.name === name;
		} ).pop();
	}

	function mockResponse( loader ) {
		loader.responseData = {
			response: {
				'default': '%BASE_PATH%_assets/logo.png'
			}
		};
	}

	function resetEditor( editor ) {
		editor.widgets.destroyAll();
		editor.uploadRepository.loaders = [];
	}
} )();
