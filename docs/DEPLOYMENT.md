# Deployment

## HardHat

```sh
npx hardhat node
```

## Mainnet

```sh
yarn mainnet:deploy
```

```sh
yarn mainnet:verify
```

```sh
hardhat tenderly:verify --network mainnet ContractName=Address
```

```sh
hardhat tenderly:push --network mainnet ContractName=Address
```

## Ropsten

```sh
npx hardhat run --network ropsten scripts/deploy.js 
```

```sh
npx hardhat verify --constructor-args arguments.js CONTRACT_ADDRESS
```

```sh
yarn ropsten:deploy
```

```sh
yarn ropsten:verify
```

```sh
hardhat tenderly:verify --network ropsten ContractName=Address
```

## Kovan

```sh
yarn ropsten:deploy
```

```sh
yarn ropsten:verify
```

```sh
hardhat tenderly:verify --network kovan ContractName=Address
```
