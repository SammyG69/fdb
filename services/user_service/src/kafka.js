import { Kafka, logLevel } from "kafkajs";

const brokers = (process.env.KAFKA_BROKERS || "localhost:9092").split(",");
const sasl = process.env.KAFKA_SASL_USERNAME
  ? {
      mechanism: "scram-sha-256",
      username: process.env.KAFKA_SASL_USERNAME,
      password: process.env.KAFKA_SASL_PASSWORD,
    }
  : undefined;

export const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME || "user-service",
  brokers,
  ssl: !!process.env.KAFKA_SASL_USERNAME,
  sasl,
  logLevel: logLevel.INFO,
});

export const producer = kafka.producer({
  allowAutoTopicCreation: false,
});

export const consumer = kafka.consumer({
  groupId: "user-service",
});