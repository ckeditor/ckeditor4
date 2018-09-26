/* bender-tags: editor */
/* bender-ckeditor-plugins: link,toolbar */

( function() {
	'use strict';

	function assertAnchorDiscovery( bot, expIds, expNames ) {
		bot.dialog( 'link', function( dialog ) {
			dialog.setValueOf( 'info', 'linkType', 'anchor' );

			var idOptions = dialog.getContentElement( 'info', 'anchorId' ).getInputElement().$.options,
				nameOptions = dialog.getContentElement( 'info', 'anchorName' ).getInputElement().$.options,

				names = [],
				ids = [];

			for ( var i = idOptions.length; i--; )
				ids.push( idOptions[ i ].value );

			for ( i = nameOptions.length; i--; )
				names.push( nameOptions[ i ].value );

			assert.areSame( expIds.sort().join( ',' ), ids.sort().join( ',' ), 'Anchor IDs discovered properly' );
			assert.areSame( expNames.sort().join( ',' ), names.sort().join( ',' ), 'Anchor names discovered properly' );
		} );
	}

	bender.editors = {
		framed: {
			name: 'framed',
			creator: 'replace',
			startupData: '<p>' +
				'<a id="aa" name="ab">a</a>' +
				'<a id="ba" name="bb">b</a>' +
				'<a id="ca" name="cb"></a>' +
			'</p>'
		},
		inline: {
			name: 'inline',
			creator: 'inline',
			startupData: '<p>' +
				'<a id="ma" name="mb">m</a>' +
				'<a id="na" name="nb">n</a>' +
				'<a id="oa" name="ob"></a>' +
			'</p>'
		},
		divarea: {
			name: 'divarea',
			creator: 'replace',
			startupData: '<p>' +
				'<a id="ta" name="tb">t</a>' +
				'<a id="ua" name="ub">u</a>' +
				'<a id="wa" name="wb"></a>' +
			'</p>',
			config: {
				extraPlugins: 'divarea'
			}
		}
	};

	var anchorsMapping = {
			framed: {
				expectedIds: [ 'aa', 'ba', 'ca', '' ],
				expectedNames: [ 'ab', 'bb', 'cb', '' ]
			},
			inline: {
				expectedIds: [ 'ga', 'ha', 'ma', 'na', 'oa', 'ta', 'ua', 'wa', '' ],
				expectedNames: [ 'gb', 'hb', 'mb', 'nb', 'ob', 'tb', 'ub', 'wb', '' ]
			},
			divarea: {
				expectedIds: [ 'ta', 'ua', 'wa', '' ],
				expectedNames: [ 'tb', 'ub', 'wb', '' ]
			}
		},
		tests = {
			tearDown: function() {
				CKEDITOR.dialog.getCurrent().hide();
			},

			'test discovery of anchors': function( editor, bot ) {
				assertAnchorDiscovery( bot, anchorsMapping[ editor.name ].expectedIds, anchorsMapping[ editor.name ].expectedNames );
			}
		};

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );
} )();
