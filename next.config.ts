import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  reactCompiler: true,
  allowedDevOrigins: ["localhost:3000", "192.168.1.102:3000"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);