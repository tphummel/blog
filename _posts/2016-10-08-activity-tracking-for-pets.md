---
layout: post
title: Activity Tracking for Pets
tags: [fitbit,ifttt,qs]
---

# Problem
I want to see how active my dogs are when I'm at work and generally how much exercise they are getting each day.

# Goals / Constraints
- Minimize cost. Avoid subscriptions.
- Devices should automatically upload data.
- Prefer devices with long battery life.
- Own the raw activity data.

# Existing Options

There are some companies making activity trackers for dogs:

- [fitbark](https://www.fitbark.com/): $60, no subscription. 14-day battery
- [whistle](http://www.whistle.com/): $80 + $95/year. 10-day battery
- [voyce](http://voyce.com/): $200 + $95/year. 7-day battery

The exact devices, features, and pricing details aren't important. I'll summarize by saying the price points are higher than my budget, there are features beyond my scope, and maybe most importantly, the battery life is too short.

# My Solution

Fitbit makes a tracker device called [Zip](https://www.fitbit.com/zip). It does calorie, step, distance tracking for humans. It claims to run for up to 6 months on a CR2025 coin battery. It syncs data to a bluetooth enabled phone or to a PC using a USB radio dongle.

I found a used Zip on eBay for $22 shipped. It [retails](https://www.amazon.com/Fitbit-Wireless-Activity-Tracker-Magenta/dp/B0095PZHRC/ref=sr_1_3_a_it?ie=UTF8&qid=1475993423&sr=8-3) for $60 new.

I already have an internet-connected PC running 24/7 in my living room. I plugged in the Fitbit USB dongle and installed the Fitbit software.

The following steps I did for **each** of my two dogs:

1. sign up for a Fitbit user account on behalf* of your dog.
1. power on and register a Zip device to this new account.
1. sign up for an [IFTTT](https://ifttt.com) account on behalf* of your dog.
1. enable the [Google Drive Channel](https://ifttt.com/google_drive) on IFTTT.
1. enable the [Fitbit Channel](https://ifttt.com/fitbit) on IFTTT.
1. activate a [Fitbit -> Spreadsheet Recipe](https://ifttt.com/recipes/472840-log-dog-activity-to-google-sheets) on IFTTT.
1. duct tape the Fitbit Zip to your dog's collar

# Caveats

- Fitbit devices are intended for humans. The step count for a dog isn't useful for comparing to the step count for a human. It is most useful for day to day comparisons for a single dog.
- The Fitbit Zip states battery life is "up to six months". In my experience with my dogs, the battery life has been around two months per coin cell.
- Put your computer in a central place where your dogs tend to hang out. This will improve the automatic data syncing.
- Make sure if your computer loses power that you boot it once the power returns. Otherwise auto-syncing won't continue
- Fitbit will send you emails when a Zip battery is running low.
- Using the Mac OSX Fitbit app, you can be logged in to two accounts at once. Feedback from the app isn't very clear about this. But it works.

# Summary

With the steps above, I have my dogs tracking their own daily activity. They sync the data to the internet whenever they sit in the living room for a few minutes. IFTTT sends daily summaries for each dog into a row in a Google Sheet. I get emailed whenever one of their batteries is running low. When that happens, I cut the duct tape, replace the coin battery, then re-tape it.

---
\* Creating and managing multiple accounts for the same service can be a little tricky. IFTTT doesn't allow you to invoke a single channel more than once, which is why we are creating multiple accounts. Two tips help smooth this out:

1. Modern email providers will accept [address aliases](https://support.google.com/mail/answer/12096?hl=en). You can create multiple accounts for a service under distinct email addresses that all route to your single email inbox. An example would be tom@gmail.com, tom+spot@gmail.com, tom+fido@gmail.com.
2. use a password management tool to help you manage these accounts without repeating passwords, storing them insecurely, or choosing passwords that are too simple.
