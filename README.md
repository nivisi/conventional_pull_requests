# Conventional Pull Requests [![version][version-img]][version-url]

❤️‍🩹 A GitHub Action that helps to maintain [conventional](https://www.conventionalcommits.org/en/v1.0.0/) pull request names.

## Overview

This GitHub Action designed to automate the validation and correction of Pull Request (PR) titles in collaborative software development environments. This Action helps maintain consistency and clarity in PR naming conventions, ensuring that all PRs adhere to predefined formatting rules.

Checkout this [pull request](https://github.com/nivisi/conventional_pull_requests_showcase/pull/1) for an example.

## Features

- Validation: Checks if PR titles conform to specified formatting rules.
- Automatic Correction: Where possible, automatically corrects PR titles to meet the standards.
- Commenting: Posts a comment on the PR when a correction is made, providing visibility and feedback.

## Usage

To use this GitHub Action in your project, set up the workflow file:
- Create a `.github/workflows` directory in your repository if it doesn't exist.
- Add a new YAML file (e.g., `conventional-prs.yml`) in this directory.
- Define the workflow to trigger on PR events and run the Validator.

### Example

```yml
name: Convenitonal Pull Requests

on:
   pull_request:
     types:
      # Configure these types yourself!
      - opened
      - edited
      - reopened
      - synchronize
  
   workflow_dispatch:
  
jobs:
  validate:

    runs-on: ubuntu-latest
  
    steps:
    - name: Checkout
      uses: actions/checkout@v2

    - name: Validate PR Name
      uses: nivisi/conventional_pull_requests@1.0.0+2
      with:
         # GitHub Access Token
         # Required. Default is ${{ github.token }}
         github-token: ${{ github.token }}
  
         # Message that will be posted as a comment in the PR
         # In case the script finds an issue and will be capable of fixing it.
         # {AUTHOR} will be the author of the PR
         # {DIFF} is a suggested difference (old title vs new title)
         message-to-post: |
             Hey @{AUTHOR} 👋 I'm the PR Bot! 🤖 I noticed that the title of this Pull Request didn't match the required schema, so I've made a quick fix:

             {DIFF}
```

## Examples

### Valid PR Titles

- `fix(ABC-1): Updates the UI of the Search Page`: Correct format with type, ticket number, and task description.
- `feat: New screen introduced`: Valid format with only type and task description.
- `feat(ABC-5,ABC-10): Something happened`: Correct format with multiple ticket numbers.

### Invalid PR Titles

### Auto-fixable

- `feat (ABC-10): Introduces new feature`: Invalid due to space before the colon.
- `fix(ABC-1) : Updates the UI`: Invalid due to space after ticket number and before the colon.
- `Feat(ABC-123): Adds feature`: Invalid due to uppercase type.
- `feat(abc-123): New feature`: Invalid due to lowercase ticket number.
- `feat(123-ABC): Wrong format`: Invalid ticket format.
- `feat(ABC-123,abc-456): Multi tickets`: Invalid due to lowercase ticket number in the second ticket.

### Not auto-fixable
- `: Implemented new algorithm`: Invalid due to missing type.
- `feat(): Empty ticket number`: Invalid due to empty ticket number.

## Contributing

Contributions to improve the Validator GitHub Action are welcome. Feel free to fork the repository, make your changes, and submit a pull request.

## TODO

- Follow more rules from the [ruleset](https://www.conventionalcommits.org/en/v1.0.0/#specification)
- Allow to restrict ticket prefixes

<!-- References -->
[version-img]: https://img.shields.io/badge/action-v1.0.0+2-black?logo=github
[version-url]: https://github.com/marketplace/actions/conventional-pull-requests