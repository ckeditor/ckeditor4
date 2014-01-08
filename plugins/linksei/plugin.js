CKEDITOR.plugins.add( 'linksei',
{
	requires: 'widget',
	icons: 'sei',
	
	onLoad: function() {
		CKEDITOR.addCss( '.ancoraSei' +
			'{' +
				'background-color: #d5d5d5;' +
				( CKEDITOR.env.gecko ? 'cursor: default;' : '' ) +
			'}'
			);
	},
	init: function( editor )
	{
		editor.widgets.add('linksei',{
			button: 'Inserir um Link para processo ou documento do SEI!',
			template: '<a id="lnkSei" class="ancoraSei" style="text-indent:0px;">Title</a>',
			allowedContent: 'a(!ancoraSei)',
			requiredContent: 'a(ancoraSei)',
			upcast: function(element) {
				return element.name=='a' && element.hasClass('ancoraSei');
			},
			dialog: 'linksei',
			init: function() {
				var id=this.element.getAttr('id');
				if (id) this.setData('id',id);
			},
			data: function() {
				this.element.setAttr('id',id);
			}
						
		});
	}
} );