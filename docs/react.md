# React (Create React App)

### Step 1: Add CDN to `public/index.html`

```html
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.css">
</head>
<body>
  <div id="root"></div>
  <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.js"></script>
</body>
```

### Step 2: In your component:

```jsx
import { useEffect } from 'react';

function Header() {
  useEffect(() => {
    new window.SocialShareButton({
      container: '#share-button'
    });
  }, []);

  return (
    <header>
      <div id="share-button"></div>
    </header>
  );
}

export default Header;
