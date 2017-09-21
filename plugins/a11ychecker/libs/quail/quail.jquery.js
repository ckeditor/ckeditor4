// %LEAVE_UNMINIFIED% %REMOVE_LINE%
/*! QUAIL quailjs.org | quailjs.org/license */
;(function($) {
'use strict';
// Polyfill Function.prototype.bind
// @see https://gist.github.com/dsingleton/1312328
Function.prototype.bind=Function.prototype.bind||function(b){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");}var a=Array.prototype.slice,f=a.call(arguments,1),e=this,c=function(){},d=function(){return e.apply(this instanceof c?this:b||window,f.concat(a.call(arguments)));};c.prototype=this.prototype;d.prototype=new c();return d;};

var quail = {

  options : { },

  components : { },

  lib : { },

  testabilityTranslation : {
    0      : 'suggestion',
    0.5    : 'moderate',
    1      : 'severe'
  },

  html : null,

  strings : { },

  accessibilityResults : { },

  accessibilityTests : null,

  guidelines: {
    wcag: {
      /**
       * Perform WCAG specific setup.
       */
      setup: function (tests, listener, callbacks) {
        callbacks = callbacks || {};
        // Associate Success Criteria with the TestCollection.
        for (var sc in this.successCriteria) {
          if (this.successCriteria.hasOwnProperty(sc)) {
            var criteria = this.successCriteria[sc];
            criteria.registerTests(tests);
            if (listener && listener.listenTo && typeof listener.listenTo === 'function') {
              // Allow the invoker to listen to successCriteriaEvaluated events
              // on each SuccessCriteria.
              if (callbacks.successCriteriaEvaluated) {
                listener.listenTo(criteria, 'successCriteriaEvaluated', callbacks.successCriteriaEvaluated);
              }
            }
          }
        }
      },
      successCriteria: { }
    }
  },

  // @var TestCollection
  tests : { },

  /**
   * A list of HTML elements that can contain actual text.
   */
  textSelector : ':not(:empty)',

  /**
   * Suspect tags that would indicate a paragraph is being used as a header.
   * I know, font tag, I know. Don't get me started.
   */
  suspectPHeaderTags : ['strong', 'b', 'em', 'i', 'u', 'font'],

  /**
   * Suspect CSS styles that might indicate a paragraph tag is being used as a header.
   */
  suspectPCSSStyles : ['color', 'font-weight', 'font-size', 'font-family'],

  /**
   * Elements that can (naturally) receive keyboard focus.
   */
  focusElements : 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]',

  /**
   * Regular expression to find emoticons.
   */
  emoticonRegex: /((?::|;|B|P|=)(?:-)?(?:\)|\(|o|O|D|P))/g,

  /**
   * A list of self-closing tags.
   */
  selfClosingTags : ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'],


  /**
   * A list of tags that optionally can be closed
   */
  optionalClosingTags: ['p', 'li', 'th','tr', 'td'],

  /**
   * Main run function for quail. It bundles up some accessibility tests,
   * and if tests are not passed, it instead fetches them using getJSON.
   */
  run : function (options) {
    if (options.reset) {
      quail.accessibilityResults = { };
    }

    function buildTests (quail, data, options) {
      // Filter for specific tests.
      if (options.guideline && options.guideline.length) {
        quail.tests = quail.lib.TestCollection([], {
          scope: quail.html || null
        });
        for (var i = 0, il = options.guideline.length; i < il; ++i) {
          var t = options.guideline[i];
          if (data[t]) {
            data[t].scope = quail.html || null;
            quail.tests.set(t, data[t]);
          }
        }
      }
      // Or use all of the tests.
      else {
        quail.tests = quail.lib.TestCollection(data, {
          scope: quail.html || null
        });
      }
    }

    /**
     * A private, internal run function.
     *
     * This function is called when the tests are collected, which might occur
     * after an AJAX request for a test JSON file.
     */
    function _run () {
      // Push custom tests into the test collection.
      if (typeof options.customTests !== 'undefined') {
        for (var testName in options.customTests) {
          if (options.customTests.hasOwnProperty(testName)) {
            options.customTests[testName].scope = quail.html || null;
            quail.tests.set(testName, options.customTests[testName]);
          }
        }
      }

      // Set up Guideline-specific behaviors.
      var noop = function () {};
      for (var guideline in quail.guidelines) {
        if (quail.guidelines[guideline] && typeof quail.guidelines[guideline].setup === 'function') {
          quail.guidelines[guideline].setup(quail.tests, this, {
            successCriteriaEvaluated: options.successCriteriaEvaluated || noop
          });
        }
      }

      // Invoke all the registered tests.
      quail.tests.run({
        preFilter: options.preFilter || function () {},
        caseResolve: options.caseResolve || function () {},
        testComplete: options.testComplete || function () {},
        testCollectionComplete: options.testCollectionComplete || function () {},
        complete: options.complete || function () {}
      });
    }

    // Create an empty TestCollection.
    quail.tests = quail.lib.TestCollection([], {
      scope: quail.html || null
    });
    // The quail builder at quailjs.org/build provides an in-scope test object.
    if (typeof quailBuilderTests !== 'undefined') {
      quail.tests = quail.lib.TestCollection(quailBuilderTests, {
        scope: quail.html || null
      });
      _run.call(quail);
    }
    // Let wcag2 run itself, will call quail again when it knows what
    // to
    else if (options.guideline === 'wcag2') {
      quail.lib.wcag2.run(options);
    }

    // If a list of specific tests is provided, use them.
    else if (options.accessibilityTests) {
      buildTests(quail, options.accessibilityTests, options);
      _run.call(quail);
    }

    // Otherwise get the tests from the json data list.
    else {
      var url = options.jsonPath;
      // Get a specific guideline.
      if (typeof options.guideline === 'string') {
        url += '/guidelines/' + options.guideline;
      }

      $.ajax({
        url : url + '/tests.json',
        dataType : 'json',
        success : function (data) {
          if (typeof data === 'object') {
            buildTests(quail, data, options);
            _run.call(quail);
          }
        },
        error : function () {
          throw new Error('Tests could not be loaded');
        }
      });
    }
  },

  // @todo, make this a set of methods that all classes extend.
  listenTo: function (dispatcher, eventName, handler) {
    // @todo polyfill Function.prototype.bind.
    handler = handler.bind(this);
    dispatcher.registerListener.call(dispatcher, eventName, handler);
  },

  getConfiguration : function(testName) {
    var test = this.tests.find(testName);
    var guidelines = test && test.get('guidelines');
    var guideline = guidelines && this.options.guidelineName && guidelines[this.options.guidelineName];
    var configuration = guideline && guideline.configuration;
    if (configuration) {
      return configuration;
    }
    return false;
  },

  /**
   * Helper function to determine if a string of text is even readable.
   * @todo - This will be added to in the future... we should also include
   * phonetic tests.
   */
  isUnreadable : function(text) {
    if (typeof text !== 'string') {
      return true;
    }
    return (text.trim().length) ? false : true;
  },

  /**
   * Read more about this function here: https://github.com/kevee/quail/wiki/Layout-versus-data-tables
   */
  isDataTable : function(table) {
    // If there are less than three rows, why do a table?
    if (table.find('tr').length < 3) {
      return false;
    }
    // If you are scoping a table, it's probably not being used for layout
    if (table.find('th[scope]').length) {
      return true;
    }
    var numberRows = table.find('tr:has(td)').length;
    // Check for odd cell spanning
    var spanCells = table.find('td[rowspan], td[colspan]');
    var isDataTable = true;
    if (spanCells.length) {
      var spanIndex = {};
      spanCells.each(function() {
        if (typeof spanIndex[$(this).index()] === 'undefined') {
          spanIndex[$(this).index()] = 0;
        }
        spanIndex[$(this).index()]++;
      });
      $.each(spanIndex, function(index, count) {
        if (count < numberRows) {
          isDataTable = false;
        }
      });
    }
    // If there are sub tables, but not in the same column row after row, this is a layout table
    var subTables = table.find('table');
    if (subTables.length) {
      var subTablesIndexes = {};
      subTables.each(function() {
        var parentIndex = $(this).parent('td').index();
        if (parentIndex !== false && typeof subTablesIndexes[parentIndex] === 'undefined') {
          subTablesIndexes[parentIndex] = 0;
        }
        subTablesIndexes[parentIndex]++;
      });
      $.each(subTablesIndexes, function(index, count) {
        if (count < numberRows) {
          isDataTable = false;
        }
      });
    }
    return isDataTable;
  },

  /**
   *  Returns text contents for nodes depending on their semantics
   */
  getTextContents : function($element) {
    if ($element.is('p, pre, blockquote, ol, ul, li, dl, dt, dd, figure, figcaption')) {
      return $element.text();
    }
    // Loop through all text nodes to get everything around children.
    var text = '';
    var children = $element[0].childNodes;
    for (var i = 0, il = children.length; i < il; i += 1) {
      // Only text nodes.
      if (children[i].nodeType === 3) {
        text += children[i].nodeValue;
      }
    }
    return text;
  },

  /**
   * Helper function to determine if a given URL is even valid.
   */
  validURL : function(url) {
    return url.search(' ') === -1;
  },

  cleanString : function(string) {
    return string.toLowerCase().replace(/^\s\s*/, '');
  },

  containsReadableText : function(element, children) {
    element = element.clone();
    element.find('option').remove();
    if (!quail.isUnreadable(element.text())) {
      return true;
    }
    if (!quail.isUnreadable(element.attr('alt'))) {
      return true;
    }
    if (children) {
      var readable = false;
      element.find('*').each(function() {
        if (quail.containsReadableText($(this), true)) {
          readable = true;
        }
      });
      if (readable) {
        return true;
      }
    }
    return false;
  }
};

// Provide a global to access quail.
if (window) {
  window.quail = quail;
}

$.fn.quail = function(options) {
  if (!this.length) {
    return this;
  }
  quail.options = options;
  quail.html = this;

  quail.run(options);

  return this;
};

$.expr[':'].quailCss = function(obj, index, meta) {
  var args = meta[3].split(/\s*=\s*/);
  return $(obj).css(args[0]).search(args[1]) > -1;
};

quail.components.acronym = function(quail, test, Case) {
  test.get('$scope').each(function() {
    var $scope = $(this);
    var alreadyReported = { };
    var predefined = { };

    // Find defined acronyms within this scope.
    $scope.find('acronym[title], abbr[title]').each(function() {
      predefined[$(this).text().toUpperCase().trim()] = $(this).attr('title');
    });

    // Consider all block-level html elements that contain text.
    $scope.find('p, div, h1, h2, h3, h4, h5').each(function(){
      var el = this;
      var $el = $(el);

      var words = $el.text().split(' ');
      // Keep a list of words that might be acronyms.
      var infractions = [];
      // If there is more than one word and ??.
      if (words.length > 1 && $el.text().toUpperCase() !== $el.text()) {
        // Check each word.
        $.each(words, function(index, word) {
          // Only consider words great than one character.
          if (word.length < 2) {
            return;
          }
          // Only consider words that have not been predefined.
          // Remove any non-alpha characters.
          word = word.replace(/[^a-zA-Zs]/, '');
          // If this is an uppercase word that has not been defined, it fails.
          if (word.toUpperCase() === word && typeof predefined[word.toUpperCase().trim()] === 'undefined') {
            if (typeof alreadyReported[word.toUpperCase()] === 'undefined') {
              infractions.push(word);
            }
            alreadyReported[word.toUpperCase()] = word;
          }
        });
        // If undefined acronyms are discovered, fail this case.
        if (infractions.length) {
          test.add(Case({
            element: el,
            expected: $el.closest('.quail-test').data('expected'),
            info: {acronyms : infractions},
            status: 'failed'
          }));
        }
        else {
          test.add(Case({
            element: el,
            expected: $el.closest('.quail-test').data('expected'),
            status: 'passed'
          }));
        }
      }
      else {
        test.add(Case({
          element: el,
          expected: $el.closest('.quail-test').data('expected'),
          status: 'passed'
        }));
      }
    });

  });
};

quail.components.color = (function () {

  function buildCase(test, Case, element, status, id, message) {
    test.add(Case({
      element: element,
      expected: (function (element, id) {
        return quail.components.resolveExpectation(element, id);
      }(element, id)),
      message: message,
      status: status
    }));
  }

  function notempty(s) {
    return $.trim(s) !== '';
  }



  var colors = {
    cache: {},
    /**
     * Returns the lumosity of a given foreground and background object,
     * in the format of {r: red, g: green, b: blue } in rgb color values.
     */
    getLuminosity : function(foreground, background) {
      var cacheKey = 'getLuminosity_' + foreground + '_' + background;
      foreground = colors.parseColor(foreground);
      background = colors.parseColor(background);

      if (colors.cache[cacheKey] !== undefined) {
        return colors.cache[cacheKey];
      }

      var RsRGB = foreground.r/255;
      var GsRGB = foreground.g/255;
      var BsRGB = foreground.b/255;
      var R = (RsRGB <= 0.03928) ? RsRGB/12.92 : Math.pow((RsRGB+0.055)/1.055, 2.4);
      var G = (GsRGB <= 0.03928) ? GsRGB/12.92 : Math.pow((GsRGB+0.055)/1.055, 2.4);
      var B = (BsRGB <= 0.03928) ? BsRGB/12.92 : Math.pow((BsRGB+0.055)/1.055, 2.4);

      var RsRGB2 = background.r/255;
      var GsRGB2 = background.g/255;
      var BsRGB2 = background.b/255;
      var R2 = (RsRGB2 <= 0.03928) ? RsRGB2/12.92 : Math.pow((RsRGB2+0.055)/1.055, 2.4);
      var G2 = (GsRGB2 <= 0.03928) ? GsRGB2/12.92 : Math.pow((GsRGB2+0.055)/1.055, 2.4);
      var B2 = (BsRGB2 <= 0.03928) ? BsRGB2/12.92 : Math.pow((BsRGB2+0.055)/1.055, 2.4);
      var l1, l2;
      l1 = (0.2126 * R + 0.7152 * G + 0.0722 * B);
      l2 = (0.2126 * R2 + 0.7152 * G2 + 0.0722 * B2);

      colors.cache[cacheKey] = Math.round((Math.max(l1, l2) + 0.05)/(Math.min(l1, l2) + 0.05)*10)/10;
      return colors.cache[cacheKey];
    },

    /**
     * Returns the average color for a given image
     * using a canvas element.
     */
    fetchImageColorAtPixel : function(img, x, y) {
      x = typeof x !== 'undefined' ? x : 1;
      y = typeof y !== 'undefined' ? y : 1;
      var can = document.createElement('canvas');
      var context = can.getContext('2d');
      context.drawImage(img, 0, 0);
      var data = context.getImageData(x, y, 1, 1).data;
      return 'rgb(' + data[0] + ',' + data[1] + ',' + data[2] + ')';
    },

    testElmContrast: function (algorithm, element, level) {
      var background = colors.getColor(element, 'background');
      return colors.testElmBackground(algorithm, element, background, level);
    },

    testElmBackground: function (algorithm, element, background, level) {
      var foreground = colors.getColor(element, 'foreground');
      var res;
      if (algorithm === 'wcag') {
        res = colors.passesWCAGColor(element, foreground, background, level);
      } else if (algorithm === 'wai') {
        res = colors.passesWAIColor(foreground, background);
      }
      return res;
    },

    /**
     * Returns whether an element's color passes
     * WCAG at a certain contrast ratio.
     */
    passesWCAGColor : function(element, foreground, background, level) {
      var pxfsize = quail.components.convertToPx(element.css('fontSize'));
      if (typeof level === 'undefined') {
        if (pxfsize >= 18) {
          level = 3;
        }
        else {
          var fweight = element.css('fontWeight');
          if (pxfsize >= 14 &&  (fweight === 'bold' || parseInt(fweight, 10) >= 700)) {
            level = 3;
          }
          else {
            level = 4.5;
          }
        }
      }
      return (colors.getLuminosity(foreground, background) > level);
    },

    /**
     * Returns whether an element's color passes
     * WAI brightness levels.
     */
    passesWAIColor : function(foreground, background) {
      var contrast   = colors.getWAIErtContrast(foreground, background);
      var brightness = colors.getWAIErtBrightness(foreground, background);

      return (contrast > 500 && brightness > 125);
    },

    /**
     * Compused contrast of a foreground and background
     * per the ERT contrast spec.
     */
    getWAIErtContrast : function(foreground, background) {
      var diffs = colors.getWAIDiffs(foreground, background);
      return diffs.red + diffs.green + diffs.blue;
    },

    /**
     * Computed contrast of a foreground and background
     * per the ERT brightness spec.
     */
    getWAIErtBrightness : function(foreground, background) {
      var diffs = colors.getWAIDiffs(foreground, background);
      return ((diffs.red * 299) + (diffs.green * 587) + (diffs.blue * 114)) / 1000;

    },

    /**
     * Returns differences between two colors.
     */
    getWAIDiffs : function(foreground, background) {
      return {
        red:   Math.abs(foreground.r - background.r),
        green: Math.abs(foreground.g - background.g),
        blue:  Math.abs(foreground.b - background.b)
      };
    },

    /**
     * Retrieves the background or foreground of an element.
     * There are some normalizations here for the way
     * different browsers can return colors, and handling transparencies.
     */
    getColor : function(element, type) {
      var self = colors;
      if (!element.attr('data-cacheId')) {
        element.attr('data-cacheId', 'id_' + Math.random());
      }
      var cacheKey = 'getColor_' + type + '_' + element.attr('data-cacheId');
      if (colors.cache[cacheKey] !== undefined) {
        return colors.cache[cacheKey];
      }

      if (type === 'foreground') {
        colors.cache[cacheKey] = (element.css('color')) ? element.css('color') : 'rgb(0,0,0)';
        return colors.cache[cacheKey];
      }

      var bcolor = element.css('background-color');
      if (colors.hasBackgroundColor(bcolor)) {
        colors.cache[cacheKey] = bcolor;
        return colors.cache[cacheKey];
      }

      element.parents().each(function(){
        var pcolor = $(this).css('background-color');
        if (colors.hasBackgroundColor(pcolor)) {
          return self.cache[cacheKey] = pcolor;
        }
      });
      // Assume the background is white.
      colors.cache[cacheKey] = 'rgb(255,255,255)';
      return colors.cache[cacheKey];
    },

    getForeground: function(element) {
      return colors.getColor(element, 'foreground');
    },

    /**
     * Returns an object with rgba taken from a string.
     */
    parseColor : function(color) {
      if (typeof color === 'object') {
        return color;
      }

      if (color.substr(0, 1) === '#') {
        return { r : parseInt(color.substr(1, 2), 16),
                 g : parseInt(color.substr(3, 2), 16),
                 b : parseInt(color.substr(5, 2), 16),
                 a : false
               };
      }

      if (color.substr(0, 3) === 'rgb') {
        color = color.replace('rgb(', '').replace('rgba(', '').replace(')', '').split(',');
        return { r : color[0],
                 g : color[1],
                 b : color[2],
                 a : ((typeof color[3] === 'undefined') ? false : color[3])
               };
      }
    },

    /**
     * Returns background image of an element or its parents.
     */
    getBackgroundImage: function(element) {
      if (!element.attr('data-cacheId')) {
        element.attr('data-cacheId', 'id_' + Math.random());
      }

      var cacheKey = 'getBackgroundImage_' + element.attr('data-cacheId');
      if (colors.cache[cacheKey] !== undefined) {
        return colors.cache[cacheKey];
      }
      element = element[0];
      while(element && element.nodeType === 1 && element.nodeName !== 'BODY' && element.nodeName !== 'HTML') {
        var bimage = $(element).css('background-image');
        if (bimage && bimage !== 'none' && bimage.search(/^(.*?)url(.*?)$/i) !== -1) {
          colors.cache[cacheKey] = bimage.replace('url(', '').replace(/['"]/g, '').replace(')', '');
          return colors.cache[cacheKey];
        }
        element = element.parentNode;
      }
      colors.cache[cacheKey] = false;
      return false;
    },

    /**
     * Returns background image of an element or its parents.
     */
    getBackgroundGradient: function(element) {
      if (!element.attr('data-cacheId')) {
        element.attr('data-cacheId', 'id_' + Math.random());
      }

      var cacheKey = 'getBackgroundGradient_' + element.attr('data-cacheId');
      if (colors.cache[cacheKey] !== undefined) {
        return colors.cache[cacheKey];
      }

      var notEmpty = function(s) {
        return $.trim(s) !== '';
      };
      element = element[0];
      while(element && element.nodeType === 1 && element.nodeName !== 'BODY' && element.nodeName !== 'HTML') {
        // Exit if element has a background color.
        if (colors.hasBackgroundColor($(element).css('background-color'))) {
          colors.cache[cacheKey] = false;
          return false;
        }
        var bimage = $(element).css('backgroundImage');
        if (bimage && bimage !== 'none' && bimage.search(/^(.*?)gradient(.*?)$/i) !== -1) {
          var gradient = bimage.match(/gradient(\(.*\))/g);
          if (gradient.length > 0) {
            gradient = gradient[0].replace(/(linear|radial|from|\bto\b|gradient|top|left|bottom|right|\d*%)/g, '');
            colors.cache[cacheKey] = $.grep(gradient.match(/(rgb\([^\)]+\)|#[a-z\d]*|[a-z]*)/g), notEmpty);
            return colors.cache[cacheKey];
          }
        }
        element = element.parentNode;
      }
      colors.cache[cacheKey] = false;
      return false;
    },

    /**
     * Calculates average color of an image.
     */
    getAverageRGB: function(img) {
      var cacheKey = img.src;
      if (colors.cache[cacheKey] !== undefined) {
        return colors.cache[cacheKey];
      }

      var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0, g:0, b:0, a:0},
        count = 0;

      if (!context) {
        colors.cache[cacheKey] = defaultRGB;
        return defaultRGB;
      }

      height = canvas.height = img.height;
      width = canvas.width = img.width;
      context.drawImage(img, 0, 0);

      try {
        data = context.getImageData(0, 0, width, height);
      } catch(e) {
        colors.cache[cacheKey] = defaultRGB;
        return defaultRGB;
      }

      length = data.data.length;

      while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
      }

      // ~~ used to floor values
      rgb.r = ~~(rgb.r/count);
      rgb.g = ~~(rgb.g/count);
      rgb.b = ~~(rgb.b/count);

      colors.cache[cacheKey] = rgb;
      return rgb;
    },

    /**
     * Convert color to hex value.
     */
    colorToHex: function(c) {
      var m = /rgba?\((\d+), (\d+), (\d+)/.exec(c);
      return m ? '#' + (1 << 24 | m[1] << 16 | m[2] << 8 | m[3]).toString(16).substr(1) : c;
    },

    /**
     * Check if element has a background color.
     */
    hasBackgroundColor: function(bcolor) {
      return bcolor !== 'rgba(0, 0, 0, 0)' && bcolor !== 'transparent';
    },

    /**
     * Traverse visual tree for background property.
     */
    traverseVisualTreeForBackground: function(element, property) {
      if (!element.attr('data-cacheId')) {
        element.attr('data-cacheId', 'id_' + Math.random());
      }

      var cacheKey = 'traverseVisualTreeForBackground_' + element.attr('data-cacheId') + '_' + property;
      if (colors.cache[cacheKey] !== undefined) {
        return colors.cache[cacheKey];
      }

      var foundIt;
      var scannedElements = [];

      // Scroll to make sure element is visible.
      element[0].scrollIntoView();

      // Get relative x and y.
      var x = element.offset().left - $(window).scrollLeft();
      var y = element.offset().top - $(window).scrollTop();

      // Hide current element.
      scannedElements.push({
        element: element,
        visibility: element.css('visibility')
      });
      element.css('visibility', 'hidden');

      // Get element at position x, y. This only selects visible elements.
      var el = document.elementFromPoint(x,y);
      while (foundIt === undefined && el && el.tagName !== 'BODY' && el.tagName !== 'HTML') {
        el = $(el);
        var bcolor = el.css('backgroundColor');
        var bimage;
        // Only check visible elements.
        switch (property) {
        case 'background-color':
          if (colors.hasBackgroundColor(bcolor)) {
            foundIt = bcolor;
          }
          break;
        case 'background-gradient':
          // Bail out if the element has a background color.
          if (colors.hasBackgroundColor(bcolor)) {
            foundIt = false;
            continue;
          }

          bimage = el.css('backgroundImage');
          if (bimage && bimage !== 'none' && bimage.search(/^(.*?)gradient(.*?)$/i) !== -1) {
            var gradient = bimage.match(/gradient(\(.*\))/g);
            if (gradient.length > 0) {
              gradient = gradient[0].replace(/(linear|radial|from|\bto\b|gradient|top|left|bottom|right|\d*%)/g, '');
              foundIt = $.grep(gradient.match(/(rgb\([^\)]+\)|#[a-z\d]*|[a-z]*)/g), notempty);
            }
          }
          break;
        case 'background-image':
          // Bail out if the element has a background color.
          if (colors.hasBackgroundColor(bcolor)) {
            foundIt = false;
            continue;
          }
          bimage = el.css('backgroundImage');
          if (bimage && bimage !== 'none' && bimage.search(/^(.*?)url(.*?)$/i) !== -1) {
            foundIt = bimage.replace('url(', '').replace(/['"]/g, '').replace(')', '');
          }
          break;
        }
        scannedElements.push({
          element: el,
          visibility: el.css('visibility')
        });
        el.css('visibility', 'hidden');
        el = document.elementFromPoint(x,y);
      }

      // Reset visibility.
      for(var i = 0; i < scannedElements.length; i++){
        scannedElements[i].element.css('visibility', scannedElements[i].visibility);
      }

      colors.cache[cacheKey] = foundIt;
      return foundIt;
    },

    /**
     * Get first element behind current with a background color.
     */
    getBehindElementBackgroundColor: function(element) {
      return colors.traverseVisualTreeForBackground(element, 'background-color');
    },

    /**
     * Get first element behind current with a background gradient.
     */
    getBehindElementBackgroundGradient: function(element) {
      return colors.traverseVisualTreeForBackground(element, 'background-gradient');
    },

    /**
     * Get first element behind current with a background image.
     */
    getBehindElementBackgroundImage: function(element) {
      return colors.traverseVisualTreeForBackground(element, 'background-image');
    }
  };

  function textShouldBeTested(textNode) {
    // We want a tag, not just the text node.
    var element = textNode.parentNode;
    var $this = $(element);

    // The nodeType of the element must be 1. Nodes of type 1 implement the Element
    // interface which is required of the first argument passed to window.getComputedStyle.
    // Failure to pass an Element <node> to window.getComputedStyle will raised an exception
    // if Firefox.
    if (element.nodeType !== 1) {
      return false;

    // Ignore elements whose content isn't displayed to the page.
    } else if (['script', 'style', 'title', 'object', 'applet', 'embed', 'template', 'noscript']
    .indexOf(element.nodeName.toLowerCase()) !== -1)  {
      return false;

    // Bail out if the text is not readable.
    } else if (quail.isUnreadable($this.text())) {
      return false;

    } else {
      return true;
    }
  }

  /**
   * For the color test, if any case passes for a given element, then all the
   * cases for that element pass.
   */
  function postInvoke(test) {
    var passed = {};
    var groupsBySelector = test.groupCasesBySelector();

    /**
     * Determine the length of an object.
     *
     * @param object obj
     *   The object whose size will be determined.
     *
     * @return number
     *   The size of the object determined by the number of keys.
     */
    function size (obj) {
      return Object.keys(obj).length;
    }

    // Go through each selector group.
    var nub = '';
    for (var selector in groupsBySelector) {
      if (groupsBySelector.hasOwnProperty(selector)) {
        var cases = groupsBySelector[selector];
        cases.each(function (index, _case) {
          if (_case.get('status') === passed) {
            // This can just be an empty string. We only need the passed hash
            // to contain keys, not values.
            passed[selector] = nub;
          }
        });
      }
    }

    return size(passed) === size(groupsBySelector);
  }

  return {
    colors: colors,
    textShouldBeTested: textShouldBeTested,
    postInvoke: postInvoke,
    buildCase: buildCase
  };

}());

quail.components.content = {

  /**
   * Iterates over elments in the given context and looks
   * for elements that could be considered the main content area.
   *
   * @param {jQuery} $element
   *   The DOM element wrapper in jQuery to search for a content element within.
   * @return {jQuery}
   *   The jQuery element that is considered the most likely content element.
   */
  findContent : function($element) {
    var $topScore = $element;
    //If an element has the ARIA role of "main," it's safe to assume that it is the main content.
    if ($element.is('[role=main]')) {
      return $element;
    }
    if ($element.find('[role=main]').length) {
      return $element.find('[role=main]').first();
    }
    //If there are no paragraphs in the subject at all, we return the subject.
    if ($element.find('p').length === 0) {
      return $element;
    }
    $element.find('p').each(function() {
      var $parent = $(this).parent();
      var element = $parent.get(0);
      var contentScore = $parent.data('content-score') || 0;
      if (!$parent.data('content-score')) {

        contentScore = $parent.find('p').length;

        if (element.className.match(/(comment|meta|footer|footnote)/)) {
          contentScore -= 50;
        }
        else {
          if (element.className.match(/((^|\\s)(post|hentry|entry[-]?(content|text|body)?|article[-]?(content|text|body)?)(\\s|$))/)) {
            contentScore += 25;
          }
        }

        if (element.id.match(/(comment|meta|footer|footnote)/)) {
          contentScore -= 50;
        }
        else {
          if (element.id.match(/^(post|hentry|entry[-]?(content|text|body)?|article[-]?(content|text|body)?)$/)) {
            contentScore += 25;
          }
        }
        $parent.data('content-score', contentScore);
      }
      contentScore += $(this).text().split(',').length;
      if (typeof $topScore.data('content-score') === 'undefined' || contentScore > $topScore.data('content-score')) {
        $topScore = $parent;
      }
    });
    return $topScore;
  }
};

quail.components.convertToPx = function(unit) {
  if (unit.search('px') > -1) {
    return parseInt(unit, 10);
  }
  var $test = $('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: ' + unit + '; line-height: 1; border:0;">&nbsp;</div>').appendTo(quail.html);
  var height = $test.height();
  $test.remove();
  return height;
};

quail.components.event = function(quail, test, Case, options) {
  var $scope = test.get('$scope');
  var $items = options.selector && $scope.find(options.selector) || $scope.find('*');
  var searchEvent = options.searchEvent || '';
  var correspondingEvent = options.correspondingEvent || '';
  $items.each(function() {
    var eventName = searchEvent.replace('on', '');
    var hasOnListener = quail.components.hasEventListener($(this), eventName);
    // Determine if the element has jQuery listeners for the event.
    var jqevents;
    if ($._data) {
      jqevents = $._data(this, 'events');
    }
    var hasjQueryOnListener = jqevents && jqevents[eventName] && !!jqevents[eventName].length;
    var hasCorrespondingEvent = !!correspondingEvent.length;
    var hasSpecificCorrespondingEvent = quail.components.hasEventListener($(this), correspondingEvent.replace('on', ''));
    var expected = $(this).closest('.quail-test').data('expected');
    var _case = test.add(Case({
      element: this,
      expected: expected
    }));
    if ((hasOnListener || hasjQueryOnListener) && (!hasCorrespondingEvent || !hasSpecificCorrespondingEvent)) {
      _case.set({status: 'failed'});
    }
    else {
      _case.set({status: 'passed'});
    }
  });
};

quail.components.hasEventListener = function(element, event) {
  if (typeof $(element).attr('on' + event) !== 'undefined') {
    return true;
  }
  // jQuery events are stored in private objects
  if ($._data($(element)[0], 'events') &&
    typeof $._data($(element)[0], 'events')[event] !== 'undefined') {
    return true;
  }
  // Certain elements always have default events, so we create a new element to compare default events.
  if ($(element).is('a[href], input, button, video, textarea') &&
    typeof $(element)[0][event] !== 'undefined' &&
    (event === 'click' || event === 'focus')) {
    if ($(element)[0][event].toString().search(/^\s*function\s*(\b[a-z$_][a-z0-9$_]*\b)*\s*\((|([a-z$_][a-z0-9$_]*)(\s*,[a-z$_][a-z0-9$_]*)*)\)\s*{\s*\[native code\]\s*}\s*$/i) > -1) {
      return false;
    }
  }
  return typeof $(element)[0][event] !== 'undefined';
};

quail.components.headingLevel = function(quail, test, Case, options) {
  var priorLevel = false;
  test.get('$scope').find(':header').each(function() {
    var level = parseInt($(this).get(0).tagName.substr(-1, 1), 10);
    var element = this;
    if (priorLevel === options.headingLevel && level > priorLevel + 1) {
      test.add(Case({
        element: element,
        // @todo, make the expected property retrievable through a callback so
        //   that we don't need to overload a test with this kind of logic.
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(element)),
        status: 'failed'
      }));
    }
    else {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(element)),
        status: 'passed'
      }));
    }
    priorLevel = level;
  });
};

quail.components.htmlSource = {

  getHtml: function(callback) {
    var that = this;
    if (typeof quail.options.htmlSource !== 'undefined' && quail.options.htmlSource) {
      callback(quail.options.htmlSource, that.parseHtml(quail.options.htmlSource));
      return;
    }
    var data = $.ajax({ url : window.location.href, async : false });
    if (data && typeof data.responseText !== 'undefined') {
      callback(data.responseText, that.parseHtml(data.responseText));
    }
  },

  traverse: function(parsed, callback, number, alreadyCalled) {
    var that = this;
    if (typeof alreadyCalled === 'undefined') {
      callback(parsed, number, false);
    }
    if (typeof parsed.children !== 'undefined') {
      parsed.childCount = 1;
      $.each(parsed.children, function(index, child) {
        callback(child, parsed.childCount, parsed);
        that.traverse(child, callback, parsed.childCount, true);
        if (child.type === 'tag') {
          parsed.childCount++;
        }
      });
    }
    if ($.isArray(parsed)) {
      $.each(parsed, function(index, element) {
        that.traverse(element, callback);
      });
    }
  },

  addSelector: function(element, childNumber, parent) {
    if (element.type !== 'tag' || typeof element.name === 'undefined') {
      return;
    }
    if (typeof element.selector === 'undefined') {
      element.selector = (parent && typeof parent.selector !== 'undefined') ? parent.selector.slice() : [];
    }
    else {
      return;
    }
    var selector = element.name;
    if (typeof element.attributes !== 'undefined') {
      if (typeof element.attributes.id !== 'undefined') {
        selector += '#' + element.attributes.id[0];
      }
      else {
        if (typeof element.attributes.class !== 'undefined') {
          selector += '.' + element.attributes.class[0].replace(/\s/, '.');
        }
      }
    }

    if (childNumber && (typeof element.attributes === 'undefined' || typeof element.attributes.id === 'undefined')) {
      selector += ':nth-child('+ childNumber + ')';
    }
    element.selector.push(selector);
    return element.selector;
  },

  parseHtml: function(html) {
    if (typeof Tautologistics === 'undefined') {
      return false;
    }
    // NodeHtmlParser chokes on doctype tags
    html = html.replace(/<!doctype ([^>]*)>/g, '');
    var handler = new Tautologistics.NodeHtmlParser.HtmlBuilder(function() { }, { });
    var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
    parser.parseComplete(html);
    var parsed = handler.dom;
    var that = this;
    // Traverse through the HTML objects and add a selector property
    this.traverse(parsed, that.addSelector);
    return parsed;
  }
};

if (typeof Tautologistics !== 'undefined') {
  var Mode = {
    Text: 'text',
    Tag: 'tag',
    Attr: 'attr',
    CData: 'cdata',
    Comment: 'comment'
  };

  Tautologistics.NodeHtmlParser.HtmlBuilder.prototype.write = function(element) {
    // this._raw.push(element);
    if (this._done) {
      this.handleCallback(new Error("Writing to the builder after done() called is not allowed without a reset()"));
    }
    if (this._options.includeLocation) {
      if (element.type !== Mode.Attr) {
        element.location = this._getLocation();
        this._updateLocation(element);
      }
    }
    if (element.type === Mode.Text && this._options.ignoreWhitespace) {
      if (HtmlBuilder.reWhitespace.test(element.data)) {
        return;
      }
    }
    var parent;
    var node;
    if (!this._tagStack.last()) { // There are no parent elements
      // If the element can be a container, add it to the tag stack and the top level list
      if (element.type === Mode.Tag) {
        if (element.name.charAt(0) !== "/") { // Ignore closing tags that obviously don't have an opening tag
          node = this._copyElement(element);
          node.closingTag = true;
          this.dom.push(node);
          if (!this.isEmptyTag(node)) { // Don't add tags to the tag stack that can't have children
            this._tagStack.push(node);
          }
          this._lastTag = node;
        }
      } else if (element.type === Mode.Attr && this._lastTag) {
        if (!this._lastTag.attributes) {
          this._lastTag.attributes = {};
        }
        if (typeof this._lastTag.attributes[this._options.caseSensitiveAttr ? element.name : element.name.toLowerCase()] === 'undefined') {
          this._lastTag.attributes[this._options.caseSensitiveAttr ? element.name : element.name.toLowerCase()] = [];
        }
        this._lastTag.attributes[this._options.caseSensitiveAttr ? element.name : element.name.toLowerCase()].push(element.data);
      } else { // Otherwise just add to the top level list
        this.dom.push(this._copyElement(element));
      }
    }
    else {
      parent = this._tagStack.last();

      // There are parent elements
      // If the element can be a container, add it as a child of the element
      // on top of the tag stack and then add it to the tag stack
      if (element.type === Mode.Tag) {
        if (element.name.charAt(0) === "/") {
          // This is a closing tag, scan the tagStack to find the matching opening tag
          // and pop the stack up to the opening tag's parent
          var baseName = this._options.caseSensitiveTags ?
            element.name.substring(1) :
            element.name.substring(1).toLowerCase();
          if (parent.name === baseName) {
            parent.closingTag = true;
          }
          if (!this.isEmptyTag(element)) {
            var pos = this._tagStack.length - 1;
            while (pos > -1 && this._tagStack[pos--].name !== baseName) {
            }
            if (pos > -1 || this._tagStack[0].name === baseName) {
              while (pos < this._tagStack.length - 1) {
                this._tagStack.pop();
              }
            }
          }
        }
        else { // This is not a closing tag
          if (element.type === Mode.Attr) {
            if (!parent.attributes) {
              parent.attributes = {};
            }
            if (typeof parent.attributes[this._options.caseSensitiveAttr ? element.name : element.name.toLowerCase()] === 'undefined') {
              parent.attributes[this._options.caseSensitiveAttr ? element.name : element.name.toLowerCase()] = [];
            }
            parent.attributes[this._options.caseSensitiveAttr ? element.name : element.name.toLowerCase()].push(element.data);
          } else {
            node = this._copyElement(element);
            if (!parent.children) {
              parent.children = [];
            }
            parent.children.push(node);
            if (!this.isEmptyTag(node)) { // Don't add tags to the tag stack that can't have children
              this._tagStack.push(node);
            }
            if (element.type === Mode.Tag) {
              this._lastTag = node;
            }
          }
        }
      }
      else { // This is not a container element
        parent = this._tagStack.last();
        if (element.type === Mode.Attr) {
          if (!parent.attributes) {
            parent.attributes = {};
          }
          if (typeof parent.attributes[this._options.caseSensitiveAttr ? element.name : element.name.toLowerCase()] === 'undefined') {
            parent.attributes[this._options.caseSensitiveAttr ? element.name : element.name.toLowerCase()] = [];
          }
          parent.attributes[this._options.caseSensitiveAttr ? element.name : element.name.toLowerCase()].push(element.data);
        } else {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(this._copyElement(element));
        }
      }
    }
  };
}

var htmlTagValidator=function(){
  var startingTagFirstChar="<",
    startingTagLastChar=">",
    closingTagSecondChar="/",
    selfClosingTagSecondToLastChar="/",
    commentSecondCharacter="!",
    doctypeSecondCharacterPattern=new RegExp("[dD]"),
    startTagPattern=new RegExp("[a-z0-9-]"),
    commentPattern=new RegExp("^<!--.*-->");

  var parserFunc, previousParserFunc, currentTagName, startingTags,
    characterIndex, currentComment, options;

  var selfClosing=[
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ];

  var ignoreWithin=[
    "pre",
    "code",
    "textarea",
    "script",
    "style"
  ];

  var optionalClosing=[
    "p",
    "li",
    "tr",
    "th",
    "td"
  ];

  var tagObject=function(lIndex, cIndex){
    return {name: currentTagName, line: lIndex + 1, char: cIndex};
  };

  var throwEndingTagError=function(tagObj){
    var newError=new Error("Ending tag not found for: " + tagObj.name + " at line: " + tagObj.line + " char: " + tagObj.char + " starting tags: " + startingTags[0].name);
    newError.lineData=tagObj;
    throw newError;
  };

  var throwEndingCommentError=function(commentObj){
    var newError=new Error("Comment ending not found for: `comment` at line: " + commentObj.line + " char: " + commentObj.char);
    newError.lineData=commentObj;
    throw newError;
  };

  var throwSelfClosingFormatError=function(tagObj){
    var newError=new Error("Ending `/` not found for: `" + tagObj.name + "` at line: " + tagObj.line + " char: " + tagObj.char);
    newError.lineData=tagObj.name;
    throw newError;
  };

  var setParserFunc=function(func){
    previousParserFunc=parserFunc;
    parserFunc=func;
  };

  var goBackNumChars=function(num){
    characterIndex-=num;
  };

  // Handle starting html tags
  var startingTagNameFinder=function startingTagNameFinder(character, lIndex, cIndex){
    // If the character matches the matcher for approved tag name characters add it to
    // the currentTagName
    if (startTagPattern.test(character)) {
      currentTagName+=character;
      // If the character matches the closing tag second character set the finder function
      // to the endingTagNameFinder
    } else if (character === closingTagSecondChar) {
      setParserFunc(endingTagNameFinder);
      // If the character looks like a commentSecondCharacter(!) then check to see if it's
      // really a comment or a comment with the commentOrDoctypeFinder
    } else if (character === commentSecondCharacter) {
      currentTagName="";
      setParserFunc(commentOrDoctypeFinder);

      // If the current tag name is a self closing tag, start looking for a new
      // tag name with startingTagBeginningFinder
    } else if (selfClosing.indexOf(currentTagName) > -1) {
      if (options['strict_self_closing_tags']) {
        setParserFunc(selfClosingEndingSlashFinder);
      } else {
        currentTagName="";
        setParserFunc(startingTagBeginningFinder);
      }

      // If nothing else trips a check, the record the currentTag name and either:
      //   ignore all the contents of the tag is an ignoredWithin tag (script, style, pre, etc)
      // or
      //   start looking for the matching ending tag.
    } else {
      var tagObj=tagObject(lIndex, cIndex);
      startingTags.push(tagObj);

      if (ignoreWithin.indexOf(currentTagName) > -1) {
        currentTagName="";
        goBackNumChars(1);
        setParserFunc(ignoredWithinEndingTagStartFinder);
      } else {
        currentTagName="";
        goBackNumChars(1);
        setParserFunc(startingTagEndingFinder);
      }
    }
  };

  var selfClosingEndingSlashFinder=function selfClosingEndingSlashFinder(character, lIndex, cIndex){
    if (character === selfClosingTagSecondToLastChar) {
      currentTagName='';
      setParserFunc(endingTagBeginningFinder);
    } else if (character === startingTagLastChar) {
      throwSelfClosingFormatError(tagObject(lIndex, cIndex));
    }
  };

  var startingTagEndingFinder=function startingTagEndingFinder(character){
    if (character === startingTagLastChar) {
      setParserFunc(endingTagBeginningFinder);
    }
  };

  var startingTagBeginningFinder=function startingTagBeginningFinder(character){
    if (character === startingTagFirstChar) {
      setParserFunc(startingTagNameFinder);
    }
  };

  var endingTagNameFinder=function endingTagNameFinder(character){

    function loopThroughTags () {
      var lastStartTag=startingTags.pop();

      // If the next tag in the startTags stack is the current tag, then we move on.
      if (lastStartTag.name === currentTagName) {
        setParserFunc(startingTagBeginningFinder);
      }
      // If the next tag in the startingTags is an optional tag, try popping it
      // and repeating this process.
      else if(optionalClosing.indexOf(lastStartTag.name) > -1) {
        loopThroughTags();
      }
      // If this is not an optional closing tag, then the mismatch is an error.
      else {
        throwEndingTagError(lastStartTag);
      }
    }

    if (startTagPattern.test(character)) {
      currentTagName+=character;
    }
    else {
      loopThroughTags();
      currentTagName="";
    }
  };

  var endingTagSlashFinder=function endingTagSlashFinder(character){
    if (character === closingTagSecondChar) {
      setParserFunc(endingTagNameFinder);
    } else {
      goBackNumChars(1);
      setParserFunc(startingTagNameFinder);
    }
  };

  var endingTagBeginningFinder=function endingTagBeginningFinder(character){
    if (character === startingTagFirstChar) {
      setParserFunc(endingTagSlashFinder);
    }
  };

  // Ignore with ignored tag list ex. pre, script, code
  var ignoredWithinEndingTagStartFinder=function ignoredWithinEndingTagStartFinder(character){
    if (character === startingTagFirstChar) {
      setParserFunc(ignoredWithinEndingTagSlashFinder);
    }
  };

  var ignoredWithinEndingTagSlashFinder=function ignoredWithinEndingTagSlashFinder(character){
    if (character === closingTagSecondChar) {
      setParserFunc(ignoredWithinEndingTagNameFinder);
    }
  };

  var ignoredWithinEndingTagNameFinder=function ignoredWithinEndingTagNameFinder(character){
    if (startTagPattern.test(character)) {
      currentTagName+=character;
    } else {
      var lastStartTag=startingTags.pop();

      if (lastStartTag.name === currentTagName) {
        setParserFunc(startingTagBeginningFinder);
      } else {
        throwEndingTagError(lastStartTag);
      }
      currentTagName="";
    }
  };

  // Comments and doctypes both start with `<!` So we needed a custom finder to determine what it
  // really is. If it's a doctype we want to ignore it and look for a new starting tag character,
  // while if it's a comment, we want to look for a full comment.
  var commentOrDoctypeFinder=function commentOrDoctypeFinder(character){
    if (doctypeSecondCharacterPattern.test(character)) {
      currentTagName="";
      setParserFunc(startingTagBeginningFinder);
    } else {
      goBackNumChars(3);
      setParserFunc(commentFinder);
    }
  };

  // comment finding
  // Look through the incoming characters until a full matching comment has been built,
  // then reset the finder back to the startingTagBeginningFinder and clear the currentComment
  var commentFinder=function commentFinder(character, lIndex, cIndex){
    if (!currentComment) {
      currentComment={content: "", line: lIndex + 1, char: cIndex + 1, name: "comment"};
    }

    currentComment.content+=character;

    if (commentPattern.test(currentComment.content)) {
      currentComment=null;
      setParserFunc(startingTagBeginningFinder);
    }
  };

  // Main entry point to the validator, it starts with the `startingTagBeginningFinder` first
  var checkTags=function(string, opts){

    var returnState = null;

    try {
      var lines=string.split("\n");
      var ll;
      setParserFunc(startingTagBeginningFinder);
      currentTagName="";
      startingTags=[];
      currentComment=null;
      options=opts || {};

      for (var lineIndex=0, l=lines.length; lineIndex < l; lineIndex++) {
        for (characterIndex=0, ll=lines[lineIndex].length; characterIndex < ll; characterIndex++) {
          if (!parserFunc) {break;}

          parserFunc(lines[lineIndex][characterIndex], lineIndex, characterIndex);
        }
      }

      // currentComment gets cleared whenever a complete comment is found, so if the loops end and one still
      // exists, we can assume that it was never closed.
      if (currentComment) {
        throwEndingCommentError(currentComment);

        // The startTags array populates when a starting tag is found, but pops back out when
        // matching ending tags are found. If there are any starting tags left at the end of
        // the loop we can assume that the ending tag was never found and throw and error
        // for the last tag in the array, unless the tag is optional closing.
      } else if (startingTags.length > 0) {
        var lastStartTag=startingTags[startingTags.length - 1];

        if(optionalClosing.indexOf(lastStartTag.name) === -1) {
          throwEndingTagError(lastStartTag);
        }
      }
      returnState = null;
    } catch (e) {
      returnState = e.message;
    } finally {
      return returnState;
    }
  };

  return checkTags;
};

quail.components.htmlTagValidator=htmlTagValidator();

quail.components.label = function(quail, test, Case, options) {
  var $scope = test.get('$scope');
  $scope.each(function() {
    var $local = $(this);
    $local.find(options.selector).each(function() {
      if ((!$(this).parent('label').length ||
        !$local.find('label[for=' + $(this).attr('id') + ']').length ||
          !quail.containsReadableText($(this).parent('label'))) &&
          (!quail.containsReadableText($local.find('label[for=' + $(this).attr('id') + ']')))) {
        test.add(Case({
          element: this,
          expected: $(this).closest('.quail-test').data('expected'),
          status: 'failed'
        }));
      }
      else {
        test.add(Case({
          element: this,
          expected: $(this).closest('.quail-test').data('expected'),
          status: 'passed'
        }));
      }
    });
  });
};

quail.components.labelProximity = function(quail, test, Case, options) {
  var $scope = test.get('$scope');
  $scope.find(options.selector).each(function() {
    var $label = $scope.find('label[for=' + $(this).attr('id') + ']').first();
    if (!$label.length) {
      test.add(Case({
        element: this,
        expected: $(this).closest('.quail-test').data('expected'),
        status: 'failed'
      }));
    }
    else if (!$(this).parent().is($label.parent())) {
      test.add(Case({
        element: this,
        expected: $(this).closest('.quail-test').data('expected'),
        status: 'failed'
      }));
    }
    else {
      test.add(Case({
        element: this,
        expected: $(this).closest('.quail-test').data('expected'),
        status: 'passed'
      }));
    }
  });
};

quail.components.language = {

  /**
   * The maximum distance possible between two trigram models.
   */
  maximumDistance: 300,

  /**
   * Regular expressions to capture unicode blocks that are either
   * explicitly right-to-left or left-to-right.
   */
  textDirection : {
    rtl : /[\u0600-\u06FF]|[\u0750-\u077F]|[\u0590-\u05FF]|[\uFE70-\uFEFF]/mg,
    ltr : /[\u0041-\u007A]|[\u00C0-\u02AF]|[\u0388-\u058F]/mg
  },

  /**
   * Special characters that indicate text direction changes.
   */
  textDirectionChanges : {
    rtl : /[\u200E]|&rlm;/mg,
    ltr : /[\u200F]|&lrm;/mg
  },

  /**
   * List of single-script blocks that encapsulate a list of languages.
   */
  scripts: {
    basicLatin: {
      regularExpression: /[\u0041-\u007F]/g,
      languages: [
        "ceb",
        "en",
        "eu",
        "ha",
        "haw",
        "id",
        "la",
        "nr",
        "nso",
        "so",
        "ss",
        "st",
        "sw",
        "tlh",
        "tn",
        "ts",
        "xh",
        "zu",
        "af",
        "az",
        "ca",
        "cs",
        "cy",
        "da",
        "de",
        "es",
        "et",
        "fi",
        "fr",
        "hr",
        "hu",
        "is",
        "it",
        "lt",
        "lv",
        "nl",
        "no",
        "pl",
        "pt",
        "ro",
        "sk",
        "sl",
        "sq",
        "sv",
        "tl",
        "tr",
        "ve",
        "vi"
      ]
    },
    arabic: {
      regularExpression:  /[\u0600-\u06FF]/g,
      languages: [
        "ar",
        "fa",
        "ps",
        "ur"
      ]
    },
    cryllic: {
      regularExpression: /[\u0400-\u04FF]|[\u0500-\u052F]/g,
      languages: [
        "bg",
        "kk",
        "ky",
        "mk",
        "mn",
        "ru",
        "sr",
        "uk",
        "uz"
      ]
    }
  },

  /**
   * List of regular expressions that capture only unicode text blocks that are
   * associated with a single language.
   */
  scriptSingletons : {
    bn: /[\u0980-\u09FF]/g,
    bo: /[\u0F00-\u0FFF]/g,
    el: /[\u0370-\u03FF]/g,
    gu: /[\u0A80-\u0AFF]/g,
    he: /[\u0590-\u05FF]/g,
    hy: /[\u0530-\u058F]/g,
    ja: /[\u3040-\u309F]|[\u30A0-\u30FF]/g,
    ka: /[\u10A0-\u10FF]/g,
    km: /[\u1780-\u17FF]|[\u19E0-\u19FF]/g,
    kn: /[\u0C80-\u0CFF]/g,
    ko: /[\u1100-\u11FF]|[\u3130-\u318F]|[\uAC00-\uD7AF]/g,
    lo: /[\u0E80-\u0EFF]/g,
    ml: /[\u0D00-\u0D7F]/g,
    mn: /[\u1800-\u18AF]/g,
    or: /[\u0B00-\u0B7F]/g,
    pa: /[\u0A00-\u0A7F]/g,
    si: /[\u0D80-\u0DFF]/g,
    ta: /[\u0B80-\u0BFF]/g,
    te: /[\u0C00-\u0C7F]/g,
    th: /[\u0E00-\u0E7F]/g,
    zh: /[\u3100-\u312F]|[\u2F00-\u2FDF]/g
  },

  /**
   * Determines the document's language by looking at
   * first the browser's default, then the HTML element's "lang" attribute,
   * then the "lang" attribute of the element passed to quail.
   */
  getDocumentLanguage: function(scope, returnIso) {
    var language = navigator.language || navigator.userLanguage;
    if (typeof quail.options.language !== 'undefined') {
      language = quail.options.language;
    }
    if (scope.parents('[lang]').length) {
      language = scope.parents('[lang]:first').attr('lang');
    }
    if (typeof scope.attr('lang') !== 'undefined') {
      language = scope.attr('lang');
    }
    language = language.toLowerCase().trim();
    if (returnIso) {
      return language.split('-')[0];
    }
    return language;
  }
};

quail.components.placeholder = function(quail, test, Case, options) {

  var resolve = function (element, resolution) {
    test.add(Case({
      element: element,
      expected: $(element).closest('.quail-test').data('expected'),
      status: resolution
    }));
  };

  test.get('$scope').find(options.selector).each(function() {
    var text = '';
    if($(this).css('display') === 'none' && !$(this).is('title')){
      resolve(this, 'inapplicable');
      return;
    }
    if (typeof options.attribute !== 'undefined') {
      if ((typeof $(this).attr(options.attribute) === 'undefined' ||
            (options.attribute === 'tabindex' &&
              $(this).attr(options.attribute) <= 0
            )
         ) &&
         !options.content
        ) {
        resolve(this, 'failed');
        return;
      }
      else {
        if ($(this).attr(options.attribute) && $(this).attr(options.attribute) !== 'undefined') {
          text += $(this).attr(options.attribute);
        }
      }
    }
    if (typeof options.attribute === 'undefined' ||
      !options.attribute ||
      options.content) {
      text += $(this).text();
      $(this).find('img[alt]').each(function() {
        text += $(this).attr('alt');
      });
    }
    if (typeof text === 'string' && text.length > 0) {
      text = quail.cleanString(text);
      var regex = /^([0-9]*)(k|kb|mb|k bytes|k byte)$/g;
      var regexResults = regex.exec(text.toLowerCase());
      if (regexResults && regexResults[0].length) {
        resolve(this, 'failed');
      }
      else if (options.empty && quail.isUnreadable(text)) {
        resolve(this, 'failed');
      }
      else if (quail.strings.placeholders.indexOf(text) > -1 ) {
        resolve(this, 'failed');
      }
      // It passes.
      else {
        resolve(this, 'passed');
      }
    }
    else {
      if (options.empty && typeof text !== 'number') {
        resolve(this, 'failed');
      }
    }
  });
};

quail.components.resolveExpectation = function(element, caseID) {
  var $scope = $(element).closest('.quail-test');
  var expected = $scope.data('expected');
  var result;
  // If no caseID is supplied, assume that the expected data attribute could
  // contain a simple, singular expectation.
  if (!caseID) {
    result = $scope.data('expected');
  }
  var expectations = typeof expected === 'string' && expected.split('|');
  // This might be a single case ID expectation.
  if (caseID && expectations.length === 0 && expected.indexOf(':') > -1) {
    expectations = [expected];
  }

  if (expectations.length > 0 && element.nodeType === 1) {
    var condition, $el;
    // Split apart the compound expectations.
    for (var i = 0, il = expectations.length; i < il; ++i) {
      condition = expectations[i].split(':');
      // If a caseID is supplied, assume the expect targets them.
      if (caseID) {
        if (condition[0] === caseID) {
          if (!condition[1] || condition[1] === 'ignore') {
            return;
          }
          else {
            // Retrieve the expectation for this element.
            result = condition[1];
          }
        }
      }
      // Try to use the condition zero element as a selector.
      else {
        $el = $(condition[0], $scope);
        if ($el.length === 1 && element === $el.get(0)) {
          if (!condition[1] || condition[1] === 'ignore') {
            return;
          }
          else {
            // Retrieve the expectation for this element.
            result = condition[1];
          }
        }
      }
    }
  }
  // Otherwise the expectation is given as a simple value.
  return result;
};

quail.components.selector = function (quail, test, Case, options) {
  this.get('$scope').each(function() {
    var $scope = $(this);
    var candidates = $(this).find(options.selector);
    // Passes.
    if (!candidates.length) {
      // Passes.
      test.add(quail.lib.Case({
        element: undefined,
        expected: $scope.data('expected') || $scope.find('[data-expected]').data('expected'),
        // status: 'passed'
        status: (options.test ? 'inapplicable' : 'passed')
      }));
    }
    else {
      // Fails.
      candidates.each(function () {
        var status,
        $this = $(this);

        // If a test is defined, then use it
        if (options.test && !$this.is(options.test)) {
          status = 'passed';
        } else {
          status = 'failed';
        }

        test.add(quail.lib.Case({
          element: this,
          expected: $this.closest('.quail-test').data('expected'),
          status: status
        }));
      });
    }
  });
};

quail.statistics = {

  setDecimal : function( num, numOfDec ){
    var pow10s = Math.pow( 10, numOfDec || 0 );
    return ( numOfDec ) ? Math.round( pow10s * num ) / pow10s : num;
  },

  average : function( numArr, numOfDec ){
    var i = numArr.length,
      sum = 0;
    while( i-- ){
      sum += numArr[ i ];
    }
    return quail.statistics.setDecimal( (sum / numArr.length ), numOfDec );
  },

  variance : function( numArr, numOfDec ){
    var avg = quail.statistics.average( numArr, numOfDec ),
      i = numArr.length,
      v = 0;

    while( i-- ){
      v += Math.pow( (numArr[ i ] - avg), 2 );
    }
    v /= numArr.length;
    return quail.statistics.setDecimal( v, numOfDec );
  },

  standardDeviation : function( numArr, numOfDec ){
    var stdDev = Math.sqrt( quail.statistics.variance( numArr, numOfDec ) );
    return quail.statistics.setDecimal( stdDev, numOfDec );
  }
};

quail.components.textStatistics = {

  cleanText : function(text) {
    return text.replace(/[,:;()\-]/, ' ')
               .replace(/[\.!?]/, '.')
               .replace(/[ ]*(\n|\r\n|\r)[ ]*/, ' ')
               .replace(/([\.])[\. ]+/, '$1')
               .replace(/[ ]*([\.])/, '$1')
               .replace(/[ ]+/, ' ')
               .toLowerCase();

  },

  sentenceCount : function(text) {
    return text.split('.').length + 1;
  },

  wordCount : function(text) {
    return text.split(' ').length + 1;
  },

  averageWordsPerSentence : function(text) {
    return this.wordCount(text) / this.sentenceCount(text);
  },

  averageSyllablesPerWord : function(text) {
    var that = this;
    var count = 0;
    var wordCount = that.wordCount(text);
    if (!wordCount) {
      return 0;
    }
    $.each(text.split(' '), function(index, word) {
      count += that.syllableCount(word);
    });
    return count / wordCount;
  },

  syllableCount : function(word) {
    var matchedWord = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
                          .match(/[aeiouy]{1,2}/g);
    if (!matchedWord || matchedWord.length === 0) {
      return 1;
    }
    return matchedWord.length;
  }
};
quail.components.video = {

  /**
   * Iterates over listed video providers and runs their `isVideo` method.
   * @param jQuery $element
   *   An element in a jQuery wrapper.
   *
   * @return Boolean
   *   Whether the element is a video.
   */
  isVideo : function(element) {
    var isVideo = false;
    $.each(this.providers, function() {
      if (element.is(this.selector) && this.isVideo(element)) {
        isVideo = true;
      }
    });
    return isVideo;
  },

  findVideos : function(element, callback) {
    $.each(this.providers, function(name, provider) {
      element.find(this.selector).each(function() {
        var video = $(this);
        if (provider.isVideo(video)) {
          provider.hasCaptions(video, callback);
        }
      });
    });
  },

  providers : {

    youTube : {

      selector : 'a, iframe',

      apiUrl : 'http://gdata.youtube.com/feeds/api/videos/?q=%video&caption&v=2&alt=json',

      isVideo : function(element) {
        return (this.getVideoId(element) !== false) ? true : false;
      },

      getVideoId : function(element) {
        var attribute = (element.is('iframe')) ? 'src' : 'href';
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&\?]*).*/;
        var match = element.attr(attribute).match(regExp);
        if (match && match[7].length === 11) {
          return match[7];
        }
        return false;
      },

      hasCaptions : function(element, callback) {
        var videoId = this.getVideoId(element);
        $.ajax({url : this.apiUrl.replace('%video', videoId),
                async : false,
                dataType : 'json',
                success : function(data) {
                  callback(element, (data.feed.openSearch$totalResults.$t > 0));
                }
        });
      }
    },

    flash : {

      selector : 'object',

      isVideo : function(element) {
        var isVideo = false;
        if (element.find('param').length === 0) {
          return false;
        }
        element.find('param[name=flashvars]').each(function() {
          if ($(this).attr('value').search(/\.(flv|mp4)/i) > -1) {
            isVideo = true;
          }
        });
        return isVideo;
      },

      hasCaptions : function(element, callback) {
        var hasCaptions = false;
        element.find('param[name=flashvars]').each(function() {
          if (($(this).attr('value').search('captions') > -1 &&
             $(this).attr('value').search('.srt') > -1) ||
             $(this).attr('value').search('captions.pluginmode') > -1) {
            hasCaptions = true;
          }
        });
        callback(element, hasCaptions);
      }
    },

    videoElement : {

      selector : 'video',

      isVideo : function(element) {
        return element.is('video');
      },

      hasCaptions : function(element, callback) {
        var $captions = element.find('track[kind=subtitles], track[kind=captions]');
        if (!$captions.length) {
          callback(element, false);
          return;
        }
        var language = quail.components.language.getDocumentLanguage(element, true);
        if (element.parents('[lang]').length) {
          language = element.parents('[lang]').first().attr('lang').split('-')[0];
        }
        var foundLanguage = false;
        $captions.each(function() {
          if (!$(this).attr('srclang') || $(this).attr('srclang').toLowerCase() === language) {
            foundLanguage = true;
            try{
              var request = $.ajax({ url: $(this).attr('src'),
                        type: 'HEAD',
                        async: false,
                        error: function() { }
                       });
              if (request.status === 404) {
                foundLanguage = false;
              }
            }
            catch(e) {

            }
          }
        });
        if (!foundLanguage) {
          callback(element, false);
          return;
        }
        callback(element, true);
      }
    }
  }

};

