import traits from "resources/metadata/all-traits.json";

const getMushroomMetadata = async (req, res) => {
  const tokenId = req.query.id; // from query URL
  const totalMushrooms = 420;

  if (parseInt(tokenId) < totalMushrooms) {
    const tokenName = `#${tokenId}`;
    const trait = traits[parseInt(tokenId)];
    // const trait = traits[ Math.floor(Math.random() * 8888) ] // for testing on rinkeby

    // CHECK OPENSEA METADATA STANDARD DOCUMENTATION https://docs.opensea.io/docs/metadata-standards
    let metadata = {};
    metadata = {
      name: tokenName,
      description: "Satoshi Shrooms",
      tokenId: parseInt(tokenId),
      image: trait.imageIPFS,
      // image: `https://gateway.pinata.cloud/ipfs/${trait["imageIPFS"]}`,
      external_url: "https://satoshishrooms.club",
      attributes: [
        {
          Background: "Background",
          value: trait["Background"],
        },
        {
          Color: "Color",
          value: trait["Color"],
        },
        {
          Spots: "Spots",
          value: trait["Spots"],
        },
        {
          Environment: "Environment",
          value: trait["Environment"],
        },
        {
          Toxicity: "Toxicity",
          value: trait["Toxicity"],
        },
        {
          Species: "Species",
          value: trait["Species"],
        },
        {
          Magic: "Magic",
          value: trait["Magic"],
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
