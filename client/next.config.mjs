/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com`,
      },
      {
        protocol: "https",
        hostname: `hiyori-backpack.s3.us-west-2.amazonaws.com`,
      },
      {
        protocol: "https",
        hostname: `mvlwnlczchszoweflhwq.supabase.co`,
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@aws-sdk/client-s3", "sharp"],
  },
}

export default nextConfig
