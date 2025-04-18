const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // autoprefixer is often included by default or via Next.js itself,
    // but let's keep it for now unless it causes issues
    autoprefixer: {},
  },
};

export default config;
