@bender-tags: bug, 4.17.2, 4761
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea

1. Wait for the "Load external editor" button to become enabled.
1. Open console and switch to "Network" tab. Clear it if needed.
1. Click "Load external editor" button and observe incoming requests

 **Expected** All resources have a cache key appended to their URLs.

 **Unexpected** Some resources don't have a cache key appended to their URLs.

## Notes

The test uses a nightly version of the editor if it's not launched from local built version.
