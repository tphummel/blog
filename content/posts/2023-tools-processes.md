---
title: "2023 Tools and Workflows"
date: 2023-01-22T07:45:00-08:00
draft: false
toc: false
tags: 
  - notion
  - tools
  - workflows
  - ifttt
  - hey.com
  - cloudflare
  - dropbox
  - 1password
paid_services: 
  - name: Notion
    price: 48
    per_period: year
    notes: daily joural, knowledge base, project management, trackers.
  - name: Hey.com
    price: 99.00
    per_period: year
    notes: Email service in which the economics respect its users.
  - name: 1Password
    price: 59.88
    per_period: year
    notes: Password manager, developer tools, family sharing.
  - name: Dropbox
    price: 119.99
    per_period: year
    notes: Document, photo, data backup.
  - name: Feedly
    price: 72
    per_period: year
    notes: News feed manager. 
  - name: Cloudflare Warp+
    price: 4.99
    per_period: month
    notes: Optimized DNS and internet routing - some semblance of privacy.
  - name: Cloudflare Workers
    price: 5.00
    per_period: month
    notes: General purpose compute platform for cron jobs, games, tools, automation, web widgets and doodads.
---

# Tools I pay for

The highest form of flattery, something so valuable and useful that I would pay out monthly or yearly for the privileges.

{{< paidServices.inline >}}
<table>
  <tr>
    <th>Name</th>
    <th>Price</th>
    <th>Purpose</th>
  </tr>
  {{ range $service := .Page.Params.paid_services }}
    <tr>
      <td>{{ $service.name }}</td>
      <td>${{ lang.FormatNumber 2 $service.price }} / {{ $service.per_period }} </td>
      <td>{{ $service.notes }}</td>
    </tr>
  {{ end }}
</table>
{{< /paidServices.inline >}}

# Nomie

[Brandon Corbin][4] has worked tirelessly for years building [beautiful personal journaling software][5] and asking nearly nothing in return. I was happily a (small) supporter of his work monthly via Github Sponsors. Brandon has (very reasonably) [decided to move on][6] to new projects. Nomie has always been open source and Brandon has gone further by helping users self-host Nomie going forward. Thank you Brandon for everything you've built. So many people love and use your software daily.

I'm now using Nomie versions I've hosted on [Cloudlare Pages][7]:
- [Nomie 5][8]. Current version for daily use.  
- [Nomie 6][9]. Evaluating.

My favorite things I track on Nomie: [Sneezes][14], Pushups, Haircuts, Showers. 

# Other Critical Tools

- Google Calendar. I've migrated to [hey][0] for email, but I still host my personal calendar on Google. I'm interested in dedicated tools like [cal.com][1] but haven't yet looked into how to migrate to them yet.
- Google Sheets.
- Github.com.
- [Cloudflare Pages][7]. State of the art static website hosting.
- Apple Health.
- iOS Shortcuts. [Daily Wordle][13], [Daily Face Picture][12].

# Wearables / Body
- Apple Watch. 45mm,  Alumnium, Wifi Only. 
- Oura. Heritage Black, US10. 
- Fitbit. Charge HR 3 (running on fumes, screen no longer works).
- Garmin. Forerunner 220.
- Withings / Nokia Healthmate. Withings Body connected scale. 
- Oral-B iO. Connected Toothbrush. 
- BACtrack. Blood alcohol measurement. 

# Social Media

I've made my peace with using these tools in an purposeful (somewhat anti-social) way.

- [Swarm][2]. Location checkins. 
- WhatsApp. Group chat. 
- Linkedin. Professional networking. 
- Strava. Fitness. 
- Reelgood. Movie/TV journal and recommendations. 
- Untappd. Beer journal and recommendations. 
- Vivino. Wine journal and recommendations. 

# Workflows
- Feedly (read later and notes) -> IFTTT -> Google Sheets
- Pocket -> IFTTT -> Google Sheets (link/article capture)
- Peloton ([bike][16]) -> Strava -> IFTTT -> Google Sheets
- Garmin ([running][15]) -> Strava - > IFTTT -> Google Sheets
- Spotify -> Last.fm -> [Last.fm to CSV][11]
- iOS Shortcuts -> Photo + Geotag -> Dropbox ([daily face pic][12])
- Wordle -> iOS Shortcuts -> Github.com -> [Cloudflare Pages][7] ([Wordle results capture][13])
- IFTTT geofencing -> Google Sheets (commute tracking)
- Swarm -> IFTTT -> Google Sheets

# Streaming Entertainment
- Spotify
- MLB.tv
- Apple Podcasts
- Peloton
- [Calm][3]
- Apple TV+
- Netflix
- Audible
- HBO Max
- Disney+
- [Shudder][10]
- Hulu
- Amazon Prime

# Tools I'm not using in 2023
- Twitter. A car crash. Don't rubberneck. Feedly brings me the news and links from the sources I value. 


  [0]: https://hey.com
  [1]: https://cal.com
  [2]: https://swarmapp.com
  [3]: https://calm.com
  [4]: https://github.com/brandoncorbin
  [5]: https://nomie.app
  [6]: https://nomie.app/#more
  [7]: https://pages.cloudflare.com
  [8]: https://nomie5.pages.dev
  [9]: https://nomie-6.pages.dev
  [10]: https://www.shudder.com/
  [11]: https://benjaminbenben.com/lastfm-to-csv/
  [12]: https://data.tomhummel.com/recipe/face-timelapse/
  [13]: https://wordle.tomhummel.com/a/how-it-works/
  [14]: https://data.tomhummel.com/sneezes/
  [15]: https://data.tomhummel.com/running/
  [16]: https://data.tomhummel.com/swim-bike-run/
