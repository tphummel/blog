# tomhummel.com

## what? why?

This repo is the code and content behind [tomhummel.com](https://tomhummel.com). This blog exists to publish posts on technology and any other projects or topics I'm interested in.

Posts about personal data exfiltration and analysis belong at [data.tomhummel.com](https://data.tomhummel.com).

Posts about the speed of Track and Field venues belong at [laps.run](https://laps.run).

## setup

```
brew update
brew install hugo

git clone git@github.com:tphummel/blog.git tomhummel.com
```

## dev

```
hugo server -D -w
```

## publish

```
rm -rf public/
hugo
aws s3 sync --delete public/ s3://my-bucket/
```
