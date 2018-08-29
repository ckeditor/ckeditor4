/**
* Copyright (c) 2018 University of Illinois - Jon Gunderson and Nicholas Hoyt. All rights reserved.
* For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.setLang( 'a11yfirsthelp', 'en', {
  label:        'A11yFirst Help',
  panelTitle:   'Learn about A11yFirst features',
  keyboardShortcutsLabel: 'Keyboard Shortcuts',
  versionLabel: 'Version',

  a11yFirstHelpLabel: 'A11yFirst Help: Content Accessibility',
  a11yFirstHelpTitle: 'Information to help authors understand how the A11yFirst features help \
  them make content more accessible to people with disabilites',

  headingHelp: {
    'menu':  'Heading / Paragraph',
    'label': 'Heading / Paragraph',
    'title': 'Heading / Paragraph Help',
    'content': '\
## Heading / Paragraph\n\
\n\
### Menu items\n\
* **H1 – Document title** — Typically should be the first heading in the\n\
  document and used only once.\n\
* **H2 – Section title** — Describes a main or top-level section in the\n\
  document.\n\
* **H3 to H6 – Subsection title** — Describes a subsection within a top-level\n\
  section or other subsection of the document.\n\
* **Normal** — The default paragraph format, typically with significant top\n\
  and bottom margins.\n\
* **Preformatted text** — Use this for computer code blocks to maintain spacing\n\
  and indentation.\n\
* **Address line** — Use this to type a series of address lines styled in\n\
  italics and with minimal top and bottom margins. When you press enter at the\n\
  end of a line, the next line is also an address line.\n\
\n\
### About headings\n\
* The Heading / Paragraph menu only enables the **allowed** heading levels.\n\
\n\
* The cursor position relative to other headings in the document determines\n\
which heading levels are allowed.\n\
\n\
### About paragraph formats\n\
* Visual styling for paragraph formats is predetermined by your organization,\n\
thus freeing up your time and energy for concentrating on the structure and\n\
meaning of the content within your document.\n\
\n\
### Why headings and paragraph formats are important\n\
* The purpose of a heading is to label the content that follows it.\n\
\n\
* The proper nesting of heading levels improves the ability of all users to\n\
find and comprehend information on a page.\n\
\n\
* Headings used consistently and in meaningful ways improve Search Engine\n\
Optimization (SEO).\n\
\n\
* Properly nested headings enable people using assistive technologies to easily\n\
navigate to each section of a document.\n\
\n\
* When paragraph formats are used properly (e.g. *Preformatted* or *Address*),\n\
they help users of assistive technologies understand the intended role of the\n\
content.\n\
\n\
* Thinking in terms of blocks such as headings and paragraph formats within\n\
your document is a higher-level approach to providing structure and semantics\n\
that are important for all users.\n\
\n\
### More information\n\
* Documents are easier to read and understand when headings identify the topics\n\
they contain.\n\
\n\
* Headings make it easier to scan and find topics of interest within a document.\n\
\n\
* Heading levels identify the structural relationships between sections of\n\
content in a document.\n\
\n\
* Higher-level headings (Levels 1 and 2) identify the main topics of a document\n\
and lower-level headings (Levels 3, 4, 5 and 6) identify subsections of the\n\
document.\n\
\n\
* A subsection is identified by using the next lower-level heading. For\n\
example, subsections of Level 2 headings use Level 3 headings, subsections of\n\
Level 3 headings use Level 4 headings, and so on to Level 6 headings.\n\
\n\
* Break content into subsections when there are two or more ideas or concepts\n\
that correspond to the topics covered in the section. Use headings of the same\n\
level to label each subsection.\n\
\n\
* Heading levels should **never** be used for inline visual styling of content\n\
(e.g. larger or smaller font size, bold or italic). Instead, use the `Inline\n\
Style` options.\n\
'
  },

  listHelp: {
    'menu':  'List',
    'label': 'List',
    'title': 'List Help',
    'content' : '\
## List\n\
\n\
### Working with lists\n\
\n\
<img style="padding: 8px 0 3px 5px" alt="list toolbar buttons" src="basePath/plugins/a11yfirsthelp/images/list-buttons.png"/>\n\
\n\
Use the toolbar buttons shown above to:\n\
\n\
* Insert/Remove Numbered List\n\
* Insert/Remove Bulleted List\n\
* Increase Indent\n\
* Decrease Indent\n\
\n\
### List properties via context menu\n\
\n\
The context menu allows further configuration of list properties such as\n\
numbering and bullet types by selecting:\n\
\n\
* Numbered List Properties\n\
* Bulleted List Properties\n\
\n\
The context menu can be invoked by positioning the cursor in a list item and:\n\
\n\
* right-clicking, using the mouse, or\n\
* using Mouse Keys on Windows or Mac.\n\
\n\
### About lists\n\
\n\
* Use a numbered list when the order or sequence of the items is significant.\n\
* Use a bulleted list when the order of the items is not significant.\n\
\n\
### Why lists are important\n\
\n\
* Lists convey grouping semantics for related items.\n\
* Lists may also convey hierarchical structure.\n\
* When related items are grouped as a list, information about the list is\n\
  conveyed to screen reader users, including the type of list, the number of\n\
  items it contains and the sequence number of the current list item.\n\
'
  },

  imageHelp: {
    'menu':  'Image',
    'label': 'Image',
    'title': 'Image Help',
    'content' : '\
## Image\n\
\n\
### Overview\n\
\n\
* People with visual impairments or visual processing disorders need *accessible text descriptions* of informative images.\n\
\n\
* Effective text descriptions of informative images can determine the extent to which readers comprehend your document.\n\
\n\
* By understanding how to classify images, you will be able to determine whether an image needs an accessible text description and how detailed that description needs to be.\n\
\n\
### Type of Image\n\
\n\
* An **informative** image adds informational content to the document, and therefore requires at least a short text description. If the image is informationally complex, it requires an additional long description.\n\
\n\
* A **decorative** image does not add information to the document, and therefore *does not require an accessible text description*.\n\
\n\
### Accessible Descriptions\n\
\n\
An accessible text description should accurately present the informational content of the image.\n\
\n\
Accessible descriptions of images fall into two categories:\n\
\n\
1. **Short description**: required for all *informative* images\n\
1. **Long description**: required for informationally *complex* images\n\
\n\
### Short description\n\
\n\
* An informative image, whether it is complex or not, requires a short description, which you provide in the *Short description* field.\n\
\n\
* The short description is added to the `alt` attribute of the `img` element.\n\
\n\
### Tips for writing an effective short description\n\
\n\
The following are based on <a href="https://webaim.org/">WebAIM\'s</a> guidelines for writing effective short descriptions:\n\
\n\
* **Be accurate and equivalent** in presenting the same *content* and *function* of the image.\n\
\n\
* When **images are used as links** the short description should describe the target of the link.\n\
\n\
* **Be succinct.** This means the correct content and function of the image should be presented as succinctly as is appropriate. Typically no more than a few words are necessary, though rarely a short sentence or two may be appropriate. The length should not exceed 100 characters.\n\
\n\
* **Do NOT be redundant** or provide the same information as text that is already part of the document.\n\
\n\
* **Do NOT use the phrases "image of ..." or "graphic of ..."** to describe the image. Assistive technologies notify the user of the image.  It is your job to describe the purpose or the content of the image.  If the image is a photograph or illustration, etc. of important content, it may be useful to include this in the short description.\n\
\n\
* **Do NOT include file names or sizes** as part of the short description.\n\
\n\
### What is a complex image?\n\
\n\
* Images that convey a significant amount of information, such as charts, graphs, diagrams, scientific photographs and works of art, are complex images.\n\
\n\
* A complex image has informational content that is richer and more detailed than simpler images, and cannot be described adequately with a short description. A complex image needs both a short description and a longer, more detailed description.\n\
\n\
### Describing a complex image\n\
\n\
* Best practices for describing a complex image prescribe that the long description be placed within the document, usually just before or after the image.\n\
\n\
* The type of long description you provide for a complex image is dependent on the context of the image in the document.\n\
\n\
* Many authors find it both natural and necessary to describe the informational content of a complex image within the document itself, using expository prose or tabular data.\n\
\n\
* For example, images of charts can be described by adding a table of the data used to generate the chart.\n\
\n\
Follow these three steps for describing a complex image:\n\
\n\
1. Insert an adequately long and detailed description of the image within the document, either just before or after the image (or both).\n\
\n\
1. Select the *Complex image (requires long description)* checkbox.\n\
\n\
1. Select the appropriate option for *Location of long description in document*.\n\
\n\
By specifying the location of the long description relative to the image, this information can then be made available to screen reader users.\n\
\n\
### Include an editable caption\n\
\n\
* A **caption** is an optional visual label supported by CKEditor for an image. It provides an additional way to describe an image that is immediately below and proximate to the image.\n\
\n\
* The caption content is specified and is editable in the text box just below the image, once it has been inserted in the document.\n\
\n\
* From an accessibility perspective the *caption* and the *short description* should not be the same, but instead should complement each other.\n\
\n\
* In some cases, where the *caption* sufficiently describes the purpose of the image, it may not be necessary to provide a *short description*. Alternatively, it may be useful to use the *short description* to provide a slightly more detailed description than the *caption*.\n\
\n\
* In other cases the *caption* may be providing detailed information about an image (e.g. the names and rows of people in a group picture), whereby the *short description* should provide a shorter text description of the purpose of the image (e.g. group picture of..).\n\
\n\
* Using the caption creates a `figcaption` element contained in a `figure` element.  The `figure` element also contains the `img` element.\n\
\n\
### Why image descriptions are important\n\
\n\
Adding accessible text descriptions of images is an important part of making documents accessible to the visually impaired who use assistive devices such as screen readers and magnifiers, and to people with visual processing disorders, which make especially complex images more difficult to understand.\n\
\n\
When the user cannot see all or part of the image, assistive technologies will read or display the accessible text description(s) associated with the image. This is especially important when the image conveys information that is required for the user to fully understand the information in the document. For people with visual processing disorders, the long description of a complex image helps them to more quickly or completely understand the information being conveyed by the image.\n\
\n\
### Summary\n\
\n\
The following is some general guidance on writing short text descriptions and providing longer, more detailed descriptions:\n\
\n\
* Simple images, photos and logos often can be described in less than 100 characters.\n\
\n\
* More complex images like graphs, diagrams and charts need both a short description and a longer, more detailed description, which is typically included in the same document as the image.\n\
\n\
* Purely decorative images do not need an accessible text description.\n\
\n\
### More information\n\
\n\
* <a href="http://accessibility.psu.edu/images/alttext/" target="_resource">Penn State: Image ALT Text</a>\n\
\n\
* <a href="https://webaim.org/techniques/alttext/" target="_resource">WebAIM: Alternative Text</a>\n\
\n\
* <a href="https://www.w3.org/WAI/tutorials/images/">W3C Web Accessibility Image Tutorial</a>\n\
\n\
* <a href="http://diagramcenter.org/" target="_resource">Diagram Center</a>\n\
'
  },

  inlineStyleHelp: {
    'menu':  'Character Style',
    'label': 'Character Style',
    'title': 'Character Style Help',
    'content': '\
## Character Style\n\
\n\
### Working with character styles\n\
\n\
* To apply a character style to existing text, select a range of text and then\n\
choose an option from the menu.\n\
\n\
* To apply a character style to text you are about to type, choose an option\n\
from the menu and begin typing. The style will continue to be applied until\n\
you choose another option or move the cursor to a different point in the\n\
document.\n\
\n\
* Multiple character styles can be applied to selected text.\n\
\n\
### About character styles\n\
\n\
* Character styles have a different purpose than paragraph formats. They are\n\
used at a lower level to highlight words or phrases within blocks of text.\n\
\n\
* Character styles, when used properly, help screen reader users better\n\
understand the types and meanings of lower-level stylistic changes within\n\
blocks of text.\n\
\n\
### Character styles vs. headings, lists and paragraph formats\n\
\n\
* Thinking in terms of headings, lists and paragraph formats first, and then\n\
using character styles to emphasize key words or phrases within text blocks,\n\
results in documents that are easier to read and understand.\n\
\n\
* When headings, lists and paragraph formats are considered as primary, and\n\
character styles secondary, many visual styling decisions can be avoided, as\n\
they are already made by default.\n\
\n\
* When character styles are used to change the styling of blocks of text\n\
without regard to whether the block is a heading, list item or other type of\n\
paragraph format, it makes the document more difficult to read and understand\n\
within the context of the website.\n\
\n\
* Using headings, lists, paragraph formats and character styles properly will\n\
make it easier for you to maintain stylistic consistency.\n\
'
  },

  linkHelp: {
    'menu':  'Link',
    'label': 'Link',
    'title': 'Link Help',
    'content' : '\
## Link\n\
\n\
### Display Text\n\
\n\
Providing accessible *Display Text* is straightforward if you keep the following guidelines in mind:\n\
\n\
1. The *Display Text* for a link should describe the target of the link.\n\
\n\
1. Do not use ambiguous text, such as “Click Here” or “More”.\n\
\n\
1. Do not begin the *Display Text* with redundant words or phrases such as “Link” or “Link to”.\n\
\n\
1. Be consistent: Links to the same URL or e-mail address should have the same *Display Text*.\n\
\n\
1. In most cases, it is best not to use the link URL or e-mail address as the *Display Text*.\n\
\n\
### About links\n\
\n\
* Screen reader users often use the “List of Links” feature to identify and navigate to links on a page. When links are presented as a list,  using descriptive *Display Text* becomes even more important since understanding the target of each link no longer benefits from its original context within the document.\n\
\n\
* Screen reader users often use the “Search” feature to find links on a page based on keywords they would expect to find in the *Display Text* of the links. Thus the more descriptive the link *Display Text*, the more effective the search feature will be in finding relevant links.\n\
\n\
* Usable and accessible *Display Text* should be descriptive, unique and start with\n\
keywords (NNG).\n\
\n\
* The *Display Text* for links is like a sign post. It should tell you what\n\
you’ll find when you follow it (NOMENSA).\n\
\n\
### Why links are important\n\
\n\
* Descriptive link text makes it easier for everyone to find and follow links\n\
on a page that are of interest to them.\n\
\n\
* Descriptive link text is especially important for people using screen\n\
readers, who typically only hear the display text spoken to them through speech\n\
synthesis and do not "see" the link in the context of other content on the page.\n\
\n\
* When URLs, e-mail addresses or other ambiguous text are used as the display text for a link, it is impossible in many cases, and much more difficult in the remaining cases, for\n\
screen reader users to find and follow links of interest to them.\n\
\n\
### More information\n\
\n\
* <a href="https://www.nngroup.com/articles/writing-links/" target="_resource">NNG: Writing Hyperlinks: Salient, Descriptive, Start with Keyword</a>\n\
\n\
* <a href="https://www.nomensa.com/blog/2011/writing-good-link-text" target="_resource">NOMENSA: Writing good link text</a>\n\
\n\
* <a href="http://accessibility.umn.edu/core-skills/hyperlinks" target="_resource">Accessible U: Hyperlinks (Good ad Bad Examples)</a>\n\
'
  },

  gettingStarted: {
    'menu':  'Getting Started',
    'label': 'Getting Started',
    'title': 'Getting Started with A11yFirst',
    'content': '\
## Getting Started with A11yFirst\n\
\n\
### What is A11yFirst?\n\
\n\
Before you begin using the A11yFirst editor, it is important to know what\n\
makes it different from other editors. The name *A11yFirst* hints at some\n\
of these differences.\n\
\n\
*A11y* is shorthand for *accessibility* (*a* + 11 letters + *y*), and\n\
accessibility in the context of document authoring is about making the\n\
information that documents contain perceivable and understandable by everyone,\n\
including people with disabilities.</p>\n\
\n\
### Commitment to accessibility\n\
\n\
Your organization, by hosting the A11yFirst editor within its content\n\
management system, has made a commitment to accessibility because (1) it\n\
removes barriers that people with visual, auditory, learning and other\n\
disabilities may experience in their use of web information and communication\n\
technologies and (2) it is required by law.\n\
\n\
By following accessibility guidelines when creating public-facing documents,\n\
you are fulfilling your role in this commitment.\n\
\n\
### Document accessibility\n\
\n\
Some of the main components within a document that are important for\n\
accessibility are:\n\
\n\
* **Headings** — These provide titles for the sections and subsections of content\n\
within your document, as well as a title for the document itself.\n\
\n\
* **Lists** — By using the list feature, the items in a list are grouped together\n\
and information about the grouping can be conveyed to users of assistive\n\
technologies.\n\
\n\
* **Links** — The text component of a link should describe its target, i.e., the\n\
web site, page or section that will be displayed if you activate the link.\n\
\n\
* **Images** — When an image is included within a document, a text alternative\n\
(also known as ‘alt text’) allows screen reader users to obtain a concise\n\
description of the image.\n\
\n\
* **Tables** — By using the table feature to organize tabular data and provide row\n\
and column headers, users of assistive technologies gain the ability to easily\n\
navigate and understand structural relationships within the data.\n\
\n\
### A different way of thinking\n\
\n\
The way you think about the process or workflow of creating and editing\n\
documents can make a significant difference in whether the end result, your\n\
finished document, is accessible.\n\
\n\
For example, rather than thinking about stylistic considerations such as font\n\
sizes and colors first, if you make the structure of your document a primary\n\
consideration, by breaking it down into sections and subsections and giving\n\
each of these a meaningful title, you will end up with a document that will\n\
be easier for all users to navigate and understand, including people with\n\
disabilities.\n\
'
  }

} );
