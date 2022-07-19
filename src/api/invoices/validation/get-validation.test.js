const { getInvoices, readInvoices } = require('./get-validation');
const ValidationError = require('../../../errors/validationError');

describe('getInvoices', () => {
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

    const res = await getInvoices(req);
    expect(res).toEqual(req);
  });

  test('accepts xml content type', async () => {
    const req = {
      headers: {
        'content-type': 'application/xml'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {}
    };

    const res = await getInvoices(req);
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

    await expect(getInvoices(req)).rejects.toThrowError(ValidationError);
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

    await expect(getInvoices(req)).rejects.toThrowError(ValidationError);
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

    await expect(getInvoices(req)).rejects.toThrowError(ValidationError);
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

    await expect(getInvoices(req)).rejects.toThrowError(ValidationError);

    req.query.includeRead = true;

    const res = await getInvoices(req);

    expect(res).toEqual(req);
  });
});

describe('readInvoices', () => {
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

    const res = await readInvoices(req);
    expect(res).toEqual(req);
  });

  test('accepts xml content type', async () => {
    const req = {
      headers: {
        'content-type': 'application/xml'
      },
      params: {
        accountRegNo: 'SE5567321707'
      },
      query: {}
    };

    const res = await readInvoices(req);
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

    await expect(readInvoices(req)).rejects.toThrowError(ValidationError);
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

    await expect(readInvoices(req)).rejects.toThrowError(ValidationError);

    req.query.limit = 2;

    const res = await readInvoices(req);

    expect(res).toEqual(req);
  });
});
