import Web3 from "web3";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import SHROOMS_ABI from "utils/abi";
import COUNTER_ABI from "utils/counter-abi"; // TODO: remove

const isDev = process.env.NODE_ENV === "development";

const COUNTER_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ADDRESS; // TODO: remove
const SHROOMS_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_SHROOMS_CONTRACT_ADDRESS;

// ===================================================
// METAMASK
// ===================================================

export default function useMetaMask(logChanges) {
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
      const network = await window.web3.eth.net.getNetworkType();
      dispatch({ network });
      console.log("Connected.");
    } catch (err) {
      console.debug("ERROR: couldn't connect wallet", { err });
    }
  }, []);

  // create a contract instance
  useEffect(() => {
    const contract = new web3.eth.Contract(
      SHROOMS_ABI,
      SHROOMS_CONTRACT_ADDRESS,
      {
        // gasLimit: "1000000",
      }
    );

    // TODO: remove
    const counterContract = new web3.eth.Contract(
      COUNTER_ABI,
      COUNTER_CONTRACT_ADDRESS,
      {
        // gasLimit: "1000000",
      }
    );

    dispatch({ contract, counterContract });
  }, []);

  const getPrice = useCallback(
    async () => contract.methods.mushroomPrice().call({ from: account }),
    [account, contract.methods]
  );

  const getMaxPurchase = useCallback(
    async () => contract.methods.maxMushroomPurchase().call({ from: account }),
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
          .mintSatoshiShroom(n)
          .send({
            from: account,
            value: n * price,
          })
          .on("transactionHash", (hash) => console.log("TX hash", { hash }));
      } catch (err) {
        console.log("ERROR: failed to call contract method (mint)", { err });
      }
    },
    [account, contract.methods, getMaxPurchase, getPrice]
  );

  // get this series' baseURI
  const getBaseURI = useCallback(async () => {
    const baseURI = await contract.methods.getBaseURI().call({ from: account });
    console.log("BaseURI", { baseURI });
    return baseURI;
  }, [contract, account]);

  // set this series' baseURI (for reveal)
  const setBaseURI = useCallback(
    async (str) => {
      await contract.methods
        .setBaseURI(str)
        .send({ from: account, value: 1000000 })
        .on("transactionHash", (hash) =>
          console.log("setBaseURI TX hash", { hash })
        );
    },
    [contract, account]
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
          .on("transactionHash", (hash) => console.log("TX hash", { hash }));
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
        getBaseURI,
        setBaseURI,
        connectWallet,
        mint,
        network,
        account,
        counterContract,
        contract,
      });
  }, [
    account,
    getBaseURI,
    setBaseURI,
    connectWallet,
    contract,
    counterContract,
    getCount,
    logChanges,
    mint,
    network,
    setCount,
  ]);

  return {
    connectWallet,
    network,
    account,
    mint,
    getCount,
    setCount,
    ...(isDev ? { getBaseURI, setBaseURI } : {}),
  };
}
