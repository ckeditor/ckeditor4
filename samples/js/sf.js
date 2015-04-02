/**
 * Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://cksource.com/ckeditor/license
 */

// jscs: disable
// jshint ignore: start
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

				for( var i = 0; i < max; i++ ) {
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
		while( i-- ) {
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