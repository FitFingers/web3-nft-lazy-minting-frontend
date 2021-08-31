const { readdir, readFile, writeFile } = require("fs").promises;
const path = require("path");

// map the metadata files (1, 2, 3...) and change these two fields:
// "image": "ADD_IMAGES_BASE_URI_HERE2.png",
// "name": "ADD_PROJECT_NAME_HERE 2",

const METADATA_PATH = "resources/satoshi-shrooms/metadata";
const IMAGE_BASE_URI = "https://gateway.pinata.cloud/ipfs/QmUeE4LLjuMMAim96sQT15k7QmjnP8WcoqHxvs2gb4ms8h/";
const NAMING_CONVENTION = (id) => `#${id}`;

async function updateMetadataFiles() {
  try {
    const files = await readdir(METADATA_PATH);

    for await (const file of files) {
      const filepath = path.join(METADATA_PATH, file);
      console.log("File path", filepath);

      const fileContent = await readFile(filepath);
      const data = JSON.parse(fileContent.toString());
      console.log("File content", data);

      const newData = {
        ...data,
        image: `${IMAGE_BASE_URI}${file}.png`,
        name: NAMING_CONVENTION(file),
      };
      console.log("New data", newData);

      const newPath = path.join(METADATA_PATH, "new", file);
      console.log("newPath", newPath);

      const newFile = await writeFile(
        newPath,
        JSON.stringify(newData, null, 2)
      );
      console.log("newFile", newFile);
    }
  } catch (err) {
    console.debug("DEBUG catch error", { err });
  }
}

updateMetadataFiles();
