import { Provider } from "react-redux";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import GlobalStyle from "../styles/GlobalStyle";
import store from "../context/store";
import Theme from "../Theme";
import colors from "../utils/colors";
import { RouteGuard } from "../components/RouteGuard";
import Layout from "../components/Layout";

const progress = new ProgressBar({
  size: 4,
  color: colors.MAIN_COLOR,
  className: "z-50",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <Theme>
          <RouteGuard>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RouteGuard>
        </Theme>
      </Provider>
    </>
  );
}

export default MyApp;
