@bender-tags: link, 4.8.0, 859, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: link,toolbar,wysiwygarea,elementspath,contextmenu,image,table

1. Right-click on the span ("some button text") and select "Edit Link".

**Expected:**
* Link should have class `linkClass`.
* Link should point to `https://www.google.pl`.


1. Double-click on the span ("some button text").

**Excepted:**
* link also should have class and href as above.
