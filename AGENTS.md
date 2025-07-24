# Agent Instructions

## CI Environment Tips
- run this to setup the toolchain `./.tool-versions-setup.sh`

## Testing Instructions
For any changes in this repository, run the following command to build the site:

```bash
./.asdf-local/bin/asdf exec hugo
```

Use this command in the **Testing** section of your pull requests.
- if this exits 0 then the general health, smoke test is successful. 
- exit codes > 0 are a failure. 
- warnings in the output may be indicative of subtle issues but shouldn't be considered a breaking error state. 
