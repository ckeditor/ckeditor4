/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: image2,link */

( function() {
	'use strict';

	var tools = image2TestsTools,
		states = {
			// Captioned widgets without links.
			'caption:true_align:none_link:no': {
				hasCaption: true,
				align: 'none'
			},
			'caption:true_align:center_link:no': {
				hasCaption: true,
				align: 'center'
			},
			'caption:true_align:left_link:no': {
				hasCaption: true,
				align: 'left'
			},

			// Captioned widgets with link.
			'caption:true_align:none_link:yes': {
				hasCaption: true,
				align: 'none',
				link: {
					type: 'url',
					url: {
						protocol: 'http://',
						url: 'x'
					}
				}
			},
			'caption:true_align:center_link:yes': {
				hasCaption: true,
				align: 'center',
				link: {
					type: 'url',
					url: {
						protocol: 'http://',
						url: 'x'
					}
				}
			},
			'caption:true_align:left_link:yes': {
				hasCaption: true,
				align: 'left',
				link: {
					type: 'url',
					url: {
						protocol: 'http://',
						url: 'x'
					}
				}
			},

			// Non-captioned widgets without links.
			'caption:false_align:none_link:no': {
				hasCaption: false,
				align: 'none'
			},
			'caption:false_align:center_link:no': {
				hasCaption: false,
				align: 'center'
			},
			'caption:false_align:left_link:no': {
				hasCaption: false,
				align: 'left'
			},

			// Non-captioned widgets without links.
			'caption:false_align:none_link:yes': {
				hasCaption: false,
				align: 'none',
				link: {
					type: 'url',
					url: {
						protocol: 'http://',
						url: 'x'
					}
				}
			},
			'caption:false_align:center_link:yes': {
				hasCaption: false,
				align: 'center',
				link: {
					type: 'url',
					url: {
						protocol: 'http://',
						url: 'x'
					}
				}
			},
			'caption:false_align:left_link:yes': {
				hasCaption: false,
				align: 'left',
				link: {
					type: 'url',
					url: {
						protocol: 'http://',
						url: 'x'
					}
				}
			}
		},

		contexts = {
			'test split paragraph when caption is added': {
				context: 'plainParagraph',
				oldState: 'caption:false_align:none_link:no',
				newState: 'caption:true_align:none_link:no'
			},
			'test split paragraph with span when caption is added': {
				context: 'paragraphWithSpan',
				oldState: 'caption:false_align:none_link:no',
				newState: 'caption:true_align:none_link:no'
			},
			'test split paragraph when widget is centered': {
				context: 'plainParagraph',
				oldState: 'caption:false_align:none_link:no',
				newState: 'caption:false_align:center_link:no'
			}
		};

	bender.editorBot.create( {
		config: {
			language: 'en',
			allowedContent: true,
			enterMode: CKEDITOR.ENTER_P,
			autoParagraph: false
		}
	}, function( bot ) {
		var tcs = {},
			shiftState = CKEDITOR.plugins.image2.stateShifter( bot.editor );

		tools.createStateTransitionTests( tcs, states, shiftState );
		tools.createContextualStateTransitionTests( tcs, states, contexts, shiftState );

		tcs.editorBot = bot;

		bender.test( tcs );
	} );
} )();