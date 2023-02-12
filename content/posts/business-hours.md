---
title: "Website Business Hours"
date: 2023-02-12T14:25:00-08:00
draft: false
toc: true
tags:
- brick-and-mortar
- business
- e-commerce
---

## Background

We’re so conditioned to websites being available 24 hours a day, 7 days a week, 365 days a year. Anything less than that is caused by an unplanned outage, disaster, or some other failure. But the expectation is that everyone intends to have their web property always online. 

Most brick and mortar stores, offices, banks, restaurants, civic centers, etc are not open 24x7x365. They have posted business hours. 

## Why Limited Hours?

Let's pretend our website or service or app is so valuable, desirable, and useful that users would tolerate limited hours. As a thought experiment, why would someone not run their website 24x7x365? 

Maybe because the user base is located in a single timezone? They notice in their telemetry that usage peaks during waking hours in this time zone and drops to zero overnight. Certain internal facing business services are run only during business hours in certain geographies to save cost or for other reasons. 

Maybe because of budget? Consider having a fixed budget and certain compute requirements. You could run more powerful compute for fewer hours while staying within your budget.

Maybe your application does heavy data processing work overnight and the application is not usable while this is happening. Or it isn't useful if the data hasn't been updated recently enough. 

Maybe your community values healthy technology use and taking your website offline for periods of time can help support this. I read an article about this in recent years but can't find it now. 

## How Could You Build It?

How would you close a website when business hours are complete? You wouldn’t just want an unstyled error message or worse for a browser to timeout waiting on your server which has been taken offline. You would want a “we’re closed” sign with information about when we open again next - same as you might see if you visit your local library when it is closed. 

Technically how would you take the service offline? Let’s assume the service is hosted on a virtual linux server in Oracle Cloud Infrastructure (or comparable). You have a business hours schedule and you need to control two aspects: starting and stopping the compute, and routing requests to the correct destination. 

Starting and stopping the compute could be handled by an AWS EC2 Autoscaling (or comparable) schedule which scales the compute to zero when you close, and back up to the desired count when you open. You could either stop and start a single instance. Or completely destroy and recreate the instance at each transition - depending on if your application is stateful and any nuances related to that.

For routing, you wouldn’t want to rely on changes to a DNS record to send users to the correct destination, as it is common for clients to cache query results. So the DNS record will want to be fixed. You need a routing layer that isn’t the EC2 instance itself to manage the routing depending on whether the service is open or closed. There are probably a number of ways to achieve this but we will throw out expensive options such as a load balancer which might undermine our budgeting usecase. I would build this with a Cloudflare Worker or other lightweight edge compute. DNS points at the cloudflare worker. Depending on the time of day it will serve the static html page with the “We’re Closed” sign or forward the request to the running compute instance if we’re open. 

There are lots of interesting nuances you start to uncover as you look closer. What if there is a user still active on the website as the end of business hours approaches? Physical stores sometimes dim or flash the overhead lights and/or play an announcement over the public address system like “The mall will be closing in 15 minutes”. You could add a banner with a countdown timer at the top of the page letting users know the website will be closing soon. If it is an e-commerce website would you stay open 15 minutes longer if there is a customer actively checking out? 

## Conclusion

All of this is funny to think about and feels more more like an April Fools joke than real life. Still, I enjoyed the thought experiment and it could be useful to implement for certain niche usecases.
