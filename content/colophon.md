---
title: "Colophon"
date: 2020-09-01T08:00:00
---

aka - how is this website built?

# September 2024

This website is built with [hugo][0]. The code for the website itself is [hosted on github][1]. The website is hosted in [cloudflare pages][2]. The domain is registered with cloudflare. The infrastructure plumbling code is [hosted on github][3] and uses [Terraform][6] run from my local workstation. I use a [fork][4] of a Hugo theme called [Hello Friend NG][5]. I forked the theme so I could get some additional hook points to customize my website. In the future, I expect I'll move off of an external theme to something minimal which lives entirely in my code. 

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
