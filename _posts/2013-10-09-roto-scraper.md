---
layout: post
title: Roto-Scraper
tags: [code, baseball]
---

### the league
I play in an NL-only [rotisserie baseball][16], modified ultra league that has been in existence since the 1980s. Though I've only been involved since 2008 it is an obsession.

### what we've got

We get standings updated through the most recent day's action:

![daily standings](http://i.imgur.com/rDbKTSW.png "daily standings")

We get standings from an arbitrary date, set by the league commissioner, through the most recent day's action:

![historical standings](http://i.imgur.com/KOCEJ26.png "historical standings")

### what i wanted

1. The ability to see historical standings on any single date during the season
2. The ability to see changes in the standings between two arbitrary dates

### what i did

Of primary concern was the need to preserve the state of the standings every day. At some point during each 24 hour window, I (or a script) needed to pull down the state of the standings.

If I missed a day, those standings would be unavailable thereafter. My script would pull the standings 2-3 times per day in case they were unavailable or altered.

Once I had the data I put together two initial reports.

### reports

standings through an arbitrary date:

![standings thru date](https://i.imgur.com/gyW76gh.png "standings thru date")

standings diff between two arbitrary dates:

![standings diff](https://i.imgur.com/YgJOFHa.png "standings diff")

### the final product

Check out the [code][14]. The site was originally hosted at: <del>http://roto.tphum.us</del>

### what i used

- vps: [digitalocean][3]
- deploy: [chef][15], [knife-solo][4], [capistrano][5], [a node.js/nginx/ubuntu/mongodb cookbook][6]
- app: [node.js][7], [coffee-script][8], [browserify][9], [jade][10], [twitter-bootstrap][11]
- db: [mongodb][12]

### what would come next

Rotowire makes available raw performance numbers for each team, historically (including previous seasons). Retroactively, every team's daily totals could be collected and some interesting reports could be generated, such as:

  - most/fewest X for a team in a single day
  - most/fewest X in in a Y-day span
  - best results at particular roster positions: 1B, SS, etc
  - an audit of final season standings

Support more sites such as Yahoo!, ESPN, CBS


  [0]: http://www.rotowire.com/
  [1]: https://github.com/tphummel/roto-scraper/blob/master/lib/server/scrape_loop.coffee#L51
  [3]: https://www.digitalocean.com/
  [4]: http://matschaffer.github.io/knife-solo/
  [5]: http://www.capistranorb.com/
  [6]: https://github.com/tphummel/app-base-lnmn
  [7]: http://www.nodejs.org
  [8]: http://coffeescript.org
  [9]: http://browserify.org/
  [10]: http://jade-lang.com/
  [11]: http://getbootstrap.com/
  [12]: http://www.mongodb.org/
  [14]: https://github.com/tphummel/roto-scraper
  [15]: http://www.opscode.com/chef/
  [16]: http://en.wikipedia.org/wiki/Fantasy_baseball#Rotisserie_League_Baseball
