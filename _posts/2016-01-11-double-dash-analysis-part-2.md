---
layout: post
title: Double Dash 2010-13 Part 2
tags: [kart, video-games]
---

Following [part 1][0] last week, this writeup will mention the names of the friends I played the 1,101 races of [Mario Kart: Double Dash!!][1] with. With that, it probably isn't as generally interesting to Mario Kart fans, with the exception maybe of the scoring methodology. Also see [the previous post][0] for backstory on tooling and data.

The two general classes I'll be looking at are:

- Baby Park: 4 racers, 4 humans.
- All Cup Grand Prix: 8 racers, 2 humans.

## Baby Park

The following charts look into the 500 recorded races of four-player, local multiplayer with `frantic` item boxes and `9` laps per race.

__Overall Standings__

<table class="table"><tbody>
<tr>
  {% for head in site.data.mkdd2_baby_standings[0] %}
    <th>{{ head[0] }}</th>
  {% endfor %}
</tr>
{% for row in site.data.mkdd2_baby_standings %}
  <tr>
  {% for cell in row %}
    <td>{{ cell[1] }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</tbody></table>

---

__Relative/Gap Standings__

This was the culmination of our scoring methodology. Five players would cycle in and out of four starting slots which required a way to compare players head-to-head in races which both participated. We used the same 4-3-2-1 point system as the overall standings but summed the differences between each pair of players in every race. You read downward from each column heading to get relative scores for a player, positive is points ahead, negative is points behind the opponent in the row heading on the left (ex. Dan was 263 pts ahead of JD and 94 pts behind Jeran).

<table class="table"><tbody>
<tr>
  {% for head in site.data.mkdd2_baby_gap_standings[0] %}
    <th>{{ head[0] }}</th>
  {% endfor %}
</tr>
{% for row in site.data.mkdd2_baby_gap_standings %}
  <tr>
  {% for cell in row %}
    <td>{{ cell[1] }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</tbody></table>

---

Dan may have me beat in [time trial](http://www.mariokart64.com/mkdd/matchup.php?p1=688&p2=925) but I have him at Baby Park overall and head-to-head in the two charts above.

---

__Most Frequent Kart Usage__

<table class="table"><tbody>
<tr>
  {% for head in site.data.mkdd2_baby_kart_dist[0] %}
    <th>{{ head[0] }}</th>
  {% endfor %}
</tr>
{% for row in site.data.mkdd2_baby_kart_dist %}
  <tr>
  {% for cell in row %}
    <td>{{ cell[1] }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</tbody></table>

---

__Most Common Drivers__ (min. 100 races)

<table class="table"><tbody>
<tr>
  {% for head in site.data.mkdd2_baby_driver_dist[0] %}
    <th>{{ head[0] }}</th>
  {% endfor %}
</tr>
{% for row in site.data.mkdd2_baby_driver_dist %}
  <tr>
  {% for cell in row %}
    <td>{{ cell[1] }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</tbody></table>

---

__Most Common Driver Pairs__ (min. 50 races)

<table class="table"><tbody>
<tr>
  {% for head in site.data.mkdd2_baby_drivers_dist[0] %}
    <th>{{ head[0] }}</th>
  {% endfor %}
</tr>
{% for row in site.data.mkdd2_baby_drivers_dist %}
  <tr>
  {% for cell in row %}
    <td>{{ cell[1] }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</tbody></table>

## All Cup

The 33 rounds (528 races) of two-player, grand prix, all-cup consisted of Nick and I competing against eachother and six computer racers. Each of the 33 rounds was 16 races, one at each course.

__Standings Overall__

<table class="table"><tbody>
<tr>
  {% for head in site.data.mkdd2_allcup_overall[0] %}
    <th>{{ head[0] }}</th>
  {% endfor %}
</tr>
{% for row in site.data.mkdd2_allcup_overall %}
  <tr>
  {% for cell in row %}
    <td>{{ cell[1] }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</tbody></table>

---

__Standings by Course__

<table class="table"><tbody>
<tr>
  {% for head in site.data.mkdd2_allcup_by_course[0] %}
    <th>{{ head[0] }}</th>
  {% endfor %}
</tr>
{% for row in site.data.mkdd2_allcup_by_course %}
  <tr>
  {% for cell in row %}
    <td>{{ cell[1] }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</tbody></table>

  [0]: {% post_url 2016-01-04-double-dash-analysis-part-1 %}
  [1]: {% post_url 2011-01-01-mario-kart-primer %}
