@bender-tags: notification, tc, 4.5.0
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, notificationaggregator

---

## Weight

1. Click the "Init aggregator" button.
	* Notification should appear, "Loading 0 of 3... 0%".
1. Click the "Finish task 1" button.
	* Notification should indicate progress, 10%, 1/3.
1. Click the "Finish task 2" button.
	* Notification should indicate progress, 40%, 2/3.
1. Click the "Finishtask 3" button.
	* Should dissappear, as loading is done.


Feel free to change the order of steeps 2-4

**ProTip:** You can mess around with the tasks using console, (once aggregator is inited) they're in global `tasks` variable.