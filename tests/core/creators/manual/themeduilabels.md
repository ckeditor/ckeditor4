@bender-tags: bug, 4.19.0, 2445
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, basicstyles, floatingspace

**Note** This test is intended to be used with a screen reader.

1. Focus the editor.

	**Expected** The editor is correctly announced ("Editor hublabubla").

	**Unexpected** The editor is incorrectly announced or not announced at all.

Sample announcements for the `iframe`-based editor:

* VoiceOver: "edit text, &lt;content and selection info&gt;. Editor, wysiwygarea, group"
* NVDA: "Rich Text Editor, wysiwygarea, Editor, wysiwygarea frame, Editor, wysiwygarea document editable"
* JAWS: "Editor, wysiwygarea frame, editor, wysiwygarea edit &lt;content&gt; type and text"

Sample announcements for the `div`-based editor:

* VoiceOver: "Editor, divarea edit text &lt;content&gt;. Rich Text Editor, divarea, application."
* NVDA: "Rich Text Editor, divarea, Editor, divarea edit multi line"
* JAWS: "Editor, divarea edit, contains text, type and text"
