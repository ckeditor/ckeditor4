CKEditor 4 - The best browser-based WYSIWYG editor
==================================================

## TAO Fork considerations

### Version

Change the version  before buidling into `dev/builder/build.sh` and modify the `VERSION` bash variable.
Keep the CK versioning and append the TAO build version.

For example :

```sh
VERSION="4.4.7 DEV"
```

Becomes

```sh
VERSION="4.4.7 TAO-1"
```

Then

```sh
VERSION="4.4.7 TAO-2"
```


### Build

```sh
cd dev/builder
./build.sh
sudo php oneFile.php
```

The release is located under `release/ckeditor-reduced`. The complete folder can be copied into into `lib/ckeditor/` of [`@oat-sa/tao-core-libs`](https://github.com/oat-sa/tao-core-libs-fe)

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
- Once compiled, copy the css files from `tao-core-ui-fe/css/ckeditor/skins/tao/*` into the [`skins/tao/`](https://github.com/oat-sa/ckeditor-dev/tree/develop/skins/tao) folder folder of this repository. This will avoid accidental override of the skin when moving a new CK build into TAO.
  
## Development Code

This repository contains the development version of CKEditor.

**Attention:** The code in this repository should be used locally and for
development purposes only. We do not recommend using it in production environment
because the user experience will be very limited. For that purpose, you should
either build the editor (see below) or use an official release available on the
[CKEditor website](http://ckeditor.com).

## Code Installation

There is no special installation procedure to install the development code.
Simply clone it to any local directory and you are set.

## Available Branches

This repository contains the following branches:

  - **master** &ndash; Development of the upcoming minor release.
  - **major** &ndash; Development of the upcoming major release.
  - **stable** &ndash; Latest stable release tag point (non-beta).
  - **latest** &ndash; Latest release tag point (including betas).
  - **release/A.B.x** (e.g. 4.0.x, 4.1.x) &ndash; Release freeze, tests and tagging.
    Hotfixing.

Note that both **master** and **major** are under heavy development. Their
code did not pass the release testing phase, though, so it may be unstable.

Additionally, all releases have their respective tags in the following form: 4.4.0,
4.4.1, etc.

## Samples

The `samples/` folder contains some examples that can be used to test your
installation. Visit [CKEditor SDK](http://sdk.ckeditor.com/) for plenty of samples
showcasing numerous editor features, with source code readily available to view, copy
and use in your own solution.

## Code Structure

The development code contains the following main elements:

  - Main coding folders:
    - `core/` &ndash; The core API of CKEditor. Alone, it does nothing, but
    it provides the entire JavaScript API that makes the magic happen.
    - `plugins/` &ndash; Contains most of the plugins maintained by the CKEditor core team.
    - `skin/` &ndash; Contains the official default skin of CKEditor.
    - `dev/` &ndash; Contains some developer tools.
    - `tests/` &ndash; Contains the CKEditor tests suite.

## Building a Release

A release-optimized version of the development code can be easily created
locally. The `dev/builder/build.sh` script can be used for that purpose:

	> ./dev/builder/build.sh

A "release ready" working copy of your development code will be built in the new
`dev/builder/release/` folder. An Internet connection is necessary to run the
builder, for its first time at least.

## Testing Environment

Read more on how to set up the environment and execute tests in the [CKEditor Testing Environment](http://docs.ckeditor.com/#!/guide/dev_tests) guide.

## Reporting Issues

Please use the [CKEditor Developer Center](https://dev.ckeditor.com/) to report bugs and feature requests.

## License

Licensed under the GPL, LGPL and MPL licenses, at your choice.

For full details about the license please check the LICENSE.md file.
