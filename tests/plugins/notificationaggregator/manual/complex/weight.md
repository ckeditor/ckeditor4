@bender-tags: 4.5.0, tc
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, notificationaggregator

---

## Weight

1. Click the "Init aggregator" button.
	* Notification should appear, "Loading 0 of 3... 0%".
1. Click the "Close task 1" button.
	* Notification should indicate progress, 10%, 1/3.
1. Click the "Close task 2" button.
	* Notification should indicate progress, 40%, 2/3.
1. Click the "Close task 3" button.
	* Should dissappear, as loading is done.


Feel free to change the order of steeps 2-4