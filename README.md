# Playwright Automation Framework

UI and API test automation for **Toolshop** with Playwright (JavaScript), Page Object Model, Allure, Docker and Jenkins. 20 tests: 12 UI, 8 API.

## Structure

| Path | Contents |
|---|---|
| `tests/ui`, `tests/api` | Test suites |
| `pages/` | Page objects |
| `fixtures/` | Fixtures, global setup and teardown |
| `utils/` | Logger, waits, screenshots, dialogs, API client, schema validator |
| `data/`, `schemas/`, `config/` | Test data, JSON schemas, settings |
| `Dockerfile`, `Jenkinsfile` | CI/CD files |
| `docker-compose.app.yml`, `app/` | Local copy of the application under test |
| `jenkins/` | Preconfigured Jenkins controller |
| `docs/` | Documentation, architecture diagram, presentation |

## Run with Docker (recommended)

Needs Docker. On Windows, run these in Git Bash or WSL.

```bash
./scripts/start-app.sh                     # start Toolshop on ports 4200 and 8091
docker build -t playwright-framework .
docker run --name pw --ipc=host --network host \
  -e BASE_URL=http://localhost:4200 -e API_URL=http://localhost:8091 playwright-framework
docker cp pw:/app/allure-results .         # copy results out
docker rm pw
docker compose -f docker-compose.app.yml down -v
```

`--network host` works on Linux. With Docker Desktop it needs host networking enabled in its settings.

## Run directly

Needs Node.js 20 or newer. Start the application first, then:

```bash
npm ci
npx playwright install chromium
BASE_URL=http://localhost:4200 API_URL=http://localhost:8091 npm test
npm run report && npm run report:open      # Allure needs Java
```

`npm run test:ui` and `npm run test:api` run one group. Settings can also go in `.env` (see `.env.example`). Without them the tests target the public website, which may refuse automated requests.

## Jenkins

```bash
export JENKINS_ADMIN_PASSWORD='choose-a-password'
export REPO_URL='https://github.com/FaaezMagsi/playwright-automation-framework.git'
export GIT_TOKEN='token'                   # only for a private repository
./jenkins/start-jenkins.sh                 # http://localhost:8080, user: admin
```

This script is written for a Linux Docker host. The pipeline job is created and built automatically. It polls for new commits and also runs nightly.

The submitted run was produced by `.github/workflows/jenkins-pipeline.yml`, which starts this Jenkins on a GitHub runner and saves screenshots, logs and the report to the `evidence` branch.

## Reports

Open `allure-report/index.html` from the submission zip in a browser. `evidence/failure-demo-report/` shows how a failure looks (a deliberately broken expected value).
