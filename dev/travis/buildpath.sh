#!/bin/bash
# Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
# For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license

# Return CKEditor build path.

echo "../ckeditor4-presets/build/$(ls -1t ../ckeditor4-presets/build/ | head -n 1)/full-all/ckeditor/"
