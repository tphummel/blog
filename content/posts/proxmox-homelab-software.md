---
title: "Proxmox Homelab Software"
date: 2024-05-26T08:00:00-07:00
url: "/posts/proxmox-homelab-software"
draft: false
toc: true
tags:
  - homelab
  - proxmox
  - linux
  - atlantis
  - terraform
  - ansible
  - tiny-mini-micro
  - gitlab
  - postgres
  - caddy
  - docker
  - letsencrypt
  - unifi
---

## Intro

I've been on [an exciting path][0] of building and running a homelab over the past few months. This post shares my vision, how i've built it to date, and what might be next.

## Requirements / Decisions / Constraints

- Use version controlled infrastructure as code to manage the lifecycle of linux guests running on the homelab. Preview infrastructure changes prior to execution.
- Use version controlled config management tools to setup linux guests on creation and if the config is modified.
- Keep the homelab as self contained *as possible* (there will still be lots of external requirements).
- Use automatically renewed certificates for tls/https everywhere. 
- Use public DNS for private (RFC1918) A records

## Key Components

- Self-hosted Gitlab for version control and collaboration. 
- Self-hosted terraform state in postgresql
- Self-hosted Atlantis for Terraform workflows via Gitlab merge requests.
- `ansible-pull` on a systemd timer running directly on guests 
- local docker registry which caches docker images (pull-through cache)

*note: there are lots of ways to set this up. this is how i've done it.*

## Prerequisites

- One or more [Proxmox Virtual Environment][3] [physical][1] [servers][2]
- Root access to the PVE web console on port `8006`
- A homelab domain name. ex: `my-special-homelab.xyz`
- Cloudflare account, authoritative dns for your homelab domain. 
- Password manager for all of the various credentials needed

## One-time Setup Steps

*Gitlab*

- Setup initial admin user
- Create homelab project
- Create repo for terraform
- Create repo for ansible
- Create a gitlab user for atlantis


*Atlantis*
- postgres creds
- proxmox creds
- cloudflare creds
- gitlab creds
- Generate an ssh keypair which is used to do minimal bootstrapping of new lxc guests following creation. 

1. gitlab: debian bookworm LXC. caddy binary, gitlab "fat" docker image, systemd units. 
  - My current setup uses the now-archived, [gitlab role from Jeff Geerling][14]
