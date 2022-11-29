---
title: "2022 Thanksgiving Pounce"
date: 2022-11-27T20:54:00-08:00
draft: false
toc: false
tags: 
  - pounce
  - cards
data:
  sessions: 
    - session: "2022-11-18"
      ruleset:
        pile: 13
        bonus: 5
      hands:
        - ts: "2022-11-18T16:09:00-0700"
          players: 
            - name: "nancy"
              score: 22
              win: true
            - name: "gavin"
              score: 4
            - name: "brent"
              score: 2
            - name: "sadie"
              score: 0
            - name: "tom"
              score: -1
            - name: "nino"
              score: -15
            - name: "kate"
              score: -12
        - ts: "2022-11-18T16:20:00-0700"
          players: 
            - name: "nancy"
              score: 11
            - name: "gavin"
              score: 20
              win: true
            - name: "brent"
              score: 21
            - name: "sadie"
              score: 12
            - name: "tom"
              score: 9
            - name: "kate"
              score: 11
            - name: "alissa"
              score: 1
        - ts: "2022-11-18T16:26:00-0700"
          players: 
            - name: "nancy"
              score: -1
            - name: "gavin"
              score: -9
            - name: "brent"
              score: 1
            - name: "sadie"
              score: -1
            - name: "neela"
              score: 15
            - name: "kate"
              score: -9
            - name: "alissa"
              score: 14
              win: true
        - ts: "2022-11-18T16:31:00-0700"
          players: 
            - name: "nancy"
              score: -24
            - name: "gavin"
              score: -20
            - name: "brent"
              score: 3
            - name: "sadie"
              score: -14
            - name: "neela"
              score: 7
              win: true
            - name: "kate"
              score: -4
            - name: "alissa"
              score: -15
        - ts: "2022-11-18T16:35:00-0700"
          players: 
            - name: "nancy"
              score: 13
            - name: "gavin"
              score: -12
            - name: "brent"
              score: 0
            - name: "sadie"
              score: -13
            - name: "neela"
              score: 7
            - name: "kate"
              score: -7
            - name: "alissa"
              score: 18
              win: true
---

## Intro

## Overview

{{< pounce.inline >}}
{{ $sessions := .Page.Params.data.sessions }}
<p>Sessions: {{ len $sessions }}</p>

{{ $allHands := slice }}
{{ range $session := $sessions }}
  {{ range $hand := $session.hands }}
    {{ $hand = merge $hand (dict "ruleset" $session.ruleset) }}
    {{ $allHands = $allHands | append $hand }} 
  {{ end }}
{{ end }}

<p>Hands: {{ len $allHands }}</p>

{{ $perPlayer := dict "handCount" 0 "winCount" 0 "scoreSum" 0 }}
{{ $scoreboardByPlayer := dict }}

{{ range $hand := $allHands }}
  {{ range $handPlayer := $hand.players }}
    {{ if not (isset $scoreboardByPlayer $handPlayer.name) }}
      {{ $scoreboardByPlayer = merge $scoreboardByPlayer (dict $handPlayer.name $perPlayer)}}
    {{ end }}

    {{ $before := index $scoreboardByPlayer $handPlayer.name }}
    {{ $after := merge $before (dict "handCount" (add (index $before "handCount") 1) "winCount" (add (index $before "winCount") (cond ($handPlayer.win | default false) 1 0)) "scoreSum" (add (index $before "scoreSum") $handPlayer.score) ) }}
    {{ $scoreboardByPlayer = merge $scoreboardByPlayer (dict $handPlayer.name $after) }}
  {{ end }}
{{ end }}

<table>
  <tr>
    <th>Rank</th>
    <th>Name</th>
    <th>Wins Avg</th>
    <th>Score Avg ↓</th>
  </tr>

  {{ $sortable := slice }}
  {{ range $name, $stats := $scoreboardByPlayer }}
    {{ $scoreAvg := div $stats.scoreSum (float $stats.handCount) }}
    {{ $winAvg := div $stats.winCount (float $stats.handCount) }}
    {{ $row := merge $stats (dict "name" $name "scoreAvg" $scoreAvg "winAvg" $winAvg) }}
    {{ $sortable = append $sortable (slice $row)}}
  {{ end }}

  {{ range $i, $row := sort $sortable "scoreAvg" "desc" }}
    <tr>
      <td>{{ add $i 1 }}</td>
      <td>{{ .name | title }}</td>
      <td>
        {{ lang.NumFmt 2 .winAvg }} ({{ .winCount }} / {{ .handCount }})
      </td>
      <td>
        {{ lang.NumFmt 3 .scoreAvg }} ({{ .scoreSum }} / {{ .handCount }})
      </td>
    </tr>
  {{ end }}
</table>

{{< /pounce.inline >}}
