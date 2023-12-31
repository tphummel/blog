---
title: "Infrastructure as Code / Config Management in 2024"
date: 2023-12-30T20:00:00-08:00
draft: false
url: "/posts/iac-cm-2024"
aliases:
  - /posts/infrastructure-as-code-/-config-management-in-2024/
toc: true
tags:
  - linux
  - atlantis
  - terraform
  - ansible
  - github
  - gitlab
  - kubernetes
  - helm
  - lets-encrypt
  - tls
---

## Intro

This post contains my opinions and observations on the Infrastructure as Code and Config Management disciplines as we close out 2023 and head into 2024.

## IaC

Terraform is the only viable option for managing IaaS resources as code. The [Hashicorp / OpenTofu rift][12] only matters if you are an IaC SaaS provider. Or if it reaches a critical point that mindshare starts moving to a new ecosystem. The terraform ecosystem is thriving and all of the mindshare is here.

As for how to bring Terraform into your organization, automation is foundational. Key capabilities are these:

- Plan (dry run) execution on push or on demand
- Apply on demand in feature branches once approval requirements are met. 
- Drift detection via crontab to automatically poke the plan (level 1: identify drift) and apply (level 2: fix drift) capabilities above.
- Complete secret management for both provider credentials and resource definitions

Anti-features

- Needing to punch a hole in your firewall for version control webhooks to reach your terraform runners.
- SaaS vendors charging by the managed resource-hour.
- Rigid requirements only allowing apply on merge to trunk.

Other notes on IaC

- There will be primordial resources required in order to use Terraform workflows (state resources, compute, networking, IAM). Manage these as you see fit but they should be checked into version control. These tend to not need to change often but the configs in version control are helpful for knowledge sharing and auditability.

Key resources

- [How Cloudflare uses Terraform to manage Cloudflare][2]
- [Atlantis][3]
- [devsectop/tf-via-pr-comments][4]

## Config Management

Use [cloud-init][0] for creation-time bootstrap tasks on newly created linux systems. 

Ansible is still great for configuring linux hosts beyond cloud-init at creation. Take a fresh look at [ansible-pull][1] if you haven't in a while. It is an interesting tool to have in your toolkit. For example, use cloud-init to create a systemd cron timer, which runs ansible-pull on a regular interval. Incrementally build up these capabilities to manage a small fleet. Analyze the tradeoffs between push and pull for your usecase.

Fully automated TLS certificates is the only viable option. Take advantage of your cloud provider's offering here. If you are terminating TLS on your own linux hosts, then reach for tools like [Caddy][7], [certmagic][5], [acme.sh][6]. Your initial cert creation and renewal process must not require any human touches.

Where appropriate, you can use free certicate authorities like [Let's Encrypt][8] for non-internet-facing usecases. Take advantage of [DNS-01 challenge][9] method instead of HTTP-01. With this approach as a backstop, for example, you can get rid of certificate warnings on internal web sites/services. Generally, you can reach for DNS-01 whenever HTTP-01 is impossible or inconvenient.

## Kubernetes

Kubernetes isn't special. Management of its resources needs the same level of rigor as traditional IaaS. Configuration is managed as code. Collaborative automation workflows provide dry-run previews in the open. Approval gates prevent unreviewed/unauthorized changes. Change execution happens automatically once criteria is met and/or action is taken (again, in the open).

Key resources

- [Terraform k8s provider][10]
- [Helmfile][11]

## Closing Thoughts

IAM / Secrets Management is a critical capability even when heavily utilizing IaaS/PaaS/SaaS solutions. Investment and holistic planning here is critical. Peer review the approach taken to understand cost, capability, risk tradeoffs. Take advantage of cloud-native IAM offerings from your provider whenever possible - in particular where long-lived, static secrets can be eliminated. 

Building trust with your tools is paramount. IaC and Config Management are highly sensitive, potentially distructive, business-impacting areas. Build up trust by getting lots of reps. There is no substitute for getting the reps. You need to increment the scope of management thoughtfully. You need to carefully increment the fully-automated actions your organization is comfortable with. You need the reps with your tools and workflows to see how they break - to see how it handles edge cases. The reps will also help reveal which areas of your workflows still have high friction - where more attention is needed.



  [0]: https://cloud-init.io/
  [1]: https://docs.ansible.com/ansible/latest/cli/ansible-pull.html
  [2]: https://blog.cloudflare.com/terraforming-cloudflare-at-cloudflare/
  [3]: https://www.runatlantis.io/
  [4]: https://github.com/devsectop/tf-via-pr-comments
  [5]: https://github.com/caddyserver/certmagic
  [6]: https://github.com/acmesh-official/acme.sh
  [7]: https://github.com/caddyserver/caddy
  [8]: https://letsencrypt.org/
  [9]: https://letsencrypt.org/docs/challenge-types/
  [10]: https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs
  [11]: https://github.com/helmfile/helmfile
  [12]: https://opentofu.org/manifesto
