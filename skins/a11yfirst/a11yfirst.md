# Notes on maintaining the `a11yfirst` skin

This skin is based on the moono-lisa skin with the following file modifications:

## `menu.css`

The following code has been added:

```css
.cke_menubutton_on .cke_menubutton_icon:after {
  content: '✓';
  position: relative;
  left: -0.9em;
  top: .05em;
}
```


## `dialog.css`

```css
/* Adding a border around dialog boxes */
.cke_dialog
{
    border: 1px solid #d1d1d1;
}
```
