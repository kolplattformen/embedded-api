import * as moment from 'moment'
import { etjanst, newsItem, EtjanstResponse } from "./parse"
import { NewsItem } from "./types"

describe('parse', () => {
  let response: EtjanstResponse
  describe('etjanst', () => {
    beforeEach(() => {
      response = {
        Success: true,
        Error: null,
        Data: [
          {
            Name: 'Some name',
            Id: '42C3997E-D772-423F-9290-6FEEB3CB2DA7',
            SDSId: '786E3393-F044-4660-9105-B444DEB289AA',
            Status: 'GR',
            UserType: 'Student',
            SchoolId: 'DE2E1293-0F40-4B91-9D91-1E99355DC257',
            SchoolName: null,
            GroupId: null,
            GroupName: null,
            Classes: 'VHsidan_0495CABC-77DB-41D7-824B-8B4D63E50D15;Section_AD1BB3B2-C1EE-4DFE-8209-CB6D42CE23D7;Section_0E67D0BF-594C-4C1B-9291-E753926DCD40;VHsidan_1C94EC54-9798-401C-B973-2454246D95DA',
            isSameSDSId: false,
            ResultUnitId: null,
            ResultUnitName: null,
            UnitId: null,
            UnitName: null
          }
        ]
      }
    })
    it('returns data on success', () => {
      expect(etjanst(response)).toBeInstanceOf(Array)
    })
    it('throws error on Error', () => {
      response.Success = false
      response.Error = 'b0rk'
      expect(() => etjanst(response)).toThrowError('b0rk')
    })
    it('camelCases data keys', () => {
      const parsed = etjanst(response)
      expect(parsed[0].name).toEqual(response.Data[0].Name)
    })

    describe('news', () => {
      beforeEach(() => {
        response = {
          Success: true,
          Error: null,
          Data: {
            CurrentChild: null,
            NewsItems: [
              {
                NewsId: 'news id',
                SiteId: 'elevstockholm.sharepoint.com,27892ACC-BA2E-4DEC-97B8-25F7098C3BF6,A239466A-9A52-42FF-8A3F-D94C342F2700',
                NewsListId: '3EC323A1-EA16-4D24-84C8-DAA49E76F9F4',
                NewsItemId: 'elevstockholm.sharepoint.com,27892ACC-BA2E-4DEC-97B8-25F7098C3BF6,A239466A-9A52-42FF-8A3F-D94C342F2700_99',
                Header: 'Problemet med att se betyg i bild, slöjd och teknik löst!',
                PublicationDate: '/Date(1608304542000)/',
                PubDateSE: '18 december 2020 16:15',
                ModifiedDate: '/Date(1608304680000)/',
                ModDateSE: '18 december 2020 16:18',
                Source: 'Livets hårda skolklasser',
                Preamble: 'Hej,Nu är problemet löst! Alla betyg syns som de ska.God jul!...',
                BannerImageUrl: 'A703552D-DBF3-45B0-8E67-6E062105A0C5.jpeg',
                BannerImageGuid: 'A703552D-DBF3-45B0-8E67-6E062105A0C5',
                BannerImageListId: 'FFBE49E9-BDE1-4C75-BA0E-D98D4E2FCF21',
                Body: '<div><div data-sp-canvascontrol="" data-sp-canvasdataversion="1.0" data-sp-controldata="&#123;&quot;controlType&quot;&#58;4,&quot;id&quot;&#58;&quot;1212fc8d-dd6b-408a-8d5d-9f1cc787efbb&quot;,&quot;position&quot;&#58;&#123;&quot;controlIndex&quot;&#58;2,&quot;sectionIndex&quot;&#58;1,&quot;sectionFactor&quot;&#58;12,&quot;zoneIndex&quot;&#58;1,&quot;layoutIndex&quot;&#58;1&#125;,&quot;addedFromPersistedData&quot;&#58;true,&quot;emphasis&quot;&#58;&#123;&#125;&#125;"><div data-sp-rte=""><p>Hej,</p><p>Nu är problemet löst! Alla betyg syns som de ska.&#160;</p><p>God jul!</p></div></div><div data-sp-canvascontrol="" data-sp-canvasdataversion="1.0" data-sp-controldata="&#123;&quot;controlType&quot;&#58;0,&quot;pageSettingsSlice&quot;&#58;&#123;&quot;isDefaultDescription&quot;&#58;true,&quot;isDefaultThumbnail&quot;&#58;true&#125;&#125;"></div></div>',
                BodyNoHtml: null,
                AuthorDisplayName: 'Eva-Lotta Rönnberg',
                altText: 'Nyhetsbild. Bildtext ej tillgänglig.'
              },
            ],
            ViewGlobalTranslations: {},
            ViewLocalTranslations: {},
            Children: null,
            Status: null,
            GlobalTranslationIds: [
              'InformationalHeader',
              'ContactUsMessageLabel',
              'Send',
              'RequiredFieldMessageInfo',
              'Sex',
              'Male',
              'Female',
              'SSN',
              'FirstName',
              'LastName',
              'Email',
              'Zip',
              'Address',
              'ValidationRequiredFieldMessage',
              'ValidationErrorMessage'
            ],
            LocalTranslationIds: [ 'IndexPageHeading1' ]
          }
        }
      })
      it('parses news items (except body) correctly', () => {
        const [item]: [NewsItem] = etjanst(response).newsItems.map(newsItem)

        expect(item.id).toEqual('news id')
        expect(item.header).toEqual('Problemet med att se betyg i bild, slöjd och teknik löst!')
        expect(item.imageUrl).toEqual('A703552D-DBF3-45B0-8E67-6E062105A0C5.jpeg')
        expect(item.intro).toEqual('Hej,Nu är problemet löst! Alla betyg syns som de ska.God jul!...')
        expect(item.modified).toEqual(moment(new Date('18 december 2020 16:18')))
        expect(item.published).toEqual(moment(new Date('18 december 2020 16:15')))
      })
      it('parses body correctly', () => {
        const [item]: [NewsItem] = etjanst(response).newsItems.map(newsItem)

        const expected = 'Hej,  Nu är problemet löst! Alla betyg syns som de ska.  God jul!'
        const trimmed = (item.body || '').split('\n').map(t => t.trim()).join(' ')
        expect(trimmed).toEqual(expected)
      })
    })
  })
})
