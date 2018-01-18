/* bender-tags: editor */
/* bender-ckeditor-plugins: imagebase */

( function() {
	'use strict';

	var ProgressBar,
		doc = CKEDITOR.document,
		loaderMock = {},
		tests = {
			init: function() {
				ProgressBar = CKEDITOR.plugins.imagebase.progressBar;

				CKEDITOR.event.implementOn( loaderMock );

				// Store the content of #nested-sandbox - it will be used to restore original HTML
				// before each test case.
				this.nestedSandbox = doc.getById( 'nested-sandbox' );
				this._nestedSandboxContent = this.nestedSandbox.getHtml();
			},

			setUp: function() {
				this.nestedSandbox.setHtml( this._nestedSandboxContent );

				this.dummyProgress = new ProgressBar();

				sinon.stub( this.dummyProgress, 'aborted' );
				sinon.stub( this.dummyProgress, 'done' );
				sinon.stub( this.dummyProgress, 'failed' );
				sinon.stub( this.dummyProgress, 'updated' );
			},

			'test createForElement()': function() {
				var ret = ProgressBar.createForElement( this.nestedSandbox.findOne( '.nested2' ) );

				assert.isInstanceOf( ProgressBar, ret, 'Returned type' );

				assert.beautified.html( doc.getById( 'expected-create-from-element' ).getHtml(), this.nestedSandbox.getHtml() );
			},

			'test createForElement() creates proper elements': function() {
				var ret = ProgressBar.createForElement( this.nestedSandbox.findOne( '.nested2' ) );

				assert.areSame( this.nestedSandbox.findOne( '.cke_loader' ), ret.wrapper, 'ret.wrapper' );
				assert.areSame( this.nestedSandbox.findOne( '.cke_bar' ), ret.bar, 'ret.bar' );
			},

			'test createForElement() prepends the element': function() {
				ProgressBar.createForElement( this.nestedSandbox );

				assert.beautified.html( doc.getById( 'expected-create-from-element-prepend' ).getHtml(), this.nestedSandbox.getHtml() );
			},

			'test remove()': function() {
				var ret = ProgressBar.createForElement( this.nestedSandbox );

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
					ret = ProgressBar.createForElement( this.nestedSandbox );

				CKEDITOR.tools.array.forEach( values, function( assertSet ) {
					ret.updated( assertSet[ 0 ] );
					assert.areSame( assertSet[ 1 ], ret.bar.getStyle( 'width', assertSet[ 0 ] ), 'Width for ' + assertSet[ 0 ] );
				} )
			},

			// 'test update() locks the snapshot': function() {
			// 	// todo
			// },

			'test failed()': function() {
				var ret = ProgressBar.createForElement( this.nestedSandbox );

				ret.failed();

				assert.isNull( ret.wrapper.getParent(), 'Parent element' );
			},

			'test aborted()': function() {
				var ret = ProgressBar.createForElement( this.nestedSandbox );

				ret.aborted();

				assert.isNull( ret.wrapper.getParent(), 'Parent element' );
			},

			'test done()': function() {
				var ret = ProgressBar.createForElement( this.nestedSandbox );

				ret.done();

				assert.isNull( ret.wrapper.getParent(), 'Parent element' );
			},

			'test bindToLoader() abort event removes listeners': function() {
				this.dummyProgress.bindToLoader( loaderMock );

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

			'test bindToLoader() uploaded event removes listeners': function() {
				this.dummyProgress.bindToLoader( loaderMock );

				loaderMock.fire( 'uploaded' );

				sinon.assert.calledOnce( this.dummyProgress.done );
				sinon.assert.calledOn( this.dummyProgress.done, this.dummyProgress );

				// Subsequent calls should not result with more calls.
				loaderMock.fire( 'uploaded' );
				loaderMock.fire( 'uploaded' );

				assert.areSame( 1, this.dummyProgress.done.callCount, 'Done call count' );
			},

			'test bindToLoader() uploading event is throttled': function() {
				this.dummyProgress.bindToLoader( loaderMock );
				// Make sure that if file loader spams uploading events, progress does not go crazy.

				loaderMock.fire( 'uploading' );
				loaderMock.fire( 'uploading' );
				loaderMock.fire( 'uploading' );
				loaderMock.fire( 'uploading' );

				assert.areSame( 1, this.dummyProgress.updated.callCount, 'Updated call count' );
			},

			'test bindToLoader() uploading event is throttled': function() {
				this.dummyProgress.bindToLoader( loaderMock );
				// Make sure that if file loader spams uploading events, progress does not go crazy.

				loaderMock.uploadTotal = 5;

				loaderMock.fire( 'uploading' );
				loaderMock.fire( 'uploading' );
				loaderMock.fire( 'uploading' );

				delete loaderMock.uploadTotal;

				assert.areSame( 1, this.dummyProgress.updated.callCount, 'Updated call count' );
			},

			'test bindToLoader() uploading argument translation': function() {
				this.dummyProgress.bindToLoader( loaderMock );

				loaderMock.uploaded = 3;
				loaderMock.uploadTotal = 5;

				loaderMock.fire( 'uploading' );

				delete loaderMock.uploaded;
				delete loaderMock.uploadTotal;

				sinon.assert.calledWithExactly( this.dummyProgress.updated, 0.6 );
				assert.areSame( 1, this.dummyProgress.updated.callCount, 'Call count' );
			},

			'test bindToLoader() error event removes listeners': function() {
				this.dummyProgress.bindToLoader( loaderMock );

				loaderMock.fire( 'error' );

				sinon.assert.calledOnce( this.dummyProgress.failed );
				sinon.assert.calledOn( this.dummyProgress.failed, this.dummyProgress );

				// Subsequent calls should not result with more calls.
				loaderMock.fire( 'error' );
				loaderMock.fire( 'error' );

				assert.areSame( 1, this.dummyProgress.failed.callCount, 'Failed call count' );
			}
		};

	bender.test( tests );
} )();
