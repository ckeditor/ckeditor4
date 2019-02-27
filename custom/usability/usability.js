/**
* Copyright (c) 2018 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/

function edit(event) {

  var buttonNode  = event.currentTarget;

  var blogContainer = buttonNode.parentNode.parentNode.parentNode.parentNode;

  var contentNode    = blogContainer.querySelector('.content div[id]');
  var editorNode     = blogContainer.querySelector('.editor > div[id]');
  var imageResources = blogContainer.querySelectorAll('.image_resources');

  if (buttonNode.textContent.trim().toLowerCase().indexOf('edit') >= 0 ) {
    buttonNode.textContent = 'Save';
    CKEDITOR.instances[editorNode.id].setData(contentNode.innerHTML);
    editorNode.parentNode.removeAttribute('hidden');
    imageResources.forEach(function (er) {er.removeAttribute('hidden')});
    contentNode.setAttribute('hidden', '');
  }
  else {
    buttonNode.textContent = 'Edit';
    contentNode.innerHTML = CKEDITOR.instances[editorNode.id].getData();
    editorNode.parentNode.setAttribute('hidden', '');
    imageResources.forEach(function (er) {er.setAttribute('hidden','')});
    contentNode.removeAttribute('hidden');
    updateTitle(blogContainer);
  }
}

const copyToClipboard = str => {
  const el = document.createElement('textarea');  // Create a <textarea> element
  el.value = str;                                 // Set its value to the string that you want copied
  el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
  el.style.position = 'absolute';
  el.style.left = '-9999px';                      // Move outside the screen to make it invisible
  document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
  const selected =
    document.getSelection().rangeCount > 0        // Check if there is any content selected previously
      ? document.getSelection().getRangeAt(0)     // Store selection if found
      : false;                                    // Mark as false to know no selection existed before
  el.select();                                    // Select the <textarea> content
  document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el);                  // Remove the <textarea> element
  if (selected) {                                 // If a selection existed before copying
    document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
    document.getSelection().addRange(selected);   // Restore the original selection
  }
};

function copyImageSRC(event) {

  var img = event.currentTarget.parentNode.parentNode.querySelector('img');

  if (img) {
    copyToClipboard(img.src);
    console.log('URL copied to clipboard: ' + img.src);
  }

  event.currentTarget.focus();
};

function copyImageKeyDown(event) {

  if (event.keyCode === 10 || event.keyCode === 32) {
    copyImageSRC(event);
    event.stopPropagation();
    event.preventDefault();
  }
};

function copyImageFocus(event) {
  event.currentTarget.parentNode.parentNode.firstElementChild.classList.add('focus');
};

function copyImageBlur(event) {
  event.currentTarget.parentNode.parentNode.firstElementChild.classList.remove('focus');
};

function updateTitle(section) {
  var website = section.querySelector('header h1');
  var page = section.querySelector('main h1');
  if (website) {
    website = website.textContent.trim();
    if (page) {
      page = page.textContent.trim().split(':')[0];
      document.title = page + ': ' + website;
    }
    else {
      document.title = website;
    }
  }
  else {
    if (page) {
      page = page.textContent.trim().split(':')[0];
      document.title = page;
    }
    else {
      document.title = 'no title';
    }
  }
}

function showTab(event) {

  var tab = event.currentTarget;

  var tabs = document.querySelectorAll('nav a');

  tabs.forEach(function(t) {

    var section = document.getElementById(t.getAttribute('data-ref'));

    if (t == tab) {
      t.classList.add('active');
      if (section) {
        section.removeAttribute('hidden');
        updateTitle(section);
      }
    }
    else {
      t.classList.remove('active');
      if (section) {
        section.setAttribute('hidden', '');
      }
    }
  });

};

window.addEventListener('load', function () {

  var tabs = document.querySelectorAll('nav a');

  tabs.forEach( function (tab) {

    tab.addEventListener('click', showTab);

  });

  var buttons = document.querySelectorAll('.image_resources input[type="image"]');

  buttons.forEach( function(button) {
    button.addEventListener('click', copyImageSRC);
    button.addEventListener('keydown', copyImageKeyDown);
    button.addEventListener('focus', copyImageFocus);
    button.addEventListener('blur', copyImageBlur);
  });

  var editors = document.querySelectorAll('main .editor div[id]');

  editors.forEach( function (editor) {
    CKEDITOR.replace( editor.id, {
      customConfig: CKEDITOR.basePath + 'custom/config.js',
      headings: 'h1:h4',
      oneLevel1: true
    });
  });

});
