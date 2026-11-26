# Jenkins controller with the Docker CLI, required plugins and Allure.
FROM jenkins/jenkins:lts-jdk21

USER root
COPY --from=docker:cli /usr/local/bin/docker /usr/local/bin/docker
COPY --from=docker:cli /usr/local/libexec/docker/cli-plugins/docker-compose /usr/local/libexec/docker/cli-plugins/docker-compose
RUN curl -fsSL https://repo.maven.apache.org/maven2/io/qameta/allure/allure-commandline/2.34.0/allure-commandline-2.34.0.tgz \
    | tar -xz -C /opt && mv /opt/allure-2.34.0 /opt/allure
USER jenkins

COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt
COPY init.groovy /usr/share/jenkins/ref/init.groovy.d/init.groovy

ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"
