/* bender-tags: editor */
/* bender-ckeditor-plugins: imagebase,easyimage */

( function() {
	'use strict';

	var ProgressBar,
		doc = CKEDITOR.document,
		loaderMock = {},
		tests = {
			init: function() {
				ProgressBar = CKEDITOR.plugins.imagebase.progressBar;

				CKEDITOR.event.implementOn( loaderMock );

				this.sandbox = doc.getById( 'sandbox' );
			},

			setUp: function() {
				bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );

				this.sandbox.setHtml( '' );

				this.dummyProgress = new ProgressBar();

				sinon.stub( this.dummyProgress, 'aborted' );
				sinon.stub( this.dummyProgress, 'done' );
				sinon.stub( this.dummyProgress, 'failed' );
				sinon.stub( this.dummyProgress, 'updated' );
			},

			'test constructor creates proper elements': function() {
				var ret = new ProgressBar();
				this.sandbox.append( ret.wrapper, true );

				assert.areSame( this.sandbox.findOne( '.cke_loader' ), ret.wrapper, 'ret.wrapper' );
				assert.areSame( this.sandbox.findOne( '.cke_bar' ), ret.bar, 'ret.bar' );

				assert.beautified.html( doc.getById( 'expected-create-from-element' ).getHtml(), this.sandbox.getHtml() );
			},

			'test remove()': function() {
				var ret = new ProgressBar( this.sandbox );

				this.sandbox.append( ret.wrapper );

				ret.remove();

				assert.isNull( ret.wrapper.getParent(), 'Parent node' );
			},

			'test update()': function() {
				var values = [
						[ 0.0, '0%' ],
						[ 0.2, '20%' ],
						[ 0.25, '25%' ],
						[ 0.301, '30%' ],
						[ 0.309, '31%' ],
						[ 1.0, '100%' ],
						[ -1.0, '0%' ],
						[ 1.1, '100%' ]
					],
					ret = new ProgressBar( this.sandbox );

				CKEDITOR.tools.array.forEach( values, function( assertSet ) {
					ret.updated( assertSet[ 0 ] );
					assert.areSame( assertSet[ 1 ], ret.bar.getStyle( 'width', assertSet[ 0 ] ), 'Width for ' + assertSet[ 0 ] );
				} );
			},

			'test failed()': function() {
				var ret = this._createProgressBar();

				ret.failed();

				assert.isNull( ret.wrapper.getParent(), 'Parent element' );
			},

			'test aborted()': function() {
				var ret = this._createProgressBar();

				ret.aborted();

				assert.isNull( ret.wrapper.getParent(), 'Parent element' );
			},

			'test done()': function() {
				var ret = this._createProgressBar();

				ret.done();

				assert.isNull( ret.wrapper.getParent(), 'Parent element' );
			},

			'test bindLoader() abort event removes listeners': function() {
				this.dummyProgress.bindLoader( loaderMock );

				loaderMock.fire( 'abort' );

				sinon.assert.calledOnce( this.dummyProgress.aborted );
				sinon.assert.calledOn( this.dummyProgress.aborted, this.dummyProgress );

				// Subsequent calls should not result with more calls.
				loaderMock.fire( 'abort' );
				loaderMock.fire( 'abort' );

				assert.areSame( 1, this.dummyProgress.aborted.callCount, 'Aborted call count' );

				// Uploaded event should not trigger done too.
				loaderMock.fire( 'uploaded' );
				assert.areSame( 0, this.dummyProgress.done.callCount, 'Done call count' );
			},

			'test bindLoader() uploaded event removes listeners': function() {
				this.dummyProgress.bindLoader( loaderMock );

				loaderMock.fire( 'uploaded' );

				sinon.assert.calledOnce( this.dummyProgress.done );
				sinon.assert.calledOn( this.dummyProgress.done, this.dummyProgress );

				// Subsequent calls should not result with more calls.
				loaderMock.fire( 'uploaded' );
				loaderMock.fire( 'uploaded' );

				assert.areSame( 1, this.dummyProgress.done.callCount, 'Done call count' );
			},

			'test bindLoader() update event is throttled': function() {
				this.dummyProgress.bindLoader( loaderMock );

				// Make sure that if file loader spams update events, progress does not go crazy.
				loaderMock.uploadTotal = 5;

				loaderMock.fire( 'update' );
				loaderMock.fire( 'update' );
				loaderMock.fire( 'update' );

				delete loaderMock.uploadTotal;

				assert.areSame( 1, this.dummyProgress.updated.callCount, 'Updated call count' );
			},

			'test bindLoader() uploading argument translation': function() {
				this.dummyProgress.bindLoader( loaderMock );

				loaderMock.uploaded = 3;
				loaderMock.uploadTotal = 5;

				loaderMock.fire( 'update' );

				delete loaderMock.uploaded;
				delete loaderMock.uploadTotal;

				sinon.assert.calledWithExactly( this.dummyProgress.updated, 0.6 );
				assert.areSame( 1, this.dummyProgress.updated.callCount, 'Call count' );
			},

			'test bindLoader() error event removes listeners': function() {
				this.dummyProgress.bindLoader( loaderMock );

				loaderMock.fire( 'error' );

				sinon.assert.calledOnce( this.dummyProgress.failed );
				sinon.assert.calledOn( this.dummyProgress.failed, this.dummyProgress );

				// Subsequent calls should not result with more calls.
				loaderMock.fire( 'error' );
				loaderMock.fire( 'error' );

				assert.areSame( 1, this.dummyProgress.failed.callCount, 'Failed call count' );
			},

			// Adds the progress bar straight into DOM and returns ProgressBar instance.
			_createProgressBar: function() {
				var ret = new ProgressBar();
				this.sandbox.append( ret.wrapper );
				return ret;
			}
		};

	bender.test( tests );
} )();
