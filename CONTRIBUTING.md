# Contributing

## We want you to build Provoly

First of all, you're very welcome to contribute on this project. We want it to propose the most functionalities and to
be the most adaptable possible, so any help is welcome.

## Resources

* doc:
  * environment details: `README.md`
  * backend mocks:
    * `mock-server/README.md`
    * `mock-ws/README.md`
  * library documentation: `project/provoly/dashboard/README.md`
  * Roadmap: To Be Annonced
* bugs: Using [JIRA](https://alm.groupeonepoint.com/secure/RapidBoard.jspa?rapidView=10150&projectKey=PRY&view=detail) -
  onepoint internal ATM
* comms: Teams Pry -> Provoly - onepoint internal ATM

## Testing

Testing library using `jest`, and `jest-marbles`. We want to test business code to be tested at minimum. Components may
be tested, but it is not fully required (but at least business code iniside of them).

## How to submit changes

1. Content of the PR:
  1. Make sure observables are used, and correctly used
  2. Make sure dependencies are correct
  3. Make sure unit tests have been run and passed
  4. Make sure unit tests on modified parts are increasing
  5. Make sure documentation is up-to-date and well described for the modified parts
  6. Make sure JSDoc is present and meaning full for modified functions
  7. Make sure all included code/images/... are compatible with the current licence
2. Push branch and create PR
3. Indicate if new libs have been added and to which part of the library in the PR
4. Indicate the main goal of the PR

## How to report bug and enhancements - and ask for help

Contact Provoly team, by mail - @groupeonepoint.com

## Templates

TBD

## Style Guide / Coding conventions

This should be covered by using prettier and eslint as configured in the project. Husky is here to ensure these rules
are followed.

## Code of conduct

TBD


