CKEditor 4 - The best browser-based WYSIWYG editor
==================================================

## TAO Fork considerations

### Version

Change the version  before buidling into `dev/builder/build.sh` and modify the `VERSION` bash variable.
Keep the CK versioning and append the TAO build version.

For example :

```sh
VERSION="4.14.1 DEV"
```

Becomes

```sh
VERSION="4.14.1 TAO-1"
```

Then

```sh
VERSION="4.14.1 TAO-2"
```


### Build

```sh
cd dev/builder
./build.sh
```

The release is located under `dev/builder/release/ckeditor`.
The complete folder must be copied into `lib/ckeditor/` of [`@oat-sa/tao-core-shared-libs`](https://github.com/oat-sa/tao-core-shared-libs-fe)

The built versions checksums aren't identical because the source code contains timestamps generated at build time.


### Development for TAO

#### CK Playground
- To use the uncompiled version of CK for development purposes, please revert the hack in the file `core/scriptloader`:
    - `git checkout f8daebc8e69c4ee216455f9b20134890aab3e4b8 -- core/scriptloader.js `
- Set it back before rebuilding.
    - `git checkout develop -- core/scriptloader.js`

#### TAO Skin
- If you need to modify TAO skin, you'll find the SASS source files in [`@oat-sa/tao-core-ui-fe`](https://github.com/oat-sa/tao-core-ui-fe/tree/master/scss/ckeditor/skins/tao/scss). They are not in this repo.
- To compile, use the grunt task `npm run buildScss`
- Once compiled, copy the css files from `tao-core-ui-fe/css/ckeditor/skins/tao/*` into the [`skins/tao/`](https://github.com/oat-sa/ckeditor-dev/tree/develop/skins/tao) folder of this repository. This will avoid accidental override of the skin when moving a new CK build into TAO.

### Update
To keep CKEditor up-to-date folow the next [instruction](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork)

## Development Code

Find out more in the [Browser Compatibility guide](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_browsers.html#officially-supported-browsers).

---

## Working with the `ckeditor4` repostiory

**Attention**: The code in this repository should be used locally and for development purposes only. We do not recommend using it in a production environment because the user experience will be very limited.

### Code installation

There is no special installation procedure to install the development code.
Simply clone it to any local directory and you are set.

### Available branches

This repository contains the following branches:

  - **`master`** &ndash; Development of the upcoming minor release.
  - **`major`** &ndash; Development of the upcoming major release.
  - **`stable`** &ndash; Latest stable release tag point (non-beta).
  - **`latest`** &ndash; Latest release tag point (including betas).
  - **`release/A.B.x`** (e.g. `4.0.x`, `4.1.x`) &ndash; Release freeze, tests and tagging. Hotfixing.

Note that both `master` and `major` are under heavy development. Their code did not pass the release testing phase, though, so it may be unstable.

Additionally, all releases have their respective tags in the following form: `4.4.0`, `4.4.1`, etc.

### Samples

The `samples/` folder contains some examples that can be used to test your installation. Visit [CKEditor 4 Examples](https://ckeditor.com/docs/ckeditor4/latest/examples/index.html) for plenty of samples showcasing numerous editor features, with source code readily available to view, copy and use in your own solution.

### Code structure

The development code contains the following main elements:

  - Main coding folders:
    - `core/` &ndash; The core API of CKEditor 4. Alone, it does nothing, but it provides the entire JavaScript API that makes the magic happen.
    - `plugins/` &ndash; Contains most of the plugins maintained by the CKEditor 4 core team.
    - `skin/` &ndash; Contains the official default skin of CKEditor 4.
    - `dev/` &ndash; Contains some developer tools.
    - `tests/` &ndash; Contains the CKEditor 4 tests suite.

### Building a release

A release-optimized version of the development code can be easily created locally. The `dev/builder/build.sh` script can be used for that purpose:

	> ./dev/builder/build.sh

A "release-ready" working copy of your development code will be built in the new `dev/builder/release/` folder. An Internet connection is necessary to run the builder, for the first time at least.

### Testing environment

Read more on how to set up the environment and execute tests in the [CKEditor 4 Testing Environment](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_tests.html) guide.

### Reporting issues

Use the [CKEditor 4 GitHub issue page](https://github.com/ckeditor/ckeditor4/issues) to report bugs and feature requests.

### License

Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.

For licensing, see LICENSE.md or [https://ckeditor.com/legal/ckeditor-oss-license](https://ckeditor.com/legal/ckeditor-oss-license)
