import { randomBytes } from "crypto";
import { connect } from "nats";
import { TicketCreatedPublisher } from "./jetstream/ticket-created-event";
import { TicketUpdatedPublisher } from "./jetstream/ticket-updated-event";

const URL = "http://0.0.0.0:4222";

const run = async () => {
  const client = await connect({ servers: URL });
  let count = 0;

  const publisher1 = await new TicketCreatedPublisher().init(client);
  const proms = Array.from({ length: 5 }).map((_v, idx) => {
    count++;
    return publisher1.publish({
      id: String(count),
      title: `created ${count}`,
      price: 200,
      userId: randomBytes(5).toString("hex"),
    });
  });
  await Promise.all(proms);

  const publisher2 = await new TicketUpdatedPublisher().init(client);
  const proms2 = Array.from({ length: 5 }).map((_v, idx) => {
    count++;
    return publisher2.publish({
      id: String(count),
      title: `updated ${count}`,
      price: 50,
      userId: randomBytes(5).toString("hex"),
    });
  });
  await Promise.all(proms2);

  await client.drain();
};

run();
