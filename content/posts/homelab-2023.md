---
title: "My Road to Homelab in 2023"
date: 2023-08-09T19:00:00-07:00
url: "/posts/homelab-2023"
draft: false
toc: false
tags:
  - homelab
  - proxmox
  - linux
  - atlantis
  - terraform
  - consul
  - ansible
  - nomad
  - vault
  - kubernetes
  - tiny-mini-micro
  - github
  - gitlab
  - prometheus
  - ebay
---

## Intro

My interests have taken a curious turn toward bare metal homelab servers. I wanted to share where I'm coming from, what sent me down this path, the resources which have been guiding me, where I am now, and where I think I'm headed. 

## History

I messed around with PC hardware in the 1990s and early 2000s but never really felt at home with it. I installed a CD-RW drive in my Windows 98 Compaq computer. I installed a GPU card in that same computer in order to play Quake 3 Arena and Diablo II. I took the first semester of the Cisco CCNA certification as a high school senior. 

My path always seemed to veer away from hardware toward software. This led me to an Information Systems undergraduate degree in which I managed to avoid most of the hard science and math of a CS degree - which probably would have exposed me to some hardware adjacent topics like circuits and basic electrical engineering.

Later, I had made some very small cloud clusters 3 x t2.micro or 3 x $5 digital ocean droplets. I was always so sensitive to price that it wasn't fun for me. I was terrified something would run amok and I'd end up with a $500 egress bill. I wanted to experiment with tools like Consul or Tinc VPN in an environment that felt "real", as opposed to a 3 VM cluster managed with [Vagrant][6] on my macbook. 

I tinkered with single board computers like raspberry pi but the early days of that platform were painful for inexperienced folks like me. The ARM architecture was still being treated like a toy. Support by distributions and package repositories was sparse. I spent hours fiddling with NIC drivers. I was not experiencing a productivity flywheel and my enthusiasm faded. 

In short, I've always dreaded opening my computers. I didn't know what I didn't know and I was worried I would ruin something. The cloud is fun if you can take advantage of free tier pricing but there are expensive pitfalls lurking around every corner.

## Public Cloud

Fast forward 20 years and I find I've been working exclusively in dev, ops, and leadership roles in which I've built, shipped, and operated software on public cloud. This has been foundational as I've spent years configuring and operating linux systems using state of the art tools like [Packer][5], [Vagrant][6], [Ansible][7], and [Terraform][8] on state of the art IaaS cloud platforms like Amazon Web Services and Oracle Cloud Infrastructure, targeting state of the art orchestration systems like [Kubernetes][9] and [Nomad][10].

Sprawling, distributed architectures could be defined entirely in code. A single command brings them to life. A second command brings them back down to zero. This is my world view.  

## A Whole New World

My eye started catching articles which had hardware components to them. 

I listened to [Bryan Cantrill][0] [discuss his new datacenter hardware and software startup][1], [Oxide][2], in June 2022. I didn't know what to make of it but I took notice.

DHH's articles in [October 2022][3], [February 2023][12], and [June 2023][4] about leaving AWS and moving to colocated servers were certainly provocative. I appreciated the discussion of capital expenses and how they compared to their cloud spend. I still felt like I couldn't see the whole picture. Who was operating these servers? After years of using AWS they just happened to have the expertise on staff to make this migration happen in under a year? Including a fairly large catalog of legacy production apps which couldn't be disrupted? And all of this as a [Calm company][25] which hires and fires very deliberately. I understand they used a vendor to get white glove service in the colocation facility. Still, I felt like it didn't add up. Rather than concluding DHH was selling snake oil, I determined there was alot here I had yet to understand.

In Spring 2023, this article made the rounds: [Building the Micro Mirror Free Software CDN][11]. It uncovered for me the tip of a massive iceberg. It hinted at an entire world of professionals who keep the plumbing of the internet running. I must have read the article five times to make sure I could picture every nook and cranny. In addition to being an amazing story and quite funny, they showed their work on pricing and sourcing used hardware, optimizing the workloads they were hosting, and efficiency. 

Efficiency! 

Their usecase of hosting linux packages could run meaningful workloads on a server with these specifications: "HP T620 thin client, 2x4GB DIMMs, 2TB M.2 SSD"

So I don't need to buy secondhand server racks, then thousands of dollars of rackmounted servers, then expensive ventilation and cooling systems, and then pay soaring power bills to run my own hardware in my home? This was a breath of fresh air. I felt like I hadn't been hearing this take anywhere in the RSS feeds I follow. 

They were sourcing commodity hardware on eBay. Entire systems for under $250. These systems idle at very low power consumption (< 15W). And they were provisioning the systems with [Ansible][7]! Hey, maybe I can do this too! This was the single most empowering article I've read in 2023.

