import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import { SideNav } from "~/components/SideNav";

import "./index.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Stardew Hub</title>
        <meta
          name="description"
          content="This is a social platform created for Stardew Valley players."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="blue-gradient">
        <div className="container mx-auto flex items-start sm:pr-4">
          <SideNav />
          <div className="min-h-screen flex-grow border-x bg-white text-xl">
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
