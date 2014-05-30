/* bender-tags: editor,unit */

( function() {
	'use strict';

	var editors = {},
		tests = {},
		editorName,
		toDo = {
			inline_textarea: {
				name: 'inline_textarea',
				creator: 'inline',
				readOnly: false
			},
			inline_textarea_disabled: {
				name: 'inline_textarea_disabled',
				creator: 'inline',
				readOnly: true
			},
			inline_textarea_config: {
				name: 'inline_textarea_config',
				creator: 'inline',
				readOnly: true,
				config: {
					readOnly: true
				}
			},

			framed: {
				name: 'framed',
				creator: 'replace',
				readOnly: false
			},
			framed_disabled: {
				name: 'framed_disabled',
				creator: 'replace',
				readOnly: true
			},
			framed_config: {
				name: 'framed_config',
				creator: 'replace',
				readOnly: true,
				config: {
					readOnly: true
				}
			},

			inline: {
				name: 'inline',
				creator: 'inline',
				readOnly: false
			},
			inline_disabled: {
				name: 'inline_disabled',
				creator: 'inline',
				readOnly: true
			},
			inline_disabled2: {
				name: 'inline_disabled2',
				creator: 'inline',
				readOnly: true
			},
			inline_config: {
				name: 'inline_config',
				creator: 'inline',
				readOnly: true,
				config: {
					readOnly: true
				}
			}
		};

	for ( editorName in toDo )
		tests[ 'test startup readOnly on ' + editorName ] = getTest( editorName );

	setUpEditors();

	function getTest( editorName ) {
		return function() {
			assert.areSame( toDo[ editorName ].readOnly, editors[ editorName ].readOnly );
		};
	}

	function setUpEditors() {
		var names = [];

		for ( var name in toDo )
			names.push( name );

		next();

		function next() {
			var name = names.shift();

			if ( !name ) {
				bender.test( tests );
				return;
			}

			bender.editorBot.create( toDo[ name ], function( bot ) {
				editors[ name ] = bot.editor;
				next();
			} );
		}
	}
} )();