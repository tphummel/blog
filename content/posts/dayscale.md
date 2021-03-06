---
date: 2012-01-01T16:03:13-07:00
draft: false
toc: false
images:
title: Day Scale
tags: [scraping, day-scale]
aliases:
  - /2012/01/01/dayscale/
---

First conceived in December 2010, dayscale was a data aggregation and analysis website. The server is written in Java for the Google App Engine platform. The system collects weather, stock, and sport (MLB/NBA) information throughout the day and runs a faux competition between imaginary characters based on the collected data.

DOM traversal, statistical analysis, and data summarization are a few of the cornerstones of this project.

For several months the scrapers were running smoothly with little or no upkeep. Now it has fallen into disrepair though historical data is still available.

A typical day of the app (pacific time):

**The Day Before:**

- determine if the following day has "Action". Meaning, more than 5 NBA games or 10 MLB games, and stock market is open
- generate funny random title for day's competition. (such as "Damnation Feast" or "World Capitol Vengeance")
- compute mean and standard deviation for previous 15 days in each of the nine categories

**Scraping the Day:**

- 10am: scrape NYC weather. Temp, Humidity, Pressure
- 2pm: scrape S&P 500 close data. Price, Range, Volume
- 7pm: start checking every 15 minutes for whether sports games are still in progress. scrape once all are final

  - MLB:
    1. Strike Pct (strikes/total pitches)
    2. Grounder Pct (grounders/balls in play)
    3. Total OPS (on base pct + slugging pct)

  - NBA:
    1. Scoring (combined points / game)
    2. Free Throw Pct (free throws made / free throws attempted)
    3. Offensive Rebound Pct (offensive rebounds / total rebounds)

**Finalizing the Day:**

- calculate z-score for each of the nine observed values using mean and standard deviation from trailing 15 days.
- use z-scores to generate point values for each of the eight fictional characters in each of the nine categories.
- crown category winners and overall winner for the day.

You can see [the code][0] I used for the scrapers. And some [blog commentary][3].

  [0]: https://github.com/tphummel/junk/tree/master/gaej-scrapers
  [3]: https://dayscale.blogspot.com/
