const OWNER_ADDRESS = process.env.OWNER_ADDRESS;

const defaultOptions = {
  estimateGas: true,
  passGas: false, // return estimated gas
  verbose: true,
  callFunction: true,
};

function log(verbose, ...msgs) {
  if (verbose) console.log(...msgs);
}

exports.default = async function (name, contract, opts, params) {
  const options = { ...defaultOptions, ...opts };
  const returnValue = {};

  try {
    const funcRef = await contract.methods[name];
    const func = params ? funcRef(params) : funcRef();
    returnValue[name] = funcRef;

    if (options.estimateGas) {
      log(options.verbose, `Estimating gas for ${name}...`);
      const gasCost = await func.estimateGas({
        from: OWNER_ADDRESS,
      });
      if (options.passGas) returnValue.gas = gasCost;
      log(
        options.verbose,
        `Gas estimate for ${name}: ${gasCost} (${
          gasCost / Math.pow(10, 9)
        } ETH)`
      );
    }

    if (options.callFunction) {
      const result = await func.call({
        from: OWNER_ADDRESS,
      });
      log(options.verbose, `${name} result:`, result);
      return result;
    }

    return returnValue;
  } catch (err) {
    console.debug("ERROR", err);
  }
};
