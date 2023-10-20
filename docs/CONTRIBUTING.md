# Contributing

## Reporting Issues

If you encounter any issues or have feature requests, please open a GitHub issue. Provide as much detail as possible to help us understand the problem.

## Pull Request

Pull requests and contributions are welcome. Please follow the standard Git workflow:

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Make your changes.
4. Test your changes.
5. Submit a pull request.

## Commit Messages

This project follows [semantic commit message conventions](https://www.conventionalcommits.org/en/v1.0.0/#summary) to help maintain a clear and structured commit history. Each commit message is formatted as follows:

-   `feat`: for new features
-   `fix`: for bug fixes
-   `chore`: for maintenance tasks and general updates
-   `docs`: for documentation improvements
-   `style`: for code style changes (e.g., formatting)
-   `refactor`: for code refactoring
-   `test`: for adding or improving tests

Each commit message should be concise and describe the specific change being made. For example:

-   `feat: add new function to retrieve T-bill data`
-   `fix: correct issue with date parsing`
-   `docs: update README with detailed project information`

Please follow these conventions when making commits to maintain a clear and informative commit history.

## Unit Testing

```sh
npm test
```

## Deploy

```sh
# First download clasp
npm install -g @google/clasp

# Run the following command to log in to your Google account using clasp
clasp login

# Use the following command to push your local changes to the Google Apps Script project:
clasp push
```
