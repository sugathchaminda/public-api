const { getCreditNotes, readCreditNotes } = require('./get-validation');
const ValidationError = require('../../../errors/validationError');

describe('getCreditNotes', () => {
  test('accepts valid request', async () => {
    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {}
    };

    const res = await getCreditNotes(req);
    expect(res).toEqual(req);
  });

  test('requires accountRegNo param', async () => {
    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {},
      query: {}
    };

    await expect(getCreditNotes(req)).rejects.toThrowError(ValidationError);
  });

  test('cannot get with content type xml', async () => {
    const req = {
      headers: {
        'content-type': 'application/xml'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {}
    };

    await expect(getCreditNotes(req)).rejects.toThrowError(ValidationError);
  });

  test('limit must be a number', async () => {
    const req = {
      headers: {
        'content-type': 'application/xml'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        limit: 'two'
      }
    };

    await expect(getCreditNotes(req)).rejects.toThrowError(ValidationError);
    req.query.limit = 2;
    await expect(getCreditNotes(req)).rejects.toThrowError(ValidationError);
  });

  test('offset must be a number', async () => {
    const req = {
      headers: {
        'content-type': 'application/xml'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        offset: 'two'
      }
    };

    await expect(getCreditNotes(req)).rejects.toThrowError(ValidationError);

    req.query.offset = 2;

    await expect(getCreditNotes(req)).rejects.toThrowError(ValidationError);
  });

  test('includeRead must be a boolean', async () => {
    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        includeRead: 'string'
      }
    };

    await expect(getCreditNotes(req)).rejects.toThrowError(ValidationError);

    req.query.includeRead = true;

    const res = await getCreditNotes(req);

    expect(res).toEqual(req);
  });
});

describe('readCreditNotes', () => {
  test('accepts valid request', async () => {
    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {}
    };

    const res = await readCreditNotes(req);
    expect(res).toEqual(req);
  });

  test('requires accountRegNo param', async () => {
    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {},
      query: {}
    };

    await expect(readCreditNotes(req)).rejects.toThrowError(ValidationError);
  });

  test('cannot get with content type xml', async () => {
    const req = {
      headers: {
        'content-type': 'application/xml'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {}
    };

    await expect(readCreditNotes(req)).rejects.toThrowError(ValidationError);
  });

  test('limit must be a number', async () => {
    const req = {
      headers: {
        'content-type': 'application/json'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {
        limit: 'two'
      }
    };

    await expect(readCreditNotes(req)).rejects.toThrowError(ValidationError);

    req.query.limit = 2;

    const res = await readCreditNotes(req);

    expect(res).toEqual(req);
  });
});
