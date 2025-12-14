---
title: Building the Signature Page
description: Turning a portfolio into a place to leave a mark.
slug: signature-page
date: 2025-10-26
---

When I finished the main pages of the site, it still felt a bit too static. A portfolio shows who you are, but I wanted a place where people could leave something of their own. That idea slowly turned into the **Signature** page.

Instead of a classic guestbook with text inputs, I decided to let people draw their actual signatures. The page uses `next-auth` to identify the current user and Firebase to store every signature as a base64-encoded PNG together with the author name and timestamp.

The main `Signature` page loads all signatures from Firebase, sorts them by timestamp and shows them in small cards. The list is paginated: first 10 entries are visible, and a “Show More” button loads the next batch without reloading the page. Each user can have only one signature: if you are signed in and your name is already in the list, the “Create Signature” button is hidden.

The drawing happens on a `<canvas>` element. Mouse events (`mousedown`, `mousemove`, `mouseup`) are used to track the stroke and draw smooth lines with round caps and joins. Every finished stroke is saved into an in‑memory history array as a data URL, which makes it possible to implement a simple `Ctrl+Z` undo by restoring the previous canvas state.

When the user clicks “Accept Signature”, the canvas is converted to a PNG data URL, stripped to a base64 string and saved to Firebase together with the user name and current ISO timestamp. On the frontend, the new signature is immediately added to the top of the list, so the user sees the result without waiting for a full reload.

Each signature card renders the stored image via a `data:image/png;base64,...` source and shows the author’s name with a formatted date. If the current user is the owner of the signature, a small trash icon appears; clicking it calls a Firebase helper that deletes the record by name and updates the local list.

To smooth out the loading state, the page shows a couple of skeleton cards while the initial request to Firebase is in progress. This keeps the layout stable and visually explains that the content is being fetched instead of leaving an empty page.

In the end, this page turned a simple portfolio into a place where visitors can literally leave their mark. It mixes authentication, realtime-like updates and a small drawing tool into something that feels personal and a bit nostalgic.
