# Troubleshooting

## Multiple buttons appearing

**Cause:** Component re-renders creating duplicate instances

**Solution:** Use `useRef` to track initialization (already in examples above)

---

## Button not appearing

**Cause:** Script loads after component renders

**Solution:** Add null check:
```jsx
if (window.SocialShareButton) {
  new window.SocialShareButton({ container: '#share-button' });
}
```

---

## Modal not opening

**Cause:** CSS not loaded or ID mismatch

**Solution:** 
- Verify CSS CDN link in `<head>`
- Match container ID: `container: '#share-button'` = `<div id="share-button">`

---

## TypeError: SocialShareButton is not a constructor

**Cause:** CDN script not loaded yet

**Solution:** Use interval polling (see Next.js example above)

---

## URL not updating on navigation

**Cause:** Component initialized once, doesn't track routes

**Solution:** Use `updateOptions()` method (see Advanced Usage above)
