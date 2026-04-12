import { Kafka, logLevel } from "kafkajs";

const sasl = process.env.KAFKA_SASL_USERNAME
  ? {
      mechanism: "scram-sha-256",
      username: process.env.KAFKA_SASL_USERNAME,
      password: process.env.KAFKA_SASL_PASSWORD,
    }
  : undefined;

export const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME || "tracking-service",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  ssl: !!process.env.KAFKA_SASL_USERNAME,
  sasl,
  logLevel: logLevel.INFO,
});

export const consumer = kafka.consumer({
  groupId: "tracking-service",
});