quail.strings.colors = {
  "aliceblue": "f0f8ff",
  "antiquewhite": "faebd7",
  "aqua": "00ffff",
  "aquamarine": "7fffd4",
  "azure": "f0ffff",
  "beige": "f5f5dc",
  "bisque": "ffe4c4",
  "black": "000000",
  "blanchedalmond": "ffebcd",
  "blue": "0000ff",
  "blueviolet": "8a2be2",
  "brown": "a52a2a",
  "burlywood": "deb887",
  "cadetblue": "5f9ea0",
  "chartreuse": "7fff00",
  "chocolate": "d2691e",
  "coral": "ff7f50",
  "cornflowerblue": "6495ed",
  "cornsilk": "fff8dc",
  "crimson": "dc143c",
  "cyan": "00ffff",
  "darkblue": "00008b",
  "darkcyan": "008b8b",
  "darkgoldenrod": "b8860b",
  "darkgray": "a9a9a9",
  "darkgreen": "006400",
  "darkkhaki": "bdb76b",
  "darkmagenta": "8b008b",
  "darkolivegreen": "556b2f",
  "darkorange": "ff8c00",
  "darkorchid": "9932cc",
  "darkred": "8b0000",
  "darksalmon": "e9967a",
  "darkseagreen": "8fbc8f",
  "darkslateblue": "483d8b",
  "darkslategray": "2f4f4f",
  "darkturquoise": "00ced1",
  "darkviolet": "9400d3",
  "deeppink": "ff1493",
  "deepskyblue": "00bfff",
  "dimgray": "696969",
  "dodgerblue": "1e90ff",
  "firebrick": "b22222",
  "floralwhite": "fffaf0",
  "forestgreen": "228b22",
  "fuchsia": "ff00ff",
  "gainsboro": "dcdcdc",
  "ghostwhite": "f8f8ff",
  "gold": "ffd700",
  "goldenrod": "daa520",
  "gray": "808080",
  "green": "008000",
  "greenyellow": "adff2f",
  "honeydew": "f0fff0",
  "hotpink": "ff69b4",
  "indianred": "cd5c5c",
  "indigo": "4b0082",
  "ivory": "fffff0",
  "khaki": "f0e68c",
  "lavender": "e6e6fa",
  "lavenderblush": "fff0f5",
  "lawngreen": "7cfc00",
  "lemonchiffon": "fffacd",
  "lightblue": "add8e6",
  "lightcoral": "f08080",
  "lightcyan": "e0ffff",
  "lightgoldenrodyellow": "fafad2",
  "lightgrey": "d3d3d3",
  "lightgreen": "90ee90",
  "lightpink": "ffb6c1",
  "lightsalmon": "ffa07a",
  "lightseagreen": "20b2aa",
  "lightskyblue": "87cefa",
  "lightslategray": "778899",
  "lightsteelblue": "b0c4de",
  "lightyellow": "ffffe0",
  "lime": "00ff00",
  "limegreen": "32cd32",
  "linen": "faf0e6",
  "magenta": "ff00ff",
  "maroon": "800000",
  "mediumaquamarine": "66cdaa",
  "mediumblue": "0000cd",
  "mediumorchid": "ba55d3",
  "mediumpurple": "9370d8",
  "mediumseagreen": "3cb371",
  "mediumslateblue": "7b68ee",
  "mediumspringgreen": "00fa9a",
  "mediumturquoise": "48d1cc",
  "mediumvioletred": "c71585",
  "midnightblue": "191970",
  "mintcream": "f5fffa",
  "mistyrose": "ffe4e1",
  "moccasin": "ffe4b5",
  "navajowhite": "ffdead",
  "navy": "000080",
  "oldlace": "fdf5e6",
  "olive": "808000",
  "olivedrab": "6b8e23",
  "orange": "ffa500",
  "orangered": "ff4500",
  "orchid": "da70d6",
  "palegoldenrod": "eee8aa",
  "palegreen": "98fb98",
  "paleturquoise": "afeeee",
  "palevioletred": "d87093",
  "papayawhip": "ffefd5",
  "peachpuff": "ffdab9",
  "peru": "cd853f",
  "pink": "ffc0cb",
  "plum": "dda0dd",
  "powderblue": "b0e0e6",
  "purple": "800080",
  "red": "ff0000",
  "rosybrown": "bc8f8f",
  "royalblue": "4169e1",
  "saddlebrown": "8b4513",
  "salmon": "fa8072",
  "sandybrown": "f4a460",
  "seagreen": "2e8b57",
  "seashell": "fff5ee",
  "sienna": "a0522d",
  "silver": "c0c0c0",
  "skyblue": "87ceeb",
  "slateblue": "6a5acd",
  "slategray": "708090",
  "snow": "fffafa",
  "springgreen": "00ff7f",
  "steelblue": "4682b4",
  "tan": "d2b48c",
  "teal": "008080",
  "thistle": "d8bfd8",
  "tomato": "ff6347",
  "turquoise": "40e0d0",
  "violet": "ee82ee",
  "wheat": "f5deb3",
  "white": "ffffff",
  "whitesmoke": "f5f5f5",
  "yellow": "ffff00",
  "yellowgreen": "9acd32"
};
quail.strings.languageCodes = [
  "bh",
  "bi",
  "nb",
  "bs",
  "br",
  "bg",
  "my",
  "es",
  "ca",
  "km",
  "ch",
  "ce",
  "ny",
  "ny",
  "zh",
  "za",
  "cu",
  "cu",
  "cv",
  "kw",
  "co",
  "cr",
  "hr",
  "cs",
  "da",
  "dv",
  "dv",
  "nl",
  "dz",
  "en",
  "eo",
  "et",
  "ee",
  "fo",
  "fj",
  "fi",
  "nl",
  "fr",
  "ff",
  "gd",
  "gl",
  "lg",
  "ka",
  "de",
  "ki",
  "el",
  "kl",
  "gn",
  "gu",
  "ht",
  "ht",
  "ha",
  "he",
  "hz",
  "hi",
  "ho",
  "hu",
  "is",
  "io",
  "ig",
  "id",
  "ia",
  "ie",
  "iu",
  "ik",
  "ga",
  "it",
  "ja",
  "jv",
  "kl",
  "kn",
  "kr",
  "ks",
  "kk",
  "ki",
  "rw",
  "ky",
  "kv",
  "kg",
  "ko",
  "kj",
  "ku",
  "kj",
  "ky",
  "lo",
  "la",
  "lv",
  "lb",
  "li",
  "li",
  "li",
  "ln",
  "lt",
  "lu",
  "lb",
  "mk",
  "mg",
  "ms",
  "ml",
  "dv",
  "mt",
  "gv",
  "mi",
  "mr",
  "mh",
  "ro",
  "ro",
  "mn",
  "na",
  "nv",
  "nv",
  "nd",
  "nr",
  "ng",
  "ne",
  "nd",
  "se",
  "no",
  "nb",
  "nn",
  "ii",
  "ny",
  "nn",
  "ie",
  "oc",
  "oj",
  "cu",
  "cu",
  "cu",
  "or",
  "om",
  "os",
  "os",
  "pi",
  "pa",
  "ps",
  "fa",
  "pl",
  "pt",
  "pa",
  "ps",
  "qu",
  "ro",
  "rm",
  "rn",
  "ru",
  "sm",
  "sg",
  "sa",
  "sc",
  "gd",
  "sr",
  "sn",
  "ii",
  "sd",
  "si",
  "si",
  "sk",
  "sl",
  "so",
  "st",
  "nr",
  "es",
  "su",
  "sw",
  "ss",
  "sv",
  "tl",
  "ty",
  "tg",
  "ta",
  "tt",
  "te",
  "th",
  "bo",
  "ti",
  "to",
  "ts",
  "tn",
  "tr",
  "tk",
  "tw",
  "ug",
  "uk",
  "ur",
  "ug",
  "uz",
  "ca",
  "ve",
  "vi",
  "vo",
  "wa",
  "cy",
  "fy",
  "wo",
  "xh",
  "yi",
  "yo",
  "za",
  "zu"
];
quail.strings.newWindow = [
  /new (browser )?(window|frame)/,
  /popup (window|frame)/
];
quail.strings.placeholders = [
  "title",
  "untitled",
  "untitled document",
  "this is the title",
  "the title",
  "content",
  " ",
  "new page",
  "new",
  "nbsp",
  "&nbsp;",
  "spacer",
  "image",
  "img",
  "photo",
  "frame",
  "frame title",
  "iframe",
  "iframe title",
  "legend"
];
quail.strings.redundant = {
  "inputImage":[
    "submit",
    "button"
  ],
  "link":[
    "link to",
    "link",
    "go to",
    "click here",
    "link",
    "click",
    "more"
  ],
  "required":[
    "*"
  ]
};
quail.strings.siteMap = [
  "site map",
  "map",
  "sitemap"
];
quail.strings.skipContent = [
  /(jump|skip) (.*) (content|main|post)/i
];
quail.strings.suspiciousLinks = [
  "click here",
  "click",
  "more",
  "here",
  "read more",
  "download",
  "add",
  "delete",
  "clone",
  "order",
  "view",
  "read",
  "clic aqu&iacute;",
  "clic",
  "haga clic",
  "m&aacute;s",
  "aqu&iacute;",
  "image"
];
quail.strings.symbols = [
  "|",
  "*",
  /\*/g,
  "<br>*",
  '&bull;',
  '&#8226',
  '♦',
  '›',
  '»',
  '‣',
  '▶',
  '.',
  '◦',
  '✓',
  '◽',
  '•',
  '—',
  '◾'
];

