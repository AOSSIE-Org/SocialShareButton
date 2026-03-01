# Customization & Configuration

## Basic Options

```jsx
new SocialShareButton({
  container: '#share-button',        // Required: CSS selector or DOM element
  url: 'https://example.com',        // Optional: defaults to window.location.href
  title: 'Custom Title',             // Optional: defaults to document.title
  buttonText: 'Share',               // Optional: button label text
  buttonStyle: 'primary',            // default | primary | compact | icon-only
  theme: 'dark',                     // dark | light
  platforms: ['twitter', 'linkedin'] // Optional: defaults to all platforms
});
```

## All Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | string/Element | - | **Required.** CSS selector or DOM element |
| `url` | string | `window.location.href` | URL to share |
| `title` | string | `document.title` | Share title/headline |
| `description` | string | `''` | Additional description text |
| `hashtags` | array | `[]` | Hashtags for posts (e.g., `['js', 'webdev']`) |
| `via` | string | `''` | Twitter handle (without @) |
| `platforms` | array | All platforms | Platforms to show (see below) |
| `buttonText` | string | `'Share'` | Button label text |
| `buttonStyle` | string | `'default'` | `default`, `primary`, `compact`, `icon-only` |
| `buttonColor` | string | `''` | Custom button background color |
| `buttonHoverColor` | string | `''` | Custom button hover color |
| `customClass` | string | `''` | Additional CSS class for button |
| `theme` | string | `'dark'` | `dark` or `light` |
| `modalPosition` | string | `'center'` | Modal position on screen |
| `showButton` | boolean | `true` | Show/hide the share button |
| `onShare` | function | `null` | Callback when user shares: `(platform, url) => {}` |
| `onCopy` | function | `null` | Callback when user copies link: `(url) => {}` |

**Available Platforms:**  
`whatsapp`, `facebook`, `twitter`, `linkedin`, `telegram`, `reddit`, `email`

## Customize Share Message/Post Text

Control the text that appears when users share to social platforms:

```jsx
new SocialShareButton({
  container: '#share-button',
  url: 'https://myproject.com',
  title: 'Check out my awesome project!',            // Main title/headline
  description: 'An amazing tool for developers',     // Additional description
  hashtags: ['javascript', 'webdev', 'opensource'], // Hashtags included in posts
  via: 'MyProjectHandle'                            // Your Twitter handle
});
```

**How messages are customized per platform:**
- **WhatsApp:** `title` + `description` + `hashtags` + link
- **Facebook:** `title` + `description` + `hashtags` + link
- **Twitter/X:** `title` + `description` + `hashtags` + `via` handle + link
- **Telegram:** `title` + `description` + `hashtags` + link
- **LinkedIn:** `title` + `description` + link
- **Reddit:** `title` - `description` (used as title)
- **Email:** Subject = `title`, Body = `description` + link

## Customize Button Color & Appearance

**Option 1: Use Pre-built Styles** (Easiest)

```jsx
new SocialShareButton({
  container: '#share-button',
  buttonStyle: 'primary'   // or 'default', 'compact', 'icon-only'
});
```

**Option 2: Programmatic Color Customization** (Recommended)

Pass `buttonColor` and `buttonHoverColor` to match your project's color scheme:

```jsx
new SocialShareButton({
  container: '#share-button',
  buttonColor: '#ff6b6b',      // Button background color
  buttonHoverColor: '#ff5252'  // Hover state color
});
```

**Option 3: CSS Class Customization** (Advanced)

For more complex styling, use a custom CSS class:

```jsx
new SocialShareButton({
  container: '#share-button',
  buttonStyle: 'primary',
  customClass: 'my-custom-button'
});
```

Then in your CSS file:

```css
/* Override the button background color */
.my-custom-button.social-share-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Customize hover state */
.my-custom-button.social-share-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
```

**Color Examples:**

```jsx
// Material Design Red
new SocialShareButton({
  container: '#share-button',
  buttonColor: '#f44336',
  buttonHoverColor: '#da190b'
});

// Tailwind Blue
new SocialShareButton({
  container: '#share-button',
  buttonColor: '#3b82f6',
  buttonHoverColor: '#2563eb'
});

// Custom Brand Color
new SocialShareButton({
  container: '#share-button',
  buttonColor: '#your-brand-color',
  buttonHoverColor: '#your-brand-color-dark'
});
```

## Button Styles

| Style | Description |
|-------|-------------|
| `default` | Standard button with icon and text |
| `primary` | Gradient button (recommended) |
| `compact` | Smaller size for tight spaces |
| `icon-only` | Icon without text |
