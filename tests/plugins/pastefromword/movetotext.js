/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: pastefromword,toolbar,basicstyles,font,colorbutton */
/* bender-include: %BASE_PATH%plugins/clipboard/_helpers/pasting.js */
/* global assertPasteEvent */

( function() {
	'use strict';

	function createPasteTest( editorName, input, output ) {
		return function() {
			assertPasteEvent( bender.editors[ editorName ], { dataValue: input }, { dataValue: output }, '', true );
		};
	}

	bender.editors = {
		classic: {
			name: 'classic',
			config: {
				pasteFromWordRemoveFontStyles: false,
				allowedContent: true
			}
		},
		customStyle: {
			name: 'customStyle',
			config: {
				pasteFromWordRemoveFontStyles: false,
				coreStyles_strike: {
					element: 'sub',
					overrides: 'strike'
				},
				coreStyles_underline: {
					element: 'sup',
					overrides: 'underline'
				},
				allowedContent: true
			}
		}
	};

	// jscs:disable maximumLineLength
	bender.test( {
		'test strike': createPasteTest(
			'classic',
			// Input
			'<p class="MsoNormal"><s>foo<o:p></o:p></s></p>',
			// Output
			'<p><s>foo</s></p>'
		),

		'test underline': createPasteTest(
			'classic',
			// Input
			'<p class="MsoNormal"><u>foo<o:p></o:p></u></p>',
			// Output
			'<p><u>foo</u></p>'
		),

		'test strike, underline': createPasteTest(
			'classic',
			// Input
			'<p class="MsoNormal"><s><u>foo<o:p></o:p></u></s></p>',
			// Output
			'<p><s><u>foo</u></s></p>'
		),
		'test strike, color': createPasteTest(
			'classic',
			// Input
			'<p class="MsoNormal"><s><span style="color:red">foo<o:p></o:p></span></s></p>',
			// Output
			'<p><span style="color:red;"><s>foo</s></span></p>'
		),

		'test underline, color': createPasteTest(
			'classic',
			// Input
			'<p class="MsoNormal"><u><span style="color:red">foo<o:p></o:p></span></u></p>',
			// Output
			'<p><span style="color:red;"><u>foo</u></span></p>'
		),

		'test strike, underline, color': createPasteTest(
			'classic',
			// Input
			'<p class="MsoNormal"><s><u><span style="color:red">foo<o:p></o:p></span></u></s></p>',
			// Output
			'<p><span style="color:red;"><s><u>foo</u></s></span></p>'
		),
		'test strike, color, font, size, bold': createPasteTest(
			'classic',
			// Input
			'<p class="MsoNormal"><b><s><span style="font-size:22.2pt;line-height:107%;font-family:&quot;Comic Sans MS&quot;;\ncolor:red">foo<o:p></o:p></span></s></b></p>',
			// Output
			'<p><strong><span style="color:red;"><span style="font-family:comic sans ms;"><span style="font-size:22.2pt;"><s>foo</s></span></span></span></strong></p>'
		),

		'test underline, color, font, size, bold': createPasteTest(
			'classic',
			// Input
			'<p class="MsoNormal"><b><u><span style="font-size:22.2pt;line-height:107%;font-family:&quot;Comic Sans MS&quot;;\ncolor: red">foo<o:p></o:p></span></u></b></p>',
			// Output
			'<p><strong><span style="color:red;"><span style="font-family:comic sans ms;"><span style="font-size:22.2pt;"><u>foo</u></span></span></span></strong></p>'
		),

		'test strike, underline, color, font, size, bold': createPasteTest(
			'classic',
			// Input
			'<p class="MsoNormal"><b><s><u><span style="font-size:22.2pt;line-height:107%;font-family:&quot;Comic Sans MS&quot;;\ncolor: red">foo<o:p></o:p></span></u></s></b></p>',
			// Output
			'<p><strong><span style="color:red;"><span style="font-family:comic sans ms;"><span style="font-size:22.2pt;"><s><u>foo</u></s></span></span></span></strong></p>'
		),

		'test empty paragraph end, strike, underline, color': createPasteTest(
			'classic',
			// Input
			'<p class="MsoNormal"><s><u><span style="color:red">Foo<o:p></o:p></span></u></s></p>' +
			'<p class="MsoNormal"><s><u><span style="color:red">&nbsp;</span></u></s></p>' +
			'<p class="MsoNormal"><s><u><span style="color:red">bar<o:p></o:p></span></u></s></p>',
			// Output
			'<p><span style="color:red;"><s><u>Foo</u></s></span></p>' +
			'<p>&nbsp;</p>' +
			'<p><span style="color:red;"><s><u>bar</u></s></span></p>'
		),

		'test empty paragraph middle, strike, underline, color': createPasteTest(
			'classic',
			// Input
			'<p class="MsoNormal"><s><u><span style="color:red">Foo<o:p></o:p></span></u></s></p>' +
			'<p class="MsoNormal"><s><u><span style="color:red">&nbsp;</span></u></s></p>',
			// Output
			'<p><span style="color:red;"><s><u>Foo</u></s></span></p>' +
			'<p>&nbsp;</p>'
		),

		'test two colors, strike, underline': createPasteTest(
			'classic',
			// Input
			'<p class="MsoNormal"><s><u><span style="color:red">Foo </span><span style="color:green">bar</span><span style="color:red"><o:p></o:p></span></u></s></p>',
			// Output
			'<p><span style="color:red;"><s><u>Foo </u></s></span><span style="color:green;"><s><u>bar</u></s></span><span style="color:red;"></span></p>'
		),

		'test customStyle, strike': createPasteTest(
			'customStyle',
			// Input
			'<p class="MsoNormal"><s>foo<o:p></o:p></s></p>',
			// Output
			'<p><sub>foo</sub></p>'
		),

		'test customStyle, underline': createPasteTest(
			'customStyle',
			// Input
			'<p class="MsoNormal"><u>foo<o:p></o:p></u></p>',
			// Output
			'<p><sup>foo</sup></p>'
		),

		'test customStyle, strike, color': createPasteTest(
			'customStyle',
			// Input
			'<p class="MsoNormal"><s><span style="color:red">foo<o:p></o:p></span></s></p>',
			// Output
			'<p><span style="color:red;"><sub>foo</sub></span></p>'
		),

		'test customStyle, underline, color': createPasteTest(
			'customStyle',
			// Input
			'<p class="MsoNormal"><u><span style="color:red">foo<o:p></o:p></span></u></p>',
			// Output
			'<p><span style="color:red;"><sup>foo</sup></span></p>'
		),

		'test customStyle, strike, underline, color, font, size, bold': createPasteTest(
			'customStyle',
			// Input
			'<p class="MsoNormal"><b><s><u><span style="font-size:22.2pt;line-height:107%;font-family:&quot;Comic Sans MS&quot;;\ncolor:red">foo<o:p></o:p></span></u></s></b></p>',
			// Output
			'<p><strong><span style="color:red;"><span style="font-family:comic sans ms;"><span style="font-size:22.2pt;"><sub><sup>foo</sup></sub></span></span></span></strong></p>'
		)
	} );
	// jscs:enable
} )();