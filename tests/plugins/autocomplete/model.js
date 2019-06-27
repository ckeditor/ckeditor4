/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {

		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'autocomplete' );
		},

		'test model is initialized with correct data': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback );
			assert.isFalse( model.isActive );
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

		'test select fires change-selectedItemId event': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback ),
				spy = sinon.spy( model, 'fire' ),
				itemId = 2;

			model.select( itemId );

			assert.isTrue( spy.calledWith( 'change-selectedItemId', itemId ) );
		},

		'test sets correct item': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback ),
				itemId = 2;

			model.data = getData();
			model.setItem( itemId );

			assert.areEqual( itemId, model.selectedItemId );
		},

		'test sets item throws with invalid itemId': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback ),
				itemId = 999;

			assert.throwsError( Error, function() {
				model.setItem( itemId );
			} );

			assert.isUndefined( model.selectedItemId );
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

			model.selectedItemId = 3;

			model.selectPrevious();
			assert.isTrue( spy.calledWith( 2 ) );
		},

		'test set panel active': function() {
			var model = new CKEDITOR.plugins.autocomplete.model( dataCallback ),
				spy = sinon.spy( model, 'fire' );

			model.setActive( true );

			assert.isTrue( model.isActive );
			assert.isTrue( spy.calledWith( 'change-isActive', true ) );
		},

		'test set query sync': function() {
			var expectedQuery = 'query',
					expectedRange = 'range',
					expectedData = getData(),

					model = new CKEDITOR.plugins.autocomplete.model( function( matchInfo, callback ) {
						assert.areEqual( expectedQuery, matchInfo.query );
						assert.areEqual( expectedRange, matchInfo.range );
						assert.isNull( model.data );

						var spy = sinon.spy( model, 'fire' );

						callback( expectedData );

						assert.areSame( expectedData, model.data );
						assert.isTrue( spy.calledWith( 'change-data', expectedData ) );
					} );

			model.setQuery( expectedQuery, expectedRange );

			assert.areEqual( expectedQuery, model.query );
			assert.areEqual( expectedRange, model.range );
		},

		'test set query async': function() {
			var expectedQuery = 'query',
				expectedRange = 'range',
				expectedData = getData(),

				model = new CKEDITOR.plugins.autocomplete.model( function( matchInfo, callback ) {
					assert.areEqual( expectedQuery, matchInfo.query );
					assert.areEqual( expectedRange, matchInfo.range );
					assert.isNull( model.data );

					var spy = sinon.spy( model, 'fire' );

					setTimeout( function() {
						resume( function() {
							callback( expectedData );

							assert.areSame( expectedData, model.data );
							assert.isTrue( spy.calledWith( 'change-data', expectedData ) );
						}, 0 );
					} );
				} );

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
		];
	}

} )();
