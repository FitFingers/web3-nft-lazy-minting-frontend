const getMushroomMetadata = async (req, res) => {
  const { id: tokenId } = req.query;
  const totalMushrooms = 420;

  if (parseInt(tokenId) < totalMushrooms) {
    const tokenName = `#${tokenId}`;

    const metadata = {
      name: tokenName,
      description: "Satoshi Shrooms",
      tokenId: parseInt(tokenId),
      image:
        "https://gateway.pinata.cloud/ipfs/QmVhugte1qfJknwFJ6RkEULAUxoH5uxQjVddAj9aeBoJnT",
      external_url: "https://satoshishrooms.club",
      attributes: [
        {
          trait_type: "Background",
          value: "Unknown",
        },
        {
          trait_type: "Color",
          value: "Unknown",
        },
        {
          trait_type: "Spots",
          value: "Unknown",
        },
        {
          trait_type: "Environment",
          value: "Unknown",
        },
        {
          trait_type: "Toxicity",
          value: "Unknown",
        },
        {
          trait_type: "Species",
          value: "Unknown",
        },
        {
          trait_type: "Magic",
          value: "Unknown",
        },
      ],
    };

    res.statusCode = 200;
    res.json(metadata);
  } else {
    res.statuscode = 404;
    res.json({ error: "The mushroom you requested is out of range" });
  }
};

export default getMushroomMetadata;
