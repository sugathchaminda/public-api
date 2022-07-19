// eslint-disable-next-line import/no-extraneous-dependencies
const { danger, warn, message } = require('danger');

const bigPRThreshold = 400;
const refactorKeywords = ['refactor', 'clean', 'improve'];
const JiraTicketStyle = /(\[[A-Z]+-\d+\])/;
const { pr } = danger.github;

const titleNotDescriptiveEnough = ({ title }) => title.length < 10;
const titleHasNoJiraTicket = ({ title }) => !title.match(JiraTicketStyle);
const isNotRefactoringPR = ({ title }) => !refactorKeywords.some((keyword) => title.toLowerCase().includes(keyword));
const bodyNotDescriptiveEnough = ({ body }) => body.length < 5;
const tooBigPR = ({ additions, deletions }) => (additions + deletions) > bigPRThreshold;
const onlyDeletions = ({ additions, deletions }) => additions + deletions < 0;

if (titleNotDescriptiveEnough(pr)) {
  warn('⚠️  PR title is a bit short.');
}

if (titleHasNoJiraTicket(pr)) {
  if (isNotRefactoringPR(pr)) {
    warn('⚠️  Please use this format `[QP-000] Your feature title` and replace `000` with Jira task number.');
  }
}

if (bodyNotDescriptiveEnough(pr)) {
  warn('⚠️  Looks like the body is rather undescriptive, it would help the reviewer if you add add information on what and why you made your changes');
}

if (tooBigPR(pr)) {
  // eslint-disable-next-line max-len
  warn('⚠️  Pull Request size seems relatively large. If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.');
}

if (onlyDeletions(pr)) {
  message('🍻  Good work, removing and improving! ');
}