Featured in the article, [Thin Clients][15] make constrained yet compelling homelab servers. 

## TinyMiniMicro

My background in cloud and linux automation along with the challenging and empowering articles I read in 2023 prepared me to start a fresh approach to homelab'ing. I considered the thin client angle but wanted just a little more firepower. 

This led me to discovering the [TinyMiniMicro][13] series of video reviews from [ServeTheHome][14]. This content really made a homelab feel within reach. 

The series reviews three main families of compute:

- Lenovo ThinkCenter Tiny
- Dell OptiPlex Micro
- HP EliteDesk Mini

Which share some common qualities:

- Low Power Consumption (Generally <=35W TDP, <15W idle)
- Large second-hand inventory, driving down prices, with easy to find replacement and upgrade components.
- Reliable build quality, intended for use as enterprise workstations
- Often come pre-loaded with a Windows 10/11 Pro License Key
- x86 64-bit processors with VT-x/VT-d which make good targets for virtualization. 
- Easy service - often a single thumbscrew to access internals. 
- Small, 1-liter volume enclosure footprint.
- Improved resource capacity above Thin Clients - 4-8 cores and 32-64GB RAM are well within reach at my budget.

See the [intro post to the TinyMiniMicro project][26] for more. 

A common thread for me in my tech career has been doing alot with a little. Squeezing every drop out of what I have on hand to make things of value. TinyMiniMicro meshed perfectly with my worldview, skills, budget, and interests.

## My Immediate Plans

With everything I'd learned to date and excellent content creators keeping me from making major mistakes. I felt armed to enter the market. 

I purchased the following:

- Dell Optiplex 5060 Micro [i5-8500T][16] w/ power supply. 8GB DDR4 RAM. No HDD. No OS. $104.01 on eBay
- 2 x 16GB DDR4 3200 288-pin RAM. $54.74 on Newegg.com
- 1TB M.2 2280 PCIe 4.0 NVMe 1.4 SSD. $41.60 on Newegg.com

For $200.35 (including CA sales tax and shipping), I'm going to have a proxmox host with a 6-core x86 64bit CPU, 32GB RAM, 1TB SSD. In a 1L case, 35W TDP. (With 8GB of unused DDR4 RAM I could put into a Thin Client at some point).

## Where I May Go From Here

The usecases I'm most interested in right now are:

- Learning about [Proxmox][19] and virtualization in general. 
- Playing with various iterations of the Hashistack: [Nomad][10], [Consul][17], and [Vault][18]. 
- Playing with [k3s.io][24] and other minimal kubernetes distributions. 
- Playing with the [Prometheus][20] telemetry ecosystem. 
- Playing with the [proxmox terraform provider][22] w/ self-hosted Gitlab and [Atlantis][23]. 
- Playing with [self-hosted Github Actions runners][21] on my hardware.
- Playing with Wireguard VPN. Evaluating Tailscale and Cloudflare Zero Trust products. 
- Multiplayer LAN retro PC and console gaming.
- Learning about home networking, generally.

  [0]: https://en.wikipedia.org/w/index.php?title=Bryan_Cantrill&oldid=1134210912
  [1]: https://changelog.com/podcast/496
  [2]: https://oxide.computer/
  [3]: https://world.hey.com/dhh/why-we-re-leaving-the-cloud-654b47e0
  [4]: https://world.hey.com/dhh/we-have-left-the-cloud-251760fb
  [5]: https://www.packer.io/
  [6]: https://www.vagrantup.com/
  [7]: https://github.com/ansible/ansible
  [8]: https://www.terraform.io/
  [9]: https://kubernetes.io/
  [10]: https://www.nomadproject.io/
  [11]: https://blog.thelifeofkenneth.com/2023/05/building-micro-mirror-free-software-cdn.html
  [12]: https://world.hey.com/dhh/we-stand-to-save-7m-over-five-years-from-our-cloud-exit-53996caa
  [13]: https://www.servethehome.com/tag/tinyminimicro/
  [14]: https://www.servethehome.com
  [15]: https://www.parkytowers.me.uk/thin/hware/hardware.shtml
  [16]: https://ark.intel.com/content/www/us/en/ark/products/129941/intel-core-i58500t-processor-9m-cache-up-to-3-50-ghz.html
  [17]: https://www.consul.io/
  [18]: https://www.vaultproject.io/
  [19]: https://proxmox.com/en/
  [20]: https://prometheus.io/
  [21]: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners
  [22]: https://registry.terraform.io/providers/Telmate/proxmox/latest/docs
  [23]: https://www.runatlantis.io/
  [24]: https://k3s.io/
  [25]: https://basecamp.com/books/calm
  [26]: https://www.servethehome.com/introducing-project-tinyminimicro-home-lab-revolution/
