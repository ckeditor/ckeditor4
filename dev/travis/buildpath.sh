#!/bin/bash
# Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
# CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.

# Return CKEditor build path.

echo "../ckeditor4-presets/build/$(ls -1t ../ckeditor4-presets/build/ | head -n 1)/full-all/ckeditor/"
