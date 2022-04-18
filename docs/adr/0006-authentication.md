# Authentication

- Status: accepted
- Date: 2022-04-17

## Context and Problem Statement

I want to support multiple identity providers
such as atlassian, google, microsoft ...etc.

the use case will be fetching perform specific data from the provider.

for example

- for atlassian, I need fetching user assigned ticket and show on frontend.
- for Google / Microsoft, I need create calendar event when user start pomodoro.

## Decision Drivers <!-- optional -->

- Cost
- Implementation difficulty
- how easily to add more identity provider

## Considered Options

- Integrate SaSS such as Auth0

  Cost was high but all authentication
  related feature is provided out of box

- Customize solution with CSR

  Implement effort was high but no extra
  hosting cost.

## Decision Outcome

Customize solution with CSR
Solution combine passport and custom way
to sign token as below

1. Login with third party provider
2. Redirect to server callback
3. Redirect to client side url with `code` query parameter
4. Client exchange access token and refresh token by `code`
5. Client save access token and refresh token to local storage

The reason for using code is that
we don't want to expose refresh token on query parameter.
