/* bender-tags: editor,unit,link */
/* bender-ckeditor-plugins: toolbar,link,dialogadvtab */

( function() {
	'use strict';

	var parseLinkiAttributes,
		getLinkAttributes;

	bender.editor = {
		config: {
			autoParagraph: false,
			on: {
				instanceReady: function() {
					parseLinkiAttributes = CKEDITOR.plugins.link.parseLinkAttributes;
					getLinkAttributes = CKEDITOR.plugins.link.getLinkAttributes;
				}
			}
		}
	};

	// * Sets editor data.
	// * Parses the very first link in editable.
	// * Gets attributes to be set/removed (based on data).
	// * Asserts correctness of parsed data (expectedData).
	// * Asserts correctness of attributes to be set (expectedAttributesSet).
	// * Asserts correctness of attributes to be removed (expectedAttributesRemoved).
	// * Synthesises a new link based on attributes to be set/removed.
	// * Compares synthesised link with that one which data has been parsed.
	function assertLink( bot, html, expectedData, expectedAttributesSet, expectedAttributesRemoved ) {
		var doc = bot.editor.document;

		bot.setData( html, function() {
			var linkToBeParsed = doc.findOne( 'a' ),
				data = parseLinkiAttributes( bot.editor, linkToBeParsed );

			if ( data.advanced ) {
				data.advanced.advStyles = CKEDITOR.tools.writeCssText(
					CKEDITOR.tools.parseCssText( data.advanced.advStyles, true ) );
			}

			var attributes = getLinkAttributes( bot.editor, data );

			assert.areSame(
				JSON.stringify( expectedData ), JSON.stringify( data ), 'Link attributes parsed correctly' );
			assert.areSame(
				JSON.stringify( expectedAttributesSet ), JSON.stringify( attributes.set ), 'Attributes to be set' );
			assert.areSame(
				expectedAttributesRemoved.sort().join( ',' ), attributes.removed.sort().join( ',' ), 'Attributes to be removed' );

			if ( html ) {
				// Synthesise a link based on generated attributes.
				var link = doc.createElement( 'a' );
				link.setAttributes( attributes.set );
				link.removeAttributes( attributes.removed );
				link.setText( 'foo' );

				// Compare synthetic link with the one which was parsed.
				assert.areSame(
					bender.tools.compatHtml( linkToBeParsed.getOuterHtml(), true, true, true, true ),
					bender.tools.compatHtml( link.getOuterHtml(), true, true, true, true  ),
					'Synthesised link looks exactly the same as the one which data has been parsed' );
			}
		} );
	}

	bender.test( {
		'test link attributes - no link': function() {
			assertLink( this.editorBot, '', {}, {}, [
				'accessKey',
				'charset',
				'class',
				'data-cke-pa-onclick',
				'data-cke-saved-name',
				'dir',
				'id',
				'lang',
				'name',
				'onclick',
				'rel',
				'style',
				'tabindex',
				'target',
				'title',
				'type'
			] );
		},

		'test link attributes - complex': function() {
			var html = '<a accesskey="b" charset="i" class="h" dir="rtl" href="http://x" id="a" lang="d" name="c" rel="j" style="margin-right: 0px;" tabindex="e" target="a" title="f" type="g">foo</a>';

			assertLink( this.editorBot, html,
				{
					type: 'url',
					url: {
						protocol: 'http://',
						url: 'x'
					},
					target: {
						type: 'frame',
						name: 'a'
					},
					advanced: {
						advId: 'a',
						advLangDir: 'rtl',
						advAccessKey: 'b',
						advName: 'c',
						advLangCode: 'd',
						advTabIndex: 'e',
						advTitle: 'f',
						advContentType: 'g',
						advCSSClasses: 'h',
						advCharset: 'i',
						advStyles: 'margin-right:0px',
						advRel: 'j'
					}
				}, {
					'data-cke-saved-href': 'http://x',
					target: 'a',
					id: 'a',
					dir: 'rtl',
					accessKey: 'b',
					name: 'c',
					lang: 'd',
					tabindex: 'e',
					title: 'f',
					type: 'g',
					'class': 'h',
					charset: 'i',
					style: 'margin-right:0px',
					rel: 'j',
					'data-cke-saved-name': 'c',
					href: 'http://x'
				},
				[
					'data-cke-pa-onclick',
					'onclick'
				] );
		},

		'test link attributes - mailto': function() {
			var html = '<a href="mailto:foo?subject=bar&amp;body=bam">foo</a>';

			assertLink( this.editorBot, html,
				{
					type: 'email',
					email: {
						address: 'foo',
						subject: 'bar',
						body: 'bam'
					}
				}, {
					'data-cke-saved-href': 'mailto:foo?subject=bar&body=bam',
					href: 'mailto:foo?subject=bar&body=bam'
				},
				[
					'accessKey',
					'charset',
					'class',
					'data-cke-pa-onclick',
					'data-cke-saved-name',
					'dir',
					'id',
					'lang',
					'name',
					'onclick',
					'rel',
					'style',
					'tabindex',
					'target',
					'title',
					'type'
				] );
		},

		'test link attributes - simple': function() {
			var html = '<a href="http://x">foo</a>';

			assertLink( this.editorBot, html,
				{
					type: 'url',
					url: {
						protocol: 'http://',
						url: 'x'
					}
				}, {
					'data-cke-saved-href': 'http://x',
					href: 'http://x'
				},
				[
					'accessKey',
					'charset',
					'class',
					'data-cke-pa-onclick',
					'data-cke-saved-name',
					'dir',
					'id',
					'lang',
					'name',
					'onclick',
					'rel',
					'style',
					'tabindex',
					'target',
					'title',
					'type'
				] );
		},

		'test link attributes - anchor': function() {
			var html = '<a href="#a">foo</a><a id="a" name="a">anchor</a>';

			assertLink( this.editorBot, html,
				{
					type: 'anchor',
					anchor: {
						id: 'a',
						name: 'a'
					}
				}, {
					'data-cke-saved-href': '#a',
					href: '#a'
				},
				[
					'accessKey',
					'charset',
					'class',
					'data-cke-pa-onclick',
					'data-cke-saved-name',
					'dir',
					'id',
					'lang',
					'name',
					'onclick',
					'rel',
					'style',
					'tabindex',
					'target',
					'title',
					'type'
				] );
		},

		'test link attributes - target popup': function() {
			var html = '<a href="http://foo" onclick="window.open(this.href, \'pop\', \'resizable=yes,status=yes,location=yes,toolbar=yes,menubar=yes,' +
				'fullscreen=yes,scrollbars=yes,dependent=yes,width=10,left=20,height=30,top=40\'); return false;">foo</a>';

			assertLink( this.editorBot, html,
				{
					type: 'url',
					url: {
						protocol: 'http://',
						url: 'foo'
					},
					target: {
						type: 'popup',
						name: 'pop',
						resizable: true,
						status: true,
						location: true,
						toolbar: true,
						menubar: true,
						fullscreen: true,
						scrollbars: true,
						dependent: true,
						width: '10',
						left: '20',
						height: '30',
						top: '40'
					}
				}, {
					'data-cke-saved-href': 'http://foo',
					'data-cke-pa-onclick': 'window.open(this.href, \'pop\', \'resizable=yes,status=yes,location=yes,toolbar=yes,menubar=yes,fullscreen=yes,' +
						'scrollbars=yes,dependent=yes,width=10,left=20,height=30,top=40\'); return false;',
					href: 'http://foo'
				},
				[
					'accessKey',
					'charset',
					'class',
					'data-cke-saved-name',
					'dir',
					'id',
					'lang',
					'name',
					'onclick',
					'rel',
					'style',
					'tabindex',
					'target',
					'title',
					'type'
				] );
		},

		'test link attributes - target _top': function() {
			var html = '<a href="http://x" target="_top">foo</a>';

			assertLink( this.editorBot, html,
				{
					type: 'url',
					url: {
						protocol: 'http://',
						url: 'x'
					},
					target: {
						type: '_top',
						name: '_top'
					}
				}, {
					'data-cke-saved-href': 'http://x',
					target: '_top',
					href: 'http://x'
				},
				[
					'accessKey',
					'charset',
					'class',
					'data-cke-pa-onclick',
					'data-cke-saved-name',
					'dir',
					'id',
					'lang',
					'name',
					'onclick',
					'rel',
					'style',
					'tabindex',
					'title',
					'type'
				] );
		}
	} );
} )();