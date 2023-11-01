import { randomBytes } from "crypto";
import { StringCodec, connect } from "nats";
import { NatsBroker } from "./nats";

const runNats = async () => {
  const broker = new NatsBroker("http://0.0.0.0:4222");
  await broker.connect();

  const payload = {
    id: randomBytes(5).toString("hex"),
    message: "hello world",
  };
  broker.publish("ticket:created", payload);
  console.log("published", payload);
};

const runStream = async () => {
  const sc = StringCodec();

  const nc = await connect({ servers: "http://0.0.0.0:4222" });
  const jsm = await nc.jetstreamManager();

  const stream = "ticket";
  const subject = "ticket:*";
  await jsm.streams.add({ name: stream, subjects: [subject] });

  nc.publish(
    "ticket:created",
    sc.encode(JSON.stringify({ message: "Ticket Created" }))
  );
  nc.publish(
    "ticket:updated",
    sc.encode(JSON.stringify({ message: "Ticket Updated" }))
  );
  console.log("published");
  await nc.drain();
};

runStream();
