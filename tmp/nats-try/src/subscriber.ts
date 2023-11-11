import { connect } from "nats";
import { TicketCreatedConsumer } from "./jetstream/ticket-created-event";
import { TicketUpdatedConsumer } from "./jetstream/ticket-updated-event";

const URL = "http://0.0.0.0:4222";

const run = async () => {
  console.clear();
  const client = await connect({ servers: URL });

  const c1 = await new TicketCreatedConsumer().init(client);
  const c2 = await new TicketUpdatedConsumer().init(client);

  console.log("waiting for messages...");
  await Promise.all([c1.consume(), c2.consume()]);
};

run();
