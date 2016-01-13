---
layout: post
title: Double Dash 2010-13 Part 1
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

<table class="table"><tbody>
<tr>
  {% for head in site.data.mkdd_global_course_dist[0] %}
    <th>{{ head[0] }}</th>
  {% endfor %}
</tr>
{% for row in site.data.mkdd_global_course_dist %}
  <tr>
  {% for cell in row %}
    <td>{{ cell[1] }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</tbody></table>

---

The 33 rounds (528 races) of two-player, grand prix, all-cup present an interesting look at each course with other variables controlled (if there is such a thing as control in Mario Kart). In this mode two humans race eachother on all 16 courses with six non-human racers also competing. The novel thing about this mode is the chaos caused by the six computer-controlled racers. The expectation would be that the two human racers would finish every race in some combination of 1st and 2nd place with drones placing 3rd-8th. In practice human racers finish outside the top two slots. Looking at these results, we can see which of the 16 courses proved to be most difficult, volatile, and chaotic.

__Most Chaotic Courses__

<table class="table"><tbody>
<tr>
  {% for head in site.data.mkdd_global_course_difficulty[0] %}
    <th>{{ head[0] }}</th>
  {% endfor %}
</tr>
{% for row in site.data.mkdd_global_course_difficulty %}
  <tr>
  {% for cell in row %}
    <td>{{ cell[1] }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</tbody></table>

**Rainbow Road** is the most difficult course in the game. It has many naked turns and big jumps that can cause large time penalties particularly if you get caught back in the pack.

**Waluigi Stadium** is a technical course with many large and small jumps. There are plenty of other obstacles too like thwomps, fire rings, piranhas, and thick mud. Falling from 3rd to 8th place in a matter of seconds is common.

**Baby Park** might seem out of place on this list at first. It has none of the obstacles or jumps of the other 15 courses. You might argue that it isn't really a _course_ at all. It was likely something used during testing to check that lap counters were incrementing properly and race start/finish mechanics worked as expected. It is a simple oval and each of each of seven laps takes ~10 seconds. But herein lies the chaos. You can't stay out of trouble by front running quite the same way you can on any other course. If you get too far out in front you run into the back of the 8th place racer and you're right back in the fray.

# Baby Park

The Course Distribution above brings to light how much we've enjoyed playing Baby Park. The following charts look into the 500 recorded races of four-player, local multiplayer with `frantic` item boxes and `9` laps per race.

Unlike Drivers, Karts can appear multiple times in a single race. The **Barrel Train** is the clear favorite.

__Most Frequent Kart Usage__ (min. 20 races)

<table class="table"><tbody>
<tr>
  {% for head in site.data.mkdd_baby_kart_dist[0] %}
    <th>{{ head[0] }}</th>
  {% endfor %}
</tr>
{% for row in site.data.mkdd_baby_kart_dist %}
  <tr>
  {% for cell in row %}
    <td>{{ cell[1] }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</tbody></table>

---

Since Drivers are unique in a given race, there is plenty of contention over who gets which characters. We would always play in clusters of 50 races with five players rotating into four slots, each player would race 40 of 50 races and sit out for ten. The rotation and driver re-selection would occur every ten races. Here are the most frequently selected characters, again, specifically in the 500 four-player races at Baby Park.

__Most Common Drivers__ (min. 100 races)

<table class="table"><tbody>
<tr>
  {% for head in site.data.mkdd_baby_driver_dist[0] %}
    <th>{{ head[0] }}</th>
  {% endfor %}
</tr>
{% for row in site.data.mkdd_baby_driver_dist %}
  <tr>
  {% for cell in row %}
    <td>{{ cell[1] }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</tbody></table>

**Toadette**, **Diddy Kong**, **Toad**, **Koopa**, **Browser Jr.**, and **Paratroopa** were picked in all 500 races. Beyond those, the strategies vary. It is interesting to see you may be better off having the heavyweight **Waluigi** in your kart than lightweights Bowser Jr. or Paratroopa.

Double Dash's title feature is having two characters in each kart. Each character can carry one item and they are rotated between the front and rear seats. Looking at common combinations adds additional color.

__Most Common Driver Pairs__ (min. 50 races)

<table class="table"><tbody>
<tr>
  {% for head in site.data.mkdd_baby_drivers_dist[0] %}
    <th>{{ head[0] }}</th>
  {% endfor %}
</tr>
{% for row in site.data.mkdd_baby_drivers_dist %}
  <tr>
  {% for cell in row %}
    <td>{{ cell[1] }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</tbody></table>

Diddy Kong and Toadette were a monster team, finishing 1st or 2nd in 108 of 145 races they started.

  [0]: {% post_url 2013-05-12-exfiltrating-mario-kart-data-from-google-app-engine %}
  [1]: https://github.com/tphummel/gaej-kart/tree/master/script/data/csv
  [2]: {% post_url 2011-01-01-mario-kart-primer %}
  [3]: https://github.com/tphummel/gaej-kart/blob/master/script/data/README.md
  [4]: https://harelba.github.io/q/
  [5]: https://github.com/tphummel/gaej-kart/blob/master/script/data/reports/README.md
