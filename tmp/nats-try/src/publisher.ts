import { randomBytes } from "crypto";
import { connect } from "nats";
import { TicketCreatedPublisher } from "./jetstream/ticket-created-event";

const URL = "http://0.0.0.0:4222";

const run = async () => {
  const nc = await connect({ servers: URL });

  const publisher1 = await new TicketCreatedPublisher(nc).init();
  const proms = Array.from({ length: 10 }).map((_v, idx) => {
    return publisher1.publish({
      id: String(idx + 1),
      title: `ticket ${idx + 1}`,
      price: 200,
      userId: randomBytes(5).toString("hex"),
    });
  });
  await Promise.all(proms);

  const publisher2 = await new TicketCreatedPublisher(nc).init();
  await publisher2.publish({
    id: "1",
    title: "hello",
    price: 100,
    userId: randomBytes(5).toString("hex"),
  });

  await nc.drain();
};

run();
