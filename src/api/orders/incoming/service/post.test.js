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
const { postOrder } = require('./post');
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

    orderDbHelper.getIncomingOrder.mockResolvedValue(null);
    orderDbHelper.createIncomingOrder.mockResolvedValue({ order, uuid: uuidv4() });
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
    orderDbHelper.getIncomingOrder.mockResolvedValue(null);
    orderDbHelper.createIncomingOrder.mockResolvedValue({ order, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(orderDbHelper, 'createIncomingOrder');
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
    orderDbHelper.getIncomingOrder.mockResolvedValue(null);
    orderDbHelper.createIncomingOrder.mockResolvedValue({ order, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(orderDbHelper, 'createIncomingOrder');
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

    orderDbHelper.getIncomingOrder.mockResolvedValue({ uuid: 'mock', ubl: order });
    orderDbHelper.updateIncomingOrder.mockResolvedValue({ order, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(orderDbHelper, 'updateIncomingOrder');
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

    orderDbHelper.getIncomingOrder.mockResolvedValue({ uuid: 'mock', order });
    orderDbHelper.updateIncomingOrder.mockResolvedValue({ order, uuid: uuidv4() });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(orderDbHelper, 'updateIncomingOrder');
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

    orderDbHelper.getIncomingOrder.mockResolvedValue(null);
    orderDbHelper.createIncomingOrder.mockImplementation(() => {
      throw new Error();
    });
    sqsHelper.sendMessageToSqs.mockResolvedValue({});
    const dbSpy = jest.spyOn(orderDbHelper, 'updateIncomingOrder');
    const awsSpy = jest.spyOn(sqsHelper, 'sendMessageToSqs');

    await expect(postOrder(req)).rejects.toThrowError(ProxyError);
    expect(dbSpy).toBeCalledTimes(0);
    expect(awsSpy).toBeCalledTimes(0);
  });
});
