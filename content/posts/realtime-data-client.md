---
date: 2013-10-13T16:03:13-07:00
draft: false
toc: true
images:
title: Realtime Data Client with Redis, Websockets, and D3
tags: [code, tetris, second-screen]
aliases:
  - /2013/10/13/realtime-data-client/
---

## what i've got

An [old php app][0] for data entry to capture results of multiplayer [Tetris][1].

## what i wanted

Realtime feedback, reports, visualizations while playing Tetris. It should be separate from the data entry application.

These visualizations could be on a second screen or tablet for the group to see between matches.

## what i did

After a new match is validated and saved, I took each player's individual performance and published the details to a [redis pub-sub][2] channel called "tetris:performances". This could allow for a range of consumers each reacting to new matches in different ways.

When a new performance arrives I emit the details to any connected socket.io clients.

The first web client I made was a [d3][4] scatterplot.

{{< figure src=/img/vHtZNHQ.png title="basic scatterplot" alt="basic scatterplot" >}}
{{< figure src=/img/TBqnf7j.png title="scatterplot with more data" alt="scatterplot with more data" >}}

Points are added to the scatterplot in real time when they are submitted via the data entry app.

{{< figure src=/img/piROBbu.png title="scatterplot with data entry" alt="scatterplot with data entry" >}}

Check out the [project code][5].

## what would come next

More web clients consuming the websocket events. Or a dashboard of graphics each using the data in different ways or listening for subsets of the data.

- A transcript showing the previous 10 matches.
- Gathering context for the previous match. Run against a panel of db queries.


  [0]: https://github.com/tphummel/tetris-db
  [1]: {{< ref tetris-primer >}}
  [2]: https://redis.io/topics/pubsub
  [4]: https://d3js.org/
  [5]: https://github.com/tphummel/junk/tree/master/socket-viz