quail.KINGStrongList = function (quail, test, Case) {
  test.get('$scope').find('strong').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    _case.set({
      'status': $(this).parent().is('li') ? 'passed' : 'failed'
    });
  });
};

quail.KINGUseCurrencyAsSymbol = function (quail, test, Case) {
  function testCurrencyFormat(index, element) {
    // Detect dates with several separators.
    var currencyNames = [
      'dollar',
      'euro',
      'pound',
      'franc',
      'krona',
      'rupee',
      'ruble',
      'dinar'
    ];
    // Test the words and any eventual extra letters for s and all.
    var currencyReg = new RegExp('\\d{1,}\\s*(' + currencyNames.join('|') + ')\\w*\\b|(' + currencyNames.join('|') + ')\\w*\\b\\s*\\d{1,}', 'ig');

    var text = quail.getTextContents($(element));
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);

    _case.set({
      'status': currencyReg.test(text) ? 'failed' : 'passed'
    });
  }
  test.get('$scope').find('p').each(testCurrencyFormat);
};

quail.KINGUseLongDateFormat = function (quail, test, Case) {

  function testDateFormat(index, element) {
    // Detect dates with several separators.
    var dateReg = /\d{1,2}([./-])\d{1,2}\1\d{2,4}/g;
    var elemChildNodes = element.childNodes;
    var issueOccured = false;

    // Lets find all the *direct* text node children.
    var textNodeChildren = [];
    var i = 0;
    var childCount;

    for (childCount = elemChildNodes.length; i < childCount; i++) {
      if (elemChildNodes[i].nodeType === Node.TEXT_NODE) {
        textNodeChildren.push(elemChildNodes[i]);
      }
    }

    // Now we're going to check if any text node matches the pattern.
    // Micro-optimization: check also if issueOccured == false, because we
    // are not reporting more than one issue occurence.
    for (i = 0; i < textNodeChildren.length && !issueOccured; i++) {
      var curTextContent = textNodeChildren[i].nodeValue;

      if ( dateReg.test( curTextContent ) ) {
        issueOccured = true;
      }
    }

    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);

    // Only test if there is one date in the wrong format and call it.
    _case.set({
      'status': issueOccured ? 'failed' : 'passed'
    });
  }

  // Note it should also contain div, but that would lead to other issues.
  var appliableElements = 'a, article, aside, b, blockquote, caption, cite, dd, del, div, em, figcaption, footer, h1, h2, h3, h4, h5, h6, header, i, label, legend, li, mark, nav, option, p, q, s, section, small, span, strong, sub, summary, sup, td, th, title, u';

  test.get('$scope').find(appliableElements).each(testDateFormat);
};

quail.KINGUsePercentageWithSymbol = function (quail, test, Case) {
  function testPercentFormat(index, element) {
    // Detect dates with several separators.
    var percentName = [
      'percent',
      'pct\\.'
    ];
    // Test the words and any eventual extra letters for s and all.
    var percentReg = new RegExp('\\d{1,}\\s*(' + percentName.join('|') + ')|(' + percentName.join('|') + ')\\s*\\d{1,}', 'ig');

    var text = quail.getTextContents($(element));
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);

    _case.set({
      'status': percentReg.test(text) ? 'failed' : 'passed'
    });
  }
  test.get('$scope').find('p').each(testPercentFormat);
};

quail.aAdjacentWithSameResourceShouldBeCombined = function(quail, test, Case) {
  //var $applicableElements = test.get('$scope').find('a');

  function findAdjacent(index, element) {
    var $element = $(element);
    var adjacentLinks = $element.find('a + a').length > 0;
    var $links = $element.find('a');

    // no adjacent links, exclude all.
    if (!adjacentLinks) {
      $links.each(excludeSingleLinks);
    }
    else {
      $links.each(checkNextLink);
    }
  }

  function checkNextLink(index, element) {
    var $element = $(element);
    var thisHref = element.getAttribute('href');
    var $nextLink = $element.find('+ a');
    if (!$nextLink.length) {
      // We're going over the second link.
      return;
    }
    var nextHref = $nextLink[0].getAttribute('href');
    var status = 'passed';
    var _case = Case({
      element: element,
      expected: $element.closest('.quail-test').data('expected')
    });
    if (thisHref === nextHref) {
      status = 'failed';
    }

    test.add(_case);
    _case.set({'status': status});
  }

  function excludeSingleLinks(index, element) {
    var _case = Case({ element: element });
    test.add(_case);
    _case.set({
      'status': 'inapplicable',
      expected: $(element).closest('.quail-test').data('expected')
    });
  }

  test.get('$scope').each(findAdjacent);
};

quail.aImgAltNotRepetitive = function(quail, test, Case) {
  test.get('$scope').find('a img[alt]').each(function() {
    var _case = test.add(Case({
      element: this
    }));
    var expected = $(this).closest('.quail-test').data('expected');
    if (quail.cleanString($(this).attr('alt')) === quail.cleanString($(this).parent('a').text())) {
      _case.set({
        'expected': expected,
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'expected': expected,
        'status': 'passed'
      });
    }
  });
};

quail.aInPHasADistinctStyle=function(quail, test, Case){

  /**
   * Checks if an element has a border set
   * @param element
   * @returns {boolean}
   */
  function hasBorder(element) {
    return (element.outerWidth() - element.innerWidth() > 0) ||
    (element.outerHeight() - element.innerHeight() > 0);
  }

  /**
   * Test if two elements have a distinct style from it's ancestor
   * @param  {jQuery node} $elm
   * @param  {jQuery node} $parent
   * @return {boolean}
   */
  function elmHasDistinctStyle($elm, $parent) {
    var result = false;
    var styleProperties = ['font-weight', 'font-style'];
    var textDecoration = $elm.css('text-decoration');

    if (textDecoration !== 'none' &&
    textDecoration !== $parent.css('text-decoration')) {
      result = true;
    }

    if ($elm.css('background-color') !== 'rgba(0, 0, 0, 0)') {
      styleProperties.push('background');
    }

    $.each(styleProperties, function (i, styleProp) {
      if (!result && $elm.css(styleProp) !== $parent.css(styleProp)) {
        result = true;
      }
    });

    return result  || hasBorder($elm);
  }

  function elmHasDistinctPosition($elm) {
    var isBlock = ($elm.css('display') === 'block');
    var position = $elm.css('position');
    var isPositioned = position !== 'relative' && position !== 'static';
    return isBlock || isPositioned;
  }

  // Ignore links where the p only contains white space, <, >, |, \, / and - chars
  var allowedPText = /^([\s|-]|>|<|\\|\/|&(gt|lt);)*$/i;

  test.get('$scope').each(function () {
    var $scope = $(this);
    var anchors = $scope.find('p a[href]:visible');

    anchors.each(function () {
      var $this = $(this);
      var $p = $this.closest('p');
      var $parent = $this.parent();

      var _case=Case({
        element: this,
        expected: $this.closest('.quail-test').data('expected')
      });
      test.add(_case);

      var aText = $this.text().trim();

      // Get all text of the p element with all anchors removed
      var pText = $p.clone().find('a[href]').remove().end().text();

      if (aText === '' || pText.match(allowedPText)) {
        _case.set('status', 'inapplicable');

      } else if ($this.css('color') === $p.css('color')) {
        _case.set('status', 'passed');

      } else if (elmHasDistinctStyle($this, $p)) {
        _case.set('status', 'passed');

      } else if (elmHasDistinctPosition($this)) {
        _case.set('status', 'passed');

      } else if ($this.find('img').length > 0) {
        _case.set('status', 'passed');

      } else if ($parent.text().trim() === aText &&
      elmHasDistinctStyle($parent, $p)) {
        _case.set('status', 'passed');

      } else {
        _case.set('status', 'failed');
      }
    });

  });

};

quail.aLinkTextDoesNotBeginWithRedundantWord = function(quail, test, Case) {
  test.get('$scope').find('a').each(function() {
    var $link = $(this);
    var text = '';
    if ($(this).find('img[alt]').length) {
      text = text + $(this).find('img[alt]:first').attr('alt');
    }
    text = text + $(this).text();
    text = text.toLowerCase();
    var _case;
    $.each(quail.strings.redundant.link, function(index, phrase) {
      if (text.search(phrase) > -1) {
        _case = test.add(Case({
          element: this,
          'expected': $link.closest('.quail-test').data('expected'),
          'status': 'failed'
        }));
      }
    });
    // If the case didn't fail, then it passed.
    if (!_case) {
      test.add(Case({
        element: this,
        'expected': $link.closest('.quail-test').data('expected'),
        'status': 'passed'
      }));
    }
  });
};

quail.aLinkWithNonText = function(quail, test, Case) {
  test.get('$scope').find('a').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if (!$(this).is('a:has(img, object, embed)[href]')) {
      _case.set({
        'status': 'inapplicable'
      });
      return;
    }
    if (!quail.isUnreadable($(this).text())) {
      _case.set({
        'status': 'passed'
      });
      return;
    }
    var unreadable = 0;
    $(this).find('img, object, embed').each(function() {
      if (($(this).is('img') && quail.isUnreadable($(this).attr('alt'))) ||
        (!$(this).is('img') && quail.isUnreadable($(this).attr('title')))) {
        unreadable++;
      }
    });
    if ($(this).find('img, object, embed').length === unreadable) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.aLinksAreSeparatedByPrintableCharacters = function(quail, test, Case) {
  test.get('$scope').find('a').each(function() {
    var _case = test.add(Case({
      element: this
    }));
    var expected = $(this).closest('.quail-test').data('expected');
    // Only test if there's another a tag.
    if ($(this).next('a').length) {
      if (quail.isUnreadable($(this).get(0).nextSibling.wholeText)) {
        _case.set({
          'expected': expected,
          'status': 'failed'
        });
      }
      else {
        _case.set({
          'expected': expected,
          'status': 'passed'
        });
      }
    }
  });
};

quail.aLinksDontOpenNewWindow = function(quail, test, Case) {
  // Links without a target attribute pass.
  test.get('$scope').find('a').not('[target=_new], [target=_blank]').each(function () {
    test.add(Case({
      element: this,
      'expected': $(this).closest('.quail-test').data('expected'),
      'status': 'passed'
    }));
  });
  // Links with a target attribute pass if the link text indicates that the
  // link will open a new window.
  test.get('$scope').find('a[target=_new], a[target=_blank]').each(function() {
    var $link = $(this);
    var passes = false;
    var i = 0;
    var text = $link.text() + ' ' + $link.attr('title');
    var phrase = '';
    // Test the link text against strings the indicate the link will open
    // in a new window.
    do {
      phrase = quail.strings.newWindow[i];
      if (text.search(phrase) > -1) {
        passes = true;
      }
      ++i;

    } while (!passes && i < quail.strings.newWindow.length);
    // Build a Case.
    if (passes) {
      test.add(Case({
        element: this,
        'expected': $link.closest('.quail-test').data('expected'),
        'status': 'passed'
      }));
    }
    else {
      test.add(Case({
        element: this,
        'expected': $link.closest('.quail-test').data('expected'),
        'status': 'failed'
      }));
    }
  });
};

quail.aLinksNotSeparatedBySymbols = function(quail, test, Case) {
  test.get('$scope').find('a').each(function() {
    var $link = $(this);
    if ($link.next('a').length) {
      var text = $link.get(0).nextSibling.wholeText;
      if (typeof text === 'string') {
        // The string between the links is composed of symbols.
        if (quail.strings.symbols.indexOf(text.toLowerCase().trim()) !== -1 ) {
          test.add(Case({
            element: this,
            'expected': $link.closest('.quail-test').data('expected'),
            'status': 'failed'
          }));
        }
      }
      // The string between the links is composed of words.
      else {
        test.add(Case({
          element: this,
          'expected': $link.closest('.quail-test').data('expected'),
          'status': 'passed'
        }));
      }
    }
    // If nothing follows the link, then there is nothing to test.
    else {
      test.add(Case({
        'status': 'inapplicable'
      }));
    }
  });
};

quail.aMustContainText = function(quail, test, Case) {
  test.get('$scope').find('a').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);

    if (!$(this).attr('href') ||
      $(this).css('display') === 'none') {
      _case.set({
        'status': 'inapplicable'
      });
      return;
    }

    if (quail.containsReadableText($(this), true)){
      _case.set({
        'status': 'passed'
      });
    }
    else {
      _case.set({
        'status': 'failed'
      });
    }
  });
};

quail.aSuspiciousLinkText = function(quail, test, Case) {
  test.get('$scope').find('a').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if (!$(this).attr('href')) {
      _case.set({
        'status': 'inapplicable'
      });
      return;
    }
    var text = $(this).text();
    $(this).find('img[alt]').each(function() {
      text = text + $(this).attr('alt');
    });
    if (quail.strings.suspiciousLinks.indexOf(quail.cleanString(text)) > -1) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.animatedGifMayBePresent=function(quail, test, Case){

  /**
   * Test if gif is animated
   * Implemented from: https://gist.github.com/3012623.git
   * @param src
   * @param ext
   * @param cb
   */
  function isAnimatedGif(src, ext, cb){

    if(ext !== 'gif'){
      cb(false);
      return;
    }

    var request=new XMLHttpRequest();
    request.open('GET', src, true);
    request.responseType='arraybuffer';
    request.addEventListener('load', function () {
      var arr = new Uint8Array(request.response);
      var frames = 0;

      // make sure it's a gif (GIF8)
      if (arr[0] !== 0x47 || arr[1] !== 0x49 ||
        arr[2] !== 0x46 || arr[3] !== 0x38)
      {
        cb(false);
        return;
      }

      //ported from php http://www.php.net/manual/en/function.imagecreatefromgif.php#104473
      //an animated gif contains multiple "frames", with each frame having a
      //header made up of:
      // * a static 4-byte sequence (\x00\x21\xF9\x04)
      // * 4 variable bytes
      // * a static 2-byte sequence (\x00\x2C) (some variants may use \x00\x21 ?)
      // We read through the file til we reach the end of the file, or we've found
      // at least 2 frame headers
      for (var i=0; i < arr.length -9; i++) {
        if (arr[i] === 0x00 && arr[i+1] === 0x21 &&
          arr[i+2] === 0xF9 && arr[i+3] === 0x04 &&
          arr[i+8] === 0x00 &&
          (arr[i+9] === 0x2C || arr[i+9] === 0x21))
        {
          frames++;
        }
        if(frames > 1){
          cb(true);
          return;
        }
      }

      cb(false);
    });
    request.send();
  }

  test.get('$scope').find('img').each(function(){

    var _case=Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);

    var imgSrc=$(this).attr('src');
    var ext=$(this).attr('src').split('.').pop().toLowerCase();

    if (ext !== 'gif') {
      _case.set({
        'status': 'inapplicable'
      });
      return;
    }

    isAnimatedGif(imgSrc, ext, function(animated){
      if (animated) {
        _case.set({
          'status': 'cantTell'
        });
        return;
      } else{
        _case.set({
          'status': 'inapplicable'
        });
        return;
      }
    });
  });
};

