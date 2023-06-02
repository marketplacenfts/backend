module.exports = {
  "development": {
      "username": 'root',
      "password": 'Movi12,.',
      "database": 'marketplace',
      "dialect": "mysql"
  },
  "test": {
      "username": "root",
      "password": null,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_ENDPOINT,
    "dialect": "mysql"
  }
  };