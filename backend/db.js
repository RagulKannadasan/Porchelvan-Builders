const postgres = require('postgres');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

// Transparent Proxy wrapper to automatically add a legacy MongoDB `_id` alias
// for any `id` column returned in PostgreSQL query results.
const sqlWrapper = new Proxy(sql, {
  apply(target, thisArg, argumentsList) {
    const queryResult = Reflect.apply(target, thisArg, argumentsList);
    if (queryResult && typeof queryResult.then === 'function') {
      return queryResult.then(rows => {
        if (Array.isArray(rows)) {
          rows.forEach(row => {
            if (row && typeof row === 'object' && 'id' in row) {
              row._id = row.id;
            }
          });
        } else if (rows && typeof rows === 'object' && 'id' in rows) {
          rows._id = rows.id;
        }
        return rows;
      });
    }
    return queryResult;
  }
});

module.exports = sqlWrapper;
