// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');

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
  console.log(`Received message ${message.id}:`);
  console.log(`\tData Size: ${message.data.length}`);
  console.log(`\tData: ${message.data.slice(0, 128)}`);
  console.log(`\tAttribute Count: ${JSON.stringify(message.attributes, null, 2)}`);
  console.log(`${messageCount} messages processed`);
  console.log('-------------------');
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

// Listen for new messages until timeout is hit
subscription.on(`message`, messageHandler);

process.on('unhandledRejection', error => {
  console.info(error.stack);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.info(error.stack);
  process.exit(1);
});
