import { randomBytes } from "crypto";
import { NatsBroker } from "./nats";

const run = async () => {
  const broker = new NatsBroker("http://0.0.0.0:4222");
  await broker.connect();

  const payload = {
    id: randomBytes(5).toString("hex"),
    message: "hello world",
  };
  broker.publish("ticket:created", payload);
  console.log("published", payload);
};

run();
