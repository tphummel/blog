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
  # upload file
  console.log "F #{root}#{stats.name}"
  next()

walker.on "directory", (root, stats, next) ->
  # upload file
  console.log "D #{root}#{stats.name}"
  next()

walker.on "end", ->
  console.log "All Done!"
  
  

# client.putFile '_site/', '/', (err, res) ->
#   console.log "err: ", err if err?
#   console.log "res: ", res