quail.appletContainsTextEquivalent = function(quail, test, Case) {
  test.get('$scope').find('applet[alt=""], applet:not(applet[alt])').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if (quail.isUnreadable($(this).text())) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

// options: selector: "body *:not(*[role] *, *[role], script, meta, link)"

quail.ariaOrphanedContent = function(quail, test, Case) {
  var $scope = test.get('$scope');
  //debugger;
  $scope.each(function() {
    var $local = $(this);
    // Determine if the scope has a role.
    var scopeHasRole = !!$local.attr('role');
    // Determine if any child nodes have a role.
    var childrenHaveRole = !!$local.find('[role]').length;
    // If no roles exist, then this test is not applicable.
    if (!scopeHasRole && !childrenHaveRole) {
      test.add(Case({
        expected: $local.data('expected'),
        status: 'inapplicable'
      }));
      return;
    }
    // If roles exist, make sure all content is within a role.
    var $orphans = $local.find('*:not(*[role] *, *[role], script, meta, link)');
    if (!$orphans.length) {
      test.add(Case({
        expected: $local.data('expected'),
        status: 'passed'
      }));
    }
    // Otherwise, fail the content that falls outside a role.
    else {
      $orphans.each(function() {
        test.add(Case({
          element: this,
          expected: $(this).closest('.quail-test').data('expected'),
          status: 'failed'
        }));
      });
    }
  });
};

quail.audioMayBePresent=function(quail, test, Case){
  var audioExtensions = ['mp3', 'm4p', 'ogg', 'oga', 'opus', 'wav', 'wma', 'wv'];

  test.get('$scope').each(function() {
    var $this = $(this);
    var hasCase = false; // Test if a case has been created

    // Audio is definately an audio, and objects could be too.
    $this.find('object, audio').each(function () {
      hasCase = true;
      test.add(Case({
        element: this,
        expected: $(this).closest('.quail-test').data('expected'),
        status: 'cantTell'
      }));
    });

    // Links refering to files with an audio extensions are good indicators too
    $this.find('a[href]').each(function () {
      var $this = $(this);
      var extension = $this.attr('href').split('.').pop();
      if ($.inArray(extension, audioExtensions) !== -1) {
        hasCase = true;
        test.add(Case({
          element: this,
          expected: $this.closest('.quail-test').data('expected'),
          status: 'cantTell'
        }));
      }
    });

    // if no case was added, return inapplicable
    if (!hasCase) {
      test.add(Case({
        element: this,
        status: 'inapplicable',
        expected: $(this).closest('.quail-test').data('expected')
      }));
    }
  });

};
quail.blockquoteUseForQuotations = function(quail, test, Case) {
  test.get('$scope').find('p').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if ($(this).parents('blockquote').length > 0) {
      _case.set({
        'status': 'inapplicable'
      });
      return;
    }
    if ($(this).text().substr(0, 1).search(/'|"|«|“|「/) > -1 &&
       $(this).text().substr(-1, 1).search(/'|"|»|„|」/) > -1) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.closingTagsAreUsed = function(quail, test, Case) {
  quail.components.htmlSource.getHtml(function(html, parsed) {
    quail.components.htmlSource.traverse(parsed, function(element) {
      if (element.type !== 'tag' || !$.isArray(element.selector)) {
        return;
      }
      var selector;
      // Use the element's ID if it has one.
      if (/#/.test(element.selector.slice(-1)[0])) {
        selector = element.selector.slice(-1)[0];
      }
      // Otherwise construct the path from the selector pieces.
      else {
        selector = element.selector.join(' > ');
      }

      // If selector matches a DOM node in the scope, get a reference to the
      // node, otherwise we'll have to back off to just giving details about
      // the node. This might happen if the DOM in the real page is
      // transformed too drastically from the parsed DOM.
      var node = $(selector, test.get('$scope')).get(0);
      if (!node) {
        node = element.raw || selector;
      }

      if (typeof element.closingTag === 'undefined' &&
            !element.closingTag &&
            quail.selfClosingTags.indexOf(element.name.toLowerCase()) === -1) {
        test.add(Case({
          element: node,
          // Only attempt to get an expectation for the testrunner if the node
          // is a DOM node.
          expected: (typeof node === 'object') && (node.nodeType === 1) && $(node).closest('.quail-test').data('expected') || null,
          status: 'failed'
        }));
      }
      else {
        test.add(Case({
          element: node,
          // Only attempt to get an expectation for the testrunner if the node
          // is a DOM node.
          expected: (typeof node === 'object') && (node.nodeType === 1) && $(node).closest('.quail-test').data('expected') || null,
          status: 'passed'
        }));
      }
    });
  });
};

quail.colorBackgroundGradientContrast = function (quail, test, Case, options) {

  var colors    = quail.components.color.colors;
  var buildCase =  quail.components.color.buildCase;
  var id        = 'colorBackgroundGradientContrast';

  /**
   *
   */
  function colorBackgroundGradientContrast(test, Case, options, $this, element) {
    // Check if there's a background gradient using DOM.
    var failureFound, rainbow, numberOfSamples;
    var backgroundGradientColors = colors.getBackgroundGradient($this);

    if (!backgroundGradientColors) {
      return;
    }

    // Convert colors to hex notation.
    for (var i = 0; i < backgroundGradientColors.length; i++) {
      if (backgroundGradientColors[i].substr(0, 3) === 'rgb') {
        backgroundGradientColors[i] = colors.colorToHex(backgroundGradientColors[i]);
      }
    }

    // Create a rainbow.
    /* global Rainbow */
    rainbow = new Rainbow();
    rainbow.setSpectrumByArray(backgroundGradientColors);
    // @todo, make the number of samples configurable.
    numberOfSamples = backgroundGradientColors.length * options.gradientSampleMultiplier;

    // Check each color.
    failureFound = false;
    for (i = 0; !failureFound && i < numberOfSamples; i++) {
      var testResult = colors.testElmBackground(options.algorithm, $this,
            '#' + rainbow.colourAt(i));

      if (!testResult) {
        buildCase(test, Case, element, 'failed', id, 'The background gradient makes the text unreadable');
        failureFound = true;
      }
    }

    // If no failure was found, the element passes for this case type.
    if (!failureFound) {
      buildCase(test, Case, element, 'passed', id, 'The background gradient does not affect readability');
    }
  }


  test.get('$scope').each(function () {
    var textNodes = document.evaluate('descendant::text()[normalize-space()]', this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var nodes     = [];
    var textNode  = textNodes.iterateNext();

    // Loop has to be separated. If we try to iterate and rund testCandidates
    // the xpath thing will crash because document is being modified.
    while (textNode) {
      if (quail.components.color.textShouldBeTested(textNode)) {
        nodes.push(textNode.parentNode);
      }
      textNode = textNodes.iterateNext();
    }

    if (nodes.length === 0) {
      buildCase(test, Case, null, 'inapplicable', '', 'There is no text to evaluate');
    }

    nodes.forEach(function (element) {
      colorBackgroundGradientContrast(test, Case, options, $(element), element);
    });

  });
};

quail.colorBackgroundImageContrast = function (quail, test, Case, options) {

  var colors    = quail.components.color.colors;
  var buildCase =  quail.components.color.buildCase;
  var id        = 'colorBackgroundImageContrast';

  /**
   *
   */
  function colorBackgroundImageContrast(test, Case, options, $this, element) {
    // Check if there's a backgroundImage using DOM.
    var backgroundImage = colors.getBackgroundImage($this);
    if (!backgroundImage) {
      return;
    }

    var img = document.createElement('img');
    img.crossOrigin = "Anonymous";

    // Get average color of the background image. The image must first load
    // before information about it is available to the DOM.
    img.onload = function () {
      var averageColorBackgroundImage = colors.getAverageRGB(img);
      var testResult = colors.testElmBackground(options.algorithm, $this,
            averageColorBackgroundImage);

      // Build a case.
      if (!testResult) {
        buildCase(test, Case, element, 'failed', id, 'The element\'s background image makes the text unreadable');

      } else {
        buildCase(test, Case, element, 'passed', id, 'The element\'s background image does not affect readability');
      }
    };

    img.onerror = img.onabort = function () {
      buildCase(test, Case, element, 'cantTell', id, 'The element\'s background image could not be loaded (' + backgroundImage + ')');
    };

    // Load the image.
    img.src = backgroundImage;
  }


  test.get('$scope').each(function () {
    var textNodes = document.evaluate('descendant::text()[normalize-space()]', this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var nodes = [];
    var textNode = textNodes.iterateNext();

    // Loop has to be separated. If we try to iterate and rund testCandidates
    // the xpath thing will crash because document is being modified.
    while (textNode) {
      if (quail.components.color.textShouldBeTested(textNode)) {
        nodes.push(textNode.parentNode);
      }
      textNode = textNodes.iterateNext();
    }

    if (nodes.length === 0) {
      buildCase(test, Case, null, 'inapplicable', '', 'There is no text to evaluate');
    }

    nodes.forEach(function (element) {
      colorBackgroundImageContrast(test, Case, options, $(element), element);
    });
  });
};

quail.colorElementBehindBackgroundGradientContrast = function (quail, test, Case, options) {

  var colors    = quail.components.color.colors;
  var buildCase =  quail.components.color.buildCase;
  var id        = 'colorElementBehindBackgroundGradientContrast';


  /**
   *
   */
  function colorElementBehindBackgroundGradientContrast(test, Case, options, $this, element) {
    // Check if there's a background gradient using element behind current element.
    var behindGradientColors;
    var failureFound;
    // The option element is problematic.
    if (!$this.is('option')) {
      behindGradientColors = colors.getBehindElementBackgroundGradient($this);
    }

    if (!behindGradientColors) {
      return;
    }

    // Convert colors to hex notation.
    for (var i = 0; i < behindGradientColors.length; i++) {
      if (behindGradientColors[i].substr(0, 3) === 'rgb') {
        behindGradientColors[i] = colors.colorToHex(behindGradientColors[i]);
      }
    }

    // Create a rainbow.
    /* global Rainbow */
    var rainbow = new Rainbow();
    rainbow.setSpectrumByArray(behindGradientColors);
    var numberOfSamples = behindGradientColors.length * options.gradientSampleMultiplier;

    // Check each color.
    failureFound = false;
    for (i = 0; !failureFound && i < numberOfSamples; i++) {
      failureFound = !colors.testElmBackground(options.algorithm, $this,
            '#' + rainbow.colourAt(i));
    }

    // If no failure was found, the element passes for this case type.
    if (failureFound) {
      buildCase(test, Case, element, 'failed', id, 'The background gradient of the element behind this element makes the text unreadable');
    } else {
      buildCase(test, Case, element, 'passed', id, 'The background gradient of the element behind this element does not affect readability');
    }
  }


  test.get('$scope').each(function () {
    var textNodes = document.evaluate('descendant::text()[normalize-space()]', this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var nodes = [];
    var textNode = textNodes.iterateNext();

    // Loop has to be separated. If we try to iterate and rund testCandidates
    // the xpath thing will crash because document is being modified.
    while (textNode) {
      if (quail.components.color.textShouldBeTested(textNode)) {
        nodes.push(textNode.parentNode);
      }
      textNode = textNodes.iterateNext();
    }

    if (nodes.length === 0) {
      buildCase(test, Case, null, 'inapplicable', '', 'There is no text to evaluate');
    }

    nodes.forEach(function (element) {
      colorElementBehindBackgroundGradientContrast(test, Case, options, $(element), element);
    });
  });

};

quail.colorElementBehindBackgroundImageContrast = function (quail, test, Case, options) {

  var colors    = quail.components.color.colors;
  var buildCase =  quail.components.color.buildCase;
  var id        = 'colorElementBehindBackgroundImageContrast';

  /**
   *
   */
  function colorElementBehindBackgroundImageContrast(test, Case, options, $this, element) {
    // Check if there's a backgroundImage using element behind current element.
    var behindBackgroundImage;

    // The option element is problematic.
    if (!$this.is('option')) {
      behindBackgroundImage = colors.getBehindElementBackgroundImage($this);
    }

    if (!behindBackgroundImage) {
      return;
    }

    var img = document.createElement('img');
    img.crossOrigin = "Anonymous";
    // The image must first load before information about it is available to
    // the DOM.
    img.onload = function () {

      // Get average color of the background image.
      var averageColorBehindBackgroundImage = colors.getAverageRGB(img);
      var testResult = colors.testElmBackground(options.algorithm, $this,
            averageColorBehindBackgroundImage);
      if (!testResult) {
        buildCase(test, Case, element, 'failed', id, 'The background image of the element behind this element makes the text unreadable');

      } else {
        buildCase(test, Case, element, 'passed', id, 'The background image of the element behind this element does not affect readability');
      }
    };
    img.onerror = img.onabort = function () {
      buildCase(test, Case, element, 'cantTell', id, 'The background image of the element behind this element could not be loaded (' + behindBackgroundImage + ')');
    };
    // Load the image.
    img.src = behindBackgroundImage;
  }


  test.get('$scope').each(function () {
    var textNodes = document.evaluate('descendant::text()[normalize-space()]', this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var nodes = [];
    var textNode = textNodes.iterateNext();

    // Loop has to be separated. If we try to iterate and rund testCandidates
    // the xpath thing will crash because document is being modified.
    while (textNode) {
      if (quail.components.color.textShouldBeTested(textNode)) {
        nodes.push(textNode.parentNode);
      }
      textNode = textNodes.iterateNext();
    }

    if (nodes.length === 0) {
      buildCase(test, Case, null, 'inapplicable', '', 'There is no text to evaluate');
    }

    nodes.forEach(function (element) {
      colorElementBehindBackgroundImageContrast(test, Case, options, $(element), element);
    });
  });
};

quail.colorElementBehindContrast = function (quail, test, Case, options) {

  var colors    = quail.components.color.colors;
  var buildCase =  quail.components.color.buildCase;
  var id        = 'colorElementBehindContrast';

  function colorElementBehindContrast(test, Case, options, $this, element) {
    // Check text and background using element behind current element.
    var backgroundColorBehind;
    // The option element is problematic.
    if (!$this.is('option')) {
      backgroundColorBehind = colors.getBehindElementBackgroundColor($this);
    }
    if (!backgroundColorBehind) {
      return;
    }

    var testResult = colors.testElmBackground(options.algorithm, $this,
          backgroundColorBehind);

    // Build a case.
    if (!testResult) {
      buildCase(test, Case, element, 'failed', id, 'The element behind this element makes the text unreadable');
    }
    else {
      buildCase(test, Case, element, 'passed', id, 'The element behind this element does not affect readability');
    }
  }


  test.get('$scope').each(function () {
    var textNodes = document.evaluate('descendant::text()[normalize-space()]', this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var nodes = [];
    var textNode = textNodes.iterateNext();

    // Loop has to be separated. If we try to iterate and rund testCandidates
    // the xpath thing will crash because document is being modified.
    while (textNode) {
      if (quail.components.color.textShouldBeTested(textNode)) {
        nodes.push(textNode.parentNode);
      }
      textNode = textNodes.iterateNext();
    }

    if (nodes.length === 0) {
      buildCase(test, Case, null, 'inapplicable', '', 'There is no text to evaluate');
    }

    nodes.forEach(function (element) {
      colorElementBehindContrast(test, Case, options, $(element), element);
    });

  });
};

quail.colorFontContrast = function (quail, test, Case, options) {

  var colors    = quail.components.color.colors;
  var buildCase =  quail.components.color.buildCase;
  var id        = 'colorFontContrast';

  /**
   *
   */
  function colorFontContrast(test, Case, options, $this, element) {
    // Check text and background color using DOM.
    // Build a case.
    if (!colors.testElmContrast(options.algorithm, $this)) {
      buildCase(test, Case, element, 'failed', id, 'The font contrast of the text impairs readability');
    }
    else {
      buildCase(test, Case, element, 'passed', id, 'The font contrast of the text is sufficient for readability');
    }
  }


  test.get('$scope').each(function () {
    var textNodes = document.evaluate('descendant::text()[normalize-space()]', this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var nodes = [];
    var textNode = textNodes.iterateNext();

    // Loop has to be separated. If we try to iterate and rund testCandidates
    // the xpath thing will crash because document is being modified.
    while (textNode) {
      if (quail.components.color.textShouldBeTested(textNode)) {
        nodes.push(textNode.parentNode);
      }
      textNode = textNodes.iterateNext();
    }

    if (nodes.length === 0) {
      buildCase(test, Case, null, 'inapplicable', '', 'There is no text to evaluate');
    }

    nodes.forEach(function (element) {
      colorFontContrast(test, Case, options, $(element), element);
    });
  });
};

quail.contentPositioningShouldNotChangeMeaning = function(quail, test, Case) {
  //Look for absolute positioned elements that are being put into grids or columns
  var positions = ['top', 'left', 'right', 'bottom'];
  var coordinates = {};
  var failed = false;
  test.get('$scope').find('*:has(*:quailCss(position=absolute))').each(function() {
    coordinates = {top: {}, left: {}, right: {}, bottom: {}};
    failed = false;
    var $container = $(this);
    $container.find('h1, h2, h3, h4, h5, h6, p, blockquote, ol, li, ul, dd, dt').filter(':quailCss(position=absolute)').each(function() {
      for (var i = 0; i < positions.length; i++) {
        if (typeof $(this).css(positions[i]) !== 'undefined' && $(this).css(positions[i]) !== 'auto') {
          if (typeof coordinates[positions[i]][$(this).css(positions[i])] === 'undefined') {
            coordinates[positions[i]][$(this).css(positions[i])] = 0;
          }
          coordinates[positions[i]][$(this).css(positions[i])]++;
        }
      }
    });

    $.each(positions, function() {
      $.each(coordinates[this], function() {
        if (this > 2 && !failed) {
          failed = true;
          test.add(Case({
            element: $container.get(0),
            expected: $container.closest('.quail-test').data('expected'),
            status: 'failed'
          }));
        }
      });
    });
  });
};

quail.definitionListsAreUsed = function(quail, test, Case) {
  test.get('$scope').find('dl').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    _case.set({
      'status': 'inapplicable'
    });
  });
  test.get('$scope').find('p, li').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    var $item = $(this);
    $(this).find('span, strong, em, b, i').each(function() {
      if ($(this).text().length < 50 && $item.text().search($(this).text()) === 0) {
        if ($(this).is('span')) {
          if ($(this).css('font-weight') === $item.css('font-weight') &&
              $(this).css('font-style') === $item.css('font-style') ) {
            _case.set({
              'status': 'passed'
            });
            return;
          }
        }
        _case.set({
          'status': 'failed'
        });
      }
    });
  });
};

quail.doNotUseGraphicalSymbolToConveyInformation = function(quail, test, Case) {
  // Passes and fails.
  test.get('$scope').find(quail.textSelector + ':not(abbr, acronym)').each(function() {
    var whiteList = '✓';
    var blackList = '?xo[]()+-!*xX';

    var text = $(this).text();

    // @todo add support for other languages.
    // Remove all alphanumeric characters.
    var textLeft = text.replace(/[\W\s]+/g, '');
    // If we have an empty string something is wrong.
    if (textLeft.length === 0) {
      // Unless if it's white listed.
      if (whiteList.indexOf(text) === -1) {
        test.add(Case({
          element: this,
          expected: (function (element) {
            return quail.components.resolveExpectation(element);
          }(this)),
          status: 'failed'
        }));
      }
    }
    // Check regularly used single character symbols.
    else if (text.length === 1 && blackList.indexOf(text) >= 0) {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'failed'
      }));
    }
    else {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'passed'
      }));
    }
  });
  // Not applicables.
  test.get('$scope').find(quail.textSelector).filter('abbr, acronym').each(function() {
    test.add(Case({
      element: this,
      expected: (function (element) {
        return quail.components.resolveExpectation(element);
      }(this)),
      status: 'inapplicable'
    }));
  });
};

quail.doctypeProvided = function(quail, test, Case) {
  var doc = test.get('$scope').get(0);
  if ($(doc.doctype).length === 0 && !document.doctype) {
    test.add(Case({
      element: doc,
      expected: 'fail',
      status: 'failed'
    }));
  }
  else {
    test.add(Case({
      element: doc,
      expected: 'pass',
      status: 'passed'
    }));
  }
};

quail.documentAbbrIsUsed = function(quail, test, Case) {
  quail.components.acronym(quail, test, Case, 'abbr');
};

quail.documentAcronymsHaveElement = function(quail, test, Case) {
  quail.components.acronym(quail, test, Case, 'acronym');
};

quail.documentIDsMustBeUnique = function(quail, test, Case) {
  test.get('$scope').each(function(){
    if($(this).children().length === 0) {
      test.add(Case({
        element: this,
        'status': 'inapplicable',
        expected: $(this).closest('.quail-test').data('expected')
      }));
    }
  });
  test.get('$scope').find(':not([id])').each(function() {
    test.add(Case({
      element: this,
      'status': 'inapplicable',
      expected: $(this).closest('.quail-test').data('expected')
    }));
  });
  test.get('$scope').each(function(){
    var ids = {};
    $(this).find('[id]').each(function() {
      var _case = Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this))
      });
      test.add(_case);
      if(typeof ids[$(this).attr('id')] === 'undefined' && Object.keys(ids).length === 0){
        _case.set({
          'status': 'inapplicable'
        });
        ids[$(this).attr('id')] = $(this).attr('id');
      }else if (typeof ids[$(this).attr('id')] === 'undefined') {
        _case.set({
          'status': 'passed'
        });
        ids[$(this).attr('id')] = $(this).attr('id');
      }
      else {
        _case.set({
          'status': 'failed'
        });
      }
    });
  });
};

quail.documentIsWrittenClearly = function(quail, test, Case) {
  test.get('$scope').find(quail.textSelector).each(function() {
    var text = quail.components.textStatistics.cleanText($(this).text());
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if (quail.isUnreadable(text)) {
      _case.set({
        'status' : 'inapplicable'
      });
      return;
    }
    if (Math.round((206.835 - (1.015 * quail.components.textStatistics.averageWordsPerSentence(text)) - (84.6 * quail.components.textStatistics.averageSyllablesPerWord(text)))) < 60) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.documentLangIsISO639Standard = function(quail, test, Case) {
  var $element = (test.get('$scope').is('html')) ?
    test.get('$scope') :
    test.get('$scope').find('html').first();

  var _case = Case({
    element: $element[0],
    expected: ($element.closest('.quail-test').length) ?
      $element.closest('.quail-test').data('expected') :
      $element.data('expected')
  });

  var langAttr = $element.attr('lang');
  var matchedLang = false; // Check to see if a languagecode was matched

  test.add(_case);
  if (!$element.is('html') || typeof langAttr === 'undefined') {
    _case.set({
      'status' : 'inapplicable'
    });
  } else {
    // Loop over all language codes, checking if the current lang attribute starts
    // with a value that's in the languageCodes array
    $.each(quail.strings.languageCodes, function (i, currentLangCode) {
      if (!matchedLang && langAttr.indexOf(currentLangCode) === 0) {
        matchedLang = true;
      }
    });

    if (!matchedLang) {
      _case.set({'status': 'failed'});

    } else if (langAttr.match(/^[a-z]{2}(-[A-Z]{2})?$/) === null) {
      _case.set({'status': 'failed'});

    } else {
      _case.set({'status': 'passed'});
    }
  }

};

quail.documentStrictDocType = function(quail, test, Case) {
  if (typeof document.doctype === 'undefined' ||
    !document.doctype ||
    document.doctype.systemId.search('strict') === -1) {
    test.add(Case({
      element: document,
      expected: test.get('$scope').data('expected'),
      status: 'failed'
    }));
  }
  else {
    test.add(Case({
      element: document,
      expected: test.get('$scope').data('expected'),
      status: 'passed'
    }));
  }
};

quail.documentTitleIsShort = function(quail, test, Case) {
  var $title = test.get('$scope').find('head title:first');
  var _case = Case({
    element: $title,
    expected: $title.closest('.quail-test').data('expected')
  });
  test.add(_case);
  if (!$title.length) {
    _case.set({
      element: test.get('$scope'),
      'status' : 'inapplicable'
    });
    return;
  }
  _case.set({
    'status': $title.text().length > 150 ?
      'failed' :
      'passed'
  });
};

quail.documentValidatesToDocType = function() {
  if (typeof document.doctype === 'undefined') {
    return;
  }
};

quail.documentVisualListsAreMarkedUp = function(quail, test, Case) {

  var itemStarters = [
    '♦', '›', '»', '‣', '▶', '◦', '✓', '◽', '•', '—', '◾', // single characters
    '-\\D',                       // dash, except for negative numbers
    '\\\\',                       // Just an escaped slash
    '\\*(?!\\*)',                 // *, but not ** (which could be a foot note)
    '\\.\\s', 'x\\s',             // characters that should be followed by a space
    '&bull;', '&#8226;', '&gt;',  // HTML entities
    '[0-9]+\\.', '\\(?[0-9]+\\)', // Numbers: 1., 13., 13), (14)
    '[\\u25A0-\\u25FF]',          // Unicode characters that look like bullets
    '[IVX]{1,5}\\.\\s'            // Roman numerals up to (at least) 27, followed by ". " E.g. II. IV.
  ];

  var symbols = RegExp(
    '(^|<br[^>]*>)' +                   // Match the String start or a <br> element
    '[\\s]*' +                          // Optionally followed by white space characters
    '(' + itemStarters.join('|') + ')', // Followed by a character that could indicate a list
  'gi'); // global (for counting), case insensitive (capitalisation in elements / entities)


  test.get('$scope').find(quail.textSelector).each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    var matches = $(this).html().match(symbols);
    _case.set({
      'status': (matches && matches.length > 2) ?
        'failed' :
        'passed'
    });
  });
};

quail.elementAttributesAreValid = function(quail, test, Case) {
	quail.components.htmlSource.getHtml(function(html, parsed) {
		if (!parsed) {
			return;
		}
		quail.components.htmlSource.traverse(parsed, function(element) {
			if (typeof element.raw === 'undefined' || !$.isArray(element.selector)) {
				return;
			}

      var failed = false, selector;
      // Use the element's ID if it has one.
      if (/#/.test(element.selector.slice(-1)[0])) {
        selector = element.selector.slice(-1)[0];
      }
      // Otherwise construct the path from the selector pieces.
      else {
        selector = element.selector.join(' > ');
      }

      // If selector matches a DOM node in the scope, get a reference to the
      // node, otherwise we'll have to back off to just giving details about
      // the node. This might happen if the DOM in the real page is
      // transformed too drastically from the parsed DOM.
      var node = $(selector, test.get('$scope')).get(0);
      if (!node) {
        node = element.raw || selector;
      }

			//Element has mis-matched quotes
			var quotes = element.raw.match(/\'|\"/g);
			if (quotes && quotes.length % 2 !== 0) {
				test.add(Case({
					element: node,
					expected: (typeof node === 'object') && (node.nodeType === 1) && $(node).closest('.quail-test').data('expected') || null,
					status: 'failed'
				}));
				failed = true;
			}

			//Element attributes not separated by a space
			if (element.raw.search(/([a-z]*)=(\'|\")([a-z\.]*)(\'|\")[a-z]/i) > -1) {
				test.add(Case({
					element: node,
					expected: (typeof node === 'object') && (node.nodeType === 1) && $(node).closest('.quail-test').data('expected') || null,
					status: 'failed'
				}));
				failed = true;
			}

			//Element with space as an attribute is not surrounded by quotes
			var splitElement = element.raw.split('=');
			splitElement.shift();
			$.each(splitElement, function() {
				if (this.search(/\'|\"/) === -1 && this.search(/\s/i) > -1) {
					test.add(Case({
						element: node,
						expected: (typeof node === 'object') && (node.nodeType === 1) && $(node).closest('.quail-test').data('expected') || null,
						status: 'failed'
					}));
					failed = true;
				}
			});

			// Passes.
			if (!failed) {
				test.add(Case({
					element: node,
					expected: (typeof node === 'object') && (node.nodeType === 1) && $(node).closest('.quail-test').data('expected') || null,
					status: 'passed'
				}));
			}
		});
	});
};

quail.elementsDoNotHaveDuplicateAttributes = function(quail, test, Case) {
  quail.components.htmlSource.getHtml(function(html, parsed) {
    if (!parsed) {
      return;
    }
    quail.components.htmlSource.traverse(parsed, function(element) {
      if (element.type !== 'tag' || !$.isArray(element.selector)) {
        return;
      }
      var selector;
      // Use the element's ID if it has one.
      if (/#/.test(element.selector.slice(-1)[0])) {
        selector = element.selector.slice(-1)[0];
      }
      // Otherwise construct the path from the selector pieces.
      else {
        selector = element.selector.join(' > ');
      }
      // If selector matches a DOM node in the scope, get a reference to the
      // node, otherwise we'll have to back off to just giving details about
      // the node. This might happen if the DOM in the real page is
      // transformed too drastically from the parsed DOM.
      var node = $(selector, test.get('$scope')).get(0);
      if (!node) {
        node = element.raw || selector;
      }
      if (typeof element.attributes !== 'undefined') {
        var attrs = [];
        $.each(element.attributes, function(index, attribute) {
          if (attribute.length > 1) {
            attrs.push(attribute);
          }
        });
        // If multiple attributes are found on a node, the test fails.
        if (attrs.length) {
          test.add(Case({
            element: node,
            // Only attempt to get an expectation for the testrunner if the node
            // is a DOM node.
            expected: (typeof node === 'object') && (node.nodeType === 1) && $(node).closest('.quail-test').data('expected') || null,
            info: attrs,
            status: 'failed'
          }));
        }
        // Otherwise it passes.
        else {
          test.add(Case({
            element: node,
            // Only attempt to get an expectation for the testrunner if the node
            // is a DOM node.
            expected: (typeof node === 'object') && (node.nodeType === 1) && $(node).closest('.quail-test').data('expected') || null,
            info: attrs,
            status: 'passed'
          }));
        }
      }
    });
  });
};

quail.embedHasAssociatedNoEmbed = function(quail, test, Case) {
  test.get('$scope').find('embed').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    _case.set({
      'status': ($(this).find('noembed').length || $(this).next().is('noembed')) ?
        'passed' :
        'failed'
    });
  });
};

quail.emoticonsExcessiveUse = function(quail, test, Case) {
  test.get('$scope').find(quail.textSelector).each(function() {
    var count = 0;
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    $.each($(this).text().split(' '), function(index, word) {
      if (word.search(quail.emoticonRegex) > -1 ) {
        count++;
      }
    });
    if (count === 0) {
      _case.set({
        'status': 'inapplicable'
      });
    }
    else {
      _case.set({
        'status': (count > 4) ?
          'failed' :
          'passed'
      });
    }
  });
};

quail.emoticonsMissingAbbr = function(quail, test, Case) {
  test.get('$scope').find(quail.textSelector + ':not(abbr, acronym)').each(function() {
    var $element = $(this);
    var $clone = $element.clone();
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    $clone.find('abbr, acronym').each(function() {
      $(this).remove();
    });
    var status = 'passed';
    $.each($clone.text().split(' '), function(index, word) {
      if (word.search(quail.emoticonRegex) > -1 ) {
        status = 'failed';
      }
    });
    _case.set({
      'status': status
    });
  });
};

quail.focusIndicatorVisible = function(quail, test, Case) {
  test.get('$scope').find(quail.focusElements).each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    var noFocus = {
      borderWidth : $(this).css('border-width'),
      borderColor : $(this).css('border-color'),
      backgroundColor : $(this).css('background-color'),
      boxShadow : $(this).css('box-shadow')
    };
    $(this).focus();
    if (noFocus.backgroundColor.trim() !== $(this).css('background-color').trim()) {
      $(this).blur();
      _case.set({
        'status': 'passed'
      });
      return;
    }

    var borderWidth = quail.components.convertToPx($(this).css('border-width'));
    if (borderWidth > 2 && borderWidth !== quail.components.convertToPx(noFocus.borderWidth)) {
      $(this).blur();
      _case.set({
        'status': 'passed'
      });
      return;
    }

    var boxShadow = ($(this).css('box-shadow') && $(this).css('box-shadow') !== 'none') ? $(this).css('box-shadow').match(/(-?\d+px)|(rgb\(.+\))/g) : false;
    if (boxShadow && $(this).css('box-shadow') !== noFocus.boxShadow && quail.components.convertToPx(boxShadow[3]) > 3) {
      $(this).blur();
      _case.set({
        'status': 'passed'
      });
      return;
    }
    $(this).blur();
    _case.set({
      'status': 'failed'
    });
  });
};

quail.formWithRequiredLabel = function(quail, test, Case) {
  var redundant = quail.strings.redundant;
  var lastStyle, currentStyle = false;
  redundant.required[redundant.required.indexOf('*')] = /\*/g;
  test.get('$scope').each(function () {
    var $local = $(this);
    $local.find('label').each(function() {
      var text = $(this).text().toLowerCase();
      var $label = $(this);
      var _case = test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this))
      }));
      for (var word in redundant.required) {
        if (text.search(word) >= 0 && !test.get('$scope').find('#' + $label.attr('for')).attr('aria-required')) {
          _case.set({
            'status': 'failed'
          });
        }
      }
      currentStyle = $label.css('color') + $label.css('font-weight') + $label.css('background-color');
      if (lastStyle && currentStyle !== lastStyle) {
        _case.set({
          'status': 'failed'
        });
      }
      lastStyle = currentStyle;
      if (typeof _case.get('status') === 'undefined') {
        _case.set({
          'status': 'passed'
        });
      }
    });
  });
};

quail.headerTextIsTooLong = function(quail, test, Case) {
  var headerMaxLength = 128;

  test.get('$scope').find('h1, h2, h3, h4, h5, h6').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected'),
      status: $(this).text().replace(/^\s+|\s+$/gm,'').length > headerMaxLength ?
        'failed' :
        'passed'
    });
    test.add(_case);
  });
};

quail.headersAttrRefersToATableCell = function(quail, test, Case) {

  // Table cell headers without referred ids
  test.get('$scope').find('table').each(function() {

    var element = this;
    var _case = Case({
        element: element,
        expected: $(this).closest('.quail-test').data('expected')
      });
    test.add(_case);
    var elmHeaders = $(element).find('th[headers], td[headers]');

    if (elmHeaders.length === 0) {
      _case.set({
        'status': 'inapplicable'
      });
      return;
    } else {
      elmHeaders.each(function() {
        var headers = $(this).attr('headers').split(/\s+/);
        $.each(headers, function(index, item) {
          if (item === "" || $(element).find('th#' + item + ',td#' + item).length > 0) {
            _case.set({
              'status': 'passed'
            });
            return;
          } else {
            _case.set({
              'status': 'failed'
            });
            return;
          }
        });
      });
    }
  });
};

quail.headersUseToMarkSections = function(quail, test, Case) {
  test.get('$scope').find('p').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    var $paragraph = $(this);
    $paragraph.find('strong:first, em:first, i:first, b:first').each(function() {
      _case.set({
        'status': ($paragraph.text().trim() === $(this).text().trim()) ?
          'failed' :
          'passed'
      });
    });
  });

  test.get('$scope').find('ul, ol').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    var $list = $(this);
    if ($list.prevAll(':header').length ||
      $list.find('li').length !== $list.find('li:has(a)').length) {
      _case.set({
        'status': 'passed'
      });
      return;
    }
    var isNavigation = true;
    $list.find('li:has(a)').each(function() {
      if ($(this).text().trim() !== $(this).find('a:first').text().trim()) {
        isNavigation = false;
      }
    });
    if (isNavigation) {
      _case.set({
        'status': 'failed'
      });
    }
  });
};

quail.headersUsedToIndicateMainContent = function(quail, test, Case) {
  test.get('$scope').each(function() {
    var $local = $(this);
    var $content = quail.components.content.findContent($local);

    if (typeof $content !== 'undefined' && (
      $content.find(':header').length === 0 ||
      !$content.find(quail.textSelector).first().is(':header')
      )) {
      test.add(Case({
        element: $content.get(0),
        expected: $content.closest('.quail-test').data('expected'),
        status: 'failed'
      }));
    }
    else {
      test.add(Case({
        element: $content.get(0),
        expected: $content.closest('.quail-test').data('expected'),
        status: 'passed'
      }));
    }
  });
};

