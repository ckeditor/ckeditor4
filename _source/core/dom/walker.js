/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	// This function is to be called under a "walker" instance scope.
	function iterate( rtl, breakOnFalse ) {
		if ( this._.end )
			return null;

		var node,
			type = this.type,
			getSourceNodeFn = ( rtl ? 'getPreviousSourceNode' : 'getNextSourceNode' );

		var guard = this.guard,
			endNode = this.endNode;

		if ( endNode ) {
			if ( guard ) {
				var originalGuard;
				guard = function( node ) {
					if ( node.equals( endNode ) )
						return false;

					return originalGuard( node );
				};
			} else
				guard = endNode;
		}

		if ( this.current )
			node = this.current[ getSourceNodeFn ]( false, type, guard );
		else if ( this.startInclusive ) {
			node = this.startNode;
			if ( this.guard && this.guard( node ) === false )
				node = null;
		} else
			node = this.startNode[ getSourceNodeFn ]( true, type, guard );

		while ( node && !this._.end ) {
			this.current = node;

			if ( node == this.endNode && !this.endInclusive )
				break;

			if ( !this.evaluator || this.evaluator( node ) !== false )
				return node;
			else if ( breakOnFalse && this.evaluator )
				return false;

			node = node[ getSourceNodeFn ]( false, type, guard );
		}

		this.end();
		return this.current = null;
	}

	function iterateToLast( rtl ) {
		var node,
			last = null;

		while ( node = iterate.call( this, rtl ) )
			last = node;

		return last;
	}

	CKEDITOR.dom.walker = CKEDITOR.tools.createClass({
		/**
		 * Utility class to "walk" inside a DOM tree starting from a specific
		 * node. Each step in the walk can be preciselly controlled.
		 * @constructor
		 * @param {CKEDITOR.dom.node} startNode The node from wich the walk
		 *		will start.
		 * @param {CKEDITOR.dom.node} [endNode] The last node to be considered
		 *		in the walk. No more nodes are retrieved after touching or
		 *		passing it.
		 */
		$: function( startNode, endNode ) {
			/**
			 * The node from which start walking.
			 * @type {CKEDITOR.dom.node}
			 */
			this.startNode = startNode;

			/**
			 * The end boundary node of the walk.
			 * @type {CKEDITOR.dom.node}
			 */
			this.endNode = endNode;

			/**
			 * Indicates that the start node is to be included in the walk.
			 * @name CKEDITOR.pluginDefinition.prototype.startInclusive
			 * @property
			 * @type Boolean
			 * @default false
			 */
			// this.startInclusive = false;
			/**
			 * Indicates that the end node is to be included in the walk.
			 * @name CKEDITOR.pluginDefinition.prototype.endInclusive
			 * @property
			 * @type Boolean
			 * @default false
			 */
			// this.endInclusive = false;
			/**
			 * A function executed for every matched node, to check whether
			 * it's to be considered into the walk or not. If not provided, all
			 * matched nodes are considered good.
			 * If the function returns "false" the node is ignored.
			 * @name CKEDITOR.pluginDefinition.prototype.evaluator
			 * @property
			 * @type Function
			 */
			// this.evaluator = null;
			/**
			 * A function executed for every node the walk pass by to check
			 * whether the walk is to be finished. It's called when both
			 * entering and exiting nodes, as well as for the matched nodes.
			 * If this function returns "false", the walking ends and no more
			 * nodes are evaluated.
			 * @name CKEDITOR.pluginDefinition.prototype.guard
			 * @property
			 * @type Function
			 */
			// this.guard = null;
			/** @private */
			this._ = {};
		},

		proto: {
			/**
			 * Stop walking. No more nodes are retrieved if this function gets
			 * called.
			 */
			end: function() {
				this._.end = 1;
			},

			/**
			 * Retrieves the next node (at right).
			 * @returns {CKEDITOR.dom.node} The next node or null if no more
			 *		nodes are available.
			 */
			next: function() {
				return iterate.call( this );
			},

			/**
			 * Retrieves the previous node (at left).
			 * @returns {CKEDITOR.dom.node} The previous node or null if no more
			 *		nodes are available.
			 */
			previous: function() {
				return iterate.call( this, true );
			},

			/**
			 * Executes a full walk forward (to the right), until no more nodes
			 * are available, returning the last valid node.
			 * @returns {CKEDITOR.dom.node} The last node at the right or null
			 *		if no valid nodes are available.
			 */
			lastForward: function() {
				return iterateToLast.call( this );
			},

			/**
			 * Executes a full walk backwards (to the left), until no more nodes
			 * are available, returning the last valid node.
			 * @returns {CKEDITOR.dom.node} The last node at the left or null
			 *		if no valid nodes are available.
			 */
			lastBackward: function() {
				return iterateToLast.call( this, true );
			},

			/**
			 * Check all nodes at right, executing the evaluation fuction.
			 * @returns {Boolean} "false" if the evaluator function returned
			 *		"false" for any of the matched nodes. Otherwise "true".
			 */
			checkForward: function() {
				return iterate.call( this, false, true ) !== false;
			},

			/**
			 * Check all nodes at left, executing the evaluation fuction.
			 * @returns {Boolean} "false" if the evaluator function returned
			 *		"false" for any of the matched nodes. Otherwise "true".
			 */
			checkBackward: function() {
				return iterate.call( this, true, true ) !== false;
			}
		}
	});
})();
