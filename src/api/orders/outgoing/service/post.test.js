const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const orderDbHelper = require('../../../../utils/orderDbHelper');
const sqsHelper = require('../../../../utils/sqsHelper');
const additionalDocumentReferenceHelper = require('../../../../utils/additionalDocumentReferenceHelper');
const { trivialOrderUBLJson } = require('../../../../../test/mockData/ublJsonOrderTestData');
const {
  convertOrderUblJsonToPaJson,
  convertUblXmlToPaJson,
  getOrderIdFromPaJson
} = require('../../../../utils/paJsonHelper');
const {
  postOrder,
  batchOrders
} = require('./post');
const ConflictError = require('../../../../errors/conflictError');
const ProxyError = require('../../../../errors/proxyError');
const { paJsonWithOneAdditionalDocumentReference } = require('../../../../../test/mockData/paJsonOrderTestData');

jest.mock('../../../../utils/orderDbHelper');
jest.mock('../../../../utils/sqsHelper');
jest.mock('../../../../utils/additionalDocumentReferenceHelper');

describe('postOrder', () => {
  test('given valid order with binary references, it sends those references to s3', async () => {
    const order = paJsonWithOneAdditionalDocumentReference('SE123123', '123');
    const req = {
      body: order,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE123123'
      }
    };

    orderDbHelper.getOutgoingOrders.mockResolvedValue(null);
    orderDbHelper.createOutgoingOrder.mockResolvedValue({ order, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    additionalDocumentReferenceHelper.storeAdditionalOrderDocumentReferenceBinaryObjectsOnS3
      .mockResolvedValue({ binaryObjectReferences: {}, orderJsonWithBinaryObjectReferences: order });
    const additionalDocumentReferenceHelperSpy = jest.spyOn(additionalDocumentReferenceHelper, 'storeAdditionalOrderDocumentReferenceBinaryObjectsOnS3');

    const res = await postOrder(req);
    expect(res).toEqual({
      message: `order ${getOrderIdFromPaJson(order)} sent`,
      order_id: getOrderIdFromPaJson(order)
    });
    expect(additionalDocumentReferenceHelperSpy).toBeCalledTimes(1);
  });

  test('given valid post order request it creates a new order and queues it to receive-order queue', async () => {
    const order = convertOrderUblJsonToPaJson(trivialOrderUBLJson());
    const req = {
      body: order,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };
    orderDbHelper.getOutgoingOrder.mockResolvedValue(null);
    orderDbHelper.createOutgoingOrder.mockResolvedValue({ order, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(orderDbHelper, 'createOutgoingOrder');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await postOrder(req);
    expect(res).toEqual({
      message: `order ${getOrderIdFromPaJson(order)} sent`,
      order_id: getOrderIdFromPaJson(order)
    });
    expect(dbSpy).toBeCalled();
    expect(awsSpy).toBeCalled();
  });

  test('given valid xml order it creates a new order and queues it to receive-order queue', async () => {
    const xmlFile = fs.readFileSync('./test/mockData/xml/order/base-example.xml');
    const xmlString = xmlFile.toString();
    const order = await convertUblXmlToPaJson(xmlString);
    const req = {
      body: xmlString,
      headers: {
        'content-type': 'application/xml'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };
    orderDbHelper.getOutgoingOrder.mockResolvedValue(null);
    orderDbHelper.createOutgoingOrder.mockResolvedValue({ order, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(orderDbHelper, 'createOutgoingOrder');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await postOrder(req);
    expect(res).toEqual(
      `<message>${`order ${getOrderIdFromPaJson(order)} sent`}</message><order_id>${getOrderIdFromPaJson(order)}</order_id>`
    );
    expect(dbSpy).toBeCalled();
    expect(awsSpy).toBeCalled();
  });

  test('given valid post order request it updates an order and queues it to receive-order queue', async () => {
    const order = convertOrderUblJsonToPaJson(trivialOrderUBLJson());
    const req = {
      body: order,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        overwrite: true
      }
    };

    orderDbHelper.getOutgoingOrder.mockResolvedValue({ uuid: 'mock', ubl: order });
    orderDbHelper.updateOutgoingOrder.mockResolvedValue({ order, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(orderDbHelper, 'updateOutgoingOrder');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await postOrder(req);
    expect(res).toEqual({
      message: `order ${getOrderIdFromPaJson(order)} sent`,
      order_id: getOrderIdFromPaJson(order)
    });
    expect(dbSpy).toBeCalled();
    expect(awsSpy).toBeCalled();
  });

  test('it does not update an order if overwrite is set to false', async () => {
    const order = convertOrderUblJsonToPaJson(trivialOrderUBLJson());
    const req = {
      body: order,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        overwrite: false
      }
    };

    orderDbHelper.getOutgoingOrder.mockResolvedValue({ uuid: 'mock', order });
    orderDbHelper.updateOutgoingOrder.mockResolvedValue({ order, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(orderDbHelper, 'updateOutgoingOrder');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    await expect(postOrder(req)).rejects.toThrowError(ConflictError);
    expect(dbSpy).toBeCalledTimes(0);
    expect(awsSpy).toBeCalledTimes(0);
  });

  test('it throws error if any function called throws an error method throws', async () => {
    const order = convertOrderUblJsonToPaJson(trivialOrderUBLJson());
    const req = {
      body: order,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        overwrite: false
      }
    };

    orderDbHelper.getOutgoingOrder.mockResolvedValue(null);
    orderDbHelper.createOutgoingOrder.mockImplementation(() => {
      throw new Error();
    });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(orderDbHelper, 'updateOutgoingOrder');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    await expect(postOrder(req)).rejects.toThrowError(ProxyError);
    expect(dbSpy).toBeCalledTimes(0);
    expect(awsSpy).toBeCalledTimes(0);
  });
});

describe('batchOrders', () => {
  test('it stores orders in db and sends them to sqs', async () => {
    const orders = {
      Orders: [
        convertOrderUblJsonToPaJson(trivialOrderUBLJson('123123', '1')),
        convertOrderUblJsonToPaJson(trivialOrderUBLJson('123123', '2'))
      ]
    };

    const req = {
      body: orders,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      }
    };

    orderDbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    orderDbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });
    orderDbHelper.getOutgoingOrders.mockResolvedValue([]);
    orderDbHelper.createOutgoingOrder.mockResolvedValue({ order: orders.Orders[0], uuid: uuidv4() });
    orderDbHelper.createOutgoingOrder.mockResolvedValueOnce({ order: orders.Orders[0], uuid: uuidv4() });
    orderDbHelper.createOutgoingOrder.mockResolvedValueOnce({ order: orders.Orders[1], uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const transactionCreateSpy = jest.spyOn(orderDbHelper, 'beginTransaction');
    const transactionCommitSpy = jest.spyOn(orderDbHelper, 'commitTransaction');
    const dbSpy = jest.spyOn(orderDbHelper, 'createOutgoingOrder');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await batchOrders(req);
    expect(res).toEqual({
      message: `orders ${orders.Orders.map((order) => getOrderIdFromPaJson(order))} sent`,
      order_ids: orders.Orders.map((order) => getOrderIdFromPaJson(order))
    });
    expect(transactionCreateSpy).toBeCalledTimes(1);
    expect(transactionCommitSpy).toBeCalledTimes(1);
    expect(dbSpy).toBeCalledTimes(2);
    expect(awsSpy).toBeCalledTimes(2);
  });

  test('it does not allow overwriting orders', async () => {
    const orders = {
      Orders: [
        convertOrderUblJsonToPaJson(trivialOrderUBLJson('123123', '1')),
        convertOrderUblJsonToPaJson(trivialOrderUBLJson('123123', '2'))
      ]
    };
    const req = {
      body: orders,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        overwrite: false
      }
    };
    orderDbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    orderDbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });
    orderDbHelper.getOutgoingOrders.mockResolvedValueOnce([{ uuid: 'mock', order: orders.Orders[0] }, { uuid: 'mock', order: orders.Orders[1] }]);
    orderDbHelper.createOutgoingOrder.mockResolvedValueOnce({ order: orders.Orders[0], uuid: uuidv4() });
    orderDbHelper.createOutgoingOrder.mockResolvedValueOnce({ order: orders.Orders[1], uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const transactionCreateSpy = jest.spyOn(orderDbHelper, 'beginTransaction');
    const transactionCommitSpy = jest.spyOn(orderDbHelper, 'commitTransaction');
    const dbSpy = jest.spyOn(orderDbHelper, 'createOutgoingOrder');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    await expect(batchOrders(req)).rejects.toThrowError(ConflictError);
    expect(transactionCreateSpy).toBeCalledTimes(0);
    expect(transactionCommitSpy).toBeCalledTimes(0);
    expect(dbSpy).toBeCalledTimes(0);
    expect(awsSpy).toBeCalledTimes(0);
  });

  test('it allows overwriting orders i query param overwrite is set to true', async () => {
    const orders = {
      Orders: [
        convertOrderUblJsonToPaJson(trivialOrderUBLJson('123123', '1')),
        convertOrderUblJsonToPaJson(trivialOrderUBLJson('123123', '2'))
      ]
    };

    const req = {
      body: orders,
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        overwrite: true
      }
    };

    orderDbHelper.beginTransaction.mockResolvedValue({ transactionId: uuidv4() });
    orderDbHelper.commitTransaction.mockResolvedValue({ transactionStatus: 'status' });
    orderDbHelper.getOutgoingOrders.mockResolvedValueOnce([{ uuid: 'mock', order: orders.Orders[0] }]);
    orderDbHelper.createOutgoingOrder.mockResolvedValueOnce({ order: orders.Orders[1], uuid: uuidv4() });
    orderDbHelper.updateOutgoingOrder.mockResolvedValueOnce({ order: orders.Orders[0], uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const transactionCreateSpy = jest.spyOn(orderDbHelper, 'beginTransaction');
    const transactionCommitSpy = jest.spyOn(orderDbHelper, 'commitTransaction');
    const createIndbSpy = jest.spyOn(orderDbHelper, 'createOutgoingOrder');
    const updateIndbSpy = jest.spyOn(orderDbHelper, 'updateOutgoingOrder');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    const res = await batchOrders(req);
    expect(res.length).toEqual(orders.length);
    expect(transactionCreateSpy).toBeCalledTimes(1);
    expect(transactionCommitSpy).toBeCalledTimes(1);
    expect(createIndbSpy).toBeCalledTimes(1);
    expect(updateIndbSpy).toBeCalledTimes(1);
    expect(awsSpy).toBeCalledTimes(2);
  });
});
