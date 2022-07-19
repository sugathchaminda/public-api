const { run } = require('./handler');
const { saveIncomingInvoice } = require('./incoming-invoice-handler');
const dbHelper = require('../utils/dbHelper');
const s3Helper = require('../utils/s3Helper');
const additionalDocumentReferenceHelper = require('../utils/additionalDocumentReferenceHelper');

const ValidationError = require('../errors/validationError');
const { paJsonWithOneAdditionalDocumentReference } = require('../../test/mockData/paJsonTestData');
const { convertUblJsonToPaJson } = require('../utils/paJsonHelper');
const { trivialInvoiceUBLJson } = require('../../test/mockData/ublJsonInvoiceTestData');

const exampleEvent = () => ({
  Records: [
    {
      messageId: '0954cce0-2fff-4f0f-abfd-a26391683343',
      // eslint-disable-next-line max-len
      receiptHandle: 'AQEBdQ3hPWhV7+/bEvIXWFgY+5FSaBUJlxoN3DRow4C/XxRntCLF4a8jBrMGugc12NSMlqvNbTvhuW0W8A0mWgjj1ve1ZAIrlH8dvYcLDo8tX7ABITukk6aPDrzHW/HXINhKdMGGQhh8iQoJ1jIuET1qOPiQplPXnK5qbUDjA61velilOnrwzsiQ62rfF8CVERIDHkEvfm1c6YYc9IqtrX+W+2WiXjDyZtMGT4AxWfjLJ7Q0xCH8L8+ZwTL5kw/iJ+f2FVNoPhQdRpbI/aCXgVRoj1fiyw9nuEUZMGrOH7iN0Nj28BePqEjPVRc6MBJoDD9Hw4EfgWo5dVNX0DZ2WahQrtjQpOFin03FRmrTt8VQbmlMRpXi4X6tLvA7ZLHzJjOrzS9EBPdjaMtVGURWypCtdQ==',
      // eslint-disable-next-line max-len
      body: JSON.stringify(convertUblJsonToPaJson(trivialInvoiceUBLJson('SE123123', '123'))),
      attributes: {
        ApproximateReceiveCount: '1',
        SentTimestamp: '1634029136382',
        SenderId: 'AROAUHKZELP7YB57ORGTO:qvalia-serverless-public-api-test-routes',
        ApproximateFirstReceiveTimestamp: '1634029136387'
      },
      messageAttributes: {
        regNo: {
          stringValue: 'SE5567321707',
          stringListValues: [],
          binaryListValues: [],
          dataType: 'String'
        },
        payloadLocation: {
          stringValue: 'SQS',
          stringListValues: [],
          binaryListValues: [],
          dataType: 'String'
        },
        messageType: {
          stringValue: 'incominginvoice',
          stringListValues: [],
          binaryListValues: [],
          dataType: 'String'
        }
      },
      md5OfMessageAttributes: '10b1223eac229b50cd757f86803670b2',
      md5OfBody: '729a1128304afa95f8bd01226e7496cc',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:aws:sqs:eu-west-1:290634095615:lambda-test-receiveinvoice',
      awsRegion: 'eu-west-1'
    }
  ]
});

jest.mock('../utils/dbHelper');
jest.mock('../utils/s3Helper');
jest.mock('../utils/additionalDocumentReferenceHelper');

describe('store-incoming-invoice', () => {
  test('it stores a valid event in mdsdb', async () => {
    const event = exampleEvent();
    const invoice = JSON.parse(event.Records[0].body);
    dbHelper.createIncomingInvoice.mockResolvedValue({ invoice, uuid: 'placeholder' });
    additionalDocumentReferenceHelper.storeAdditionalDocumentReferenceBinaryObjectsOnS3
      .mockResolvedValue({ binaryObjectReferences: {}, invoiceJsonWithBinaryObjectReferences: invoice });
    const dbSpy = jest.spyOn(dbHelper, 'createIncomingInvoice');
    const result = await saveIncomingInvoice(event);
    expect(result.invoice).toEqual(JSON.parse(event.Records[0].body));
    expect(dbSpy).toBeCalledTimes(1);
  });

  test('it stores binary references on s3 if there are any', async () => {
    const event = exampleEvent();
    event.Records[0].body = JSON.stringify(paJsonWithOneAdditionalDocumentReference('SE123123', '123'));
    const invoice = JSON.parse(event.Records[0].body);

    additionalDocumentReferenceHelper.storeAdditionalDocumentReferenceBinaryObjectsOnS3
      .mockResolvedValue({ binaryObjectReferences: {}, invoiceJsonWithBinaryObjectReferences: invoice });
    dbHelper.createIncomingInvoice.mockResolvedValue({ invoice, uuid: 'placeholder' });
    const dbSpy = jest.spyOn(dbHelper, 'createIncomingInvoice');
    const additionalDocumentReferenceHelperSpy = jest.spyOn(additionalDocumentReferenceHelper, 'storeAdditionalDocumentReferenceBinaryObjectsOnS3');
    const result = await saveIncomingInvoice(event);
    expect(result.invoice).toEqual(JSON.parse(event.Records[0].body));
    expect(dbSpy).toBeCalledTimes(1);
    expect(additionalDocumentReferenceHelperSpy).toBeCalledTimes(1);
  });

  test('it does not store when event is missing regNo', async () => {
    const invalidEvent = exampleEvent();
    invalidEvent.Records[0].messageAttributes.regNo = undefined;
    await expect(run(invalidEvent)).rejects.toThrowError(ValidationError);
  });

  test('it does not store when event is missing messageType', async () => {
    const invalidEvent = exampleEvent();
    invalidEvent.Records[0].messageAttributes.messageType = undefined;
    await expect(run(invalidEvent)).rejects.toThrowError(ValidationError);
  });

  test('it does not store when payloadLocation is invalid value', async () => {
    const invalidEvent = exampleEvent();
    invalidEvent.Records[0].messageAttributes.payloadLocation.stringValue = 'THECLOUD';
    await expect(run(invalidEvent)).rejects.toThrowError(ValidationError);
  });

  test('it does not store when the invoice is not valid', async () => {
    const invalidEvent = exampleEvent();
    invalidEvent.Records[0].body = '{}';
    await expect(saveIncomingInvoice(invalidEvent)).rejects.toThrowError(ValidationError);
  });

  test('if payloadloaction is S3 it stores invoice that is fetched from S3', async () => {
    const event = exampleEvent();
    const invoice = event.Records[0].body;
    event.Records[0].body = JSON.stringify({ bucket: 'bucket-name', key: 'invoice-object-key' });
    event.Records[0].messageAttributes.payloadLocation.stringValue = 's3';
    s3Helper.getFromS3.mockResolvedValue({ Body: invoice });
    dbHelper.createIncomingInvoice.mockResolvedValue({ uuid: 'placeholder', invoice: JSON.parse(invoice) });
    const dbSpy = jest.spyOn(dbHelper, 'createIncomingInvoice');
    const s3Spy = jest.spyOn(s3Helper, 'getFromS3');
    const result = await saveIncomingInvoice(event);
    expect(result.invoice).toEqual(JSON.parse(invoice));
    expect(dbSpy).toBeCalledTimes(1);
    expect(s3Spy).toBeCalledTimes(1);
  });

  test('if payloadlocation is s3 the event body must be a valid s3 reference', async () => {
    const invalidEvent = exampleEvent();
    invalidEvent.Records[0].body = '{}';
    invalidEvent.Records[0].messageAttributes.payloadLocation.stringValue = 's3';
    await expect(saveIncomingInvoice(invalidEvent)).rejects.toThrowError(ValidationError);
  });
});
