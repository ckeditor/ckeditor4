/**
* Copyright (c) 2018 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.replace( 'editor', {
  customConfig: CKEDITOR.basePath + 'custom/config.js',

  a11yfirst: {
    organization: 'University of Illinois Library',
    a11yPolicyLink: 'http://guides.library.illinois.edu/usersdisabilities/',
    a11yPolicyLabel: 'Information for Users with Disabilities',
  },

  headings: 'h1:h4',
  oneLevel1: true
} );
