# Update URL Dynamically (SPA)

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
