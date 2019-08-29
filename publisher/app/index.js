// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');
const cryptoRandomString = require('crypto-random-string');

// Creates a client
const pubsub = new PubSub();

const MAX_DATA_SIZE = 64;// 3000000;
const MAX_ATTRIBUTE_SIZE = 64;

const characters = "1234abcde☠☡☢☣☤☥☦☧☨☩☪☭"

setInterval(async () => {
  const topicName = 'debug-136405560';
  const dataSize = parseInt(Math.random() * MAX_DATA_SIZE);
  const attributeSize = parseInt(Math.random() * MAX_ATTRIBUTE_SIZE); 

  const attributes = {
    '☃': cryptoRandomString({length: attributeSize, characters}),
    'hello': cryptoRandomString({length: attributeSize, characters})
  };
  attributes[cryptoRandomString({length: attributeSize, characters})] = 'hello';
  attributes[cryptoRandomString({length: attributeSize})] = cryptoRandomString({length: attributeSize, characters});

  const dataBuffer = Buffer.from(cryptoRandomString({length: dataSize, characters}));
  const messageId = await pubsub.topic(topicName).publish(dataBuffer, attributes);

  console.log(`Message ${messageId} published with dataSize = ${dataSize} and attributeSize = ${attributeSize}`);  
}, 200);