/* bender-tags: editor,colorbutton,1795 */
/* bender-ckeditor-plugins: colorbutton,undo,toolbar,wysiwygarea */
/* bender-include: _helpers/tools.js */
/* global colorHistoryTools */

( function() {
	'use strict';

	bender.test( {
		'test ariasetsize is correct (automatic: 0, morecolors: 0, history: empty)': function() {
			testAriaAttributes(
				{ first: 1, last: 24, total: 24 },
				'<p>Foobar</p>',
				{ colorButton_enableAutomatic: false }
			);
		},

		'test ariasetsize is correct (automatic: 0, morecolors: 0, history: 1 color)': function() {
			testAriaAttributes(
				{ first: 1, last: 24, total: 25 },
				'<p><span style="color:red;background-color:yellow;">Foobar</span></p>',
				{ colorButton_enableAutomatic: false }
			);
		},

		'test ariasetsize is correct (automatic: 0, morecolors: 1, history: empty)': function() {
			testAriaAttributes(
				{ first: 1, last: 24, total: 25 },
				'<p>Foobar</p>',
				{
					extraPlugins: 'colordialog',
					colorButton_enableAutomatic: false
				}
			);
		},

		'test ariasetsize is correct (automatic: 0, morecolors: 1, history: 1 color)': function() {
			testAriaAttributes(
				{ first: 1, last: 24, total: 26 },
				'<p><span style="color:red;background-color:yellow;">Foobar</span></p>',
				{
					extraPlugins: 'colordialog',
					colorButton_enableAutomatic: false
				}
			);
		},

		'test ariasetsize is correct (automatic: 1, morecolors: 0, history: empty)': function() {
			testAriaAttributes(
				{ first: 2, last: 25, total: 25 },
				'<p>Foobar</p>'
			);
		},

		'test ariasetsize is correct (automatic: 1, morecolors: 0, history: 1 color)': function() {
			testAriaAttributes(
				{ first: 2, last: 25, total: 26 },
				'<p><span style="color:red;background-color:yellow;">Foobar</span></p>'
			);
		},

		'test ariasetsize is correct (automatic: 1, morecolors: 1, history: empty)': function() {
			testAriaAttributes(
				{ first: 2, last: 25, total: 26 },
				'<p>Foobar</p>',
				{ extraPlugins: 'colordialog' }
			);
		},

		'test ariasetsize is correct (automatic: 1, morecolors: 1, history: 1 color)': function() {
			testAriaAttributes(
				{ first: 2, last: 25, total: 27 },
				'<p><span style="color:red;background-color:yellow;">Foobar</span></p>',
				{ extraPlugins: 'colordialog' }
			);
		}
	} );

	function testAriaAttributes( data, startupData, config ) {
		config = config || {};

		bender.editorBot.create( {
			name: 'editor' + Date.now(),
			startupData: startupData,
			config: config
		}, function( bot ) {
			var editor = bot.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' ),
				firstColorBox,
				lastColorBox;

			txtColorBtn.click( editor );

			firstColorBox = colorHistoryTools.findInPanel( '[data-value]', txtColorBtn );
			lastColorBox = colorHistoryTools.findInPanel( '[data-value="000"]', txtColorBtn );

			assert.areEqual( '1ABC9C', firstColorBox.getAttribute( 'data-value' ), 'Order is incorrect (txt panel).' );
			assert.areEqual( data.first, firstColorBox.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect (txt panel).' );
			assert.areEqual( data.total, firstColorBox.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect (txt panel).' );

			assert.areEqual( '000', lastColorBox.getAttribute( 'data-value' ), 'Order is incorrect (txt panel).' );
			assert.areEqual( data.last, lastColorBox.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect (txt panel).' );
			assert.areEqual( data.total, lastColorBox.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect (txt panel).' );

			bgColorBtn.click( editor );

			firstColorBox = colorHistoryTools.findInPanel( '[data-value]', bgColorBtn );
			lastColorBox = colorHistoryTools.findInPanel( '[data-value="000"]', bgColorBtn );

			assert.areEqual( '1ABC9C', firstColorBox.getAttribute( 'data-value' ), 'Order is incorrect (bg panel).' );
			assert.areEqual( data.first, firstColorBox.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect (bg panel).' );
			assert.areEqual( data.total, firstColorBox.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect (bg panel).' );

			assert.areEqual( '000', lastColorBox.getAttribute( 'data-value' ), 'Order is incorrect (bg panel).' );
			assert.areEqual( data.last, lastColorBox.getAttribute( 'aria-posinset' ), 'Aria-posinset is incorrect (bg panel).' );
			assert.areEqual( data.total, lastColorBox.getAttribute( 'aria-setsize' ), 'Aria-setsize is incorrect (bg panel).' );
		} );
	}
} )();
