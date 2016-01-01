# a blog

### local

    # assumes /usr/local/bin is in your $PATH
    brew install ruby
    sudo gem install -n /usr/local/bin bundler
    bundle install --path vendor/bundle
    bundle exec jekyll serve
    open http://localhost:4000

## theme

props to [zach holman][0] for the [theme][1]

# License

The following directories and their contents are Copyright Tom Hummel. You may not reuse anything therein without my permission:

- _posts/
- _drafts/
- assets/

All other directories and files are MIT Licensed.

  [0]: http://zachholman.com/
  [1]: http://zachholman.com/posts/left/
