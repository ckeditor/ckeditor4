#!/bin/bash
# Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license

# Return CKEditor build path.

echo "../ckeditor-presets/build/$(ls -1t ../ckeditor-presets/build/ | head -n 1)/full-all/ckeditor/"
