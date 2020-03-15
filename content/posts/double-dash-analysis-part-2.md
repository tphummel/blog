---
title: "Double Dash 2010-13 Part 2"
date: 2016-01-11T16:03:13-07:00
draft: false
toc: false
images:
tags: [kart, video-games]
aliases:
  - /2016/01/11/double-dash-analysis-part-2/
---

Following [part 1][0] last week, this writeup will mention the names of the friends I played the 1,101 races of [Mario Kart: Double Dash!!][1] with. With that, it probably isn't as generally interesting to Mario Kart fans, with the exception maybe of the scoring methodology. Also see [the previous post][0] for backstory on tooling and data.

The two general classes I'll be looking at are:

- Baby Park: 4 racers, 4 humans.
- All Cup Grand Prix: 8 racers, 2 humans.

## Baby Park

The following charts look into the 500 recorded races of four-player, local multiplayer with `frantic` item boxes and `9` laps per race.

__Overall Standings__

|Name|Races|1st|2nd|3rd|4th|Points|Avg|
|--- |--- |--- |--- |--- |--- |--- |--- |
|Jeran|361|160|89|63|49|1082|2.9972|
|Tom|426|120|136|99|71|1157|2.716|
|Dan|425|131|112|106|76|1148|2.7012|
|Nick|324|33|76|118|97|693|2.1389|
|JD|424|56|84|110|174|870|2.0519|
|Guest|40|0|3|4|33|50|1.25|

---

__Relative/Gap Standings__

This was the culmination of our scoring methodology. Five players would cycle in and out of four starting slots which required a way to compare players head-to-head in races which both participated. We used the same 4-3-2-1 point system as the overall standings but summed the differences between each pair of players in every race. You read downward from each column heading to get relative scores for a player, positive is points ahead, negative is points behind the opponent in the row heading on the left (ex. Dan was 263 pts ahead of JD and 94 pts behind Jeran).

||Dan|JD|Jeran|Guest|Nick|Tom|
|--- |--- |--- |--- |--- |--- |--- |
|Dan|---|-263|+94|-41|-147|+15|
|JD|+263|---|+268|-22|+16|+235|
|Jeran|-94|-268|---|-71|-205|-80|
|Guest|+41|+22|+71|---|+29|+37|
|Nick|+147|-16|+205|-29|---|+161|
|Tom|-15|-235|+80|-37|-161|---|

---

