// There is no constructor for this class, the user just has to define an
// object with the appropriate properties.
function randomString() {
    var length = 16;
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function getDecimals(text) {
  var matchedData = text.match(/\.([\s\S]*)$/);
  if(!matchedData) return 0;
  var charsAfterTheDot = matchedData[1];
  if(!charsAfterTheDot) return 0;
  return charsAfterTheDot.length
}
CKEDITOR.dialog.add( 'rkpi', function( editor ) {
    return {
        title:          'Animated Numbers',
        resizable:      CKEDITOR.DIALOG_RESIZE_NONE,
        minWidth:       300,
        minHeight:      200,
        onShow : function() {
            var text = editor.getSelection().getSelectedText();
            var element = editor.getSelection().getStartElement().$;
            var isEdit = element.getAttribute('data-start-counter-class') != null;
            if(isEdit) {
              this.setValueOf("tab1", "countTo", element.getAttribute('data-to'));
              this.setValueOf("tab1", "countFrom", element.getAttribute('data-from'));
              this.setValueOf("tab1", "prefix", element.getAttribute('data-prefix'));
              this.setValueOf("tab1", "suffix", element.getAttribute('data-suffix'));
              this.setValueOf("tab1", "speed", element.getAttribute('data-speed'));
            } else {
              if(new RegExp(/\d/).test(text)) { // parse text only if at least 1 number char
                var prefix = (text.match(/^[^0-9]+/) || [])[0];
                text = text.replace(prefix, '');
                var number = text.match(/^[0-9|,|\.]+/)[0];
                text = text.replace(number, '');
                number = number.replace(/,/g, '');
                var suffix = (text.match(/^[^0-9]+/) || [])[0];
                this.setValueOf("tab1", "countTo", number);
                this.setValueOf("tab1", "prefix", prefix);
                this.setValueOf("tab1", "suffix", suffix);
              }
            }
        },
        onOk: function () {

          var element = editor.getSelection().getStartElement().$;
          var selection = editor.getSelection().getSelectedText();
          var isEdit = element.getAttribute('data-start-counter-class') != null;
          var countTo = this.getValueOf( 'tab1', 'countTo' );
          var countFrom = this.getValueOf( 'tab1', 'countFrom' );
          var prefix = this.getValueOf( 'tab1', 'prefix' );
          var suffix = this.getValueOf( 'tab1', 'suffix' );
          var speed = this.getValueOf( 'tab1', 'speed' );
          var displayText = prefix + countTo.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',') + suffix;
          var decimalsDigitsTo = getDecimals(countTo);
          var decimalsDigitsFrom = getDecimals(countFrom);
          var decimals = decimalsDigitsTo > decimalsDigitsFrom ? decimalsDigitsTo : decimalsDigitsFrom;
          if(isEdit) {
            element.setAttribute('data-to', countTo);
            element.setAttribute('data-from', countFrom);
            element.setAttribute('data-prefix', prefix);
            element.setAttribute('data-suffix', suffix);
            element.setAttribute('data-speed', speed);
            element.setAttribute('data-decimals', decimals);
            element.innerHTML = displayText;
          } else if (selection == element.innerText && element.tagName == "SPAN") { // add if exists
            var className = 'rkpi-' + randomString();
            element.setAttribute('data-to', countTo);
            element.setAttribute('data-from', countFrom);
            element.setAttribute('data-prefix', prefix);
            element.setAttribute('data-suffix', suffix);
            element.setAttribute('data-speed', speed);
            element.setAttribute('data-decimals', decimals);
            element.setAttribute('data-start-counter-class', className);
            element.setAttribute('contentEditable', false);
            element.innerHTML = displayText;
            element.classList.add(className);
          } else {
            var className = 'rkpi-' + randomString();
            var tag = editor.document.createElement( 'span', {
              attributes: {
                'data-to': countTo,
                'data-from': countFrom,
                'data-prefix': prefix,
                'data-suffix': suffix,
                'data-speed': speed,
                'data-start-counter-class': className,
                'data-decimals': decimals,
                'class': className,
                'contentEditable': false
              }
            } );
            tag.setHtml(displayText);
            editor.insertElement( tag );
          }

    			this.hide();

        },
        contents: [
            {
                id:         'tab1',
                label:      'First Tab',
                title:      'First Tab Title',
                accessKey:  'Q',
                elements: [
                  {
                      type:           'text',
                      label:          'COUNT TO',
                      id:             'countTo',
                      validate:       CKEDITOR.dialog.validate.number('Count to must be a number'),
                      'default':      '100'
                  }, {
                      type:           'text',
                      label:          'COUNT FROM',
                      id:             'countFrom',
                      validate:       CKEDITOR.dialog.validate.number('Count from must be a number'),
                      'default':      '0'
                  }, {
                      type:           'text',
                      label:          'PREFIX',
                      id:             'prefix',
                      'default':      '~'
                  }, {
                      type:           'text',
                      label:          'SUFFIX',
                      id:             'suffix',
                      'default':      '$'
                  }, {
                    type: 'radio',
                    id: 'speed',
                    label: 'Running speed',
                    items: [ [ 'Fast', '1200' ], [ 'Medium', '1800' ], [ 'Slow', '2500' ] ],
                    'default': '1800'
                }
                ]
            }
        ]
    };
} );
