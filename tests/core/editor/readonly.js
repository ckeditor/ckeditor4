/* bender-tags: editor,unit */

( function() {
	'use strict';

	var tests = {},
		editorName,
		editorsDefinitions = {
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
			inline_textarea_readonly: {
				name: 'inline_textarea_readonly',
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
			framed_readonly: {
				name: 'framed_readonly',
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

	bender.editors = editorsDefinitions;

	for ( editorName in bender.editors ) {
		tests[ 'test startup readOnly on ' + editorName ] = getTest( editorName );
	}

	bender.test( tests );

	function getTest( editorName ) {
		return function() {
			assert.areSame( editorsDefinitions[ editorName ].readOnly, bender.editors[ editorName ].readOnly );
		};
	}
} )();