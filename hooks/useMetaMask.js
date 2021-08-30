import Web3 from "web3";
import { useCallback, useEffect, useReducer } from "react";
import ABI from "utils/abi";
import COUNTER_ABI from "utils/counter-abi"; // TODO: remove

const COUNTER_CONTRACT_ADDRESS = process.env.COUNTER_CONTRACT_ADDRESS; // TODO: remove
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;

// ===================================================
// METAMASK
// ===================================================

export default function useMetaMask() {
  // TODO: remove counterContract
  const [{ account, network, counterContract, contract }, dispatch] =
    useReducer((state, moreState) => ({ ...state, ...moreState }), {
      account: null,
      network: null,
      counterContract: {},
      contract: {},
    });

  // init web3
  useEffect(() => {
    try {
      window.web3 = new Web3(window.ethereum);
    } catch (err) {
      console.debug("ERROR: failed to initialise web3", { err });
    }
  }, []);

  // connect to user's wallet
  const connectWallet = useCallback(async () => {
    try {
      console.log("Connecting to wallet...");
      const [acc] = await window.web3.eth.requestAccounts();
      dispatch({ account: acc });
    } catch (err) {
      console.debug("ERROR: couldn't connect wallet", { err });
    }
  }, []);

  // determine the network (0x4 => rinkeby)
  const determineNetwork = useCallback(async () => {
    try {
      const network = await window.web3.eth.net.getChainId(); // 0x4 is Rinkeby
      dispatch({ network });
      console.log("Network:", network);
    } catch (err) {
      console.debug("DEBUG catch error", { err });
    }
  }, []);

  // create a contract instance
  useEffect(() => {
    // determineNetwork().then(r => console.log('DEBUG', {r}))
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS, {
      // gasLimit: "1000000",
    });

    // TODO: remove
    const counterContract = new web3.eth.Contract(
      COUNTER_ABI,
      COUNTER_CONTRACT_ADDRESS,
      {
        // gasLimit: "1000000",
      }
    );

    dispatch({ contract, counterContract });
  }, [determineNetwork]);

  // minting function
  const mint = useCallback(
    async (n = 1) => {
      try {
        await contract.methods
          .mint(n)
          .send()
          .on("transactionHash", (hash) =>
            console.log("DEBUG TX hash", { hash })
          );
      } catch (err) {
        console.log("ERROR: failed to call contract method (mint)", { err });
      }
    },
    [contract.methods]
  );

  // ===================================================
  // TODO: remove below
  // ===================================================

  // test with counter contracts
  const getCount = useCallback(async () => {
    try {
      await counterContract.methods.getCount().call({ from: account });
    } catch (err) {
      console.log("ERROR: failed to call contract method (getCount)", { err });
    }
  }, [account, counterContract.methods]);

  // TODO: remove
  // test with counter contracts
  const setCount = useCallback(
    async (n = 0) => {
      try {
        await counterContract.methods
          .setCount(n)
          .send({ from: account, value: 1000000 })
          .on("transactionHash", (hash) =>
            console.log("DEBUG TX hash", { hash })
          );
      } catch (err) {
        console.log("ERROR: failed to call contract method (setCount)", {
          err,
        });
      }
    },
    [account, counterContract.methods]
  );

  // ===================================================
  // TODO: remove above
  // ===================================================

  return { connectWallet, mint, determineNetwork, getCount, setCount };
}
