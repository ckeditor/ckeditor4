/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: link,toolbar */

( function() {
	'use strict';

	var config = {
			extraAllowedContent: 'a[id,name]'
		},
		editorBots;

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

	bender.test( {
		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( {
				framed: {
					name: 'framed',
					creator: 'replace',
					startupData: '<p>' +
						'<a id="aa" name="ab">a</a>' +
						'<a id="ba" name="bb">b</a>' +
						'<a id="ca" name="cb"></a>' +
					'</p>',
					config: config
				},
				inline: {
					name: 'inline',
					creator: 'inline',
					startupData: '<p>' +
						'<a id="ma" name="mb">m</a>' +
						'<a id="na" name="nb">n</a>' +
						'<a id="oa" name="ob"></a>' +
					'</p>',
					config: config
				},
				divarea: {
					name: 'divarea',
					creator: 'replace',
					startupData: '<p>' +
						'<a id="ta" name="tb">t</a>' +
						'<a id="ua" name="ub">u</a>' +
						'<a id="wa" name="wb"></a>' +
					'</p>',
					config: CKEDITOR.tools.extend( {}, config, {
						extraPlugins: 'divarea'
					} )
				}
			}, function( editors, bots ) {
				editorBots = bots;
				that.callback( editors );
			} );
		},

		tearDown: function() {
			CKEDITOR.dialog.getCurrent().hide();
		},

		'test discovery of anchors (framed)': function() {
			assertAnchorDiscovery( editorBots.framed,
				[ 'aa', 'ba', 'ca', '' ],
				[ 'ab', 'bb', 'cb', '' ] );
		},

		'test discovery of anchors (inline)': function() {
			assertAnchorDiscovery( editorBots.inline,
				[ 'ga', 'ha', 'ma', 'na', 'oa', 'ta', 'ua', 'wa', '' ],
				[ 'gb', 'hb', 'mb', 'nb', 'ob', 'tb', 'ub', 'wb', '' ] );
		},

		'test discovery of anchors (divarea)': function() {
			assertAnchorDiscovery( editorBots.divarea,
				[ 'ta', 'ua', 'wa', '' ],
				[ 'tb', 'ub', 'wb', '' ] );
		}
	} );
} )();