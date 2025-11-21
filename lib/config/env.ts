export const env = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    timeout: Number.parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000"),
  },
  auth: {
    secret: process.env.NEXT_AUTH_SECRET || "super-secret-key",
    expiresIn: "1d",
  },
  features: {
    enableMockData: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA !== "false",
  },
}
