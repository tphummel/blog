---
title: "Four Ways to Build Web Apps"
date: 2023-02-20T09:30:00-08:00
draft: false
toc: true
url: /posts/four-web-apps
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

This is my opinionated list of four approaches to building websites and web applications. Publicly hosted on the internet, serving HTML, CSS, JavaScript, images, etc over HTTP.

## #1: Hugo Static Sites + Progressive Web Apps

Static websites are boring. Vendors rarely talk about them because the margins are miniscule compared to flashy, compute-heavy services. It is seen as a table stakes offering. Though they have received more attention during the "JAM Stack" trend, my position is that they are still underappreciated and underutilized. 

Static hosting has near-zero ongoing operational burden, is free to host at low to medium traffic levels, plays well with CDNs, and has well established patterns for updating content. If your project can get away with being a static website don't mess it up by doing something more complex and expensive. Choose a tool (such as [Hugo][7]) and learn every facet of how it works. You'll be confident of when you've outgrown it and need to consider a more complicated/expensive approach.

Further, every static site can be [installable][4] on mobile phones just like a native app using [Progressive Web App][28] (PWA) capabilities and made accessible offline using service workers. Further, you can layer interactive functionality and privacy-respecting persistence (see: [Nomie][5] by [Brandon Corbin][6]), all without a traditional server backend. PWA APIs have [excellent support][29] on mobile web browsers and getting better all the time. Do it.

- __Common Hosting Providers__: [Cloudflare Pages][2], [AWS S3][3], Vercel, Netlify.
- __Base hosting cost__: Free
- __Ideal for__: high-read, low-write applications. Content sites, blogs, marketing, documentation, data-driven websites in which the data changes infrequently (20-30 updates per day is probably on the high side). 
- __Not great for__: high-write applications

### Examples

