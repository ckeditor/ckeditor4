/* bender-tags: editor */
/* bender-ckeditor-plugins: stylescombo,toolbar */

( function() {
	'use strict';

	var buildPreviewCalled = [];
	function buildPreview() {
		buildPreviewCalled.push( this._.definition.name );
		return this._.definition.name;
	}

	CKEDITOR.style.addCustomHandler( {
		type: 'customStyle1',
		buildPreview: buildPreview
	} );
	CKEDITOR.style.addCustomHandler( {
		type: 'customStyle2',
		buildPreview: buildPreview,
		assignedTo: CKEDITOR.STYLE_INLINE
	} );
	// Always enable all styles.
	CKEDITOR.style.prototype.checkApplicable = function() {
		return true;
	};

	bender.editor = {
		config: {
			language: 'en',
			stylesSet: [
				{ name: 'St1', type: 'customStyle1' },
				{ name: 'St2', type: 'customStyle2' },
				{ name: 'St3', element: 'span', styles: { color: 'red' } },
				{ name: 'St4', element: 'p', styles: { color: 'red' } },
				{ name: 'St5', element: 'img', styles: { color: 'red' } },
				{ name: 'St6', type: 'customStyle1' }
			]
		}
	};

	// Yup - listBlock is terrible to test... ;/
	function parseListblock( listBlock ) {
		var els = listBlock.element.find( 'h1, a' ),
			ret = [],
			el;

		for ( var i = 0; i < els.count(); ++i ) {
			el = els.getItem( i );
			// Item may contain the element returned by buildPreview - e.g. styled span. Skip it.
			if ( el.getFirst().type == CKEDITOR.NODE_ELEMENT )
				el = el.getFirst();

			ret.push( el.getHtml() );
		}
		return ret;
	}

	bender.test( {
		'test display order of a custom styleSet': function() {
			var editor = this.editor,
				stylesCombo = editor.ui.get( 'Styles' );

			buildPreviewCalled = [];

			stylesCombo.createPanel( editor );

			var labels = parseListblock( stylesCombo._.list );

			assert.areSame( 'Object Styles, St1, St5, St6, Block Styles, St4, Inline Styles, St2, St3', labels.join( ', ' ) );
			// This is important check, because small mistake in stylescombo and buildPreview won't be called on
			// custom styles which have default assignedTo (== STYLE_OBJECT), because buildPreview is not called on
			// object styles, but we want to make it possible for custom styles.
			assert.areSame( 'St1, St6, St2', buildPreviewCalled.join( ', ' ), 'custom buildPreview were called on every style' );
		}
	} );

} )();