quail.idRefHasCorrespondingId = function(quail, test, Case) {
  test.get('$scope').find('label[for], *[aria-activedescendant]').each(function() {
    var $this = $(this);
    var _case = Case({
      element: this,
      expected: $this.closest('.quail-test').data('expected')
    });
    test.add(_case);

    var find = $this.attr('for') || $this.attr('aria-activedescendant');
    if (test.get('$scope').find('#' + find).length === 0) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.idrefsHasCorrespondingId = function( quail, test, Case ) {

  function getAttribute($element){
    var attribute = [];
    var attributeList = ['headers', 'aria-controls', 'aria-describedby', 'aria-flowto', 'aria-labelledby', 'aria-owns'];

    $.each(attributeList, function(index, item){

      var attr =  $element.attr(item);

      if(typeof attr !== typeof undefined && attr !== false){
        attribute = attr;
        return;
      }
    });
    return attribute.split( /\s+/ );
  }

  test.get('$scope').each(function() {

      var testableElements = $(this).find(
        'td[headers], th[headers], [aria-controls], [aria-describedby], [aria-flowto], ' +
        '[aria-labelledby], [aria-owns]');

      if (testableElements.length === 0) {

        test.add(Case({
          element: this,
          expected: $(this).closest('.quail-test').data('expected'),
          status: 'inapplicable'
        }));
        return;
      } else {

        testableElements.each(function() {
          var element = this;
          var _case = test.add(Case({
            element: this,
            expected: $(this).closest('.quail-test').data('expected')
          }));

          var attributes = getAttribute($(element));
          var status = 'passed';

          $.each(attributes, function(index, item) {

            if (item !== "" && $('#' + item).length === 0) {
              status = 'failed';
              return;
            }
          });

          _case.set({
            'status': status
          });
        });
      }

    }
  );
};
quail.imgAltIsDifferent = function(quail, test, Case) {
  test.get('$scope').find('img:not([src])').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected'),
      'status': 'inapplicable'
    });
    test.add(_case);
  });
  test.get('$scope').find('img[alt][src]').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if ($(this).attr('src') === $(this).attr('alt') || $(this).attr('src').split('/').pop() === $(this).attr('alt')) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.imgAltIsTooLong = function(quail, test, Case) {
  test.get('$scope').find('img[alt]').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    _case.set({
      'status': ($(this).attr('alt').length > 100) ?
        'failed' :
        'passed'
    });
  });
};

quail.imgAltNotEmptyInAnchor = function(quail, test, Case) {
  test.get('$scope').find('a[href]:has(img)').each(function() {
    var $a   = $(this);
    var text = $a.text();

    var _case = Case({
      element: this,
      expected: $a.closest('.quail-test').data('expected')
    });
    test.add(_case);

    // Concat all alt attributes of images to the text of the paragraph
    $a.find('img[alt]').each(function () {
      text += ' ' + $(this).attr('alt');
    });

    if (quail.isUnreadable(text)) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.imgAltTextNotRedundant = function(quail, test, Case) {
  var altText = {};
  test.get('$scope').find('img[alt]').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if (typeof altText[$(this).attr('alt')] === 'undefined') {
      altText[$(this).attr('alt')] = $(this).attr('src');
    }
    else {
      if (altText[$(this).attr('alt')] !== $(this).attr('src')) {
        _case.set({
          'status': 'failed'
        });
      }
      else {
        _case.set({
          'status': 'passed'
        });
      }
    }
  });
};

quail.imgGifNoFlicker = function(quail, test, Case) {
  test.get('$scope').find('img[src$=".gif"]').each(function() {
    var $image = $(this);
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    $.ajax({
      url: $image.attr('src'),
      dataType: 'text',
      success: function(data) {
        if (data.search('NETSCAPE2.0') !== -1) {
          _case.set({
            'status' : 'failed'
          });
        }
        else {
          _case.set({
            'status' : 'inapplicable'
          });
        }
      }
    });
  });
};

quail.imgHasLongDesc = function (quail, test, Case) {
  test.get('$scope').find('img[longdesc]').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if ($(this).attr('longdesc') === $(this).attr('alt') ||
        !quail.validURL($(this).attr('longdesc'))) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.imgImportantNoSpacerAlt = function (quail, test, Case) {
  test.get('$scope').find('img[alt]').each(function() {
    var width = ($(this).width()) ? $(this).width() : parseInt($(this).attr('width'), 10);
    var height = ($(this).height()) ? $(this).height() : parseInt($(this).attr('height'), 10);
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if (quail.isUnreadable($(this).attr('alt').trim()) &&
        $(this).attr('alt').length > 0 &&
        width > 50 &&
        height > 50) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.imgMapAreasHaveDuplicateLink = function (quail, test, Case) {
  var links = { };
  test.get('$scope').find('a').each(function() {
    links[$(this).attr('href')] = $(this).attr('href');
  });
  test.get('$scope').find('img[usemap]').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    var $image = $(this);
    var $map = test.get('$scope').find($image.attr('usemap'));
    if (!$map.length) {
      $map = test.get('$scope').find('map[name="' + $image.attr('usemap').replace('#', '') + '"]');
    }
    if ($map.length) {
      $map.find('area').each(function() {
        if (typeof links[$(this).attr('href')] === 'undefined') {
          _case.set({
            'status': 'failed'
          });
        }
        else {
          _case.set({
            'status': 'passed'
          });
        }
      });
    }
    else {
      _case.set({
        'status': 'inapplicable'
      });
    }
  });
};

quail.imgNonDecorativeHasAlt = function (quail, test, Case) {
  test.get('$scope').find('img[alt]').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if (quail.isUnreadable($(this).attr('alt')) &&
        ($(this).width() > 100 || $(this).height() > 100)) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.imgWithMathShouldHaveMathEquivalent = function (quail, test, Case) {
  test.get('$scope').find('img:not(img:has(math), img:has(tagName))').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if (!$(this).parent().find('math').length) {
      _case.set({
        'status': 'failed'
      });
    }
  });
};

quail.inputCheckboxRequiresFieldset = function (quail, test, Case) {
  test.get('$scope').find(':checkbox').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if (!$(this).parents('fieldset').length) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.inputImageAltIsNotFileName = function (quail, test, Case) {
  test.get('$scope').find('input[type=image][alt]').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if ($(this).attr('src') === $(this).attr('alt')) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.inputImageAltIsShort = function (quail, test, Case) {
  test.get('$scope').find('input[type=image]').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if ($(this).attr('alt').length > 100) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.inputImageAltNotRedundant = function (quail, test, Case) {
  test.get('$scope').find('input[type=image][alt]').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if (quail.strings.redundant.inputImage.indexOf(quail.cleanString($(this).attr('alt'))) > -1) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.inputWithoutLabelHasTitle = function (quail, test, Case) {

  test.get('$scope').each(function(){

    var testableElements = $(this).find('input, select, textarea');

    if(testableElements.length === 0){
      var _case = Case({
        element: this,
        expected: $(this).closest('.quail-test').data('expected'),
        status: 'inapplicable'
      });
      test.add(_case);
      return;
    }else{
      testableElements.each(function() {
        var _case = Case({
          element: this,
          expected: $(this).closest('.quail-test').data('expected')
        });
        test.add(_case);

        if($(this).css('display') === 'none'){
          _case.set({
            'status': 'inapplicable'
          });
          return;
        }
        if (!test.get('$scope').find('label[for=' + $(this).attr('id') + ']').length &&
          (!$(this).attr('title') || quail.isUnreadable($(this).attr('title')))) {
          _case.set({
            'status': 'failed'
          });
        }
        else {
          _case.set({
            'status': 'passed'
          });
        }
      });
    }
  });
};
quail.labelMustBeUnique = function (quail, test, Case) {
  var labels = { };
  test.get('$scope').find('label[for]').each(function() {
    if (typeof labels[$(this).attr('for')] === 'undefined') {
      labels[$(this).attr('for')] = 0;
    }
    labels[$(this).attr('for')]++;
  });
  test.get('$scope').find('label[for]').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected'),
      status: (labels[$(this).attr('for')] === 1) ?
        'passed' :
        'failed'
    });
    test.add(_case);
  });
};

quail.labelsAreAssignedToAnInput = function(quail, test, Case) {
  test.get('$scope').find('label').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if (!$(this).attr('for')) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      if (!test.get('$scope').find('#' + $(this).attr('for')).length ||
         !test.get('$scope').find('#' + $(this).attr('for')).is(':input')) {
        _case.set({
          'status': 'failed'
        });
      }
      else {
        _case.set({
          'status': 'passed'
        });
      }
    }
  });
};

quail.languageChangesAreIdentified = function(quail, test, Case) {
  var $scope = test.get('$scope');
  var currentLanguage = quail.components.language.getDocumentLanguage($scope, true);
  var text, regularExpression, matches, $element, element, failed;

  var noCharactersMatch = function($element, language, matches, regularExpression) {
    var $children = $element.find('[lang=' + language + ']');
    var childMatches;
    if ($children.length === 0) {
      return true;
    }
    matches = matches.length;
    $children.each(function() {
      childMatches = quail.getTextContents($(this)).match(regularExpression);
      if (childMatches) {
        matches -= childMatches.length;
      }
    });
    return matches > 0;
  };

  var findCurrentLanguage = function($element) {
    if ($element.attr('lang')) {
      return $element.attr('lang').trim().toLowerCase().split('-')[0];
    }
    if ($element.parents('[lang]').length) {
      return $element.parents('[lang]:first').attr('lang').trim().toLowerCase().split('-')[0];
    }
    return quail.components.language.getDocumentLanguage($scope, true);
  };

  $scope.find(quail.textSelector).each(function() {
    element = this;
    $element = $(this);
    currentLanguage = findCurrentLanguage($element);
    text = quail.getTextContents($element);
    failed = false;

    $.each(quail.components.language.scriptSingletons, function(code, regularExpression) {
      if (code === currentLanguage) {
        return;
      }
      matches = text.match(regularExpression);
      if (matches && matches.length && noCharactersMatch($element, code, matches, regularExpression)) {
      //debugger;
        test.add(Case({
          element: element,
          expected: (function (element) {
            return quail.components.resolveExpectation(element);
          }(element)),
          info: { language : code },
          status: 'failed'
        }));
        failed = true;
      }
    });
    $.each(quail.components.language.scripts, function(code, script) {
      if (script.languages.indexOf(currentLanguage) !== -1) {
        return;
      }
      matches = text.match(script.regularExpression);
      if (matches && matches.length && noCharactersMatch($element, code, matches, regularExpression)) {
      //debugger;
        test.add(Case({
          element: element,
          expected: (function (element) {
            return quail.components.resolveExpectation(element);
          }(element)),
          info: { language : code },
          status: 'failed'
        }));
        failed = true;
      }
    });
    if (typeof guessLanguage !== 'undefined' && !$element.find('[lang]').length && $element.text().trim().length > 400) {
      guessLanguage.info($element.text(), function(info) {
        if (info[0] !== currentLanguage) {
      //debugger;
          test.add(Case({
            element: element,
            expected: (function (element) {
              return quail.components.resolveExpectation(element);
            }(element)),
            info: { language : info[0] },
            status: 'failed'
          }));
          failed = true;
        }
      });
    }
    // Passes.
    if (!failed) {
      test.add(Case({
        element: element,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(element)),
        status: 'passed'
      }));
    }
  });
};

quail.languageDirAttributeIsUsed = function(quail, test, Case) {

  var textDirection = quail.components.language.textDirection;

  function countDirAttributes() {
    var $el = $(this);
    var currentDirection = $el.attr('dir');
    if (!currentDirection) {
      var parentDir = $el.closest('[dir]').attr('dir');
      currentDirection = parentDir || currentDirection;
    }
    if (typeof currentDirection === 'string') {
      currentDirection = currentDirection.toLowerCase();
    }
    if (typeof textDirection[currentDirection] === 'undefined') {
      currentDirection = 'ltr';
    }
    var oppositeDirection = (currentDirection === 'ltr') ? 'rtl' : 'ltr';
    var text = quail.getTextContents($el);
    var textMatches = text.match(textDirection[oppositeDirection]);
    if (!textMatches) {
      return;
    }
    var matches = textMatches.length;
    $el.find('[dir=' + oppositeDirection + ']').each(function() {
      var childMatches = $el[0].textContent.match(textDirection[oppositeDirection]);
      if (childMatches) {
        matches -= childMatches.length;
      }
    });

    var _case = test.add(Case({
      element: this,
      expected: (function (element) {
        return quail.components.resolveExpectation(element);
      }(this))
    }));

    _case.set({status: (matches > 0) ? 'failed' : 'passed'});
  }

  test.get('$scope').each(function () {
    $(this).find(quail.textSelector).each(countDirAttributes);
  });
};

quail.languageDirectionPunctuation = function(quail, test, Case) {
  var $scope = test.get('$scope');
  var punctuation = {};
  var punctuationRegex = /[\u2000-\u206F]|[!"#$%&'\(\)\]\[\*+,\-.\/:;<=>?@^_`{|}~]/gi;
  var currentDirection = ($scope.attr('dir')) ? $scope.attr('dir').toLowerCase() : 'ltr';
  var oppositeDirection = (currentDirection === 'ltr') ? 'rtl' : 'ltr';
  var textDirection = quail.components.language.textDirection;
  $scope.each(function () {
    var $local = $(this);
    $local.find(quail.textSelector).each(function() {
      var $el = $(this);
      if ($el.attr('dir')) {
        currentDirection = $el.attr('dir').toLowerCase();
      }
      else {
        currentDirection = ($el.parent('[dir]').first().attr('dir')) ? $el.parent('[dir]').first().attr('dir').toLowerCase() : currentDirection;
      }
      if (typeof textDirection[currentDirection] === 'undefined') {
        currentDirection = 'ltr';
      }
      oppositeDirection = (currentDirection === 'ltr') ? 'rtl' : 'ltr';
      var text = quail.getTextContents($el);
      var matches = text.match(textDirection[oppositeDirection]);
      var _case = test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this))
      }));
      if (!matches) {
        _case.set({status : 'inapplicable'});
        return;
      }
      var first = text.search(textDirection[oppositeDirection]);
      var last = text.lastIndexOf(matches.pop());
      while (punctuation = punctuationRegex.exec(text)) {
        if(punctuation.index === first - 1 ||
          punctuation.index === last + 1) {
          _case.set({status: 'failed'});
          return;
        }
      }
      _case.set({status : 'passed'});
    });
  });
};

quail.languageUnicodeDirection = function(quail, test, Case) {
  var $scope = test.get('$scope');
  var textDirection = quail.components.language.textDirection;
  var textDirectionChanges = quail.components.language.textDirectionChanges;
  $scope.each(function () {
    var $local = $(this);
    $local.find(quail.textSelector).each(function() {
      var _case = test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this))
      }));
      var $el = $(this);
      var text = $el.text().trim();
      var otherDirection = (text.substr(0, 1).search(textDirection['ltr']) !== -1) ?
        'rtl' :
        'ltr';
      if (text.search(textDirection[otherDirection]) === -1) {
        _case.set({status: 'inapplicable'});
      }
      else {
        if(text.search(textDirectionChanges[otherDirection]) !== -1) {
          _case.set({status: 'passed'});
        }
        else {
          _case.set({status: 'failed'});
        }
      }
    });
  });
};

quail.linkHasAUniqueContext = function (quail, test, Case) {

  var blockStyle = [
    'block',
    'flex',
    'list-item',
    'table',
    'table-caption',
    'table-cell'
  ];

  function getLinkSentence (link) {
    // Find the closest block-like element
    var $link = $(link);
    var block = $link;
    var text = simplifyText($link.text());

    while(!block.is('body, html') && blockStyle.indexOf(block.css('display')) === -1) {
      block = block.parent();
    }

    var sentences = block.text().match(/[^\.!\?]+[\.!\?]+/g);
    if (sentences === null) {
      sentences = [block.text()];
    }

    for (var i = 0; i < sentences.length; i+= 1) {
      if (simplifyText(sentences[i]).indexOf(text) !== -1) {
        return sentences[i].trim();
      }
    }
  }

  function simplifyText (text) {
    var tmp = text.match(/\w+/g);
    if (tmp !== null) {
      text = tmp.join(' ');
    }
    return text.toLowerCase();
  }

  function txtNotAlike (a, b) {
    return simplifyText("" + a) !== simplifyText("" + b);
  }


  function shareContext (linkA, linkB) {

    if (linkA.href === linkB.href) {
      return false;

    } else if (txtNotAlike(linkA.title, linkB.title)) {
      return false;
    }

    // Find the nearest list item, paragraph or table cell of both items
    var linkACtxt = $(linkA).closest('p, li, dd, dt, td, th');
    var linkBCtxt = $(linkB).closest('p, li, dd, dt, td, th');

    // check if they are different
    if (linkACtxt.length !== 0 && linkBCtxt.length !== 0 &&
    txtNotAlike(getLinkText(linkACtxt), getLinkText(linkBCtxt))) {
      return false;
    }

    // If one is a table cell and the other isn't, allow it
    if (linkACtxt.is('td, th') && !linkBCtxt.is('td, th')) {
      return false;

    } else if (linkACtxt.is('td, th') && linkBCtxt.is('td, th')) {
      var headerDiff = false;
      var headersA = [];

      // Make a list with the simplified text of link A
      linkACtxt.tableHeaders().each(function () {
        headersA.push(simplifyText($(this).text()));
      });

      // Compare it to the header context of link B
      linkBCtxt.tableHeaders().each(function () {
        var text = simplifyText($(this).text());
        var pos = headersA.indexOf(text);
        // Link B has something not part of link A's context, pass
        if (pos === -1) {
          headerDiff = true;

        // Remove items part of both header lists
        } else {
          headersA.splice(pos, 1);
        }
      });
      // Pass if A or B had a header not part of the other.
      if (headerDiff || headersA.length > 0) {
        return false;
      }
    }

    if (txtNotAlike(getLinkSentence(linkA), getLinkSentence(linkB))) {
      return false;
    }

    return true;
  }


  /**
   * Get the text value of the link, including alt attributes
   * @param  {jQuery} $link
   * @return {string}
   */
  function getLinkText ($link) {
    var text = $link.text();
    $link.find('img[alt]').each(function () {
      text += ' ' + this.alt.trim();
    });
    return simplifyText(text);
  }

  test.get('$scope').each(function() {
    var $scope = $(this);
    var $links = $scope.find('a[href]:visible');
    var linkMap = {};


    if ($links.length === 0) {
      var _case = Case({
        element: this,
        status: 'inapplicable',
        expected: $scope.closest('.quail-test').data('expected')
      });
      test.add(_case);
    }

    // Make a map with the link text as key and an array of links with
    // that link text as it's value
    $links.each(function () {
      var text = getLinkText($(this));
      if (typeof linkMap[text] === 'undefined') {
        linkMap[text] = [];
      }
      linkMap[text].push(this);
    });


    // Iterate over each item in the linkMap
    $.each(linkMap, function (linkText, links) {

      // Link text is not unique, so the context should be checked
      while (links.length > 1) {
        var linkA = links.pop();
        var linkAFailed = false;

        for (var i=links.length - 1; i >= 0; i -= 1) {
          var linkB = links[i];
          if (shareContext(linkA, linkB)) {
            linkAFailed = true;
            links.splice(i, 1);
            test.add(Case({
              element: linkB,
              status: 'failed',
              expected: $(linkB).closest('.quail-test').data('expected')
            }));
          }
        }
        test.add(Case({
          element: linkA,
          status: (linkAFailed ? 'failed' : 'passed'),
          expected: $(linkA).closest('.quail-test').data('expected')
        }));
      }

      // The link text is unique, pass
      if (links.length === 1) {
        test.add(Case({
          element: links[0],
          status: 'passed',
          expected: $(links[0]).closest('.quail-test').data('expected')
        }));
      }
    });
  });
};

quail.listNotUsedForFormatting = function(quail, test, Case) {
  test.get('$scope').find('ol, ul').each(function() {
    var _case = Case({
      element : this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if ($(this).find('li').length < 2) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.listOfLinksUseList = function(quail, test, Case) {
  var unreadableText = /(♦|›|»|‣|▶|.|◦|>|✓|◽|•|—|◾|\||\*|&bull;|&#8226;)/g;
  test.get('$scope').find('a').each(function() {
    var _case = test.add(Case({
      element: this
    }));
    var expected = $(this).closest('.quail-test').data('expected');
    // Only test if there's another a tag.
    if ($(this).next('a').length) {
      var nextText = $(this).get(0).nextSibling.wholeText.replace(unreadableText, '');
      if (!$(this).parent('li').length && quail.isUnreadable(nextText)) {
        _case.set({
          'expected': expected,
          'status': 'failed'
        });
      }
      else {
        _case.set({
          'expected': expected,
          'status': 'passed'
        });
      }
    }
  });
};

quail.newWindowIsOpened = function(quail, test, Case) {

  var fenestrate = window.open;
  var _case;

  window.open = function (event) {
    test.each(function (index, _case) {
      var href = _case.get('element').href;
      if (href.indexOf(event) > -1) {
        _case.set('status', 'failed');
      }
    });
  };

  test.get('$scope').find('a').each(function () {
    // Save a reference to this clicked tag.
    _case = Case({
      element: this,
      expected: (function (element) {
        return quail.components.resolveExpectation(element);
      }(this))
    });
    test.add(_case);
    $(this).trigger('click');
  });

  window.open = fenestrate;
};

quail.pNotUsedAsHeader = function(quail, test, Case) {
  test.get('$scope').find('p').each(function() {
    var _case = Case({
      element : this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if ($(this).text().search('.') >= 1) {
      _case.set({
        'status': 'inapplicable'
      });
    }
    var failed = false;
    if ($(this).text().search('.') < 1) {
      var $paragraph = $(this),
        priorParagraph = $paragraph.prev('p');
      // Checking if any of suspectPHeaderTags has exact the same text as a paragraph.
      $.each(quail.suspectPHeaderTags, function(index, tag) {
        if ($paragraph.find(tag).length) {
          $paragraph.find(tag).each(function() {
            if ($(this).text().trim() === $paragraph.text().trim()) {
              _case.set({
                'status': 'failed'
              });
              failed = true;
            }
          });
        }
      });

      // Checking if previous paragraph has a different values for style properties given in quail.suspectPCSSStyles.
      if ( priorParagraph.length ) {
        $.each(quail.suspectPCSSStyles, function(index, cssProperty) {
          if ( $paragraph.css(cssProperty) !== priorParagraph.css(cssProperty) ) {
            _case.set({
              'status': 'failed'
            });
            failed = true;
            return false; // Micro optimization - we no longer need to iterate here. jQuery css() method might be expansive.
          }
        });
      }
      if ($paragraph.css('font-weight') === 'bold') {
        _case.set({
          'status': 'failed'
        });
        failed = true;
      }
    }
    if (!failed) {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.paragraphIsWrittenClearly = function (quail, test, Case) {
  test.get('$scope').find('p').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    var text = quail.components.textStatistics.cleanText($(this).text());
    if (Math.round((206.835 - (1.015 * quail.components.textStatistics.averageWordsPerSentence(text)) - (84.6 * quail.components.textStatistics.averageSyllablesPerWord(text)))) < 60) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.preShouldNotBeUsedForTabularLayout = function(quail, test, Case) {
  test.get('$scope').find('pre').each(function() {
    var _case = Case({
      element : this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    var rows = $(this).text().split(/[\n\r]+/);
    _case.set({
      'status': (rows.length > 1 && $(this).text().search(/\t/) > -1) ?
        'failed' :
        'passed'
    });
  });
};

quail.scriptFocusIndicatorVisible = function() {
  quail.html.find(quail.focusElements).each(function() {

    // Preparation for test: remove focus indicators done with CSS
    var sheet, rules, rulesCache, rule;

    rulesCache = [];

    for (var i = 0, l = document.styleSheets.length; i < l; ++i) {
      sheet = document.styleSheets[i];
      rules = sheet.cssRules || sheet.rules;

      for (var j = rules.length - 1; j >= 0; --j) {
        rule = rules[j];
        if (rule.selectorText && rule.selectorText.indexOf(':focus') !== -1) {
          rulesCache.push({
            css: rule.cssText,
            index: j,
            sheet: i
          });

          sheet.deleteRule(j);
        }
      }
    }

    var noFocus = {
      borderWidth : $(this).css('border-width'),
      borderColor : $(this).css('border-color'),
      backgroundColor : $(this).css('background-color'),
      boxShadow : $(this).css('box-shadow'),
      outlineWidth : $(this).css('outline-width'),
      outlineColor : $(this).css('outline-color')
    };

    $(this).focus();

    // it is sufficient to not remove the default outline on focus: pass test
    var outlineWidth = quail.components.convertToPx($(this).css('outline-width'));
    if (outlineWidth > 2 && outlineWidth !== quail.components.convertToPx(noFocus.outlineWidth)) {
      $(this).blur();
      return;
    }

    // in any other case, it is acceptable to change other visual components


    if (noFocus.backgroundColor !== $(this).css('background-color')) {
      $(this).blur();
      return;
    }

    var borderWidth = quail.components.convertToPx($(this).css('border-width'));
    if (borderWidth > 2 && borderWidth !== quail.components.convertToPx(noFocus.borderWidth)) {
      $(this).blur();
      return;
    }

    var boxShadow = ($(this).css('box-shadow') && $(this).css('box-shadow') !== 'none') ? $(this).css('box-shadow').match(/(-?\d+px)|(rgb\(.+\))/g) : false;
    if (boxShadow && $(this).css('box-shadow') !== noFocus.boxShadow && quail.components.convertToPx(boxShadow[3]) > 3) {
      $(this).blur();
      return;
    }

    $(this).blur();

    var ruleCache;

    for (var k = rulesCache.length - 1; k >= 0; --i) {
      ruleCache = rulesCache[k];

      document.styleSheets[ruleCache.sheet].insertRule(ruleCache.css, ruleCache.index);
    }

    quail.testFails('scriptFocusIndicatorVisible', $(this));
  });
};
quail.selectJumpMenu = function(quail, test, Case) {
  var $scope = test.get('$scope');
  if ($scope.find('select').length === 0) {
    return;
  }

  $scope.find('select').each(function() {
    if ($(this).parent('form').find(':submit').length === 0 &&
        quail.components.hasEventListener($(this), 'change')) {
      test.add(Case({
        element: this,
        expected: $(this).closest('.quail-test').data('expected'),
        status: 'failed'
      }));
    }
    else {
      test.add(Case({
        element: this,
        expected: $(this).closest('.quail-test').data('expected'),
        status: 'passed'
      }));
    }
  });
};

quail.siteMap = function(quail, test, Case) {
  var set = true;
  var _case = Case({
    element: test.get('$scope').get(0),
    expected: test.get('$scope').data('expected')
  });
  test.add(_case);
  test.get('$scope').find('a').each(function() {
    if (_case.get('status') === 'passed') {
      return;
    }
    var text = $(this).text().toLowerCase();
    $.each(quail.strings.siteMap, function(index, string) {
      if (text.search(string) > -1) {
        set = false;
        return;
      }
    });
    if (set === false) {
      _case.set({
        'status': 'failed'
      });
      return;
    }

    if (set) {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.skipToContentLinkProvided = function(quail, test, Case) {
  test.get('$scope').each(function () {
    var $local = $(this);
    var skipLinkFound = false;

    $local.find('a[href*="#"]').each(function() {
      if (skipLinkFound) {
        return;
      }
      var $link = $(this);

      var fragment = $link.attr('href').split('#').pop();
      var $target = $local.find('#' + fragment);
      var strs = quail.strings.skipContent.slice();
      while (!skipLinkFound && strs.length) {
        var str = strs.pop();
        if ($link.text().search(str) > -1 && $target.length) {
          $link.focus();
          if ($link.is(':visible') && $link.css('visibility') !== 'hidden') {
            skipLinkFound = true;
            test.add(Case({
              element: $link.get(0),
              expected: $link.closest('.quail-test').data('expected'),
              'status': 'passed'
            }));
            return;
          }
          $link.blur();
        }
      }
    });
    if (!skipLinkFound) {
      test.add(Case({
        expected: $local.data('expected') || $local.find('[data-expected]').data('expected'),
        'status': 'failed'
      }));
    }
  });
};

quail.tabIndexFollowsLogicalOrder = function (quail, test, Case) {
  test.get('$scope').each(function () {
    var $local = $(this);
    var index = 0;
    $local.find('[tabindex]').each(function() {
      var $el = $(this);
      var tabindex = $el.attr('tabindex');
      if (parseInt(tabindex, 10) >= 0 && parseInt(tabindex, 10) !== index + 1) {
        test.add(Case({
          element: this,
          expected: (function (element) {
            return quail.components.resolveExpectation(element);
          }(this)),
          status: 'failed'
        }));
      }
      else {
        test.add(Case({
          element: this,
          expected: (function (element) {
            return quail.components.resolveExpectation(element);
          }(this)),
          status: 'passed'
        }));
      }
      index++;
    });
  });
};

quail.tableAxisHasCorrespondingId = function (quail, test, Case) {
  test.get('$scope').find('[axis]').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if ($(this).parents('table').first().find('th#' + $(this).attr('axis')).length === 0) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.tableHeaderLabelMustBeTerse = function (quail, test, Case) {
  test.get('$scope').find('th, table tr:first td').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);
    if ($(this).text().length > 20 &&
       (!$(this).attr('abbr') || $(this).attr('abbr').length > 20)) {
      _case.set({
        'status': 'failed'
      });
    }
    else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.tableLayoutDataShouldNotHaveTh = function (quail, test, Case) {
  test.get('$scope').find('table').each(function() {
    var _case = Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);

    if ($(this).find('th').length !== 0) {
      if (!quail.isDataTable($(this))) {
        _case.set({
          'status': 'failed'
        });
      }
      else {
        _case.set({
          'status': 'passed'
        });
      }
    }
    else {
      _case.set({
        'status': 'inapplicable'
      });
    }
  });
};

quail.tableLayoutHasNoCaption = function (quail, test, Case) {
  test.get('$scope').find('table').each(function() {
    if ($(this).find('caption').length) {
      if (!quail.isDataTable($(this))) {
        test.add(Case({
          element: this,
          expected: (function (element) {
            return quail.components.resolveExpectation(element);
          }(this)),
          status: 'failed'
        }));
      }
      else {
        test.add(Case({
          element: this,
          expected: (function (element) {
            return quail.components.resolveExpectation(element);
          }(this)),
          status: 'passed'
        }));
      }
    }
    else {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        'status': 'inapplicable'
      }));
    }
  });
};

quail.tableLayoutHasNoSummary = function(quail, test, Case) {
  test.get('$scope').each(function () {
    var $local = $(this);
    $local.find('table[summary]').each(function() {
      var _case = test.add(Case({
        element: this,
        expected: $(this).closest('.quail-test').data('expected')
      }));
      if (!quail.isDataTable($(this)) && !quail.isUnreadable($(this).attr('summary'))) {
        _case.set({status: 'failed'});
      }
      else {
        _case.set({status: 'passed'});
      }
    });
  });
};

quail.tableLayoutMakesSenseLinearized = function(quail, test, Case) {
  test.get('$scope').find('table').each(function() {
    if (!quail.isDataTable($(this))) {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'failed'
      }));
    }
  });
};

quail.tableNotUsedForLayout = function(quail, test, Case) {
  test.get('$scope').find('table').each(function() {
    if (!quail.isDataTable($(this))) {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'failed'
      }));
    }
    else {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'passed'
      }));
    }
  });
};

quail.tableShouldUseHeaderIDs = function(quail, test, Case) {
  test.get('$scope').find('table').each(function() {
    var $table = $(this);
    var tableFailed = false;
    if (quail.isDataTable($table)) {
      $table.find('th').each(function() {
        if (!tableFailed && !$(this).attr('id')) {
          tableFailed = true;
          test.add(Case({
            element: this,
            expected: (function (element) {
              return quail.components.resolveExpectation(element);
            }(this)),
            status: 'failed'
          }));
        }
      });
      if (!tableFailed) {
        $table.find('td[header]').each(function() {
          if (!tableFailed) {
            $.each($(this).attr('header').split(' '), function(index, id) {
              if (!$table.find('#' + id).length) {
                tableFailed = true;
                test.add(Case({
                  element: this,
                  expected: (function (element) {
                    return quail.components.resolveExpectation(element);
                  }(this)),
                  status: 'failed'
                }));
              }
            });
          }
        });
      }
    }
  });
};

quail.tableSummaryDoesNotDuplicateCaption = function(quail, test, Case) {
  test.get('$scope').find('table[summary]:has(caption)').each(function() {
    if (quail.cleanString($(this).attr('summary')) === quail.cleanString($(this).find('caption:first').text())) {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'failed'
      }));
    }
    else {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'passed'
      }));
    }
  });
};

quail.tableSummaryIsNotTooLong = function(quail, test, Case) {
  test.get('$scope').find('table[summary]').each(function() {
    if ($(this).attr('summary').trim().length > 100) {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'failed'
      }));
    }
  });
};

