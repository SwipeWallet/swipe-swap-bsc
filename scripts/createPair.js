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

WETH_ADDRESS = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd'
FACTORY_ADDRESS = '0xB5e53172bF9C75B736Fa88013C5F704E33043787'
ROUTER_ADDRESS = '0x9e438C8cA3161460B46E51C3dDBec326c34B224A'

const loadJsonFile = require('load-json-file');
let keys = loadJsonFile.sync('./keys.json');
const network = keys.network;
const { deployer, privateKey } = keys.networks[network];
const url = (
  network === 'hardhat' ? `http://127.0.0.1:8545` : 
  network === 'mainnet' ? `https://bsc-dataseed.binance.org/` : 
  `https://data-seed-prebsc-1-s1.binance.org:8545/`)

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

  // Swipe Token	0xd08a58a469eC2459778B1d367aA3973e9A701524
  // USDT 	0xd57022D5Cb065505093e2c4bBf7d683d2335aB6A
  // USDC	0x9c35b1512628304Cb1a6df39B173a85358Cc1f17
  // DAI	0x534399090DA190a2e1Cf868299A448907f1b2a27
  // WBNB	0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd

  // ERC20Mock Token
  ins = new ethers.Contract(
    FACTORY_ADDRESS,
    FACTORY.abi,
    getWallet()
  )

  tx = await ins.createPair('0x534399090DA190a2e1Cf868299A448907f1b2a27', '0xd08a58a469eC2459778B1d367aA3973e9A701524', ETHER_SEND_CONFIG)
  console.log('created Pair')
  await waitForMint(tx.hash)
  console.log('weth/usdc pair >> ', ins.address)
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