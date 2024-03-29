const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SHROOMS_CONTRACT_ADDRESS;

const OPENSEA_API = {
  mainnet: "https://api.opensea.io/asset/",
  rinkeby: "https://rinkeby-api.opensea.io/api/v1/asset/",
};
const REFRESH_URL = `${OPENSEA_API.rinkeby}${CONTRACT_ADDRESS}/`;

// This should be called after each mint in order to refresh the
// metadata on OpenSea. Otherwise, there is no name, image or metadata
export default async function refreshMetadata(req, res) {
  try {
    const { id: tokenId } = req.query;
    if (!CONTRACT_ADDRESS) throw new Error("No contract address provided");

    // Call the API to refresh this token's metadata
    const refreshUrl = `${REFRESH_URL}${tokenId}/?force_update=true`;
    const response = await fetch(refreshUrl, { method: "GET" });
    const result = await response.json();

    res.status(200).json({ success: result.token_id });
  } catch (err) {
    console.debug("Caught error", { err });
    res.status(500).json({ success: false, error: err });
  }
}