quail.tableUseColGroup = function(quail, test, Case) {
  test.get('$scope').find('table').each(function() {
    if (quail.isDataTable($(this)) && !$(this).find('colgroup').length) {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'failed'
      }));
    }
  });
};

quail.tableUsesAbbreviationForHeader = function(quail, test, Case) {
  test.get('$scope').find('th:not(th[abbr])').each(function() {
    if ($(this).text().length > 20) {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'failed'
      }));
    }
  });
};

quail.tableUsesScopeForRow = function(quail, test, Case) {
  test.get('$scope').find('table').each(function() {
    $(this).find('td:first-child').each(function() {
      var $next = $(this).next('td');
      if (($(this).css('font-weight') === 'bold' && $next.css('font-weight') !== 'bold') ||
           ($(this).find('strong').length && !$next.find('strong').length)) {
        test.add(Case({
          element: this,
          expected: (function (element) {
            return quail.components.resolveExpectation(element);
          }(this)),
          status: 'failed'
        }));
      }
    });
    $(this).find('td:last-child').each(function() {
      var $prev = $(this).prev('td');
      if (($(this).css('font-weight') === 'bold' && $prev.css('font-weight') !== 'bold') ||
          ($(this).find('strong').length && !$prev.find('strong').length)) {
        test.add(Case({
          element: this,
          expected: (function (element) {
            return quail.components.resolveExpectation(element);
          }(this)),
          status: 'failed'
        }));
      }
    });
  });
};

quail.tableWithMoreHeadersUseID = function(quail, test, Case) {
  test.get('$scope').find('table:has(th)').each(function() {
    var $table = $(this);
    var rows = 0;
    $table.find('tr').each(function() {
      if ($(this).find('th').length) {
        rows++;
      }
      if (rows > 1 && !$(this).find('th[id]').length) {
        test.add(Case({
          element: this,
          expected: (function (element) {
            return quail.components.resolveExpectation(element);
          }(this)),
          status: 'failed'
        }));
      }
    });
  });
};

quail.tabularDataIsInTable = function(quail, test, Case) {
  test.get('$scope').find('pre').each(function() {
    if ($(this).html().search('\t') >= 0) {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'failed'
      }));
    }
    else {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'passed'
      }));
    }
  });
};

quail.tagsAreNestedCorrectly=function(quail, test, Case){

  quail.components.htmlSource.getHtml(function(html) {

    var validationResults = quail.components.htmlTagValidator(html);

    var _case = Case({
      // This is just for internal Quail testing. Get the first quail test element
      // and then its expected attribute value. This will return 'undefined' for
      // any other testing environment.
      expected: test.get('$scope').filter('.quail-test').eq(0).data('expected')
    });

    test.add(_case);

    // An error message is returned if a parsing error is found.
    if (validationResults) {
      _case.set({
        'status': 'failed',
        'html': validationResults
      });
    // Null is return if no parsing error is found; thus the test passes.
    } else {
      _case.set({
        'status': 'passed'
      });
    }
  });
};

quail.textIsNotSmall = function(quail, test, Case) {
  test.get('$scope').find(quail.textSelector).each(function() {
    var fontSize = $(this).css('font-size');
    if (fontSize.search('em') > 0) {
      fontSize = quail.components.convertToPx(fontSize);
    }
    fontSize = parseInt(fontSize.replace('px', ''), 10);

    if (fontSize < 10) {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'failed'
      }));
    }
    else {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'passed'
      }));
    }
  });
};

quail.userInputMayBeRequired=function(quail, test, Case){
  test.get('$scope').each(function(){

    var _case=Case({
      element: this,
      expected: $(this).closest('.quail-test').data('expected')
    });
    test.add(_case);

    var forms = $(this).find('form');
    var formInputs = 0;
    var inputsOutsideForm = $(this).find('input:not(form input, [type=button],[type=reset],[type=image],[type=submit],[type=hidden])');

    forms.each(function(){
      var inputs=$(this).find('input:not([type=button],[type=reset],[type=image],[type=submit],[type=hidden])');
      if (inputs.length > 1) {
        formInputs = inputs.length;
      }
    });

    if(formInputs > 0){
      _case.set({
        'status': 'cantTell'
      });
      return;
    }

    if(inputsOutsideForm.length > 1) {
      _case.set({
        'status': 'cantTell'
      });
      return;
    }

    _case.set({
      'status': 'inapplicable'
    });

  });
};

quail.videoMayBePresent=function(quail, test, Case){

  var videoExtensions = ['webm', 'flv', 'ogv', 'ogg', 'avi', 'mov', 'qt', 'wmv', 'asf',
  'mp4', 'm4p', 'm4v', 'mpg', 'mp2', 'mpeg', 'mpg', 'mpe', 'mpv', 'm2v', '3gp', '3g2'];
  var videoHosts = ['//www.youtube.com/embed/', '//player.vimeo.com/video/'];

  test.get('$scope').each(function(){
    var $this = $(this);
    var hasCase = false; // Test if a case has been created

    // video elm is definately a video, and objects could be too.
    $this.find('object, video').each(function () {
      hasCase = true;
      test.add(Case({
        element: this,
        expected: $(this).closest('.quail-test').data('expected'),
        status: 'cantTell'
      }));
    });

    // Links refering to files with an video extensions are probably video
    // though the file may not exist.
    $this.find('a[href]').each(function () {
      var $this = $(this);
      var extension = $this.attr('href').split('.').pop();
      if ($.inArray(extension, videoExtensions) !== -1) {
        hasCase = true;
        test.add(Case({
          element: this,
          expected: $this.closest('.quail-test').data('expected'),
          status: 'cantTell'
        }));
      }
    });

    // some iframes with URL's of known video providers are also probably videos
    $this.find('iframe').each(function () {
      if (this.src.indexOf(videoHosts[0]) !== -1 ||
      this.src.indexOf(videoHosts[1]) !== -1) {
        hasCase = true;
        test.add(Case({
          element: this,
          expected: $this.closest('.quail-test').data('expected'),
          status: 'cantTell'
        }));
      }
    });

    // if no case was added, return inapplicable
    if (!hasCase) {
      test.add(Case({
        element: this,
        status: 'inapplicable',
        expected: $(this).closest('.quail-test').data('expected')
      }));
    }

  });
};

quail.videosEmbeddedOrLinkedNeedCaptions = function (quail, test, Case) {

  quail.components.video.findVideos(test.get('$scope'), function(element, pass) {
    if (!pass) {
      test.add(Case({
        element: element[0],
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(element)),
        status: 'failed'
      }));
    }
    else {
      test.add(Case({
        element: element[0],
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(element)),
        status: 'passed'
      }));
    }
  });
};

quail.whiteSpaceInWord = function(quail, test, Case) {
  var whitespaceGroup, nonWhitespace;
  test.get('$scope').find(quail.textSelector).each(function() {
    nonWhitespace = ($(this).text()) ? $(this).text().match(/[^\s\\]/g) : false;
    whitespaceGroup = ($(this).text()) ? $(this).text().match(/[^\s\\]\s[^\s\\]/g) : false;
    if (nonWhitespace &&
        whitespaceGroup &&
        whitespaceGroup.length > 3 &&
        whitespaceGroup.length >= (nonWhitespace.length / 2) - 2) {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'failed'
      }));
    }
    else {
      test.add(Case({
        element: this,
        expected: (function (element) {
          return quail.components.resolveExpectation(element);
        }(this)),
        status: 'passed'
      }));
    }
  });
};


quail.whiteSpaceNotUsedForFormatting = function(quail, test, Case) {
  test.get('$scope').find(quail.textSelector).each(function() {
    var _case = test.add(Case({
      element: this,
      expected: (function (element) {
        return quail.components.resolveExpectation(element);
      }(this))
    }));
    if ($(this).find('br').length === 0) {
      _case.set({status: 'passed'});
      return;
    }
    var lines = $(this).html().toLowerCase().split(/(<br\ ?\/?>)+/);
    var lineCount = 0;
    $.each(lines, function(index, line) {
      if (line.search(/(\s|\&nbsp;){2,}/g) !== -1) {
        lineCount++;
      }
    });
    if(lineCount > 1) {
      _case.set({status: 'failed'});
    }
    else {
      _case.set({status: 'cantTell'});
    }
  });
};

quail.lib.Case = (function () {

  /**
   * A Case is a test against an element.
   */
  function Case (attributes) {
    return new Case.fn.init(attributes);
  }

  // Prototype object of the Case.
  Case.fn = Case.prototype = {
    constructor: Case,
    init: function (attributes) {
      this.listeners = {};
      this.timeout = null;
      this.attributes = attributes || {};

      var that = this;
      // Dispatch a resolve event if the case is initiated with a status.
      if (this.attributes.status && this.attributes.status !== 'untested') {
        // Delay the status dispatch to the next execution cycle so that the
        // Case will register listeners in this execution cycle first.
        setTimeout(function() {
          that.resolve();
        }, 0);
      }
      // Set up a time out for this case to resolve within.
      else {
        this.attributes.status = 'untested';
        this.timeout = setTimeout(function () {
          that.giveup();
        }, 350);
      }

      return this;
    },
    // Details of the Case.
    attributes: null,
    get: function (attr) {
      return this.attributes[attr];
    },
    set: function (attr, value) {
      var isStatusChanged = false;
      // Allow an object of attributes to be passed in.
      if (typeof attr === 'object') {
        for (var prop in attr) {
          if (attr.hasOwnProperty(prop)) {
            if (prop === 'status') {
              isStatusChanged = true;
            }
            this.attributes[prop] = attr[prop];
          }
        }
      }
      // Assign a single attribute value.
      else {
        if (attr === 'status') {
          isStatusChanged = true;
        }
        this.attributes[attr] = value;
      }

      if (isStatusChanged) {
        this.resolve();
      }
      return this;
    },
    /**
     * A test that determines if a case has one of a set of statuses.
     *
     * @return boolean
     *   A bit that indicates if the case has one of the supplied statuses.
     */
    hasStatus: function (statuses) {
      // This is a rought test of arrayness.
      if (typeof statuses !== 'object') {
        statuses = [statuses];
      }
      var status = this.get('status');
      for (var i = 0, il = statuses.length; i < il; ++i) {
        if (statuses[i] === status) {
          return true;
        }
      }
      return false;
    },
    /**
     * Dispatches the resolve event; clears the timeout fallback event.
     */
    resolve: function () {
      clearTimeout(this.timeout);

      var el = this.attributes.element;
      var outerEl;

      // Get a selector and HTML if an element is provided.
      if (el && el.nodeType && el.nodeType === 1) {
        // Allow a test to provide a selector. Programmatically find one if none
        // is provided.
        this.attributes.selector = this.defineUniqueSelector(el);

        // Get a serialized HTML representation of the element the raised the error
        // if the Test did not provide it.
        if (!this.attributes.html) {
          this.attributes.html = '';

          // If the element is either the <html> or <body> elements,
          // just report that. Otherwise we might be returning the entire page
          // as a string.
          if (el.nodeName === 'HTML' || el.nodeName === 'BODY') {
            this.attributes.html = '<' + el.nodeName + '>';
          }
          // Get the parent node in order to get the innerHTML for the selected
          // element. Trim wrapping whitespace, remove linebreaks and spaces.
          else if (typeof el.outerHTML === 'string') {
            outerEl = el.outerHTML.trim().replace(/(\r\n|\n|\r)/gm,"").replace(/>\s+</g, '><');
            // Guard against insanely long elements.
            // @todo, make this length configurable eventually.
            if (outerEl.length > 200) {
              outerEl = outerEl.substr(0, 200) + '... [truncated]';
            }
            this.attributes.html = outerEl;
          }
        }
      }

      this.dispatch('resolve', this);
    },
    /**
     * Abandons the Case if it not resolved within the timeout period.
     */
    giveup: function () {
      clearTimeout(this.timeout);
      // @todo, the set method should really have a 'silent' option.
      this.attributes.status = 'notTested';
      this.dispatch('timeout', this);
    },
    // @todo, make this a set of methods that all classes extend.
    listenTo: function (dispatcher, eventName, handler) {
      // @todo polyfill Function.prototype.bind.
      handler = handler.bind(this);
      dispatcher.registerListener.call(dispatcher, eventName, handler);
    },
    registerListener: function (eventName, handler) {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      this.listeners[eventName].push(handler);
    },
    dispatch: function (eventName) {
      if (this.listeners[eventName] && this.listeners[eventName].length) {
        var eventArgs = [].slice.call(arguments);
        this.listeners[eventName].forEach(function (handler) {
          // Pass any additional arguments from the event dispatcher to the
          // handler function.
          handler.apply(null, eventArgs);
        });
      }
    },

    /**
     * Creates a page-unique selector for the selected DOM element.
     *
     * @param {jQuery} element
     *   An element in a jQuery wrapper.
     *
     * @return {string}
     *   A unique selector for this element.
     */
    defineUniqueSelector: function (element) {
      /**
       * Indicates whether the selector string represents a unique DOM element.
       *
       * @param {string} selector
       *   A string selector that can be used to query a DOM element.
       *
       * @return Boolean
       *   Whether or not the selector string represents a unique DOM element.
       */
      function isUniquePath (selector) {
        return $(selector).length === 1;
      }

      /**
       * Creates a selector from the element's id attribute.
       *
       * Temporary IDs created by the module that contain "visitorActions" are excluded.
       *
       * @param {HTMLElement} element
       *
       * @return {string}
       *   An id selector or an empty string.
       */
      function applyID (element) {
        var selector = '';
        var id = element.id || '';
        if (id.length > 0) {
          selector = '#' + id;
        }
        return selector;
      }

      /**
       * Creates a selector from classes on the element.
       *
       * Classes with known functional components like the word 'active' are
       * excluded because these often denote state, not identity.
       *
       * @param {HTMLElement} element
       *
       * @return {string}
       *   A selector of classes or an empty string.
       */
      function applyClasses (element) {
        var selector = '';
        // Try to make a selector from the element's classes.
        var classes = element.className || '';
        if (classes.length > 0) {
          classes = classes.split(/\s+/);
          // Filter out classes that might represent state.
          classes = reject(classes, function (cl) {
            return (/active|enabled|disabled|first|last|only|collapsed|open|clearfix|processed/).test(cl);
          });
          if (classes.length > 0) {
            return '.' + classes.join('.');
          }
        }
        return selector;
      }

      /**
       * Finds attributes on the element and creates a selector from them.
       *
       * @param {HTMLElement} element
       *
       * @return {string}
       *   A selector of attributes or an empty string.
       */
      function applyAttributes (element) {
        var selector = '';
        var attributes = ['href', 'type'];
        var value;
        if (typeof element === 'undefined' ||
          typeof element.attributes === 'undefined' ||
          element.attributes === null) {
          return selector;
        }
        // Try to make a selector from the element's classes.
        for (var i = 0, len = attributes.length; i < len; i++) {
          value = element.attributes[attributes[i]] && element.attributes[attributes[i]].value;
          if (value) {
            selector += '[' + attributes[i] + '="' + value + '"]';
          }
        }
        return selector;
      }

      /**
       * Creates a unique selector using id, classes and attributes.
       *
       * It is possible that the selector will not be unique if there is no
       * unique description using only ids, classes and attributes of an
       * element that exist on the page already. If uniqueness cannot be
       * determined and is required, you will need to add a unique identifier
       * to the element through theming development.
       *
       * @param {HTMLElement} element
       *
       * @return {string}
       *   A unique selector for the element.
       */
      function generateSelector (element) {
        var selector = '';
        var scopeSelector = '';
        var pseudoUnique = false;
        var firstPass = true;

        do {
          scopeSelector = '';
          // Try to apply an ID.
          if ((scopeSelector = applyID(element)).length > 0) {
            selector = scopeSelector + ' ' + selector;
            // Assume that a selector with an ID in the string is unique.
            break;
          }

          // Try to apply classes.
          if (!pseudoUnique && (scopeSelector = applyClasses(element)).length > 0) {
            // If the classes don't create a unique path, tack them on and
            // continue.
            selector = scopeSelector + ' ' + selector;
            // If the classes do create a unique path, mark this selector as
            // pseudo unique. We will keep attempting to find an ID to really
            // guarantee uniqueness.
            if (isUniquePath(selector)) {
              pseudoUnique = true;
            }
          }

          // Process the original element.
          if (firstPass) {
            // Try to add attributes.
            if ((scopeSelector = applyAttributes(element)).length > 0) {
              // Do not include a space because the attributes qualify the
              // element. Append classes if they exist.
              selector = scopeSelector + selector;
            }

            // Add the element nodeName.
            selector = element.nodeName.toLowerCase() + selector;

            // The original element has been processed.
            firstPass = false;
          }

          // Try the parent element to apply some scope.
          element = element.parentNode;
        } while (element && element.nodeType === 1 && element.nodeName !== 'BODY' && element.nodeName !== 'HTML');

        return selector.trim();
      }

      /**
       * Helper function to filter items from a list that pass the comparator
       * test.
       *
       * @param {Array} list
       * @param {function} comparator
       *   A function that return a boolean. True means the list item will be
       *   discarded from the list.
       * @return array
       *   A list of items the excludes items that passed the comparator test.
       */
      function reject (list, comparator) {
        var keepers = [];
        for (var i = 0, il = list.length; i < il; i++) {
          if (!comparator.call(null, list[i])) {
            keepers.push(list[i]);
          }
        }
        return keepers;
      }

      return element && generateSelector(element);
    },
    push: [].push,
    sort: [].sort,
    concat: [].concat,
    splice: [].splice
  };

  // Give the init function the Case prototype.
  Case.fn.init.prototype = Case.fn;

  return Case;
}());

quail.lib.Section = (function () {

  /**
   * A Collection of Tests.
   */
  function Section (id, details) {
    return new Section.fn.init(id, details);
  }

  // Prototype object of the Section.
  Section.fn = Section.prototype = {
    constructor: Section,
    init: function (id, details) {
      if (!id) {
        return this;
      }
      this.id = id;
      // Create Technique instances for each technique in this section.
      if (details.techniques && details.techniques.length) {
        for (var i = 0, il = details.techniques.length; i < il; ++i) {
          this.push(quail.lib.Technique(details.techniques[i]));
        }
        return this;
      }
      return this;
    },
    // Setting a length property makes it behave like an array.
    length: 0,
    // Execute a callback for every element in the matched set.
    each: function (iterator) {
      var args = [].slice.call(arguments, 1);
      for (var i = 0, len = this.length; i < len; ++i) {
        args.unshift(this[i]);
        args.unshift(i);
        iterator.apply(this[i], args);
      }
      return this;
    },
    find: function (testname) {
      for (var i = 0, il = this.length; i < il; ++i) {
        if (this[i].get('name') === testname) {
          return this[i];
        }
      }
      // Return an empty Section for chaining.
      return null;
    },
    set: function (testname, details) {
      for (var i = 0, il = this.length; i < il; ++i) {
        if (this[i].get('name') === testname) {
          this[i].set(details);
          return this[i];
        }
      }
      var test = quail.lib.Test(testname, details);
      this.push(test);
      return test;
    },
    addTechnique: function (technique) {
      // Register for result events on the technique.
      //this.listenTo(technique, 'result', this.regiterTechniqueTestResult);
      this.push(technique);
    },
    regiterTechniqueTestResult: function () {

    },
    push: [].push,
    sort: [].sort,
    splice: [].splice
  };

  // Give the init function the Section prototype.
  Section.fn.init.prototype = Section.fn;

  return Section;
}());

quail.lib.SuccessCriteria = (function () {

  /**
   * A Collection of Tests.
   */
  function SuccessCriteria (tests) {
    return new SuccessCriteria.fn.init(tests);
  }

  // Prototype object of the SuccessCriteria.
  SuccessCriteria.fn = SuccessCriteria.prototype = {
    constructor: SuccessCriteria,
    init: function (options) {
      // Event listeners.
      this.listeners = {};

      // By default a Success Criteria is untested.
      this.attributes = this.attributes || {};
      this.attributes.status = 'untested';
      this.attributes.results = {};
      this.attributes.totals = {};

      // The evaluator is a callback that will be invoked when tests have
      // finished running.
      this.set(options || {});

      return this;
    },
    // Setting a length property makes it behave like an array.
    length: 0,
    // Details of the test.
    attributes: null,
    get: function (attr) {
      // Return the document wrapped in jQuery if scope is not defined.
      if (attr === '$scope') {
        var scope = this.attributes['scope'];
        var $scope = $(this.attributes['scope']);
        // @todo, pass in a ref to jQuery to this module.
        return (this.attributes[attr]) ? this.attributes[attr] : ((scope) ? $scope : $(document));
      }
      return this.attributes[attr];
    },
    set: function (attr, value) {
      var isStatusChanged = false;
      // Allow an object of attributes to be passed in.
      if (typeof attr === 'object') {
        for (var prop in attr) {
          if (attr.hasOwnProperty(prop)) {
            if (prop === 'status') {
              isStatusChanged = true;
            }
            this.attributes[prop] = attr[prop];
          }
        }
      }
      // Assign a single attribute value.
      else {
        this.attributes[attr] = value;
      }
      return this;
    },
    /**
     * Execute a callback for every element in the matched set.
     */
    each: function (iterator) {
      var args = [].slice.call(arguments, 1);
      for (var i = 0, len = this.length; i < len; ++i) {
        args.unshift(this[i]);
        args.unshift(i);
        var cont = iterator.apply(this[i], args);
        // Allow an iterator to break from the loop.
        if (cont === false) {
          break;
        }
      }
      return this;
    },
    /**
     * Add a Case to the Success Criteria instance, keyed by selector.
     */
    add: function (_case) {
      if (!this.find(_case.get('selector'))) {
        this.push(_case);
      }
    },
    /**
     * Finds a case by its selector.
     */
    find: function (selector) {
      for (var i = 0, il = this.length; i < il; ++i) {
        if (this[i].get('selector') === selector) {
          return this[i];
        }
      }
      return null;
    },
    /**
     * Adds a TestCollection to be listened to.
     *
     * There is a preEvaluator function run before tests are added to make sure
     * that the test is actually needed.
     */
    registerTests: function (testCollection) {
      var preEvaluator = this.get('preEvaluator');
      var hasPreEvaluator = typeof preEvaluator !== 'undefined';
      // true means we'll run all the tests as usual, false, we skip the whole thing.
      var passedPreEvaluation = true;
      if (hasPreEvaluator) {
        passedPreEvaluation = preEvaluator.call(this, testCollection);
      }
      if (!passedPreEvaluation) {
        this.set('status', 'inapplicable');
      }
      this.set('tests', testCollection);
      this.listenTo(testCollection, 'complete', this.evaluate);
    },
    /**
     * Returns a collection of tests for this success criteria.
     */
    filterTests: function (tests) {
      var criteriaTests = new quail.lib.TestCollection();
      var name = this.get('name');
      if (!name) {
        throw new Error('Success Criteria instances require a name in order to have tests filtered.');
      }
      var identifier = name.split(':')[1];
      tests.each(function (index, test) {
        var guidelineCoverage = test.getGuidelineCoverage('wcag');
        // Get tests for this success criteria.
        for (var criteriaID in guidelineCoverage) {
          if (guidelineCoverage.hasOwnProperty(criteriaID)) {
            if (criteriaID === identifier) {
              criteriaTests.add(test);
            }
          }
        }
      });
      return criteriaTests;
    },
    /**
     * Adds a Case conclusion to the Success Criteria.
     *
     * @param string conclusion
     * @param quail.lib.Case _case
     */
    addConclusion: function (conclusion, _case) {
      if (!this.get('results')[conclusion]) {
        this.get('results')[conclusion] = quail.lib.Test();
      }
      this.get('results')[conclusion].push(_case);
      // Incremement totals for this conclusion type.
      if (!this.get('totals')[conclusion]) {
        this.get('totals')[conclusion] = 0;
      }
      ++(this.get('totals')[conclusion]);
      // Incremement totals for the number of cases found.
      if (!this.get('totals')['cases']) {
        this.get('totals')['cases'] = 0;
      }
      ++(this.get('totals')['cases']);
    },
    /**
     * Runs the evaluator callbacks against the completed TestCollection.
     */
    evaluate: function (eventName, testCollection) {
      if (this.get('status') !== 'inapplicable') {
        var sc = this;
        var associatedTests = this.filterTests(testCollection);

        // If there are no associated tests, then this Success
        // Criteria has no coverage.
        if (associatedTests.length === 0) {
          this.set('status', 'noTestCoverage');
        }
        else {
          associatedTests.each(function (index, test) {
            test.each(function (index, _case) {
              sc.addConclusion(_case.get('status'), _case);
            });
          });
          if (size(this.get('results')) === 0) {
            this.set('status', 'noResults');
          }
          else {
            this.set('status', 'tested');
          }
        }
      }
      this.report();
    },
    /**
     * Dispatches the complete event.
     */
    report: function () {
      var args = Array.prototype.slice.call(arguments);
      args = [].concat(['successCriteriaEvaluated', this, this.get('tests')], args);
      this.dispatch.apply(this, args);
    },
    // @todo, make this a set of methods that all classes extend.
    listenTo: function (dispatcher, eventName, handler) {
      // @todo polyfill Function.prototype.bind.
      handler = handler.bind(this);
      dispatcher.registerListener.call(dispatcher, eventName, handler);
    },
    registerListener: function (eventName, handler) {
      // nb: 'this' is the dispatcher object, not the one that invoked listenTo.
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }

      this.listeners[eventName].push(handler);
    },
    dispatch: function (eventName) {
      if (this.listeners[eventName] && this.listeners[eventName].length) {
        var eventArgs = [].slice.call(arguments);
        this.listeners[eventName].forEach(function (handler) {
          // Pass any additional arguments from the event dispatcher to the
          // handler function.
          handler.apply(null, eventArgs);
        });
      }
    },
    push: [].push,
    sort: [].sort,
    splice: [].splice
  };

  /**
   * Determines the length of an object.
   *
   * @param object obj
   *   The object whose size will be determined.
   *
   * @return number
   *   The size of the object determined by the number of keys.
   */
  function size (obj) {
    return Object.keys(obj).length;
  }

  // Give the init function the SuccessCriteria prototype.
  SuccessCriteria.fn.init.prototype = SuccessCriteria.fn;

  return SuccessCriteria;
}());

quail.lib.Technique = (function () {

  /**
   * A collection of Cases.
   */
  function Technique (name, attributes) {
    return new Technique.fn.init(name, attributes);
  }

  // Prototype object of the Technique.
  Technique.fn = Technique.prototype = {
    constructor: Technique,
    init: function (name, attributes) {
      this.listeners = {};
      if (!name) {
        return this;
      }
      this.attributes = attributes || {};
      this.attributes.name = name;

      return this;
    },
    // Setting a length property makes it behave like an array.
    length: 0,
    // Details of the test.
    attributes: {},
    // Execute a callback for every element in the matched set.
    each: function (iterator) {
      var args = [].slice.call(arguments, 1);
      for (var i = 0, len = this.length; i < len; ++i) {
        args.unshift(this[i]);
        args.unshift(i);
        iterator.apply(this[i], args);
      }
      return this;
    },
    get: function (attr) {
      return this.attributes[attr];
    },
    set: function (attr, value) {
      // Allow an object of attributes to be passed in.
      if (typeof attr === 'object') {
        for (var prop in attr) {
          if (attr.hasOwnProperty(prop)) {
            this.attributes[prop] = attr[prop];
          }
        }
      }
      // Assign a single attribute value.
      else {
        this.attributes[attr] = value;
      }
      return this;
    },
    addTest: function () {

    },
    report: function (eventName, test) {
      window.console && window.console.log(this.get('name'), test.status, test, test[0] && test[0].status);
    },
    // @todo, make this a set of methods that all classes extend.
    listenTo: function (dispatcher, eventName, handler) {
      // @todo polyfill Function.prototype.bind.
      handler = handler.bind(this);
      dispatcher.registerListener.call(dispatcher, eventName, handler);
    },
    registerListener: function (eventName, handler) {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      this.listeners[eventName].push(handler);
    },
    dispatch: function (eventName) {
      if (this.listeners[eventName] && this.listeners[eventName].length) {
        var eventArgs = [].slice.call(arguments);
        this.listeners[eventName].forEach(function (handler) {
          // Pass any additional arguments from the event dispatcher to the
          // handler function.
          handler.apply(null, eventArgs);
        });
      }
    },
    push: [].push,
    sort: [].sort,
    splice: [].splice
  };

  // Give the init function the Technique prototype.
  Technique.fn.init.prototype = Technique.fn;

  return Technique;
}());

