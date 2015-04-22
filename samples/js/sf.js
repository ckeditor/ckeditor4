/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
/* exported SF */

'use strict';

var SF = ( function() {
	var SF = {};

	SF.attachListener = function( elem, evtName, callback ) {
		if ( elem.addEventListener ) {
			elem.addEventListener( evtName, callback, false );
		} else if ( elem.attachEvent ) {
			elem.attachEvent( 'on' + evtName , function() {
				callback.apply( elem, arguments );
			} );
		} else {
			throw new Error( 'Could not attach event.' );
		}
	};

	SF.indexOf = ( function() {
		var indexOf = Array.prototype.indexOf;

		if ( indexOf === 'function' ) {
			return function( arr, elem ) {
				return indexOf.call( arr, elem );
			};
		} else {
			return function( arr, elem ) {
				var max = arr.length;

				for ( var i = 0; i < max; i++ ) {
					if ( arr[ i ] === elem ) {
						return i;
					}
				}

				return -1;
			};
		}

	}() );

	SF.accept = function( node, visitor ) {
		var children;

		// Handling node as a node and array
		if ( node.children ) {
			children = node.children;

			visitor( node );
		} else if ( typeof node.length === 'number' ) {
			children = node;
		}

		var i = children ? ( children.length || 0 ) : 0;
		while ( i-- ) {
			SF.accept( children[ i ], visitor );
		}
	};

	SF.getByClass = ( function(  ) {
		var getByClass = document.getElementsByClassName;
		if ( typeof getByClass === 'function' ) {
			return function( root, className ) {
				if ( typeof root === 'string' ) {
					className = root;
					root = document;
				}

				return getByClass.call( root, className );
			};
		}

		return function( root, className ) {
			if ( typeof root === 'string' ) {
				className = root;
				root = document.getElementsByTagName( 'html' )[ 0 ];
			}
			var results = [];

			SF.accept( root, function( elem ) {
				if ( SF.classList.contains( elem, className ) ) {
					results.push( elem );
				}
			} );

			return results;
		};
	}() );

	SF.classList = {};

	SF.classList.add = function( elem, className ) {
		var classes = parseClasses( elem );
		classes.push( className );

		elem.attributes.setNamedItem( createClassAttr( classes ) );
	};

	SF.classList.remove = function( elem, className ) {
		var classes = parseClasses( elem, className ),
			foundAt = SF.indexOf( classes, className );

		if ( foundAt === -1 ) {
			return;
		}

		classes.splice( foundAt, 1 );
		elem.attributes.setNamedItem( createClassAttr( classes ) );
	};

	SF.classList.contains = function( elem, className ) {
		return findIndex( elem, className ) !== -1;
	};

	SF.classList.toggle = function( elem, className ) {
		this.contains( elem, className ) ? this.remove( elem, className ) : this.add( elem, className );
	};

	function findIndex( elem, className ) {
		return SF.indexOf( parseClasses( elem ), className );
	}

	function parseClasses( elem ) {
		var classAttr = elem.attributes ? elem.attributes.getNamedItem( 'class' ) : null;

		return classAttr ? classAttr.value.split( ' ' ) : [];
	}

	function createClassAttr( classesArray ) {
		var attr = document.createAttribute( 'class' );

		attr.value = classesArray.join( ' ' );

		return attr;
	}

	return SF;
}() );

'use strict';

