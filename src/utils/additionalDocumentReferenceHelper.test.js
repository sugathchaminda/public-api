const _ = require('lodash');
const s3Helper = require('./s3Helper');
const { paJsonWithOneAdditionalDocumentReference } = require('../../test/mockData/paJsonTestData');
const {
  storeAdditionalDocumentReferenceBinaryObjectsOnS3,
  removeAdditionalDocumentReferenceBinaryObjectsFromS3,
  getInvoiceWithBinaryObjectReferencesOnS3
} = require('./additionalDocumentReferenceHelper');
const { convertPaJsonToUblJson } = require('./ublJsonHelper');
const { validateUblInvoiceJsonFunction } = require('../libs/schemaValidators');

jest.mock('./s3Helper');

describe('removeAdditionalDocumentReferenceBinaryObjectsFromS3', () => {
  test('it removes any binary object from s3 given an array of binaryObjectReferences', async () => {
    s3Helper.removeFromS3.mockResolvedValue({
      DeleteMarker: true,
      VersionId: 'string'
    });
    s3Helper.writeToS3.mockResolvedValue({
      ETag: 'string',
      Bucket: 'string',
      Key: 'string',
      Location: 's3://filename.ext'
    });
    const s3Spy = jest.spyOn(s3Helper, 'removeFromS3');
    const createReferencesResult = await storeAdditionalDocumentReferenceBinaryObjectsOnS3(paJsonWithOneAdditionalDocumentReference('123123123'));
    expect(createReferencesResult.binaryObjectReferences.length).toBeGreaterThan(0);
    await removeAdditionalDocumentReferenceBinaryObjectsFromS3(createReferencesResult.binaryObjectReferences);
    expect(s3Spy).toBeCalledTimes(createReferencesResult.binaryObjectReferences.length);
  });
});

describe('storeAdditionalDocumentReferenceBinaryObjectsOnS3', () => {
  test('it stores any binary object in pa json on S3, and returns references', async () => {
    s3Helper.writeToS3.mockResolvedValue({
      ETag: 'string',
      Bucket: 'string',
      Key: 'string',
      Location: 's3://filename.ext'
    });
    const s3Spy = jest.spyOn(s3Helper, 'writeToS3');
    const result = await storeAdditionalDocumentReferenceBinaryObjectsOnS3(paJsonWithOneAdditionalDocumentReference('123123123'));

    /*
     * expected return format
     *
     * return {
     *   binaryObjectReferences, //list of references that can be used to quickly look up references later (ie if we need to remove them).
     *   invoiceJsonWithBinaryObjectReferences //the resulting json where binaryObjects are exchanged for externalReferences to s3.
     * }
     *
     * binaryObjectReference have format:
     *
     * {
     *   documentReferenceAttachmentPath, //path the DocumentReference where the EmbeddedDocumentBinaryObject was found.
     *   embeddedDocumentBinaryObjectPath, //path to the EmbeddedDocumentBinaryObject, for lookup so that it can be removed from json.
     *   S3: {
     *     Key: uuidFilename,
     *     Bucket: s3Bucket
     *   },
     *   ExternalReference: {
     *     'cbc:URI': { _: uri }
     *   }
     * }
     *
     */

    expect(result.binaryObjectReferences).toBeDefined();
    expect(result.invoiceJsonWithBinaryObjectReferences).toBeDefined();
    expect(s3Spy).toBeCalled();

    const externalReferenceInJson = _.get(
      result.invoiceJsonWithBinaryObjectReferences,
      `${result.binaryObjectReferences[0].documentReferenceAttachmentPath}[cac:ExternalReference][0]`
    );
    const binaryObjectPath = result.binaryObjectReferences[0].embeddedDocumentBinaryObjectPath;
    const binaryObjectReferenceInJson = _.get(result.invoiceJsonWithBinaryObjectReferences, binaryObjectPath);
    const externalReferenceInBinaryObjectReference = result.binaryObjectReferences[0].ExternalReference;

    expect(externalReferenceInJson).toBeDefined();
    expect(binaryObjectReferenceInJson).toBeUndefined();

    // Expect an External reference on the transformed json
    expect(externalReferenceInJson).toEqual(externalReferenceInBinaryObjectReference);

    // Expect the transformed json to still be valid ubl
    const asUbl = convertPaJsonToUblJson(result.invoiceJsonWithBinaryObjectReferences);
    const valid = validateUblInvoiceJsonFunction(asUbl);
    expect(validateUblInvoiceJsonFunction.errors)
      .toBeNull();
    expect(valid)
      .toBe(true);
  });
});

describe('getInvoiceWithBinaryObjectReferencesOnS3', () => {
  test('returns invoice with binary object references, if it has', async () => {
    const result = await getInvoiceWithBinaryObjectReferencesOnS3(paJsonWithOneAdditionalDocumentReference('123123123'));
    expect(result.invoiceJsonWithBinaryObjectReferences).toBeDefined();

    const embeddedBinaryObject = _.get(result.invoiceJsonWithBinaryObjectReferences.Invoice,
      '[\'cac:AdditionalDocumentReference\'][0][\'cac:Attachment\'][0][\'cbc:EmbeddedDocumentBinaryObject\'][0][\'_\']');
    const binaryFileObjectMetaData = _.get(result.invoiceJsonWithBinaryObjectReferences.Invoice,
      '[\'cac:AdditionalDocumentReference\'][0][\'cac:Attachment\'][0][\'cbc:EmbeddedDocumentBinaryObject\'][0][\'$\']');
    const externalReferenceInJson = _.get(
      result.invoiceJsonWithBinaryObjectReferences,
      '[\'cac:AdditionalDocumentReference\'][0][\'cac:Attachment\'][0][\'cac:ExternalReference\']'
    );

    expect(embeddedBinaryObject).toBeDefined();
    expect(binaryFileObjectMetaData).toBeDefined();
    expect(externalReferenceInJson).toBeUndefined();

    // Expect the transformed json to still be valid ubl
    const asUbl = convertPaJsonToUblJson(result.invoiceJsonWithBinaryObjectReferences);
    const valid = validateUblInvoiceJsonFunction(asUbl);
    expect(validateUblInvoiceJsonFunction.errors)
      .toBeNull();
    expect(valid)
      .toBe(true);
  });
});
