# Vanilla JavaScript

## Step 1: Add CDN to `index.html`

```html
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.css">
</head>
<body>
  <div id="share-button"></div>
  <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.js"></script>
</body>
```

## Step 2: Initialize in component

```javascript
new window.SocialShareButton({
  container: '#share-button'
});
```
