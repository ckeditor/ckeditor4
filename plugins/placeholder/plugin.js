/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview The "placeholder" plugin.
 *
 */

'use strict';

( function() {
  CKEDITOR.plugins.add( 'placeholder', {
    requires: 'widget,dialog',
    lang: 'af,ar,az,bg,ca,cs,cy,da,de,de-ch,el,en,en-au,en-gb,eo,es,es-mx,et,eu,fa,fi,fr,fr-ca,gl,he,hr,hu,id,it,ja,km,ko,ku,lv,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
    icons: 'placeholder', // %REMOVE_LINE_CORE%
    hidpi: true, // %REMOVE_LINE_CORE%

    onLoad: function() {
      // Register styles for placeholder widget frame.
     CKEDITOR.addCss('.cke_placeholder{background-color:#fff8ca;margin-right:5px;}');
    },

    init: function( editor ) {

      var lang = editor.lang.placeholder;

      // Register dialog.
      CKEDITOR.dialog.add( 'placeholder', this.path + 'dialogs/placeholder.js' );

      // Put ur init code here.
      editor.widgets.add( 'placeholder', {
        // Widget code.
        dialog: 'placeholder',
        pathName: lang.pathName,
        // We need to have wrapping element, otherwise there are issues in
        // add dialog.
        template: '<span class="cke_placeholder">[[]]</span>',

        upcast: function(el) {
          if(el.name !== "span") {
            return;
          }
          var isPlaceholder = el.attributes['data-widget-type'] === 'placeholder';
          if(!isPlaceholder) {
            return;
          }
          el.addClass('cke_placeholder');
          return el;
        },

        downcast: function() {
          return new CKEDITOR.htmlParser.text( '[[' + this.data.name + ']]' );
        },

        init: function() {
          // Note that placeholder markup characters are stripped for the name.
          this.setData( 'name', this.element.getText().slice( 2, -2 ) );
        },

        data: function() {
          this.element.setText( '[[' + this.data.name + ']]' );
        },

        getLabel: function() {
          return this.editor.lang.widget.label.replace( /%1/, this.data.name + ' ' + this.pathName );
        }
      } );

      editor.ui.addButton && editor.ui.addButton( 'CreatePlaceholder', {
        label: lang.toolbar,
        command: 'placeholder',
        toolbar: 'insert,100',
        icon: 'placeholder',
        title: 'Using this option, candidate name and recruiter name will be automatically added to the invite'
      } );
    },

    afterInit: function( editor ) {
      var placeholderReplaceRegex = /\[\[([^\[\]])+\]\]/g;

      editor.dataProcessor.dataFilter.addRules( {
        text: function( text, node ) {
          var dtd = node.parent && CKEDITOR.dtd[ node.parent.name ];

          // Skip the case when placeholder is in elements like <title> or <textarea>
          // but upcast placeholder in custom elements (no DTD).
          if ( dtd && !dtd.span )
            return;

          return text.replace( placeholderReplaceRegex, function( match ) {
            // Creating widget code.

            var option = match.match(/^\[\[(.*?)\]\]$/)[1].toLowerCase();
            /**
            * This values needs to be mapped as in backend we have
            * {{ candidate.name }} and {{ recruiter.name }}
            **/
            var backendMapping = {'[[Candidate Name]]': '{{ candidate.name }}', '[[Recruiter Name]]': '{{ recruiter.name }}'}

            var widgetWrapper = null,
              innerElement = new CKEDITOR.htmlParser.element('span', {
                class: 'cke_placeholder','data-balloon': 'This automatically adds the '+ option+' in the invite','data-balloon-pos':'down', 'data-balloon-length':'medium','data-widget-type':'placeholder'
              });

            // Adds placeholder identifier as innertext.
            innerElement.add( new CKEDITOR.htmlParser.text( backendMapping[match] ) );
            widgetWrapper = editor.widgets.wrapElement( innerElement, 'placeholder' );

            // Return outerhtml of widget wrapper so it will be placed
            // as replacement.
            return widgetWrapper.getOuterHtml();
          } );
        }
      } );
    }
  } );

} )();
