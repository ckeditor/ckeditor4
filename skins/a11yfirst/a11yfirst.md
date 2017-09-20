# Notes on maintaining the `a11yfirst` skin

This skin is based on the moono-lisa skin with the following file modifications:

## `menu.css`

The following code has been added:

```css
/* Use checkmark as menubutton icon to indicate active item */
.cke_menubutton_on .cke_menubutton_icon:after {
  content: '✓';
  font-weight: bold;
  font-size: 110%;
  position: relative;
  left: -0.9em;
  top: .05em;
}

/* Make disabled menubutton items appear slightly darker */
.cke_menubutton_disabled .cke_menubutton_label {
  opacity: 0.4;
  filter: alpha(opacity=40);
}
```

## `dialog.css`

The following code has been added:

```css
/* Add border to dialog box */
.cke_dialog
{
    border: 1px solid #d1d1d1;
}
```
