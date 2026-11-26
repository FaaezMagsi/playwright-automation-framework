#!/usr/bin/env bash
# Builds and starts the Jenkins controller.
# Required: JENKINS_ADMIN_PASSWORD, REPO_URL. Optional: GIT_TOKEN (private repo), REPO_BRANCH.
set -euo pipefail
cd "$(dirname "$0")"
: "${JENKINS_ADMIN_PASSWORD:?set JENKINS_ADMIN_PASSWORD}"
: "${REPO_URL:?set REPO_URL}"

docker build -t framework-jenkins .
docker run -d --name jenkins -p 8080:8080 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v jenkins_home:/var/jenkins_home \
  --group-add "$(stat -c '%g' /var/run/docker.sock)" \
  -e JENKINS_ADMIN_PASSWORD -e REPO_URL -e GIT_TOKEN -e REPO_BRANCH \
  framework-jenkins
echo "Jenkins is starting on http://localhost:8080 (user: admin)"
