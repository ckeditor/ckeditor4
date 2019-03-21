@bender-tags: memory
@bender-ui: collapsed

## Testing

1. To start test you need to open Chrome with given flags:
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

1. Open dev tools, and switch to memory tab.

1. Take heap snapshot.

1. Create editor with button on page. Destroy after it is created.

1. Force garbage collection - trash icon in dev tools. Take another snapshot.

1. Repeat above two steps few times.

## Options

You can force editor to do simple actions after initialisation, by adding hash to site url.

- Open and close dialog
```memorytest.html#dialog-${dialogName}```
E.g. `memorytest.html#dialog-table`

- Open colorbutton
```memorytest.html#colorbutton```

- Open stylescombo
```memorytest.html#combo```

- Open emoji dropdown
```memorytest.html#emoji```
