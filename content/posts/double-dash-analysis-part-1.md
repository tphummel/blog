---
title: "Double Dash 2010-13 Part 1"
date: 2016-01-04T16:03:13-07:00
draft: false
toc: false
images:
tags: [sql, kart, video-games]
---

A few years ago, I [successfully exported][0] the [results][1] of 1,101 [Mario Kart: Double Dash!!][2] races dating from the years 2010 through 2013. In this first post, I'll look at general findings that might be of interest to fans of the game.

## Intro

The 1,101 races we've recorded can be looked at in total and then further broken down into two main categories:

- All Cup Grand Prix: 8 racers, 2 humans.
- Baby Park: 4 racers, 4 humans.

The data I exported back in 2013 resulted in flat csv files. From there, the files need a bit of massaging. The details aren't particularly interesting but can be found in a [supporting file][3].

Working with these csv files was easy with a handy tool called [q][4]. There is plenty of info in the docs but on OSX `brew install q` worked nicely for me.

With `q` installed and the csv files at hand, I could begin digging. The queries for all of the tables below can be found in a [separate file][5].

## Overall

There are 16 courses in MKDD. Here is the distribution of the 1,101 races listed in the order they appear in the game.

__Course Distribution__

|Course|Race Count|
|--- |--- |
|Luigi Circuit|37|
|Peach Beach|37|
|Baby Park|554|
|Dry Dry Desert|37|
|Mushroom Bridge|37|
|Mario Circuit|37|
|Daisy Cruiser|36|
|Waluigi Stadium|36|
|Sherbet Land|36|
|Mushroom City|36|
|Yoshi Circuit|36|
|DK Mountain|36|
|Wario Colosseum|37|
|Dino Dino Jungle|37|
|Bowser Castle|36|
|Rainbow Road|36|

---

The 33 rounds (528 races) of two-player, grand prix, all-cup present an interesting look at each course with other variables controlled (if there is such a thing as control in Mario Kart). In this mode two humans race eachother on all 16 courses with six non-human racers also competing. The novel thing about this mode is the chaos caused by the six computer-controlled racers. The expectation would be that the two human racers would finish every race in some combination of 1st and 2nd place with drones placing 3rd-8th. In practice human racers finish outside the top two slots. Looking at these results, we can see which of the 16 courses proved to be most difficult, volatile, and chaotic.

__Most Chaotic Courses__

|Course|Races|1st|2nd|3rd|4th|5th|6th|7th|8th|Points|
|--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
|Rainbow Road|66|30|14|8|5|6|1|1|1|501|
|Waluigi Stadium|66|32|21|9|2|1|0|0|1|553|
|Baby Park|66|31|24|6|3|2|0|0|0|556|
|Mario Circuit|66|31|24|9|1|1|0|0|0|563|
|Sherbet Land|66|30|28|6|1|1|0|0|0|567|
|Dry Dry Desert|66|33|28|0|2|1|1|1|0|568|
|DK Mountain|66|33|25|6|1|0|1|0|0|572|
|Luigi Circuit|66|33|27|2|4|0|0|0|0|574|
|Wario Colosseum|66|32|29|3|2|0|0|0|0|578|
|Peach Beach|66|33|27|5|1|0|0|0|0|580|
|Dino Dino Jungle|66|33|30|1|0|2|0|0|0|582|
|Bowser Castle|66|32|30|4|0|0|0|0|0|584|
|Mushroom Bridge|66|32|31|3|0|0|0|0|0|586|
|Yoshi Circuit|66|33|31|1|0|1|0|0|0|587|
|Mushroom City|66|33|30|3|0|0|0|0|0|588|
|Daisy Cruiser|66|33|32|0|1|0|0|0|0|590|


**Rainbow Road** is the most difficult course in the game. It has many naked turns and big jumps that can cause large time penalties particularly if you get caught back in the pack.

**Waluigi Stadium** is a technical course with many large and small jumps. There are plenty of other obstacles too like thwomps, fire rings, piranhas, and thick mud. Falling from 3rd to 8th place in a matter of seconds is common.

**Baby Park** might seem out of place on this list at first. It has none of the obstacles or jumps of the other 15 courses. You might argue that it isn't really a _course_ at all. It was likely something used during testing to check that lap counters were incrementing properly and race start/finish mechanics worked as expected. It is a simple oval and each of each of seven laps takes ~10 seconds. But herein lies the chaos. You can't stay out of trouble by front running quite the same way you can on any other course. If you get too far out in front you run into the back of the 8th place racer and you're right back in the fray.

# Baby Park

