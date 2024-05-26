---
title: "Minecraft Server Setup"
date: 2024-05-26T08:00:00-07:00
draft: false
toc: true
tags:
  - homelab
  - proxmox
  - linux
  - ansible
  - minecraft
---

## Intro

Here are the config files which contain everything I've learned about minecraft server admin over the past year as my kids have gotten interested in Minecraft.

## Ansible Playbook

```
---
- name: Install Minecraft Server
  hosts: localhost
  gather_facts: yes
  become: yes
  vars:
    minecraft:
      version: "1.20.4"
      paper_build: "463"
      aikars_flags: "-Xms4G -Xmx4G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true"
      difficulty: "easy"
      game_mode: "survival"
      plugins:
        - url: https://download.geysermc.org/v2/projects/geyser/versions/latest/builds/latest/downloads/spigot
          dest: /root/plugins/geyser.jar
        - url: https://download.geysermc.org/v2/projects/floodgate/versions/latest/builds/latest/downloads/spigot
          dest: /root/plugins/floodgate.jar
        - url: https://hangarcdn.papermc.io/plugins/ViaVersion/ViaVersion/versions/4.9.2/PAPER/ViaVersion-4.9.2.jar
          dest: /root/plugins/viaversion.jar
        - url: https://hangarcdn.papermc.io/plugins/ViaVersion/ViaBackwards/versions/4.9.2/PAPER/ViaBackwards-4.9.2.jar
          dest: /root/plugins/viabackwards.jar
        - url: https://github.com/BlueMap-Minecraft/BlueMap/releases/download/v3.20/BlueMap-3.20-paper.jar
          dest: /root/plugins/bluemap.jar
        - url: https://github.com/plan-player-analytics/Plan/releases/download/5.6.2614/Plan-5.6-build-2614.jar
          dest: /root/plugins/plan.jar
  tasks:
    - name: Change game_mode value if hostname contains 'creative'
      set_fact:
        minecraft: "{{ minecraft | combine({'game_mode': 'creative'}, recursive=True) }}"
      when: "'creative' in ansible_hostname"

    - name: Update and upgrade packages
      apt:
        upgrade: yes
        update_cache: yes

    - name: Install Java common package
      apt:
        name: java-common
        state: present

    - name: Download Amazon Corretto JDK
      get_url:
        url: "https://corretto.aws/downloads/latest/amazon-corretto-17-x64-linux-jdk.deb"
        dest: "/tmp/amazon-corretto-17-x64-linux-jdk.deb"
        mode: '0440'

    - name: Install Amazon Corretto JDK
      ansible.builtin.apt:
        deb: "/tmp/amazon-corretto-17-x64-linux-jdk.deb"

    - name: Download PaperMC
      get_url:
        url: "https://api.papermc.io/v2/projects/paper/versions/{{ minecraft.version }}/builds/{{ minecraft.paper_build }}/downloads/paper-{{ minecraft.version }}-{{ minecraft.paper_build }}.jar"
        dest: "/root"
        mode: '0440'
        
    - name: Accept EULA
      copy:
        content: 'eula=true'
        dest: '/root/eula.txt'
        
    - name: Create Minecraft Service
      copy:
        content: |
          [Unit]
          Description=Minecraft Server
          
          [Service]
          WorkingDirectory=/root
          ExecStart=/usr/bin/java {{ minecraft.aikars_flags }} -jar /root/paper-{{ minecraft.version }}-{{ minecraft.paper_build }}.jar --nogui
          User=root
          Group=root
          Type=simple
          Restart=on-failure
          RestartSec=30s

          [Install]
          WantedBy=multi-user.target
        dest: "/etc/systemd/system/minecraft.service"
    
    - name: Set tom as admin
      copy:
        dest: "/root/ops.json"
        content: |
          [
            {
              "id" : "effec08893cf4cbd8136a5349db7fad2",
              "name" : "tphummel",
              "level": 4,
              "bypassesPlayerLimit": false
            }
          ]
        owner: root
        group: root
        mode: '0644'

    - name: Write minecraft server.properties
      template:
        src: minecraft_server_properties.j2
        dest: "/root/server.properties"

    - name: Install minecraft plugins
      get_url:
        url: "{{ item.url }}"
        dest: "{{ item.dest }}"
      with_items: "{{ minecraft.plugins }}"

    - name: Ensure bluemap config directory exists
      file:
        path: /root/plugins/BlueMap
        state: directory

    - name: Setup bluemap plugin core config
      copy:
        content: |
          metrics: false
          accept-download: true
        dest: '/root/plugins/BlueMap/core.conf'
    
    - name: Setup bluemap plugin webserver config
      copy:
        content: |
          port: 8100 # default
        dest: '/root/plugins/BlueMap/webserver.conf'

    - name: Reload systemd
      systemd:
        daemon_reload: yes

    - name: Enable and start service
      systemd:
        name: minecraft
        enabled: yes
        state: started
```

## Server.properties.j2

```
#Minecraft server properties
enable-jmx-monitoring=false
rcon.port=25575
level-seed=
gamemode={{ minecraft.game_mode }}
enable-command-block=false
enable-query=false
generator-settings={}
enforce-secure-profile=true
level-name=world
motd={{ ansible_hostname }}
query.port=25565
pvp=true
generate-structures=true
max-chained-neighbor-updates=1000000
difficulty={{ minecraft.difficulty }}
network-compression-threshold=256
max-tick-time=60000
require-resource-pack=false
use-native-transport=true
max-players=20
online-mode=true
enable-status=true
allow-flight=false
initial-disabled-packs=
broadcast-rcon-to-ops=true
view-distance=10
server-ip=
resource-pack-prompt=
allow-nether=true
server-port=25565
enable-rcon=false
sync-chunk-writes=true
resource-pack-id=
op-permission-level=4
prevent-proxy-connections=false
hide-online-players=false
resource-pack=
entity-broadcast-range-percentage=100
simulation-distance=10
rcon.password=
player-idle-timeout=0
debug=false
force-gamemode=false
rate-limit=0
hardcore=false
white-list=false
broadcast-console-to-ops=true
spawn-npcs=true
spawn-animals=true
log-ips=true
function-permission-level=2
initial-enabled-packs=vanilla
level-type=minecraft\:normal
text-filtering-config=
spawn-monsters=true
enforce-whitelist=false
spawn-protection=16
resource-pack-sha1=
max-world-size=29999984
```