/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {
	// Doesn't work for older IEs.
	if ( CKEDITOR.env.ie && CKEDITOR.env.version < 8 ) {
		CKEDITOR.plugins.add( 'selectionmark', function() {} );
		return;
	}

	// check it is non-collapsed, non-element text selection.
	function notCursorType( sel ) {
		var ranges = sel.getRanges();
		return !( ranges.length == 1 && ranges[ 0 ].collapsed );
	}

	function createOnDemand( editor ) {
		var sel = editor.getSelection();
		if ( sel && notCursorType( sel ) ) {
			create( editor );
			startToSync( editor );
		}
	}

	function update( editor ) {
		remove( editor );
		create( editor );
	}

	// Emulate browser text selection by shadowing the
	// editable with a fake selection highlight.
	function create( editor ) {
		var editable = editor.editable();
		// Check if there's an existing shadow instance.
		// If so, prevent duplication of the shadows.
		if ( editable._.shadow )
			return;

		var sel = editor.getSelection();

		var highlightRange = sel.getRanges()[ 0 ].clone(),
			bm = highlightRange.createBookmark2();

		// The shadow is a copy of the editable element, including
		// id as well to make sure this element is been styled exactly
		// as the original element.
		var shadow = editable.clone( 1, 1 );
		shadow.setStyles({
			'z-index': -1,
			position: 'absolute',
			left: editable.$.offsetLeft + 'px',
			top: editable.$.offsetTop + 'px',
			width: editable.getSize( 'width', 1 ) + 'px',
			height: editable.getSize( 'height', 1 ) + 'px'
		});

		// CSS margin must be empty except for body element.
		if ( !shadow.is( 'body' ) )
			shadow.setStyle( 'margin', 0 );


		shadow.addClass( 'cke-selection-shadow' );
		shadow.insertBefore( editable );
		shadow.$.scrollTop = editable.$.scrollTop;

		// Highlight the selection range within the editor shadow.
		highlightRange.moveToBookmark( bm );
		var highlightStyle = new CKEDITOR.style( CKEDITOR.tools.extend({
			attributes: { 'data-cke-highlight':1 },
			fullMatch: 1, ignoreReadonly: 1, childRule: function() {
				return 0;
			} }, {
			element: 'var', styles: { 'font-style': 'normal', 'background-color': '#B0B0B0', 'color': '#fff' } }, true ) );

		// Update the range boundary to shadow element.
		highlightRange.boundary = shadow;
		highlightStyle.applyToRange( highlightRange );

		shadow.insertAfter( editable );
		editable.setOpacity( 0 );
		editable._.shadow = shadow;
	}

	// Adapt the shadow dimension and position to the editable.
	function align( editable ) {
		var shadow = editable._.shadow;
		shadow.setStyles({
			'z-index': -1,
			position: 'absolute',
			left: editable.$.offsetLeft + 'px',
			top: editable.$.offsetTop + 'px',
			width: editable.getSize( 'width', 1 ) + 'px',
			height: editable.getSize( 'height', 1 ) + 'px'
		});

		shadow.$.scrollTop = editable.$.scrollTop;
	}

	// Destroy the shadow and reveal the editable.
	function remove( editor ) {
		stopSync( editor );
		var editable = editor.editable();
		if ( editable._.shadow ) {
			editable.setOpacity( 1 );
			editable._.shadow.remove();
			delete editable._.shadow;
		}
	}

	var status = {};

	function syncAll() {
		for ( var name in status ) {
			var editor = CKEDITOR.instances[ name ];
			var last = status[ name ];
			var current = getStatus( editor.editable() );

			// editable state changed, update shadow.
			if ( last ) {
				if ( current.html != last.html )
					update( editor );
				else if ( current.size != last.size )
					align( editor.editable() );
			}

			status[ name ] = current;
		}
	}

	var timer;

	function startToSync( editor ) {
		status[ editor.name ] = '';
		if ( !timer ) {
			// Start the daemon that sync
			// the shadows once after a internal.
			(function() {
				var self = arguments.callee;
				timer = setTimeout( function() {
					syncAll();
					self();
				}, 200 );
			})();
		}
	}

	function stopSync( editor ) {
		delete status[ editor.name ];
		if ( CKEDITOR.tools.isEmpty( status ) )
			clearTimeout( timer ), timer = 0;
	}

	function getStatus( editable ) {
		var dimension = '';
		for ( var i = 0, sides = [ 'width', 'height' ]; i < sides.length; i++ )
			dimension += '|' + editable.getSize( sides[ i ] );
		return { html: editable.getHtml(), size: dimension };
	}

	CKEDITOR.plugins.add( 'selectionmark', {
		init: function( editor ) {
			editor.on( 'instanceReady', function() {
				var editable = editor.editable();

				// We need to prevent margin collapsing effect on the editable element to make selection highlight shadow works.
				// http://reference.sitepoint.com/css/collapsingmargins
				if ( !( editable.getComputedStyle( 'position' ) == 'absolute' || ( /^inline/ ).exec( editable.getComputedStyle( 'display' ) ) ) ) {
					var sides = [ 'top', 'bottom' ];
					for ( var i = 0, side; side = sides[ i ], i < 2; i++ ) {
						var borderSize = parseInt( editable.getComputedStyle( 'border-' + side + '-width' ), 10 ),
							paddingSize = parseInt( editable.getComputedStyle( 'padding-' + side ), 10 ),
							style;

						if ( !( borderSize || paddingSize ) ) {
							style = 'border-' + side;
							// Force a transparent border on it.
							editable.setStyle( style, '1px solid transparent' );
						}
					}
				}

				// Update shadow on locked selection update.
				editable.on( 'selectionchange', function( evt ) {
					if ( editable._.shadow )
						update( editor );
				});

				// Make sure selection is still visible when editor focus
				// move from editable to other part of the UI.
				editable.on( 'blur', function() {
					// 100ms timeout for checking the correct focus manager state.
					setTimeout( function() {
						if ( editor.focusManager.hasFocus ) {
							var sel = editor.getSelection();
							sel && sel.isLocked && createOnDemand( editor );
						}

					}, 200 );
				});

				// Focus returns to editable, remove highlight as well.
				editable.on( 'focus', function() {
					remove( editor );
				});
			});

			// Remove the highlight once editor focus has lost.
			editor.on( 'blur', function() {
				remove( editor );
			});
			editor.on( 'beforeDestroy', function() {
				remove( editor );
			});
		}
	});

})();
