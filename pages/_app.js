import "styles/globals.css";
import { FeedbackContext } from "components/snackbar";

function SatoshiShrooms({ Component, pageProps }) {
  return (
    <FeedbackContext>
      <Component {...pageProps} />
    </FeedbackContext>
  );
}

export default SatoshiShrooms;
