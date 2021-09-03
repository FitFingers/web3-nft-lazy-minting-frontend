import Web3 from "web3";
import { useCallback, useEffect, useReducer, useRef } from "react";
import SHROOMS_ABI from "utils/abi";

const isDev = process.env.NODE_ENV === "development";

const SHROOMS_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_SHROOMS_CONTRACT_ADDRESS;

// ===================================================
// METAMASK
// ===================================================

export default function useMetaMask(logChanges) {
  const [{ account, network, contract, hash }, dispatch] = useReducer(
    (state, moreState) => ({ ...state, ...moreState }),
    {
      account: null,
      network: null,
      hash: null,
      contract: {},
    }
  );

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
      console.debug("Connecting to wallet...");
      const [acc] = await window.web3.eth.requestAccounts();
      dispatch({ account: acc });
      const network = await window.web3.eth.net.getNetworkType();
      dispatch({ network });
      console.debug("Connected.");
    } catch (err) {
      console.debug("ERROR: couldn't connect wallet", { err });
    }
  }, []);

  // create a contract instance
  useEffect(() => {
    const contract = new web3.eth.Contract(
      SHROOMS_ABI,
      SHROOMS_CONTRACT_ADDRESS
      // { gasLimit: "1000000" }
    );
    dispatch({ contract });
  }, []);

  const getTokenIndex = useCallback(async () => {
    const tokenIndex = await contract.methods.totalSupply();
    dispatch({ tokenIndex });
  }, [contract.methods]);

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
          .on("transactionHash", (hash) => dispatch({ hash }));
      } catch (err) {
        console.debug("ERROR: failed to call contract method (mint)", { err });
      }
    },
    [account, contract.methods, getMaxPurchase, getPrice]
  );

  // get this series' baseURI
  const getBaseURI = useCallback(async () => {
    const baseURI = await contract.methods.getBaseURI().call({ from: account });
    console.debug("BaseURI", { baseURI });
    return baseURI;
  }, [contract, account]);

  // set this series' baseURI (for reveal)
  const setBaseURI = useCallback(
    async (str) => {
      await contract.methods
        .setBaseURI(str)
        .send({ from: account, value: 1000000 })
        .on("transactionHash", (hash) => dispatch({ hash }));
    },
    [contract, account]
  );

  // ===================================================
  // NON-CALLABLE HOOKS THAT RUN AUTOMATICALLY
  // ===================================================

  // listen for a change in the last hash emitetd and run UI feedback
  useHashConfirmation(hash);

  // assign a listener to a payable tx to get a receipt
  useTransactionConfirmation(hash, getTokenIndex);

  // log every change of variable
  useEffect(() => {
    if (logChanges)
      console.debug("useMetaMask", {
        account,
        getBaseURI,
        setBaseURI,
        connectWallet,
        mint,
        network,
        contract,
      });
  }, [
    account,
    getBaseURI,
    setBaseURI,
    connectWallet,
    contract,
    logChanges,
    mint,
    network,
  ]);

  return {
    connectWallet,
    network,
    account,
    mint,
    hash,

    ...(isDev ? { getBaseURI, setBaseURI } : {}),
  };
}

// ===================================================
// NON-CALLABLE HOOKS
// ===================================================

function useHashConfirmation(hash) {
  const prevHash = useRef(null);
  useEffect(() => {
    if (!hash || hash === prevHash.current) return;
    console.log(`TX hash: ${hash}`); // TODO: improve UI feedback
    prevHash.current = hash;
  }, [hash]);
}

function useTransactionConfirmation(hash, getTokenIndex) {
  const prevHash = useRef(null);
  useEffect(() => {
    async function awaitReceipt(recursive) {
      if (!hash || (!recursive && hash === prevHash.current)) return;

      try {
        const txResult = await web3.eth.getTransactionReceipt(hash);

        // not ready => call again
        if (!txResult) {
          console.log("Awaiting TX confirmation...");
          return new Promise((res) =>
            setTimeout(() => res(awaitReceipt(true)), 1000)
          );
        }

        // failed transaction => step out
        if (!txResult.status) throw new Error("Transaction was unsuccessful");

        // successful transaction => update metadata and tokenIndex
        const tokenIndex = await getTokenIndex();
        (await fetch(`/api/opensea-metadata/refresh/${tokenIndex - 1}`)).json();

        // TODO: add UI feedback
      } catch (err) {
        console.debug("Caught error in useTx", { err });
      }
    }
    awaitReceipt();
  }, [getTokenIndex, hash]);
}
