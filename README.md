# CKEditor 4 - The best browser-based WYSIWYG editor

[![devDependencies Status](https://david-dm.org/ckeditor/ckeditor-dev/dev-status.svg)](https://david-dm.org/ckeditor/ckeditor-dev?type=dev)

This repository contains the development version of CKEditor 4.

**Attention:** The code in this repository should be used locally and for
development purposes only. We do not recommend using it in production environment
because the user experience will be very limited. For that purpose, you should
either build the editor (see below) or use an official release available on the
[CKEditor website](https://ckeditor.com/ckeditor-4/).

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
installation. Visit [CKEditor 4 SDK](https://sdk.ckeditor.com/) for plenty of samples
showcasing numerous editor features, with source code readily available to view, copy
and use in your own solution.

## Code Structure

The development code contains the following main elements:

  - Main coding folders:
    - `core/` &ndash; The core API of CKEditor 4. Alone, it does nothing, but
    it provides the entire JavaScript API that makes the magic happen.
    - `plugins/` &ndash; Contains most of the plugins maintained by the CKEditor 4 core team.
    - `skin/` &ndash; Contains the official default skin of CKEditor 4.
    - `dev/` &ndash; Contains some developer tools.
    - `tests/` &ndash; Contains the CKEditor 4 tests suite.

## Building a Release

A release-optimized version of the development code can be easily created
locally. The `dev/builder/build.sh` script can be used for that purpose:

	> ./dev/builder/build.sh

A "release ready" working copy of your development code will be built in the new
`dev/builder/release/` folder. An Internet connection is necessary to run the
builder, for its first time at least.

## Testing Environment

Read more on how to set up the environment and execute tests in the [CKEditor 4 Testing Environment](https://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_tests) guide.

## Reporting Issues

Please use the [CKEditor 4 GitHub issue page](https://github.com/ckeditor/ckeditor-dev/issues) to report bugs and feature requests.

## License

Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.

For licensing, see LICENSE.md or [https://ckeditor.com/legal/ckeditor-oss-license](https://ckeditor.com/legal/ckeditor-oss-license)
