/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.dialog.add( 'scaytcheck', function( editor ) {
	var firstLoad = true,
		captions,
		doc = CKEDITOR.document,
		fckLang = "en";

	var init_with_captions = function() {
			var dialog = this,
				lang_list = dialog.data.scayt.getLangList(),
				buttons = [ 'dic_create', 'dic_delete', 'dic_rename', 'dic_restore' ],
				labels = [ 'mixedCase', 'mixedWithDigits', 'allCaps', 'ignoreDomainNames' ];

			/*
		// Add buttons titles
		for ( var i in buttons )
		{
			var button = buttons[ i ];
			doc.getById( button ).setHtml( captions[ "button_" + button] );
		}
		doc.getById( "dic_info" ).setHtml( captions[ "dic_info" ] );
*/

			// Fill options and dictionary labels.
			for ( var i in labels ) {
				var label = "label_" + labels[ i ];
				var labelElement = doc.getById( label );
				if ( labelElement )
					labelElement.setHtml( captions[ label ] );
			}

			var about = '<p>' + captions[ "about_throwt_image" ] + '</p>' +
									'<p>' + captions[ "version" ] + dialog.data.scayt.version.toString() + '</p>' +
									'<p>' + captions[ "about_throwt_copy" ] + '</p>';

			doc.getById( "scayt_about" ).setHtml( about );

			// Create languages tab.
			var createOption = function( option, list ) {
					var label = doc.createElement( 'label' );
					label.setAttribute( 'for', 'cke_option' + option );
					label.setHtml( list[ option ] );

					if ( dialog.sLang == option ) // Current.
					dialog.chosed_lang = option;

					var div = doc.createElement( 'div' );
					radio = CKEDITOR.dom.element.createFromHtml( '<input id="cke_option' +
						option + '" type="radio" ' +
						( dialog.sLang == option ? 'checked="checked"' : '' ) +
						' value="' + option + '" name="scayt_lang" />' );

					radio.on( 'click', function() {
						this.$.checked = true;
						dialog.chosed_lang = option;
					});

					div.append( radio );
					div.append( label );

					return {
						lang: list[ option ],
						code: option,
						radio: div
					}
				};

			var langList = [];
			for ( var i in lang_list.rtl )
				langList[ langList.length ] = createOption( i, lang_list.ltr )

			for ( var i in lang_list.ltr )
				langList[ langList.length ] = createOption( i, lang_list.ltr )

			langList.sort( function( lang1, lang2 ) {
				return ( lang2.lang > lang1.lang ) ? -1 : 1;
			});

			var fieldL = doc.getById( 'scayt_lcol' ),
				fieldR = doc.getById( 'scayt_rcol' );
			for ( var i = 0; i < langList.length; i++ ) {
				var field = ( i < langList.length / 2 ) ? fieldL : fieldR;
				field.append( langList[ i ].radio );
			}
		};
	var reload = function() {
			var dialog = this;

			// Animate options.
			for ( var i in dialog.options ) {
				var checkbox = doc.getById( i );
				if ( checkbox ) {
					checkbox.removeAttribute( 'checked' );
					if ( dialog.options[ i ] == 1 )
						checkbox.setAttribute( 'checked', "checked" );

					// Bind events. Do it only once.
					if ( firstLoad ) {
						checkbox.on( 'click', function() {
							dialog.options[ this.getId() ] = this.$.checked ? 1 : 0;
						})
					}
				}
			}

			// * user dictionary    
			var dic_buttons = [
				// [0] contains buttons for creating
							"dic_create,dic_restore",
				// [1] contains buton for manipulation 
							"dic_rename,dic_delete,dic_restore"
				];
			scayt.getNameUserDictionary( function( o ) {
				var dic_name = o.dname;
				if ( dic_name ) {
					dojo.byId( 'dic_name' ).value = dic_name;
					display_dic_buttons( dic_buttons[ 1 ] );
				} else
					display_dic_buttons( dic_buttons[ 0 ] );

			}, function() {} );

			var dic_flag = 0;
			// ** bind event listeners
			dojo.query( "div.dic_buttons a.button" ).onclick( function( ev ) {
				if ( typeof window[ this.id ] == 'function' ) {
					// get dic name
					var dic_name = dojo.trim( dojo.byId( 'dic_name' ).value );
					// check common dictionary rules
					if ( !dic_name ) {
						dic_error_message( editor.lang.scayt.emptyDic );
						return false;
					}
					//apply handler
					window[ this.id ].apply( window, [ this, ev, dic_name, dic_buttons ] );
				}
				//console.info( typeof window[this.id], window[this.id].calle )
				return false;
			});
		};

	return {
		title: editor.lang.scayt.title,
		minWidth: 340,
		minHeight: 200,
		onShow: function() {
			var dialog = this;
			dialog.data = editor.fire( "scaytDialog", {} );
			dialog.options = dialog.data.scayt_control.option();
			dialog.sLang = dialog.data.scayt_control.sLang;

			if ( !dialog.data || !dialog.data.scayt || !dialog.data.scayt_control ) {
				alert( "Error loading application service" );
				dialog.hide();
				return;
			}

			var stop = 0;
			if ( firstLoad ) {
				dialog.data.scayt.getCaption( 'en', function( caps ) {
					if ( stop++ > 0 ) // Once only
					return;
					captions = caps;
					init_with_captions.apply( dialog );
					reload.apply( dialog );
					firstLoad = false;
				});
			} else
				reload.apply( dialog );

			dialog.selectPage( dialog.data.tab );
		},
		onOk: function() {
			var scayt_control = this.data.scayt_control;
			o = scayt_control.option();
			c = 0;

			// Set upp options if any was set.
			for ( var oN in this.options ) {
				if ( o[ oN ] != this.options[ oN ] && c == 0 ) {
					scayt_control.option( this.options );
					c++;
				}
			}

			// Setup languge if it was changed.
			var csLang = this.chosed_lang;
			if ( csLang && this.data.sLang != csLang ) {
				scayt_control.setLang( csLang );
				c++;
			}
			if ( c > 0 )
				scayt_control.refresh();
		},
		contents: [
			{
			id: 'options',
			label: editor.lang.scayt.optionsTab,
			elements: [
				{
				type: 'html',
				id: 'options',
				html: '<div class="inner_options">' +
					'	<div class="messagebox"></div>' +
					'	<div>' +
					'		<input type="checkbox" value="0" id="allCaps" />' +
					'		<label for="allCaps" id="label_allCaps"></label>' +
					'	</div>' +
					'	<div>' +
					'		<input type="checkbox" value="0" id="ignoreDomainNames" />' +
					'		<label for="ignoreDomainNames" id="label_ignoreDomainNames"></label>' +
					'	</div>' +
					'	<div>' +
					'	<input type="checkbox" value="0" id="mixedCase" />' +
					'		<label for="mixedCase" id="label_mixedCase"></label>' +
					'	</div>' +
					'	<div>' +
					'		<input type="checkbox" value="0" id="mixedWithDigits" />' +
					'		<label for="mixedWithDigits" id="label_mixedWithDigits"></label>' +
					'	</div>' +
					'</div>'
			}
			]
		},
			{
			id: 'langs',
			label: editor.lang.scayt.languagesTab,
			elements: [
				{
				type: 'html',
				id: 'langs',
				html: '<div class="inner_langs">' +
					'	<div class="messagebox"></div>	' +
					'   <div style="float:left;width:47%;margin-left:5px;" id="scayt_lcol" ></div>' +
					'   <div style="float:left;width:47%;margin-left:15px;" id="scayt_rcol"></div>' +
					'</div>'
			}
			]
		},
			/*
				{
					id : 'dictionaries',
					label : editor.lang.scayt.dictionariesTab,
					elements : [
						{
							type : 'html',
							style: '',
							id : 'dic',
							html : 	'<div class="inner_dictionary">' +
									'	<div class="messagebox" id="dic_message"></div>' +
									'	<div class="dictionary" > ' +
									'		<label for="dname" id="dname"></label>' +
									'		<input type="text" size="14" maxlength="15" value="" id="dic_name" name="dic_name"/>' +
									'		<div class="dic_buttons">' +
									'			<a href="javascript:void(0)" id="dic_create" class="button"></a>' +
									'			<a href="javascript:void(0)" id="dic_delete" class="button"></a>' +
									'			<a href="javascript:void(0)" id="dic_rename" class="button"></a>' +
									'			<a href="javascript:void(0)" id="dic_restore" class="button"></a>' +
									'		</div>' +
									'	</div><p id="dic_info"></p>' +
									'</div>'
						}
					]
				},
				*/
			{
			id: 'about',
			label: editor.lang.scayt.aboutTab,
			elements: [
				{
				type: 'html',
				id: 'about',
				style: "margin: 10px 40px;",
				html: '<div id="scayt_about"></div>'
			}
			]
		}
		]
	};
});
