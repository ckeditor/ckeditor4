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
			assert.areSame( model._observedModel, this.dummySourceModel, 'Source model' );
		},

		'test items limiting': function() {
			var model = this._getDummyProxyModel(),
				changeListener = sinon.spy(),
				lastModelData;

			model.setLimit( 3 );

			model.on( 'change-data', changeListener );

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

			model.setLimit( 3 );
			model.setLimit( false );

			model.on( 'change-data', changeListener );

			model.setQuery();

			assert.areSame( 1, changeListener.callCount, 'Change listener call count' );

			lastModelData = changeListener.args[ 0 ][ 0 ].data;

			assert.areSame( 5, lastModelData.length, 'Model data entries count' );
		},

		'test changing limit causes extra change event': function() {
			var model = this._getDummyProxyModel(),
				changeListener = sinon.stub();

			model.on( 'change-data', changeListener );

			model.setQuery();

			model.setLimit( 3 );

			assert.areSame( 2, changeListener.callCount, 'Change listener call count' );

			assert.areSame( 5, changeListener.args[ 0 ][ 0 ].data.length, 'First change event entries count' );
			assert.areSame( 3, changeListener.args[ 1 ][ 0 ].data.length, 'Last change event entries count' );
		},

		'test proxies hasData': function() {
			this.dummySourceModel.hasData = sinon.stub().returns( true );

			var model = this._getDummyProxyModel();

			assert.isTrue( model.hasData() );

			this.dummySourceModel.hasData.returns( false );

			assert.isFalse( model.hasData() );
		},

		'test proxy sorting': function() {
			var model = this._getDummyProxyModel(),
				changeListener = sinon.stub(),
				lastModelData;

			// Simply a reverse sorting function.
			model.setSorting( function( a, b ) {
				return a.id < b.id ? 1 : -1;
			} );

			model.on( 'change-data', changeListener );

			model.setQuery();

			lastModelData = changeListener.args[ 0 ][ 0 ].data;

			assert.areSame( 5, lastModelData.length, 'Model data entries count' );
			assert.areSame( 5, lastModelData[ 0 ].id, 'Id of first entry' );
			assert.areSame( 1, lastModelData[ 4 ].id, 'Id of last entry' );
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
