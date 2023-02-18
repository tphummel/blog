---
title: "Five Types of Web Apps"
date: 2023-02-18T07:45:00-08:00
draft: false
toc: true
tags:
- cloudflare
- hugo
- sql
- static-site
- aws
- oci
- static-site
---

An opinionated list of five approaches to building websites and web applications. 

What types of web apps are we talking about?
- Publicly hosted web properties, exposing a TCP port(s) (80/443) on the internet using HTTP protocol.
- Accessible with common HTTP clients: desktop and mobile web browsers, cURL. 
- Discoverable via a DNS domain name (ex: https://tomhummel.com).
- Serves common file/mime types: html, javascript, json, css, images, txt, etc.

## #1: Hugo Static Websites

Static websites are boring. Vendors rarely talk about them because the margins are miniscule compared to flashy, compute-heavy services. It is seen as a table stakes offering. My position is that they are underappreciated and underutilized. Static hosting has nearly zero ongoing operational burden, is free to host at low to medium traffic levels, plays well with CDNs and SEO, and has very well established patterns for updating content. If your project can get away with being a static website don't mess it up by doing something more complex and expensive. Choose a tool (such as Hugo) and learn every facet of how it works. Know how to squeeze every drop out of its capabilities so you can be confident of when you've outgrown it and need a more complicated/expensive approach.

- __Common Hosting Providers__: [Cloudflare Pages][2], [AWS S3][3], Vercel, Netlify.
- __Base hosting cost__: Free
- __Ideal for__: high-read, low-write applications. Content sites, blogs, marketing, documentation, data-driven websites in which the data changes infrequently. 
- __Not great for__: non-technical content creators, high-write workloads, highly interactive apps, multi-user concurrent collaboration.

Examples:
- [laps.run](https://laps.run/)
- [Old Games Win](https://oldgames.win/) ([src](https://github.com/tphummel/oldgames.win))
- [tomhummel.com](https://tomhummel.com/)
- [data.tomhummel.com](https://data.tomhummel.com/)
- [wordle.tomhummel.com](https://wordle.tomhummel.com/)

Links:
- [Hugo](https://gohugo.io/)
- 
- [Static Websites on S3](https://github.com/tphummel/cloud-static)

## #2: Progressive Web Apps
- hosting providers: cloudflare pages, s3, vercel, netlify.
- base hosting cost: free
- offline capable with service workers
- installable to android and iOS home screen for native app experience

Examples:
- [Wordle](https://www.nytimes.com/games/wordle/index.html)
- [Nomie](https://nomie5.pages.dev/) ([src](https://github.com/tphummel/nomie5)) by [Brandon Corbin](https://github.com/brandoncorbin)
- [Button App](https://tphummel.github.io/button-app/) ([src](https://github.com/tphummel/button-app))
- [NES Journal](https://tphummel.github.io/button-app/nes/) ([src](https://github.com/tphummel/button-app/tree/main/nes))

## #3: Cloudflare Workers

Examples:
- https://github.com/tphummel/bobby-witt
- https://github.com/tphummel/pat-rapp
- https://github.com/tphummel/braden-looper

## #4: Containers on Platform as a Service (PaaS)

ECS Fargate
OCI Container Instances
Google Cloud Run
Azure Container Instances
Fly.io
Heroku

Requirements: No servers to manage. Identity principals issued directly to containers by the cloud provider. Fully configurable networking

## #5: Linux Server Singleton 

can fly slo
https://github.com/tphummel/CaNFlySLO

## Appendix: Choosing Technology

- It is hard. It depends. 
- The three axes you are balancing are: complexity, capability, and cost.
- The following five approaches start simple and add capabilities (and complexity) when the situation calls for it. You always want to use the solution with the lowest level of complexity which can satisfy your needs - and factoring in your sensititivity to costs. For example, do not run a linux server to host a static website.
- There is no such thing as a free lunch (TINSTAAFL). Complexity is conserved meaning complexity cannot be removed it can only be moved around. For example, you can pay a provider to handle certain complex aspects for you or bear those yourself - someone is doing it.
- The interesting areas are where the complexity-cost tradeoff gets bent by innovation or commoditization. For example, nearly free static website hosting removed the need to run an apache or nginx webserver for these usecases. Cloud providers commoditized this capability and we all enjoy the benefit. Consumers moved complexity to the provider and cost dropped at the same time. These are the areas to be on the lookout for.

## Conclusion

- We covered five approaches to building web sites and applications, each with their own pros and cons, capabilities and complexity.  
- There are of course more complicated and capable application architectures beyond these five which add capabilities and complexity. YMMV. 
- Al


    [1]: https://workers.cloudflare.com/
    [2]: https://pages.cloudflare.com/
    [3]: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_website_configuration