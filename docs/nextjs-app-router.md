# Next.js (App Router)

### Step 1: Add CDN to `app/layout.tsx`

```tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.css" 
        />
      </head>
      <body>
        {children}
        <Script 
          src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
```

### Step 2: In your component:

```tsx
'use client';

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
