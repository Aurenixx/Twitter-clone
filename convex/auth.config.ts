export default {
  providers: [
    {
      domain: process.env.EXPO_PUBLIC_CLERK_ISSUER,
      applicationID: "convex",
    },
  ],
};