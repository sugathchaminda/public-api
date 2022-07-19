const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');
const mime = require('mime-types');
const {
  writeToS3,
  removeFromS3,
  getFromS3
} = require('./s3Helper');

const METADATA_ATTRIBUTES_KEY = 'qip-ubl-attributes';

const getFileExtension = ({ filename, mimetype }) => {
  const mimetypeExtension = mime.extension(mimetype);
  if (mimetypeExtension) return mimetypeExtension;
  return filename.split('.').slice(-1)[0];
};

const getAdditionalDocumentReferenceBinaryObjects = (invoiceJson) => {
  const additionalDocumentsNode = invoiceJson?.Invoice?.['cac:AdditionalDocumentReference'];
  if (additionalDocumentsNode === undefined) return [];
  return additionalDocumentsNode.map((documentReference, index) => {
    if (documentReference['cac:Attachment']?.[0]?.['cbc:EmbeddedDocumentBinaryObject']?.[0] !== undefined) {
      return {
        documentReferenceAttachmentPath: `[Invoice][cac:AdditionalDocumentReference][${index}][cac:Attachment][0]`,
        embeddedDocumentBinaryObjectPath: `[Invoice][cac:AdditionalDocumentReference][${index}][cac:Attachment][0][cbc:EmbeddedDocumentBinaryObject]`,
        embeddedDocumentBinaryObject: documentReference['cac:Attachment'][0]['cbc:EmbeddedDocumentBinaryObject'][0]
      };
    }
    return undefined;
  }).filter((val) => val !== undefined);
};

const getBinaryObjectAttachmentPathAndReferences = (invoiceJson) => {
  const additionalDocumentsNode = invoiceJson?.Invoice?.['cac:AdditionalDocumentReference'];
  if (!additionalDocumentsNode) return [];

  return additionalDocumentsNode.map((documentReference, index) => {
    if (documentReference['cac:Attachment']?.[0]?.['cac:ExternalReference']?.[0]?.['cbc:URI']?.[0]) {
      const internalBinaryObjectPath = documentReference['cac:Attachment'][0]['cac:ExternalReference'][0]['cbc:URI'][0];

      if (!internalBinaryObjectPath._.includes(process.env.S3_EINVOICE_ATTACHMENT)) {
        return undefined;
      }

      return {
        documentReferenceAttachmentPath: `[cac:AdditionalDocumentReference][${index}][cac:Attachment][0]`,
        s3BinaryObjectReference: internalBinaryObjectPath._
      };
    }

    return undefined;
  }).filter((val) => val !== undefined);
};

const createBinaryObjectS3Metadata = (attributes) => {
  const metadata = {};
  metadata[METADATA_ATTRIBUTES_KEY] = JSON.stringify(attributes);
  return metadata;
};

const storeBinaryObjectOnS3 = async ({ embeddedDocumentBinaryObject, embeddedDocumentBinaryObjectPath, documentReferenceAttachmentPath }) => {
  const mimetype = embeddedDocumentBinaryObject?.$?.mimecode;
  const fileExtension = getFileExtension(embeddedDocumentBinaryObject.$);

  const fileBinary = Buffer.from(embeddedDocumentBinaryObject._.toString('utf-8'), 'base64');
  const uuid = uuidv4();
  const filename = embeddedDocumentBinaryObject?.$?.filename ? embeddedDocumentBinaryObject?.$?.filename : `${uuid}.${fileExtension}`;

  const s3Options = {
    ContentType: mimetype,
    ContentDisposition: `attachment; filename=${filename}`,
    Metadata: createBinaryObjectS3Metadata(embeddedDocumentBinaryObject?.$)
  };
  const s3Bucket = process.env.S3_EINVOICE_ATTACHMENT;
  const res = await writeToS3(fileBinary, `${uuid}.${fileExtension}`, s3Bucket, s3Options);
  const uri = res.Location;

  return {
    documentReferenceAttachmentPath,
    embeddedDocumentBinaryObjectPath,
    S3: {
      Key: `${uuid}.${fileExtension}`,
      Bucket: s3Bucket
    },
    ExternalReference: {
      'cbc:URI': [{ _: uri }]
    }
  };
};

const readAttributesFromS3Metadata = (metadata) => {
  const attributes = metadata[METADATA_ATTRIBUTES_KEY];
  return attributes ? JSON.parse(attributes) : null;
};

const readBinaryObjectFromS3 = async ({ s3BinaryObjectReference, documentReferenceAttachmentPath }) => {
  const filaPathComponenets = s3BinaryObjectReference.split('/');
  const key = filaPathComponenets[filaPathComponenets.length - 1];
  const s3Bucket = process.env.S3_EINVOICE_ATTACHMENT;
  const response = await getFromS3(key, s3Bucket);
  const fileBuffer = Buffer.from(JSON.parse(response.Body)).toString('base64');

  return {
    documentReferenceAttachmentPath,
    binaryData: {
      _: fileBuffer,
      $: readAttributesFromS3Metadata(response.Metadata)
    }
  };
};

const setBinaryObjectReferencesAsExternalReferencesOnInvoice = (invoiceJson, binaryObjectReferences) => {
  const newJson = _.cloneDeep(invoiceJson);

  binaryObjectReferences.forEach((ref) => {
    _.set(newJson, `${ref.documentReferenceAttachmentPath}`, { 'cac:ExternalReference': [ref.ExternalReference] });
  });

  return newJson;
};

const setBinaryObjectReferencesAsExternalEmbeddedDocumentBinaryObject = (invoiceJson, binaryObjectReferences) => {
  const newJson = _.cloneDeep(invoiceJson);

  binaryObjectReferences.forEach((ref) => {
    _.set(newJson.invoice.Invoice, ref.documentReferenceAttachmentPath, { 'cbc:EmbeddedDocumentBinaryObject': ref.binaryData });
  });

  return newJson;
};

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

