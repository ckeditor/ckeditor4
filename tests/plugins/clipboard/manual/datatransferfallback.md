@bender-ui: collapsed
@bender-tags: 4.8.0, feature, 468, 962
@bender-ckeditor-plugins: wysiwygarea, toolbar, tableselection, resize, undo, basicstyles, image2, blockquote, list, table, elementspath, clipboard, floatingspace, link

_Open dev console as events are logged there._

## Test D&amp;D and copy/paste (using different content types):
 * internally (same editor),
 * between editors,
 * externally (helpers, MS Word, etc).

## Expected (Chrome, FF, Safari Edge):
 * Events sequence caused by one action (e.g. `drag` -> `drop` -> `paste`) always have the same `DataTransfer id`.
 * `Id storage` (if present) should be `text/html` for `Edge` browser and `cke/id` for other browsers.

## Expected (All):
 * No content lost (e.g. ids of anchors), no crashes, nor errors.
 * In the internal and cross editor D&D, dragged content should be removed.

## Helpers:
 <textarea style="width:90%; height:30px;">
 	Lorem ipsum <b>dolor</b> sit amet <img src="%BASE_PATH%_assets/logo.png" /> elit.
 </textarea>

Lorem ipsum <b>dolor</b> sit <i>amet</i>, consectetur adipiscing elit.
<img height="20" alt="CKEditor logo" src="%BASE_PATH%_assets/logo.png" /> In commodo
vulputate tempor. Sed &lt;b&gt;at elit&lt;/b&gt; vel <a href="foo">ligula mollis</a> aliquet a ac odio.
<pre>Aenean cursus egestas ipsum.</pre>
