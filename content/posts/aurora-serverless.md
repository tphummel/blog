---
title: "Aurora Serverless"
date: 2018-09-01T16:03:13-07:00
draft: false
toc: false
images:
tags:
  - serverless
  - sql
  - aws
---

## goal

1. mysql database and table in aurora serverless
1. lambda function to write to mysql aurora serverless
1. api gateway POST endpoint
1. api gateway api key management

## prep

Get logged in to AWS Web Console in my browser.

As of limited availability, Aurora serverless could only be reached from within a VPC. So you can't connect from a laptop over the internet. I already had an ec2 instance running for a different purpose. I'll use that to bootstrap my aurora serverless instance. I already have a mysql client installed in a docker container running on that ec2 host. I'll use that to actually connect to aurora.

```
ssh tom@my-host
sudo su
docker ps | grep mariadb
> 3f6ca7d11915        mariadb:10.1.16          "docker-entrypoint..."   17 months ago       Up 8 months         3306/tcp              dokku.mariadb.tetris-db
docker exec -it 3f6ca7d11915 bash
which mysql
> /usr/bin/mysql
```

## aurora serverless

1. Navigate to RDS in AWS Web Console.
1. Create database.
1. Choose the `Amazon Aurora` engine.
1. Choose `MySQL 5.6-compatible` edition.
1. Choose `serverless` instead of `provisioned`.
1. Fill out database name, username, password.
1. Minimum capacity: `2 units`
1. Maximum capacity: `2 units`
1. Idle pause: 5 minutes
1. choose the same vpc your ec2 instance is in.
  - your vpc must have at least two subnets across at least two availability zones
1. auto create new db subnet group
1. auto create new vpc security group
1. db cluster parameter group: `default.aurora5.6`
1. backup retention: `1 day`
1. encryption master key: `(default) aws/rds`
1. submit the form to create the db instance

## test db connection

1. edit the newly created aurora security group. Allow ingress traffic over port `3306` to `10.61.0.0/21` (my entire vpc cidr)
1. attempt a connection from my ec2 instance (above):

```
mysql -utom -hetc.cluster-craivuwnhsqo.us-west-2.rds.amazonaws.com -p

Enter password:
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 5.6.10 MySQL Community Server (GPL)

Copyright (c) 2000, 2016, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MySQL [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
+--------------------+
3 rows in set (0.01 sec)
```

## create database and table

```
CREATE DATABASE IF NOT EXISTS dice;
use dice

CREATE TABLE IF NOT EXISTS rolls (
  `id`    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `outcome` INT UNSIGNED NOT NULL,
  `rolled_by` VARCHAR(60),
  `created_by` VARCHAR(60),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

show tables;
+----------------+
| Tables_in_dice |
+----------------+
| rolls          |
+----------------+

describe rolls;
+------------+------------------+------+-----+-------------------+----------------+
| Field      | Type             | Null | Key | Default           | Extra          |
+------------+------------------+------+-----+-------------------+----------------+
| id         | int(10) unsigned | NO   | PRI | NULL              | auto_increment |
| outcome    | int(10) unsigned | NO   |     | NULL              |                |
| rolled_by  | varchar(60)      | YES  |     | NULL              |                |
| created_by | varchar(60)      | YES  |     | NULL              |                |
| created_at | timestamp        | NO   |     | CURRENT_TIMESTAMP |                |
+------------+------------------+------+-----+-------------------+----------------+
5 rows in set (0.00 sec)
```

## create api gateway

1. open API Gateway in AWS Web Console
1. enable the `Usage Plans` feature.
1. create new api. regional.
1. create new resource: `roll`
1. create new method: `post`. type: `mock`
1. create a deployment to a new stage

## create lambda function

1. open Lambda in AWS Web Console
1. create new function from scratch
1. choose api gateway as the trigger
1. let lambda create a new default iam role for the lambda function
1. choose `Node.js 8.10` runtime
1. leave the default function code in the inline editor for now.
1. save and deploy

## add database code

```
mkdir fn-code
cd !$
npm init
npm i -S mysql

cat > index.js <<EOF
const mysql = require('mysql')

exports.handler = (event, context, cb) => {
  let conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  })

  let body
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    console.log('failed to parse request body as json')
    body = {}
  }

  let res = {
    headers: {}
  }

  // undefined or null
  // https://github.com/isaacs/core-util-is/blob/master/lib/util.js#L44
  if (body.outcome == null) {
    res.statusCode = 400
    res.body = 'missing required "outcome" value'
    return cb(new Error(res.body), res)
  }

  const query = `INSERT INTO rolls (id, outcome) VALUES (null, ${conn.escape(body.outcome)});`

  conn.query(query, (err, results, fields) => {
    if (err) {
      conn.destroy()
      res.statusCode = 500
      res.body = err
      return cb(err, res)
    }

    conn.end((err) => {
      if (err) {
        res.statusCode = 500
        res.body = err
      } else {
        res.statusCode = 200
      }

      return cb(err, res)
    })
  })
}
EOF

zip -r lambda.zip .
```

1. update the lambda function code from zip file upload
1. set four environment variables
  - `DB_HOST`: `etc.cluster-craivuwnhsqo.us-west-2.rds.amazonaws.com`
  - `DB_USER`: `tom`
  - `DB_PASS`: `<your-password>`
  - `DB_NAME`: `dice`
1. under `network`, choose the same vpc and subnets as our aurora db. I chose the `default` security group.
1. click `save`

I see an error preventing save that `your role does not have vpc permissions`.  

1. In a separate tab, open `IAM` in AWS Web Console.
1. Click Roles.
1. Click `lambda_basic_execution`
1. Click Attach Policy
1. Choose `AWSLambdaVPCAccessExecutionRole`. Save

Back in the Lambda tab:
1. Attempt to save the lambda function again and it succeeds.

```
MySQL [dice]> select * from rolls;
+----+---------+-----------+------------+---------------------+
| id | outcome | rolled_by | created_by | created_at          |
+----+---------+-----------+------------+---------------------+
|  1 |       3 | NULL      | NULL       | 2018-09-01 22:36:04 |
+----+---------+-----------+------------+---------------------+
```

## invoke via api gateway

Get your API key in API Gateway under API Keys in the sidebar. Click "show key". Copy the value to clipboard.

```
 export API_KEY=<my-api-key-value>
curl -H "Content-Type: application/json" -H "x-api-key: $API_KEY" --data '{"outcome":6}' -X POST https://nvj7h4st3e.execute-api.us-west-2.amazonaws.com/prod/create-roll
```

Check for the new record in the database:

```
MySQL [dice]> select * from rolls;
+----+---------+-----------+------------+---------------------+
| id | outcome | rolled_by | created_by | created_at          |
+----+---------+-----------+------------+---------------------+
|  1 |       3 | NULL      | NULL       | 2018-09-01 22:36:04 |
|  2 |       6 | NULL      | NULL       | 2018-09-07 04:06:43 |
+----+---------+-----------+------------+---------------------+
```

## links

[lambda_proxy integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html#api-gateway-proxy-integration-lambda-function-nodejs)
