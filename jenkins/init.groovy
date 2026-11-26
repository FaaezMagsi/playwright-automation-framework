// Configures Jenkins on first start: admin user, Allure tool, Git credential and pipeline job.
import jenkins.model.*
import hudson.security.*
import hudson.plugins.git.*
import com.cloudbees.plugins.credentials.CredentialsScope
import com.cloudbees.plugins.credentials.SystemCredentialsProvider
import com.cloudbees.plugins.credentials.domains.Domain
import com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl
import org.jenkinsci.plugins.workflow.job.WorkflowJob
import org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition
import org.allurereport.jenkins.tools.AllureCommandlineInstallation

def env = System.getenv()
def jenkins = Jenkins.get()
def jobName = 'playwright-automation'
if (jenkins.getItem(jobName)) return

def realm = new HudsonPrivateSecurityRealm(false)
realm.createAccount('admin', env['JENKINS_ADMIN_PASSWORD'])
jenkins.setSecurityRealm(realm)
def strategy = new FullControlOnceLoggedInAuthorizationStrategy()
strategy.setAllowAnonymousRead(false)
jenkins.setAuthorizationStrategy(strategy)

def allure = jenkins.getDescriptorByType(AllureCommandlineInstallation.DescriptorImpl)
allure.setInstallations(new AllureCommandlineInstallation('allure', '/opt/allure', []))
allure.save()

def credentialsId = ''
if (env['GIT_TOKEN']) {
    credentialsId = 'git-token'
    SystemCredentialsProvider.instance.store.addCredentials(Domain.global(),
        new UsernamePasswordCredentialsImpl(CredentialsScope.GLOBAL, credentialsId, 'Repository access', 'x-access-token', env['GIT_TOKEN']))
}

def remote = new UserRemoteConfig(env['REPO_URL'], null, null, credentialsId)
def scm = new GitSCM([remote], [new BranchSpec("*/${env['REPO_BRANCH'] ?: 'main'}")], null, null, [])
def job = jenkins.createProject(WorkflowJob, jobName)
job.setDefinition(new CpsScmFlowDefinition(scm, 'Jenkinsfile'))
job.save()
jenkins.save()
job.scheduleBuild2(5)