( function() {
	// Purges all styles in passed object.
	function purgeStyles( styles ) {
		for ( var i in styles ) {
			delete styles[ i ];
		}
	}

	SF.modal = function( config ) {
		// Modal should use the same style set as the rest of the page (.content component).
		config.modalClass = 'modal content';
		config.closeClass = 'modal-close';

		// Purge all pre-defined pico styles. Use the lessfile instead.
		config.modalStyles = purgeStyles;

		// Close button styles are customized via lessfile.
		config.closeStyles = purgeStyles;

		var userDefinedAfterCreate = config.afterCreate,
			userDefinedAfterClose = config.afterClose;

		// Close modal on ESC key.
		function onKeyDown( event ) {
			if ( event.keyCode == 27 ) {
				modal.close();
			}
		}

		// Use afterCreate as a config option rather than function chain.
		config.afterCreate = function( modal ) {
			userDefinedAfterCreate && userDefinedAfterCreate( modal );

			window.addEventListener( 'keydown', onKeyDown );
		};

		// Use afterClose as a config option rather than function chain.
		config.afterClose = function( modal ) {
			userDefinedAfterClose && userDefinedAfterClose( modal );

			window.removeEventListener( 'keydown', onKeyDown );
		};

		var modal = new picoModal( config )
			.afterCreate( config.afterCreate )
			.afterClose( config.afterClose );

		return modal;
	};
} )();
!function(a,b){"use strict";function c(a){return"object"==typeof Node?a instanceof Node:a&&"object"==typeof a&&"number"==typeof a.nodeType}function d(a){return"string"==typeof a}function e(){var a=[];return{watch:a.push.bind(a),trigger:function(b){for(var c=!0,d={preventDefault:function(){c=!1}},e=0;e<a.length;e++)a[e](b,d);return c}}}function f(a){this.elem=a}function g(a,b){return f.div().clazz("pico-overlay").clazz(a("overlayClass","")).stylize({display:"block",position:"fixed",top:"0px",left:"0px",height:"100%",width:"100%",zIndex:1e4}).stylize(a("overlayStyles",{opacity:.5,background:"#000"})).onClick(function(){a("overlayClose",!0)&&b()})}function h(a,b){var c=a("width","auto");"number"==typeof c&&(c=""+c+"px");var d=f.div().clazz("pico-content").clazz(a("modalClass","")).stylize({display:"block",position:"fixed",zIndex:10001,left:"50%",top:"50px",width:c,"-ms-transform":"translateX(-50%)","-moz-transform":"translateX(-50%)","-webkit-transform":"translateX(-50%)","-o-transform":"translateX(-50%)",transform:"translateX(-50%)"}).stylize(a("modalStyles",{backgroundColor:"white",padding:"20px",borderRadius:"5px"})).html(a("content")).attr("role","dialog").onClick(function(a){var c=new f(a.target).anyAncestor(function(a){return/\bpico-close\b/.test(a.elem.className)});c&&b()});return d}function i(a,b){return b("closeButton",!0)?a.child().html(b("closeHtml","&#xD7;")).clazz("pico-close").clazz(b("closeClass")).stylize(b("closeStyles",{borderRadius:"2px",cursor:"pointer",height:"15px",width:"15px",position:"absolute",top:"5px",right:"5px",fontSize:"16px",textAlign:"center",lineHeight:"15px",background:"#CCC"})):void 0}function j(a){return function(){return a().elem}}function k(b){function f(a,c){var d=b[a];return"function"==typeof d&&(d=d(c)),void 0===d?c:d}function k(){v().hide(),u().hide(),t.trigger(x)}function l(){s.trigger(x)&&k()}function m(a){return function(){return a.apply(this,arguments),x}}function n(a){if(!o){var b=h(f,l);o={modal:b,overlay:g(f,l),close:i(b,f)},p.trigger(x)}return o[a]}(d(b)||c(b))&&(b={content:b});var o,p=e(),q=e(),r=e(),s=e(),t=e(),u=n.bind(a,"modal"),v=n.bind(a,"overlay"),w=n.bind(a,"close"),x={modalElem:j(u),closeElem:j(w),overlayElem:j(v),show:function(){return q.trigger(x)&&(v().show(),w(),u().show(),r.trigger(x)),this},close:m(l),forceClose:m(k),destroy:function(){u=u().destroy(),v=v().destroy(),w=void 0},options:function(a){b=a},afterCreate:m(p.watch),beforeShow:m(q.watch),afterShow:m(r.watch),beforeClose:m(s.watch),afterClose:m(t.watch)};return x}f.div=function(a){var c=b.createElement("div");return(a||b.body).appendChild(c),new f(c)},f.prototype={child:function(){return f.div(this.elem)},stylize:function(a){a=a||{},"undefined"!=typeof a.opacity&&(a.filter="alpha(opacity="+100*a.opacity+")");for(var b in a)a.hasOwnProperty(b)&&(this.elem.style[b]=a[b]);return this},clazz:function(a){return this.elem.className+=" "+a,this},html:function(a){return c(a)?this.elem.appendChild(a):this.elem.innerHTML=a,this},onClick:function(a){return this.elem.addEventListener("click",a),this},destroy:function(){b.body.removeChild(this.elem)},hide:function(){this.elem.style.display="none"},show:function(){this.elem.style.display="block"},attr:function(a,b){return this.elem.setAttribute(a,b),this},anyAncestor:function(a){for(var b=this.elem;b;){if(a(new f(b)))return!0;b=b.parentNode}return!1}},"function"==typeof a.define&&a.define.amd?a.define(function(){return k}):a.picoModal=k}(window,document);
'use strict';

( function() {
	// All .tree-a elements in DOM.
	var expanders = SF.getByClass( 'toggler' );

	var i = expanders.length;
	while ( i-- ) {
		var expander = expanders[ i ];

		SF.attachListener( expander, 'click', function() {
			var containsIcon = SF.classList.contains( this, 'icon-toggler-expanded' ) || SF.classList.contains( this, 'icon-toggler-collapsed' ),
				related = document.getElementById( this.getAttribute( 'data-for' ) );

			SF.classList.toggle( this, 'collapsed' );

			if ( SF.classList.contains( this, 'collapsed' ) ) {
				SF.classList.add( related, 'collapsed' );
				if ( containsIcon ) {
					SF.classList.remove( this, 'icon-toggler-expanded' );
					SF.classList.add( this, 'icon-toggler-collapsed' );
				}
			} else {
				SF.classList.remove( related, 'collapsed' );
				if ( containsIcon ) {
					SF.classList.remove( this, 'icon-toggler-collapsed' );
					SF.classList.add( this, 'icon-toggler-expanded' );
				}
			}
		} );
	}
} )();
/* global SF */

'use strict';

( function() {
	// All .tree-a elements in DOM.
	var trees = SF.getByClass( 'tree-a' );

	for ( var i = trees.length; i--; ) {
		var tree = trees[ i ];

		SF.attachListener( tree, 'click', function( evt ) {
			var target = evt.target || evt.srcElement;

			// Collapse or expand item groups.
			if ( target.nodeName === 'H2' && !SF.classList.contains( target, 'tree-a-no-sub' ) ) {
				SF.classList.toggle( target, 'tree-a-active' );
			}
		} );
	}
} )();