import { connect } from "nats";
import {
  TicketCreatedConsumer,
  TicketUpdatedConsumer,
} from "./jetstream/ticket";

const URL = "http://0.0.0.0:4222";

const run = async () => {
  const nc = await connect({ servers: URL });

  const consumer1 = await new TicketCreatedConsumer(nc).init();
  const consumer2 = await new TicketUpdatedConsumer(nc).init();

  await Promise.all([consumer1.consume(), consumer2.consume()]);
};

console.clear();
console.log("waiting for messages...");
run();
