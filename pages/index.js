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

        <div className={classes.grid}>
          <div className={classes.card}>
            <div className={classes.cardBg}>
              <Link passHref href="/about">
                <div className={classes.cardInner}>
                  <h2>Mint &rarr;</h2>
                  <p>Purchase your own, brand-new Satoshi Shroom</p>
                </div>
              </Link>
            </div>
          </div>

          <div className={classes.card}>
            <div className={classes.cardBg}>
              <Link passHref href="/about">
                <div className={classes.cardInner}>
                  <h2>Gallery &rarr;</h2>
                  <p>View all the Satoshi Shrooms that were minted already</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className={classes.footer}>
        <Link
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <>
            Powered by{" "}
            <span className={classes.logo}>
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </>
        </Link>
      </footer>
    </div>
  );
}
