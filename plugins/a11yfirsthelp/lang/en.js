/**
* Copyright (c) 2017 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.setLang( 'a11yfirsthelp', 'en', {
  label:        'A11yFirst Help',
  panelTitle:   'learn about A11yFirst features',
  keyboardShortcutsLabel:    'Keyboard Shortcuts',

  a11yFirstHelpLabel:   'A11yFirst Help: Content Accessibility',
  a11yFirstHelpTitle:   'Information to help authors understand how the A11yFirst features help them make content more accessible to people with disabilites',

  gettingStarted: {
    'menu': 'Getting Started',
    'label': 'Getting Started',
    'title': 'Getting Started with accessibility using the A11yFirst Toolbar',

    'no_org': '\
## Getting Started\n\
\n\
### Importance of Accessibility\n\
This organization has made a committment to accessibility, not only to comply with the American\'s with Disabilities Act(ADA) or Section 504 requirements, but also because it the right thing to do to make sure everyone has equal access to the information in this website.\n\n\
**You play an important part** in making sure this organization creates and maintains online content that is accessible.  The changes to the editor toolbar are designed to help you create and maintain accessible content and learn more about accessibility.\n',

    'has_org':'\
## Getting Started\n\
\
### Importance of Accessibility\n\  The %org has made a committment to accessibility, not only to comply with the American\'s with Disabilities Act(ADA) or Section 504 requirements, but also because it the right thing to do to make sure everyone has equal access to the information in this website.\n\n\
**You play an important part** in making sure the %org creates and maintains online content that is accessible.  The changes to the editor toolbar are designed to help you create and maintain accessible content and learn more about accessibility.\n',

    'policy_link':  '\n[%policy_label](%policy_url)\n',

    'content': '\
### What Is Accessibility?\n\
\n\
* Information should be perceivable and usable to everyone, including people with disabilities.\n\
\n\
* Information should be organized and structured for people understand the purpose of the content.\n\
\n\
* Compatibility with assistive technologies and operating system accessibility features.\n\
\n\
### People with disabilities include people who:\n\
\n\
* cannot see very well or are blind;\n\
\n\
* cannot hear very well or are deaf;\n\
\n\
* have impaired motor skills or are paralyzed;\n\
\n\
* have learning or cognitive disabilities that affect their ability to read text or understand images.\n\
\n\
### A11yFirst Toolbar Features\n\
\n\
* **Heading**: Helps you keep the heading and sub-heading structure of your document properly nested.\n\
\n\
* **Block Format**: Provides special styling for blocks of text (e.g. paragraphs) within your document.\n\
\n\
* **Inline Style**: Provides styling to highlight or emphasize a word or group of words (i.e. characters) within a block of text.\n\
\n\
### Additional Resources\n\
\n\
* <a href="https://webaim.org/techniques/semanticstructure/" target="_resource">WebAIM: Semantic Structure</a>\n\
\n\
* <a href="https://webaim.org/techniques/hypertext/" target="_resource">WebAIM: Links and Hypertext</a>\n\
\n\
* <a href="https://webaim.org/techniques/images/" target="_resource">WebAIM: Accessible Images</a>\n\
\n\
* <a href="https://webaim.org/techniques/tables/data" target="_resource">WebAIM: Creating Accessible Tables</a>\n\
\n\
* <a href="http://diagramcenter.org/" target="_resource">Diagram Center: Image Description Guidelines</a>\n\
',
},

  headingHelp: {
    'menu': 'Heading Help',
    'label': 'Heading',
    'title': 'Headings identify the section and sub-section of the document, and provide a consistent styling of the structure of a document to help users understand the organization of the documents.',
    'content': '\
## Heading\n\
\n\
### How it works\n\
* The Heading menu only enables the **allowed** heading levels.\n\
\n\
* The cursor position determines which headings are allowed.\n\
\n\
* Create a new heading by moving the cursor to a text block and selecting an allowed heading level.\n\
\n\
* To convert a heading to normal text, move the cursor to a heading and select the normal text option.\n\
\n\
### Why it\'s important\n\
* The purpose of a heading is to label the content that follows it.\n\
\n\
* The proper nesting of heading levels improves the ability of all users to find and read information on a page.\n\
\n\
* Headings used consistently and in meaningful ways improve Search Engine Optimization (SEO).\n\
\n\
* Properly nested headings enable people using assistive technologies to easily navigate to each section of a document.\n\
\n\
### More information\n\
* Documents are easier to read and understand when headings identify the topics they contain.\n\
\n\
* Headings make it easier to scan and find topics of interest within a document.\n\
\n\
* Heading levels identify the structural relationships between sections of content in a document.\n\
\n\
* Higher-level headings (Levels 1 and 2) identify the main topics of a document and lower-level headings (Levels 3, 4, 5 and 6) identify subsections of the document.\n\
\n\
* A subsection is identified by using the next lower-level heading. For example, subsections of Level 2 headings use Level 3 headings, subsections of Level 3 headings use Level 4 headings, and so on to Level 6 headings.\n\
\n\
* Break content into subsections when there are two or more ideas or concepts that correspond to the topics covered in the section. Use headings of the same level to label each subsection.\n\
\n\
* Heading levels should **never** be used for inline visual styling of content (e.g. larger or smaller font size, bold or italic). Instead, use the "Inline Style" options.\n\
',
},

  blockFormatHelp: {
    'menu': 'Block Format Help',
    'label': 'Block Format',
    'title': 'Block format applies styles to an entire block of text, for example a paragraph or a list item.',
    'content': '\
## Block Format\n\
\n\
### Donec scelerisque sapien\n\
\n\
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at nisi nisi. Maecenas vulputate aliquam eros vel auctor. Nam bibendum varius placerat. Etiam sit amet quam orci. Aenean accumsan ultrices turpis, sit amet convallis quam bibendum eu. Aliquam tempor, dui a malesuada dignissim, ipsum lacus tincidunt nunc, in aliquam leo libero sit amet libero.\n\
\n\
### Aliquam dictum ac\n\
\n\
* Fusce vitae iaculis lectus, quis pellentesque turpis.\n\
* Donec placerat condimentum interdum.\n\
* Um sit amet, hendreri morbi eu risus eget lacus ve.\n\
* C enim enim, interdum ac mauris eu, viverra tempor.\n\
',
},

  inlineStyleHelp: {
    'menu': 'Inline Style Help',
    'label': 'Inline Style',
    'title': 'Inline style applies styles to an selected block of text, for example applying emphasis to a few words in a sentence',
    'content': '\
## Inline Style\n\
\n\
### Consectetur adipiscing elit\n\
\n\
Fusce vitae iaculis lectus, quis pellentesque turpis, consectetur adipiscing elit. enim enim, interdum ac mauris eu, viverra tempor. Maecenas vulputate aliquam eros vel auctor. Nam bibendum varius placerat. Etiam sit amet quam orci. Aenean accumsan hendreri morbi eu risus quam bibendum eu. Aliquam tempor, dui a malesuada dignissim, ipsum lacus tincidunt nunc, in aliquam leo libero sit amet libero.\n\
\n\
### Hendreri morbi\n\
\n\
* Nam bibendum varius placerat.\n\
* Aliquam tempor, dui a malesuada dignissim.\n\
* Urpis, sit amet convallis lacus ve.\n\
* C vulputate aliquam eros vel auctor.\n\
',
},

  linkHelp: {
    'menu': 'Link Help',
    'label': 'Link',
    'title': 'Inline style applies styles to an selected block of text, for example applying emphasis to a few words in a sentence',
    'content' : '\
## Link\n\
\n\
### Vestibulum elementum\n\
\n\
Maecenas faucibus rhoncus ultricies. Etiam eget porttitor elit. Aenean congue rhoncus commodo. Nulla et condimentum nulla. Phasellus tempor ligula vel ipsum vehicula, a condimentum turpis sagittis. Nunc elementum arcu nec odio euismod, non sodales mi convallis. Nunc vitae libero nibh. Phasellus condimentum velit non porttitor pharetra. Sed accumsan elit nulla, ut pretium libero sollicitudin at. Morbi tempus interdum fermentum..\n\
\n\
### Maecenas lobortis\n\
\n\
* Aliquam non scelerisque nisl.\n\
* Aenean nec semper erat. Aliquam erat volutpat.\n\
* Proin mattis egestas libero a ultricies.\n\
* Aliquam hendrerit ultrices neque.\n\
',
},
} );
