const Raven = require('raven');

function sendError(err) {
  return new Promise((resolve) => {
    if (process.env.NODE_ENV === 'production') {
      Raven.config(
        process.env.NODE_ENV === 'production'
          && 'https://b264ad2525f24b97a97db00cfa1f5829@sentry.io/1221652',
        {
          captureUnhandledRejections: true,
          autoBreadcrumbs: true
          //   release: '0e4fdef81448dcfa0e16ecc4433ff3997aa53572'
        }
      ).install();

      console.log('sendError', err);
      return Raven.captureException(err, (sendErr, eventId) => {
        console.log('raven.callback');
        if (sendErr) {
          console.log('sendErr', sendErr);
        }

        console.log('cb.eventId', eventId);
        return resolve(eventId);
      });
    }

    return Promise.resolve();
  });
}

module.exports = {
  sendError
};
