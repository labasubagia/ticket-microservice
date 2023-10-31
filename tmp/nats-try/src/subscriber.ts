import { NatsBroker } from "./nats";

const run = async () => {
  const broker = new NatsBroker("http://0.0.0.0:4222");
  await broker.connect();
  console.log("start subscribe");
  await broker.subscribe("ticket:created", (message) =>
    console.log("receive message:", message)
  );
};

run();
