'use strict';

(function() {

	CKCONSOLE.add( 'widget', {
		panels: [
			{
				type: 'box',
				content: '<ul class="ckconsole_list ckconsole_value" data-value="instances"></ul>',

				refresh: function( editor ) {
					var instances = obj2Array( editor.widgets.instances );

					return {
						header: 'Instances (' + instances.length + ')',
						instances: generateInstancesList( instances )
					};
				}
			},
			{
				type: 'log',

				on: function( editor, log, logFn ) {
					editor.on( 'selectionChange', logFn( 'selectionChange' ) );
					editor.widgets.on( 'instanceDestroyed', logFn( 'widget destroyed' ) );
					editor.widgets.on( 'instanceCreated', logFn( 'widget created' ) );
				}
			}
		]
	} );

	function generateInstancesList( instances ) {
		var html = '',
			instance;

		for ( var i = 0; i < instances.length; ++i ) {
			instance = instances[ i ];
			html += itemTpl.output( { id: instance.id, name: instance.name, data: JSON.stringify( instance.data ) } );
		}
		return html;
	}

	function obj2Array( obj ) {
		var arr = [];
		for ( var id in obj )
			arr.push( obj[ id ] );

		return arr;
	}

	var itemTpl = new CKEDITOR.template( '<li>id: <code>{id}</code>, name: <code>{name}</code>, data: <code>{data}</code></li>' );
})();