
/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['ts','tsx','mdx'],
    experimental: {
         mdxRs: true,
         serverComponentsExternalPackages: ['mongoose'],
      },
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '*',
          },
          {
            protocol: 'http',
            hostname: '*',
          },
        ],
      },
};

export default nextConfig;
