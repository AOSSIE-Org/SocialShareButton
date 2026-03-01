# Next.js (Pages Router)

## Step 1: Add CDN to `pages/_document.tsx`

```tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.css" 
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.js"></script>
      </body>
    </Html>
  );
}
```

## Step 2: In your component:

```tsx
import { useEffect } from 'react';

export default function Header() {
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
```
