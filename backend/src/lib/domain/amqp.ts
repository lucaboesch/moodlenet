// import { delay } from 'bluebird'
import { Message, Options, Replies } from 'amqplib'
import { EventEmitter } from 'events'
import { newUuid } from '../helpers/misc'
// import { nodeLogger } from '.'
import { channelPromise as channel } from './domain.env'
import { FlowId } from './types/path'

const log = console.log //nodeLogger('amqp-transport')

const defPubOpts: Options.Publish = {
  deliveryMode: 2,
}

export const domainPublish = (_: {
  domain: string
  topic: string
  flowId: FlowId
  payload: any
  opts?: DomainPublishOpts
}) =>
  new Promise<void>(async (resolve, reject) => {
    const { topic, flowId, payload, opts, domain } = _
    log([`publish ${domain} ${topic}`, { payload, flowId }], 0)
    const taggedTopic = `${topic}.${flowId._tag}`
    const payloadBuf = json2Buffer(payload)
    const ch = await channel
    const confirmFn = (err: any) => (err ? reject(err) : resolve())

    if (opts?.delay) {
      const { delayedX } = await assertDelayQX({ domain })
      await ch.publish(
        delayedX,
        taggedTopic,
        payloadBuf,
        {
          ...opts,
          ...defPubOpts,
          correlationId: flowId._key,
          replyTo: opts.replyToNodeQ ? mainNodeQName : undefined,
          expiration: opts.delay,
        },
        confirmFn
      )
    } else {
      const domEx = await getAssertDomainExchangeName(domain)
      await ch.publish(
        domEx,
        taggedTopic,
        payloadBuf,
        {
          ...opts,
          ...defPubOpts,
          correlationId: flowId._key,
          replyTo: opts?.replyToNodeQ ? mainNodeQName : undefined,
        },
        confirmFn
      )
    }
  })

export const queueConsume = async (_: {
  qName: string
  // flowId:FlowId // TODO: needs it ?
  handler: (_: {
    msgJsonContent: any
    msg: Message
    flowId: FlowId
    stopConsume(): unknown
  }) => Acks | Promise<Acks>
  opts?: QConsumeOpts
}) => {
  const { handler, opts, qName } = _

  log([`def queueConsume`, { qName }], 0)
  const ch = await channel
  const stopConsume = async () => {
    ch.cancel((await consumerPr).consumerTag)
    ch.deleteQueue(qName)
  }
  const consumerPr = ch.consume(
    qName,
    async (msg) => {
      if (!msg) {
        return
      }

      log([`queueConsume got msg `, { qName }, msg.fields, msg.properties])
      let msgJsonContent: any = `~~~NOT PARSED~~~`
      try {
        msgJsonContent = buffer2Json(msg.content)
        const flowId = msgFlowId(msg)
        if (!flowId) {
          //TODO: figure out possible scenarios manage and log err/warn
          return
        }
        const ack = await handler({ msgJsonContent, msg, stopConsume, flowId })
        ch[ack](msg)
      } catch (err) {
        log([`queueConsume handler error ${qName}`, { msgJsonContent, err }], 0)
        const errorAck = opts?.errorAck || Acks.reject
        ch[errorAck](msg, false)
      }
    },
    { ...opts }
  )
  return { stopConsume }
}

export const getAssertDomainExchangeName = async (domainName: string) => {
  const exName = `Domain.${domainName}`
  return (await assertX({ name: exName, type: 'topic' })).exchange
}

const json2Buffer = <T>(json: T) => Buffer.from(JSON.stringify(json))
const buffer2Json = <T>(buf: Buffer): T => JSON.parse(buf.toString('utf-8'))

export const bindQ = async (_: { name: string; domain: string; topic: string; args?: any }) => {
  const { args, domain, name, topic } = _
  const ex = await getAssertDomainExchangeName(domain)
  if (!asserts.BQ[name]) {
    const ch = await channel
    asserts.BQ[bindQAssertCachekey({ ex, name, topic })] = await ch.bindQueue(name, ex, topic, args)
  }

  return {
    unbind,
  }
  function unbind() {
    unbindQ({ domain, name, topic, args })
  }
}
const bindQAssertCachekey = (_: { name: string; ex: string; topic: string }) =>
  `${_.name}<-${_.ex}.${_.topic}`

