---
layout: post
title: Data Collection Tradeoffs
---

There are a few tradeoffs that exist when starting a new database that you expect will be longlived. The types of datasets I'm referring to here are results, observations, or events. Examples would be results of a sporting event, weather measurements, or the way I imagine courtroom activity might be recorded. Some choices are difficult to change once history exists. The key topics I will try to define and discuss are passive vs. active, progressive vs. reflective, and the role of the data recorder.

## terms

- *activity*: the activity under observation. can be a transaction, event, competition, etc.
- *active recording*: effort required to manually extract results from an activity. results must be divined from the action and forcefully recorded.
- *passive recording*: results are pushed from the activity and recorded by a collection system, requiring zero human effort or intervention. this is the gold standard.
- *recorder*: when doing active recording, the person whose responsibility is to collect and record the activity results.
- *recorder-participant*: when doing active recording, a person who concurrently acts as both recorder and participant.
- *progressive recording*: results of an activity as recorded while the activity is still in progress. higher granularity, higher time/effort cost if using active recording. sometimes impossible with a recorder-participant.
- *reflective recording*: results of an activity as recorded upon completion. lower granularity, lower time/effort cost with active recording. more conducive to using a recorder-participant.

## data collection tradeoff

![granularity-effort graph](http://i.imgur.com/PDMbeVj.png)

Passive recording is always preferred as `Time, Effort` in the above graph is zero. This requires an embedded recording system within the activity or an external system tightly coupled to the outputs of the activity.

With active recording, if progressively recording with optimal granularity makes it impossible to use a recorder-participant, you may need to use a dedicated recorder, reduce granularity, and/or use reflective recording.

## notes on active collection systems

- *bad*: if active recording slows activity pace.
- *bad*: if active recording requires decision making by the recorder (subjective result facets).
- *bad*: if recorder-participant is forced to choose which role suffers, as doing both concurrently is impossible.
- *bad*: if bad actor in role of recorder-participant can impact accuracy to benefit themself. there is an inherent conflict of interest here if the stakes are high.
- *good*: if new active recorders can be onboarded quickly.
- *good*: if active recording with acceptible granularity allows recorder to be concurrent participant, unencumbered, unconflicted.
- *good*: if high granularity does not impact activity pace.

## conclusion

Data collection should never impact the activity itself.

- *minimal*: active, reflective, coarse recording by one of the participants.
- *good*: active, progressive, granular recording by a neutral third party.
- *best*: passive, progressive, granular recording.

The best time to start recording is at t₀ when history begins, even if it is an active system that needs to be migrated later. The second-best time to start is right now. If today is t₀, all the better.
