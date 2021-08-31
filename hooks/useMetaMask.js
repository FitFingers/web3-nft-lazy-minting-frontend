import Web3 from "web3";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import ABI from "utils/abi";
import COUNTER_ABI from "utils/counter-abi"; // TODO: remove

const COUNTER_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ADDRESS; // TODO: remove
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
// const MNEMONIC = process.env.NEXT_PUBLIC_MNEMONIC;
// const NODE_API_KEY =
//   process.env.NEXT_PUBLIC_INFURA_KEY || process.env.NEXT_PUBLIC_ALCHEMY_KEY;
// const OWNER_ADDRESS = process.env.NEXT_PUBLIC_OWNER_ADDRESS;
// const NETWORK = process.env.NEXT_PUBLIC_NETWORK;

// ===================================================
// METAMASK
// ===================================================

export default function useMetaMask(logChanges) {
  // console.log("DEBUG env vars", {
  //   COUNTER_CONTRACT_ADDRESS,
  //   OWNER_ADDRESS,
  // });

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

  const getPrice = useCallback(
    async () => contract.methods.mushroomPrice().call({ from: account }),
    [account, contract.methods]
  );

  const getMaxPurchase = useCallback(
    async () => contract.methods.getMaxPurchase().call({ from: account }),
    [account, contract.methods]
  );

  // minting function
  const mint = useCallback(
    async (n = 1) => {
      try {
        const maxPurchase = await getMaxPurchase();
        if (n > maxPurchase)
          throw new Error(
            `Can only purchase a maximum of ${maxPurchase} at once`
          );

        const price = await getPrice();
        await contract.methods
          .mint(n)
          .send({
            from: account,
            value: n * price,
          })
          .on("transactionHash", (hash) =>
            console.log("DEBUG TX hash", { hash })
          );
      } catch (err) {
        console.log("ERROR: failed to call contract method (mint)", { err });
      }
    },
    [account, contract.methods, getMaxPurchase, getPrice]
  );

  // ===================================================
  // TODO: remove below
  // ===================================================

  // TODO: remove => WORKS
  const getCount = useCallback(async () => {
    try {
      const count = await counterContract.methods
        .getCount()
        .call({ from: account });
      console.log("Count:", count);
      return count;
    } catch (err) {
      console.log("ERROR: failed to call contract method (getCount)", { err });
    }
  }, [account, counterContract]);

  // TODO: remove
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

  // log every change of variable
  useEffect(() => {
    if (logChanges)
      console.log("useMetaMask", {
        getCount,
        setCount,
        connectWallet,
        mint,
        determineNetwork,
        network,
        account,
        counterContract,
        contract,
      });
  }, [
    account,
    connectWallet,
    contract,
    counterContract,
    determineNetwork,
    getCount,
    logChanges,
    mint,
    network,
    setCount,
  ]);

  return { connectWallet, mint, determineNetwork, getCount, setCount };
}
