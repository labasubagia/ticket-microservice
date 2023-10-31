import { NatsBroker } from "./nats";

const run = async () => {
  const broker = new NatsBroker("http://0.0.0.0:4222");
  await broker.connect();
  await broker.subscribe("ticket:created", (msg: string) => console.log(msg));
};

run();
