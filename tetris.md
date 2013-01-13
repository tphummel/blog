---
layout: default
title: Tetris Primer
tags: [tetris]
---

## Tetris Primer

In 2004, my college roommates and I started playing a multiplayer variation of tetris called [The New Tetris for Nintendo 64][0]. For the uninitiated this version of tetris hinges on building [monosquares and multisquares][4]

What began as a simple spreadsheet turned into an elaborate spreadsheet and finally into a PHP/MySQL web application.

As of March 2012 we had played 4000 matches accounting for 300 human hours of official gameplay time.

An [instance is live][1] or you can [look at the code][2]. I also dabbled with some [standalone python scripting][3] with Mysql Stored Procedures.

### Specifications

**Rules:** 

+ We play [The New Tetris for Nintendo 64][0] on marathon mode with directed garbage.
+ 2-4 players at a time.
+ Matches which for any reason are lost prior to recording all stats are mucked.

**Useful Terms:**

*Win Rank:* Rank as determined by longevity. "#1" was the last player standing. Ties for 2nd or 3rd are possible. (aka "Wrank")

*Efficiency Rank:* Rank as determined by lines/second ratio descending. Ties are possible for 1st, 2nd, or 3rd positions. (aka "Erank")

*Box:* (also cube, square) [monosquare or multisquare][4] - perfect 4x4 square with no holes or overhanging pieces.

*Christmas:* a deluge of red and green "S" pieces.

*Line Dependence:* poor planning which requires 2+ lines to save your butt.

*"Oh Oh":* A round of zero lines. Traditionally zero lines and time under 1 minute ("oh" lines, "oh" minutes), but instances have occurred with zero lines in longer than 59 seconds.

*Natural:* An arbitrary distinction for a round of vague excellence. Specifically a round with more lines than the minute-seconds, less the colon, run together as a number (exs: 160 lines in 1:40, 205 lines in 2:00, 50 lines in 0:40).

*Exact Natural:* See "Natural" above. But means player's result was precisely a Natural (exs: 154 lines in 1:54. 45 lines in 0:45). As of 3/3/2012, there have been 28 instances in recorded history (2 in 4p, 7 in 3p, 19 in 2p).

*"S" Round:* A round in which a player averages 1.0 line per second played (ex: 100+ lines in 1:40, 55 lines in 0:50).

----

### Example Reports

<!-- SELECT m.matchdate as date, p.username as plyr, l.locationname as site, (select count(playerid) from playermatch where matchid = pm.matchid) as mode, pm.lines, concat("0:",pm.time) as time, pm.wrank as wrk, pm.erank as erk FROM playermatch pm, player p, tntmatch m, location l WHERE pm.matchid = m.matchid AND p.playerid = pm.playerid AND m.location = l.locationid AND pm.time < 60 AND (select count(playerid) from playermatch where matchid = pm.matchid) IN (4,3,2) ORDER BY pm.lines DESC LIMIT 10; -->

<pre>
Most Lines Under 1 Minute, All Time (as of 3/3/2012)

+------------+------+-------------+------+-------+------+-----+-----+
| date       | plyr | site        | mode | lines | time | wrk | erk |
+------------+------+-------------+------+-------+------+-----+-----+
| 2007-02-28 | Dan  | 1217        |    3 |   156 | 0:53 |   3 |   1 |
| 2007-04-29 | Dan  | 1217        |    2 |   142 | 0:54 |   1 |   1 |
| 2007-05-20 | Dan  | 1217        |    2 |   132 | 0:58 |   1 |   1 |
| 2011-08-13 | Dan  | Mt. Johnson |    2 |   129 | 0:56 |   1 |   1 |
| 2011-08-13 | JD   | Mt. Johnson |    2 |   121 | 0:59 |   1 |   1 |
| 2007-03-21 | JD   | 1217        |    3 |   109 | 0:57 |   1 |   1 |
| 2007-03-17 | JD   | 1217        |    3 |   109 | 0:57 |   1 |   1 |
| 2007-03-22 | Dan  | 1217        |    2 |   109 | 0:53 |   1 |   1 |
| 2007-03-30 | JD   | 1217        |    2 |   109 | 0:59 |   1 |   1 |
| 2011-07-22 | Dan  | Mt. Johnson |    2 |   108 | 0:53 |   1 |   1 |
+------------+------+-------------+------+-------+------+-----+-----+
</pre>
    
---

<!-- SELECT m.matchdate as date, p.username as plyr, l.locationname as site, pm.lines, concat(floor(pm.time/60),":",lpad(mod(pm.time,60),2,"0")) as time, round(pm.lines/pm.time,3) as lps, pm.wrank as wrk, pm.erank as erk FROM playermatch pm, player p, tntmatch m, location l WHERE pm.matchid = m.matchid AND p.playerid = pm.playerid AND m.location = l.locationid AND pm.lines > 0 AND (select count(playerid) from playermatch where matchid = pm.matchid) IN (4) ORDER BY pm.lines/pm.time DESC LIMIT 10; -->

<pre>
Highest Lines per Second Ratio, 4P Only, All-Time (as of 3/3/2012)

+------------+------+-------------+-------+------+-------+-----+-----+
| date       | plyr | site        | lines | time | lps   | wrk | erk |
+------------+------+-------------+-------+------+-------+-----+-----+
| 2011-03-19 | Tom  | 14211       |   129 | 1:06 | 1.955 |   4 |   1 |
| 2007-05-11 | Dan  | 1217        |   230 | 2:07 | 1.811 |   1 |   1 |
| 2008-04-25 | Tom  | 425         |   285 | 2:39 | 1.792 |   1 |   1 |
| 2011-06-04 | Dan  | Mt. Johnson |    85 | 0:48 | 1.771 |   4 |   1 |
| 2007-05-10 | Dan  | 1217        |   184 | 1:45 | 1.752 |   1 |   1 |
| 2007-03-20 | Dan  | 1217        |   168 | 1:37 | 1.732 |   3 |   1 |
| 2004-05-09 | Tom  | 23C         |   134 | 1:20 | 1.675 |   2 |   1 |
| 2008-04-25 | Dan  | 425         |    89 | 0:54 | 1.648 |   4 |   2 |
| 2011-03-19 | Tom  | 14211       |   133 | 1:21 | 1.642 |   4 |   1 |
| 2007-03-20 | Dan  | 1217        |    90 | 0:55 | 1.636 |   4 |   1 |
+------------+------+-------------+-------+------+-------+-----+-----+
</pre>

  [0]: http://en.wikipedia.org/wiki/The_New_Tetris
  [1]: http://tphummel.byethost6.com/tnt/
  [2]: https://github.com/tphummel/tetris-db
  [3]: https://github.com/tphummel/tetris-report
  [4]: http://tetris.wikia.com/wiki/Square_Platforming