---
title: "Colophon"
date: 2020-09-01T08:00:00
---

Also known as: how is this website built?

# October 2026

A new type of content has emerged on this site: the AI-driven research page. These pages don't contain original thoughts or insights. They are a helpful sync of research that is spread across other sites and pages, which I've pulled together into a single page for ease of learning or planning. Examples include the 2026 general election and Amtrak from California to Chicago, IL.

An AI assistant does the gathering and summarizing, and the sources it draws from remain the authority. Treat these pages as a starting point and check the linked sources before relying on anything important, especially details that change over time like schedules, fares, and election dates.

# September 2024

This website is built with [hugo][0]. The code for the website itself is [hosted on github][1]. The website is hosted in [cloudflare pages][2]. The domain is registered with cloudflare. The infrastructure plumbing code is [hosted on github][3] and uses [Terraform][6] run from my local workstation. I previously used a [fork][4] of a Hugo theme called [Hello Friend NG][5] so I could get some additional hook points to customize my website. I have since moved to a very small theme that includes [water.css](https://watercss.kognise.dev/) and lives entirely in this repository.

I use [Honeycomb][7] called by [Cloudflare Workers][9] for [server-side pageview analytics][8].


  [0]: https://gohugo.io
  [1]: https://github.com/tphummel/blog
  [2]: https://pages.cloudflare.com
  [3]: https://github.com/tphummel/iaas/blob/main/tomhummel.com/main.tf
  [4]: https://github.com/tphummel/hugo-theme-hello-friend-ng
  [5]: https://github.com/rhazdon/hugo-theme-hello-friend-ng
  [6]: https://terraform.io
  [7]: https://honeycomb.io
  [8]: https://github.com/tphummel/blog/blob/main/workers/index.js
  [9]: https://workers.cloudflare.com/
