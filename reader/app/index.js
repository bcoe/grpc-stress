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
// const timeout = 60;

// References an existing subscription
const subscription = pubsub.subscription(subscriptionName, {
  flowControl: {
    allowExcessMessages: true,
    maxExtension: 1,
    maxMessages: 5
  },
});

// Create an event handler to handle messages
let messageCount = 0;
const messageHandler = message => {
  console.log(`${messageCount} messages processed`);
  messageCount += 1;

  // "Ack" (acknowledge receipt of) the message
  const val = Math.random() < 0.5
  if (val < 0.5) {
    console.info(`ignoring ${message.id}`);
  } else if (val < 0.75) {
    console.info(`ack ${message.id}`);
    message.ack();
  } else {
    console.info(`nack ${message.id}`);
    message.nack();
  }
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
