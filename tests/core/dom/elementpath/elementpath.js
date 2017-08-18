
var tools = bender.tools,
	doc = CKEDITOR.document,
	playground = doc.getById( 'playground' );

bender.test( {
	'test elementPath.contains skipRoot': function() {
		tools.setHtmlWithSelection( playground, '<p><b>fo^o</b></p>' );

		var path = doc.getSelection().getRanges()[ 0 ].startPath();

		assert.areSame( path.root, path.contains( path.root ), 'Root is not excluded by default' );
		assert.isNull( path.contains( path.root, true ), 'Root is excluded correctly' );
	},

	// (#684)
	'test elementPath.contains skipRoot with fromTop': function() {
		tools.setHtmlWithSelection( playground, '<p><b>fo^o</b></p>' );

		var path = doc.getSelection().getRanges()[ 0 ].startPath();

		assert.areSame( doc.findOne( '#playground b' ), path.contains( 'b', true, true ),
			'Regular element is still in the path' );

		assert.isNull( path.contains( path.root, true, true ), 'Root is excluded' );
	}
} );
