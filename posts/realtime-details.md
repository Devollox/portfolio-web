---
title: Real-time in a portfolio
description: How small live features turn a static portfolio into a living app.
slug: realtime-details
date: 2025-12-11
---

Most portfolios behave like static business cards: some text, a few screenshots, a couple of links. For this project, the goal was to also show how the interface behaves _in the moment_ — when several people land on the site at the same time. To do that, a few small real-time details were added on top of the usual pages: live cursors, presence counters, and synced interactions.

## Live presence on About

The About page has a thin layer of social presence. When someone visits it, small cursor markers appear on top of the layout, similar to what you would expect from tools like Figma or online whiteboards. They never block the text or scrolling, but they make it clear that you are not the only person exploring the page.

Technically, this is a room-based presence system that listens for cursor updates and keeps a shared list of active peers. Each client publishes throttled cursor events and subscribes to updates from others.

## Synchronized signatures

On the Signature page, multiple people can sign at the same time. When a new stroke is added to the canvas on one screen, it appears on everyone else’s screens in real time — no reload, no manual refresh. For visitors, the page feels like a lightweight collaborative wall dedicated to signatures rather than a static gallery.

Under the hood, each signature has an id, a list of points, and some metadata that gets sent over a real-time channel and stored in a backing store. Clients subscribe to changes: when a signature is created or removed, the updated state is broadcast to all connected users.

## Why add real-time to a portfolio

Real-time details in a portfolio solve two problems at once. On one hand, they add a bit of playfulness and energy, making the site feel less predictable and more alive. On the other, they work as proof of skills: handling WebSocket connections, presence, state sync and performance constraints.

Instead of spinning up a separate “real-time demo” project, the live layer is embedded directly into the foundation of the personal site. This way, a recruiter or team lead sees not just a list of technologies on a resume, but also how those technologies behave in a real interface — quietly, consistently and with just enough personality to spark the question: “So how does this actually work under the hood?”
