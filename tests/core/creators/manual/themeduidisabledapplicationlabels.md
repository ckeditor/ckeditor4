@bender-tags: bug, 4.19.0, 2445
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, basicstyles, floatingspace

**Note** This test is intended to be used with a screen reader.

1. Focus the editor.

	**Expected** The editor is correctly announced.

	**Unexpected** The editor is incorrectly announced or not announced at all.

Sample announcements for the `iframe`-based editor:

* VoiceOver+Chrome: "Editor, wysiwygarea edit text, &lt;content and selection info&gt;. Editor, wysiwygarea, group"
* NVDA+Firefox: "application, Editor, wysiwygarea frame, Editor, wysiwygarea document editable"
* JAWS+Firefox: "Editor, wysiwygarea frame, editor, wysiwygarea edit &lt;content&gt; type and text"

Sample announcements for the `div`-based editor:

* VoiceOver+Chrome: "Editor, divarea edit text &lt;content&gt;. Application."
* NVDA+Firefox: "application, Editor, divarea edit multi line"
* JAWS+Firefox: "Editor, divarea edit, contains text, type and text"
