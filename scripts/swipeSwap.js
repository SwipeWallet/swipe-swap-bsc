let fs = require("fs");
let path = require("path");
const { ethers } = require("hardhat");
const SWIPESWAP = require("../artifacts/contracts/SwipeSwap.sol/SwipeSwap.json")

let SWIPESWAP_ADDRESS;
let SXP_ADDRESS = "0xd57022d5cb065505093e2c4bbf7d683d2335ab6a";

const loadJsonFile = require('load-json-file');
let keys = loadJsonFile.sync('./keys.json');
const network = keys.network;
const { infuraKey, deployer, privateKey } = keys.networks[network];
const url = (network === 'hardhat' ? `http://127.0.0.1:8545` : `https://${network}.infura.io/v3/${infuraKey}`)

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

  factory = new ethers.ContractFactory(
    SWIPESWAP.abi,
    SWIPESWAP.bytecode,
    walletWithProvider
  )
  ins = await factory.deploy(SXP_ADDRESS, deployer, '1000000000000000000', 9759275, 9859275, ETHER_SEND_CONFIG)
  await waitForMint(ins.deployTransaction.hash)
  SWIPESWAP_ADDRESS = ins.address

}

async function main() {
    console.log('deploy...')
    await deploy()
    console.log(`
    SWIPESWAP_ADDRESS = ${SWIPESWAP_ADDRESS}
  `)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });