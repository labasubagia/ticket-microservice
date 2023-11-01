import { AckPolicy, StringCodec, connect, consumerOpts } from "nats";
import { NatsBroker } from "./nats";

const URL = "http://0.0.0.0:4222";

const runNats = async () => {
  const broker = new NatsBroker(URL);
  await broker.connect();
  console.log("start subscribe");
  await broker.subscribe(
    "ticket:created",
    (message) => console.log("receive message:", message),
    { queue: "group1" }
  );
};

const runLegacyPushSubscribe = async () => {
  const sc = StringCodec();
  const nc = await connect({ servers: URL });

  const js = nc.jetstream();

  const opts = consumerOpts()
    .deliverTo("ticket_created")
    .queue("myQueue")
    .ackExplicit()
    .manualAck();

  const pubSub = await js.subscribe("ticket:created", opts);
  for await (const m of pubSub) {
    console.log(
      `[${m.seq}] legacy push subscriber received ${m.subject}: ${sc.decode(
        m.data
      )}`
    );
    m.ack();
  }

  await pubSub.destroy();
};

const runLegacyPullSubscribe = async () => {
  const sc = StringCodec();
  const nc = await connect({ servers: URL });

  const js = nc.jetstream();

  const opts = consumerOpts().queue("myQueue").ackExplicit().manualAck();

  const pullSub = await js.pullSubscribe("ticket:created", opts);
  const done = (async () => {
    for await (const m of pullSub) {
      console.log(
        `[${m.seq}] legacy push subscriber received ${m.subject}: ${sc.decode(
          m.data
        )}`
      );
      m.ack();
    }
  })();

  pullSub.pull({ batch: 15, no_wait: true });

  const timer = setInterval(() => {
    pullSub.pull({ batch: 15, no_wait: true });
  }, 1000);

  await done;
  clearInterval(timer);
};

const run = async () => {
  const sc = StringCodec();
  const nc = await connect({ servers: URL });
  const jsm = await nc.jetstreamManager();

  const stream = "ticket";
  const subject = "ticket:created";

  const consumers = await jsm.consumers.list(stream).next();
  if (!consumers.find((c) => c.name == subject)) {
    try {
      await jsm.consumers.add(stream, {
        name: subject,
        ack_policy: AckPolicy.Explicit,
      });
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  const js = nc.jetstream();
  const consumer = await js.consumers.get(stream, subject);
  const messages = await consumer.consume({ max_messages: 5000 });

  console.log("consume started...");
  for await (const m of messages) {
    console.log(`[${m.seq}] received ${m.subject}: ${sc.decode(m.data)}`);
    m.ack();
  }
  nc.drain();
  console.log("consume finished...");
};

console.clear();
// runLegacyPushSubscribe();
// runLegacyPullSubscribe();
run();
