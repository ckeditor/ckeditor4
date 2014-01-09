CKEDITOR.plugins.add( 'linksei',
{
	requires: 'widget',
	icons: 'linksei',
	
	
	onLoad: function() {
		CKEDITOR.addCss( '.ancoraSei' +
			'{' +
				'background-color: #d5d5d5;' +
				//( CKEDITOR.env.gecko ? 'cursor: default;' : '' ) +
			'}'
			);
	},
	init: function( editor )
	{
		CKEDITOR.dialog.add('linksei',this.path+'dialogs/linksei.js');
		editor.ui.addButton( 'linksei', {
	    label: 'Inserir um Link para processo ou documento do SEI!',
	    command: 'linksei',
	    toolbar: 'insert'
	});
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
				var id=this.element.getAttribute('id');
				if (id) this.setData('id',id);
				this.setData('protocolo',this.element.getHtml());
			},
			data: function() {
				this.element.setAttribute('id',this.data.id);
				this.element.setHtml(this.data.protocolo);
			}
						
		});
	}
} );