- Content / Data Websites
  - [Old Games Win](https://oldgames.win/) ([src](https://github.com/tphummel/oldgames.win))
  - [wordle.tomhummel.com](https://wordle.tomhummel.com/) ([src](https://github.com/tphummel/wordle))
  - [data.tomhummel.com](https://data.tomhummel.com/) ([src](https://github.com/tphummel/data.tomhummel.com))
  - [laps.run](https://laps.run/) ([src](https://github.com/lapsrun/laps.run))
  - [tomhummel.com](https://tomhummel.com/) ([src](https://github.com/tphummel/blog))
- Progressive Web Apps
  - [New York Times Wordle](https://www.nytimes.com/games/wordle/index.html)
  - [Nomie](https://nomie5.pages.dev/) ([src][5]) by [Brandon Corbin][6]
  - [Button App](https://tphummel.github.io/button-app/) ([src](https://github.com/tphummel/button-app))
  - [NES Journal](https://tphummel.github.io/button-app/nes/) ([src](https://github.com/tphummel/button-app/tree/main/nes))

## #2: Cloudflare Workers

Cloudflare Workers is a serverless (yes, there are servers but you don't have to manage them), edge compute platform. It is very easy to get started building standalone web apps that would traditionally require a server.

Cloudflare Workers can be standalone apps or you can stitch worker functionality into your static website using [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/get-started/). For the latter case you add a `/functions` directory to the root of your Cloudflare Pages git repo and functions are automatically deployed alongside your static site. A script at `/functions/form-submission.js` would be deployed at the url path: `/form-submission/`

- __Base hosting cost__: Free tier, and then $5/mo for higher volume and access to more storage options.
- __Ideal for__: 
  - Customizing response headers
  - Privacy-respecting usage analytics
  - Authenticating/authorizing users
  - Handling form submissions
  - Triggering transactional email
  - Dynamically building JSON payloads
  - Interacting with storage (cloudflare or third party)
  - Building A/B testing and feature flagging capabilities
  - Achieving global points of presence as close as possible to consumers
- __Not great for__: 
  - Complicated routing schemes or very large applications
  - Applications that require heavier frameworks and functionality
  - Applications that require a more advanced or featureful runtime
  - Multi-provider architectures (identity and networking can be cumbersome or brittle)

### Examples

- [Battlesnake: Braden Looper](https://github.com/tphummel/braden-looper)
- [Battlesnake: Bobby Witt](https://github.com/tphummel/bobby-witt)
- [Battlesnake: Nick Swisher](https://github.com/tphummel/nick-swisher)

## Graduating from Options 1 and 2

A few notes before presenting Options 3 and 4. If you've outgrown Options 1 and 2 it could mean you need to run your own linux container or server. However, if you can avoid the overhead of this by using Options 1 or 2 it is absolutely recommended. Options 1 and 2 are free to run at low usage levels and scale elastically as demand rises. Managing change is fairly simple and maintenance overhead is minimal. Seize on these benefits if you can. Options 3 and 4 offer approximately the same levels of complexity with different tradeoffs on cost and capability. 

## #3: Linux Server Singleton

Option #3 is to run exactly one linux webserver to host your web app. Choose your application runtime (node.js, ruby, go, python), operating system, supporting agent programs. Store primary application data in SQLite and take advantage of its vibrant ecosystem. Committing to a single, all-inclusive server closes off complexity related to managing distributed systems - things like load balancing, clustering, discovery, tracing, and external databases. With fewer network hops to serve a single request, you limit the possible failure modes. With this approach, you can squeeze out fairly good latency and throughput for 80% usecases if you choose your path carefully.

- __Common Hosting Providers__: [AWS EC2][9], [OCI Compute][10], [Azure Compute][11]
- __Base hosting cost__: Limited free tier depending on the provider, and then ~$5/mo and up. Additional costs for block and object storage and network bandwidth.
- __Ideal for__: 
  - Projects which need full customization of the operating system, operational agents/tools, application runtime, and frameworks. 
  - Colocating your primary datastore with your application code, in process for simplified database connectivity. 
  - Attempting to minimize per request costs down as far as you can.
  - Uptime objectives of 99.9% (three 9's) availability. 
  - Usecases which can be located in a single geography.
  - Taking advantage of IaaS provider identity and networking primitives while not irreversibly tying yourself to that provider.
- __Not great for__: 
  - Teams which don't want the overhead of managing even a single linux server - security patching, backups, disaster recovery scenarios. 
  - Uptime objectives of 99.999% (five 9's) or higher. 
  - Workloads which are likely to outpace the upper bound of vertical scaling (note: the upper bound is surprisingly high!). 
  - If you need global points of presence.

Note: With a single server off the shelf, the most notable concern is lack of data replication and thus risk of data loss. The strategy explicitly includes approaches for getting application and operational state off the server to persistent stores in real time (litestream, fluentbit, prometheus or comparable - or SaaS providers like [honeycomb][21] or [datadog][22]).

### Examples

- [Caddy, Node.js, FlywayDB, SQLite, Litestream, (S3-compatible) Object Store](https://github.com/tphummel/CaNFlySLO)

## #4: Containers on Platform as a Service (PaaS)

Option #4 is to choose a PaaS provider to host your application as a docker container.

- __Common Hosting Providers__: 
  - [ECS Fargate][15]
  - [Azure Container Instances][17]
  - [OCI Container Instances][16]
  - [Google Cloud Run][18]
  - [Fly.io][19]
- __Base hosting cost__: Limited free tier depending on the provider, and then ~$3/mo and up. Additional costs for block/object storage and network bandwidth.
- __Ideal for__:
  - Projects which need a more customized runtime than Cloudflare Workers can provide but don't want to manage servers.
  - Projects which need to scale the application tier horizontally.
  - Projects which can afford a network hop between the stateless application tier and the persistent data tier.
  - Projects which want to try for 5+ 9's of availability. 
  - Projects which need global points of presence (note that it can be easy push your application to the edge, but it is more challenging to do so with your data)
  - Taking advantage of an IaaS provider identity and networking primitives.
- __Not great for__:
  - Teams which don't want to be in the business of building container ci/cd deployment pipelines.
  - Teams which don't want to manage the complexity of distributed systems.

Note: Option #4 does not include using managed kubernetes platforms like [EKS][24], [AKS][25], [GKE][26], or [OKE][27]. These "managed" offerings come with significant operational costs and should be considered hostile to the goal of controlling complexity.

### Examples
- [12 Factor Apps on AWS ECS Fargate][14]

### Links

- [ECS EC2 vs. ECS Fargate Shared Responsibility Model][19]
- [AWS EKS Shared Responsibility Model][20]

## Beyond the Four Ways

The four approaches above attempt to control cost and complexity, provide a constrained set of capabilities in order to achieve a goal. These will cover the common 80% of usecases for web applications. When you outgrow these four it means you may have special requirements. At a certain scale an organization can benefit from investments in platform capabilities, such as those provided by [Nomad][12] or [Kubernetes][13]. The breakeven point on these investments can be much further away than you think but still may make sense. YMMV.

## Aside: Complexity is Conserved ... Until it isn't

There is no such thing as a free lunch (TINSTAAFL). Complexity is conserved, meaning complexity cannot be removed it can only be moved around. For example, you can pay a provider to handle a class of complexity for you or bear those yourself - someone is doing it.

The interesting areas are where the complexity-cost tradeoff gets bent by innovation or commoditization. For example, nearly free static website hosting removed the need to run an apache or nginx webserver for these usecases. Cloud providers commoditized this capability and we all enjoy the benefit. Consumers moved complexity to the provider and cost dropped at the same time. These are the areas to be on the lookout for.

## Aside: Advocacy for IaaS Identity and Networking

IaaS Identity and Networking features are underappreciated. They are often free or very low cost and enable elegant, secure, and simple solutions to common usecases. Do not miss out on these features by convincing yourself it would lock you into the platform. Commit to a provider and squeeze every drop of value from your learning investment. 

Essential Features:
- __Private Networking Endpoints__: from a private subnet, connecting to S3 (compatible) buckets, databases, or other IaaS APIs without traversing the internet. 
- __Principal Identity__: cut out 90% of secret tokens and passwords you need to manage by authorizing resources themselves to access other resources. Eliminate the need to manage and inject API tokens into containers and servers and instead authorize containers and servers to perform those operations. 

Which providers are worth considering for all-in investment? In my opinion, the short list is: Amazon Web Services, Microsoft Azure, and Oracle Cloud Infrastructure.

## Conclusion

- We covered four possible approaches to building web sites and applications.
- The three axes you are balancing are complexity, capability, and cost. Bring intentionality to your decisions and tradeoffs.
- Always use the solution with the lowest level of complexity which can satisfy your needs while factoring in your sensitivity to costs.
- This can be hard stuff to get right. Take the easy wins when you see them. Save your effort for the hard ones.
- There are of course other options. There are more complicated and (allegedly) capable approaches which move the cost and complexity curves with the promise of more capabilities. YMMV.
- It's challenging to create things that matter. Be thorough, get lots of reps, always be learning, and good luck.

> Edit 2023-07-04: This post got alot of attention. See [follow-up analysis]({{< relref "posts/front-page-hacker-news.md" >}}) of this post.


  [1]: https://workers.cloudflare.com/
  [2]: https://pages.cloudflare.com/
  [3]: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_website_configuration
  [4]: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
  [5]: https://github.com/tphummel/nomie5
  [6]: https://github.com/brandoncorbin
  [7]: https://gohugo.io/
  [8]: https://github.com/tphummel/cloud-static
  [9]: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/instance
  [10]: https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/core_instance
  [11]: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_virtual_machine
  [12]: https://registry.terraform.io/providers/hashicorp/nomad/latest/docs
  [13]: https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs
  [14]: https://github.com/aws-samples/twelve-factor-app-ecs-blog
  [15]: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster
  [16]: https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/container_instances_container_instance
  [17]: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/container_group
  [18]: https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloud_run_v2_service
  [19]: https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/security-shared.html
  [20]: https://docs.aws.amazon.com/eks/latest/userguide/security.html
  [21]: https://registry.terraform.io/providers/honeycombio/honeycombio/latest
  [22]: https://registry.terraform.io/providers/DataDog/datadog/latest
  [23]: https://fly.io/
  [24]: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eks_cluster
  [25]: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster
  [26]: https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/container_cluster
  [27]: https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/containerengine_cluster
  [28]: https://web.dev/progressive-web-apps/
  [29]: https://caniuse.com/web-app-manifest