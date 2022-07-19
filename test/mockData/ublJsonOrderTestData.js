// Se https://docs.oasis-open.org/ubl/UBL-2.1-JSON/v2.0/cnd01/UBL-2.1-JSON-v2.0-cnd01.html#S-UBL-ORDER-2.1-EXAMPLE.JSON
const trivialOrderUBLJson = (partyLegalEntityCompanyId, OrderID = '123') => (
  {
    _D: 'urn:oasis:names:specification:ubl:schema:xsd:Order-2',
    _A: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
    _B: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
    Order: [
      {
        UBLVersionID: [
          {
            _: '2.1'
          }
        ],
        CustomizationID: [
          {
            _: 'urn:www.cenbii.eu:transaction:biicoretrdm001:ver1.0'
          }
        ],
        ProfileID: [
          {
            _: 'urn:www.cenbii.eu:profile:BII01:ver1.0',
            schemeAgencyID: 'BII',
            schemeID: 'Profile'
          }
        ],
        ID: [
          {
            _: OrderID
          }
        ],
        IssueDate: [
          {
            _: '2010-01-20'
          }
        ],
        IssueTime: [
          {
            _: '12:30:00'
          }
        ],
        Note: [
          {
            _: 'Information text for the whole order'
          }
        ],
        DocumentCurrencyCode: [
          {
            _: 'SEK'
          }
        ],
        AccountingCostCode: [
          {
            _: 'Project123'
          }
        ],
        ValidityPeriod: [
          {
            EndDate: [
              {
                _: '2010-01-31'
              }
            ]
          }
        ],
        QuotationDocumentReference: [
          {
            ID: [
              {
                _: 'QuoteID123'
              }
            ]
          }
        ],
        OrderDocumentReference: [
          {
            ID: [
              {
                _: 'RjectedOrderID123'
              }
            ]
          }
        ],
        OriginatorDocumentReference: [
          {
            ID: [
              {
                _: 'MAFO'
              }
            ]
          }
        ],
        AdditionalDocumentReference: [
          {
            ID: [
              {
                _: 'Doc1'
              }
            ],
            DocumentType: [
              {
                _: 'Timesheet'
              }
            ],
            Attachment: [
              {
                ExternalReference: [
                  {
                    URI: [
                      {
                        _: 'http://www.suppliersite.eu/sheet001.html'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            ID: [
              {
                _: 'Doc2'
              }
            ],
            DocumentType: [
              {
                _: 'Drawing'
              }
            ],
            Attachment: [
              {
                EmbeddedDocumentBinaryObject: [
                  {
                    _: 'UjBsR09EbGhjZ0dTQUxNQUFBUUNBRU1tQ1p0dU1GUXhEUzhi',
                    mimeCode: 'application/pdf'
                  }
                ]
              }
            ]
          }
        ],
        Contract: [
          {
            ID: [
              {
                _: '34322'
              }
            ],
            ContractType: [
              {
                _: 'FrameworkAgreementID123'
              }
            ]
          }
        ],
        BuyerCustomerParty: [
          {
            Party: [
              {
                EndpointID: [
                  {
                    _: '7300072311115',
                    schemeAgencyID: '9',
                    schemeID: 'GLN'
                  }
                ],
                PartyIdentification: [
                  {
                    ID: [
                      {
                        _: '7300070011115',
                        schemeAgencyID: '9',
                        schemeID: 'GLN'
                      }
                    ]
                  },
                  {
                    ID: [
                      {
                        _: 'PartyID123'
                      }
                    ]
                  }
                ],
                PartyName: [
                  {
                    Name: [
                      {
                        _: 'Johnssons byggvaror'
                      }
                    ]
                  }
                ],
                PostalAddress: [
                  {
                    ID: [
                      {
                        _: '1234567890123',
                        schemeAgencyID: '9',
                        schemeID: 'GLN'
                      }
                    ],
                    Postbox: [
                      {
                        _: 'PoBox123'
                      }
                    ],
                    StreetName: [
                      {
                        _: 'Rådhusgatan'
                      }
                    ],
                    AdditionalStreetName: [
                      {
                        _: '2nd floor'
                      }
                    ],
                    BuildingNumber: [
                      {
                        _: '5'
                      }
                    ],
                    Department: [
                      {
                        _: 'Purchasing department'
                      }
                    ],
                    CityName: [
                      {
                        _: 'Stockholm'
                      }
                    ],
                    PostalZone: [
                      {
                        _: '11000'
                      }
                    ],
                    CountrySubentity: [
                      {
                        _: 'RegionX'
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
                    RegistrationName: [
                      {
                        _: 'Herra Johnssons byggvaror AS'
                      }
                    ],
                    CompanyID: [
                      {
                        _: partyLegalEntityCompanyId
                      }
                    ],
                    RegistrationAddress: [
                      {
                        CityName: [
                          {
                            _: 'Stockholm'
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
                    TaxScheme: [
                      {
                        ID: [
                          {
                            _: 'VAT',
                            schemeID: 'UN/ECE 5153',
                            schemeAgencyID: '6'
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
                        _: 'Johnssons Byggvaror AB'
                      }
                    ],
                    CompanyID: [
                      {
                        _: partyLegalEntityCompanyId,
                        schemeID: 'SE:ORGNR'
                      }
                    ],
                    RegistrationAddress: [
                      {
                        CityName: [
                          {
                            _: 'Stockholm'
                          }
                        ],
                        CountrySubentity: [
                          {
                            _: 'RegionX'
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
                Contact: [
                  {
                    Telephone: [
                      {
                        _: '123456'
                      }
                    ],
                    Telefax: [
                      {
                        _: '123456'
                      }
                    ],
                    ElectronicMail: [
                      {
                        _: 'pelle@johnsson.se'
                      }
                    ]
                  }
                ],
                Person: [
                  {
                    FirstName: [
                      {
                        _: 'Pelle'
                      }
                    ],
                    FamilyName: [
                      {
                        _: 'Svensson'
                      }
                    ],
                    MiddleName: [
                      {
                        _: 'X'
                      }
                    ],
                    JobTitle: [
                      {
                        _: 'Boss'
                      }
                    ]
                  }
                ]
              }
            ],
            DeliveryContact: [
              {
                Name: [
                  {
                    _: 'Eva Johnsson'
                  }
                ],
                Telephone: [
                  {
                    _: '1234356'
                  }
                ],
                Telefax: [
                  {
                    _: '123455'
                  }
                ],
                ElectronicMail: [
                  {
                    _: 'eva@johnsson.se'
                  }
                ]
              }
            ]
          }
        ],
        SellerSupplierParty: [
          {
            Party: [
              {
                EndpointID: [
                  {
                    _: '7302347231111',
                    schemeAgencyID: '9',
                    schemeID: 'GLN'
                  }
                ],
                PartyIdentification: [
                  {
                    ID: [
                      {
                        _: 'SellerPartyID123'
                      }
                    ]
                  }
                ],
                PartyName: [
                  {
                    Name: [
                      {
                        _: 'Moderna Produkter AB'
                      }
                    ]
                  }
                ],
                PostalAddress: [
                  {
                    ID: [
                      {
                        _: '0987654321123',
                        schemeAgencyID: '9',
                        schemeID: 'GLN'
                      }
                    ],
                    Postbox: [
                      {
                        _: '321'
                      }
                    ],
                    StreetName: [
                      {
                        _: 'Kungsgatan'
                      }
                    ],
                    AdditionalStreetName: [
                      {
                        _: 'suite12'
                      }
                    ],
                    BuildingNumber: [
                      {
                        _: '22'
                      }
                    ],
                    Department: [
                      {
                        _: 'Sales department'
                      }
                    ],
                    CityName: [
                      {
                        _: 'Stockholm'
                      }
                    ],
                    PostalZone: [
                      {
                        _: '11000'
                      }
                    ],
                    CountrySubentity: [
                      {
                        _: 'RegionX'
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
                PartyLegalEntity: [
                  {
                    RegistrationName: [
                      {
                        _: 'Moderna Produkter AB'
                      }
                    ],
                    CompanyID: [
                      {
                        _: partyLegalEntityCompanyId,
                        schemeID: 'SE:ORGNR'
                      }
                    ],
                    RegistrationAddress: [
                      {
                        CityName: [
                          {
                            _: 'Stockholm'
                          }
                        ],
                        CountrySubentity: [
                          {
                            _: 'RegionX'
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
                Contact: [
                  {
                    Telephone: [
                      {
                        _: '34557'
                      }
                    ],
                    Telefax: [
                      {
                        _: '3456767'
                      }
                    ],
                    ElectronicMail: [
                      {
                        _: 'lars@moderna.se'
                      }
                    ]
                  }
                ],
                Person: [
                  {
                    FirstName: [
                      {
                        _: 'Lars'
                      }
                    ],
                    FamilyName: [
                      {
                        _: 'Petersen'
                      }
                    ],
                    MiddleName: [
                      {
                        _: 'M'
                      }
                    ],
                    JobTitle: [
                      {
                        _: 'Sales manager'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        OriginatorCustomerParty: [
          {
            Party: [
              {
                PartyIdentification: [
                  {
                    ID: [
                      {
                        _: '0987678321123',
                        schemeAgencyID: '9',
                        schemeID: 'GLN'
                      }
                    ]
                  }
                ],
                PartyName: [
                  {
                    Name: [
                      {
                        _: 'Moderna Produkter AB'
                      }
                    ]
                  }
                ],
                Contact: [
                  {
                    Telephone: [
                      {
                        _: '346788'
                      }
                    ],
                    Telefax: [
                      {
                        _: '8567443'
                      }
                    ],
                    ElectronicMail: [
                      {
                        _: 'sven@moderna.se'
                      }
                    ]
                  }
                ],
                Person: [
                  {
                    FirstName: [
                      {
                        _: 'Sven'
                      }
                    ],
                    FamilyName: [
                      {
                        _: 'Pereson'
                      }
                    ],
                    MiddleName: [
                      {
                        _: 'N'
                      }
                    ],
                    JobTitle: [
                      {
                        _: 'Stuffuser'
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
            DeliveryLocation: [
              {
                Address: [
                  {
                    ID: [
                      {
                        _: '1234567890123',
                        schemeAgencyID: '9',
                        schemeID: 'GLN'
                      }
                    ],
                    Postbox: [
                      {
                        _: '123'
                      }
                    ],
                    StreetName: [
                      {
                        _: 'Rådhusgatan'
                      }
                    ],
                    AdditionalStreetName: [
                      {
                        _: '2nd floor'
                      }
                    ],
                    BuildingNumber: [
                      {
                        _: '5'
                      }
                    ],
                    Department: [
                      {
                        _: 'Purchasing department'
                      }
                    ],
                    CityName: [
                      {
                        _: 'Stockholm'
                      }
                    ],
                    PostalZone: [
                      {
                        _: '11000'
                      }
                    ],
                    CountrySubentity: [
                      {
                        _: 'RegionX'
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
            RequestedDeliveryPeriod: [
              {
                StartDate: [
                  {
                    _: '2010-02-10'
                  }
                ],
                EndDate: [
                  {
                    _: '2010-02-25'
                  }
                ]
              }
            ],
            DeliveryParty: [
              {
                PartyIdentification: [
                  {
                    ID: [
                      {
                        _: '67654328394567',
                        schemeAgencyID: '9',
                        schemeID: 'GLN'
                      }
                    ]
                  }
                ],
                PartyName: [
                  {
                    Name: [
                      {
                        _: 'Swedish trucking'
                      }
                    ]
                  }
                ],
                Contact: [
                  {
                    Name: [
                      {
                        _: 'Per'
                      }
                    ],
                    Telephone: [
                      {
                        _: '987098709'
                      }
                    ],
                    Telefax: [
                      {
                        _: '34673435'
                      }
                    ],
                    ElectronicMail: [
                      {
                        _: 'bill@svetruck.se'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        DeliveryTerms: [
          {
            ID: [
              {
                _: 'FOT',
                schemeAgencyID: '6',
                schemeID: 'IMCOTERM'
              }
            ],
            SpecialTerms: [
              {
                _: 'CAD'
              }
            ],
            DeliveryLocation: [
              {
                ID: [
                  {
                    _: 'STO'
                  }
                ]
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
                _: 'Transport documents'
              }
            ],
            Amount: [
              {
                _: 100,
                currencyID: 'SEK'
              }
            ]
          },
          {
            ChargeIndicator: [
              {
                _: false
              }
            ],
            AllowanceChargeReason: [
              {
                _: 'Total order value discount'
              }
            ],
            Amount: [
              {
                _: 100,
                currencyID: 'SEK'
              }
            ]
          }
        ],
        TaxTotal: [
          {
            TaxAmount: [
              {
                _: 100,
                currencyID: 'SEK'
              }
            ]
          }
        ],
        AnticipatedMonetaryTotal: [
          {
            LineExtensionAmount: [
              {
                _: 6225,
                currencyID: 'SEK'
              }
            ],
            AllowanceTotalAmount: [
              {
                _: 100,
                currencyID: 'SEK'
              }
            ],
            ChargeTotalAmount: [
              {
                _: 100,
                currencyID: 'SEK'
              }
            ],
            PayableAmount: [
              {
                _: 6225,
                currencyID: 'SEK'
              }
            ]
          }
        ],
        OrderLine: [
          {
            Note: [
              {
                _: 'Freetext note on line 1'
              }
            ],
            LineItem: [
              {
                ID: [
                  {
                    _: '1'
                  }
                ],
                Quantity: [
                  {
                    _: 120,
                    unitCode: 'LTR'
                  }
                ],
                LineExtensionAmount: [
                  {
                    _: 6000,
                    currencyID: 'SEK'
                  }
                ],
                TotalTaxAmount: [
                  {
                    _: 10,
                    currencyID: 'SEK'
                  }
                ],
                PartialDeliveryIndicator: [
                  {
                    _: false
                  }
                ],
                AccountingCostCode: [
                  {
                    _: 'ProjectID123'
                  }
                ],
                Delivery: [
                  {
                    RequestedDeliveryPeriod: [
                      {
                        StartDate: [
                          {
                            _: '2010-02-10'
                          }
                        ],
                        EndDate: [
                          {
                            _: '2010-02-25'
                          }
                        ]
                      }
                    ]
                  }
                ],
                OriginatorParty: [
                  {
                    PartyIdentification: [
                      {
                        ID: [
                          {
                            _: 'EmployeeXXX',
                            schemeAgencyID: 'ZZZ',
                            schemeID: 'ZZZ'
                          }
                        ]
                      }
                    ],
                    PartyName: [
                      {
                        Name: [
                          {
                            _: 'Josef K.'
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
                        _: 50,
                        currencyID: 'SEK'
                      }
                    ],
                    BaseQuantity: [
                      {
                        _: 1,
                        unitCode: 'LTR'
                      }
                    ]
                  }
                ],
                Item: [
                  {
                    Description: [
                      {
                        _: 'Red paint'
                      }
                    ],
                    Name: [
                      {
                        _: 'Falu Rödfärg'
                      }
                    ],
                    SellersItemIdentification: [
                      {
                        ID: [
                          {
                            _: 'SItemNo001'
                          }
                        ]
                      }
                    ],
                    StandardItemIdentification: [
                      {
                        ID: [
                          {
                            _: '1234567890123',
                            schemeAgencyID: '6',
                            schemeID: 'GTIN'
                          }
                        ]
                      }
                    ],
                    AdditionalItemProperty: [
                      {
                        Name: [
                          {
                            _: 'Paint type'
                          }
                        ],
                        Value: [
                          {
                            _: 'Acrylic'
                          }
                        ]
                      },
                      {
                        Name: [
                          {
                            _: 'Solvant'
                          }
                        ],
                        Value: [
                          {
                            _: 'Water'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            Note: [
              {
                _: 'Freetext note on line 2'
              }
            ],
            LineItem: [
              {
                ID: [
                  {
                    _: '2'
                  }
                ],
                Quantity: [
                  {
                    _: 15,
                    unitCode: 'C62'
                  }
                ],
                LineExtensionAmount: [
                  {
                    _: 225,
                    currencyID: 'SEK'
                  }
                ],
                TotalTaxAmount: [
                  {
                    _: 10,
                    currencyID: 'SEK'
                  }
                ],
                PartialDeliveryIndicator: [
                  {
                    _: false
                  }
                ],
                AccountingCostCode: [
                  {
                    _: 'ProjectID123'
                  }
                ],
                Delivery: [
                  {
                    RequestedDeliveryPeriod: [
                      {
                        StartDate: [
                          {
                            _: '2010-02-10'
                          }
                        ],
                        EndDate: [
                          {
                            _: '2010-02-25'
                          }
                        ]
                      }
                    ]
                  }
                ],
                OriginatorParty: [
                  {
                    PartyIdentification: [
                      {
                        ID: [
                          {
                            _: 'EmployeeXXX',
                            schemeAgencyID: 'ZZZ',
                            schemeID: 'ZZZ'
                          }
                        ]
                      }
                    ],
                    PartyName: [
                      {
                        Name: [
                          {
                            _: 'Josef K.'
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
                        _: 15,
                        currencyID: 'SEK'
                      }
                    ],
                    BaseQuantity: [
                      {
                        _: 1,
                        unitCode: 'C62'
                      }
                    ]
                  }
                ],
                Item: [
                  {
                    Description: [
                      {
                        _: 'Very good pencils for red paint.'
                      }
                    ],
                    Name: [
                      {
                        _: 'Pensel 20 mm'
                      }
                    ],
                    SellersItemIdentification: [
                      {
                        ID: [
                          {
                            _: 'SItemNo011'
                          }
                        ]
                      }
                    ],
                    StandardItemIdentification: [
                      {
                        ID: [
                          {
                            _: '123452340123',
                            schemeAgencyID: '6',
                            schemeID: 'GTIN'
                          }
                        ]
                      }
                    ],
                    AdditionalItemProperty: [
                      {
                        Name: [
                          {
                            _: 'Hair color'
                          }
                        ],
                        Value: [
                          {
                            _: 'Black'
                          }
                        ]
                      },
                      {
                        Name: [
                          {
                            _: 'Width'
                          }
                        ],
                        Value: [
                          {
                            _: '20mm'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

const trivialOrderUBLJsonWithoutPartyLegalEntity = () => ({
  _D: 'urn:oasis:names:specification:ubl:schema:xsd:Order-2',
  _A: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
  _B: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  Order: [
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
      DueDate: [
        {
          _: '2017-12-01'
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
      OrderLine: [
        {
          ID: [
            {
              _: '1'
            }
          ],
          Quantity: [
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
          Quantity: [
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

const modifiedOrderUBLJson = (partyLegalEntityCompanyId) => ({
  _D: 'urn:oasis:names:specification:ubl:schema:xsd:Order-2',
  _A: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
  _B: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  Order: [
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
      DueDate: [
        {
          _: '2017-12-01'
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
      OrderLine: [
        {
          ID: [
            {
              _: '1'
            }
          ],
          Quantity: [
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
          Quantity: [
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

const orderUBLJson = (partyLegalEntityCompanyId) => ({
  _D: 'urn:oasis:names:specification:ubl:schema:xsd:Order-2',
  _A: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
  _B: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  Order: [
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
      DueDate: [
        {
          _: '2017-12-01'
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
      OrderLine: [
        {
          ID: [
            {
              _: '1'
            }
          ],
          Quantity: [
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
          Quantity: [
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

const invalidUBLJson = () => ({
  _D: 'urn:oasis:names:specification:ubl:schema:xsd:Order-2',
  _A: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
  _B: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  Order: [{
    // "ID":[{"_":"123"}], No ID is invalid according to schema
    IssueDate: [{ _: '2011-09-22' }],
    ValidityPeriod: [{
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
    OrderLine: [{
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
  trivialOrderUBLJson,
  trivialOrderUBLJsonWithoutPartyLegalEntity,
  modifiedOrderUBLJson,
  orderUBLJson,
  invalidUBLJson
};
