import Nav from "@/components/Nav";
import { AuthContextProvider } from "@/context/AuthContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <AuthContextProvider>
        <Nav />
        <Component {...pageProps} />
      </AuthContextProvider>
    </>
  );
}
