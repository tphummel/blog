---
title: "Four Types of Web Apps"
date: 2023-02-18T07:45:00-08:00
draft: false
toc: true
tags:
- cloudflare
- hugo
- sqlite
- static-site
- aws
- oci
- pwa
- ec2
- s3
- battlesnake
- terraform
- linux
---


## Intro

This is my opinionated list of four approaches to building websites and web applications.

What types of web apps are we talking about?

- Publicly hosted web properties, exposing TCP port(s) (80/443) on the internet using HTTP protocol.
- Accessible with common HTTP clients: desktop and mobile web browsers, cURL. 
- Discoverable via a DNS domain name (ex: https://tomhummel.com).
- Serves common file/mime types: html, javascript, json, css, images, txt, etc.

Choosing Technology

- It is hard. It depends. Take the easy wins when you see them. Save your effort for the hard ones.
- The three axes you are balancing are: complexity, capability, and cost.
- The following five approaches start simple and add capabilities (and complexity) when the situation calls for it. You always want to use the solution with the lowest level of complexity which can satisfy your needs - and factoring in your sensititivity to costs. For example, do not run a linux server to host a static website.
- There is no such thing as a free lunch (TINSTAAFL). Complexity is conserved meaning complexity cannot be removed it can only be moved around. For example, you can pay a provider to handle a class of complexity for you or bear those yourself - someone is doing it.
- The interesting areas are where the complexity-cost tradeoff gets bent by innovation or commoditization. For example, nearly free static website hosting removed the need to run an apache or nginx webserver for these usecases. Cloud providers commoditized this capability and we all enjoy the benefit. Consumers moved complexity to the provider and cost dropped at the same time. These are the areas to be on the lookout for.

## #1: Hugo Static Sites + Progressive Web Apps

Static websites are boring. Vendors rarely talk about them because the margins are miniscule compared to flashy, compute-heavy services. It is seen as a table stakes offering. Though they have received more attention during the "JAM Stack" trend. My position is that they are still underappreciated and underutilized. Static hosting has nearly zero ongoing operational burden, is free to host at low to medium traffic levels, plays well with CDNs, and has very well established patterns for updating content. If your project can get away with being a static website don't mess it up by doing something more complex and expensive. Choose a tool (such as [Hugo][7]) and learn every facet of how it works. Know how to squeeze every drop out of its capabilities so you can be confident of when you've outgrown it and need a more complicated/expensive approach. 

Every static site can be installable on mobile phones using [Progressive Web App][4] capabilities and made accessible offline using service workers. Further you can layer rich, javascript-driven interactive functionality and privacy-respecting persistence (see: [Nomie][5] by [Brandon Corbin][6]) if needed. PWA APIs have excellent support on mobile web browsers.

- __Common Hosting Providers__: [Cloudflare Pages][2], [AWS S3][3] ([example][7]), Vercel, Netlify.
- __Base hosting cost__: Free
- __Ideal for__: high-read, low-write applications. Content sites, blogs, marketing, documentation, data-driven websites in which the data changes infrequently (10-20 updates per day is probably on the high side). 
- __Not great for__: high write-throughput applications. 

### Examples

- Content / Data Sites
  - [laps.run](https://laps.run/)
  - [Old Games Win](https://oldgames.win/) ([src](https://github.com/tphummel/oldgames.win))
  - [tomhummel.com](https://tomhummel.com/)
  - [data.tomhummel.com](https://data.tomhummel.com/)
  - [wordle.tomhummel.com](https://wordle.tomhummel.com/)
- Progressive Web Apps
  - [New York Times Wordle](https://www.nytimes.com/games/wordle/index.html)
  - [Nomie](https://nomie5.pages.dev/) ([src][5]) by [Brandon Corbin][6]
  - [Button App](https://tphummel.github.io/button-app/) ([src](https://github.com/tphummel/button-app))
  - [NES Journal](https://tphummel.github.io/button-app/nes/) ([src](https://github.com/tphummel/button-app/tree/main/nes))

## #2: Cloudflare Workers

Cloudflare Workers is a serverless (there are servers but you don't manage them), edge compute platform. It is very easy to get started building standalone web apps that would traditionally require a server.

Cloudflare Workers can be standalone apps or you can layer worker functionality into your static website using [Cloudflare Pages Functions][https://developers.cloudflare.com/pages/platform/functions/get-started/]. For the latter case you add a `/function` directory to your Cloudflare Pages git repo and functions are automatically deployed alongside your state site.

- __Base hosting cost__: Free tier, and then $5/mo for higher volume and access to more storage options. 
- __Ideal for__: 
  - customizing response headers
  - privacy-respecting usage analytics
  - authenticating/authorizing users
  - handling form submissions
  - triggering transactional email
  - dynamically building JSON payloads
  - minimally interacting with storage solutions (cloudflare or third party)
  - building A/B testing and feature flagging capabilities
  - other types of middleware usecases
  - Achieving global points of presence as close as possible to consumers
- __Not great for__: 
  - complicated routing schemes
  - applications that require heavier frameworks and functionality
  - applications that require a more advanced runtime
  - multi-provider architectures (identity and networking can be cumbersome and brittle)

### Examples

- [Battlesnake: Braden Looper](https://github.com/tphummel/braden-looper)
- [Battlesnake: Bobby Witt](https://github.com/tphummel/bobby-witt)
- [Battlesnake: Nick Swisher](https://github.com/tphummel/nick-swisher)

## Graduating from Options 1 and 2

A few notes before Options 2 and 3. If you've outgrown Options 1 and 2 it could mean you need to run your own linux container or server. However, if you can avoid the overhead of this by using Options 1 or 2 it is absolutely recommended. Options 1 and 2 are free to run at low usage levels and scale elastically as demand rises. Managing change is fairly simple and maintenance overhead is minimal. Seize on these benefits if you can. Options 3 and 4 offer approximately the same levels of complexity with different tradeoffs on cost and capability. 

## #3: Linux Server Singleton

Option #3 is to run exactly one linux webserver to host your web app. Choose your application runtime (node.js, ruby, go, python), operating system, . Store primary application data in SQLite and take advantage of its vibrant ecosystem. Committing to a single, all-inclusive server closes of complexity related to load balancing, clustering, discovery, and external databases. With fewer network hops to serve a single request, you can squeeze out fairly good performance for 80% usecases. 

- __Common Hosting Providers__: [AWS EC2][9], [OCI Compute][10], [Azure Compute][11]
- __Base hosting cost__: Limited free tier depending on the provider, and then ~$5/mo and up. Additional costs for block and object storage and network bandwidth.
- __Ideal for__: 
  - Projects which need full customization of the operating system, operational agents/tools, application runtime, and frameworks. 
  - Colocating your primary datastore with your application code, in process for simplified database connectivity. 
  - Attempting to squeeze per request throughput costs down as far as you can. 
  - Usecases which are satisfied with with 99.9% (three 9's) availability. 
  - Usecases which can be located in a single geography. 
  - Taking advantage of IaaS provider identity and networking primitives while not irreversibly tying yourself to that provider.
- __Not great for__: 
  - Teams who don't want the overhead of managing even a single linux server - security patching, backups, disaster recovery scenarios. 
  - Uptime requirements of five or more 9's. 
  - Workloads which are likely to outpace the upper bound of vertical scaling (note: the upper bound is surprisingly high!). 
  - If you need global points of presence. 

Other caveats: With a single server, the most notable tradeoff is danger of losing your application state in the event of failure. The strategy explicitly includes approaches for getting application and operational state off the server to persistent stores (litestream, fluentbit, prometheus or comparable).

### Examples

- [Caddy, Node.js, FlywayDB, SQLite, Litestream, (S3-compatible) Object Store](https://github.com/tphummel/CaNFlySLO)

## #4: Containers on Platform as a Service (PaaS)

Option #4 is to choose a PaaS provider to host a docker container. If you are more comfortable working with containers than servers this can be a good option but comes with its own tradeoffs, of course.

- __Common Hosting Providers__: ECS Fargate, OCI Container Instances, Azure Container Instances, Google Cloud Run, Fly.io
- __Base hosting cost__: Limited free tier depending on the provider, and then ~$3/mo and up. Additional costs for block/object storage and network bandwidth.
- __Ideal for__: 
  - Projects which need a more customized runtime than Cloudflare Workers can provide but don't want to manage servers or full operating systems.
  - Projects which need to scale the application tier horizontally.
  - Projects which can afford a network hop between the stateless application tier and the persistent data tier.
  - Projects which want to try for 4+ 9's of availability. 
  - Projects which need global points of presence. 
  - Taking advantage of IaaS provider identity and networking primitives while not irreversibly tying yourself to that provider.
- __Not great for__: 
  - Teams which don't want to be in the business of building container ci/cd deployment pipelines.
  - Uptime requirements of five or more 9's. 
  - Workloads which are likely to outpace the upper bound of vertical scaling (note: depending on your application, the upper bound can be surprisingly high!). 
  - If you need global points of presence. 

### Examples

- [12 Factor Apps on AWS ECS Fargate][14]

## Beyond the four types

The four approaches above attempt to control cost and complexity to provide a constrained set of capabilities in order to achieve a goal. These should cover the common 80% of use cases for web applications. When you outgrow these four it means you may have special requirements. At a certain scale, an organization can benefit from platform capabilities around technologies investments such as those provided by [Nomad][12] or [Kubernetes][13]. The breakeven point on these investments can be much further away than you think. , but can still make sense. YMMV.  

## Conclusion

- We covered my four approaches to building web sites and applications, each with their own pros and cons, capabilities, complexity, and costs.
- Use the approach with the minimum levels of cost and complexity for your capability needs.
- There are of course more complicated and capable application architectures beyond these four which move the cost and complexity curves with the promise of more capabilities. YMMV.
- It's challenging to create things that matter. Stay hungry and good luck. 


    [1]: https://workers.cloudflare.com/
    [2]: https://pages.cloudflare.com/
    [3]: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_website_configuration
    [4]: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
    [5]: https://github.com/tphummel/nomie5
    [6]: https://github.com/brandoncorbin
    [7]: https://gohugo.io/
    [8]: https://github.com/tphummel/cloud-static
    [9]: EC2
    [10]: OCI Compute
    [11]: Azure Compute
    [12]: Hashi Nomad
    [13]: k8s
    [14]: https://github.com/aws-samples/twelve-factor-app-ecs-blog