knox = require "knox"
walk = require "walk"

console.log "hello town"

creds = 
  key: 'AKIAIL5OI3ZZWIYHMPKQ'
  secret: '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'
  bucket: 'www.tomhummel.com'
  
client = knox.createClient creds

# PUT _site/ directory to client bucket

walker = walk.walk "_site/", {}

walker.on "file", (root, stats, next) ->
  
  source = "#{root}/#{stats.name}"
  tRoot = "/" + (root.split /_site\/{1,2}/)[1]
  dest = "#{tRoot}/#{stats.name}"
  
  client.putFile source, dest, (err, res) ->
    console.log "dest: ", dest
    if err?
      console.log "err: ", err 
    else
      console.log "OK!"
      
    next()

walker.on "end", ->
  console.log "All Done!"
  