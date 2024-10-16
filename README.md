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
installation. Visit [CKEditor 4 Examples](https://ckeditor.com/docs/ckeditor4/latest/examples/index.html) for plenty of samples
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

### Note:
> While building this release on local, please make sure that your Nodejs version is not greater than 12. Otherwise, the generated release will have the ES6 code, and ES6 code breaks loading of some plugins like codesnippet.

A release-optimized version of the development code can be easily created
locally. The `dev/builder/build.sh` script can be used for that purpose:

	> ./dev/builder/build.sh

A "release ready" working copy of your development code will be built in the new
`dev/builder/release/` folder. An Internet connection is necessary to run the
builder, for its first time at least.

## Testing Changes in Local

Here are steps on how to locally test your code changes in this repo.

**Note** :- Here, the example steps are added in context to its integration with [Candidate Site](http://github.com/interviewstreet/candidate-site-frontend). This example can be extended to other repositories as well.

1. Clone this repo
2. `cd` into the directory and enter the build command (`./dev/builder/build.sh`) in the root of the folder, a new release will be created in `ckeditor-dev/dev/builder/release/` and the name of the new release folder name is `ckeditor`
3. Make sure you are in the root of this directory and enter the command to serve the newly released folder through your localhost
`python3 -m http.server <port> -d ./dev/builder/release/`
4. Replace `<port>` with the port you want to serve in localhost. e.g. `3333`
5. Replace `CKEDITOR_CDN_URL` from hackerrank cdn to your localhost url. Example:
`export const CKEDITOR_CDN_URL = 'http://localhost:<port>/ckeditor/ckeditor.js';` which will be present in a file similar to [this](https://github.com/interviewstreet/candidate-site-frontend/blob/master/src/shared/constants.js) in your respective repositories.
6. Make sure your devspace is running and, open a page in your private node where you get to see the editor(served from your localhost) in action.

**Note** :- After making any code changes, you need to follow the above steps, starting from step-2 and for each change you made, follow one iteration of the above steps.

## CICD for ckeditor-dev

The jenkins job for building and deploying ckeditor-dev in private and production environments can be found [here](https://jenkins.adminext.hackerrank.link/job/ckeditor-dev/job/ckeditor/)


Private: 
1. For private environment, build artifacts are deployed in [hackerrank-private-cdn](https://us-east-1.console.aws.amazon.com/s3/buckets/hackerrank-private-cdn?region=us-east-1&bucketType=general&prefix=ckeditor-dev/&showversions=false) S3 bucket. 
2. The pipeline would deploy to private only when 2 conditions are met:
  - The version name in package.json file contains `-beta` suffix. If for PR builds , `-beta` suffix is absent, all the further stages are skipped.
  - It should be a change request i.e. a PR. The pipeline should run on a PR. 
3. In case a build with same version name already exists, it will be overriden. 
4. The artifact can be accessed on this URL https://d1ncy0v3du7k5q.cloudfront.net/ckeditor-dev/VERSION/ckeditor.js 

Production: 
1. For production environment, build artifacts are deployed on the cdn `nano` server. 
2. The pipeline would deploy to production only when 3 conditions are met:
  - The version name in package.json file does not contain `-beta` suffix. 
  - It should be a master build. 
  - The same version should not already exist on the nano server. 
  In any of the above situations the pipeline would error out/deemed unstable. 
3. The artifact can be accessed on this URL https://hrcdn.net/ckeditor/VERSION/ckeditor.js


## Testing Environment

Read more on how to set up the environment and execute tests in the [CKEditor 4 Testing Environment](https://ckeditor.com/docs/ckeditor4/latest/guide/dev_tests.html) guide.

## Reporting Issues

Please use the [CKEditor 4 GitHub issue page](https://github.com/ckeditor/ckeditor-dev/issues) to report bugs and feature requests.

## License

Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.

For licensing, see LICENSE.md or [https://ckeditor.com/legal/ckeditor-oss-license](https://ckeditor.com/legal/ckeditor-oss-license)
