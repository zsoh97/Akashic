/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['storage.googleapis.com', 'covers.openlibrary.org', 'books.google.com'],
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig 