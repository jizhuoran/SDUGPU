import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Providers } from "~/components/layout/providers";
import { I18nProvider } from "~/i18n";
import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Providers>
        <I18nProvider>
          <Component {...pageProps} />
        </I18nProvider>
      </Providers>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