Dan may have me beat in [time trial](http://www.mariokart64.com/mkdd/matchup.php?p1=688&p2=925) but I have him at Baby Park overall and head-to-head in the two charts above.

---

__Most Frequent Kart Usage__

|Kart|Total|Jeran|JD|Nick|Dan|Tom|Guest|
|--- |--- |--- |--- |--- |--- |--- |--- |
|Barrel Train|889|351|125|40|192|181|0|
|Toad Kart|556|10|109|228|16|183|10|
|Green Fire|169|0|125|10|10|24|0|
|Waluigi Racer|113|0|30|0|77|0|6|
|Red Fire|109|0|0|5|100|4|0|
|Turbo Yoshi|60|0|35|10|15|0|0|
|Toadette Kart|45|0|0|25|0|20|0|
|Koopa Dasher|19|0|0|0|0|14|5|
|Bloom Coach|15|0|0|0|15|0|0|
|Wario Car|10|0|0|6|0|0|4|
|Bullet Blaster|5|0|0|0|0|0|5|
|Para Wing|5|0|0|0|0|0|5|
|Parade Kart|5|0|0|0|0|0|5|

---

__Most Common Drivers__ (min. 100 races)

|Driver|Total|Jeran|JD|Nick|Dan|Tom|Guest|
|--- |--- |--- |--- |--- |--- |--- |--- |
|Bowser Jr.|500|10|218|90|51|131|0|
|Diddy Kong|500|166|20|45|183|81|5|
|Koopa|500|80|136|90|39|155|0|
|Paratroopa|500|20|41|222|105|101|11|
|Toad|500|100|135|40|93|132|0|
|Toadette|500|216|18|5|127|124|10|
|Waluigi|300|0|65|15|187|33|0|
|Baby Luigi|241|30|40|57|35|55|24|
|Baby Mario|238|90|10|68|10|40|20|
|Yoshi|76|0|60|10|0|0|6|
|Peach|75|0|75|0|0|0|0|
|Daisy|20|0|20|0|0|0|0|
|Luigi|20|0|10|0|10|0|0|
|Mario|20|10|0|0|10|0|0|
|Wario|10|0|0|6|0|0|4|

---

__Most Common Driver Pairs__ (min. 50 races)

|Driver 1|Driver 2|Total|Jeran|JD|Nick|Dan|Tom|Guest|
|--- |--- |--- |--- |--- |--- |--- |--- |--- |
|Bowser Jr.|Koopa|166|0|75|25|15|51|0|
|Diddy Kong|Toadette|145|81|0|0|44|20|0|
|Diddy Kong|Paratroopa|130|5|0|30|65|30|0|
|Diddy Kong|Koopa|124|50|20|15|19|20|0|
|Bowser Jr.|Paratroopa|95|0|15|55|10|15|0|
|Baby Mario|Toadette|90|60|0|0|10|15|5|
|Baby Luigi|Toad|85|10|30|10|15|20|0|
|Toad|Waluigi|80|0|5|0|51|24|0|
|Bowser Jr.|Toadette|76|10|18|0|13|35|0|
|Koopa|Toad|75|10|0|20|5|40|0|
|Bowser Jr.|Toad|65|0|40|0|5|20|0|
|Baby Mario|Paratroopa|58|0|0|58|0|0|0|
|Paratroopa|Toadette|56|15|0|5|0|36|0|
|Baby Mario|Toad|55|30|10|0|0|15|0|
|Baby Luigi|Toadette|50|20|0|0|20|5|5|

## All Cup

The 33 rounds (528 races) of two-player, grand prix, all-cup consisted of Nick and I competing against eachother and six computer racers. Each of the 33 rounds was 16 races, one at each course.

__Standings Overall__

|name|races|f1|f2|f3|f4|f5|f6|f7|f8|pts|
|--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
|Tom|528|282|184|33|14|9|2|2|2|4579|
|Nick|528|232|247|33|9|6|1|0|0|4550|

---

__Standings by Course__

|Course|Name|Total|1st|2nd|3rd|4th|5th|6th|7th|8th|Points|
|--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
|Baby Park|Tom|33|24|4|4|1|0|0|0|0|300|
|Baby Park|Nick|33|7|20|2|2|2|0|0|0|256|
|Bowser Castle|Tom|33|18|13|2|0|0|0|0|0|296|
|Bowser Castle|Nick|33|14|17|2|0|0|0|0|0|288|
|DK Mountain|Nick|33|18|12|3|0|0|0|0|0|294|
|DK Mountain|Tom|33|15|13|3|1|0|1|0|0|278|
|Daisy Cruiser|Tom|33|22|11|0|0|0|0|0|0|308|
|Daisy Cruiser|Nick|33|11|21|0|1|0|0|0|0|282|
|Dino Dino Jungle|Nick|33|20|11|1|0|1|0|0|0|297|
|Dino Dino Jungle|Tom|33|13|19|0|0|1|0|0|0|285|
|Dry Dry Desert|Nick|33|21|10|0|1|0|1|0|0|296|
|Dry Dry Desert|Tom|33|12|18|0|1|1|0|1|0|272|
|Luigi Circuit|Nick|33|16|17|0|0|0|0|0|0|296|
|Luigi Circuit|Tom|33|17|10|2|4|0|0|0|0|278|
|Mario Circuit|Tom|33|19|10|4|0|0|0|0|0|294|
|Mario Circuit|Nick|33|12|14|5|1|1|0|0|0|269|
|Mushroom Bridge|Tom|33|20|12|1|0|0|0|0|0|302|
|Mushroom Bridge|Nick|33|12|19|2|0|0|0|0|0|284|
|Mushroom City|Tom|33|23|9|1|0|0|0|0|0|308|
|Mushroom City|Nick|33|10|21|2|0|0|0|0|0|280|
|Peach Beach|Tom|33|17|13|3|0|0|0|0|0|292|
|Peach Beach|Nick|33|16|14|2|1|0|0|0|0|288|
|Rainbow Road|Nick|33|23|5|2|2|1|0|0|0|293|
|Rainbow Road|Tom|33|7|9|6|3|5|1|1|1|208|
|Sherbet Land|Tom|33|23|9|0|0|1|0|0|0|305|
|Sherbet Land|Nick|33|7|19|6|1|0|0|0|0|262|
|Waluigi Stadium|Nick|33|19|8|5|0|1|0|0|0|287|
|Waluigi Stadium|Tom|33|13|13|4|2|0|0|0|1|266|
|Wario Colosseum|Tom|33|19|10|2|2|0|0|0|0|290|
|Wario Colosseum|Nick|33|13|19|1|0|0|0|0|0|288|
|Yoshi Circuit|Tom|33|20|11|1|0|1|0|0|0|297|
|Yoshi Circuit|Nick|33|13|20|0|0|0|0|0|0|290|

  [0]: {{< ref double-dash-analysis-part-1 >}}
  [1]: {{< ref mario-kart-primer >}}
