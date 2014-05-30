/* bender-tags: editor,unit */

bender.editor = { creator : 'replace' };
bender.test(
{
   'check editor creation not causing host page scroll': function() {
	   var scroll = CKEDITOR.document.getWindow().getScrollPosition();
	   assert.areSame( 0, scroll.y );
   }
} );