# sgs-issuance-calendar

A Google Apps Script project designed to create Google Calendar calendars with events for [Singapore Government Securities (SGS)](https://www.mas.gov.sg/bonds-and-bills) based on [MAS Auctions and Issuance Calendar](https://www.mas.gov.sg/bonds-and-bills/auctions-and-issuance-calendar).

It retrieves SGS data such as SGS, SSB, and T-bills from MAS API and generates events of key dates related to SGS issuances.

## Table of Contents

- [sgs-issuance-calendar](#sgs-issuance-calendar)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
  - [Contributing](#contributing)
    - [Commit Messages](#commit-messages)
    - [Unit Testing](#unit-testing)
    - [Deploy](#deploy)
  - [License](#license)

## Usage

You can subscribe to the following calendars for Singapore Bonds and T-bills to stay updated with important dates:

| Calendar                | Link                                                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SGS Bonds Calendar      | [Add calendar](https://calendar.google.com/calendar/u/0?cid=MWU3MDlkZjY5OTlhOWNjOGIxYTJiYTRlMDQ5ZDBmZDM0ZTBhNjQ5OTRhNTU5MzRmYTMzMzk3NTM0NWE5YjAzMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t) |
| 6-Month T-Bill Calendar | [Add calendar](https://calendar.google.com/calendar/u/0?cid=NzFkNTAyMDBjMDA4OTNiZjAyOWIxYjVhZDdmMjM4OGZkODU0ODA3YzdlMWJmYTFiM2E0OWI5MTNkNjAzMDUwYUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t) |
| 1-Year T-Bill Calendar  | [Add calendar](https://calendar.google.com/calendar/u/0?cid=NDcxNzZkMTIwZWZiM2M4OTM1OTIxZTgxNmM3YzUzMGY4N2ExNmM0NThjNGFiYTQyZjljZWRkNTE4NWZmNDgzM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t) |
| Savings Bond Calendar   | [Add calendar](https://calendar.google.com/calendar/u/0?cid=NDY1MjEwOGViZTU5YjAyZmE3MTdkNmM3NzU5MmNkZjcyNmJlNDgwM2NlM2M2ZmJhOTM5ZGY5ZTI3Nzg3YTY3NEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t) |

## Contributing

Pull requests and contributions are welcome. Please follow the standard Git workflow:

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Make your changes.
4. Test your changes.
5. Submit a pull request.

### Commit Messages

This project follows [semantic commit message conventions](https://www.conventionalcommits.org/en/v1.0.0/#summary) to help maintain a clear and structured commit history. Each commit message is formatted as follows:

-   `feat`: for new features
-   `fix`: for bug fixes
-   `chore`: for maintenance tasks and general updates
-   `docs`: for documentation improvements
-   `style`: for code style changes (e.g., formatting)
-   `refactor`: for code refactoring
-   `test`: for adding or improving tests

Each commit message should be concise and describe the specific change being made. For example:

-   `feat: Add new function to retrieve T-bill data`
-   `fix: Correct issue with date parsing`
-   `docs: Update README with detailed project information`

Please follow these conventions when making commits to maintain a clear and informative commit history.

### Unit Testing

```sh
npm test
```

### Deploy

First download [clasp](https://github.com/google/clasp):

```sh
npm install -g @google/clasp
```

```sh
clasp login
clasp push
```

## License

This project is licensed under the [MIT License](LICENSE).
