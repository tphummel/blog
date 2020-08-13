---
title: "Craps Data"
date: 2012-01-01T16:03:13-07:00
draft: false
toc: false
images:
tags: [craps, scorekeeping, second-screen]
aliases:
  - /2012/01/01/craps/
---

I wrote a [python cli][0] which captures the outcome of dice rolls in craps. From there I popped out some fun reports. The information is mainly for entertainment value rather than to aid decision making.

For example:

```
Most Consecutive Rolls in a Single Turn
+----------+-------+----------------+--------+
| date     | shoot | location       | throws |
+----------+-------+----------------+--------+
| 12/13/10 | Tom   | Golden Gate    |     61 |
| 05/03/10 | JD    | Golden Gate    |     45 |
| 12/13/10 | JD    | Binion's       |     33 |
| 12/12/10 | JD    | 4 Queens       |     31 |
| 05/04/10 | Nick  | El Cortez      |     29 |
| 05/04/10 | Tom   | 4 Queens       |     26 |
| 12/13/10 | Tom   | Golden Gate    |     26 |
| 05/02/10 | Nick  | El Cortez      |     23 |
| 05/02/10 | JD    | El Cortez      |     20 |
| 05/04/10 | Tom   | 4 Queens       |     20 |
+----------+-------+----------------+--------+
(updated 4/21/11)
```

---

EDIT: 2013-11-22 - dug up these old reports

{{< figure src=/img/UxszcSg.png title="Nick" >}}
{{< figure src=/img/mLukrFd.png title="Tom" >}}
{{< figure src=/img/o0me20D.png title="JD" >}}

  [0]: https://github.com/tphummel/dice-collector
