# Callbacks

```jsx
new SocialShareButton({
  container: '#share-button',
  onShare: (platform, url) => {
    console.log(`Shared on ${platform}: ${url}`);
  },
  onCopy: (url) => {
    console.log('Link copied:', url);
  }
});
```