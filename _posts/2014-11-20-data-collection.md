---
layout: post
title: Data Collection Tradeoffs
---
Scorekeeping matters in the world. I think it might matter to me more than most people. Whether it is a notebook full of handwritten boardgame results or an information system tuned for throughput, I have some general thoughts.

There are a few tradeoffs that exist when starting a new database that you expect will be long-lived. The types of datasets I'm referring to here are results, observations, or events. Examples could be results of a sporting event, weather measurements, or the way I imagine courtroom activity might be recorded. The key topics I will try to define and discuss are passive vs. active, progressive vs. reflective, and the role of the data recorder.

## Terms

- *Activity*: The activity under observation. It can be a transaction, event, competition, etc.
- *Active Recording*: The manual extraction of results from an activity. Results must be divined from the action and forcefully recorded.
- *Passive Recording*: When results are pushed from the activity and recorded by a collection system, requiring zero human effort or intervention. This is the gold standard.
- *Recorder*: When doing active recording, the person whose responsibility it is to collect and record the activity results.
- *Participant-Recorder*: When doing active recording, a participant who concurrently acts as recorder.
- *Progressive Recording*: The results of an activity as recorded while still in progress. Yields more detailed measurements but incurs a higher time/effort cost if using active recording. Sometimes, this is impossible with a participant-recorder.
- *Reflective Recording*: The results of an activity as recorded upon completion. It offers lower detail and a lower time/effort cost with active recording. This is more conducive to using a participant-recorder.

## Data Collection Tradeoff

![granularity-effort graph](http://i.imgur.com/PDMbeVj.png)

Passive recording is always preferred as `Time, Effort` in the above graph is zero. This requires an embedded recording system within the activity or an external system tightly coupled to the outputs of the activity.

If active, progressive recording with optimal granularity makes it impossible to use a participant-recorder, you may need to use a dedicated recorder, reduce granularity, and/or use reflective recording.

## Notes on Active Collection Systems

#### Bad
- If recording slows the activity's pace.
- If recording requires decision making by the recorder (subjective result facets).
- If participant-recorder is forced to choose which role suffers, as doing both concurrently is impossible.
- If a bad actor in the role of participant-recorder can impact accuracy to benefit themself. There is an inherent conflict of interest here if the stakes are high.

#### Good
- If new active recorders can be onboarded quickly.
- If active recording with acceptible granularity allows recorder to be a concurrent participant - unencumbered, unconflicted.
- If higher granularity does not impact activity pace.

## Conclusion

Data collection should never impact the activity itself.

- *minimal*: active, reflective, coarse recording by one of the participants.
- *good*: active, progressive, granular recording by a neutral third party.
- *best*: passive, progressive, granular recording.

The best time to start recording is at t₀, when history begins, even if it is an active system that needs to be migrated later. The second-best time to start is right now. If today is t₀, all the better.
