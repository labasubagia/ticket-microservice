import { randomBytes } from "crypto";
import { NatsBroker } from "./nats";

const run = async () => {
  const broker = new NatsBroker("http://0.0.0.0:4222");
  await broker.connect();

  const id = randomBytes(5).toString("hex");
  broker.publish("ticket:created", { id, message: `hello` });
};

run();
