const { Kafka, logLevel } = require("kafkajs");

const brokers = (process.env.KAFKA_BROKERS || "localhost:9092").split(",");

export const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME || "meal-service",
  brokers,
  loglevel: logLevel.INFO,
});

export const producer = kafka.producer({
  allowAutoTopicCreation: false,
});

module.exports = { kafka, producer };