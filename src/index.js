'use strict';

const express = require('express');
const logger = require('./utils/Logger');
const IPLookupRoutes = require('./routes/IPLookupRoutes');
const PORT = 3000;

(async () => {
  const app = express();
  app.use(express.json());
  
  app.use("/api/v1/lookup", IPLookupRoutes);

  const server = app.listen(PORT, function() {
    logger.log(`Server started on port ${PORT}`);
  });

  server.on("error", (err) => {
    logger.error(err);
  });
})();
