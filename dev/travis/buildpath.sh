#!/bin/bash
# Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
# For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license

# Return CKEditor build path.

echo "../ckeditor4-presets/build/$(ls -1t ../ckeditor4-presets/build/ | head -n 1)/full-all/ckeditor/"
