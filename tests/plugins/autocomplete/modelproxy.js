/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		setUp: function() {
			this.dummySourceModel = new CKEDITOR.plugins.autocomplete.model( dataCallback );
		},

		'test proxy is initialized with correct data': function() {
			var model = this._getDummyProxyModel();

			assert.isFalse( model.isActive );
			assert.areSame( dataCallback, model.dataCallback );
		},

		'test items limiting': function() {
			var model = this._getDummyProxyModel(),
				changeListener = sinon.spy(),
				lastModelData;

			model.on( 'change-data', changeListener );

			model.setLimit( 3 );
			model.setQuery();

			assert.areSame( 1, changeListener.callCount, 'Change listener call count' );

			lastModelData = changeListener.args[ 0 ][ 0 ].data;

			assert.areSame( 3, lastModelData.length, 'Model data entries count' );
		},

		'test items with no limit': function() {
			var model = this._getDummyProxyModel(),
				changeListener = sinon.stub(),
				lastModelData;

			model.on( 'change-data', changeListener );

			model.setQuery();

			assert.areSame( 1, changeListener.callCount, 'Change listener call count' );

			lastModelData = changeListener.args[ 0 ][ 0 ].data;

			assert.areSame( 5, lastModelData.length, 'Model data entries count' );
		},

		'test disabling limit': function() {
			var model = this._getDummyProxyModel(),
				changeListener = sinon.stub(),
				lastModelData;

			model.on( 'change-data', changeListener );

			model.setLimit( 3 );
			model.setLimit( false );
			model.setQuery();

			assert.areSame( 1, changeListener.callCount, 'Change listener call count' );

			lastModelData = changeListener.args[ 0 ][ 0 ].data;

			assert.areSame( 5, lastModelData.length, 'Model data entries count' );
		},

		_getDummyProxyModel: function() {
			var model = new CKEDITOR.plugins.autocomplete.modelProxy( dataCallback );
			model.setObservedModel( this.dummySourceModel );

			return model;
		}
	} );

	function dataCallback( query, range, callback ) {
		callback( getData() );
	}

	function getData() {
		return [ {
				id: 1
			},
			{
				id: 2
			},
			{
				id: 3
			},
			{
				id: 4
			},
			{
				id: 5
			}
		];
	}

} )();
