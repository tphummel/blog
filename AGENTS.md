# Contributor Guide

## Dev Environment Tips
- run this to setup the toolchain `./.tool-versions-setup.sh`
- once this runs, i should be able to start a new shell session and have `asdf` on $PATH. 
- `which asdf` and `asdf version` and `asdf info` should give effective diagnostics to show the installation is complete

## Testing Instructions
- testing is to do a proper run of hugo to generate the static website: `asdf exec hugo`
- if this exits 0 then the general health, smoke test is successful. 
- exit codes > 0 are a failure. 
- warnings in the output may be indicative of subtle issues but shouldn't be considered a breaking error state. 