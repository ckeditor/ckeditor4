@bender-tags: feature, 4.13.0, 835, pastefromgdocs
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, pastefromgdocs, sourcearea, elementspath, basicstyles, format, link, image2, autolink, colorbutton, stylescombo, font, justify, pagebreak, list, liststyle, tabletools, floatingspace

Perform these steps for every editor:

1. Copy fragment of the list from ([sample document](https://docs.google.com/document/d/16FzWewfwvdM-tafqnEmbbX6tWIpB30ttA_4gqWM9yDk/edit?usp=sharing)).

	**Note:** although older IEs (below version 11) are not supported by Google Docs, you can open the document in supported browser and copy the content from it.
2. Paste it into the editor.

### Expected

Pasted list has the same nesting as the source one.

**Note:** if the first item in the copied list is nested, it should become the list item at the root level, without nesting. All other elements should be nested in relation to the first element.

### Unexpected

* Pasted list is nested in some different way.
* There are several empty list items/lists at the beginning.
