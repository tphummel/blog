---
title: "Things I Lookup"
date: 2020-02-14T16:03:13-07:00
draft: false
toc: true
images:
tags:
  - reference
aliases:
  - /2020/02/14/things-i-lookup/
  - /2020/02/14/things-i-look-up/
---

## drop in css

- https://github.com/andybrewer/mvp
- https://watercss.kognise.dev/
- https://www.swyx.io/css-100-bytes
- [58 bytes of CSS to look great nearly everywhere](https://gist.github.com/JoeyBurzynski/617fb6201335779f8424ad9528b72c41)
- [Classless CSS](https://github.com/dbohdan/classless-css)

## vagrant examples

```
cat > provision.sh <<EOF
hello
EOF

chmod u+x provision.sh

cat > Vagrantfile <<EOF
Vagrant.configure("2") do |config|
  config.vm.box = "generic/rocky8"
  config.vm.provision "shell", path: "provision.sh", privileged: false
end
EOF

vagrant up
vagrant ssh
```

## bash script boilerplate

```
#!/usr/bin/env bash

set -o nounset
set -o errexit
set -o pipefail
IFS=$'\n\t'

main(){

}

main
```

## jq examples

```
cat stars-captured.json| jq -r '.[] | select((.stars >= 1000) and (.updated >= "2021-08-01") and (.lang == "JavaScript") and ((.license == "mit") or (.license == "apache-2.0") or (.license == "isc") or (.license == "bsd-2-clause") or (.license == "bsd-3-clause")))' | jq -n '[inputs]' | jq 'sort_by(-.stars)' | jq 'length'

cat stars-captured.json| jq 'select(.stars >= 1000 and .updated >= "2021-08-01")'

cat stars-captured.json| jq -r 'length'

cat *.json | jq --slurp '. | flatten | .[]' > combined.json

cat combined.json | jq '.[] .platform' | awk '{ FS="\n" count[$1]++}END{for(j in count) print j","count[j]}' | sort -t "," -k2 -nr

cat combined.json | jq -r '.[] | [.platform, .title, .hardware_compatibility, .link, .metascore, .user_score, .release_date] | @csv' > all.csv
```

## harelba/q examples

```
for i in $(seq 0 6); do echo "--$i--" && q -H -d "," "select date, count from ./year-two-sneezes-daily.csv where strftime('%w', date) = '$i' order by count desc" | (echo 'date,sneezes' && cat) | head -n 10; done

q -H -d "," "select count(*) from ./year-two-sneezes.csv"

q -H -d "," "select timestamp,type,lat,lon from ./year-two-sneezes.csv"

q -H -d "," "select min(b.date), max(b.date), sum(b.count) as sneezes from ./year-two-sneezes-daily.csv a JOIN ./year-two-sneezes-daily.csv b ON (b.date < date(a.date, '+5 day') and b.date >= a.date) group by a.date order by sneezes desc"  | (echo 'start,end,sneezes' && cat) | csvlook | head -n 10

q -H -d "," "select outcome,death_reason from ./games.csv where outcome = "loss""

q -H -d "," "select death_reason,count(game_id) from ./games.csv where outcome = 'loss' group by death_reason order by count(game_id) desc"
```

## xargs examples

```
docker volume ls -qf dangling=true | xargs -r docker volume rm
terraform state list | grep aws_route53_record | xargs "terraform state show {}"

cat face-pics-2017-inprog.csv| csvcut -c 5 | head -n1 | xargs -I {} sh -c "wget -q -O- {} | grep -o 'https.*shared\_content\/.*\.jpg' | head -n 1 | wget -q -O- -i- > ./2017/$(python -c 'import time; print time.time()').jpg

```

## pi precision

- NASA/JPL uses 15 decimal precision for pi when planning inter-planetary missions. 
- A circle with a circumference of 48 billion kilometers would be off by ~1 centimeter by cutting pi off at 15 decimals.

## redirect stdout and stderr to a file

```
ls -al > samplefile.txt 2>&1
```

## cheatsheets
- [k8s](https://github.com/LeCoupa/awesome-cheatsheets/blob/master/tools/kubernetes.sh)
- [Nodejs](https://github.com/LeCoupa/awesome-cheatsheets/blob/master/backend/node.js)
- [Docker](https://github.com/LeCoupa/awesome-cheatsheets/blob/master/tools/docker.sh)
- [Php](https://github.com/LeCoupa/awesome-cheatsheets/blob/master/languages/php.php)
- [Bash](https://github.com/LeCoupa/awesome-cheatsheets/blob/master/languages/bash.sh)

## vpn route issue
```
sudo route flush
```

## traceroute

```
traceroute -T -p 80 -n 10.0.5.4
```


## ansible: add authorized key(s) to host(s)
```
ANSIBLE_HOST_KEY_CHECKING=false ansible all -b -u ec2-user -i 10.23.1.41,10.23.1.108,10.23.1.175, -m authorized_key -a "key=https://github.com/tphummel.keys user=ec2-user"
```

## CIDR
- /8: 10.x.x.x. 16.7MM usable IPs
- /16: 10.0.x.x. 65,500 usable
- /24: 10.0.0.x. 254 usable
- /25: 126 usable
- /26: 62 usable
- /27: 30 usable
- /28: 14 usable
- /29: 6 usable

[ref](http://droptips.com/cidr-subnet-masks-and-usable-ip-addresses-quick-reference-guide-cheat-sheet)

## Chrome Screenshot of entire window 

(including below the vertical scroll - not all pages will work. SPAs which do clever viewport optimizations sometimes don't work)

```
command+option+j. command+shift+p # then type "Capture full size screenshot"
```

## sed global find/replace
```
sed -i -e 's/few/asd/g' hello.txt
```

## useful `curl` flags
- `-s` silence progress info
- Curl with redirects: `-L`
- curl headers only: `-I -X GET`
- curl insecure: `-k`
- curl: `--max-redirs`

## start ssh agent

```
eval "$(ssh-agent -s)"
```

## add key to ssh agent

```
ssh-add -K ~/.ssh/id_rsa
```

## remove host from known hosts
```
ssh-keygen -R <hostname>
ssh-keygen -R myhost.mydomain.com
```

## find things listening on 8800
```
netstat -anp | grep -i 8800
ps -ef | grep -i 8800
```

## systemd
```
systemctl stop docker
journalctl -f -u docker --since=1hr
```

## find files by size

	find / -size +1G


## find files by name

	find . -name test.png


## recursively search files for a word

	grep -nir "ldap" .

## combine stdout, stderr

	2>&1

## awk print field space delimited

	awk '{print $5}'

## Tar, untar

[https://tarball.guru/](https://tarball.guru/)

## create tarball of single file

	tar -zcvf date-range-osx64.tar.gz date-range-osx64


## Show merged pull requests between two SHAs

```
git log --oneline  8da11b6c32..ad5d336f1 | grep Merg
git log --oneline  8da11b6c32..HEAD | grep Merg
```

## git delete remote branch

	git push -d origin my-branc


## git delete local branch

	git branch -D my-branc


## mac osx keyboard commands
apple+f2 # focus apple menu

## set macosx wifi without a mouse

```
networksetup -listallhardwareports
networksetup -setairportnetwork en1 SSID password
networksetup -getairportnwor
```

## list all consul services
```
curl -k -L host:8500/v1/catalog/services | jq
curl -k -L host:8500/v1/agent/services | jq
```

## deregister consul service

	curl -k -L -X PUT host:8500/v1/agent/services | jq


## heredoc cat to file

```
cat > outfile.txt <<EOF
>some text
>to save
>EOF
```

```
cat > main.tf <<EOF
provider "oci" {
  tenancy_ocid = "ocid1.tenancy.oc1..aaaaaaaayzxt7lzjz34ttvgs7a7ht6ouzidp4c7y7kycd6corklhi46hl6ta"
  user_ocid = "<<replace with your OCID from web console>>"
  fingerprint = "<<replace with your key fingerprint - can find in web console>>"
  private_key_path = "~/.oci/oci_api_key.pem"
  region = "us-ashburn-1"
}
EOF

```

```
cat > hello.txt <<EOF
hello
EOF
```

```
# don't do variable substitution/expansion
cat > hello.js <<"EOF"
(cb) => {
  console.log(`my log message ${process.env.HELLO}`)
}
EOF
```

## signaling

	sudo kill -SIGUSR1 <pid>


## data normalization
- 1NF: All columns contain only a single value (no sets). 
- 2NF: 1NF and every non-key column depends on the entire candidate key. 
- 3NF: 2NF and every non-key column must not provide a fact about another non-key column

Sql join reference. [Venn diagrams](https://twitter.com/davidcrawshaw/status/976525292096446464/photo/1)

## restart mcafee endpoint protection
```
for i in $(ps aux | grep "[M]cAfee" | awk '{print $2}'); do sudo kill -9 $i; done
```

## more links

- [https://explainshell.com/](https://explainshell.com/)
- [https://crontab.guru/](https://crontab.guru/)
- [https://chmod-calculator.com/](https://chmod-calculator.com/)
- [http://www.dpriver.com/pp/sqlformat.htm](http://www.dpriver.com/pp/sqlformat.htm)