quail.lib.Test = (function () {

  /**
   * A collection of Cases.
   */
  function Test (name, attributes) {
    return new Test.fn.init(name, attributes);
  }

  // Prototype object of the Test.
  Test.fn = Test.prototype = {
    constructor: Test,
    init: function (name, attributes) {
      this.listeners = {};
      this.length = 0;
      if (!name) {
        return this;
      }
      this.attributes = attributes || {};
      this.attributes.name = name;
      this.attributes.status = 'untested';
      this.attributes.complete = false;

      return this;
    },
    // Setting a length property makes it behave like an array.
    length: 0,
    // Details of the test.
    attributes: null,
    // Execute a callback for every element in the matched set.
    each: function (iterator) {
      var args = [].slice.call(arguments, 1);
      for (var i = 0, len = this.length; i < len; ++i) {
        args.unshift(this[i]);
        args.unshift(i);
        iterator.apply(this[i], args);
      }
      return this;
    },
    get: function (attr) {
      // Return the document wrapped in jQuery if scope is not defined.
      if (attr === '$scope') {
        var scope = this.attributes['scope'];
        var $scope = $(this.attributes['scope']);
        // @todo, pass in a ref to jQuery to this module.
        return (this.attributes[attr]) ? this.attributes[attr] : ((scope) ? $scope : $(document));
      }
      return this.attributes[attr];
    },
    set: function (attr, value) {
      var isStatusChanged = false;
      // Allow an object of attributes to be passed in.
      if (typeof attr === 'object') {
        for (var prop in attr) {
          if (attr.hasOwnProperty(prop)) {
            if (prop === 'status') {
              isStatusChanged = true;
            }
            this.attributes[prop] = attr[prop];
          }
        }
      }
      // Assign a single attribute value.
      else {
        if (attr === 'status') {
          isStatusChanged = true;
        }
        this.attributes[attr] = value;
      }

      if (isStatusChanged) {
        this.resolve();
      }
      return this;
    },
    add: function (_case) {
      this.listenTo(_case, 'resolve', this.caseResponded);
      this.listenTo(_case, 'timeout', this.caseResponded);
      // If the case is already resolved because it has a status, then trigger
      // its resolve event.
      if (_case.status) {
        _case.dispatch('resolve', _case);
      }
      this.push(_case);
      return _case;
    },
    invoke: function () {
      // This test is already running.
      if (this.testComplete) {
        throw new Error('The test ' + this.get('name') + ' is already running.');
      }
      // This test has already been run.
      if (this.attributes.complete) {
        throw new Error('The test ' + this.get('name') + ' has already been run.');
      }

      var type = this.get('type');
      var options = this.get('options') || {};
      var callback = this.get('callback');
      var test = this;

      // Set the test complete method to the closure function that dispatches
      // the complete event. This method needs to be debounced so it is only
      // called after a pause of invocations.
      this.testComplete = debounce(testComplete.bind(this), 400);

      // Invoke the complete dispatcher to prevent the test from never
      // completing in the off chance that no Cases are created.
      this.testComplete(false);

      if (type === 'custom') {
        if (typeof callback === 'function') {
          try {
            callback.call(this, quail, test, quail.lib.Case, options);
          }
          catch (e) {
            if (window.console && window.console.error) {
              window.console.error(e);
            }
          }
        }
        else if (type === 'custom' && typeof quail[callback] === 'function') {
          try {
            quail[callback].call(this, quail, test, quail.lib.Case, options);
          }
          catch (e) {
            if (window.console && window.console.error) {
              window.console.error(e);
            }
          }
        }
        else {
          throw new Error('The callback ' + callback + ' cannot be invoked.');
        }
      }
      else if (typeof quail.components[type] === 'function') {
        try {
          quail.components[type].call(this, quail, test, quail.lib.Case, options);
        }
        catch (e) {
          if (window.console && window.console.error) {
            window.console.error(e);
          }
        }
      }
      else {
        throw new Error('The component type ' + type + ' is not defined.');
      }

      // Invoke the complete dispatcher to prevent the test from never
      // completing in the off chance that no Cases are created.
      this.testComplete();

      return this;
    },
    /**
     * Finds cases by their status.
     */
    findByStatus: function (statuses) {
      if (!statuses) {
        return;
      }
      var test = new Test();
      // A single status or an array of statuses is allowed. Always act on an
      // array.
      if (typeof statuses === 'string') {
        statuses = [statuses];
      }
      // Loop the through the statuses and find tests with them.
      for (var i = 0, il = statuses.length; i < il; ++i) {
        var status = statuses[i];
        // Loop through the cases.
        this.each(function (index, _case) {
          var caseStatus = _case.get('status');
          if (caseStatus === status) {
            test.add(_case);
          }
        });
      }
      return test;
    },
    /**
     * Returns a set of cases with corresponding to th supplied selector.
     */
    findCasesBySelector: function (selector) {
      var cases = this.groupCasesBySelector();
      if (cases.hasOwnProperty(selector)) {
        return cases[selector];
      }
      return new Test();
    },
    /**
     * Returns a single Case object the matches the supplied HTML.
     *
     * We make the assumption, rightly or wrongly, that if the HTML is the
     * same for a number of cases in a Test, then the outcome will also
     * be the same, so only use this method if you are probing the result
     * of the case, not other specifics of it.
     *
     * @param string html
     *   A string representing an HTML structure.
     *
     * @needstests
     */
    findCaseByHtml: function (html) {
      var _case;
      for (var i = 0, il = this.length; i < il; ++i) {
        _case = this[i];
        if (html === _case.get('html')) {
          return _case;
        }
      }
      // Always return a Case object.
      return quail.lib.Case();
    },
    /**
     * Groups the cases by element selector.
     *
     * @return object
     *  A hash of cases, keyed by the element selector.
     */
    groupCasesBySelector: function () {
      var casesBySelector = {};
      // Loop through the cases.
      this.each(function (index, _case) {
        var selector = _case.get('selector');
        if (!casesBySelector[selector]) {
          casesBySelector[selector] = new Test();
        }
        casesBySelector[selector].add(_case);
      });
      return casesBySelector;
    },
    /**
     * Groups the cases by serialized HTML string.
     *
     * @todo, the html string index needs to be hashed to a uniform length.
     *
     * @return object
     *  A hash of cases, keyed by the element selector.
     */
    groupCasesByHtml: function () {
      var casesByHtml = {};
      // Loop through the cases.
      this.each(function (index, _case) {
        var html = _case.get('html');
        if (!casesByHtml[html]) {
          casesByHtml[html] = new Test();
        }
        casesByHtml[html].add(_case);
      });
      return casesByHtml;
    },
    /**
     * @needsdoc
     */
    getGuidelineCoverage: function (name) {
      var config = this.get('guidelines');
      return config && config[name] || {};
    },
    /**
     * Adds the test that owns the Case to the set of arguments passed up to
     * listeners of this test's cases.
     */
    caseResponded: function (eventName, _case) {
      this.dispatch(eventName, this, _case);
      // Attempt to declare the Test complete.
      if (typeof this.testComplete === 'function') {
        this.testComplete();
      }
    },
    /**
     * Evaluates the test's cases and sets the test's status.
     */
    determineStatus: function () {
      // Invoke post filtering. This is a very special case for color.js.
      var type = this.get('type');
      var passed;
      if (quail.components[type] && typeof quail.components[type].postInvoke === 'function') {
        passed = quail.components[type].postInvoke.call(this, this);
      }
      // The post invocation function for the component declares that this test
      // passed.
      if (passed === true) {
        this.set({
          'status': 'passed'
        });
      }
      // CantTell.
      else if (this.findByStatus(['cantTell']).length === this.length) {
        this.set({
          'status': 'cantTell'
        });
      }
      // inapplicable.
      else if (this.findByStatus(['inapplicable']).length === this.length) {
        this.set({
          'status': 'inapplicable'
        });
      }
      // Failed.
      else if (this.findByStatus(['failed', 'untested']).length) {
        this.set({
          'status': 'failed'
        });
      }
      else {
        this.set({
          'status': 'passed'
        });
      }
    },
    resolve: function () {
      this.dispatch('complete', this);
    },
    /**
     * A stub method implementation.
     *
     * It is assigned a function value when the Test is invoked. See the
     * testComplete function in outer scope.
     */
    testComplete: null,
    // @todo, make this a set of methods that all classes extend.
    listenTo: function (dispatcher, eventName, handler) {
      // @todo polyfill Function.prototype.bind.
      handler = handler.bind(this);
      dispatcher.registerListener.call(dispatcher, eventName, handler);
    },
    registerListener: function (eventName, handler) {
      // nb: 'this' is the dispatcher object, not the one that invoked listenTo.
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }

      this.listeners[eventName].push(handler);
    },
    dispatch: function (eventName) {
      if (this.listeners[eventName] && this.listeners[eventName].length) {
        var eventArgs = [].slice.call(arguments);
        this.listeners[eventName].forEach(function (handler) {
          // Pass any additional arguments from the event dispatcher to the
          // handler function.
          handler.apply(null, eventArgs);
        });
      }
    },
    push: [].push,
    sort: [].sort,
    concat: [].concat,
    splice: [].splice
  };

  /**
   * Dispatches the complete event.
   *
   * This function is meant to be bound to a Test as a method through
   * a debounced proxy function.
   */
  function testComplete (complete) {
    complete = (typeof complete === 'undefined') ? true : complete;
    // @todo, this iteration would be faster with _.findWhere, that breaks on
    // the first match.
    this.each(function (index, _case) {
      if (!_case.get('status')) {
        complete = false;
      }
    });
    // If all the Cases have been evaluated, dispatch the event.
    if (complete) {
      this.testComplete = null;
      // @todo, this should be set with the set method and a silent flag.
      this.attributes.complete = true;
      this.determineStatus();
    }
    // Otherwise attempt to the complete the Test again after the debounce
    // period has expired.
    else {
      this.testComplete();
    }
  }

  /**
   * Limits the invocations of a function in a given time frame.
   *
   * Adapted from underscore.js. Replace with debounce from underscore once class
   * loading with modules is in place.
   *
   * @param {Function} callback
   *   The function to be invoked.
   *
   * @param {Number} wait
   *   The time period within which the callback function should only be
   *   invoked once. For example if the wait period is 250ms, then the callback
   *   will only be called at most 4 times per second.
   */
  function debounce (func, wait, immediate) {

    "use strict";

    var timeout, result;
    return function () {
      var context = this;
      var args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
      }
      return result;
    };
  }

  // Give the init function the Test prototype.
  Test.fn.init.prototype = Test.fn;

  return Test;
}());

quail.lib.TestCollection = (function () {

  /**
   * A Collection of Tests.
   */
  function TestCollection (tests) {
    return new TestCollection.fn.init(tests);
  }

  // Prototype object of the TestCollection.
  TestCollection.fn = TestCollection.prototype = {
    constructor: TestCollection,
    init: function (tests, options) {
      this.listeners = {};
      options = options || {};
      if (!tests) {
        return this;
      }
      if (typeof tests === 'object') {
        var test;
        for (var name in tests) {
          if (tests.hasOwnProperty(name)) {
            tests[name].scope = tests[name].scope || options.scope;
            test = new quail.lib.Test(name, tests[name]);
            this.listenTo(test, 'results', this.report);
            this.push(test);
          }
        }
        return this;
      }
      return this;
    },
    // Setting a length property makes it behave like an array.
    length: 0,
    // Invoke all the tests in a set.
    run: function (callbacks) {
      var tc = this;
      callbacks = callbacks || {};
      this.each(function (index, test) {
        // Allow a prefilter to remove a case.
        if (callbacks.preFilter) {
          tc.listenTo(test, 'resolve', function (eventName, test, _case) {
            var result = callbacks.preFilter(eventName, test, _case);
            if (result === false) {
              // Manipulate the attributes directly so that change events
              // are not triggered.
              _case.attributes.status = 'notTested';
              _case.attributes.expected = null;
            }
          });
        }
        // Allow the invoker to listen to resolve events on each Case.
        if (callbacks.caseResolve) {
          tc.listenTo(test, 'resolve', callbacks.caseResolve);
        }
        // Allow the invoker to listen to complete events on each Test.
        if (callbacks.testComplete) {
          tc.listenTo(test, 'complete', callbacks.testComplete);
        }
      });

      // Allow the invoker to listen to complete events for the
      // TestCollection.
      if (callbacks.testCollectionComplete) {
        tc.listenTo(tc, 'complete', callbacks.testCollectionComplete);
      }

      // Set the test complete method to the closure function that dispatches
      // the complete event. This method needs to be debounced so it is
      // only called after a pause of invocations.
      this.testsComplete = debounce(testsComplete.bind(this), 500);

      // Invoke each test.
      this.each(function(index, test) {
        test.invoke();
      });

      // Invoke the complete dispatcher to prevent the collection from never
      // completing in the off chance that no Tests are run.
      this.testsComplete();

      return this;
    },
    /**
     * Execute a callback for every element in the matched set.
     */
    each: function (iterator) {
      var args = [].slice.call(arguments, 1);
      for (var i = 0, len = this.length; i < len; ++i) {
        args.unshift(this[i]);
        args.unshift(i);
        var cont = iterator.apply(this[i], args);
        // Allow an iterator to break from the loop.
        if (cont === false) {
          break;
        }
      }
      return this;
    },
    /**
     * Add a Test object to the set.
     */
    add: function (test) {
      // Don't add a test that already exists in this set.
      if (!this.find(test.get('name'))) {
        this.push(test);
      }
    },
    /**
     * Finds a test by its name.
     */
    find: function (testname) {
      for (var i = 0, il = this.length; i < il; ++i) {
        if (this[i].get('name') === testname) {
          return this[i];
        }
      }
      return null;
    },
    /**
     * @info, this should be a static method.
     */
    findByGuideline: function (guidelineName) {

      var methods = {
        'wcag': function (section, technique) {

          function findAllTestsForTechnique (guidelineName, sectionId, techniqueName) {
            // Return a TestCollection instance.
            var tests = new TestCollection();
            this.each(function (index, test) {
              // Get the configured guidelines for the test.
              var guidelines = test.get('guidelines');
              // If this test is configured for this section and it has
              // associated techniques, then loop thorugh them.
              var testTechniques = guidelines[guidelineName] && guidelines[guidelineName][sectionId] && guidelines[guidelineName][sectionId]['techniques'];
              if (testTechniques) {
                for (var i = 0, il = testTechniques.length; i < il; ++i) {
                  // If this test is configured for the techniqueName, add it
                  // to the list of tests.
                  if (testTechniques[i] === techniqueName) {
                    tests.listenTo(test, 'results', tests.report);
                    tests.add(test);
                  }
                }
              }
            });
            return tests;
          }
          var sectionId = section.id;
          var techniqueName = technique.get('name');
          if (sectionId && techniqueName) {
            return findAllTestsForTechnique.call(this, guidelineName, sectionId, techniqueName);
          }
        }
      };
      // Process the request using a specific guideline finding method.
      // @todo, make these pluggable eventually.
      if (methods[guidelineName]) {
        var args = [].slice.call(arguments, 1);
        return methods[guidelineName].apply(this, args);
      }
    },
    /**
     * Finds tests by their status.
     */
    findByStatus: function (statuses) {
      if (!statuses) {
        return;
      }
      var tests = new TestCollection();
      // A single status or an array of statuses is allowed. Always act on an
      // array.
      if (typeof statuses === 'string') {
        statuses = [statuses];
      }
      // Loop the through the statuses and find tests with them.
      for (var i = 0, il = statuses.length; i < il; ++i) {
        var status = statuses[i];
        // Loop through the tests.
        this.each(function (index, test) {
          var testStatus = test.get('status');
          if (testStatus === status) {
            tests.add(test);
          }
        });
      }
      return tests;
    },
    /**
     * Create a new test from a name and details.
     */
    set: function (testname, details) {
      for (var i = 0, il = this.length; i < il; ++i) {
        if (this[i].get('name') === testname) {
          this[i].set(details);
          return this[i];
        }
      }
      var test = quail.lib.Test(testname, details);
      this.push(test);
      return test;
    },
    /**
     * A stub method implementation.
     *
     * It is assigned a function value when the collection is run. See the
     * testsComplete function in outer scope.
     */
    testsComplete: null,
    report: function () {
      this.dispatch.apply(this, arguments);
    },
    // @todo, make this a set of methods that all classes extend.
    listenTo: function (dispatcher, eventName, handler) {
      // @todo polyfill Function.prototype.bind.
      handler = handler.bind(this);
      dispatcher.registerListener.call(dispatcher, eventName, handler);
    },
    registerListener: function (eventName, handler) {
      // nb: 'this' is the dispatcher object, not the one that invoked listenTo.
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }

      this.listeners[eventName].push(handler);
    },
    dispatch: function (eventName) {
      if (this.listeners[eventName] && this.listeners[eventName].length) {
        var eventArgs = [].slice.call(arguments);
        this.listeners[eventName].forEach(function (handler) {
          // Pass any additional arguments from the event dispatcher to the
          // handler function.
          handler.apply(null, eventArgs);
        });
      }
    },
    push: [].push,
    sort: [].sort,
    splice: [].splice
  };

    /**
   * Dispatches the complete event.
   *
   * This function is meant to be bound to a Test as a method through
   * a debounced proxy function.
   */
  function testsComplete () {
    var complete = true;
    // @todo, this iteration would be faster with _.findWhere, that breaks on
    // the first match.
    this.each(function (index, test) {
      if (!test.get('complete')) {
        complete = false;
      }
    });
    // If all the Tests have completed, dispatch the event.
    if (complete) {
      this.testsComplete = null;
      this.dispatch('complete', this);
    }
    // Otherwise attempt to the complete the Tests again after the debounce
    // period has expired.
    else {
      this.testsComplete();
    }
  }

  /**
   * Limits the invocations of a function in a given time frame.
   *
   * Adapted from underscore.js. Replace with debounce from underscore once class
   * loading with modules is in place.
   *
   * @param {Function} callback
   *   The function to be invoked.
   *
   * @param {Number} wait
   *   The time period within which the callback function should only be
   *   invoked once. For example if the wait period is 250ms, then the callback
   *   will only be called at most 4 times per second.
   */
  function debounce (func, wait, immediate) {

    "use strict";

    var timeout, result;
    return function () {
      var context = this;
      var args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
      }
      return result;
    };
  }

  // Give the init function the TestCollection prototype.
  TestCollection.fn.init.prototype = TestCollection.fn;

  return TestCollection;
}());

// Iterates over Techniques.

quail.lib.WCAGGuideline = (function () {

  /**
   * A Collection of Tests.
   */
  var WCAGGuideline = function (tests) {
    return new WCAGGuideline.fn.init(tests);
  };

  // Prototype object of the WCAGGuideline.
  WCAGGuideline.fn = WCAGGuideline.prototype = {
    constructor: WCAGGuideline,
    init: function (config) {
      if (!config) {
        return this;
      }
      this.techniques = [];
      var guidelines, section, techniques, techniqueName, technique;

      if (typeof config === 'object') {
        if (config.guidelines) {
          guidelines = config.guidelines;
          for (var sectionNumber in guidelines) {
            if (guidelines.hasOwnProperty(sectionNumber)) {
              section = guidelines[sectionNumber];
              // Create a section object. Exclude techniques. These will be
              // instantiated as object later.
              if (section.techniques && section.techniques.length) {
                techniques = section.techniques;
                delete section.techniques;
              }
              // Instantiate a Section object.
              section = quail.lib.Section(sectionNumber, section);
              // Find all the techniques in the sections.
              if (techniques.length) {
                for (var i = 0, il = techniques.length; i < il; ++i) {
                  techniqueName = techniques[i];
                  // The technique requires a definition (description) within
                  // the guideline.
                  if (!config.techniques[techniqueName]) {
                    throw new Error('Definition for Technique ' + techniqueName + ' is missing from the guideline specification');
                  }
                  // Create a new technique instance if this one does not exist
                  // yet.
                  technique = this.findTechnique(techniqueName);
                  if (!technique) {
                    technique = quail.lib.Technique(techniqueName, config.techniques[techniqueName]);
                    this.techniques.push(technique);
                  }
                  // Add the technique to the currently processing section.
                  section.addTechnique(technique);
                }
              }
              this.push(section);
            }
          }
        }
        return this;
      }
      return this;
    },
    // Setting a length property makes it behave like an array.
    length: 0,
    // Execute a callback for every element in the matched set.
    each: function (iterator) {
      var args = [].slice.call(arguments, 1);
      for (var i = 0, len = this.length; i < len; ++i) {
        args.unshift(this[i]);
        args.unshift(i);
        iterator.apply(this[i], args);
      }
      return this;
    },
    find: function (testname) {
      for (var i = 0, il = this.length; i < il; ++i) {
        if (this[i].get('name') === testname) {
          return this[i];
        }
      }
      return null;
    },
    findTechnique : function (techniqueName) {
      for (var i = 0, il = this.techniques.length; i < il; ++i) {
        if (this.techniques[i].get('name') === techniqueName) {
          return this.techniques[i];
        }
      }
      return null;
    },
    set: function (testname, details) {
      for (var i = 0, il = this.length; i < il; ++i) {
        if (this[i].get('name') === testname) {
          this[i].set(details);
          return this[i];
        }
      }
      var test = quail.lib.Test(testname, details);
      this.push(test);
      return test;
    },
    evaluate: function () {
      /* loop through all the techniques and evaluate them against the page. */
    },
    results: function () {
      /* return evaluation results */
      /* Filter by SC? */
    },
    push: [].push,
    sort: [].sort,
    splice: [].splice
  };

  // Give the init function the WCAGGuideline prototype.
  WCAGGuideline.fn.init.prototype = WCAGGuideline.fn;

  return WCAGGuideline;
}());

(function ($) {
  var scopeValues = ['row', 'col', 'rowgroup', 'colgroup'];

  $.fn.getTableMap = function () {
    var map = [];
    this.find('tr').each(function (y) {
      if (typeof map[y] === 'undefined') {
        map[y] = [];
      }
      var row = map[y];
      $(this).children().each(function () {
        var x;
        var i, il;
        var cell = $(this);

        // Grab the width and height, undefined, invalid or 0 become 1
        var height = +cell.attr('rowspan') || 1;
        var width = +cell.attr('colspan') || 1;
        // Make x the first undefined cell in the row
        for (i = 0, il = row.length; i <= il; i += 1) {
          if (x === undefined && row[i] === undefined) {
            x = i;
          }
        }
        // add 'this' to each coordinate in the map based on width and height
        for (i = 0, il = width * height; i < il; i += 1) {
          // Create a new row if it doesn't exist yet
          if (map[y + ~~(i/width)] === undefined) {
            map[y + ~~(i/width)] = [];
          }
          // Add the cell to the correct x / y coordinates
          map[y + ~~(i/width)][x + (i % width)] = this;
        }
      });

    });
    return map;
  };

  function isColumnHeader(tableMap, cell, x, y) {
    var height = cell.attr('rowspan') || 1;
    var scope = cell.attr('scope');
    if (scope === 'col') {
      return true;
    } else if (scopeValues.indexOf(scope) !== -1) {
      return false;
    }

    for (var i = 0; i < height * tableMap[y].length -1; i+=1) {
      var currCell = $(tableMap[y + i % height][~~(i / height)]);
      if (currCell.is('td')) {
        return false;
      }
    }
    return true;
  }

  function isRowHeader(tableMap, cell, x, y) {
    var width = cell.attr('colspan') || 1;
    var scope = cell.attr('scope');

    if (scope === 'row') {
      return true;
    } else if (scopeValues.indexOf(scope) !== -1 ||
    isColumnHeader(tableMap, cell, x, y)) {
      return false;
    }

    for (var i = 0; i < width * tableMap.length -1; i+=1) {
      var currCell = $(tableMap[~~(i / width)][x + i % width]);
      if (currCell.is('td')) {
        return false;
      }
    }
    return true;
  }

  function scanHeaders(tableMap, x, y, deltaX, deltaY) {
    var headerList = $();
    var cell = $(tableMap[y][x]);
    var opaqueHeaders = [];
    var inHeaderBlock;
    var headersFromCurrBlock;

    if (cell.is('th')) {
      headersFromCurrBlock = [{
        cell: cell,
        x: x,
        y: y
      }];

      inHeaderBlock = true;
    } else {
      inHeaderBlock = false;
      headersFromCurrBlock = [];
    }

    for (; x >= 0 && y >= 0; x += deltaX, y += deltaY) {
      var currCell = $(tableMap[y][x]);
      var dir = (deltaX === 0 ? 'col' : 'row');

      if (currCell.is('th')) {
        inHeaderBlock = true;
        headersFromCurrBlock.push({
          cell: currCell,
          x: x,
          y: y
        });
        var blocked = false;
        if (deltaY === -1 && isRowHeader(tableMap, currCell, x, y) ||
        deltaX === -1 && isColumnHeader(tableMap, currCell, x, y)) {
          blocked = true;

        } else {
          $.each(opaqueHeaders, function (i, opaqueHeader) {
            var currSize = +currCell.attr(dir + 'span') || 1;
            var opaqueSize = +$(opaqueHeader.cell).attr(dir + 'span') || 1;
            if (currSize === opaqueSize) {
              if (deltaY === -1 && opaqueHeader.x === x ||
                  deltaX === -1 && opaqueHeader.y === y)  {
                blocked = true;
              }
            }
          });
        }
        if (blocked === false) {
          headerList = headerList.add(currCell);
        }

      } else if (currCell.is('td') && inHeaderBlock === true) {
        inHeaderBlock = false;
        opaqueHeaders.push(headersFromCurrBlock);
        headersFromCurrBlock = $();
      }
    }
    return headerList;
  }

  /**
   * Get header cells based on the headers attribute of a cell
   */
  function getHeadersFromAttr(cell) {
    var table = cell.closest('table');
    var ids = cell.attr('headers').split(/\s/);
    var headerCells = $();
    // For each IDREF select an element with that ID from the table
    // Only th/td cells in the same table can be headers
    $.each(ids, function (i, id) {
      headerCells = headerCells.add($('th#' + id + ', td#' + id, table));
    });
    return headerCells;
  }

  function findCellInTableMap(tableMap, cell) {
    var i = 0;
    var y = 0;
    var x;
    // Locate the x and y coordinates of the current cell
    while (x === undefined) {
      if (tableMap[y] === undefined) {
        return;
      } else if (tableMap[y][i] === cell[0]) {
        x = i;

      } else if (i + 1 === tableMap[y].length) {
        y += 1;
        i = 0;
      } else {
        i += 1;
      }
    }
    return {x: x, y: y};
  }


  function getHeadersFromScope(cell, tableMap) {
    var i;
    var headerCells = $();
    var coords = findCellInTableMap(tableMap, cell);

    // Grab the width and height, undefined, invalid or 0 become 1
    var height = +cell.attr('rowspan') || 1;
    var width = +cell.attr('colspan') || 1;

    for (i = 0; i < width; i++) {
      headerCells = headerCells.add(
        scanHeaders(tableMap, coords.x + i, coords.y, 0, -1)
      );
    }

    for (i = 0; i < height; i++) {
      headerCells = headerCells.add(
        scanHeaders(tableMap, coords.x, coords.y + i, -1, 0)
      );
    }
    return headerCells;
  }


  function getHeadersFromGroups(cell, tableMap) {
    var cellCoords = findCellInTableMap(tableMap, cell);
    var headers = $();

    cell.closest('thead, tbody, tfoot')
    .find('th[scope=rowgroup]').each(function () {
      var headerCoords = findCellInTableMap(tableMap, $(this));
      if (headerCoords.x <= cellCoords.x && headerCoords.y <= cellCoords.y) {
        headers = headers.add(this);
      }
    });

    // TODO colgroups

  }

  $.fn.tableHeaders = function () {
    var headers = $();
    this.each(function () {
      var $this = $(this);

      if ($this.is(':not(td, th)')) {
        return;
      }

      if ($this.is('[headers]')) {
        headers = headers.add(getHeadersFromAttr($this));

      } else {
        var map = $this.closest('table').getTableMap();
        headers = headers
        .add(getHeadersFromScope($this, map))
        .add(getHeadersFromGroups($this, map));

      }
    });
    return headers.not(':empty').not(this);
  };


}(jQuery));

