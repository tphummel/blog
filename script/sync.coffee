knox = require "knox"
walk = require "walk"

creds = 
  key: 'AKIAIL5OI3ZZWIYHMPKQ'
  secret: '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'
  bucket: 'www.tomhummel.com'
  
client = knox.createClient creds

sync_site = ->

  walker = walk.walk "_site/", {}

  walker.on "file", (root, stats, next) ->
  
    source = "#{root}/#{stats.name}"
    tRoot = "/" + (root.split /_site\/{1,2}/)[1]
    dest = "#{tRoot}/#{stats.name}"
  
    client.putFile source, dest, (err, res) ->
      if err?
        console.log dest, "err: ", err 
      else
        console.log dest, "OK!"
      
      next()

  walker.on "end", ->
    console.log "All Done!"


sync_site()
