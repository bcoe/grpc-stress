process.env.GRPC_TRACE = 'all';
process.env.GRPC_VERBOSITY = 'DEBUG';

// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');
const {Logging} = require('@google-cloud/logging');
// Creates a client
const logging = new Logging({projectId: 'google.com:cloud-storage-adventure'});
// Selects the log to write to
const logger = logging.log('grpc-stress');

// Creates a client
const pubsub = new PubSub();

/**
 * TODO(developer): Uncomment the following lines to run the sample.
 */
const subscriptionName = 'debug-136405560';
const timeout = 60;

// References an existing subscription
const subscription = pubsub.subscription(subscriptionName, {
  flowControl: {
    allowExcessMessages: true,
    maxExtension: 1,
    maxMessages: 1
  },
   streamingOptions: {
      timeout: 5000
  }
});

function simulateBlockedMainThread () {
  console.info('simulating CPU bound operation');
  const start = Date.now();
  while ((Date.now() - start) < 10000) {};
}
setInterval(() => {
//  simulateBlockedMainThread();
}, 50000);

// Create an event handler to handle messages
let messageCount = 0;
const messageHandler = message => {
  console.log(`${messageCount} messages processed`);
  messageCount += 1;
  const data = Buffer.from(message.data, 'base64').toString('utf8');
  console.log(data.substring(0, 10));
  const start = Date.now()
  while ((Date.now() - start) < 1000) {};
  message.ack();
};

log('reader started');

async function log (message) {
  const metadata = {
    resource: {type: 'global'},
  }
  const entry = logger.entry(metadata, message);

  // Writes the log entry
  await logger.write(entry);
}

function logError (error) {
  console.error(error.stack)
  return log(JSON.stringify(error.stack));
}

// Listen for new messages until timeout is hit
subscription
  .on('error', logError)
  .on(`message`, messageHandler);

process.on('unhandledRejection', async (error) => {
  await logError(error);
  process.exit(1);
});

process.on('uncaughtException', async (error) => {
  await logError(error);
  process.exit(1);
});
