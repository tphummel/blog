---
layout: post
title: Querying Waze Commute Data
tags: [code, driving]
---    

I noticed on the [Waze][0] web platform that I could see a listing of my Trips inside the "Edit Map" area.

![waze drives list](http://i.imgur.com/TcR0GVV.png "waze drives list")

I wrote an [npm][1] [module][2] for getting a list of these trips and the detailed information about each. In an [example script][3], I looked at my highest measured speeds.


## Highest Segment Speed

    +-------------------------------------------------------------------------------------------------------+
    | date       start    end      duration      name                                           meters kph  |
    +-------------------------------------------------------------------------------------------------------+
    | 2013-11-07 20:51:42 20:53:14 2 minutes     SR-90 W,Los Angeles                            2672   104  |
    | 2013-11-11 19:23:24 19:24:57 2 minutes     SR-90 W,Los Angeles                            2676   104  |
    | 2013-11-11 19:15:46 19:20:10 4 minutes     I-405 S,Los Angeles                            7618   104  |
    | 2013-11-07 20:51:03 20:51:18 a few seconds Exit 50B: Slauson Ave / Marina Fwy,Culver City 385    94   |
    | 2013-11-07 20:51:18 20:51:42 a few seconds to SR-90 W / Marina del Rey,Culver City        558    84   |
    | 2013-11-07 20:42:13 20:48:00 6 minutes     I-405 S,Los Angeles                            7958   83   |
    | 2013-11-05 17:19:05 17:19:10 a few seconds Sunset Blvd,West Hollywood                     116    79   |
    | 2013-11-11 19:22:55 19:23:24 a few seconds to SR-90 W / Marina del Rey,Culver City        564    71   |
    | 2013-11-11 19:21:17 19:22:34 a minute      I-405 S,Culver City                            1478   69   |
    +-------------------------------------------------------------------------------------------------------+

  [0]: http://www.waze.com/
  [1]: http://npmjs.org/
  [2]: https://npmjs.org/package/waze
  [3]: https://github.com/tphummel/node-waze/blob/master/example/top-speed.js
