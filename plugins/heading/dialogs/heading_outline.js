/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.dialog.add( 'headingOutline', function( editor ) {
  var lang = editor.lang.about;

  var myEditor = editor;

  return {
    title: editor.lang.heading.outlineLabel,
    minWidth: 500,
    minHeight: 300,
    onShow: function( event ) {

      function createTOC(hlist, index, level) {

        var html = '';

        if (index < hlist.length) {

          var h = hlist[index];

          if (h.level >= level) {
            if (h.level === level) {
              html = '<li style="margin-left: ' + level + 'em">' + h.name + ' (level ' + h.level + ')</li>';
              html += createTOC(hlist, (index+1), level);
            }
            else {
              html = '<li><ol>';
              html += createTOC(hlist, index, (level+1));
              html += '</li></ol>';
            }
          }
        }
        return html;
      }

      function getHeadings(element) {

        function nextHeading(element) {
            if ( typeof element.getName !== 'function' )
              return false;

            if ( !element )
              return true;

            var tagName = element.getName();

            switch ( tagName ) {
              case 'h1':
                headings.push({ name: element.getText(), level: 1});
                break;

              case 'h2':
                headings.push({ name: element.getText(), level: 2});
                break;

              case 'h3':
                headings.push({ name: element.getText(), level: 3});
                break;

              case 'h4':
                headings.push({ name: element.getText(), level: 4});
                break;

              case 'h5':
                headings.push({ name: element.getText(), level: 5});
                break;

              case 'h6':
                headings.push({ name: element.getText(), level: 6});
                break;

              default:
                break;  
            }

            var children = element.getChildren();
            var count = children.count();

            for ( var i = 0; i < count; i++ ) {
              if ( nextHeading( children.getItem( i ) ) )
                return true;
            }
            return false;
        } // endnextHeading

        var headings = [];

        nextHeading(element);

        return headings;

    } // end getHeadings

      console.log(event.name + " " + event.sender._.name);

      var select = document.getElementById('headingOutlineSelect');

      var headings = getHeadings(myEditor.document.getBody());

      select.innerHTML = createTOC(headings, 0, 1);

    },

    contents: [
      {
        id: 'tab1',
        label: '',
        title: '',
        expand: true,
        padding: 0,
        elements: [
          {
            type: 'html',
            html: '<div><ol id="headingOutlineSelect"></ol></div>'          
          },
          {
              type: 'checkbox',
              id: 'showHeadingLevel3',
              label: 'Level 3',
              'default': true
          },
          {
              type: 'checkbox',
              id: 'showHeadingLevel4',
              label: 'Level 4',
              'default': true
          },
          {
              type: 'checkbox',
              id: 'showHeadingLevel5',
              label: 'Level 5',
              'default': true
          },
          {
              type: 'checkbox',
              id: 'showHeadingLevel6',
              label: 'Level 6',
              'default': true
          }
        ]
      }
    ],


    buttons: [ CKEDITOR.dialog.cancelButton ]
  };
} );
