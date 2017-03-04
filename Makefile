
ci.json:
		DATE=`date` jq -n "{ci_built_at_timestamp: now, ci_built_at_datetime: env.DATE, \
			git_branch: env.TRAVIS_BRANCH, ci_build_id: env.TRAVIS_BUILD_ID, \
			ci_build_number: env.TRAVIS_BUILD_NUMBER, git_commit: env.TRAVIS_COMMIT, \
			git_commit_message: env.TRAVIS_COMMIT_MESSAGE, \
			git_commit_range: env.TRAVIS_COMMIT_RANGE, \
			ci_event_type: env.TRAVIS_EVENT_TYPE, ci_job_id: env.TRAVIS_JOB_ID, \
			ci_job_number: env.TRAVIS_JOB_NUMBER, git_repo_slug: env.TRAVIS_REPO_SLUG, \
			git_pull_request: env.TRAVIS_PULL_REQUEST, \
			git_pull_request_branch: env.TRAVIS_PULL_REQUEST_BRANCH, \
			git_pull_request_sha: env.TRAVIS_PULL_REQUEST_SHA, \
			git_pull_request_slug: env.TRAVIS_PULL_REQUEST_SLUG}" > ci.json
