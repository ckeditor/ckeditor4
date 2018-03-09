## Image

### Image Type

Providing accessible *Display Text* is straightforward if you keep the following guidelines in mind:

1. **Decorative** image is an icon, *"eye candy"* or some other type of image that does not contribute informative content on the page and no *Alernative Text* is needed.

1. **Simple** image provides additional information to the page that can be described with *Alternative Text*.

1. **Complex** image indicates the page contains a more detailed description of the imageand whether the description is before and/or after the image on the page.  Complex images also need *alternative text*.

### Alternative Text

* Alternative text should **not** exceed more than 100 characters.

* If an image needs more than 100 character description include a description of the image in the page and use the *Description Location* to indicate if the description is before and/or after the image.

* The alternative text option disabled when the image type "Decorative" is selected.

* The alternative text is added to the `alt` attribute of the `img` element.


### Description Location

* The *Description Location* provides information to screen reader users of where thy can find a more detailed description of the content of the imageon the current page.

* Images of charts can be described by adding a table of the data used to generate the chart in the page.

* This option is only enabled when the image type "Complex" is selected.

* The location information is added to the `title` attribute of the `img` element.

### Why it's important

Adding alternative text to images is an important part of making web pages accessible to the visually impaired who use assistive devices including screen readers and screen magnifiers.   When the user cannot see all or part of the image, assistive technologies will read or display the alternative text that is associated with the image.   This is especially important when the image conveys information that is required for the user to fully understand the information on the web page.  The following is some general guidance on writing alternative text and providing more detailed descriptions.

* Simple images, photos and icons often can be described in less than 100 characters.

* More complex images like graphs, diagrams and charts need both alternative text and a more detailed description, typically on the same page as the image.

* Purely decorative images do not need any alternative text

### Writing Effective Alernative Text content

The following are based on <a href="https://webaim.org/">WebAIM's</a> writing effective alternative text:

* **Be accurate and equivalent** in presenting the same content and function of the image.

* When **images are used as links** the alternative text should describe the target of the link.

* **Be succinct.** This means the correct content (if there is content) and function (if there is a function) of the image should be presented as succinctly as is appropriate. Typically no more than a few words are necessary, though rarely a short sentence or two may be appropriate.

*  **Do NOT be redundant** or provide the same information as text already part of the page.

*  **Do NOT use the phrases "image of ..." or "graphic of ..."** to describe the image. Assistive technologies notify the user of the image.  It is your job to descibe the purpose or the content of the image.  If the image is a photograph or illustration, etc. of important content, it may be useful to include this in alternative text.

* **Do NOT include filenames or file size** as part of the alterniatve text.

### More information

* <a href="http://accessibility.psu.edu/images/alttext/" target="_resource">Penn State: Image ALT Text</a>

* <a href="https://webaim.org/techniques/alttext/" target="_resource">WebAIM: Alternative Text</a>

* <a href="http://diagramcenter.org/" target="_resource">Diagram Center</a>

