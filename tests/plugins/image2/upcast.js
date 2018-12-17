/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: image2,toolbar */

( function() {
	'use strict';

	var objToArray = bender.tools.objToArray;

	function assertUpcast( config, callback ) {
		var bot = bender.editorBots[ config.name ];

		bot.setData( config.data, function() {
			callback( bot.editor );
		} );
	}

	bender.editors = {
		enterP: {
			name: 'enterP'
		},
		enterBR: {
			name: 'enterBR',
			config: {
				enterMode: CKEDITOR.ENTER_BR
			}
		}
	};

	bender.editorsConfig = {
		autoParagraph: false,
		extraAllowedContent: 'img[id]; p div{text-align}'
	};

	bender.test( {
		'test upcast: ENTER_P, non-captioned, centered->P{text-align}': function() {
			assertUpcast( {
				name: 'enterP',
				data: '<p style="text-align:center">' +
						'<img id="w1" src="_assets/foo.png" alt="foo" />' +
					'</p>'
			}, function( editor ) {
				var instances = objToArray( editor.widgets.instances ),
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
					'</p>'
			}, function( editor ) {
				var instances = objToArray( editor.widgets.instances ),
					widget = instances[ 0 ];

				assert.areSame( 1, instances.length, 'A single widget has been initialized' );
				assert.areSame( 'none', widget.data.align, 'Centering with P not possible if has siblings' );
			} );
		},

		// https://dev.ckeditor.com/ticket/11283
		'test upcast: ENTER_P, non-captioned, centered->DIV{text-align}': function() {
			assertUpcast( {
				name: 'enterP',
				data: '<div style="text-align:center">' +
						'<img id="w1" src="_assets/foo.png" alt="foo" />' +
					'</div>'
			}, function( editor ) {
				var instances = objToArray( editor.widgets.instances ),
					widget = instances[ 0 ];

				assert.areSame( 1, instances.length, 'A single widget has been initialized' );
				assert.areSame( 'none', widget.data.align, 'Centering with DIV not possible in ENTER_P' );
			} );
		},

		// https://dev.ckeditor.com/ticket/11283
		'test upcast: ENTER_BR, non-captioned, centered->DIV{text-align}': function() {
			assertUpcast( {
				name: 'enterBR',
				data: '<div style="text-align:center">' +
						'<img id="w1" src="_assets/foo.png" alt="foo" />' +
					'</div>'
			}, function( editor ) {
				var instances = objToArray( editor.widgets.instances ),
					widget = instances[ 0 ];

				assert.areSame( 1, instances.length, 'A single widget has been initialized' );
				assert.areSame( 'center', widget.data.align, 'Centering with DIV allowed in modes different than ENTER_P' );
			} );
		},

		// https://dev.ckeditor.com/ticket/11283
		'test upcast: ENTER_BR, non-captioned, centered->DIV{text-align}, siblings': function() {
			assertUpcast( {
				name: 'enterBR',
				data: '<div style="text-align:center">' +
						'sibling' +
						'<img id="w1" src="_assets/foo.png" alt="foo" />' +
					'</div>'
			}, function( editor ) {
				var instances = objToArray( editor.widgets.instances ),
					widget = instances[ 0 ];

				assert.areSame( 1, instances.length, 'A single widget has been initialized' );
				assert.areSame( 'none', widget.data.align, 'Centering with DIV not possible if has siblings' );
			} );
		},

		// https://dev.ckeditor.com/ticket/14701
		'test upcast: setting proper label': function() {
			assertUpcast( {
				name: 'enterP',
				data: '<div style="text-align:center">' +
						'sibling' +
						'<img id="w1" src="_assets/foo.png" alt="foo" />' +
					'</div>'
			}, function( editor ) {
				var instances = objToArray( editor.widgets.instances ),
					widget = instances[ 0 ],
					expectedLabel = editor.lang.widget.label.replace( /%1/,
						'foo ' + widget.pathName );

				assert.areSame( expectedLabel, widget.getLabel(), 'getLabel() return value' );
				assert.areSame( expectedLabel, widget.wrapper.getAttribute( 'aria-label' ), 'widget aria-label value' );
			} );
		},

		// #2506
		'test upcast: empty figure with class="image"': function() {
			assertUpcast( {
				name: 'enterP',
				data: '<figure class="image"></figure>'
			}, function( editor ) {
				var instances = objToArray( editor.widgets.instances );
				assert.areEqual( instances.length, 0, 'Element shouldn\'t be upcasted as widget.' );
			} );
		}
	} );
} )();