1. atlantis: debian bookworm LXC. caddy binary, atlantis binary or docker image, systemd units. (i'm not using docker)
1. postgresql: Create from the PVE host console shell using [tteck pve helper scripts][4], databases > postgresql. 

### How to add a new LXC guest
- Reserve the next virtual MAC address in my MAC address table I maintain in a Notion doc. 
- Reserve the next private IP address in my Homelab CIDR range, which I maintain in a Notion doc. 
- Create a DHCP reservation in Unifi for the MAC address and IP Address pair above.
- Select the docker image name and tag I intend to run in the LXC behind Caddy. 
- Select the subdomain I intend to use for the DNS entry. ex: `my-app` -> `my-app.my-homelab.cloud`
- Create the playbook which invokes the docker, caddy, and systemd bits. Mostly referencing existing roles, and ensure the changes are merged to `main`
- Create the terraform bits with the new `proxmox_lxc` [resource][13]
  - which defines: the proxmox host to use, the hostname, the lxc os template (debian 12 - the same version stored on the same device on all hosts), run the lxc unprivileged, set memory and cpu cores, allow nested virtualization (for docker to work), the root filesystem size, ssh authorized keys, the mac address, the provisioner script, and ignore changes to the ostemplate (when I upgrade the version in the future i don't want the guest to be destroyed)
  - provisioner script: install ansible and git. install ansible roles. Setup the ansible-pull systemd timer to run every 15 minutes. `ansible-pull` can be configured to run every time or only when there is a new commit in git. Install the dependent ansible roles I need. Finally run the systemd unit once immediately. 

the terraform manifest:

```
terraform {
  backend "pg" {
    conn_str = "postgres://pg.myhomelab.net:5432/terraform_backend"
  }
  required_version = "1.5.7"
  required_providers {
    proxmox = {
      source  = "Telmate/proxmox"
      version = "2.9.14"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "4.20.0"
    }
    random = {
      source = "hashicorp/random"
    }
  }
}

provider "proxmox" {
  pm_api_url = "https://pve.myhomelab.net:8006/api2/json"
}

# export CLOUDFLARE_API_TOKEN="token"
provider "cloudflare" {}

data "cloudflare_zone" "myhomelab_net" {
  name = "myhomelab.net"
}

locals {
  # the intention is for this template to be available on all pve hosts. 
  # it needs to be added one time on each host and updated periodically here and downloaded.
  debian_12_bookwork_lxc_template = "local:vztmpl/debian-12-standard_12.2-1_amd64.tar.zst"
  public_keys = {
    gitlab_myhomelab_net = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMQa6UoZoNZouT9y7udMlsMRh2nZaZZ0aoy72sDHjkyQ"
    github_com         = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGZY+CBnJyRZDM+IQHRevG43mtk1Jat2j0IdqEPn8bU7"
    atlantis_root      = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICW6T8sU7fxNLQ+9DxtMOxlpzfZMb8tIpJ+w/W+TXhPj atlantis@myhomelab.net"
  }
  guests = {
    it_tools = {
      mac              = "0A:BC:DE:00:00:15"
      dhcp_reservation = "10.20.71.113"
      domain           = "mailcatcher.my-homelab.net"
    }
  }
}

resource "random_password" "mailcatcher" {
  length           = 30
  special          = true
  override_special = "_%@"
}

resource "proxmox_lxc" "mailcatcher" {
  target_node  = "pve6"
  start        = true
  onboot       = true
  hostname     = local.guests.mailcatcher.domain
  ostemplate   = local.debian_12_bookwork_lxc_template
  password     = random_password.mailcatcher.result
  unprivileged = true

  memory = "512"
  cores  = 1

  features {
    nesting = true
  }

  rootfs {
    storage = "local-lvm"
    size    = "5G"
  }

  ssh_public_keys = <<-EOT
    ${local.public_keys.gitlab_myhomelab_net}
    ${local.public_keys.github_com}
    ${local.public_keys.atlantis_root}
  EOT

  network {
    name   = "eth0"
    bridge = "vmbr0"
    ip     = "dhcp"
    hwaddr = local.guests.mailcatcher.mac
  }

  provisioner "file" {
    source      = "setup-ansible-pull-cron.sh"
    destination = "/tmp/script.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/script.sh",
      "/tmp/script.sh ${local.guests.mailcatcher.playbook}"
    ]
  }

  connection {
    type        = "ssh"
    user        = "root"
    private_key = file("/root/.ssh/id_ed25519")
    host        = local.guests.mailcatcher.dhcp_reservation
  }

  lifecycle {
    ignore_changes = [ostemplate]
  }
}

resource "cloudflare_record" "mailcatcher" {
  zone_id = data.cloudflare_zone.myhomelab_net.zone_id
  name    = element(split(".", local.guests.mailcatcher.domain), 0)
  value   = local.guests.mailcatcher.dhcp_reservation
  type    = "A"
  ttl     = 1
  proxied = false
  comment = local.dns_comment
}
```

the guest provisioner script (setup-ansible-pull-cron.sh):

```
#!/bin/bash

ANSIBLE_PLAYBOOK=$1

apt-get update
apt-get install ansible -y
apt-get install git -y

cat > /etc/systemd/system/ansible-pull.timer <<EOF
[Unit]
Description=Run ansible-pull every 15 minutes

[Timer]
OnBootSec=5min
OnUnitActiveSec=15min
Unit=ansible-pull.service

[Install]
WantedBy=timers.target
EOF

cat > /etc/systemd/system/ansible-pull.service <<EOF
[Unit]
Description=ansible-pull

[Service]
ExecStart=/usr/bin/ansible-pull -U https://gitlab.my-homelab.net/my-homelab.net/ansible.git -C main -i localhost, $ANSIBLE_PLAYBOOK
EOF

ansible-galaxy install geerlingguy.docker,7.0.2
ansible-galaxy install git+https://github.com/tphummel/ansible-role-caddy-tls-dns.git,main

systemctl daemon-reload
systemctl enable ansible-pull.timer
systemctl start ansible-pull.timer
# run ansible-pull once, adhoc, right now
systemctl start ansible-pull.service

# block until ansible-pull has done a first run
while systemctl is-active --quiet ansible-pull.service; 
do 
  echo "Waiting for adhoc run of ansible-pull to finish...";
  sleep 2; 
done
```

## Ansible pull playbook

```
---
- hosts: localhost
  become: yes
  gather_facts: yes
  vars:
    container:
      name: it-tools
      description: 'self-hosted it-tools.tech'
      image_name: 'corentinth/it-tools'
      image_tag: '2023.12.21-5ed3693'
      exposed_port: '8080'
      internal_port: '8080'
    domain: 'it-tools.my-homelab.net'
    dns_api_token: 'cloudflare token to edit dns records for acme tls challenge'
    tls_email: 'tls@my-homelab.net'
  roles:
    - geerlingguy.docker
    - role: ansible-role-caddy-tls-dns
      vars:
        caddy_domain: '{{ domain }}'
        caddy_tls_email: '{{ tls_email }}'
        caddy_dns_api_token: '{{ dns_api_token }}'
        caddy_target_port: "{{ container.exposed_port }}"
  tasks:
    - name: Create systemd service file for it-tools.tech
      copy:
        content: |
          [Unit]
          Description={{ container.description }}
          After=docker.service
          Requires=docker.service

          [Service]
          ExecStart=/usr/bin/docker run --name {{ container.name }} -p {{ container.exposed_port }}:{{ container.internal_port }} {{ container.image_name}}:{{ container.image_tag }}
          ExecStop=/usr/bin/docker stop {{ container.name }}
          ExecStopPost=/usr/bin/docker rm -f {{ container.name }}

          [Install]
          WantedBy=multi-user.target
        dest: /etc/systemd/system/{{ container.name }}.service
        mode: 0644
      notify: 
        - Reload systemd
        - Start service
  handlers:
    - name: Reload systemd
      systemd:
        daemon_reload: yes

    - name: Start service
      systemd:
        name: "{{ container.name }}"
        enabled: yes
        state: restarted
```

## Applications

Once this is all set up, what can you do?

Self host your:
- private access to your application
- rss [feed reader][5], [link saver][6], and [link archiver][7]. 
- [games][9]
- [location data][10]
- [uptime monitoring][11]
- backup your critical data to offsite storage. tools like syncthing, rclone, airbyte
- ifttt-style automation. tools like activepieces, node-red
- misc handy tools: it-tech.tools, hrconvert2
- mailhog
- olivetin
- nocodb
- wiki
- [pastebin / secret sharing][15]
- a single html page with all your links in one spot
- backup images from your phone
- podcast and audiobook library
- connect cloudflare workers to software running in your homelab
- connect to your apps privately over cloudflare tunnel (or tailscale, etc)

Scan [awesome-selfhosted][8] and let your imagination run. Focus on utility. Focus on paid services you use every day.  


  [0]: {{< relref "posts/homelab-2023" >}}
  [1]: https://www.servethehome.com/introducing-project-tinyminimicro-home-lab-revolution/
  [2]: https://www.servethehome.com/tag/tinyminimicro/
  [3]: https://www.proxmox.com/en/proxmox-virtual-environment/overview
  [4]: https://tteck.github.io/Proxmox/
  [5]: https://www.freshrss.org/
  [6]: https://wallabag.org/
  [7]: https://archivebox.io/
  [8]: https://awesome-selfhosted.net/
  [9]: {{< relref "posts/minecraft-server-setup" >}}
  [10]: https://github.com/tphummel/owntracks-receiver
  [11]: https://github.com/louislam/uptime-kuma
  [13]: https://registry.terraform.io/providers/Telmate/proxmox/latest/docs/resources/lxc
  [14]: https://github.com/geerlingguy/ansible-role-gitlab
  [15]: https://github.com/pglombardo/PasswordPusher