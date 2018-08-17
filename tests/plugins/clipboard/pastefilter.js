/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,clipboard,pastetext */
/* bender-include: _helpers/pasting.js */
/* global assertPasteEvent */

( function() {
	'use strict';

	bender.editors = {
		editorNoConfiguration: {
			name: 'editorNoConfiguration',
			config: {
				allowedContent: true
			}
		},

		editorForcePAPT: {
			name: 'editorForcePAPT',
			config: {
				forcePasteAsPlainText: true
			}
		},

		editorPlain: {
			name: 'editorPlain',
			config: {
				pasteFilter: 'plain-text',
				allowedContent: true
			}
		},

		editorSemantic: {
			name: 'editorSemantic',
			config: {
				pasteFilter: 'semantic-content',
				allowedContent: true
			}
		},

		editorCustom: {
			name: 'editorCustom',
			config: {
				pasteFilter: 'p h1 h2 span',
				allowedContent: true
			}
		},

		editorCustomObject: {
			name: 'editorCustomObject',
			config: {
				pasteFilter: {
					p: true,
					h3: true
				},
				allowedContent: true
			}
		},

		editorSemanticPAPT: {
			name: 'editorSemanticPAPT',
			config: {
				pasteFilter: 'semantic-content',
				forcePasteAsPlainText: true,
				allowedContent: true
			}
		},

		editorModifyInstance: {
			name: 'editorModifyInstance',
			config: {
				pasteFilter: 'h2',
				allowedContent: true
			}
		},

		editorDisabledFilter: {
			name: 'editorDisabledFilter',
			config: {
				allowedContent: true,
				pasteFilter: null
			}
		}
	};

	var contents = {
		listWithSpan: '<ul><li>he<span>fkdjfkdj</span>llo</li><li>moto</li></ul>',
		various: '<div><h1>Header 1</h1><h3>Header <span>3</span></h3><p>Heeey</p></div>',
		classyAndStylish: '<h1 id="foo" class="ugly" style="background-color: red;">I am so classy and stylish :)</h1>'
	};

	var tests = {};

	tests.setUp = function() {
		CKEDITOR.plugins.clipboard.resetDragDataTransfer();
	};

	function curryCreateTest( tests ) {
		return function( testName, editorName, pastedContent, expectedContent ) {
			tests[ testName ] = function() {
				var editor = this.editors[ editorName ];

				assertPasteEvent( editor, { dataValue: pastedContent },
					{ dataValue: expectedContent }, 'filtered data' );
			};
		};
	}

	function mockDataTransfer( type ) {
		return {
			getTransferType: function() {
				return type;
			},

			getData: function() {
				return '';
			}
		};
	}

	var createTest = curryCreateTest( tests );

	tests[ 'editor no configuration' ] = function() {
		var editor = this.editors.editorNoConfiguration;

		if ( CKEDITOR.env.webkit ) {
			assert.isInstanceOf( CKEDITOR.filter, editor.pasteFilter );
			// Besides checking if semantic filter was created,
			// we also check here whether the filters factory don't caches filters well.
			assert.areNotSame( this.editors.editorSemantic.pasteFilter, editor.pasteFilter );
		} else {
			assert.isNull( editor.pasteFilter );
		}
	};

	tests[ 'editor pasteFilter set to null' ] = function() {
		var editor = this.editors.editorDisabledFilter;

		assert.isNull( editor.pasteFilter );

		assertPasteEvent( editor, { dataValue: '<h2 style="color: red">Foo</h2>' },
			{ dataValue: '<h2 style="color: red">Foo</h2>' } );
	};

	tests[ 'editor has pasteFilter defined if forcePasteAsPlainText is set to true' ] = function() {
		var editor = this.editors.editorForcePAPT,
			pasteFilter = editor.pasteFilter;

		assert.isInstanceOf( CKEDITOR.filter, pasteFilter );
	};

	tests[ 'editor has pasteFilter defined if pasteFilter is set to plain-text' ] = function() {
		var editor = this.editors.editorPlain,
			pasteFilter = editor.pasteFilter;

		assert.isInstanceOf( CKEDITOR.filter, pasteFilter );
	};

	tests[ 'unique content filter is created for each editor instance' ] = function() {
		var forcePAPTFilter = this.editors.editorForcePAPT.pasteFilter,
			plainFilter = this.editors.editorPlain.pasteFilter;

		assert.areNotSame( forcePAPTFilter, plainFilter );
	};

	tests[ 'allow to modify editor.pasteFilter on the fly' ] = function() {
		var editor = this.editors.editorModifyInstance,
			pasteFilter = editor.pasteFilter;

		assertPasteEvent( editor, { dataValue: '<h2>Foo</h2>' },
			{ dataValue: '<h2>Foo</h2>' }, 'initial filter' );

		pasteFilter.disallow( 'h2' );

		assertPasteEvent( editor, { dataValue: '<h2>Foo</h2>' },
			{ dataValue: '<p>Foo</p>' }, 'modified filter' );
	};

	tests[ 'allow to remove and create editor.pasteFilter on the fly' ] = function() {
		var editor = this.editors.editorModifyInstance;

		delete editor.pasteFilter;

		assertPasteEvent( editor, { dataValue: '<h2>Foo <strong>bar</strong></h2>' },
			{ dataValue: '<h2>Foo <strong>bar</strong></h2>' }, 'no filter' );

		editor.pasteFilter = new CKEDITOR.filter( 'p strong' );

		assertPasteEvent( editor, { dataValue: '<h2>Foo <strong>bar</strong></h2>' },
			{ dataValue: '<p>Foo <strong>bar</strong></p>' }, 'new filter' );
	};

	tests[ 'test content is filtered even if config.pasteFilter is undefined' ] = function() {
		var editor = this.editors.editorNoConfiguration;

		assert.isFalse( !!editor.config.pasteFilter, 'config was not set' );

		editor.pasteFilter = new CKEDITOR.filter( 'p h2' );

		try {
			assertPasteEvent( editor, { dataValue: '<h2>Foo <strong>bar</strong></h2>' },
				{ dataValue: '<h2>Foo bar</h2>' }, 'new filter' );
		} catch ( e ) {
			throw e;
		} finally {
			delete editor.pasteFilter; // Tear down properly.
		}
	};

	tests[ 'internal paste is not filtered' ] = function() {
		var editor = this.editors.editorPlain;

		assertPasteEvent( editor, { dataValue: '<h2>Foo <strong>bar</strong></h2>', dataTransfer: mockDataTransfer( CKEDITOR.DATA_TRANSFER_INTERNAL ) },
			{ dataValue: '<h2>Foo <strong>bar</strong></h2>' } );
	};

	tests[ 'cross-editors paste is not filtered' ] = function() {
		var editor = this.editors.editorPlain;

		assertPasteEvent( editor, { dataValue: '<h2>Foo <strong>bar</strong></h2>', dataTransfer: mockDataTransfer( CKEDITOR.DATA_TRANSFER_CROSS_EDITORS ) },
			{ dataValue: '<h2>Foo <strong>bar</strong></h2>' } );
	};

	tests[ 'internal paste is filtered for forceAsPlainText' ] = function() {
		var editor = this.editors.editorForcePAPT;

		assertPasteEvent( editor, { dataValue: '<h2>Foo <strong>bar</strong></h2>', dataTransfer: mockDataTransfer( CKEDITOR.DATA_TRANSFER_INTERNAL ) },
			{ dataValue: '<p>Foo bar</p>' } );
	};

	tests[ 'cross-editors paste is filtered for forceAsPlainText' ] = function() {
		var editor = this.editors.editorForcePAPT;

		assertPasteEvent( editor, { dataValue: '<h2>Foo <strong>bar</strong></h2>', dataTransfer: mockDataTransfer( CKEDITOR.DATA_TRANSFER_CROSS_EDITORS ) },
			{ dataValue: '<p>Foo bar</p>' } );
	};

	tests[ 'external paste is filtered' ] = function() {
		var editor = this.editors.editorPlain;

		assertPasteEvent( editor, { dataValue: '<h2>Foo <strong>bar</strong></h2>', dataTransfer: mockDataTransfer( CKEDITOR.DATA_TRANSFER_EXTERNAL ) },
			{ dataValue: '<p>Foo bar</p>' } );
	};

	tests[ 'evt.data.dontFilter disables paste filter' ] = function() {
		var editor = this.editors.editorPlain;

		assertPasteEvent( editor, { dataValue: '<h2>Foo <strong>bar</strong></h2>', dontFilter: true },
			{ dataValue: '<h2>Foo <strong>bar</strong></h2>', dontFilter: true } );
	};

	tests[ 'evt.data.dontFilter does not disable the paste filter when forcePAPT is true' ] = function() {
		var editor = this.editors.editorForcePAPT;

		// Important: forcePAPT is implemented on #beforePaste and the below function does not fire this event.
		// Therefore we're passing type:text explicitly.
		assertPasteEvent( editor, { dataValue: '<h2>Foo <strong>bar</strong></h2>', dontFilter: true, type: 'text' },
			{ dataValue: '<p>Foo bar</p>', dontFilter: true } );
	};

	createTest(
		'test plain', 'editorPlain', contents.listWithSpan,
		'<p>hefkdjfkdjllo</p><p>moto</p>'
	);

	createTest(
		'test forcePasteAsPlainText', 'editorForcePAPT', contents.listWithSpan,
		'<p>hefkdjfkdjllo</p><p>moto</p>'
	);

	createTest(
		'test semantic', 'editorSemantic', contents.listWithSpan,
		'<ul><li>hefkdjfkdjllo</li><li>moto</li></ul>'
	);

	createTest(
		'test custom', 'editorCustom', contents.various,
		'<h1>Header 1</h1><p>Header <span>3</span></p><p>Heeey</p>'
	);

	createTest(
		'test custom object', 'editorCustomObject', contents.various,
		'<p>Header 1</p><h3>Header 3</h3><p>Heeey</p>'
	);

	createTest(
		'test semantic with forcePasteAsPlainText (forcePAPT has precedence)', 'editorSemanticPAPT', contents.various,
		'<p>Header 1</p><p>Header 3</p><p>Heeey</p>'
	);

	createTest(
		'test semantic removes styles and classes but keeps attrs', 'editorSemantic', contents.classyAndStylish,
		'<h1 id="foo">I am so classy and stylish :)</h1>'
	);

	createTest(
		'test semantic removes divs, spans', 'editorSemantic',
		'<div>x<span>y</span>z</div>',
		'<p>xyz</p>'
	);

	bender.test( tests );
}() );
