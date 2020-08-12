---
date: 2013-10-09T16:03:13-07:00
draft: false
toc: true
images:
title: Roto-Scraper
tags: [code, baseball]
aliases:
  - /2013/10/09/roto-scraper/
---

## the league
I play in an NL-only [rotisserie baseball][16], modified ultra league that has been in existence since the 1980s. Though I've only been involved since 2008 it is an obsession.

## what we've got

We get standings updated through the most recent day's action:

{{< figure src=/img/rDbKTSW.png title="Daily Standings" alt="Daily Standings" >}}

We get standings from an arbitrary date, set by the league commissioner, through the most recent day's action:

{{< figure src=/img/KOCEJ26.png title="Historical Standings" alt="Historical Standings" >}}

## what i wanted

1. The ability to see historical standings on any single date during the season
2. The ability to see changes in the standings between two arbitrary dates

## what i did

Of primary concern was the need to preserve the state of the standings every day. At some point during each 24 hour window, I (or a script) needed to pull down the state of the standings.

If I missed a day, those standings would be unavailable thereafter. My script would pull the standings 2-3 times per day in case they were unavailable or altered.

Once I had the data I put together two initial reports.

## reports

standings through an arbitrary date:

{{< figure src=/img/gyW76gh.png title="standings thru date" alt="standings thru date" >}}

standings diff between two arbitrary dates:

{{< figure src=/img/YgJOFHa.png title="standings diff" alt="standings diff" >}}

## the final product

Check out the [code][14]. The site was originally hosted at: <del>http://roto.tphum.us</del>

## what i used

- vps: [digitalocean][3]
- deploy: [chef][15], [knife-solo][4], [capistrano][5], [a node.js/nginx/ubuntu/mongodb cookbook][6]
- app: [node.js][7], [coffee-script][8], [browserify][9], [jade][10], [twitter-bootstrap][11]
- db: [mongodb][12]

## what would come next

Rotowire makes available raw performance numbers for each team, historically (including previous seasons). Retroactively, every team's daily totals could be collected and some interesting reports could be generated, such as:

  - most/fewest X for a team in a single day
  - most/fewest X in in a Y-day span
  - best results at particular roster positions: 1B, SS, etc
  - an audit of final season standings

Support more sites such as Yahoo!, ESPN, CBS


  [0]: https://www.rotowire.com/
  [1]: https://github.com/tphummel/roto-scraper/blob/master/lib/server/scrape_loop.coffee#L51
  [3]: https://www.digitalocean.com/
  [4]: https://matschaffer.github.io/knife-solo/
  [5]: https://www.capistranorb.com/
  [6]: https://github.com/tphummel/junk/tree/master/app-base-lnmn
  [7]: https://nodejs.org
  [8]: https://coffeescript.org
  [9]: https://browserify.org/
  [10]: https://jade-lang.com/
  [11]: https://getbootstrap.com/
  [12]: https://www.mongodb.org/
  [14]: https://github.com/tphummel/onroto-standings-scraper
  [15]: https://www.opscode.com/chef/
  [16]: https://en.wikipedia.org/wiki/Fantasy_baseball#Rotisserie_League_Baseball
