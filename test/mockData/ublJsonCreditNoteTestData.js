// Se https://docs.oasis-open.org/ubl/UBL-2.1-JSON/v2.0/cnd01/UBL-2.1-JSON-v2.0-cnd01.html#S-UBL-CreditNote-2.1-EXAMPLE.JSON
const trivialCreditNoteUBLJson = (partyLegalEntityCompanyId, creditNoteId = '123') => ({
  _D: 'urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2',
  _A: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
  _B: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  CreditNote: [
    {
      CustomizationID: [
        {
          _: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0'
        }
      ],
      ProfileID: [
        {
          _: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0'
        }
      ],
      ID: [
        {
          _: creditNoteId
        }
      ],
      IssueDate: [
        {
          _: '2017-11-13'
        }
      ],
      CreditNoteTypeCode: [
        {
          _: '381'
        }
      ],
      DocumentCurrencyCode: [
        {
          _: 'EUR'
        }
      ],
      AccountingCost: [
        {
          _: '4025:123:4343'
        }
      ],
      BuyerReference: [
        {
          _: '0150abc'
        }
      ],
      AccountingSupplierParty: [
        {
          Party: [
            {
              EndpointID: [
                {
                  _: '9482348239847239874',
                  schemeID: '0088'
                }
              ],
              PartyIdentification: [
                {
                  ID: [
                    {
                      _: partyLegalEntityCompanyId
                    }
                  ]
                }
              ],
              PartyName: [
                {
                  Name: [
                    {
                      _: 'SupplierTradingName Ltd.'
                    }
                  ]
                }
              ],
              PostalAddress: [
                {
                  StreetName: [
                    {
                      _: 'Main street 1'
                    }
                  ],
                  AdditionalStreetName: [
                    {
                      _: 'Postbox 123'
                    }
                  ],
                  CityName: [
                    {
                      _: 'London'
                    }
                  ],
                  PostalZone: [
                    {
                      _: 'GB 123 EW'
                    }
                  ],
                  Country: [
                    {
                      IdentificationCode: [
                        {
                          _: 'GB'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyTaxScheme: [
                {
                  CompanyID: [
                    {
                      _: partyLegalEntityCompanyId
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyLegalEntity: [
                {
                  RegistrationName: [
                    {
                      _: 'SupplierOfficialName Ltd'
                    }
                  ],
                  CompanyID: [
                    {
                      _: partyLegalEntityCompanyId
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      AccountingCustomerParty: [
        {
          Party: [
            {
              EndpointID: [
                {
                  _: 'FR23342',
                  schemeID: '0002'
                }
              ],
              PartyIdentification: [
                {
                  ID: [
                    {
                      _: 'FR23342',
                      schemeID: '0002'
                    }
                  ]
                }
              ],
              PartyName: [
                {
                  Name: [
                    {
                      _: 'BuyerTradingName AS'
                    }
                  ]
                }
              ],
              PostalAddress: [
                {
                  StreetName: [
                    {
                      _: 'Hovedgatan 32'
                    }
                  ],
                  AdditionalStreetName: [
                    {
                      _: 'Po box 878'
                    }
                  ],
                  CityName: [
                    {
                      _: 'Stockholm'
                    }
                  ],
                  PostalZone: [
                    {
                      _: '456 34'
                    }
                  ],
                  Country: [
                    {
                      IdentificationCode: [
                        {
                          _: 'SE'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyTaxScheme: [
                {
                  CompanyID: [
                    {
                      _: 'SE4598375937'
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyLegalEntity: [
                {
                  RegistrationName: [
                    {
                      _: 'Buyer Official Name'
                    }
                  ],
                  CompanyID: [
                    {
                      _: '39937423947',
                      schemeID: '0183'
                    }
                  ]
                }
              ],
              Contact: [
                {
                  Name: [
                    {
                      _: 'Lisa Johnson'
                    }
                  ],
                  Telephone: [
                    {
                      _: '23434234'
                    }
                  ],
                  ElectronicMail: [
                    {
                      _: 'lj@buyer.se'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      Delivery: [
        {
          ActualDeliveryDate: [
            {
              _: '2017-11-01'
            }
          ],
          DeliveryLocation: [
            {
              ID: [
                {
                  _: '9483759475923478',
                  schemeID: '0088'
                }
              ],
              Address: [
                {
                  StreetName: [
                    {
                      _: 'Delivery street 2'
                    }
                  ],
                  AdditionalStreetName: [
                    {
                      _: 'Building 56'
                    }
                  ],
                  CityName: [
                    {
                      _: 'Stockholm'
                    }
                  ],
                  PostalZone: [
                    {
                      _: '21234'
                    }
                  ],
                  Country: [
                    {
                      IdentificationCode: [
                        {
                          _: 'SE'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          DeliveryParty: [
            {
              PartyName: [
                {
                  Name: [
                    {
                      _: 'Delivery party Name'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      PaymentMeans: [
        {
          PaymentMeansCode: [
            {
              _: '30',
              name: 'Credit transfer'
            }
          ],
          PaymentID: [
            {
              _: 'Snippet1'
            }
          ],
          PayeeFinancialAccount: [
            {
              ID: [
                {
                  _: 'IBAN32423940'
                }
              ],
              Name: [
                {
                  _: 'AccountName'
                }
              ],
              FinancialInstitutionBranch: [
                {
                  ID: [
                    {
                      _: 'BIC324098'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      PaymentTerms: [
        {
          Note: [
            {
              _: 'Payment within 10 days, 2% discount'
            }
          ]
        }
      ],
      AllowanceCharge: [
        {
          ChargeIndicator: [
            {
              _: true
            }
          ],
          AllowanceChargeReason: [
            {
              _: 'Insurance'
            }
          ],
          Amount: [
            {
              _: 25,
              currencyID: 'EUR'
            }
          ],
          TaxCategory: [
            {
              ID: [
                {
                  _: 'S'
                }
              ],
              Percent: [
                {
                  _: 25
                }
              ],
              TaxScheme: [
                {
                  ID: [
                    {
                      _: 'VAT'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      TaxTotal: [
        {
          TaxAmount: [
            {
              _: 331.25,
              currencyID: 'EUR'
            }
          ],
          TaxSubtotal: [
            {
              TaxableAmount: [
                {
                  _: 1325,
                  currencyID: 'EUR'
                }
              ],
              TaxAmount: [
                {
                  _: 331.25,
                  currencyID: 'EUR'
                }
              ],
              TaxCategory: [
                {
                  ID: [
                    {
                      _: 'S'
                    }
                  ],
                  Percent: [
                    {
                      _: 25
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      LegalMonetaryTotal: [
        {
          LineExtensionAmount: [
            {
              _: 1300,
              currencyID: 'EUR'
            }
          ],
          TaxExclusiveAmount: [
            {
              _: 1325,
              currencyID: 'EUR'
            }
          ],
          TaxInclusiveAmount: [
            {
              _: 1656.25,
              currencyID: 'EUR'
            }
          ],
          ChargeTotalAmount: [
            {
              _: 25,
              currencyID: 'EUR'
            }
          ],
          PayableAmount: [
            {
              _: 1656.25,
              currencyID: 'EUR'
            }
          ]
        }
      ],
      CreditNoteLine: [
        {
          ID: [
            {
              _: '1'
            }
          ],
          CreditedQuantity: [
            {
              _: 7,
              unitCode: 'DAY'
            }
          ],
          LineExtensionAmount: [
            {
              _: 2800,
              currencyID: 'EUR'
            }
          ],
          AccountingCost: [
            {
              _: 'Konteringsstreng'
            }
          ],
          OrderLineReference: [
            {
              LineID: [
                {
                  _: '123'
                }
              ]
            }
          ],
          Item: [
            {
              Description: [
                {
                  _: 'Description of item'
                }
              ],
              Name: [
                {
                  _: 'item name'
                }
              ],
              StandardItemIdentification: [
                {
                  ID: [
                    {
                      _: '21382183120983',
                      schemeID: '0088'
                    }
                  ]
                }
              ],
              OriginCountry: [
                {
                  IdentificationCode: [
                    {
                      _: 'NO'
                    }
                  ]
                }
              ],
              CommodityClassification: [
                {
                  ItemClassificationCode: [
                    {
                      _: '09348023',
                      listID: 'SRV'
                    }
                  ]
                }
              ],
              ClassifiedTaxCategory: [
                {
                  ID: [
                    {
                      _: 'S'
                    }
                  ],
                  Percent: [
                    {
                      _: 25
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          Price: [
            {
              PriceAmount: [
                {
                  _: 400,
                  currencyID: 'EUR'
                }
              ]
            }
          ]
        },
        {
          ID: [
            {
              _: '2'
            }
          ],
          CreditedQuantity: [
            {
              _: -3,
              unitCode: 'DAY'
            }
          ],
          LineExtensionAmount: [
            {
              _: -1500,
              currencyID: 'EUR'
            }
          ],
          OrderLineReference: [
            {
              LineID: [
                {
                  _: '123'
                }
              ]
            }
          ],
          Item: [
            {
              Description: [
                {
                  _: 'Description 2'
                }
              ],
              Name: [
                {
                  _: 'item name 2'
                }
              ],
              StandardItemIdentification: [
                {
                  ID: [
                    {
                      _: '21382183120983',
                      schemeID: '0088'
                    }
                  ]
                }
              ],
              OriginCountry: [
                {
                  IdentificationCode: [
                    {
                      _: 'NO'
                    }
                  ]
                }
              ],
              CommodityClassification: [
                {
                  ItemClassificationCode: [
                    {
                      _: '09348023',
                      listID: 'SRV'
                    }
                  ]
                }
              ],
              ClassifiedTaxCategory: [
                {
                  ID: [
                    {
                      _: 'S'
                    }
                  ],
                  Percent: [
                    {
                      _: 25
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          Price: [
            {
              PriceAmount: [
                {
                  _: 500,
                  currencyID: 'EUR'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});

const trivialCreditNoteUBLJsonWithoutPartyLegalEntity = () => ({
  _D: 'urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2',
  _A: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
  _B: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  CreditNote: [
    {
      CustomizationID: [
        {
          _: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0'
        }
      ],
      ProfileID: [
        {
          _: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0'
        }
      ],
      ID: [
        {
          _: 'Snippet1'
        }
      ],
      IssueDate: [
        {
          _: '2017-11-13'
        }
      ],
      DocumentCurrencyCode: [
        {
          _: 'EUR'
        }
      ],
      AccountingCost: [
        {
          _: '4025:123:4343'
        }
      ],
      BuyerReference: [
        {
          _: '0150abc'
        }
      ],
      AccountingSupplierParty: [
        {
          Party: [
            {
              EndpointID: [
                {
                  _: '9482348239847239874',
                  schemeID: '0088'
                }
              ],
              PartyIdentification: [
                {
                  ID: [
                    {
                      _: '99887766'
                    }
                  ]
                }
              ],
              PartyName: [
                {
                  Name: [
                    {
                      _: 'SupplierTradingName Ltd.'
                    }
                  ]
                }
              ],
              PostalAddress: [
                {
                  StreetName: [
                    {
                      _: 'Main street 1'
                    }
                  ],
                  AdditionalStreetName: [
                    {
                      _: 'Postbox 123'
                    }
                  ],
                  CityName: [
                    {
                      _: 'London'
                    }
                  ],
                  PostalZone: [
                    {
                      _: 'GB 123 EW'
                    }
                  ],
                  Country: [
                    {
                      IdentificationCode: [
                        {
                          _: 'GB'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyTaxScheme: [
                {
                  CompanyID: [
                    {
                      _: 'GB1232434'
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      AccountingCustomerParty: [
        {
          Party: [
            {
              EndpointID: [
                {
                  _: 'FR23342',
                  schemeID: '0002'
                }
              ],
              PartyIdentification: [
                {
                  ID: [
                    {
                      _: 'FR23342',
                      schemeID: '0002'
                    }
                  ]
                }
              ],
              PartyName: [
                {
                  Name: [
                    {
                      _: 'BuyerTradingName AS'
                    }
                  ]
                }
              ],
              PostalAddress: [
                {
                  StreetName: [
                    {
                      _: 'Hovedgatan 32'
                    }
                  ],
                  AdditionalStreetName: [
                    {
                      _: 'Po box 878'
                    }
                  ],
                  CityName: [
                    {
                      _: 'Stockholm'
                    }
                  ],
                  PostalZone: [
                    {
                      _: '456 34'
                    }
                  ],
                  Country: [
                    {
                      IdentificationCode: [
                        {
                          _: 'SE'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyTaxScheme: [
                {
                  CompanyID: [
                    {
                      _: 'SE4598375937'
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyLegalEntity: [
                {
                  RegistrationName: [
                    {
                      _: 'Buyer Official Name'
                    }
                  ],
                  CompanyID: [
                    {
                      _: '39937423947',
                      schemeID: '0183'
                    }
                  ]
                }
              ],
              Contact: [
                {
                  Name: [
                    {
                      _: 'Lisa Johnson'
                    }
                  ],
                  Telephone: [
                    {
                      _: '23434234'
                    }
                  ],
                  ElectronicMail: [
                    {
                      _: 'lj@buyer.se'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      Delivery: [
        {
          ActualDeliveryDate: [
            {
              _: '2017-11-01'
            }
          ],
          DeliveryLocation: [
            {
              ID: [
                {
                  _: '9483759475923478',
                  schemeID: '0088'
                }
              ],
              Address: [
                {
                  StreetName: [
                    {
                      _: 'Delivery street 2'
                    }
                  ],
                  AdditionalStreetName: [
                    {
                      _: 'Building 56'
                    }
                  ],
                  CityName: [
                    {
                      _: 'Stockholm'
                    }
                  ],
                  PostalZone: [
                    {
                      _: '21234'
                    }
                  ],
                  Country: [
                    {
                      IdentificationCode: [
                        {
                          _: 'SE'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          DeliveryParty: [
            {
              PartyName: [
                {
                  Name: [
                    {
                      _: 'Delivery party Name'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      PaymentMeans: [
        {
          PaymentMeansCode: [
            {
              _: '30',
              name: 'Credit transfer'
            }
          ],
          PaymentID: [
            {
              _: 'Snippet1'
            }
          ],
          PayeeFinancialAccount: [
            {
              ID: [
                {
                  _: 'IBAN32423940'
                }
              ],
              Name: [
                {
                  _: 'AccountName'
                }
              ],
              FinancialInstitutionBranch: [
                {
                  ID: [
                    {
                      _: 'BIC324098'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      PaymentTerms: [
        {
          Note: [
            {
              _: 'Payment within 10 days, 2% discount'
            }
          ]
        }
      ],
      AllowanceCharge: [
        {
          ChargeIndicator: [
            {
              _: true
            }
          ],
          AllowanceChargeReason: [
            {
              _: 'Insurance'
            }
          ],
          Amount: [
            {
              _: 25,
              currencyID: 'EUR'
            }
          ],
          TaxCategory: [
            {
              ID: [
                {
                  _: 'S'
                }
              ],
              Percent: [
                {
                  _: 25
                }
              ],
              TaxScheme: [
                {
                  ID: [
                    {
                      _: 'VAT'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      TaxTotal: [
        {
          TaxAmount: [
            {
              _: 331.25,
              currencyID: 'EUR'
            }
          ],
          TaxSubtotal: [
            {
              TaxableAmount: [
                {
                  _: 1325,
                  currencyID: 'EUR'
                }
              ],
              TaxAmount: [
                {
                  _: 331.25,
                  currencyID: 'EUR'
                }
              ],
              TaxCategory: [
                {
                  ID: [
                    {
                      _: 'S'
                    }
                  ],
                  Percent: [
                    {
                      _: 25
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      LegalMonetaryTotal: [
        {
          LineExtensionAmount: [
            {
              _: 1300,
              currencyID: 'EUR'
            }
          ],
          TaxExclusiveAmount: [
            {
              _: 1325,
              currencyID: 'EUR'
            }
          ],
          TaxInclusiveAmount: [
            {
              _: 1656.25,
              currencyID: 'EUR'
            }
          ],
          ChargeTotalAmount: [
            {
              _: 25,
              currencyID: 'EUR'
            }
          ],
          PayableAmount: [
            {
              _: 1656.25,
              currencyID: 'EUR'
            }
          ]
        }
      ],
      CreditNoteLine: [
        {
          ID: [
            {
              _: '1'
            }
          ],
          CreditedQuantity: [
            {
              _: 7,
              unitCode: 'DAY'
            }
          ],
          LineExtensionAmount: [
            {
              _: 2800,
              currencyID: 'EUR'
            }
          ],
          AccountingCost: [
            {
              _: 'Konteringsstreng'
            }
          ],
          CreditNoteLineReference: [
            {
              LineID: [
                {
                  _: '123'
                }
              ]
            }
          ],
          Item: [
            {
              Description: [
                {
                  _: 'Description of item'
                }
              ],
              Name: [
                {
                  _: 'item name'
                }
              ],
              StandardItemIdentification: [
                {
                  ID: [
                    {
                      _: '21382183120983',
                      schemeID: '0088'
                    }
                  ]
                }
              ],
              OriginCountry: [
                {
                  IdentificationCode: [
                    {
                      _: 'NO'
                    }
                  ]
                }
              ],
              CommodityClassification: [
                {
                  ItemClassificationCode: [
                    {
                      _: '09348023',
                      listID: 'SRV'
                    }
                  ]
                }
              ],
              ClassifiedTaxCategory: [
                {
                  ID: [
                    {
                      _: 'S'
                    }
                  ],
                  Percent: [
                    {
                      _: 25
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          Price: [
            {
              PriceAmount: [
                {
                  _: 400,
                  currencyID: 'EUR'
                }
              ]
            }
          ]
        },
        {
          ID: [
            {
              _: '2'
            }
          ],
          CreditedQuantity: [
            {
              _: -3,
              unitCode: 'DAY'
            }
          ],
          LineExtensionAmount: [
            {
              _: -1500,
              currencyID: 'EUR'
            }
          ],
          CreditNoteLineReference: [
            {
              LineID: [
                {
                  _: '123'
                }
              ]
            }
          ],
          Item: [
            {
              Description: [
                {
                  _: 'Description 2'
                }
              ],
              Name: [
                {
                  _: 'item name 2'
                }
              ],
              StandardItemIdentification: [
                {
                  ID: [
                    {
                      _: '21382183120983',
                      schemeID: '0088'
                    }
                  ]
                }
              ],
              OriginCountry: [
                {
                  IdentificationCode: [
                    {
                      _: 'NO'
                    }
                  ]
                }
              ],
              CommodityClassification: [
                {
                  ItemClassificationCode: [
                    {
                      _: '09348023',
                      listID: 'SRV'
                    }
                  ]
                }
              ],
              ClassifiedTaxCategory: [
                {
                  ID: [
                    {
                      _: 'S'
                    }
                  ],
                  Percent: [
                    {
                      _: 25
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          Price: [
            {
              PriceAmount: [
                {
                  _: 500,
                  currencyID: 'EUR'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});

const modifiedCreditNoteUBLJson = (partyLegalEntityCompanyId) => ({
  _D: 'urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2',
  _A: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
  _B: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  CreditNote: [
    {
      CustomizationID: [
        {
          _: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0'
        }
      ],
      ProfileID: [
        {
          _: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0'
        }
      ],
      ID: [
        {
          _: 'Snippet1'
        }
      ],
      IssueDate: [
        {
          _: '2017-11-13'
        }
      ],
      DocumentCurrencyCode: [
        {
          _: 'EUR'
        }
      ],
      AccountingCost: [
        {
          _: '4025:123:4343'
        }
      ],
      BuyerReference: [
        {
          _: '0150abc'
        }
      ],
      AccountingSupplierParty: [
        {
          Party: [
            {
              EndpointID: [
                {
                  _: '9482348239847239874',
                  schemeID: '0088'
                }
              ],
              PartyIdentification: [
                {
                  ID: [
                    {
                      _: partyLegalEntityCompanyId
                    }
                  ]
                }
              ],
              PartyName: [
                {
                  Name: [
                    {
                      _: 'SupplierTradingName Ltd.'
                    }
                  ]
                }
              ],
              PostalAddress: [
                {
                  StreetName: [
                    {
                      _: 'Main street 1'
                    }
                  ],
                  AdditionalStreetName: [
                    {
                      _: 'Postbox 123'
                    }
                  ],
                  CityName: [
                    {
                      _: 'London'
                    }
                  ],
                  PostalZone: [
                    {
                      _: 'GB 123 EW'
                    }
                  ],
                  Country: [
                    {
                      IdentificationCode: [
                        {
                          _: 'GB'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyTaxScheme: [
                {
                  CompanyID: [
                    {
                      _: partyLegalEntityCompanyId
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyLegalEntity: [
                {
                  RegistrationName: [
                    {
                      _: 'SupplierOfficialName Ltd'
                    }
                  ],
                  CompanyID: [
                    {
                      _: partyLegalEntityCompanyId
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      AccountingCustomerParty: [
        {
          Party: [
            {
              EndpointID: [
                {
                  _: 'FR23342',
                  schemeID: '0002'
                }
              ],
              PartyIdentification: [
                {
                  ID: [
                    {
                      _: 'FR23342',
                      schemeID: '0002'
                    }
                  ]
                }
              ],
              PartyName: [
                {
                  Name: [
                    {
                      _: 'BuyerTradingName AS'
                    }
                  ]
                }
              ],
              PostalAddress: [
                {
                  StreetName: [
                    {
                      _: 'Hovedgatan 32'
                    }
                  ],
                  AdditionalStreetName: [
                    {
                      _: 'Po box 878'
                    }
                  ],
                  CityName: [
                    {
                      _: 'Stockholm'
                    }
                  ],
                  PostalZone: [
                    {
                      _: '456 34'
                    }
                  ],
                  Country: [
                    {
                      IdentificationCode: [
                        {
                          _: 'SE'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyTaxScheme: [
                {
                  CompanyID: [
                    {
                      _: 'SE4598375937'
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyLegalEntity: [
                {
                  RegistrationName: [
                    {
                      _: 'Buyer Official Name'
                    }
                  ],
                  CompanyID: [
                    {
                      _: '39937423947',
                      schemeID: '0183'
                    }
                  ]
                }
              ],
              Contact: [
                {
                  Name: [
                    {
                      _: 'Lisa Johnson'
                    }
                  ],
                  Telephone: [
                    {
                      _: '23434234'
                    }
                  ],
                  ElectronicMail: [
                    {
                      _: 'lj@buyer.se'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      Delivery: [
        {
          ActualDeliveryDate: [
            {
              _: '2017-11-01'
            }
          ],
          DeliveryLocation: [
            {
              ID: [
                {
                  _: '9483759475923478',
                  schemeID: '0088'
                }
              ],
              Address: [
                {
                  StreetName: [
                    {
                      _: 'Delivery street 2'
                    }
                  ],
                  AdditionalStreetName: [
                    {
                      _: 'Building 56'
                    }
                  ],
                  CityName: [
                    {
                      _: 'Stockholm'
                    }
                  ],
                  PostalZone: [
                    {
                      _: '21234'
                    }
                  ],
                  Country: [
                    {
                      IdentificationCode: [
                        {
                          _: 'SE'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          DeliveryParty: [
            {
              PartyName: [
                {
                  Name: [
                    {
                      _: 'Delivery party Name'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      PaymentMeans: [
        {
          PaymentMeansCode: [
            {
              _: '30',
              name: 'Credit transfer'
            }
          ],
          PaymentID: [
            {
              _: 'Snippet1'
            }
          ],
          PayeeFinancialAccount: [
            {
              ID: [
                {
                  _: 'IBAN32423940'
                }
              ],
              Name: [
                {
                  _: 'AccountName'
                }
              ],
              FinancialInstitutionBranch: [
                {
                  ID: [
                    {
                      _: 'BIC324098'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      PaymentTerms: [
        {
          Note: [
            {
              _: 'Payment within 10 days, 2% discount'
            }
          ]
        }
      ],
      AllowanceCharge: [
        {
          ChargeIndicator: [
            {
              _: true
            }
          ],
          AllowanceChargeReason: [
            {
              _: 'Insurance'
            }
          ],
          Amount: [
            {
              _: 25,
              currencyID: 'EUR'
            }
          ],
          TaxCategory: [
            {
              ID: [
                {
                  _: 'S'
                }
              ],
              Percent: [
                {
                  _: 25
                }
              ],
              TaxScheme: [
                {
                  ID: [
                    {
                      _: 'VAT'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      TaxTotal: [
        {
          TaxAmount: [
            {
              _: 331.25,
              currencyID: 'EUR'
            }
          ],
          TaxSubtotal: [
            {
              TaxableAmount: [
                {
                  _: 1325,
                  currencyID: 'EUR'
                }
              ],
              TaxAmount: [
                {
                  _: 331.25,
                  currencyID: 'EUR'
                }
              ],
              TaxCategory: [
                {
                  ID: [
                    {
                      _: 'S'
                    }
                  ],
                  Percent: [
                    {
                      _: 25
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      LegalMonetaryTotal: [
        {
          LineExtensionAmount: [
            {
              _: 1300,
              currencyID: 'EUR'
            }
          ],
          TaxExclusiveAmount: [
            {
              _: 1325,
              currencyID: 'EUR'
            }
          ],
          TaxInclusiveAmount: [
            {
              _: 1656.25,
              currencyID: 'EUR'
            }
          ],
          ChargeTotalAmount: [
            {
              _: 25,
              currencyID: 'EUR'
            }
          ],
          PayableAmount: [
            {
              _: 1656.25,
              currencyID: 'EUR'
            }
          ]
        }
      ],
      CreditNoteLine: [
        {
          ID: [
            {
              _: '1'
            }
          ],
          CreditedQuantity: [
            {
              _: 7,
              unitCode: 'DAY'
            }
          ],
          LineExtensionAmount: [
            {
              _: 2800,
              currencyID: 'EUR'
            }
          ],
          AccountingCost: [
            {
              _: 'Konteringsstreng'
            }
          ],
          CreditNoteLineReference: [
            {
              LineID: [
                {
                  _: '123'
                }
              ]
            }
          ],
          Item: [
            {
              Description: [
                {
                  _: 'Description of item'
                }
              ],
              Name: [
                {
                  _: 'item name'
                }
              ],
              StandardItemIdentification: [
                {
                  ID: [
                    {
                      _: '21382183120983',
                      schemeID: '0088'
                    }
                  ]
                }
              ],
              OriginCountry: [
                {
                  IdentificationCode: [
                    {
                      _: 'NO'
                    }
                  ]
                }
              ],
              CommodityClassification: [
                {
                  ItemClassificationCode: [
                    {
                      _: '09348023',
                      listID: 'SRV'
                    }
                  ]
                }
              ],
              ClassifiedTaxCategory: [
                {
                  ID: [
                    {
                      _: 'S'
                    }
                  ],
                  Percent: [
                    {
                      _: 25
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          Price: [
            {
              PriceAmount: [
                {
                  _: 400,
                  currencyID: 'EUR'
                }
              ]
            }
          ]
        },
        {
          ID: [
            {
              _: '2'
            }
          ],
          CreditedQuantity: [
            {
              _: -3,
              unitCode: 'DAY'
            }
          ],
          LineExtensionAmount: [
            {
              _: -1500,
              currencyID: 'EUR'
            }
          ],
          CreditNoteLineReference: [
            {
              LineID: [
                {
                  _: '123'
                }
              ]
            }
          ],
          Item: [
            {
              Description: [
                {
                  _: 'Description 2'
                }
              ],
              Name: [
                {
                  _: 'item name 2'
                }
              ],
              StandardItemIdentification: [
                {
                  ID: [
                    {
                      _: '21382183120983',
                      schemeID: '0088'
                    }
                  ]
                }
              ],
              OriginCountry: [
                {
                  IdentificationCode: [
                    {
                      _: 'NO'
                    }
                  ]
                }
              ],
              CommodityClassification: [
                {
                  ItemClassificationCode: [
                    {
                      _: '09348023',
                      listID: 'SRV'
                    }
                  ]
                }
              ],
              ClassifiedTaxCategory: [
                {
                  ID: [
                    {
                      _: 'S'
                    }
                  ],
                  Percent: [
                    {
                      _: 25
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          Price: [
            {
              PriceAmount: [
                {
                  _: 500,
                  currencyID: 'EUR'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});

const creditNoteUBLJson = (partyLegalEntityCompanyId) => ({
  _D: 'urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2',
  _A: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
  _B: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  CreditNote: [
    {
      CustomizationID: [
        {
          _: 'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0'
        }
      ],
      ProfileID: [
        {
          _: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0'
        }
      ],
      ID: [
        {
          _: 'Snippet1'
        }
      ],
      IssueDate: [
        {
          _: '2017-11-13'
        }
      ],
      DocumentCurrencyCode: [
        {
          _: 'EUR'
        }
      ],
      AccountingCost: [
        {
          _: '4025:123:4343'
        }
      ],
      BuyerReference: [
        {
          _: '0150abc'
        }
      ],
      AccountingSupplierParty: [
        {
          Party: [
            {
              EndpointID: [
                {
                  _: '9482348239847239874',
                  schemeID: '0088'
                }
              ],
              PartyIdentification: [
                {
                  ID: [
                    {
                      _: partyLegalEntityCompanyId
                    }
                  ]
                }
              ],
              PartyName: [
                {
                  Name: [
                    {
                      _: 'SupplierTradingName Ltd.'
                    }
                  ]
                }
              ],
              PostalAddress: [
                {
                  StreetName: [
                    {
                      _: 'Main street 1'
                    }
                  ],
                  AdditionalStreetName: [
                    {
                      _: 'Postbox 123'
                    }
                  ],
                  CityName: [
                    {
                      _: 'London'
                    }
                  ],
                  PostalZone: [
                    {
                      _: 'GB 123 EW'
                    }
                  ],
                  Country: [
                    {
                      IdentificationCode: [
                        {
                          _: 'GB'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyTaxScheme: [
                {
                  CompanyID: [
                    {
                      _: partyLegalEntityCompanyId
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyLegalEntity: [
                {
                  RegistrationName: [
                    {
                      _: 'SupplierOfficialName Ltd'
                    }
                  ],
                  CompanyID: [
                    {
                      _: partyLegalEntityCompanyId
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      AccountingCustomerParty: [
        {
          Party: [
            {
              EndpointID: [
                {
                  _: 'FR23342',
                  schemeID: '0002'
                }
              ],
              PartyIdentification: [
                {
                  ID: [
                    {
                      _: 'FR23342',
                      schemeID: '0002'
                    }
                  ]
                }
              ],
              PartyName: [
                {
                  Name: [
                    {
                      _: 'BuyerTradingName AS'
                    }
                  ]
                }
              ],
              PostalAddress: [
                {
                  StreetName: [
                    {
                      _: 'Hovedgatan 32'
                    }
                  ],
                  AdditionalStreetName: [
                    {
                      _: 'Po box 878'
                    }
                  ],
                  CityName: [
                    {
                      _: 'Stockholm'
                    }
                  ],
                  PostalZone: [
                    {
                      _: '456 34'
                    }
                  ],
                  Country: [
                    {
                      IdentificationCode: [
                        {
                          _: 'SE'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyTaxScheme: [
                {
                  CompanyID: [
                    {
                      _: 'SE4598375937'
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ],
              PartyLegalEntity: [
                {
                  RegistrationName: [
                    {
                      _: 'Buyer Official Name'
                    }
                  ],
                  CompanyID: [
                    {
                      _: '39937423947',
                      schemeID: '0183'
                    }
                  ]
                }
              ],
              Contact: [
                {
                  Name: [
                    {
                      _: 'Lisa Johnson'
                    }
                  ],
                  Telephone: [
                    {
                      _: '23434234'
                    }
                  ],
                  ElectronicMail: [
                    {
                      _: 'lj@buyer.se'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      Delivery: [
        {
          ActualDeliveryDate: [
            {
              _: '2017-11-01'
            }
          ],
          DeliveryLocation: [
            {
              ID: [
                {
                  _: '9483759475923478',
                  schemeID: '0088'
                }
              ],
              Address: [
                {
                  StreetName: [
                    {
                      _: 'Delivery street 2'
                    }
                  ],
                  AdditionalStreetName: [
                    {
                      _: 'Building 56'
                    }
                  ],
                  CityName: [
                    {
                      _: 'Stockholm'
                    }
                  ],
                  PostalZone: [
                    {
                      _: '21234'
                    }
                  ],
                  Country: [
                    {
                      IdentificationCode: [
                        {
                          _: 'SE'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          DeliveryParty: [
            {
              PartyName: [
                {
                  Name: [
                    {
                      _: 'Delivery party Name'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      PaymentMeans: [
        {
          PaymentMeansCode: [
            {
              _: '30',
              name: 'Credit transfer'
            }
          ],
          PaymentID: [
            {
              _: 'Snippet1'
            }
          ],
          PayeeFinancialAccount: [
            {
              ID: [
                {
                  _: 'IBAN32423940'
                }
              ],
              Name: [
                {
                  _: 'AccountName'
                }
              ],
              FinancialInstitutionBranch: [
                {
                  ID: [
                    {
                      _: 'BIC324098'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      PaymentTerms: [
        {
          Note: [
            {
              _: 'Payment within 10 days, 2% discount'
            }
          ]
        }
      ],
      AllowanceCharge: [
        {
          ChargeIndicator: [
            {
              _: true
            }
          ],
          AllowanceChargeReason: [
            {
              _: 'Insurance'
            }
          ],
          Amount: [
            {
              _: 25,
              currencyID: 'EUR'
            }
          ],
          TaxCategory: [
            {
              ID: [
                {
                  _: 'S'
                }
              ],
              Percent: [
                {
                  _: 25
                }
              ],
              TaxScheme: [
                {
                  ID: [
                    {
                      _: 'VAT'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      TaxTotal: [
        {
          TaxAmount: [
            {
              _: 331.25,
              currencyID: 'EUR'
            }
          ],
          TaxSubtotal: [
            {
              TaxableAmount: [
                {
                  _: 1325,
                  currencyID: 'EUR'
                }
              ],
              TaxAmount: [
                {
                  _: 331.25,
                  currencyID: 'EUR'
                }
              ],
              TaxCategory: [
                {
                  ID: [
                    {
                      _: 'S'
                    }
                  ],
                  Percent: [
                    {
                      _: 25
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      LegalMonetaryTotal: [
        {
          LineExtensionAmount: [
            {
              _: 1300,
              currencyID: 'EUR'
            }
          ],
          TaxExclusiveAmount: [
            {
              _: 1325,
              currencyID: 'EUR'
            }
          ],
          TaxInclusiveAmount: [
            {
              _: 1656.25,
              currencyID: 'EUR'
            }
          ],
          ChargeTotalAmount: [
            {
              _: 25,
              currencyID: 'EUR'
            }
          ],
          PayableAmount: [
            {
              _: 1656.25,
              currencyID: 'EUR'
            }
          ]
        }
      ],
      CreditNoteLine: [
        {
          ID: [
            {
              _: '1'
            }
          ],
          CreditedQuantity: [
            {
              _: 7,
              unitCode: 'DAY'
            }
          ],
          LineExtensionAmount: [
            {
              _: 2800,
              currencyID: 'EUR'
            }
          ],
          AccountingCost: [
            {
              _: 'Konteringsstreng'
            }
          ],
          CreditNoteLineReference: [
            {
              LineID: [
                {
                  _: '123'
                }
              ]
            }
          ],
          Item: [
            {
              Description: [
                {
                  _: 'Description of item'
                }
              ],
              Name: [
                {
                  _: 'item name'
                }
              ],
              StandardItemIdentification: [
                {
                  ID: [
                    {
                      _: '21382183120983',
                      schemeID: '0088'
                    }
                  ]
                }
              ],
              OriginCountry: [
                {
                  IdentificationCode: [
                    {
                      _: 'NO'
                    }
                  ]
                }
              ],
              CommodityClassification: [
                {
                  ItemClassificationCode: [
                    {
                      _: '09348023',
                      listID: 'SRV'
                    }
                  ]
                }
              ],
              ClassifiedTaxCategory: [
                {
                  ID: [
                    {
                      _: 'S'
                    }
                  ],
                  Percent: [
                    {
                      _: 25
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          Price: [
            {
              PriceAmount: [
                {
                  _: 400,
                  currencyID: 'EUR'
                }
              ]
            }
          ]
        },
        {
          ID: [
            {
              _: '2'
            }
          ],
          CreditedQuantity: [
            {
              _: -3,
              unitCode: 'DAY'
            }
          ],
          LineExtensionAmount: [
            {
              _: -1500,
              currencyID: 'EUR'
            }
          ],
          CreditNoteLineReference: [
            {
              LineID: [
                {
                  _: '123'
                }
              ]
            }
          ],
          Item: [
            {
              Description: [
                {
                  _: 'Description 2'
                }
              ],
              Name: [
                {
                  _: 'item name 2'
                }
              ],
              StandardItemIdentification: [
                {
                  ID: [
                    {
                      _: '21382183120983',
                      schemeID: '0088'
                    }
                  ]
                }
              ],
              OriginCountry: [
                {
                  IdentificationCode: [
                    {
                      _: 'NO'
                    }
                  ]
                }
              ],
              CommodityClassification: [
                {
                  ItemClassificationCode: [
                    {
                      _: '09348023',
                      listID: 'SRV'
                    }
                  ]
                }
              ],
              ClassifiedTaxCategory: [
                {
                  ID: [
                    {
                      _: 'S'
                    }
                  ],
                  Percent: [
                    {
                      _: 25
                    }
                  ],
                  TaxScheme: [
                    {
                      ID: [
                        {
                          _: 'VAT'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          Price: [
            {
              PriceAmount: [
                {
                  _: 500,
                  currencyID: 'EUR'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});

const invalidUBLJson = () => ({
  _D: 'urn:oasis:names:specification:ubl:schema:xsd:CreditNote-2',
  _A: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
  _B: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  CreditNote: [{
    IssueDate: [{ _: '2011-09-22' }],
    InvoicePeriod: [{
      StartDate: [{ _: '2011-08-01' }],
      EndDate: [{ _: '2011-08-31' }]
    }],

    AccountingSupplierParty: [{
      Party: [{
        PartyName: [{
          Name: [{ _: 'Custom Cotter Pins' }]
        }],
        PartyLegalEntity: [{
          RegistrationName: [{ _: 'The Sellercompany Incorporated' }],
          CompanyID: [{
            _: '5565357457',
            schemeID: 'SE:ORGNR',
            schemeAgencyID: 'ZZZ'
          }]
        }]
      }]
    }],
    AccountingCustomerParty: [{
      Party: [{
        PartyName: [{
          Name: [{ _: 'North American Veeblefetzer' }]
        }]
      }]
    }],
    LegalMonetaryTotal: [{
      PayableAmount: [{
        _: 100.00,
        currencyID: 'CAD'
      }]
    }],
    CreditNoteLine: [{
      ID: [{ _: '1' }],
      LineExtensionAmount: [{
        _: 100.00,
        currencyID: 'CAD'
      }],
      Item: [{
        Description: [{ _: 'Cotter pin, MIL-SPEC' }]
      }]
    }]
  }]
});

module.exports = {
  trivialCreditNoteUBLJson,
  trivialCreditNoteUBLJsonWithoutPartyLegalEntity,
  modifiedCreditNoteUBLJson,
  creditNoteUBLJson,
  invalidUBLJson
};
