import type { ReactNode } from "react";
import Head from "next/head";
import { Box } from "@chakra-ui/react";
import { Header } from "./header";
import { GoogleAnalytics } from "@next/third-parties/google";
import { env } from "~/env";
import { useI18n } from "~/i18n";

interface LayoutProps {
  title?: string;
  children: ReactNode;
  ogTitle?: string;
  ogDescription?: string;
  ogImgSubtitle?: string;
  ogImage?: string;
  useDefaultOg?: boolean;
  isCodingMode?: boolean;
  headerToolbar?: ReactNode;
}

export function Layout({
  title,
  children,
  ogTitle = "",
  ogDescription,
  ogImgSubtitle = "",
  ogImage,
  useDefaultOg = true,
  isCodingMode = false,
  headerToolbar,
}: LayoutProps) {
  const { locale } = useI18n();
  const siteTitle = title ? `${title} | SDUGPU` : "SDUGPU";
  const pageDescription =
    ogDescription ??
    (locale === "zh"
      ? "一个用于编写、运行和评测 CUDA kernel 的 GPU 编程练习平台。"
      : "A GPU programming practice platform for writing, running, and benchmarking CUDA kernels.");

  // Generate dynamic OG image URL if no custom image is provided and useDefaultOg is true
  const ogImageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${env.NEXT_PUBLIC_BASE_URL}${ogImage}`
    : useDefaultOg
      ? `${env.NEXT_PUBLIC_BASE_URL}/api/og?title=${encodeURIComponent(ogTitle)}&subTitle=${encodeURIComponent(ogImgSubtitle)}`
      : undefined;

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={env.NEXT_PUBLIC_BASE_URL} />

        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {ogImageUrl && (
          <>
            <meta property="og:image" content={ogImageUrl} />
            <meta name="twitter:image" content={ogImageUrl} />
          </>
        )}
      </Head>

      <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />

      <Box h="100vh" bg="brand.dark" display="flex" flexDirection="column">
        <Box p={{ base: 2, md: 2 }}>
          <Header isCodingMode={isCodingMode} toolbar={headerToolbar} />
        </Box>
        <Box
          flex="1"
          borderRadius="xl"
          h="100%"
          px={{ base: 4, md: 2 }}
          py={{ base: isCodingMode ? 0 : 4, md: isCodingMode ? 0 : 2 }}
          overflow="auto"
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
