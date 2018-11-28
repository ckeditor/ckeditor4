## Image

### Overview

* People with visual impairments or visual processing disorders need accessible text descriptions of informative images.

* Effective text descriptions of informative images can determine the extent to which readers comprehend your document.

### Type of Image

* An **informative** image adds informational content to the document, and therefore requires at least a short text alternative.

* A **decorative** image does not add information to the document, and therefore does not require a text alternative.

### Accessible Descriptions

An accessible description for an image is a text alternative that accurately presents the informational content of the image.

There are two types of accessible descriptions:

1. A **short description** briefly describes the main purpose or content of an informative image.
1. A **long description** provides a more detailed description of the information or data contained in a complex image.

### Short description

* Each informative image, regardless of its complexity, requires a short description, which you provide in the **Short description** field.

* The short description is added to the `alt` attribute of the `img` element. Its length is typically no more than 100 characters.

* There is more information below on writing an effective short description.

### Long descriptions for complex images

* A complex image has informational content that cannot be described adequately with a short description.

* Examples of complex images include charts, graphs, diagrams, scientific photographs and works of art.

* A complex image needs both a short description and a longer, more detailed description.

* If an image is informationally complex, accessibility requirements mandate that the additional long description be placed within the document adjacent to the image.

### Adding a long description

Follow these three steps when adding a long description of an image:

1. Add an adequately detailed description of the image within the document, either just before or after the image (or both).

1. Select the checkbox labeled **A long description is included in the document**.

1. Select the appropriate option for **Location of long description**.

By specifying the location of the long description relative to the image, this information can be made available to screen reader users.

### Insert an editable caption below the image

* A **caption** is an optional visual label supported by CKEditor for an image. It provides an additional way to describe an image that is immediately below and proximate to the image.

* The caption content is specified and is editable in the text box just below the image, once it has been inserted in the document.

* From an accessibility perspective the *caption* and the *short description* should not be the same, but instead should complement each other.

* Using the caption creates a `figcaption` element contained in a `figure` element.  The `figure` element also contains the `img` element.

### Why image descriptions are important

Adding accessible text descriptions of images, a.k.a. text alternatives, is an important part of making documents accessible to the visually impaired who use assistive devices such as screen readers and magnifiers, and to people with visual processing disorders, which make especially complex images more difficult to understand.

When the user cannot see all or part of the image, assistive technologies will read or display the short text description associated with the image. This is especially important when the image conveys information that is required for the user to fully understand the information in the document.

For people with visual processing disorders, the long description of a complex image helps them to more quickly or completely understand the information being conveyed by the image.

### Tips for writing an effective short description

The following are based on <a href="https://webaim.org/">WebAIM's</a> guidelines for writing effective short descriptions:

* **Be accurate and equivalent** in presenting the same *content* and *function* of the image.

* When **images are used as links** the short description should describe the target of the link.

* **Be succinct.** This means the correct content and function of the image should be presented as succinctly as is appropriate. Typically no more than a few words are necessary, though rarely a short sentence or two may be appropriate. The length should not exceed 100 characters.

* **Do NOT be redundant** or provide the same information as text that is already part of the document.

* **Do NOT use the phrases "image of ..." or "graphic of ..."** to describe the image. Assistive technologies notify the user of the image.  It is your job to describe the purpose or the content of the image.  If the image is a photograph or illustration, etc. of important content, it may be useful to include this in the short description.

* **Do NOT include file names or sizes** as part of the short description.

### More about captions

* In some cases, where the caption sufficiently describes the purpose of the image, it may not be necessary to provide a short description. Alternatively, it may be useful to use the short description to provide a slightly more detailed description than the caption.

* In other cases the caption may be providing detailed information about an image (e.g. the names of people listed by row in a group picture), whereby the short description should provide a shorter text description of the purpose of the image (e.g. group picture of ...).

### More information

* <a href="http://accessibility.psu.edu/images/alttext/" target="_resource">Penn State: Image ALT Text</a>

* <a href="https://webaim.org/techniques/alttext/" target="_resource">WebAIM: Alternative Text</a>

* <a href="https://www.w3.org/WAI/tutorials/images/">W3C Web Accessibility Image Tutorial</a>

* <a href="http://diagramcenter.org/" target="_resource">Diagram Center</a>
