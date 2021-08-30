const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
const ABI = require("../util/abi");

const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;

if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
  );
  return;
}

async function setCount() {
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

    if (CONTRACT_ADDRESS) {
      const contract = new web3Instance.eth.Contract(
        ABI.ABI,
        CONTRACT_ADDRESS,
        { gasLimit: "1000000" }
      );

      async function setCount(n) {
        const gas = await contract.methods
          .setCount(n)
          .estimateGas({ from: OWNER_ADDRESS, value: 1000000 });
        console.log("Gas:", gas);
        await contract.methods
          .setCount(n)
          .send({ from: OWNER_ADDRESS, value: 1000000 })
          .on("transactionHash", function (hash) {
            console.log("transactionHash", hash);
          });
      }

      setCount(process.argv[2]);
    } else {
      console.error("Add correct / missing environment variables");
    }
  } catch (err) {
    console.log("ERROR", err);
  }
}

setCount();
