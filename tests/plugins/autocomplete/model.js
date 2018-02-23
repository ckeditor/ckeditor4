/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete */

( function() {

	bender.editor = true;

	bender.test( {
		'test model is initialized with correct data': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback );
			assert.isFalse( model.isPanelActive );
			assert.areSame( dataCallback, model.dataCallback );
		},

		'test gives correct information about model data': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback );

			model.data = null;
			assert.isFalse( model.hasData() );

			model.data = [];
			assert.isFalse( model.hasData() );

			model.data = [ {} ];
			assert.isTrue( model.hasData() );
		},

		'test gives correct index by id': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback );

			assert.areEqual( -1, model.getIndexById( 1 ) );

			model.data = getData();
			assert.areEqual( 0, model.getIndexById( 1 ) );
			assert.areEqual( 1, model.getIndexById( 2 ) );
			assert.areEqual( 2, model.getIndexById( 3 ) );
		},

		'test gives correct item by id': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback );

			assert.isNull( model.getItemById( 1 ) );

			model.data = getData();
			assert.areEqual( getData()[ 0 ].id, model.getItemById( 1 ).id );
			assert.areEqual( getData()[ 1 ].id, model.getItemById( 2 ).id );
			assert.areEqual( getData()[ 2 ].id, model.getItemById( 3 ).id );
		},

		'test selects correct item': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback ),
				spy = sinon.spy( model, 'fire' ),
				itemId = 2;

			model.data = getData();
			model.select( itemId );

			assert.areEqual( itemId, model.selectedItemId );
			assert.isTrue( spy.calledWith( 'change-selectedItemId', itemId ) );
		},

		'test selects throws with invalid itemId': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback ),
				spy = sinon.spy( model, 'fire' ),
				itemId = 999;

			assert.throwsError( Error, function() {
				model.select( itemId );
			} );

			assert.isUndefined( model.selectedItemId );
			assert.isFalse( spy.calledWith( 'change-selectedItemId', itemId ) );
		},

		'test select first': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback ),
				spy = sinon.spy( model, 'select' );

			model.selectFirst();

			assert.isFalse( spy.called );

			model.data = getData();
			model.selectFirst();

			assert.isTrue( spy.calledWith( 1 ) );
		},

		'test select last': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback ),
				spy = sinon.spy( model, 'select' );

			model.selectLast();

			assert.isFalse( spy.called );

			model.data = getData();
			model.selectLast();

			assert.isTrue( spy.calledWith( 3 ) );
		},

		'test select previous': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback ),
				spy = sinon.spy( model, 'select' );

			model.data = getData();

			model.selectPrevious();
			assert.isTrue( spy.calledWith( 3 ) );

			model.selectPrevious();
			assert.isTrue( spy.calledWith( 2 ) );
		},

		'test set panel active': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback ),
				spy = sinon.spy( model, 'fire' );

			model.setPanelActive( true );

			assert.isTrue( model.isPanelActive );
			assert.isTrue( spy.calledWith( 'change-isPanelActive', true ) );
		},

		'test set query sync': function() {
			var expectedQuery = 'query',
					expectedRange = 'range',
					expectedData = getData(),

					model = new CKEDITOR.plugins.autocomplete.model( function( query, range, callback ) {
						assert.areEqual( expectedQuery, query );
						assert.areEqual( expectedRange, range );
						assert.isNull( model.data );

						callback( expectedData );

						assert.areSame( expectedData, model.data );
						assert.isTrue( spy.calledWith( 'change-data', expectedData ) );
					} ),

				spy = sinon.spy( model, 'fire' );

			model.setQuery( expectedQuery, expectedRange );

			assert.areEqual( expectedQuery, model.query );
			assert.areEqual( expectedRange, model.range );
		},

		'test set query async': function() {
			var expectedQuery = 'query',
					expectedRange = 'range',
					expectedData = getData(),

					model = new CKEDITOR.plugins.autocomplete.model( function( query, range, callback ) {
						assert.areEqual( expectedQuery, query );
						assert.areEqual( expectedRange, range );
						assert.isNull( model.data );

						setTimeout( function() {
							resume( function() {
								callback( expectedData );

								assert.areSame( expectedData, model.data );
								assert.isTrue( spy.calledWith( 'change-data', expectedData ) );
							}, 0 );
						} );
					} ),

				spy = sinon.spy( model, 'fire' );

			model.setQuery( expectedQuery, expectedRange );

			wait();

			assert.areEqual( expectedQuery, model.query );
			assert.areEqual( expectedRange, model.range );
		}
	} );

	function dataCallback() {}

	function getData() {
		return [
			{ id: 1 },
			{ id: 2 },
			{ id: 3 }
		]
	}

} )();
