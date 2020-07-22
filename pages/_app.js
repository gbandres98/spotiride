import App from "next/app";
import Head from "next/head";
import "./style.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="container">
      <Head>
        <title>SpotiRide</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};
