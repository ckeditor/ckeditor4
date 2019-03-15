@bender-tags: memory
@bender-ui: collapsed

To start test you need to open Chrome with given flags:
`--enable-precise-memory-info`, `--disable-extensions`, `--disable-plugins`, `--incognito`

And open page:
`your-workspace/ckeditor-dev/tests/_assets/memorytest.html`

Example terminal command for macOS with CKEditor workspace served on `localhost:5000`:

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
--enable-precise-memory-info \
--disable-extensions \
--disable-plugins \
--incognito \
http://localhost:5000/ckeditor-dev/tests/_assets/memorytest.html
```
