---
title: "CI/CD Quick Reference"
date: 2021-10-01T10:03:13-07:00
draft: false
toc: true
tags:
  - ci
  - cd
  - github
  - travis
  - github-actions
  - build
  - deploy
  - reference
---

## Intro

This page is meant as a cache of my continuous integration/deployment configs all in one place for quick reference. It is a point in time snapshot which prioritizes localizing the content here as opposed to having it be perfectly in sync with what is actually in the github repos. See the related repo link to get the very latest. That said these configs don't tend to churn terribly fast once they are working. 

## Github Actions

### tphummel/bobby-witt [node.js]
[repo](https://github.com/tphummel/bobby-witt)

```yaml
name: Node.js CI

on: [push]

jobs:  
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x]

    steps:
    - uses: actions/checkout@v1
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - name: npm install, build, and test
      run: |
        npm ci
        npm test
      env:
        CI: true
```

### tphummel/cloud-cron [node.js, tags, s3, lambda]
[repo](https://github.com/tphummel/cloud-cron)

```yaml
name: Node.js Build and Deploy

on: [push]

jobs:
  deploy-app:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [12.x]
    steps:
    - uses: actions/checkout@v2
    - uses: butlerlogic/action-autotag@1.0.2
      if: github.ref == 'refs/heads/master'
      with:
        GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
      env:
        CI: true
    - uses: actions/setup-python@v1
      if: github.ref == 'refs/heads/master'
      with:
        python-version: '3.7'
    - name: Install aws-cli
      if: github.ref == 'refs/heads/master'
      run: |
        set -x
        pip3 install --user awscli
        which aws
        aws --version
    - name: archive lambda code
      if: github.ref == 'refs/heads/master'
      run: |
        set -x
        zip -r lambda.zip .
    - name: fetch tags
      run: git fetch --depth=1 origin +refs/tags/*:refs/tags/*
      if: github.ref == 'refs/heads/master'
    - name: Upload lambda code to s3
      if: github.ref == 'refs/heads/master'
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      run: |
        set -x
        aws s3 cp lambda.zip s3://${{ secrets.bucket_name }}/code/master/lambda.zip
        aws s3 cp lambda.zip s3://${{ secrets.bucket_name }}/code/master/$GITHUB_SHA/lambda.zip

        echo "checking if there is are git tags on HEAD ..."
        GIT_TAGS=$(git tag --points-at HEAD)
        if [ -n "$GIT_TAGS" ] ; then
          for tag in $GIT_TAGS
          do
            echo "tag was found for this commit: $tag"
            aws s3 cp lambda.zip s3://${{ secrets.bucket_name }}/code/master/$tag/lambda.zip
          done
        else
          echo "no tags on this commit, skipping..."
        fi
```

### tphummel/cloud-static [hugo, s3]

[repo](https://github.com/tphummel/cloud-static)

```yaml
name: Static Website Build and Deploy

on: [push]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Install dependencies
      run: |
        wget https://github.com/gohugoio/hugo/releases/download/v0.34/hugo_0.34_Linux-64bit.tar.gz
        tar xzvf hugo_0.34_Linux-64bit.tar.gz
        sudo mv hugo /usr/local/bin/
        sudo wget https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 -O /usr/local/bin/jq
        sudo chmod o+x /usr/local/bin/jq
    - name: Build Website
      run: hugo
      env:
        HUGO_ENV: production
    - name: Install aws-cli
      if: github.ref == 'refs/heads/master'
      run: |
        set -x
        pip3 install --user awscli
        which aws
        aws --version
    - name: Upload website content to s3
      if: github.ref == 'refs/heads/master'
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      run: |
        set -x
        aws s3 sync --size-only public/ s3://<my-bucket>/
```

### tphummel/node-craps [node.js]

[repo](https://github.com/tphummel/node-craps)

```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x, 15.x, 16.x]

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm ci
    - run: npm test
```

### tphummel/nightly-onroto [node.js, cron, releases]

[repo](https://github.com/tphummel/nightly-onroto)

```yaml
name: Capture Standings Each Morning

# for diagnostic
# on: workflow_dispatch

# scheduled
on:
  schedule:
    # * is a special character in YAML so you have to quote this string
    # 2:01pm UTC every day.
    # 7:01am pacific (UTC-7)
    - cron:  '1 14 * * *'

jobs:

  build:
    runs-on: ubuntu-latest
    steps:
    # not checking out code. not needed
    # - name: obligatory checkout step
    #   uses: actions/checkout@v1
    - name: Use Node.js 14.x
      uses: actions/setup-node@v1
      with:
        node-version: 14.x

    - name: download and parse standings data
      run: |
        set -x

        wget http://stedolan.github.io/jq/download/linux64/jq
        chmod +x ./jq

        ./jq --version

        npm install -g onroto-standings-scraper
        curl https://baseball5.onroto.com/baseball/webnew/display_stand.pl\?"$ONROTO_LEAGUE_ID"\&session_id\="$ONROTO_SESSION_TOKEN" > standings.html

        # /home/runner/work/nightly-onroto/nightly-onroto

        onroto-standings-scraper $(pwd)/standings.html > $(pwd)/standings.json

        standings_date=$(./jq -r ".standingsDate" standings.json)
        cp standings.html "$standings_date.html"
        cp standings.json "$standings_date.json"

        # https://docs.github.com/en/actions/reference/workflow-commands-for-github-actions#setting-an-environment-variable
        echo "standings_date=$standings_date" >> $GITHUB_ENV
      env:
        ONROTO_SESSION_TOKEN: ${{ secrets.ONROTO_SESSION_TOKEN }}
        ONROTO_LEAGUE_ID: ${{ secrets.ONROTO_LEAGUE_ID}}

    - uses: "marvinpinto/action-automatic-releases@latest"
      with:
        repo_token: "${{ secrets.GITHUB_TOKEN }}"
        automatic_release_tag: "${{ env.standings_date }}"
        prerelease: false
        title: "${{ env.standings_date }}"
        files: |
          ${{ env.standings_date}}.json
          standings.json
          ${{ env.standings_date}}.html
          standings.html
```


## Travis CI

### tphummel/blog [hugo, s3]

[repo](https://github.com/tphummel/blog)

```yaml
before_install:
  - wget https://github.com/gohugoio/hugo/releases/download/v0.87.0/hugo_extended_0.87.0_Linux-64bit.tar.gz
  - tar xzvf hugo_extended_0.87.0_Linux-64bit.tar.gz
  - sudo mv hugo /usr/local/bin/
  - sudo wget https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 -O /usr/local/bin/jq
  - sudo chmod o+x /usr/local/bin/jq

before_script:
  - hugo version
  - jq --version

script:
  - hugo
  - make ci.json

deploy:
  provider: s3
  access_key_id: $AWS_ACCESS_KEY_ID
  secret_access_key: $AWS_SECRET_ACCESS_KEY
  local_dir: public
  bucket: "tomhummel.com"
  skip_cleanup: true
  on:
    branch: master

notifications:
  slack:
    rooms:
      - "${SLACK_TOKEN}#ops"
    on_pull_requests: true
```

### tphummel/node-bowling [node.js, npm]

[repo](https://github.com/tphummel/node-bowling)

```yaml
language: node_js
cache:
  directories:
  - node_modules
node_js:
  - '10'
  - '12'
  - '14'
  - '15'
deploy:
  provider: npm
  email: tphummel@gmail.com
  on:
    tags: true
  api_key:
    secure: lta7daXp7pt9Z6syCHXpJXyRCDTFZYpvXeMWbn4FncWreuRZKoiQj89xMB6JlKAtyqrgsOG2aXgX9j4IhBS6sAt11HWq742qbvmP+Ziq0Dj05oHVVlS7QEQt6UDeGHTzx+5V9jTq4yG6NWOrXYCaG/zWbWLO/02llRB15M1JTeA=
```

### tphummel/date-range [node.js]

[repo](https://github.com/tphummel/date-range)

```yaml
language: node_js
node_js:
  - "12"
  - "10"
  - "8"
install: npm ci
test: npm test
```

### tphummel/data.tomhummel.com [hugo, s3]

[repo](https://github.com/tphummel/data.tomhummel.com)

```yaml
before_install:
  - wget https://github.com/gohugoio/hugo/releases/download/v0.34/hugo_0.34_Linux-64bit.tar.gz
  - tar xzvf hugo_0.34_Linux-64bit.tar.gz
  - sudo mv hugo /usr/local/bin/
  - sudo wget https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 -O /usr/local/bin/jq
  - sudo chmod o+x /usr/local/bin/jq

before_script:
  - hugo version
  - jq --version

script:
  - hugo

before_deploy:
  - make public/ci.json

deploy:
  provider: s3
  access_key_id: $AWS_ACCESS_KEY_ID
  secret_access_key: $AWS_SECRET_ACCESS_KEY
  local_dir: public/
  bucket: "data.tomhummel.com"
  skip_cleanup: true
  on:
    branch: master
```

### tphummel/tetris-db [php]

[repo](https://github.com/tphummel/tetris-db)

```yaml
language: php
php:
  - 5.6
  - 5.5
  - 5.4
  - hhvm
script: "./bin/test"
```

### lapsrun/laps.run [hugo, s3, profiling]

[repo](https://github.com/lapsrun/laps.run)

```yaml
# https://docs.travis-ci.com/user/customizing-the-build/#the-build-lifecycle
# https://docs.travis-ci.com/user/environment-variables/

dist: trusty
sudo: false

env:
  global:
    - PATH="$HOME/bin:$HOME/.local/bin:$PATH"

before_install:
  - date -u +'%Y-%m-%dT%H:%M:%S.%3NZ' > before_install-start
  - date -u +'%Y-%m-%dT%H:%M:%S.%3NZ' > before_install-end

install:
  - date -u +'%Y-%m-%dT%H:%M:%S.%3NZ' > install-start
  - wget https://github.com/gohugoio/hugo/releases/download/v0.48/hugo_0.48_Linux-64bit.tar.gz
  - tar xzvf hugo_0.48_Linux-64bit.tar.gz
  - mkdir -p ~/bin
  - mv hugo ~/bin/
  - wget https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 -O ~/bin/jq
  - chmod +x ~/bin/jq
  - wget https://github.com/mikefarah/yq/releases/download/2.1.1/yq_linux_amd64 -O ~/bin/yq
  - chmod +x ~/bin/yq
  - pip install --user awscli
  - date -u +'%Y-%m-%dT%H:%M:%S.%3NZ' > install-end

before_script:
  - date -u +'%Y-%m-%dT%H:%M:%S.%3NZ' > before_script-start
  - make build.yml
  - yq w -i build.yml timing.before_install.start "$(cat before_install-start)"
  - yq w -i build.yml timing.before_install.end "$(cat before_install-end)"
  - yq w -i build.yml timing.install.start "$(cat install-start)"
  - yq w -i build.yml timing.install.end "$(cat install-end)"
  - yq w -i build.yml timing.before_script.start "$(cat before_script-start)"

  - yq w -i build.yml versions.hugo "$(hugo version)"
  - yq w -i build.yml versions.jq "$(jq --version)"
  - yq w -i build.yml versions.yq "$(yq --version)"
  - yq w -i build.yml versions.aws "$(aws --version)"
  - yq w -i build.yml timing.before_script.end "$(date -u +'%Y-%m-%dT%H:%M:%S.%3NZ')"

script:
  - yq w -i build.yml timing.script.start "$(date -u +'%Y-%m-%dT%H:%M:%S.%3NZ')"
  - ./bin/travis-script.sh
  - yq w -i build.yml html_total_loc "$(find public/ -name '*.html' | xargs wc -l | grep total | awk '{print $1}')"
  - yq w -i build.yml all_tracks_list_file_size_bytes "$(ls -l public/report/all/index.html | awk '{print $5}'| tail -n 1)"
  - yq w -i build.yml timing.script.end "$(date -u +'%Y-%m-%dT%H:%M:%S.%3NZ')"

after_success:
  - yq w -i build.yml result "$TRAVIS_TEST_RESULT"

  - if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then yq new timing.after_success.start "$(date -u +'%Y-%m-%dT%H:%M:%S.%3NZ')" > deploy-preview.yml; fi
  - if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then yq w -i deploy-preview.yml settings.aws_access_key_id "$AWS_ACCESS_KEY_ID"; fi
  - if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then ./bin/deploy-preview-site.sh; fi
  - if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then yq w -i deploy-preview.yml timing.after_success.end "$(date -u +'%Y-%m-%dT%H:%M:%S.%3NZ')"; fi

after_failure:
  - yq w -i build.yml result "$TRAVIS_TEST_RESULT"

before_deploy:
  - yq new timing.before_deploy.start "$(date -u +'%Y-%m-%dT%H:%M:%S.%3NZ')" > deploy-production.yml
  - yq w -i deploy-production.yml settings.aws_access_key_id "$AWS_ACCESS_KEY_ID"
  - sed -i -e "s/123456abcdef/$TRAVIS_COMMIT/" public/index.html
  - sed -i -e "s/0000000000/$TRAVIS_BUILD_NUMBER/" public/index.html
  - yq w -i deploy-production.yml timing.before_deploy.end "$(date -u +'%Y-%m-%dT%H:%M:%S.%3NZ')"

deploy:
  - provider: s3
    access_key_id: $AWS_ACCESS_KEY_ID
    secret_access_key: $AWS_SECRET_ACCESS_KEY
    local_dir: public/
    bucket: "laps.run"
    skip_cleanup: true
    on:
      repo: lapsrun/laps.run
      branch: master

after_deploy:
  - yq w -i deploy-production.yml timing.after_deploy.start "$(date -u +'%Y-%m-%dT%H:%M:%S.%3NZ')"
  - yq w -i deploy-production.yml timing.after_deploy.end "$(date -u +'%Y-%m-%dT%H:%M:%S.%3NZ')"

after_script:
  - yq w -i build.yml timing.after_script.start "$(date -u +'%Y-%m-%dT%H:%M:%S.%3NZ')"
  - if [ "$TRAVIS_SECURE_ENV_VARS" == "true" ]; then aws s3 cp build.yml s3://laps.run-ops-data-private/build/$TRAVIS_BUILD_NUMBER.yml; fi
  - if [ "$TRAVIS_SECURE_ENV_VARS" == "true" ]; then aws s3 cp deploy-preview.yml s3://laps.run-ops-data-private/deploy-preview/$TRAVIS_BUILD_NUMBER.yml; fi
  - if [ "$TRAVIS_SECURE_ENV_VARS" == "true" ]; then aws s3 cp deploy-production.yml s3://laps.run-ops-data-private/deploy-production/$TRAVIS_BUILD_NUMBER.yml; fi
  - ./bin/trigger_ops_website_deploy.sh

jobs:
  include:
    - stage: laps.run
```

#### ./bin/travis-script.sh

```bash
   
#!/usr/bin/env bash

main(){
  # preparing for production deploy via travis yaml deploy block
  if [[ $TRAVIS_PULL_REQUEST == "false" && $TRAVIS_BRANCH == "master" ]]; then
    HUGO_ENV=production hugo

  # preparing for preview deploy via aws cli
  elif [[ $TRAVIS_PULL_REQUEST != "false" ]]; then
    # PREVIEW_URL is a travis env var set in travis web console
    # -b flag is the hugo base path
    hugo --buildFuture -b "$PREVIEW_URL/$TRAVIS_PULL_REQUEST_BRANCH/$TRAVIS_PULL_REQUEST_SHA/"
  else
    hugo
  fi
}

main
```

#### ./bin/trigger_ops_website_deploy.sh

```bash
#!/usr/bin/env bash
set -o nounset
set -o errexit
set -o pipefail
IFS=$'\n\t'

set -x

trigger_ops_website_deploy(){
  local body='{
    "request": {
      "branch":"master"
    }
  }'

  curl -s -X POST \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -H "Travis-API-Version: 3" \
     -H "Authorization: token $TRAVIS_CI_TOKEN" \
     -d "$body" \
     https://api.travis-ci.com/repo/lapsrun%2Fops.laps.run/requests
}

if [ "$TRAVIS_SECURE_ENV_VARS" == "true" ]; then
  trigger_ops_website_deploy
else
  echo "this is an untrusted build, skipping ops website deploy"
fi
```


### lapsrun/ops.laps.run [hugo, s3]

[repo](https://github.com/lapsrun/ops.laps.run)

```yaml
dist: trusty
sudo: false

env:
  global:
    - PATH=$HOME/bin:$HOME/.local/bin:$PATH

cache:
  directories:
    - data

install:
  - pip install --user awscli
  - mkdir -p ~/bin
  - wget https://github.com/gohugoio/hugo/releases/download/v0.48/hugo_0.48_Linux-64bit.tar.gz
  - tar xzvf hugo_0.48_Linux-64bit.tar.gz
  - mv hugo ~/bin/
  - wget https://github.com/mikefarah/yq/releases/download/2.1.1/yq_linux_amd64 -O ~/bin/yq
  - chmod +x ~/bin/yq

script: ./build.sh

deploy:
  - provider: script
    script: aws s3 sync --size-only public/ s3://ops.laps.run
    skip_cleanup: true
    on:
      repo: lapsrun/ops.laps.run
      branch: master
```


### lapsrun/terraform [terraform]

[repo](https://github.com/lapsrun/terraform)

```yaml
dist: trusty
sudo: false

env:
  global:
    - PATH="~/bin:$PATH"
    - TERRAFORM_VERSION="0.11.12-beta1"

before_install:
  - curl -sLo "/tmp/terraform.zip" "https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip"
  - unzip /tmp/terraform.zip -d /tmp
  - mkdir -p ~/bin
  - mv /tmp/terraform ~/bin
  - which terraform
  - terraform --version

script:
  - terraform init -backend=false
  - terraform validate
```