const storeAdditionalDocumentReferenceBinaryObjectsOnS3 = async (invoiceJson) => {
  const binaryObjects = await getAdditionalDocumentReferenceBinaryObjects(invoiceJson);
  const binaryObjectReferences = await Promise.all(binaryObjects.map(storeBinaryObjectOnS3));
  const invoiceJsonWithBinaryObjectReferences = setBinaryObjectReferencesAsExternalReferencesOnInvoice(invoiceJson, binaryObjectReferences);

  return {
    binaryObjectReferences,
    invoiceJsonWithBinaryObjectReferences
  };
};

const removeAdditionalDocumentReferenceBinaryObjectFromS3 = async (binaryObjectReference) => {
  await removeFromS3(binaryObjectReference.S3.Key, binaryObjectReference.S3.Bucket);
};

const removeAdditionalDocumentReferenceBinaryObjectsFromS3 = async (binaryObjectReferences) => {
  Promise.all(binaryObjectReferences.map(removeAdditionalDocumentReferenceBinaryObjectFromS3));
};

const getInvoiceWithBinaryObjectReferencesOnS3 = async (invoiceJson) => {
  const binaryObjectAttachmentPathAndReferences = await getBinaryObjectAttachmentPathAndReferences(invoiceJson.invoice);
  const binaryObjectReferences = await Promise.all(binaryObjectAttachmentPathAndReferences.map(readBinaryObjectFromS3));
  const invoiceJsonWithBinaryObjectReferences = setBinaryObjectReferencesAsExternalEmbeddedDocumentBinaryObject(
    invoiceJson,
    binaryObjectReferences
  );

  return {
    invoiceJsonWithBinaryObjectReferences
  };
};

const setBinaryObjectReferencesAsExternalReferencesOnOrder = (orderJson, binaryObjectReferences) => {
  const newJson = _.cloneDeep(orderJson);
  binaryObjectReferences.forEach((ref) => {
    _.set(newJson, `${ref.documentReferenceAttachmentPath}`, { 'cac:ExternalReference': [ref.ExternalReference] });
  });
  return newJson;
};

const storeAdditionalOrderDocumentReferenceBinaryObjectsOnS3 = async (orderJson) => {
  const binaryObjects = await getAdditionalDocumentReferenceBinaryObjects(orderJson);
  const binaryObjectReferences = await Promise.all(binaryObjects.map(storeBinaryObjectOnS3));
  const orderJsonWithBinaryObjectReferences = setBinaryObjectReferencesAsExternalReferencesOnOrder(orderJson, binaryObjectReferences);
  return {
    binaryObjectReferences,
    orderJsonWithBinaryObjectReferences
  };
};

const getOrderWithBinaryObjectReferencesOnS3 = async (orderJson) => {
  const binaryObjectAttachmentPathAndReferences = await getBinaryObjectAttachmentPathAndReferences(orderJson.order);
  const binaryObjectReferences = await Promise.all(binaryObjectAttachmentPathAndReferences.map(readBinaryObjectFromS3));
  const orderJsonWithBinaryObjectReferences = setBinaryObjectReferencesAsExternalEmbeddedDocumentBinaryObject(
    orderJson,
    binaryObjectReferences
  );
  return {
    orderJsonWithBinaryObjectReferences
  };
};

const setBinaryObjectReferencesAsExternalReferencesOnCreditNote = (creditNoteJson, binaryObjectReferences) => {
  const newJson = _.cloneDeep(creditNoteJson);
  binaryObjectReferences.forEach((ref) => {
    _.set(newJson, `${ref.documentReferenceAttachmentPath}`, { 'cac:ExternalReference': [ref.ExternalReference] });
  });
  return newJson;
};

const storeAdditionalCreditNoteDocumentReferenceBinaryObjectsOnS3 = async (creditNoteJson) => {
  const binaryObjects = await getAdditionalDocumentReferenceBinaryObjects(creditNoteJson);
  const binaryObjectReferences = await Promise.all(binaryObjects.map(storeBinaryObjectOnS3));
  const creditNoteJsonWithBinaryObjectReferences = setBinaryObjectReferencesAsExternalReferencesOnCreditNote(creditNoteJson, binaryObjectReferences);
  return {
    binaryObjectReferences,
    creditNoteJsonWithBinaryObjectReferences
  };
};

const getCreditNoteWithBinaryObjectReferencesOnS3 = async (creditNoteJson) => {
  const binaryObjectAttachmentPathAndReferences = await getBinaryObjectAttachmentPathAndReferences(creditNoteJson.creditNote);
  const binaryObjectReferences = await Promise.all(binaryObjectAttachmentPathAndReferences.map(readBinaryObjectFromS3));
  const creditNoteJsonWithBinaryObjectReferences = setBinaryObjectReferencesAsExternalEmbeddedDocumentBinaryObject(
    creditNoteJson,
    binaryObjectReferences
  );
  return {
    creditNoteJsonWithBinaryObjectReferences
  };
};

module.exports = {
  removeAdditionalDocumentReferenceBinaryObjectsFromS3,
  storeAdditionalDocumentReferenceBinaryObjectsOnS3,
  getInvoiceWithBinaryObjectReferencesOnS3,

  getOrderWithBinaryObjectReferencesOnS3,
  storeAdditionalOrderDocumentReferenceBinaryObjectsOnS3,

  getCreditNoteWithBinaryObjectReferencesOnS3,
  storeAdditionalCreditNoteDocumentReferenceBinaryObjectsOnS3
};
