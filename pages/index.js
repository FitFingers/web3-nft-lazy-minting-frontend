import { useCallback, useMemo, useReducer } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import classes from "styles/Home.module.css";
import MushroomBanner from "public/mushroom-banner.png";
import useMetaMask from "hooks/useMetaMask";

const isDev = process.env.NODE_ENV === "development";

export default function Home() {
  const { account, network, connectWallet, mint, getBaseURI, setBaseURI } =
    useMetaMask();

  const readyInteractive = useMemo(
    () => account && network && network === "rinkeby",
    [account, network]
  );

  const [{ mintCount }, dispatch] = useReducer(
    (state, moreState) => ({ ...state, ...moreState }),
    { mintCount: 1 }
  );

  const handleMintLess = useCallback(
    () => dispatch({ mintCount: (mintCount - 1) % 10 }),
    [mintCount]
  );
  const handleMintMore = useCallback(
    () => dispatch({ mintCount: (mintCount + 1) % 10 }),
    [mintCount]
  );

  const handleMint = useCallback(
    async () => mint(mintCount),
    [mint, mintCount]
  );

  const writeBaseURI = useCallback(async () => {
    const str = window.prompt();
    setBaseURI(str);
  }, [setBaseURI]);

  return (
    <div className={classes.container}>
      <Head>
        <title>Satoshi Shrooms</title>
        <meta name="description" content="Satoshi Shrooms" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className={classes.connectButton} onClick={connectWallet}>
        <span>
          {account && network ? (
            network
          ) : (
            <>
              Connect
              <br />
              Wallet
            </>
          )}
        </span>
      </div>

      <main className={classes.main}>
        {/* BANNER */}
        <div className={classes.fullWidth}>
          <Image
            alt="Satoshi Shrooms banner image"
            src={MushroomBanner}
            placeholder="blur"
            className={classes.bannerImage}
          />
          <div className={classes.titleWrapper}>
            <h1 className={classes.title}>Satoshi Shrooms</h1>
            <p className={classes.description}>TestNet Implementation</p>
          </div>
        </div>

        {/* BUTTON GRID */}
        <div className={classes.buttons} id="buttons">
          <div className={classes.grid}>
            <div className={classes.card}>
              <div className={classes.cardBg}>
                <Link passHref href="#mint">
                  <a href="">
                    <div className={classes.cardInner}>
                      <h2>Mint &rarr;</h2>
                      <p>Purchase your own, brand-new Satoshi Shroom</p>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
            <div className={classes.card}>
              <div className={classes.cardBg}>
                <Link passHref href="#gallery">
                  <a href="">
                    <div className={classes.cardInner}>
                      <h2>Gallery &rarr;</h2>
                      <p>
                        View all the Satoshi Shrooms that were minted already
                      </p>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* MINTING */}
        <div className={classes.minting} id="mint">
          <h2>Mint</h2>
          <div className={classes.mintingInner}>
            <div className={classes.tile}>
              <h3>Here you can mint your own Satoshi Shroom</h3>
              <p>
                Just connect your metamask, select the number to mint and click
                the button!
              </p>

              <div className={classes.counter}>
                <div
                  className={[classes.less, classes.counterButton].join(" ")}
                  onClick={handleMintLess}
                >
                  -
                </div>
                <div className={classes.display}>{mintCount}</div>
                <div
                  className={[classes.more, classes.counterButton].join(" ")}
                  onClick={handleMintMore}
                >
                  +
                </div>
              </div>

              <button
                disabled={!readyInteractive}
                className={classes.button}
                onClick={handleMint}
              >
                <span>Mint</span>
              </button>

              {isDev && (
                <div className={classes.buttonFlexWrapper}>
                  <button
                    disabled={!readyInteractive}
                    className={classes.button}
                    onClick={getBaseURI}
                  >
                    <span>Read</span>
                  </button>
                  <button
                    disabled={!readyInteractive}
                    className={classes.button}
                    onClick={writeBaseURI}
                  >
                    <span>Write</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GALLERY */}
        <div className={classes.gallery} id="gallery">
          <h2>Gallery</h2>
          <div className={classes.galleryInner}>
            <div className={classes.fullWidth}>
              <Image
                alt="Satoshi Shrooms banner image"
                src={MushroomBanner}
                placeholder="blur"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className={classes.footer}>
        <Link passHref href="/">
          <a href="">
            <p>Satoshi Shrooms {new Date().getFullYear()}</p>
          </a>
        </Link>
      </footer>
    </div>
  );
}
