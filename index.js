/*
JavaScript Script for PR (Pull Request) Naming Validation

Overview:
This script validates and corrects the naming of pull requests (PRs) based
on specific formatting rules. It is designed for collaborative development 
environments to ensure consistency and clarity in PR naming.

Functionality:
- Validates PR names against predefined rules.
- Corrects names where possible or flags them as invalid.

Use Cases:
1. Valid Scenarios:
   - "fix(ABC-1): Updates the UI of the Search Page": Correct format with 
     type, ticket number, and task description.
   - "feat: New screen introduced": Valid format with only type and task 
     description.
   - "feat(ABC-5,ABC-10): Something happened": Correct format with multiple 
     ticket numbers.
   - "nit: Updates README": Valid format with type and task description, 
     without a ticket number.

2. Invalid Scenarios:
   - ": Implemented new algorithm": Invalid due to missing type.
   - "feat (ABC-10): Introduces new feature": Invalid due to space before 
     the colon.
   - "fix(ABC-1) : Updates the UI": Invalid due to space after ticket number 
     and before the colon.
   - "Feat(ABC-123): Adds feature": Invalid due to uppercase type.
   - "feat(abc-123): New feature": Invalid due to lowercase ticket number.
   - "feat(123-ABC): Wrong format": Invalid ticket format.
   - "feat(): Empty ticket number": Invalid due to empty ticket number.
   - "feat(ABC-123,abc-456): Multi tickets": Invalid due to lowercase ticket 
     number in the second ticket.
*/

import { getInput, setFailed, setOutput } from '@actions/core';
import github, { getOctokit } from '@actions/github';

import helpers from './helpers.js';

async function run() {
    try {
        const token = getInput('github-token');
        var messageToPost = getInput('message-to-post');

        const octokit = getOctokit(token);

        const { context } = github;
        const prTitle = context.payload.pull_request.title;
        const prNumber = context.payload.pull_request.number;
        const repoName = context.repo.repo;
        const repoOwner = context.repo.owner;

        const validationResult = helpers.validatePrTitle(prTitle);

        setOutput('isValid', validationResult.isValid ?? false);

        if (validationResult.isValid == true) {
            return;
        }

        if (!validationResult.validTitle) {
            return;
        }

        const suggestedDiff = `\`\`\`diff
- ${prTitle}
+ ${validationResult.validTitle}
\`\`\``;

        setOutput('valid-title', validationResult.validTitle);
        setOutput('suggested-diff', suggestedDiff);

        console.log("Updating PR Name to be " + validationResult.validTitle);

        // Update PR title
        await octokit.rest.pulls.update({
            owner: repoOwner,
            repo: repoName,
            pull_number: prNumber,
            title: validationResult.validTitle,
        });

        if (!messageToPost) {
            return;
        }

        messageToPost = messageToPost.replace("{AUTHOR}", context.payload.pull_request.user.login).replace("{DIFF}", suggestedDiff)

        console.log("Adding a comment");

        // Create a comment on the PR
        await octokit.rest.issues.createComment({
            owner: repoOwner,
            repo: repoName,
            issue_number: prNumber,
            body: messageToPost,
        });
    } catch (error) {
        setFailed(`Action failed with error: ${error}`);
    }
}

run();