The Course Distribution above brings to light how much we've enjoyed playing Baby Park. The following charts look into the 500 recorded races of four-player, local multiplayer with `frantic` item boxes and `9` laps per race.

Unlike Drivers, Karts can appear multiple times in a single race. The **Barrel Train** is the clear favorite.

__Most Frequent Kart Usage__ (min. 20 races)

|Kart|Races|1st|2nd|3rd|4th|Points|Pts/Race|
|--- |--- |--- |--- |--- |--- |--- |--- |
|Barrel Train|889|299|236|190|164|2448|2.7537|
|Toad Kart|556|104|141|166|145|1316|2.3669|
|Green Fire|169|20|32|47|70|340|2.0118|
|Waluigi Racer|113|21|24|23|45|247|2.1858|
|Red Fire|109|29|33|30|17|292|2.6789|
|Turbo Yoshi|60|7|11|14|28|117|1.95|
|Toadette Kart|45|9|12|19|5|115|2.5556|

---

Since Drivers are unique in a given race, there is plenty of contention over who gets which characters. We would always play in clusters of 50 races with five players rotating into four slots, each player would race 40 of 50 races and sit out for ten. The rotation and driver re-selection would occur every ten races. Here are the most frequently selected characters, again, specifically in the 500 four-player races at Baby Park.

__Most Common Drivers__ (min. 100 races)

|Driver|Races|1st|2nd|3rd|4th|Points|Pts/Race|
|--- |--- |--- |--- |--- |--- |--- |--- |
|Toadette|500|190|127|101|82|1425|2.85|
|Diddy Kong|500|168|137|103|92|1381|2.762|
|Toad|500|140|126|118|116|1290|2.58|
|Koopa|500|124|123|127|126|1245|2.49|
|Bowser Jr.|500|92|126|148|134|1176|2.352|
|Paratroopa|500|92|122|156|130|1176|2.352|
|Waluigi|300|60|80|72|88|712|2.3733|
|Baby Luigi|241|51|56|63|71|569|2.361|
|Baby Mario|238|57|65|56|60|595|2.5|

**Toadette**, **Diddy Kong**, **Toad**, **Koopa**, **Browser Jr.**, and **Paratroopa** were picked in all 500 races. Beyond those, the strategies vary. It is interesting to see you may be better off having the heavyweight **Waluigi** in your kart than lightweights Bowser Jr. or Paratroopa.

Double Dash's title feature is having two characters in each kart. Each character can carry one item and they are rotated between the front and rear seats. Looking at common combinations adds additional color.

__Most Common Driver Pairs__ (min. 50 races)

|Driver 1|Driver 2|Races|1st|2nd|3rd|4th|Points|Avg|
|--- |--- |--- |--- |--- |--- |--- |--- |--- |
|Bowser Jr.|Koopa|166|31|43|52|40|397|2.3916|
|Diddy Kong|Toadette|145|63|45|19|18|443|3.0552|
|Diddy Kong|Paratroopa|130|33|32|38|27|331|2.5462|
|Diddy Kong|Koopa|124|40|31|30|23|336|2.7097|
|Bowser Jr.|Paratroopa|95|11|22|37|25|209|2.2|
|Baby Mario|Toadette|90|31|20|18|21|241|2.6778|
|Baby Luigi|Toad|85|20|20|25|20|210|2.4706|
|Toad|Waluigi|80|19|23|16|22|199|2.4875|
|Bowser Jr.|Toadette|76|27|18|20|11|213|2.8026|
|Koopa|Toad|75|22|26|14|13|207|2.76|
|Bowser Jr.|Toad|65|17|16|16|16|164|2.5231|
|Baby Mario|Paratroopa|58|5|17|22|14|129|2.2241|
|Paratroopa|Toadette|56|18|16|14|8|156|2.7857|
|Baby Mario|Toad|55|19|18|12|6|160|2.9091|
|Baby Luigi|Toadette|50|19|11|10|10|139|2.78|

Diddy Kong and Toadette were a monster team, finishing 1st or 2nd in 108 of 145 races they started.

  [0]: {{< ref exfiltrating-mario-kart-data-from-google-app-engine >}}
  [1]: https://github.com/tphummel/junk/blob/master/gaej-kart/script/data/csv
  [2]: {{< ref mario-kart-primer >}}
  [3]: https://github.com/tphummel/junk/blob/master/gaej-kart/script/data/README.md
  [4]: https://harelba.github.io/q/
  [5]: https://github.com/tphummel/junk/blob/master/gaej-kart/script/data/reports/README.md