export const unbindQ = async (_: { name: string; domain: string; topic: string; args?: any }) => {
  const { args, domain, name, topic } = _
  const ex = await getAssertDomainExchangeName(domain)
  await (await channel).unbindQueue(name, ex, topic, args)
  delete asserts.BQ[bindQAssertCachekey({ ex, name, topic })]
  return asserts.BQ[name]
}

export const sendToQueue = async (_: {
  name: string
  content: any
  opts?: DomainSendToQueueOpts
}) => {
  const { name, content, opts } = _
  return (await channel).sendToQueue(name, json2Buffer(content), {
    ...defPubOpts,
    ...opts,
  })
}

// TODO: may remove BQ?
const asserts = { Q: {}, X: {}, BQ: {} } as {
  Q: Record<string, Replies.AssertQueue>
  X: Record<string, Replies.AssertExchange>
  BQ: Record<string, Replies.Empty>
}

export const assertQ = async (_: { name: string; opts?: DomainQueueOpts }) => {
  const { opts, name } = _
  if (!asserts.Q[name]) {
    const ch = await channel
    asserts.Q[name] = await ch.assertQueue(name, {
      ...opts,
    })
  }
  return asserts.Q[name]
}

const assertX = async (_: {
  name: string
  type: '' | 'topic' | 'direct' | 'headers' | 'fanout' | 'match'
  opts?: DomainExchangeOpts
}) => {
  const { opts, name, type } = _
  if (!asserts.X[name]) {
    const ch = await channel
    asserts.X[name] = await ch.assertExchange(name, type, opts)
  }
  return asserts.X[name]
}

const assertDelayQX = async (_: { domain: string; tag?: string }) => {
  const { domain, tag = '' } = _
  const domainEx = await getAssertDomainExchangeName(domain)
  const prefix = `${domainEx}${tag && `[${tag}]`}:SERVICE_DELAY_`
  const delayedQName = `${prefix}QUEUE`
  const delayedX = `${prefix}EXCH`
  await assertX({ name: delayedX, type: 'fanout' })
  const q = await assertQ({
    name: delayedQName,
    opts: { deadLetterExchange: domainEx },
  })
  await bindQ({ name: delayedQName, domain, topic: '' })
  log(['assert delay q', { q: q.queue, ex: delayedX }], 0)
  return {
    q: q.queue,
    delayedX,
  }
}

const NodeEmitter = new EventEmitter()

const mainNodeQName = newUuid()
channel.then(async (ch) => {
  const mainNodeQ = await assertQ({
    name: mainNodeQName,
    opts: { exclusive: true, autoDelete: true },
  })
  ch.consume(mainNodeQ.queue, (msg) => {
    const ev = msgEventName(msg)
    if (!ev) {
      return
    }
    NodeEmitter.emit(ev, msg)
  })
})
const msgEventName = (msg: Message | null) => flowIdEventName(msgFlowId(msg))
const flowIdEventName = (flowId: FlowId | null) =>
  flowId && flowId._key && flowId._tag ? `${flowId._key}:${flowId._tag}` : null

export const mainNodeQEmitter = {
  sub<T>(_: { flowId: FlowId; handler(_: EventEmitterType<T>): unknown }) {
    const { flowId, handler } = _
    const ev = flowIdEventName(flowId)
    if (ev === null) {
      //TODO: Log Error
      return
    }
    NodeEmitter.addListener(ev, listener)
    return unsub
    function unsub() {
      ev && NodeEmitter.removeListener(ev, listener)
    }
    function listener(msg: Message) {
      handler({
        jsonContent: buffer2Json(msg.content),
        msg,
        unsub,
      })
    }
  },
}

export const msgFlowId = (msg: Message | null): FlowId | null =>
  msg && msg.properties.correlationId && msg.fields.routingKey.length
    ? {
        _key: msg.properties.correlationId,
        _tag: msg.fields.routingKey.split('.').slice(-1).pop()!,
      }
    : null

export type EventEmitterType<T> = {
  msg: Message
  jsonContent: T
  unsub(): unknown
}

export type DomainPublishOpts = Options.Publish & {
  replyToNodeQ?: boolean
  delay?: number
  messageId?: string
}
export type DomainSendToQueueOpts = Options.Publish & {}
export type DomainQueueOpts = Options.AssertQueue & {}
export type QConsumeOpts = Options.Consume & { errorAck?: Acks.nack | Acks.reject }

type DomainExchangeOpts = {}

export enum Acks {
  nack = 'nack',
  reject = 'reject',
  ack = 'ack',
}