quail.lib.wcag2 = (function () {
  'use strict';
  var ajaxOpt = {async: false, dataType: 'json'};

  /**
   * Run Quail using WCAG 2
   *
   * Options can be used either to tell Quail where to load the wcag2 structure file
   * or to give it directly (if it's already loaded). For the first, jsonPath
   * must be provided. For the second the wcag2.json data must be given to
   * options.wcag2Structure and the tests data to options.accessibilityTests.
   *
   * @param  {[object]} options Quail options
   */
  function runWCAG20Quail(options) {
    if (options.wcag2Structure && options.accessibilityTests && options.preconditionTests) {
      startWCAG20Quail(
          options,
          options.wcag2Structure,
          options.accessibilityTests,
          options.preconditionTests);

    } else {
      // Load the required json files
      $.when(
        $.ajax(options.jsonPath + '/wcag2.json', ajaxOpt),
        $.ajax(options.jsonPath + '/tests.json', ajaxOpt),
        $.ajax(options.jsonPath + '/preconditions.json', ajaxOpt))

      // Setup quail given the tests described in the json files
      .done(function (wcag2Call, testsCall, preconditionCall) {
        startWCAG20Quail(options, wcag2Call[0], testsCall[0], preconditionCall[0]);
      });

    }
  }

  function startWCAG20Quail(options, wcag2Call, tests, preconditionTests) {
    var criteria, accessibilityTests, knownTests;
    var allTests = [];

    criteria = $.map(wcag2Call, function (critData) {
      return new quail.lib.wcag2.Criterion(
        critData, tests, preconditionTests, options.subject);
    });

    // Create the accessibiliyTests object, based on the
    // tests in the criteria
    $.each(criteria, function (i, criterion) {
      allTests.push.apply(allTests, criterion.getTests());
    });

    knownTests = [];
    accessibilityTests = [];

    // Remove duplicates
    // TODO: Figure out why some tests are created multiple times
    $.each(allTests, function (i, test) {
      if (knownTests.indexOf(test.title.en) === -1) {
        knownTests.push(test.title.en);
        accessibilityTests.push(test);
      }
    });

    // Run quail with the tests instead of the guideline
    $(quail.html).quail({
      accessibilityTests: accessibilityTests,
      // Have wcag2 intercept the callback
      testCollectionComplete: createCallback(
          criteria, options.testCollectionComplete)
    });
  }


  function createCallback(criteria, callback) {
    return function (status, data) {
      if (status === 'complete') {
        data = $.map(criteria, function (criterion) {
          return criterion.getResult(data);
        });
      }

      callback(status, data);
    };
  }

  return {
    run: runWCAG20Quail
  };

}());
quail.guidelines.wcag.successCriteria['1.1.1'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.1.1',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {
    'F3': 'Using CSS to include images that convey important information',
    'F13': 'Having a text alternative that does not include information that is conveyed by color differences in the image',
    'F20': 'Not updating text alternatives when changes to non-text content occur',
    'F30': 'Using text alternatives that are not alternatives (e.g., filenames or placeholder text)',
    'F38': 'Not marking up decorative images in HTML in a way that allows assistive technology to ignore them',
    'F39': 'Providing a text alternative that is not null (e.g., alt="spacer" or alt="image") for images that should be ignored by assistive technology',
    'F65': 'Omitting the alt attribute or text alternative on img elements, area elements, and input elements of type "image"',
    'F67': 'Providing long descriptions for non-text content that does not serve the same purpose or does not present the same information',
    'F71': 'Using text look-alikes to represent text without providing a text alternative',
    'F72': 'Using ASCII art without providing a text alternative'
  };

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.2.1'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.2.1',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.2.2'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.2.2',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'G93': 'Providing open (always visible) captions',
    // OR
    'G87': 'Providing closed captions'
  };

  // Failures
  sc.failures = {
    'F74': 'Not labeling a synchronized media alternative to text as an alternative',
    // OR
    'F75': 'Providing synchronized media without captions when the synchronized media presents more information than is presented on the page',
    // OR
    'F8': 'Captions omitting some dialogue or important sound effects'
  };

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.2.3'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.2.3',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.2.4'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.2.4',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'G9': 'Creating captions for live synchronized media',
    // AND
    'G93': 'Providing open (always visible) captions',
    'G87': 'Providing closed captions using any readily available media format that has a video player that supports closed captioning'
  };

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.2.5'] = (function (quail) {

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.2.5',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'G78': 'Providing a second, user-selectable, audio track that includes audio descriptions',
    // OR
    'G173': 'Providing a version of a movie with audio descriptions',
    // OR
    'SC1.2.8': 'Providing a movie with extended audio descriptions',
    'G8': 'Providing a movie with extended audio descriptions',
    // OR if a talking head video
    'G203': 'Using a static text alternative to describe a talking head video'
  };

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.2.7'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.2.7',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.2.8'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.2.8',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.2.9'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.2.9',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.3.1'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.3.1',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    // Situation A: The technology provides semantic structure to make information and relationships conveyed through presentation programmatically determinable
    'G115': 'Using semantic elements to mark up structure AND H49: Using semantic markup to mark emphasized or special text',
    // OR
    'G117': 'Using text to convey information that is conveyed by variations in presentation of text',
    // OR
    'G140': 'Separating information and structure from presentation to enable different presentations',
    // OR Making information and relationships conveyed through presentation programmatically determinable using the following techniques:
    'G138': 'Using semantic markup whenever color cues are used',
    'H48': 'Using ol, ul and dl for lists or groups of links',
    'H42': 'Using h1-h6 to identify headings',
    'SCR21': 'Using functions of the Document Object Model (DOM) to add content to a page (Scripting)',
    // Tables
    'H51': 'Using table markup to present tabular information',
    'H39': 'Using caption elements to associate data table captions with data tables',
    'H73': 'Using the summary attribute of the table element to give an overview of data tables',
    'H63': 'Using the scope attribute to associate header cells and data cells in data tables',
    'H43': 'Using id and headers attributes to associate data cells with header cells in data tables',
    // Forms
    'H44': 'Using label elements to associate text labels with form controls',
    'H65': 'Using the title attribute to identify form controls when the label element cannot be used',
    'H71': 'Providing a description for groups of form controls using fieldset and legend elements',
    'H85': 'Using OPTGROUP to group OPTION elements inside a SELECT',
    // OR
    'ARIA11': 'Using ARIA landmarks to identify regions of a page (ARIA)',
    // OR
    'ARIA12': 'Using role=heading to identify headings (ARIA)',
    // OR
    'ARIA13': 'Using aria-labelledby to name regions and landmarks (ARIA)',
    // OR
    'ARIA16': 'Using aria-labelledby to provide a name for user interface controls (ARIA)',
    'ARIA17': 'Using grouping roles to identify related form controls (ARIA)'
  };

  // Failures
  sc.failures = {
    // Web page structure
    'F2': 'Using changes in text presentation to convey information without using the appropriate markup or text',
    'F17': 'Insufficient information in DOM to determine one-to-one relationships (e.g., between labels with same id) in HTML',
    'F42': 'Using scripting events to emulate links in a way that is not programmatically determinable',
    'F43': 'Using structural markup in a way that does not represent relationships in the content',
    'F87': 'Inserting non-decorative content by using :before and :after pseudo-elements and the content property in CSS',
     // Tables
    'F46': 'Using th elements, caption elements, or non-empty summary attributes in layout tables',
    'F48': 'Using the pre element to markup tabular information',
    'F90': 'Incorrectly associating table headers and content via the headers and id attributes',
    'F91': 'Not correctly marking up table headers',
    'F33': 'Using white space characters to create multiple columns in plain text content',
    'F34': 'Using white space characters to format tables in plain text content',
     // Forms
    'F68': 'Association of label and user interface controls not being programmatically determinable'
  };

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.3.2'] = (function (quail) {

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.3.2',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'G57': 'Ordering the content in a meaningful sequence (scope: for all the content in the Web page)',
    // OR
    'H34': 'Using a Unicode right-to-left mark (RLM) or left-to-right mark (LRM) to mix text direction inline (languageUnicodeDirection)',
    'H56': 'Using the dir attribute on an inline element to resolve problems with nested directional runs',
    'C6': 'Positioning content based on structural markup (CSS)',
    'C8': 'Using CSS letter-spacing to control spacing within a word',
    // OR
    'C27': 'Making the DOM order match the visual order (CSS)'
  };

  // Failures
  sc.failures = {
    // HTML Failures
    'F49': 'Using an HTML layout table that does not make sense when linearized',
    'F32': 'Using white space characters to control spacing within a word (whiteSpaceInWord)',
    'F1': 'Changing the meaning of content by positioning information with CSS',
    // Plain text Failures
    'F34': 'Using white space characters to format tables in plain text content (tabularDataIsInTable)',
    'F33': 'Using white space characters to create multiple columns in plain text content (tabularDataIsInTable)'
  };

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.3.3'] = (function (quail) {

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.3.3',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'G96': 'Providing textual identification of items that otherwise rely only on sensory information to be understood'
  };

  // Failures
  sc.failures = {
    'F14': 'Identifying content only by its shape or location',
    'F26': 'Using a graphical symbol alone to convey information'
  };

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.4.1'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.4.1',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.4.2'] = (function (quail) {

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    // This criteria applies if any media objects exist on the page. It's a
    // very crude preEvaluator, to be fair.
    return !!$('audio, video, object, embed').length;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.4.2',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'G60': 'Playing a sound that turns off automatically within three seconds',
    'G170': 'Providing a control near the beginning of the Web page that turns off sounds that play automatically',
    'G171': 'Playing sounds only on user request'
  };

  // Failures
  sc.failures = {
    'F23': 'Playing a sound longer than 3 seconds where there is no mechanism to turn it off'
  };

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.4.3'] = (function (quail) {

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  /**
   * (unused right now)
   *
   * Evaluates the Success Criteria.
   */
  //function evaluator(tests) {
    // // The set of tests that were run that pertain to this Success Criteria. This
    // // will be the union of the tests that were run and the required tests.
    // var criteriaTests = sc.filterTests(tests, sc.requiredTests);
    // // If the length of the union equals the length of the required tests,
    // // then we have the necessary tests to evaluate this success criteria.
    // if (criteriaTests.length === requiredTests.length) {
    //   // Find the tests to evaluate.
    //   var cssTextHasContrast = tests.find('cssTextHasContrast');
    //   // Cycle through the cases in the Success Criteria.
    //   sc.each(function (index, _case) {
    //     var selector = _case.get('selector');
    //     var conclusion = 'untested';
    //     var testCase, caseGroups;

    //     // Process 'labelsAreAssignedToAnInput'.
    //     caseGroups = cssTextHasContrast.groupCasesBySelector(selector);
    //     testCase = caseGroups && caseGroups[selector] && caseGroups[selector][0];

    //     if (testCase) {
    //       conclusion = testCase.get('status') || 'cantTell';
    //     }

    //     // Add the case to the Success Criteria.
    //     sc.addConclusion(conclusion, _case);
    //   });
    // }
  //}

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.4.3',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'G148': 'Not specifying background color, not specifying text color, and not using technology features that change those defaults',
    'G174': 'Providing a control with a sufficient contrast ratio that allows users to switch to a presentation that uses sufficient contrast',
    'G18': 'Ensuring that a contrast ratio of at least 4.5:1 exists between text (and images of text) and background behind the text for situation A AND G145: Ensuring that a contrast ratio of at least 3:1 exists between text (and images of text) and background behind the text for situation B'
  };

  // Failures
  sc.failures = {
    'F24': 'Specifying foreground colors without specifying background colors or vice versa',
    'F83': 'Using background images that do not provide sufficient contrast with foreground text (or images of text)'
  };

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.4.4'] = (function (quail) {

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.4.4',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'G142': 'Using a technology that has commonly-available user agents that support zoom',
    'C12': 'Using percent for font sizes',
    'C13': 'Using named font sizes',
    'C14': 'Using em units for font, sizes',
    'SCR34': 'Calculating size and ,position in a way that scales with text size (Scripting)',
    'G146': 'Using liquid layout',
    'G178': 'Providing controls on the Web page that allow users to incrementally change the size of all text on the page up to 200 percent',
    'G179': 'Ensuring that there is no loss of content or functionality when the text resizes and text containers do not change their width'
  };

  // Failures
  sc.failures = {
    'F69': 'Resizing visually rendered text up to 200 percent causes the text, image or controls to be clipped, truncated or obscured',
    'F80': 'Text-based form controls do not resize when visually rendered text is resized up to 200%'
  };

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.4.5'] = (function (quail) {

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    // Check for image tags. If the page does not have any, then there is
    // nothing to test.
    return !!document.querySelectorAll('img, map').length;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.4.5',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'C22': 'Using CSS to control visual presentation of text (CSS)',
    'C30': 'Using CSS to replace text with images of text and providing user interface controls to switch',
    'G140': 'Separating information and structure from presentation to enable different presentations'
  };

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.4.6'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.4.6',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.4.7'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.4.7',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.4.8'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.4.8',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['1.4.9'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:1.4.9',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.1.1'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.1.1',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.1.2'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.1.2',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.1.3'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.1.3',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.2.1'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.2.1',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.2.2'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.2.2',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.2.3'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.2.3',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.2.4'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.2.4',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.2.5'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.2.5',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.3.1'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.3.1',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.3.2'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.3.2',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.4.1'] = (function (quail) {

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.4.1',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'G1': 'Adding a link at the top of each page that goes directly to the main content area',
    'G123': 'Adding a link at the beginning of a block of repeated content to go to the end of the block',
    'G124': 'Adding links at the top of the page to each area of the content',
    'H69': 'Providing heading elements at the beginning of each section of content',
    'H70': 'Using frame elements to group blocks of repeated material AND H64: Using the title attribute of the frame and iframe elements',
    'SCR28': 'Using an expandable and collapsible menu to bypass block of content'
  };

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.4.10'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.4.10',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.4.2'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.4.2',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.4.3'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.4.3',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.4.4'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.4.4',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.4.5'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.4.5',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.4.6'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.4.6',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.4.7'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.4.7',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.4.8'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.4.8',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['2.4.9'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:2.4.9',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.1.1'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.1.1',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.1.2'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.1.2',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.1.3'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.1.3',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.1.4'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.1.4',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.1.5'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.1.5',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.1.6'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.1.6',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.2.1'] = (function (quail) {

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.2.1',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'G107': 'Using "activate" rather than "focus" as a trigger for changes of context'
  };

  // Failures
  sc.failures = {
    'F52': 'Opening a new window as soon as a new page is loaded',
    'F55': 'Using script to remove focus when focus is received'
  };

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.2.2'] = (function (quail) {

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.2.2',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'G80': 'Providing a submit button to initiate a change of context',
    // AND
    'H32': 'Providing submit buttons',
    'H84': 'Using a button with a select element to perform an action',

    'G13': 'Describing what will happen before a change to a form control that causes a change of context to occur is made',
    'SCR19': 'Using an onchange event on a select element without causing a change of context'
  };

  // Failures
  sc.failures = {
    'F36': 'Automatically submitting a form and presenting new content without prior warning when the last field in the form is given a value',
    'F37': 'Launching a new window without prior warning when the status of a radio button, check box or select list is changed',
    'F76': 'Providing instruction material about the change of context by change of setting in a user interface element at a location that users may bypass'
  };

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.2.3'] = (function (quail) {

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.2.3',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'G61': 'Presenting repeated components in the same relative order each time they appear'
  };

  // Failures
  sc.failures = {
    'F66': 'Presenting navigation links in a different relative order on different pages'
  };

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.2.4'] = (function (quail) {

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.2.4',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'G197': 'Using labels, names, and text alternatives consistently for content that has the same functionality AND following the sufficient techniques for Success Criterion 1.1.1 and sufficient techniques for Success Criterion 4.1.2 for providing labels, names, and text alternatives.'
  };

  // Failures
  sc.failures = {
    'F31': 'Using two different labels for the same function on different Web pages within a set of Web pages'
  };

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.2.5'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.2.5',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.3.1'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.3.1',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.3.2'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.3.2',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.3.3'] = (function (quail) {

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    var complexInputTypes = [
      //'button', //  Defines a clickable button (mostly used with a JavaScript to activate a script)
      'checkbox', //  Defines a checkbox
      'color', // Defines a color picker
      'date', //  Defines a date control (year, month and day (no time))
      'datetime', //  Defines a date and time control (year, month, day, hour, minute, second, and fraction of a second, based on UTC time zone)
      'datetime-local', //  Defines a date and time control (year, month, day, hour, minute, second, and fraction of a second (no time zone)
      'email', // Defines a field for an e-mail address
      'file', //  Defines a file-select field and a "Browse..." button (for file uploads)
      'hidden', //  Defines a hidden input field
      //'image', // Defines an image as the submit button
      'month', // Defines a month and year control (no time zone)
      'number', //  Defines a field for entering a number
      'password', //  Defines a password field (characters are masked)
      'radio', // Defines a radio button
      'range', // Defines a control for entering a number whose exact value is not important (like a slider control)
      //'reset', // Defines a reset button (resets all form values to default values)
      'search', //  Defines a text field for entering a search string
      //'submit', //  Defines a submit button
      'tel', // Defines a field for entering a telephone number
      //'text', //  Default. Defines a single-line text field (default width is 20 characters)
      'time', //  Defines a control for entering a time (no time zone)
      'url', // Defines a field for entering a URL
      'week' //  Defines a week and year control (no time zone)
    ];

    var requiredAttrs = [{
      'required': 'required'
    },
    {
      'aria-required': 'true'
    }];

    // Searches this for complex for types.
    //
    // @return boolean
    //    Whether the complex input type exists in the scoped DOM element.
    function hasComplexTypes (type) {
      return !!this.querySelectorAll('[type="' + type + '"]').length;
    }

    function hasTypesWithAttr (attr) {
      var key = Object.keys(attr)[0];
      return !!this.querySelectorAll('[' + key + '="' + attr[key] + '"]').length;
    }


    // Testing forms.
    //
    // If any of the complex form types are present in the document, this
    // success criteria applies.
    if (document.querySelectorAll('form').length) {
      if (complexInputTypes.some(hasComplexTypes, document) ||
        requiredAttrs.some(hasTypesWithAttr, document)
      ) {
        return true;
      }
    }
    else {
      return false;
    }
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.3.3',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    // Required fields
    'G83': 'Providing text descriptions to identify required fields that were not completed',
    'ARIA2': 'Identifying a required field with the aria-required property',
    // Field that requires specific data formats
    'ARIA18': 'Using aria-alertdialog to Identify Errors (ARIA)',
    'G85': 'Providing a text description when user input falls outside the required format or values',
    'G177': 'Providing suggested correction text',
    'SCR18': 'Providing client-side validation and alert (Scripting)',
    'SCR32': 'Providing client-side validation and adding error text via the DOM (Scripting)',
    // Field with limited set of values
    // 'ARIA18': 'Using aria-alertdialog to Identify Errors (ARIA)',
    'G84': 'Providing a text description when the user provides information that is not in the list of allowed values'
    // 'G177': 'Providing suggested correction text',
    // 'SCR18': 'Providing client-side validation and alert (Scripting)',
    // 'SCR32': 'Providing client-side validation and adding error text via the DOM (Scripting)'
  };

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.3.4'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.3.4',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.3.5'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.3.5',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['3.3.6'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:3.3.6',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['4.1.1'] = (function (quail) {
  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:4.1.1',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {};

  // Failures
  sc.failures = {};

  return sc;
}(quail));

quail.guidelines.wcag.successCriteria['4.1.2'] = (function (quail) {

  // The tests that must be run in order to evaluate this Success Criteria.
  // @todo, identify the complete set of required tests for this Success Criteria.
  // var requiredTests = ['labelsAreAssignedToAnInput', 'labelMustBeUnique', 'inputWithoutLabelHasTitle'];

  /**
   * Determines if this Success Criteria applies to the document.
   */
  function preEvaluator() {
    return true;
  }

  /**
   * (Unused right now)
   *
   * Evaluates the Success Criteria.
   */
  // function evaluator(tests) {
  //   // The set of tests that were run that pertain to this Success Criteria. This
  //   // will be the union of the tests that were run and the required tests.
  //   var criteriaTests = sc.filterTests(tests, sc.requiredTests);
  //   // If the length of the union equals the length of the required tests,
  //   // then we have the necessary tests to evaluate this success criteria.
  //   if (criteriaTests.length === requiredTests.length) {
  //     // Find the tests to evaluate.
  //     var labelsAreAssignedToAnInput = tests.find('labelsAreAssignedToAnInput');
  //     var labelMustBeUnique = tests.find('labelMustBeUnique');
  //     var inputWithoutLabelHasTitle = tests.find('inputWithoutLabelHasTitle');

  //     // Cycle through the cases in the Success Criteria.
  //     sc.each(function (index, _case) {
  //       var conclusion = 'untested';

  //       if (_case.get('status') !== 'notTested') {
  //         var selector = _case.get('selector');
  //         if (selector) {

  //           // @dev, we'll look at each test individually for this selector.
  //           // Process 'labelsAreAssignedToAnInput'.
  //           var cases_labelsAreAssignedToAnInput = labelsAreAssignedToAnInput.findCasesBySelector(selector);
  //           // Process 'labelMustBeUnique'.
  //           var cases_labelMustBeUnique = labelMustBeUnique.findCasesBySelector(selector);
  //           // Process 'inputWithoutLabelHasTitle'.
  //           var cases_inputWithoutLabelHasTitle = inputWithoutLabelHasTitle.findCasesBySelector(selector);

  //           var passing = ['passed', 'inapplicable'];

  //           // Make sure the arrays are not empty.
  //           if ((cases_labelsAreAssignedToAnInput.length >= 1 && cases_labelsAreAssignedToAnInput[0].hasStatus(passing)) &&
  //             (cases_labelMustBeUnique.length >= 1 && cases_labelMustBeUnique[0].hasStatus(passing)) &&
  //             (cases_inputWithoutLabelHasTitle.length >= 1 && cases_inputWithoutLabelHasTitle[0].hasStatus(passing))) {
  //             conclusion = 'passed';
  //           }

  //           // Don't bother if it isn't passed?
  //           if (conclusion === 'passed') {
  //             // (1) Determine if any of the following failures apply to the element
  //             //   at the selector. If so, fail the Success Criteria for that selector.
  //             var element = cases_labelMustBeUnique[0].attributes.element;

  //             // F59: Using script to make div or span a user interface control in HTML without providing a role for the control (This failure may be solved in the future using DHTML roadmap techniques.)
  //             if (element.nodeName === 'DIV' || element.nodeName === 'SPAN') {
  //               conclusion = 'failed';
  //             }

  //             // F20: Not updating text alternatives when changes to non-text content occur
  //             // N/A for labelMustBeUnique.

  //             // F68: Association of label and user interface controls not being programmatically determined

  //             //   F79: Focus state of a user interface component not being programmatically determinable or no notification of change of focus state available
  //             //   F86: Not providing names for each part of a multi-part form field, such as a US telephone number
  //             //   F89: Using null alt on an image where the image is the only content in a link ( #59 :ok: )
  //             // (2) If no Failures are detected, so if the Techniques are satisfied. If
  //             //   one of the techniques is satisfed for the element at the selector,
  //             //   Success Criteria is satisfied.
  //             //
  //             //   ARIA14: Using aria-label to provide an invisible label where a visible label cannot be used
  //             //   ARIA16: Using aria-labelledby to provide a name for user interface controls
  //             //
  //             //   G108: Using markup features to expose the name and role, allow user-settable properties to be directly set, and provide notification of changes using technology-specific techniques below:
  //             //   AND
  //             //
  //             //   H91: Using HTML form controls and links ( #66 )
  //             //   H44: Using label elements to associate text labels with form controls
  //             //   H64: Using the title attribute of the frame and iframe elements ( #65 )
  //             //   H65: Using the title attribute to identify form controls when the label element cannot be used ( #64 )
  //             //   H88: Using HTML according to spec ( #86 )
  //           }
  //         }
  //       }
  //       // Add the case to the Success Criteria.
  //       sc.addConclusion(conclusion, _case);
  //     });
  //   }
  // }

  // Create a new SuccessCriteria and pass it the evaluation callbacks.
  var sc = quail.lib.SuccessCriteria({
    'name': 'wcag:4.1.2',
    preEvaluator: preEvaluator
  });

  // Techniques
  sc.techniques = {
    'ARIA14': 'Using aria-label to provide an invisible label where a visible label cannot be used',
    'ARIA16': 'Using aria-labelledby to provide a name for user interface controls',
    'G108': 'Using markup features to expose the name and role, allow user-settable properties to be directly set, and provide notification of changes using technology-specific techniques below:',
    //AND
    'H91': 'Using HTML form controls and links',
    'H44': 'Using label elements to associate text labels with form controls',
    'H64': 'Using the title attribute of the frame and iframe elements',
    'H65': 'Using the title attribute to identify form controls when the label element cannot be used',
    'H88': 'Using HTML according to spec'
  };

  // Failures
  sc.failures = {
    'F59': 'Using script to make div or span a user interface control in HTML without providing a role for the control (This failure may be solved in the future using DHTML roadmap techniques.)',
    'F20': 'Not updating text alternatives when changes to non-text content occur',
    'F68': 'Association of label and user interface controls not being programmatically determined',
    'F79': 'Focus state of a user interface component not being programmatically determinable or no notification of change of focus state available',
    'F86': 'Not providing names for each part of a multi-part form field, such as a US telephone number',
    'F89': 'Using null alt on an image where the image is the only content in a link'
  };

  return sc;
}(quail));

quail.lib.wcag2.Criterion = (function () {

  // Provide default values for the assert objects
  function aggregateParts(parts, defaultResult) {
    var getResultPriority = quail.lib.wcag2.EarlAssertion.getResultPriority;
    var outcome = {result: defaultResult};

    $.each(parts, function (i, part) {
      if (getResultPriority(outcome) < getResultPriority(part)) {
        outcome.result = part.outcome.result;
      }
    });
    return outcome;
  }


  function constructor (data, testDefinitions, preconditionDefinitions, subject) {
    var testAggregators = [];
    var criterion = {};
    var defaultResult = data['default'] || 'untested';
    var id = data.id;

    // Create a TestAggregator object for each aggregator (if any)
    if ($.isArray(data.testAggregators)) {
      testAggregators = $.map(data.testAggregators, function (aggregateConf) {
        return new quail.lib.wcag2.TestAggregator(
          aggregateConf, testDefinitions, subject
        );
      });
    }

    // Create a precondition test
    if ($.isArray(data.preconditions)) {
      var preconditionTest = {
        type: 'stacking', // If any of it's content is found it should return cantTell
        tests: data.preconditions
      };
      // Add a test aggregator for the precondition tests
      testAggregators.push(new quail.lib.wcag2.TestAggregator(
        preconditionTest, preconditionDefinitions, subject
      ));
    }


    criterion.getResult = function (data) {
      var result;
      var parts = [];

      $.each(testAggregators, function (i, aggregator) {
        var part = aggregator.getResults(data);
        parts.push.apply(parts, part);
      });
      result = new quail.lib.wcag2.EarlAssertion({
        testRequirement: id,
        outcome: aggregateParts(parts, defaultResult),
        subject: subject
      });
      if (parts.length > 0) {
        result.hasPart = parts;
      }
      return result;
    };

    /**
     * Get an array of test used in this criterion
     * @param  {[json]} criteria
     * @return {[array]}
     */
    criterion.getTests = function () {
      var tests = [];
      $.each(testAggregators, function (i, aggregator) {
        tests.push.apply(tests, aggregator.tests);
      });
      return tests;
    };

    return criterion;
  }

  return constructor;

}());

quail.lib.wcag2.EarlAssertion = (function () {
  var pageUrl;
  var resultPriorityMap = [
    'untested', 'inapplicable', 'passed',
    'cantTell', 'failed'
  ];
  var defaultAssertion = {
    type: 'assertion',
    subject: pageUrl,
    assertedBy: {
      type: 'earl:Software',
      name: 'QuailJS'
    },
    mode: 'automated'
  };


  if (window && window.location) {
    pageUrl = window.location.href;
  }

  /**
   * Create a new earl assert object
   * @param {object} base Properties from this object are added to the Assertion
   *                      and override the default.
   */
  function Assertion(base) {
    $.extend(this, base, defaultAssertion);
    this.outcome = $.extend({}, this.outcome);
  }


  /**
   * Return the priorty index of the result
   * @param  {result|assert|outcome} val
   * @return {integer}     Result index in order of prioerty
   */
  Assertion.getResultPriority = function (val) {
    if (typeof val === 'object') {
      if (val.outcome) {
        val = val.outcome.result;
      } else {
        val = val.result;
      }
    }
    return resultPriorityMap.indexOf(val);
  };

  return Assertion;

}());
quail.lib.wcag2.TestAggregator = (function () {

  var pointerMap = {
    elms: [],
    pointers: [],
    add: function (testCase) {
      var pointer;
      if (pointerMap.elms.indexOf(testCase.get('element')) === -1) {
        if (testCase.get('html')) {
          pointer = [{
            type: 'CharSnippetCompoundPointer',
            chars: testCase.get('html'),
            CSSSelector: testCase.get('selector')
          }];
        }
        pointerMap.elms.push(testCase.get('element'));
        pointerMap.pointers.push(pointer);
      }
    },
    getPointer: function (elm) {
      var index = pointerMap.elms.indexOf(elm);
      return pointerMap.pointers[index];
    }
  };

  /**
   * Run the callback for each testcase within the array of tests
   * @param  {array}   tests
   * @param  {Function} callback Given the parameters (test, testcase)
   */
  function eachTestCase(tests, callback) {
    $.each(tests, function (i, test) {
      test.each(function () {
        callback.call(this, test, this);
      });
    });
  }

  /**
   * Get an array of elements common to all tests provided
   * @param  {Object} tests
   * @return {Array}        Array of HTML elements
   */
  function getCommonElements(tests) {
    var common = [];
    var map = [];

    $.each(tests, function (i, test) {
      var elms = [];
      test.each(function () {
        elms.push(this.get('element'));
        pointerMap.add(this);
      });
      map.push(elms);
    });
    $.each(map, function (i, arr) {
      if (i === 0) {
        common = arr;
        return;
      }
      var newArr = [];
      $.each(arr, function (i, val) {
        if (common.indexOf(val) !== -1) {
          newArr.push(val);
        }
      });
      common = newArr;
    });

    return common;
  }

  /**
   * Get an array of elements in the given tests
   * @param  {Object} tests
   * @return {Array}        Array of HTML elements
   */
  function getAllElements(tests) {
    var elms = [];
    eachTestCase(tests, function (test, testCase) {
      var elm = testCase.get('element');
      if (elms.indexOf(elm) === -1) {
        elms.push(elm);
        pointerMap.add(testCase);
      }
    });
    return elms;
  }

  /**
   * Look at each unique element and create an assert for it
   * @param  {array[DOM element]} elms
   * @param  {object} base Base object for the assert
   * @return {array[assert]}      Array with asserts
   */
  function createAssertionsForEachElement(elms, base) {
    var assertions = [];
    // Create asserts for each element
    $.each(elms, function (i, elm) {
      var assertion = new quail.lib.wcag2.EarlAssertion(base);
      if (elm) { // Don't do undefined pointers
        assertion.outcome.pointer = pointerMap.getPointer(elm);
      }
      assertions.push(assertion);
    });
    return assertions;
  }

  /**
   * Combine the test results of an Aggregator into asserts
   *
   * A combinbing aggregator is an aggregator which only fails if all it's tests fail
   *
   * @param  {Object} aggregator
   * @param  {Array[Object]} tests
   * @return {Array[Object]}         Array of Asserts
   */
  function getCombinedAssertions(aggregator, tests) {
    // element should already be unique, but some tests have bugs that cause them
    // not to be. This prevents those problems from escalating
    var elms = jQuery.unique(getCommonElements(tests));

    var assertions = createAssertionsForEachElement(jQuery.unique(elms), {
      testCase: aggregator.id,
      outcome: {result: 'failed'}
    });

    // Iterate over all results to build the assert
    eachTestCase(tests, function (test, testCase) {
      // Look up the assert, if any
      var newResult = testCase.get('status');
      var getResultPriority = quail.lib.wcag2.EarlAssertion.getResultPriority;
      var assertion = assertions[elms.indexOf(
        testCase.get('element')
      )];

      // Allow the aggregator to override the results
      if (aggregator[newResult]) {
        newResult = aggregator[newResult];
      }

      // Override if the resultId is higher or equal (combine)
      if (assertion && getResultPriority(assertion) >= getResultPriority(newResult)) {
        var pointer = assertion.outcome.pointer;
        assertion.outcome = {
          result: newResult,
          info: test.get('title')
        };
        if (pointer) {
          assertion.outcome.pointer = pointer;
        }
      }
    });

    return assertions;
  }


  /**
   * Stack the test results of a aggregator into asserts
   *
   * A stacked aggregator is one that fails if any of the tests fail
   *
   * @param  {Object} aggregator
   * @param  {Array[Object]} tests
   * @return {Array[Object]}         Array of Asserts
   */
  function getStackedAssertions(aggregator, tests) {
    var elms = getAllElements(tests);
    var asserts = createAssertionsForEachElement(elms, {
      testCase: aggregator.id,
      outcome: { result: 'untested'}
    });

    // Iterate over all results to build the assert
    eachTestCase(tests, function (test, testCase) {
      // Look up the assert, if any
      var newResult = testCase.get('status');
      var getResultPriority = quail.lib.wcag2.EarlAssertion.getResultPriority;
      var assert = asserts[elms.indexOf(
        testCase.get('element')
      )];

      // Allow the aggregator to override the results
      if (aggregator[newResult]) {
        newResult = aggregator[newResult];
      }

      // Override if the resultId is lower (stacked)
      if (assert && getResultPriority(assert) < getResultPriority(newResult)) {
        assert.outcome = {
          result: newResult,
          info: test.get('title')
        };
      }
    });
    return asserts;
  }


  function TestAggregator(config, testDefinitions, subject) {
    $.extend(this, {
      id: config.tests.join('+'),
      subject: subject
    }, config);

    this.tests = $.map(this.tests, function (test) {
      return testDefinitions[test];
    });
  }


  /**
   * Filter the data array so it only contains results
   * from this aggregator
   * @param  {Array} data
   * @return {Array}
   */
  TestAggregator.prototype.filterDataToTests = function (data) {
    var names = $.map(this.tests, function (test) {
      return test.name;
    });
    var testData = [];

    $.each(data, function (i, result) {
      if (names.indexOf(result.get('name')) !== -1) {
        testData.push(result);
      }
    });
    return testData;
  };

  /**
   * Get the results of this test aggregator based on the tests provided for it
   * @param  {object} tests As provided by Quail
   * @return {object}       EARL assertions
   */
  TestAggregator.prototype.getResults = function (tests) {
    var assertions, assertion;
    var filteredTests = this.filterDataToTests(tests);

    if (filteredTests.length === 1 || this.type === 'combined') {
      assertions = getCombinedAssertions(this, filteredTests);

    } else if (this.type === "stacking") {
      assertions = getStackedAssertions(this, filteredTests);

    } else if (window) {
      window.console.error(
        "Unknown type for aggregator " + this.id
      );
    }

    // Return a default assert if none was defined
    if (assertions) {
      if (assertions.length === 0) {
        assertion = new quail.lib.wcag2.EarlAssertion({
          testCase: this.id,
          subject: this.subject,
          outcome: {
            result: 'inapplicable'
          }
        }),
        assertions.push(assertion);
      }
      return assertions;
    }
  };

  return TestAggregator;
}());
})(jQuery);
