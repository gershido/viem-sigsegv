## Context

Building an SDK for [Hats-Protocol](https://www.hatsprotocol.xyz/).
The SDK is built with Viem at its core. The tests are using a Mainnet fork with Anvil.
A SIGSEGV error happens when using `simulateContract` on a transaction that reverts (line 58 in the test).

Using a mac (M1 chip).

## Reproduction steps

1. Run an Anvil instance with a forked Mainnet on block 16947805

```
anvil --fork-url <endpoint url> --fork-block-number 16947805
```

2. Install dependencies:

```
yarn install
```

3. Run test:

```
yarn test
```
