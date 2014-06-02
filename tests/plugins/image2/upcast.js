/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: image2,toolbar */

( function() {
	'use strict';

	var obj2Array = widgetTestsTools.obj2Array,
		config = {
			autoParagraph: false,
			extraAllowedContent: 'img[id]; p div{text-align}'
		}, editorBots;

	function assertUpcast( config, callback ) {
		var bot = editorBots[ config.name ];

		bot.setData( config.data, function() {
			callback( bot.editor );
		} );
	}

	bender.test( {
		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( {
				enterP: {
					name: 'enterP',
					config: config
				},
				enterBR: {
					name: 'enterBR',
					config: CKEDITOR.tools.extend( {}, config, {
						enterMode: CKEDITOR.ENTER_BR
					} )
				}
			}, function( editors, bots ) {
				editorBots = bots;
				that.callback( editors );
			} );
		},

		'test upcast: ENTER_P, non-captioned, centered->P{text-align}': function() {
			assertUpcast( {
				name: 'enterP',
				data: '<p style="text-align:center">' +
					'<img id="w1" src="_assets/foo.png" alt="foo" />' +
				'</p>',
			}, function( editor ) {
				var instances = obj2Array( editor.widgets.instances ),
					widget = instances[ 0 ];

				assert.areSame( 1, instances.length, 'A single widget has been initialized' );
				assert.areSame( 'center', widget.data.align, 'Centering with P is default in ENTER_P' );
			} );
		},

		'test upcast: ENTER_P, non-captioned, centered->P{text-align}, siblings': function() {
			assertUpcast( {
				name: 'enterP',
				data: '<p style="text-align:center">' +
					'<span>sibling</span>' +
					'<img id="w1" src="_assets/foo.png" alt="foo" />' +
				'</p>',
			}, function( editor ) {
				var instances = obj2Array( editor.widgets.instances ),
					widget = instances[ 0 ];

				assert.areSame( 1, instances.length, 'A single widget has been initialized' );
				assert.areSame( 'none', widget.data.align, 'Centering with P not possible if has siblings' );
			} );
		},

		// #11283
		'test upcast: ENTER_P, non-captioned, centered->DIV{text-align}': function() {
			assertUpcast( {
				name: 'enterP',
				data: '<div style="text-align:center">' +
					'<img id="w1" src="_assets/foo.png" alt="foo" />' +
				'</div>',
			}, function( editor ) {
				var instances = obj2Array( editor.widgets.instances ),
					widget = instances[ 0 ];

				assert.areSame( 1, instances.length, 'A single widget has been initialized' );
				assert.areSame( 'none', widget.data.align, 'Centering with DIV not possible in ENTER_P' );
			} );
		},

		// #11283
		'test upcast: ENTER_BR, non-captioned, centered->DIV{text-align}': function() {
			assertUpcast( {
				name: 'enterBR',
				data: '<div style="text-align:center">' +
					'<img id="w1" src="_assets/foo.png" alt="foo" />' +
				'</div>',
			}, function( editor ) {
				var instances = obj2Array( editor.widgets.instances ),
					widget = instances[ 0 ];

				assert.areSame( 1, instances.length, 'A single widget has been initialized' );
				assert.areSame( 'center', widget.data.align, 'Centering with DIV allowed in modes different than ENTER_P' );
			} );
		},

		// #11283
		'test upcast: ENTER_BR, non-captioned, centered->DIV{text-align}, siblings': function() {
			assertUpcast( {
				name: 'enterBR',
				data: '<div style="text-align:center">' +
					'sibling' +
					'<img id="w1" src="_assets/foo.png" alt="foo" />' +
				'</div>',
			}, function( editor ) {
				var instances = obj2Array( editor.widgets.instances ),
					widget = instances[ 0 ];

				assert.areSame( 1, instances.length, 'A single widget has been initialized' );
				assert.areSame( 'none', widget.data.align, 'Centering with DIV not possible if has siblings' );
			} );
		}
	} );
} )();