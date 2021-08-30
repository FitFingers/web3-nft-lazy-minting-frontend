import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import classes from "styles/Home.module.css";
import MushroomBanner from "public/mushroom-banner.png";

export default function Home() {
  return (
    <div className={classes.container}>
      <Head>
        <title>Satoshi Shrooms</title>
        <meta name="description" content="Satoshi Shrooms" />
        <link rel="icon" href="/favicon.png" />
      </Head>

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
                      <p>View all the Satoshi Shrooms that were minted already</p>
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
              <button className={classes.button}><span>Mint</span></button>
            </div>
            <div className={classes.tile}>
              <h3>Here you can mint your own Satoshi Shroom</h3>
              <p>
                Just connect your metamask, select the number to mint and click
                the button!
              </p>
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
