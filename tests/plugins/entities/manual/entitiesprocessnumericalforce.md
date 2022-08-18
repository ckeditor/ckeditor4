@bender-tags: bug, 4.20.0, 4941
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, entities, sourcearea

1. Open the source mode.

**Expected** Named entities was converted to a numerical HTML entities: `&#160; &#62; &#60; &#38; &#34;`.

**Unexpected** Entities was not converted: `&nbsp; &gt; &lt; &amp; &quot;`.

