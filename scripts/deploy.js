let fs = require("fs");
let path = require("path");
const { ethers } = require("hardhat");
const WETH = require("../artifacts/contracts/mocks/WETH.sol/WETH9.json")
const ERC20Mock = require("../artifacts/contracts/mocks/ERC20Mock.sol/ERC20Mock.json")
const FACTORY = require("../artifacts/contracts/uniswapv2/UniswapV2Factory.sol/UniswapV2Factory.json")
const ROUTER = require("../artifacts/contracts/uniswapv2/UniswapV2Router02.sol/UniswapV2Router02.json")

let FACTORY_ADDRESS;
let ROUTER_ADDRESS;
let WETH_ADDRESS;
let TOKEN1_ADDRESS;
let TOKEN2_ADDRESS;

const loadJsonFile = require('load-json-file');
let keys = loadJsonFile.sync('./keys.json');
const network = keys.network;
const { deployer, privateKey } = keys.networks[network];
const url = (
  network === 'hardhat' ? `http://127.0.0.1:8545` : 
  network === 'mainnet' ? `https://bsc-dataseed.binance.org/` : 
  `https://data-seed-prebsc-1-s1.binance.org:8545/`)

WETH_ADDRESS = "";

const config = {
    "url": url,
    "pk": privateKey,
    "gasPrice": "80",
    "users":[deployer],
}

let ETHER_SEND_CONFIG = {
    gasPrice: ethers.utils.parseUnits(config.gasPrice, "gwei")
}
  

console.log("current endpoint  ", config.url)
let provider = new ethers.providers.JsonRpcProvider(config.url)
let walletWithProvider = new ethers.Wallet(config.pk, provider)

function getWallet(key = config.pk) {
  return new ethers.Wallet(key, provider)
}

const sleep = ms =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve()
    }, ms)
  )

async function waitForMint(tx) {
  console.log('tx:', tx)
  let result = null
  do {
    result = await provider.getTransactionReceipt(tx)
    await sleep(100)
  } while (result === null)
  await sleep(200)
}

async function getBlockNumber() {
  return await provider.getBlockNumber()
}

async function deploy() {
  let factory = null, ins = null, tx = null;

  // WETH Token
  // factory = new ethers.ContractFactory(
  //   WETH.abi,
  //   WETH.bytecode,
  //   walletWithProvider
  // )
  // ins = await factory.deploy(ETHER_SEND_CONFIG)
  // await waitForMint(ins.deployTransaction.hash)
  // WETH_ADDRESS = ins.address

  WETH_ADDRESS = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"

  // Factory
  // factory = new ethers.ContractFactory(
  //   FACTORY.abi,
  //   FACTORY.bytecode,
  //   walletWithProvider
  // )
  // ins = await factory.deploy(deployer, ETHER_SEND_CONFIG)
  // await waitForMint(ins.deployTransaction.hash)
  // FACTORY_ADDRESS = ins.address

  FACTORY_ADDRESS = "0xB5e53172bF9C75B736Fa88013C5F704E33043787"
 
  // Router v2
  factory = new ethers.ContractFactory(
    ROUTER.abi,
    ROUTER.bytecode,
    walletWithProvider
  )
  ins = await factory.deploy(FACTORY_ADDRESS, WETH_ADDRESS, ETHER_SEND_CONFIG)
  await waitForMint(ins.deployTransaction.hash)
  ROUTER_ADDRESS = ins.address
}

async function main() {
    console.log('deploy...')
    await deploy()
    console.log(`
    WETH_ADDRESS = ${WETH_ADDRESS}
    FACTORY_ADDRESS = ${FACTORY_ADDRESS}
    ROUTER_ADDRESS = ${ROUTER_ADDRESS}
  `)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });