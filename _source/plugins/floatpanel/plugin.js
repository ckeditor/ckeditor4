/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'floatpanel', {
	requires: [ 'panel' ]
});

(function() {
	var panels = {};

	function getPanel( editor, doc, parentElement, definition, level ) {
		// Generates the panel key: docId-eleId-skinName-langDir[-CSSs][-level]
		var key = doc.getUniqueId() + '-' + parentElement.getUniqueId() +
						'-' + editor.skinName +
						'-' + editor.lang.dir +
						( ( definition.css && ( '-' + definition.css ) ) || '' ) +
						( ( level && ( '-' + level ) ) || '' );

		var panel = panels[ key ];

		if ( !panel ) {
			panel = panels[ key ] = new CKEDITOR.ui.panel( doc, definition );
			panel.element = parentElement.append( CKEDITOR.dom.element.createFromHtml( panel.renderHtml( editor ), doc ) );

			panel.element.setStyles({
				display: 'none',
				position: 'absolute'
			});
		}

		return panel;
	}

	CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({
		$: function( editor, parentElement, definition, level ) {
			definition.forceIFrame = true;

			var doc = parentElement.getDocument(),
				panel = getPanel( editor, doc, parentElement, definition, level || 0 ),
				element = panel.element,
				iframe = element.getFirst().getFirst();

			this.element = element;

			this._ = {
				// The panel that will be floating.
				panel: panel,
				parentElement: parentElement,
				definition: definition,
				document: doc,
				iframe: iframe,
				children: [],
				dir: editor.lang.dir
			};
		},

		proto: {
			addBlock: function( name, block ) {
				return this._.panel.addBlock( name, block );
			},

			addListBlock: function( name, multiSelect ) {
				return this._.panel.addListBlock( name, multiSelect );
			},

			getBlock: function( name ) {
				return this._.panel.getBlock( name );
			},

			/*
				corner (LTR):
					1 = top-left
					2 = top-right
					3 = bottom-right
					4 = bottom-left

				corner (RTL):
					1 = top-right
					2 = top-left
					3 = bottom-left
					4 = bottom-right
			 */
			showBlock: function( name, offsetParent, corner, offsetX, offsetY ) {
				var panel = this._.panel,
					block = panel.showBlock( name );

				var element = this.element,
					iframe = this._.iframe,
					definition = this._.definition,
					position = offsetParent.getDocumentPosition( element.getDocument() ),
					rtl = this._.dir == 'rtl';

				var left = position.x + ( offsetX || 0 ),
					top = position.y + ( offsetY || 0 );

				if ( ( rtl && ( corner == 1 || corner == 4 ) ) || ( !rtl && ( corner == 2 || corner == 3 ) ) )
					left += offsetParent.$.offsetWidth - 1;

				if ( corner == 3 || corner == 4 )
					top += offsetParent.$.offsetHeight - 1;

				element.setStyles({
					top: top + 'px',
					left: '-3000px',
					visibility: 'hidden',
					opacity: '0', // FF3 is ignoring "visibility"
					display: ''
				});

				// Configure the IFrame blur event. Do that only once.
				if ( !this._.blurSet ) {
					// Non IE prefer the event into a window object.
					var focused = CKEDITOR.env.ie ? iframe : new CKEDITOR.dom.window( iframe.$.contentWindow );

					focused.on( 'blur', function() {
						if ( !this._.activeChild )
							this.hide();
					}, this );

					focused.on( 'focus', function() {
						this._.focused = true;
						this.hideChild();
					}, this );

					this._.blurSet = 1;
				}

				panel.onEscape = CKEDITOR.tools.bind( function() {
					this.onEscape && this.onEscape();
				}, this );

				setTimeout( function() {
					if ( rtl )
						left -= element.$.offsetWidth;

					element.setStyles({
						left: left + 'px',
						visibility: '',
						opacity: '1' // FF3 is ignoring "visibility"
					});

					if ( block.autoSize ) {
						function setHeight() {
							var target = element.getFirst();
							var height = block.element.$.scrollHeight;

							// Account for extra height needed due to IE quirks box model bug:
							// http://en.wikipedia.org/wiki/Internet_Explorer_box_model_bug
							// (#3426)
							if ( CKEDITOR.env.ie && CKEDITOR.env.quirks && height > 0 )
								height += ( target.$.offsetHeight || 0 ) - ( target.$.clientHeight || 0 );

							target.setStyle( 'height', height + 'px' );
						}

						if ( !CKEDITOR.env.gecko || panel.isLoaded ) {
							// IE7 needs some time (setting the delay to 0ms won't work) to refresh
							// the scrollHeight. (#3174)
							if ( CKEDITOR.env.ie && CKEDITOR.env.version >= 7 )
								setTimeout( setHeight, 50 );
							else
								setHeight();
						} else
							panel.onLoad = setHeight;
					} else
						element.getFirst().removeStyle( 'height' );

					// Set the IFrame focus, so the blur event gets fired.
					setTimeout( function() {
						if ( definition.voiceLabel ) {
							if ( CKEDITOR.env.gecko ) {
								var container = iframe.getParent();
								container.setAttribute( 'role', 'region' );
								container.setAttribute( 'title', definition.voiceLabel );
								iframe.setAttribute( 'role', 'region' );
								iframe.setAttribute( 'title', ' ' );
							}
						}
						iframe.$.contentWindow.focus();
					}, 0 );
				}, 0 );

				if ( this.onShow )
					this.onShow.call( this );
			},

			hide: function() {
				if ( !this.onHide || this.onHide.call( this ) !== true ) {
					this.hideChild();
					this.element.setStyle( 'display', 'none' );
				}
			},

			showAsChild: function( panel, blockName, offsetParent, corner, offsetX, offsetY ) {
				this.hideChild();

				panel.onHide = CKEDITOR.tools.bind( function() {
					// Use a timeout, so we give time for this menu to get
					// potentially focused.
					CKEDITOR.tools.setTimeout( function() {
						if ( !this._.focused )
							this.hide();
					}, 0, this );
				}, this );

				this._.activeChild = panel;
				this._.focused = false;

				panel.showBlock( blockName, offsetParent, corner, offsetX, offsetY );
			},

			hideChild: function() {
				var activeChild = this._.activeChild;

				if ( activeChild ) {
					delete activeChild.onHide;
					delete this._.activeChild;
					activeChild.hide();
				}
			}
		}
	});
})();
