const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
const SATOSHI_SHROOM_ABI = require("./satoshi-shroom-abi");
const functions = require("./functions");

const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
const NEWEST_CONTRACT = process.env.NEWEST_CONTRACT;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const NUM_MUSHROOMS = 3;

if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
  );
  return;
}

async function main() {
  try {
    const network =
      NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "rinkeby";
    const provider = new HDWalletProvider(
      MNEMONIC,
      isInfura
        ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
        : "https://eth-" + network + ".alchemyapi.io/v2/" + NODE_API_KEY
    );
    const web3Instance = new web3(provider);

    if (NEWEST_CONTRACT) {
      const nftContract = new web3Instance.eth.Contract(
        SATOSHI_SHROOM_ABI.newestOne,
        NEWEST_CONTRACT,
        { gasLimit: "1000000" }
      );

      // // ALL AVAILABLE METHODS
      // const methods = await nftContract.methods;
      // console.log("NFT METHODS", methods);

      // // MUSHROOM PRICE
      // const mushroomPrice = await functions.runFunction(
      //   "mushroomPrice",
      //   nftContract,
      //   { estimateGas: false }
      // );

      // // MAX # TO PURCHASE
      // const maxMushroomPurchase = await functions.runFunction(
      //   "maxMushroomPurchase",
      //   nftContract,
      //   { estimateGas: false }
      // );

      // // PRINT BASE URI
      // await functions.runFunction("getBaseURI", nftContract, {
      //   estimateGas: false,
      // });

      // // UPDATE BASE URI
      // const gas = await nftContract.methods
      //   .setBaseURI("")
      //   .estimateGas({ from: OWNER_ADDRESS });
      // await nftContract.methods.setBaseURI("").send({
      //   from: OWNER_ADDRESS,
      //   value: gas,
      // });

      // // MINT MUSHROOMS
      // await nftContract.methods
      //   .mintSatoshiShroom(NUM_MUSHROOMS)
      //   .send({
      //     from: OWNER_ADDRESS,
      //     value: mushroomPrice * NUM_MUSHROOMS,
      //   })
      //   .on("transactionHash", function (hash) {
      //     console.log("transactionHash", hash);
      //   });

      console.log("Minting complete.");
    } else {
      console.error("Add correct / missing environment variables");
    }
  } catch (err) {
    console.log("ERROR", err);
  }

  process.exit();
}

main();
