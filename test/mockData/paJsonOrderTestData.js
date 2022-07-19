const paJsonWithOneAdditionalDocumentReference = (partyLegalEntityCompanyId, orderId = '2178804809') => (
  {
    Order: {
      $: {
        xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Order-2',
        'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
        'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
      },
      'cbc:CustomizationID': [
        {
          _: 'urn:fdc:peppol.eu:poacc:trns:order:3'
        }
      ],
      'cbc:ProfileID': [
        {
          _: 'urn:fdc:peppol.eu:poacc:bis:order_only:3'
        }
      ],
      'cbc:ID': [
        {
          _: orderId
        }
      ],
      'cbc:IssueDate': [
        {
          _: '2020-12-10'
        }
      ],
      'cbc:DocumentCurrencyCode': [
        {
          _: 'SEK'
        }
      ],
      'cac:ValidityPeriod': [
        {
          'cbc:EndDate': [
            {
              _: '2021-06-30'
            }
          ]
        }
      ],
      'cac:OriginatorDocumentReference': [
        {
          'cbc:ID': [
            {
              _: '5435235'
            }
          ]
        }
      ],
      'cac:Contract': [
        {
          'cbc:ID': [
            {
              _: 'AVT123'
            }
          ]
        }
      ],
      'cac:BuyerCustomerParty': [
        {
          'cac:Party': [
            {
              'cbc:EndpointID': [
                {
                  _: partyLegalEntityCompanyId,
                  $: {
                    schemeID: '0007'
                  }
                }
              ],
              'cac:PartyIdentification': [
                {
                  'cbc:ID': [
                    {
                      _: partyLegalEntityCompanyId,
                      $: {
                        schemeID: '0007'
                      }
                    }
                  ]
                }
              ],
              'cac:PartyName': [
                {
                  'cbc:Name': [
                    {
                      _: 'Arbetsförmedlingen'
                    }
                  ]
                }
              ],
              'cac:PostalAddress': [
                {
                  'cbc:StreetName': [
                    {
                      _: 'Gatan 1'
                    }
                  ],
                  'cbc:CityName': [
                    {
                      _: 'Stockholm'
                    }
                  ],
                  'cbc:PostalZone': [
                    {
                      _: '11399'
                    }
                  ],
                  'cac:AddressLine': [
                    {
                      'cbc:Line': [
                        {
                          _: 'Huvudkontoret'
                        }
                      ]
                    }
                  ],
                  'cac:Country': [
                    {
                      'cbc:IdentificationCode': [
                        {
                          _: 'SE'
                        }
                      ]
                    }
                  ]
                }
              ],
              'cac:PartyLegalEntity': [
                {
                  'cbc:RegistrationName': [
                    {
                      _: 'Arbetsförmedlingen'
                    }
                  ],
                  'cbc:CompanyID': [
                    {
                      _: partyLegalEntityCompanyId,
                      $: {
                        schemeID: '0007'
                      }
                    }
                  ]
                }
              ],
              'cac:Contact': [
                {
                  'cbc:Name': [
                    {
                      _: 'Christina Beställare'
                    }
                  ],
                  'cbc:ElectronicMail': [
                    {
                      _: 'christina.bestallare@arbetsformedlingen.com'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      'cac:SellerSupplierParty': [
        {
          'cac:Party': [
            {
              'cbc:EndpointID': [
                {
                  _: '14528798654',
                  $: {
                    schemeID: '0007'
                  }
                }
              ],
              'cac:PostalAddress': [
                {
                  'cbc:StreetName': [
                    {
                      _: 'Leverantörsgatan 1'
                    }
                  ],
                  'cbc:AdditionalStreetName': [
                    {
                      _: '11111'
                    }
                  ],
                  'cbc:CityName': [
                    {
                      _: 'Stockholm'
                    }
                  ],
                  'cac:Country': [
                    {
                      'cbc:IdentificationCode': [
                        {
                          _: 'SE'
                        }
                      ]
                    }
                  ]
                }
              ],
              'cac:PartyLegalEntity': [
                {
                  'cbc:RegistrationName': [
                    {
                      _: 'Leverantören AB'
                    }
                  ],
                  'cbc:CompanyID': [
                    {
                      _: partyLegalEntityCompanyId,
                      $: {
                        schemeID: '0007'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      'cac:AccountingCustomerParty': [
        {
          'cac:Party': [
            {
              'cac:PartyIdentification': [
                {
                  'cbc:ID': [
                    {
                      _: '3456789034',
                      $: {
                        schemeID: '0007'
                      }
                    }
                  ]
                }
              ],
              'cac:PostalAddress': [
                {
                  'cbc:StreetName': [
                    {
                      _: 'Skanningsgatan 1'
                    }
                  ],
                  'cbc:CityName': [
                    {
                      _: 'Stockholm'
                    }
                  ],
                  'cbc:PostalZone': [
                    {
                      _: '11111'
                    }
                  ],
                  'cac:AddressLine': [
                    {
                      'cbc:Line': [
                        {
                          _: 'Huvudkontoret'
                        }
                      ]
                    }
                  ],
                  'cac:Country': [
                    {
                      'cbc:IdentificationCode': [
                        {
                          _: 'SE'
                        }
                      ]
                    }
                  ]
                }
              ],
              'cac:PartyLegalEntity': [
                {
                  'cbc:RegistrationName': [
                    {
                      _: 'Arbetsförmedlingen'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      'cac:Delivery': [
        {
          'cac:DeliveryLocation': [
            {
              'cbc:ID': [
                {
                  _: '3456789034',
                  $: {
                    schemeID: '0007'
                  }
                }
              ],
              'cac:Address': [
                {
                  'cbc:StreetName': [
                    {
                      _: 'Manetstigen 388'
                    }
                  ],
                  'cbc:CityName': [
                    {
                      _: 'Onsala'
                    }
                  ],
                  'cbc:PostalZone': [
                    {
                      _: '43933'
                    }
                  ],
                  'cac:Country': [
                    {
                      'cbc:IdentificationCode': [
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
          'cac:RequestedDeliveryPeriod': [
            {
              'cbc:StartDate': [
                {
                  _: '2021-01-01'
                }
              ],
              'cbc:EndDate': [
                {
                  _: '2021-06-30'
                }
              ]
            }
          ],
          'cac:DeliveryParty': [
            {
              'cac:PartyIdentification': [
                {
                  'cbc:ID': [
                    {
                      _: '3456789034',
                      $: {
                        schemeID: '0007'
                      }
                    }
                  ]
                }
              ],
              'cac:PartyName': [
                {
                  'cbc:Name': [
                    {
                      _: 'Filialen 1'
                    }
                  ]
                }
              ]
            }
          ],
          'cac:Shipment': [
            {
              'cbc:ID': [
                {
                  _: 'NA'
                }
              ],
              'cac:TransportHandlingUnit': [
                {
                  'cbc:ShippingMarks': [
                    {
                      _: 'Genomförandereferens_123'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      'cac:AnticipatedMonetaryTotal': [
        {
          'cbc:LineExtensionAmount': [
            {
              _: '11590.00',
              $: {
                currencyID: 'SEK'
              }
            }
          ],
          'cbc:PayableAmount': [
            {
              _: '11590.00',
              $: {
                currencyID: 'SEK'
              }
            }
          ]
        }
      ],
      'cac:OrderLine': [
        {
          'cac:LineItem': [
            {
              'cbc:ID': [
                {
                  _: '001'
                }
              ],
              'cbc:Quantity': [
                {
                  _: '19.00',
                  $: {
                    unitCode: 'DAY'
                  }
                }
              ],
              'cbc:LineExtensionAmount': [
                {
                  _: '1805.00',
                  $: {
                    currencyID: 'SEK'
                  }
                }
              ],
              'cac:Delivery': [
                {
                  'cac:RequestedDeliveryPeriod': [
                    {
                      'cbc:StartDate': [
                        {
                          _: '2021-01-01'
                        }
                      ],
                      'cbc:EndDate': [
                        {
                          _: '2021-01-31'
                        }
                      ]
                    }
                  ]
                }
              ],
              'cac:Price': [
                {
                  'cbc:PriceAmount': [
                    {
                      _: '95.00',
                      $: {
                        currencyID: 'SEK'
                      }
                    }
                  ]
                }
              ],
              'cac:Item': [
                {
                  'cbc:Name': [
                    {
                      _: 'Grundersättning'
                    }
                  ],
                  'cac:SellersItemIdentification': [
                    {
                      'cbc:ID': [
                        {
                          _: '166'
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
          'cac:LineItem': [
            {
              'cbc:ID': [
                {
                  _: '002'
                }
              ],
              'cbc:Quantity': [
                {
                  _: '20.00',
                  $: {
                    unitCode: 'DAY'
                  }
                }
              ],
              'cbc:LineExtensionAmount': [
                {
                  _: '1900.00',
                  $: {
                    currencyID: 'SEK'
                  }
                }
              ],
              'cac:Delivery': [
                {
                  'cac:RequestedDeliveryPeriod': [
                    {
                      'cbc:StartDate': [
                        {
                          _: '2021-02-01'
                        }
                      ],
                      'cbc:EndDate': [
                        {
                          _: '2021-02-28'
                        }
                      ]
                    }
                  ]
                }
              ],
              'cac:Price': [
                {
                  'cbc:PriceAmount': [
                    {
                      _: '95.00',
                      $: {
                        currencyID: 'SEK'
                      }
                    }
                  ]
                }
              ],
              'cac:Item': [
                {
                  'cbc:Name': [
                    {
                      _: 'Grundersättning'
                    }
                  ],
                  'cac:SellersItemIdentification': [
                    {
                      'cbc:ID': [
                        {
                          _: '166'
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
          'cac:LineItem': [
            {
              'cbc:ID': [
                {
                  _: '003'
                }
              ],
              'cbc:Quantity': [
                {
                  _: '21.00',
                  $: {
                    unitCode: 'DAY'
                  }
                }
              ],
              'cbc:LineExtensionAmount': [
                {
                  _: '1995.00',
                  $: {
                    currencyID: 'SEK'
                  }
                }
              ],
              'cac:Delivery': [
                {
                  'cac:RequestedDeliveryPeriod': [
                    {
                      'cbc:StartDate': [
                        {
                          _: '2021-03-01'
                        }
                      ],
                      'cbc:EndDate': [
                        {
                          _: '2021-03-31'
                        }
                      ]
                    }
                  ]
                }
              ],
              'cac:Price': [
                {
                  'cbc:PriceAmount': [
                    {
                      _: '95.00',
                      $: {
                        currencyID: 'SEK'
                      }
                    }
                  ]
                }
              ],
              'cac:Item': [
                {
                  'cbc:Name': [
                    {
                      _: 'Grundersättning'
                    }
                  ],
                  'cac:SellersItemIdentification': [
                    {
                      'cbc:ID': [
                        {
                          _: '166'
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
          'cac:LineItem': [
            {
              'cbc:ID': [
                {
                  _: '004'
                }
              ],
              'cbc:Quantity': [
                {
                  _: '22.00',
                  $: {
                    unitCode: 'DAY'
                  }
                }
              ],
              'cbc:LineExtensionAmount': [
                {
                  _: '2090.00',
                  $: {
                    currencyID: 'SEK'
                  }
                }
              ],
              'cac:Delivery': [
                {
                  'cac:RequestedDeliveryPeriod': [
                    {
                      'cbc:StartDate': [
                        {
                          _: '2021-04-01'
                        }
                      ],
                      'cbc:EndDate': [
                        {
                          _: '2021-04-30'
                        }
                      ]
                    }
                  ]
                }
              ],
              'cac:Price': [
                {
                  'cbc:PriceAmount': [
                    {
                      _: '95.00',
                      $: {
                        currencyID: 'SEK'
                      }
                    }
                  ]
                }
              ],
              'cac:Item': [
                {
                  'cbc:Name': [
                    {
                      _: 'Grundersättning'
                    }
                  ],
                  'cac:SellersItemIdentification': [
                    {
                      'cbc:ID': [
                        {
                          _: '166'
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
          'cac:LineItem': [
            {
              'cbc:ID': [
                {
                  _: '005'
                }
              ],
              'cbc:Quantity': [
                {
                  _: '20.00',
                  $: {
                    unitCode: 'DAY'
                  }
                }
              ],
              'cbc:LineExtensionAmount': [
                {
                  _: '1900.00',
                  $: {
                    currencyID: 'SEK'
                  }
                }
              ],
              'cac:Delivery': [
                {
                  'cac:RequestedDeliveryPeriod': [
                    {
                      'cbc:StartDate': [
                        {
                          _: '2021-05-01'
                        }
                      ],
                      'cbc:EndDate': [
                        {
                          _: '2021-05-31'
                        }
                      ]
                    }
                  ]
                }
              ],
              'cac:Price': [
                {
                  'cbc:PriceAmount': [
                    {
                      _: '95.00',
                      $: {
                        currencyID: 'SEK'
                      }
                    }
                  ]
                }
              ],
              'cac:Item': [
                {
                  'cbc:Name': [
                    {
                      _: 'Grundersättning'
                    }
                  ],
                  'cac:SellersItemIdentification': [
                    {
                      'cbc:ID': [
                        {
                          _: '166'
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
          'cac:LineItem': [
            {
              'cbc:ID': [
                {
                  _: '006'
                }
              ],
              'cbc:Quantity': [
                {
                  _: '20.00',
                  $: {
                    unitCode: 'DAY'
                  }
                }
              ],
              'cbc:LineExtensionAmount': [
                {
                  _: '1900.00',
                  $: {
                    currencyID: 'SEK'
                  }
                }
              ],
              'cac:Delivery': [
                {
                  'cac:RequestedDeliveryPeriod': [
                    {
                      'cbc:StartDate': [
                        {
                          _: '2021-06-01'
                        }
                      ],
                      'cbc:EndDate': [
                        {
                          _: '2021-06-30'
                        }
                      ]
                    }
                  ]
                }
              ],
              'cac:Price': [
                {
                  'cbc:PriceAmount': [
                    {
                      _: '95.00',
                      $: {
                        currencyID: 'SEK'
                      }
                    }
                  ]
                }
              ],
              'cac:Item': [
                {
                  'cbc:Name': [
                    {
                      _: 'Grundersättning'
                    }
                  ],
                  'cac:SellersItemIdentification': [
                    {
                      'cbc:ID': [
                        {
                          _: '166'
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
  });

module.exports = {
  paJsonWithOneAdditionalDocumentReference
};
