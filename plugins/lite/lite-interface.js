/**
Copyright 2015 LoopIndex, This file is part of the Track Changes plugin for CKEditor.

The track changes plugin is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License, version 2, as published by the Free Software Foundation.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with this program as the file lgpl.txt. If not, see http://www.gnu.org/licenses/lgpl.html.

Written by (David *)Frenkiel - https://github.com/imdfl

** Source Version **
**/
var LITE = {
	Events : {
		INIT : "lite:init",
		ACCEPT : "lite:accept",
		REJECT : "lite:reject",
		SHOW_HIDE : "lite:showHide",
		TRACKING : "lite:tracking",
		CHANGE: "lite:change",
		HOVER_IN: "lite:hover-in",
		HOVER_OUT: "lite:hover-out"
	},
	
	Commands : {
		TOGGLE_TRACKING : "lite-toggletracking",
		TOGGLE_SHOW : "lite-toggleshow",
		ACCEPT_ALL : "lite-acceptall",
		REJECT_ALL : "lite-rejectall",
		ACCEPT_ONE : "lite-acceptone",
		REJECT_ONE : "lite-rejectone",
		TOGGLE_TOOLTIPS: "lite-toggletooltips"
	}
};