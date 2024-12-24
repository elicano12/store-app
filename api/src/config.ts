import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    postgres: {
      dbName: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
    },
    wompiApi: {
      url: process.env.WOMPI_API_URL,
      publicKey: process.env.WOMPI_PUBLIC_KEY,
      privateKey: process.env.WOMPI_PRIVATE_KEY,
      integrity: process.env.WOMPI_INTEGRITY_KEY,
    },
  };
});
