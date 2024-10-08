/**
 * If we wanted to start writing logs to a file
 * or send them to an external logging service like graylog or papertrail
 * we would only have to make changes in one place.
 */
const info = (...params) => {
  console.log(...params);
};

const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info,
  error,
};
