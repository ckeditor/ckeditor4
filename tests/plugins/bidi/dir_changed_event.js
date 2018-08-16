/* bender-tags: editor */
/* bender-ckeditor-plugins: bidi */

( function() {
	'use strict';

	window.frameLoaded = function() {
		bender.test( {
			setUp: function() {
				this.doc = CKEDITOR.document.getById( 'contents' ).getFrameDocument();
			},

			test_dirChanged_event: function() {
				var target = this.doc.getById( 'p1' ), changed;
				this.doc.on( 'dirChanged', function() {
					changed = true;
				} );
				target.setAttribute( 'dir', 'ltr' );
				assert.isTrue( changed );
			},

			test_dirChanged_event_2: function() {
				var target = this.doc.getById( 'p2' ), changed;
				this.doc.on( 'dirChanged', function() {
					changed = true;
				} );
				target.removeAttribute( 'dir' );
				assert.isTrue( changed );
			},

			test_dirChanged_event_3: function() {
				var target = this.doc.getById( 'p3' ), changed;
				this.doc.on( 'dirChanged', function() {
					changed = true;
				} );
				target.setAttribute( 'style', 'direction:rtl;' );
				assert.isTrue( changed );
			},

			test_dirChanged_event_4: function() {
				var target = this.doc.getById( 'p4' ), changed;
				this.doc.on( 'dirChanged', function() {
					changed = true;
				} );
				target.removeAttribute( 'style' );
				assert.isTrue( changed );
			},

			test_dirChanged_event_5: function() {
				var target = this.doc.getById( 'p5' ), changed;
				this.doc.on( 'dirChanged', function() {
					changed = true;
				} );
				target.setStyle( 'direction', 'rtl' );
				assert.isTrue( changed );
			},

			test_dirChanged_event_6: function() {
				var target = this.doc.getById( 'p6' ), changed;
				this.doc.on( 'dirChanged', function() {
					changed = true;
				} );
				target.removeStyle( 'direction', 'rtl' );
				assert.isTrue( changed );
			}
		} );
	};
} )();
