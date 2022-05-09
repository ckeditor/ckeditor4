@bender-tags: bug, 4.19.0, 2445
@bender-ui: collapsed
@bender-ckeditor-plugins: toolbar, wysiwygarea, basicstyles, floatingspace

**Note** This test is intended to be used with a screen reader.

1. Focus the editor.

	**Expected** The editor is correctly announced.

	**Unexpected** The editor is incorrectly announced or not announced at all.

Sample announcements for the `iframe`-based editor:

* VoiceOver+Chrome: "Horse edit text, &lt;content and selection info&gt;. Horse, group"
* NVDA+Firefox: "Mouse, Horse frame, Horse document editable"
* JAWS+Firefox: "Mouse, Horse frame, Horse edit &lt;content&gt; type and text"

Sample announcements for the `div`-based editor:

* VoiceOver+Chrome: "Donkey edit text &lt;content&gt;. Snake, application."
* NVDA+Firefox: "Snake, Donkey edit multi line"
* JAWS+Firefox: "Snake, Donkey edit, contains text, type and text"
