---
title: "Cloudtrail Analytics with Athena, HiveQL, and S3"
date: 2017-09-10T16:03:13-07:00
draft: false
toc: false
images:
tags:
  - serverless
  - aws
aliases:
  - /2017/09/10/athena-hive/
---

## Problem
I discovered a security group which got opened too widely. I want to figure out when it happened and who did it.

## Prerequisites

This article assumes you have [CloudTrail](https://aws.amazon.com/cloudtrail/) enabled and there is a complete history of your account activity sitting in an S3 bucket.

## Approach

AWS has a product called [Athena]() that let's you run [Hive]() queries against data in S3 without needing to set up your own [Hadoop]() resources.

[An AWS blog post](https://aws.amazon.com/blogs/big-data/aws-cloudtrail-and-amazon-athena-dive-deep-to-analyze-security-compliance-and-operational-activity/) lists all of the steps to do this type of analysis. Below I'll list the exact steps I followed to answer my question.

## Solution

*next*: set request parameters as a text field instead of struct. i think because that doesn't always exist it may be messing up the schema.

```
1.05	{type=IAMUser, principalid=<redacted>, arn=arn:aws:iam::<redacted>:user/<redacted>, accountid=445387597070, invokedby=signin.amazonaws.com, accesskeyid=<redacted>, userName=<redacted>, sessioncontext={attributes={mfaauthenticated=true, creationdate=2017-05-26T15:09:42Z}, sessionIssuer=null}}	2017-05-26T20:03:07Z	ec2.amazonaws.com	AuthorizeSecurityGroupIngress	us-west-2	<redacted>	signin.amazonaws.com			5d21d727-37d1-4a16-87b6-81c7bd88a261	{"groupId":"<redacted>","ipPermissions":{"items":[{"ipProtocol":"-1","fromPort":0,"toPort":65535,"groups":{},"ipRanges":{"items":[{"cidrIp":"0.0.0.0/0"}]},"ipv6Ranges":{},"prefixListIds":{}},{"ipProtocol":"-1","fromPort":0,"toPort":65535,"groups":{},"ipRanges":{},"ipv6Ranges":{"items":[{"cidrIpv6":"::/0"}]},"prefixListIds":{}}]}}	869c102c-6e8d-46c7-9331-e93a85705bee	AwsApiCall			<redacted>									
```

## Alternative Approaches

You could run your own [EMR]() cluster (or other hadoop flavor) to query your data in S3.

You could download the date range in question and construct a pipeline of unix programs. Something along the lines of `tar *.json.tar.gz ... | jq ...` or `grep` or `sed`, etc. This could work nicely up to a certain amount of data - particularly if the team that interacts with AWS is small or you have information that can help you shrink the search window.

## Next Steps

[Consolidating CloudTrail logs from multiple AWS accounts](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-receive-logs-from-multiple-accounts.html)

[Validating the integrity of CloudTrail log files](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html)

[Security Monkey](https://github.com/Netflix/security_monkey) and [AWS Config](https://aws.amazon.com/config/) are two tools which can help teams discover misconfigured resources more proactively.
