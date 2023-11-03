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
  await jsm.streams.add({
    name: "TICKETS",
    subjects: ["ticket.*"],
  });

  const js = nc.jetstream();
  const proms = Array.from({ length: 10 }).map((_v, idx) => {
    return js.publish(
      "ticket.created",
      sc.encode(JSON.stringify({ message: `hello world ${idx}` }))
    );
  });
  await Promise.all(proms);
};

runStream();
