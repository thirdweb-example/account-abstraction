# Account Abstraction with the thirdweb Connect SDK

This repo is a collection of reference implementations for account abstraction features using the [Connect SDK](https://portal.thidweb.com/connect).

Showcases how to build:

- Gasless transactions
- Session keys
- Batch transactions

## Live demo

[Play around with the live preview](https://account-abstraction.thirdweb-preview.com)

## Running locally

### Setup client id

Before you start, you need to replace the placeholder `clientId` with your client ID to use thirdweb SDK.

Refer to [Creating a client](https://portal.thirdweb.com/typescript/v5/client) guide to see how you can get a client id.

Go to `src/constants.ts` file and replace the placeholder `clientId` with your client ID.

```ts
const clientId = "......";
```

### Install dependencies

```bash
yarn install
```

### Start development server

```bash
yarn dev
```

## Resources

- [thirdweb Connect documentation](https://portal.thirdweb.com/connect)
- [Connect SDK refence](https://portal.thirdweb.com/typescript/v5)
- [thirdweb Dashboard](https://thirdweb.com/dashboard)

## Join our Discord!

For any questions or suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
