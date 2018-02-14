/**
* Copyright (c) 2018 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.setLang( 'a11yfirsthelp', 'en', {
  label:        'A11yFirst Help',
  panelTitle:   'Learn about A11yFirst features',
  keyboardShortcutsLabel: 'Keyboard Shortcuts',

  a11yFirstHelpLabel: 'A11yFirst Help: Content Accessibility',
  a11yFirstHelpTitle: 'Information to help authors understand how the A11yFirst features help \
  them make content more accessible to people with disabilites',

  aboutA11yFirst: {
    'menu':  'About A11yFirst',
    'label': 'About A11yFirst',
    'title': 'About A11yFirst',

    'no_org': '\
## About A11yFirst\n\
\n\
### Importance of Accessibility\n\
This organization has made a committment to accessibility, not only to comply with the \
Americans with Disabilities Act (ADA) and Section 504 requirements, but also because making \
sure everyone has equal access to the information in this website is the right thing \
to do.\n\n\
**You play an important part** in making sure this organization creates and maintains online \
content that is accessible. The changes to the editor toolbar are designed to help you create \
and maintain accessible content and learn more about accessibility.\n',

    'has_org':'\
## About A11yFirst\n\
\
### Importance of Accessibility\n\
The %org has made a committment to accessibility, not only to comply with the Americans with \
Disabilities Act (ADA) and Section 504 requirements, but also because making sure everyone has \
equal access to the information in this website is the right thing to do.\n\n\
**You play an important part** in making sure the %org creates and maintains online \
content that is accessible. The changes to the editor toolbar are designed to help you create \
and maintain accessible content and learn more about accessibility.\n',

    'policy_link':  '\n[%policy_label](%policy_url)\n',

    'content': '\
ABOUTA11YFIRST\
'
  },

  headingHelp: {
    'menu':  'Heading / Paragraph',
    'label': 'Heading / Paragraph',
    'title': 'Heading / Paragraph Help',
    'content': '\
HEADINGHELP\
'
  },

  inlineStyleHelp: {
    'menu':  'Character Style',
    'label': 'Character Style',
    'title': 'Character Style Help',
    'content': '\
INLINESTYLEHELP\
'
  },

  linkHelp: {
    'menu':  'Link',
    'label': 'Link',
    'title': 'Link Help',
    'content' : '\
LINKHELP\
'
  }
} );
