import { Partitioners, Kafka, logLevel } from "kafkajs";


export const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME || "meal-service",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  connectionTimeout: 5000, 
  loglevel: logLevel.INFO,
});

export const producer = kafka.producer({
  allowAutoTopicCreation: false,
});