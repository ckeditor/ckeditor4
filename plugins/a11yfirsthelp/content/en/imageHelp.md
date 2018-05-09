## Image

### Accessible Description

Providing an *accessible text description* of an image is straightforward if you keep the following guidelines in mind:

1. An **accessible text description** is needed when an image adds additional information to the document. The text description should focus on the informational content of the image rather than its superficial appearance.

1. Careful consideration of the **type of image** you are placing in the document will determine the nature of the accessible description that it requires. There are three image types to choose from: **simple**, **complex** and **decorative**.

### Type of Image

* A **simple** image can be adequately described by a short description, also known as a **text alternative**.

* A **complex** image requires both a **text alternative** and a **long description**, because its informational content is richer and more detailed than that of a simple image.

* A **decorative** image does not add additional information to the document and therefore *does not need an accessible text description*.

* Examples of **decorative** images include icons, borders and corners, an image that is part of a text link, and any image that only adds ambience or visual interest to the document.

### Text Alternative

* A text alternative (short description) should **not** exceed more than 100 characters.

* If an image needs more than 100 characters for its description, please reclassify it as a **complex** image and follow the corresponding accessible description guidelines above.

* The text alternative should avoid redundant words and phrases such as "image of" and "picture of".

* The text alternative should not include information relating to the file name or size of the image.

* The text alternative is added to the `alt` attribute of the `img` element.

### Document includes long description

* Best practices for the **long description** of a **complex** image prescribe that it be placed in the document itself, usually just before or after the image.

* Selecting this option allows you to specify the location of the long description.

* Images of charts can be described by adding a table of the data used to generate the chart.

### Location of long description

* The *Location of long description* option provides information to screen reader users of where they can find a more detailed description of the content of the image within the document.

* This option is only enabled for a complex image, which must have a long description.

* The location information is added to the `title` attribute of the `img` element.

### Include an editable caption

* A **caption** is an optional visual label supported by CKEditor for an image. It provides an additional way to describe an image that is immediately below and proximate to the image.

* The caption content is specified and is editable in the text box just below the image, once it has been inserted in the document.

* From an accessibility perspective the *caption* and the *text alternative* should not be the same, but instead should complement each other.

* In some cases the *caption* may sufficiently describe the purpose of the image, so *Alternative Text* is not needed, or should be used to provide a more detailed description that the *caption*.

* In some cases the *Caption* may be providing detailed information about an image (e.g. the names and rows of people in a group picture), and in this case the *text alternative* should provide a shorter text description of the purpose of the image (e.g. group picture of..).

* Using the caption creates a `figcaption` element contained in a `figure` element.  The `figure` element also contains the `img` element.

### Why it's important

Adding accessible text descriptions of images is an important part of making web pages accessible to the visually impaired who use assistive devices such as screen readers and magnifiers.

When the user cannot see all or part of the image, assistive technologies will read or display the text alternative associated with the image. This is especially important when the image conveys information that is required for the user to fully understand the information on the web page.

The following is some general guidance on writing text alternatives and providing more detailed descriptions:

* Simple images, photos and logos often can be described in less than 100 characters.

* More complex images like graphs, diagrams and charts need both a text alternative and a more detailed description, typically on the same page as the image.

* Purely decorative images do not need a text alternative.

### Writing effective text alternative content

The following are based on <a href="https://webaim.org/">WebAIM's</a> guidelines for writing effective text alternatives:

* **Be accurate and equivalent** in presenting the same content and function of the image.

* When **images are used as links** the text alternative should describe the target of the link.

* **Be succinct.** This means the correct content (if there is content) and function (if there is a function) of the image should be presented as succinctly as is appropriate. Typically no more than a few words are necessary, though rarely a short sentence or two may be appropriate.

* **Do NOT be redundant** or provide the same information as text already part of the page.

* **Do NOT use the phrases "image of ..." or "graphic of ..."** to describe the image. Assistive technologies notify the user of the image.  It is your job to describe the purpose or the content of the image.  If the image is a photograph or illustration, etc. of important content, it may be useful to include this in the text alternative.

* **Do NOT include file names or sizes** as part of the text alternative.

### More information

* <a href="http://accessibility.psu.edu/images/alttext/" target="_resource">Penn State: Image ALT Text</a>

* <a href="https://webaim.org/techniques/alttext/" target="_resource">WebAIM: Alternative Text</a>

* <a href="http://diagramcenter.org/" target="_resource">Diagram Center</a>
