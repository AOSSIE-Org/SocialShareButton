# Demo Video Instructions for Framework Integrations

This guide explains how contributors should create a demo video showing framework integration with the **Social Share Button** library.

These videos help other developers understand how to integrate the library with different frameworks such as **React, Next.js, Vue, Angular, Qwik, SolidJS**, etc.

---



## 🎥 Demo Video Requirements

Contributors must follow these requirements when creating the demo video:

- **Duration:** ≤ 150 seconds
- Demonstrate the **framework integration process**
- Show the **setup inside the codebase**
- Demonstrate the **share button rendering correctly on localhost**
- Upload the video to **Google Drive, YouTube, or any platform with public access**
- The video will later be uploaded to the **AOSSIE YouTube channel**
- Add the **public video link to the README demo section**

---



## 📌 What the Video Should Show
The demo video should clearly demonstrate the following steps.


### 1. Repository Setup
Show the repository where the integration is implemented.

You may use:
- A repository from **AOSSIE-Org (preferred)**  
- Or an external demo repository if needed

---


### 2. Framework Integration
Show how the **Social Share Button** is integrated into the framework.

This should include:

- Importing or including the library
- Adding the framework wrapper
- Using the share button inside a component or page

---


### 3. Code Walkthrough
Show the code added for the framework integration.

For example:

```
social-share-button-qwik.js
social-share-button-solid.js
social-share-button-react.js
```



Briefly explain how the wrapper connects the framework with the Social Share Button library.

---



## 🧰 Use Official Framework Starters

For testing and demo purposes, contributors should prefer using the **official framework starter templates**.  
These starters generate a **clean project structure with minimal configuration**, which makes the integration easier to demonstrate.

Examples:

### Qwik
```
npm create qwik@latest
npm install
npm run dev
```

### Preact
```
npm create preact@latest
```

### Remix
```
npx create-remix@latest
```

### SolidJS
```
npx degit solidjs/templates/js my-app
```

### Rails
```
rails new my-app
```

### Django
```
django-admin startproject myapp
```

Contributors may use similar official starter commands for other frameworks if needed.



### 4. Running the Project

Run the project locally and demonstrate the button rendering.

Example commands:

```
npm install
npm run dev
```


Then open the browser and show the working result:
```
http://localhost:5173
```



The share buttons should render correctly on the page.

---



## ⚠️ Important Note for PR Testing

In many cases, the **new wrapper code only exists in the contributor’s PR branch** and is **not yet included in the released CDN version (for example v1.0.3)**.

If the released CDN version is used, the demo may load **older library code**, which can cause the integration demo to fail.

Therefore, for **testing and demo video recording**, contributors should use **jsDelivr with their branch name**.

Their new wrapper code (e.g., social-share-button-qwik.js) only exists in their PR branch — not in the published v1.0.3 CDN tag.
---



## 🌐 Use jsDelivr for Demo Videos

Use the following CDN format:

```html
<!-- Replace GITHUB_USERNAME and BRANCH_NAME below -->

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/GITHUB_USERNAME/SocialShareButton@BRANCH_NAME/src/social-share-button.css">

<script src="https://cdn.jsdelivr.net/gh/GITHUB_USERNAME/SocialShareButton@BRANCH_NAME/src/social-share-button.js"></script>


✅ Example

Example for the Qwik integration branch:

GITHUB_USERNAME: aashnaachaudhary10
BRANCH_NAME: feat/qwik-integration
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/aashnaachaudhary10/SocialShareButton@feat/qwik-integration/src/social-share-button.css">
<script src="https://cdn.jsdelivr.net/gh/aashnaachaudhary10/SocialShareButton@feat/qwik-integration/src/social-share-button.js"></script>

This ensures that the demo loads the latest code directly from the contributor's branch.





📹 Reference Demo

Next.js App Router Example:

https://youtu.be/cLJaT-8rEvQ

Contributors may follow a similar format when creating their framework integration demos.





✅ Final Checklist

Before submitting your PR, ensure that:

- [ ] Demo video created (≤150 seconds)
- [ ] Integration setup shown
- [ ] Code walkthrough included
- [ ] Button rendering shown on localhost
- [ ] Video uploaded with public access
- [ ] Video link added to the README demo section