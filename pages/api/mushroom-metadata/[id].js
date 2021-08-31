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
      image: mushroom.imageIPFS,
      // image: `https://gateway.pinata.cloud/ipfs/${mushroom.imageIPFS}`,
      external_url: "https://satoshishrooms.club",
      attributes: [
        {
          Background: "Background",
          value: mushroom.Background,
        },
        {
          Color: "Color",
          value: mushroom.Color,
        },
        {
          Spots: "Spots",
          value: mushroom.Spots,
        },
        {
          Environment: "Environment",
          value: mushroom.Environment,
        },
        {
          Toxicity: "Toxicity",
          value: mushroom.Toxicity,
        },
        {
          Species: "Species",
          value: mushroom.Species,
        },
        {
          Magic: "Magic",
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
