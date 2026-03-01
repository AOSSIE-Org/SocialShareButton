# Update URL Dynamically (SPA)

**Note:** This example requires obtaining the `pathname` variable from your router. The approach depends on your framework:

- **Next.js (App Router):** `import { usePathname } from 'next/navigation'; const pathname = usePathname();`
- **React Router:** `import { useLocation } from 'react-router-dom'; const { pathname } = useLocation();`
- **Other frameworks:** Use your framework's routing hook to access the current path

```jsx
const shareButton = useRef(null);

useEffect(() => {
  shareButton.current = new window.SocialShareButton({ 
    container: '#share-button' 
  });
}, []);

useEffect(() => {
  if (shareButton.current) {
    shareButton.current.updateOptions({ 
      url: window.location.href 
    });
  }
}, [pathname]); // Update on route change
```
