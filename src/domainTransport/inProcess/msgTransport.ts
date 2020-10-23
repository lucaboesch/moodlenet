import { ApiPushFn, Domain, DomainApiMap, DomainName } from '@mn-be/domain/DomainTypes'
import { EventEmitter } from 'events'
import { EventId, IdentifiedDomainEvent, MsgTransport } from '../DomainTransportTypes'

const DEF_EVT_NAME = '*'

const _id = () => Math.random().toString(36).substring(2)

type Opts = { logger?(_: IdentifiedDomainEvent<any, any>): unknown }
type Cfg = { apiTimeout?: number }

export const make = ({}: Cfg, { logger = () => {} }: Opts) => {
  const emitter = new EventEmitter()
  const apiReqEvtName = (_: { domain: Domain['name']; apiName: keyof any }) =>
    `${_.domain}#${String(_.apiName)}`
  const apiResEvtName = (_: { domain: Domain['name']; id: EventId; apiName: keyof any }) =>
    `${_.domain}#${String(_.apiName)}#${_.id}`
  const apiReqUnsub = (_: { domain: Domain['name']; id: EventId; apiName: keyof any }) =>
    `UNSUB:${_.domain}#${String(_.apiName)}#${_.id}`

  const subAll = (handler: (event: IdentifiedDomainEvent<any, any>) => unknown) => {
    emitter.addListener(DEF_EVT_NAME, handler)
    const unsubAll = () => emitter.removeListener(DEF_EVT_NAME, handler)
    return unsubAll
  }

  const pub: MsgTransport<Domain>['pub'] = (event) => {
    const id = _id()

    const idEvent: IdentifiedDomainEvent<any, any> = {
      ...event,
      id,
    }
    emitter.emit(DEF_EVT_NAME, idEvent)
    logger(idEvent)
    return idEvent
  }

  const sub: MsgTransport<Domain>['sub'] = ({ domain, type, eventHandler }) => {
    const filterEventHandler = (_: IdentifiedDomainEvent<any, any>) => {
      if (_.domain !== domain || _.type !== type) {
        return
      }
      eventHandler(_)
    }
    return subAll(filterEventHandler)
  }

  const apiReq: MsgTransport<Domain>['apiReq'] = ({ domain, apiName, req }) => {
    const id = _id()
    const reqEvtName = apiReqEvtName({ domain, apiName })
    const reqEvt: ApiEvt = { id, arg: req, isReq: true }
    emitter.emit(reqEvtName, reqEvt)
    return id
  }

  const apiRes: MsgTransport<Domain>['apiRes'] = ({ domain, apiName, id, res }) => {
    const resEvtName = apiResEvtName({ domain, id, apiName })

    const reqEvt: ApiEvt = { id, arg: res, isReq: false }
    emitter.emit(resEvtName, reqEvt)
  }

  const subApiRes: MsgTransport<Domain>['subApiRes'] = ({
    domain,
    apiName,
    id,
    responseHandler,
  }) => {
    const resEvtName = apiResEvtName({ domain, id, apiName })

    const filteredResponseHandler = (evt: ApiEvt) => {
      if (evt.isReq || evt.id !== id) {
        return
      }
      responseHandler({ res: evt.arg, id })
    }
    emitter.addListener(resEvtName, filteredResponseHandler)
    const unsubApiRes = () => {
      emitter.emit(apiReqUnsub({ apiName, domain, id }))
      emitter.removeListener(resEvtName, filteredResponseHandler)
    }
    return unsubApiRes
  }

  const subApiReq: MsgTransport<Domain>['subApiReq'] = ({ domain, apiName, requestHandler }) => {
    const reqEvtName = apiReqEvtName({ domain, apiName })

    const filteredRequestHandler = ({ arg, id, isReq }: ApiEvt) => {
      if (!isReq) {
        return
      }
      const requestUnsubHandler = requestHandler({ req: arg, id })
      const apiReqUnsubEvtName = apiReqUnsub({ apiName, domain, id })
      emitter.addListener(apiReqUnsubEvtName, requestUnsubHandler)
    }
    emitter.addListener(reqEvtName, filteredRequestHandler)
    const unsubApiReq = () => emitter.removeListener(reqEvtName, filteredRequestHandler)
    return unsubApiReq
  }

  const transport: MsgTransport<any> /* & { emitter: EventEmitter } */ = {
    pub,
    sub,
    apiReq,
    apiRes,
    subApiReq,
    subApiRes,
    // emitter,
  }

  return transport
}

export const bindApis = <D extends Domain>(
  domain: DomainName<D>,
  apis: DomainApiMap<D>,
  msgT: MsgTransport<D>
) =>
  Object.entries(apis).forEach(([apiName, fun]) => {
    msgT.subApiReq({
      domain,
      apiName,
      requestHandler: ({ req, id }) => {
        const push: ApiPushFn<Domain, string> = (res) => msgT.apiRes({ apiName, res, domain, id })
        const unsub = fun({ id, req, push })
        return unsub
      },
    })
  })

type ApiEvt = {
  isReq: boolean
  id: string
  arg: any
}
