import { connect } from "nats";
import { TicketCreatedConsumer } from "./jetstream/ticket-created-event";
import { TicketUpdatedConsumer } from "./jetstream/ticket-updated-event";

const URL = "http://0.0.0.0:4222";

const run = async () => {
  console.clear();
  const nc = await connect({ servers: URL });

  const c1 = await new TicketCreatedConsumer(nc).init();
  const c2 = await new TicketUpdatedConsumer(nc).init();

  console.log("waiting for messages...");
  await Promise.all([c1.consume(), c2.consume()]);
};

run();
