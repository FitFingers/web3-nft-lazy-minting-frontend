import traits from "resources/all-traits.json";

const getMushroomMetadata = async (req, res) => {
  const tokenId = req.query.id; // from query URL
  const totalMushrooms = 420;

  if (parseInt(tokenId) < totalMushrooms) {
    const tokenName = `#${tokenId}`;
    const mushroom = traits[parseInt(tokenId)];
    // const mushroom = traits[ Math.floor(Math.random() * 8888) ] // for testing on rinkeby

    // CHECK OPENSEA METADATA STANDARD DOCUMENTATION https://docs.opensea.io/docs/metadata-standards
    let metadata = {};
    metadata = {
      name: tokenName,
      description: "Satoshi Shrooms",
      tokenId: parseInt(tokenId),
      // image: "ipfs://QmUeE4LLjuMMAim96sQT15k7QmjnP8WcoqHxvs2gb4ms8h/",
      // image: `https://gateway.pinata.cloud/ipfs/QmUeE4LLjuMMAim96sQT15k7QmjnP8WcoqHxvs2gb4ms8h/${tokenId}.png`,
      image: mushroom.tokenId,
      // image: `https://gateway.pinata.cloud/ipfs/${mushroom.imageIPFS}`,
      external_url: "https://satoshishrooms.club",
      attributes: [
        {
          trait_type: "Background",
          value: mushroom.Background,
        },
        {
          trait_type: "Color",
          value: mushroom.Color,
        },
        {
          trait_type: "Spots",
          value: mushroom.Spots,
        },
        {
          trait_type: "Environment",
          value: mushroom.Environment,
        },
        {
          trait_type: "Toxicity",
          value: mushroom.Toxicity,
        },
        {
          trait_type: "Species",
          value: mushroom.Species,
        },
        {
          trait_type: "Magic",
          value: mushroom.Magic,
        },
      ],
    };

    console.log(metadata);

    res.statusCode = 200;
    res.json(metadata);
  } else {
    res.statuscode = 404;
    res.json({ error: "The mushroom you requested is out of range" });
  }
};

export default getMushroomMetadata;
