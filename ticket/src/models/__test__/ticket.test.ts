/* eslint-disable @typescript-eslint/no-non-null-assertion */
import mongoose from 'mongoose'

import { Ticket } from '@/models/ticket'

it('implements optimistic concurrency control', async () => {
  // create ticket
  const ticket = Ticket.build({
    price: 10,
    title: 'ticket',
    userId: new mongoose.mongo.ObjectId().toString()
  })
  await ticket.save()

  // fetch twice
  const first = await Ticket.findById(ticket.id)
  const second = await Ticket.findById(ticket.id)

  // make two separate change
  first!.set({ price: 10 })
  second!.set({ price: 15 })

  // first should ok
  await first!.save()

  // second should fail
  try {
    await second!.save()
  } catch (error) {
    return
  }

  throw new Error('Should not reach this point')
})

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    price: 10,
    title: 'ticket',
    userId: new mongoose.mongo.ObjectId().toString()
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)

  await ticket.save()
  expect(ticket.version).toEqual(1)

  await ticket.save()
  expect(ticket.version).toEqual(2)
})
