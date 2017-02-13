
build.json:
		DATE=`date` jq -n '{now: now, date: env.DATE, branch: env.TRAVIS_BRANCH, build_id: env.TRAVIS_BUILD_ID, build_number: env.TRAVIS_BUILD_NUMBER, commit: env.TRAVIS_COMMIT, commit_message: env.TREAVIS_COMMIT_MESSAGE, commit_range: env.TRAVIS_COMMIT_RANGE, event_type: env.TRAVIS_EVENT_TYPE, job_id: env.TRAVIS_JOB_ID, job_number: env.TRAVIS_JOB_NUMBER, repo_slug: env.TRAVIS_REPO_SLUG, sudo: env.TRAVIS_SUDO}' > build.json
