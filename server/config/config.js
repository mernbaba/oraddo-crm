require("dotenv").config();

const dialect = process.env.DB_DIALECT || "postgres";
const useSsl = (process.env.DB_SSL || "true").toLowerCase() !== "false";

const baseConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  dialect,
};

if (useSsl && dialect === "postgres") {
  baseConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

module.exports = {
  development: { ...baseConfig },
  test: { ...baseConfig },
  production: { ...baseConfig },
};
