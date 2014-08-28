/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: basicstyles,toolbar */

( function() {
	'use strict';

	// Editor styles must be removed before the comparison occurs.
	// It is due the fact that different browsers use different styles.
	// The following regex handles the problem.
	var removeStyle = /<style[\s\S]+style>/g;

	function getBaseElement( editor ) {
		var base = editor.document.getHead().getFirst();

		// On IE we add the fixDomain script (see document#write).
		// On IE8 also the title lands before the base tag (magic...).
		if ( CKEDITOR.env.ie && base.is( { script: 1, title: 1 } ) )
			base = base.getNext();
		if ( CKEDITOR.env.ie && base.is( { script: 1, title: 1 } ) )
			base = base.getNext();

		return base;
	}

	bender.test( {
		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( {
				editor: {
					name: 'editor1',
					creator: 'replace',
					config: {
						docType: '',
						contentsLangDirection: 'ltr',
						fullPage: true,
						contentsCss: []
					}
				},
				editor_basehref: {
					name: 'editor2',
					creator: 'replace',
					config: {
						fullPage: true,
						baseHref: '/foo/bar/404/',
						allowedContent: true
					}
				},
			}, function( editors, bots ) {
				that.editorBots = bots;
				that.editors = editors;
				that.callback();
			} );
		},

		'test load full-page data' : function() {
			var bot = this.editorBots.editor;
			bender.tools.testInputOut( 'fullpage1', function( source, expected ) {
				bot.setData( source, function() {
					assert.areSame( bender.tools.compatHtml( expected ),
						bot.getData( true ).replace( removeStyle, '' ) );	// remove styles from data
				} );
			} );
		},

		'test load full-page data (with doctype)': function() {
			var bot = this.editorBots.editor;
			bender.tools.testInputOut( 'fullpage2', function( source, expected ) {
				bot.setData( source, function() {
					assert.areSame( bender.tools.compatHtml( expected ),
						bot.getData( true, true ).replace( removeStyle, '' ) );	// remove styles from data
				} );
			} );
		},

		'test base tag is placed before every element it affects in the head': function() {
			var bot = this.editorBots.editor_basehref;

			bot.setData( '<p>foo</p>', function() {
				var base = getBaseElement( bot.editor );

				assert.areSame( 'base', base.getName() );
				assert.isMatching( /\/foo\/bar\/404\/$/, base.getAttribute( 'href' ) );
			} );
		},

		// #9137
		'test base tag is correctly added when head has an attribute': function() {
			var bot = this.editorBots.editor_basehref;

			bot.setData( '<head foo="xxx"><title>x</title><body><p>foo</p></body>', function() {
				var base = getBaseElement( bot.editor );

				assert.areSame( 'base', base.getName() );
				assert.isMatching( /\/foo\/bar\/404\/$/, base.getAttribute( 'href' ) );

				// For some (unrelated) reaons on IE attributes are left.
				if ( !CKEDITOR.env.ie ) {
					// Common problem - ACF :P
					assert.isTrue( base.getParent().hasAttribute( 'foo' ), 'attribute was not lost' );
				}
			} );
		}
	} );

} )();