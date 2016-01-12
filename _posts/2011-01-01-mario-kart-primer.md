---
layout: post
title: Kart Primer
tags: [kart, video-games]
---

Our Kart version of choice is [Mario Kart: Double Dash!!! for Gamecube][0]. The vast majority of our play is at Baby Park, 9 laps with frantic items.

#### Official Baby Park
- 150cc. versus. 9 laps. frantic items
- 5 players. 4 active and 1 sitting.
- 50 total races in blocks of 10. Each player races 40 and sits 10.
- Draw lots to determine initial sitting order. rotate one seat to right every 10 races.
- Re-pick characters and karts each time seating changes. Seat #1 selects first and fifth, #2 second and sixth, #3 third and seventh, #4 fourth and eighth.

#### Scoring
- 1st Place = 4 points
- 2nd Place = 3 points
- 3rd Place = 2 points
- 4th Place = 1 points

#### Gap Scoring
- relative scoring. differs from overall standings because one player is always sitting out.
- measures finish position differential between players.
- on a cluster standings view, you read the column below a player's name. A positive number means the player whose name is the column title leads the player whose name is the row title. A negative number means the opposite.
- ex: Player A finishes 1st and Player B finishes 3rd. Player A is credited with 2 Gap Points relative to Player B. Player B is debited 2 Gap Points relative to Player A.

<table class="table"><caption>Example Standings</caption><tr><th>Rk</th><th>Nm</th><th>#</th><th>WP</th>

 <th>1</th>

 <th>2</th>

 <th>3</th>

 <th>4</th>

 <th>Jer</th>

 <th>Tom</th>

 <th>Dan</th>

 <th>Nic</th>

 <th>JD</th>

 </tr>

 <tr> <td>1</td> <td>Jer</td> <td>40</td> <td>118</td>

 <td > 18 </td>

 <td > 9 </td>

 <td > 6 </td>

 <td > 7 </td>

 <td>na</td>

 <td>-16</td>

 <td>-10</td>

 <td>-26</td>

 <td>-20</td>

 </tr>

 <tr> <td>2</td> <td>Tom</td> <td>40</td> <td>108</td>

 <td > 12 </td>

 <td > 11 </td>

 <td > 10 </td>

 <td > 7 </td>

 <td>+16</td>

 <td>na</td>

 <td>-2</td>

 <td>-21</td>

 <td>-25</td>

 </tr>

 <tr> <td>3</td> <td>Dan</td> <td>40</td> <td>104</td>

 <td > 9 </td>

 <td > 12 </td>

 <td > 13 </td>

 <td > 6 </td>

 <td>+10</td>

 <td>+2</td>

 <td>na</td>

 <td>-11</td>

 <td>-17</td>

 </tr>

 <tr> <td>4</td> <td>Nic</td> <td>40</td> <td>89</td>

 <td > 6 </td>

 <td > 10 </td>

 <td > 11 </td>

 <td > 13 </td>

 <td>+26</td>

 <td>+21</td>

 <td>+11</td>

 <td>na</td>

 <td>-14</td>

 </tr>

 <tr> <td>5</td> <td>JD</td> <td>40</td> <td>81</td>

 <td > 5 </td>

 <td > 8 </td>

 <td > 10 </td>

 <td > 17 </td>

 <td>+20</td>

 <td>+25</td>

 <td>+17</td>

 <td>+14</td>

 <td>na</td>

 </tr>

</table>

### Software

My friends and I started playing [Mario Kart: Double Dash for Nintendo Gamecube][0] on the day of its release in 2003. But it wasn't until 2010 that I wrote a viable program to track results.

Despite more recent versions, I feel the double item management coupled with the loosest mini-turbo handling of any iteration makes Double Dash the series' greatest entry. Baby Park stands as the ultimate arena for local multiplayer. Time Trial is also a worthwhile endeavor.

In August 2010 I began exploring the Google App Engine platform. I wrote a system to collect race results in Fall 2010.

Check out a <del>live instance</del> or [view the code][2].

The basic structure of the site allows you to create a league. The league has login credentials which can be given out to allow access to the league. Within the league you create player, venue and season entities. And within a season there are clusters which are groupings of matches.

As of 2012 the system has collected over 1000 races.

EDIT: 2013-05-12. I've taken down the GAE app. I broke it while [extracting its historical data]({% post_url 2013-05-12-exfiltrating-mario-kart-data-from-google-app-engine %}).

EDIT: 2016-01-04. I've done [some analysis]({% post_url 2016-01-04-double-dash-analysis-part-1 %}) on the extracted data.

EDIT: 2016-01-11. I've done [even more analysis]({% post_url 2016-01-11-double-dash-analysis-part-2 %}) on the extracted data.

  [0]: http://en.wikipedia.org/wiki/Mario_Kart:_Double_Dash%E2%80%BC
  [1]: http://babyparkdd.appspot.com/
  [2]: https://github.com/tphummel/gaej-kart
