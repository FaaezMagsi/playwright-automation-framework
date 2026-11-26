pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *')   // build when new code is pushed
        cron('H 2 * * *')        // nightly scheduled run
    }

    options {
        timestamps()
        timeout(time: 40, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    environment {
        IMAGE = "playwright-framework:${BUILD_NUMBER}"
        CONTAINER = "playwright-tests-${BUILD_NUMBER}"
        BASE_URL = "http://localhost:4200"
        API_URL = "http://localhost:8091"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'rm -rf allure-results playwright-report test-results logs'
            }
        }
        stage('Build Docker image') {
            steps {
                sh 'docker build -t "$IMAGE" .'
            }
        }
        stage('Start application under test') {
            steps {
                sh './scripts/start-app.sh'
            }
        }
        stage('Run UI and API tests') {
            steps {
                // Results are copied out with "docker cp" so no host volume paths are needed.
                sh '''
                    status=0
                    docker run --name "$CONTAINER" --ipc=host --network host \\
                        -e BASE_URL -e API_URL "$IMAGE" || status=$?
                    for dir in allure-results playwright-report test-results logs; do
                        docker cp "$CONTAINER:/app/$dir" . || echo "No $dir to copy"
                    done
                    exit $status
                '''
            }
        }
    }

    post {
        always {
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            archiveArtifacts artifacts: 'allure-results/**, playwright-report/**, test-results/**, logs/**', allowEmptyArchive: true
            sh 'docker rm -f "$CONTAINER" || true; docker rmi "$IMAGE" || true'
            sh 'docker compose -f docker-compose.app.yml down -v || true'
        }
    }
}
