@bender-tags: 4.5.0, tc
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, undo, basicstyles, notificationaggregator

---

## Default (hide)

1. Click the "Default (hiding)" button.
	* Notification should appear, and should increase the progress.

**Expected:**  When the process is completed, notification should disappear instantly.

---

## Permanent

1. Click the "Progress permanent" button.
	* Notification should appear, and should increase the progress.

**Expected:** As the progress reaches 100% it should remain there with 100%.

---

## Success follow-up

1. Click the "Progress with a success follow-up" button.
	* Notification should appear, and should increase the progress.

**Expected:**

As loading is done:

* Progress notification dissapears.
* New successs notification is shown.