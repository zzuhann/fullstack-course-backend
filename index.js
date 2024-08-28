const app = require("./app");
const logger = require("./utils/logger");
const config = require("./utils/config");

const PORT = process.env.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
