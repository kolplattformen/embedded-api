# Hjärntorget
The below headings describe some endpoints that can be used to fetch information from Hjärntorget. In order to query and post to any of the endpoints described the user must already have a session with Hjärntorget.

## Fetching which school children belong to a guardian
The school children that a guardian can get info about can be found by sending a GET request to `https://hjarntorget.goteborg.se/portletMyChildren.do`. The below is a formatted response for that request (1 for a preschool kid, 2 for grundskolan)

```html
<h4>
    <img src='/viewUserImage.do?id=444444_goteborgsstad' alt="Tawil at'Umr" width='24' height='32' class='user-image float-right'/>
    Tawil at'Umr
</h4>
<ul class="myChildrenLinks">
    <li class="clearfix">
                <a href="/documentationLogBookAsParent.do?userid=444444_goteborgsstad"><div class="title">Dokumentationsloggböcker</div>
                    <div class="description">Du har inga olästa inlägg.</div></a>
    </li>
</ul>
    <hr class="separator" />
<h4>
    <img src='/viewUserImage.do?id=333333_goteborgsstad' alt="Yog Sothoth" width='24' height='32' class='user-image float-right'/>
    Yog Sothoth
</h4>
<ul class="myChildrenLinks">
    <li class="clearfix">
                <a href="/personalMyChildContacts.do?userid=333333_goteborgsstad"><div class="title">Kontaktuppgifter</div>
                    <div class="description">Här visas mentorns kontaktuppgifter. </div></a>
    </li>
    <li class="clearfix">
                <a href="/loa3/parentPMN.do?userid=333333_goteborgsstad&amp;role=PARENT"><div class="title">Dokument inför utvecklingssamtal</div>
                    <div class="description">Här ser du barnets dokument</div></a>
    </li>
    <li class="extra-info clearfix">
        <a href="javascript:EC_doExpandCollaps('extraInfo333333_goteborgsstad2', '/pp/lookAndFeel/skins/hjarntorget/icons/minimized.png', '/pp/lookAndFeel/skins/hjarntorget/icons/expanded.png');" title="" class="expand-collapse font-normal"><img src="/pp/lookAndFeel/skins/hjarntorget/icons/minimized.png" id="extraInfo333333_goteborgsstad2-img" alt="No Title"/>Mer information</a>
<div id="extraInfo333333_goteborgsstad2" class="hide expandCollaps" >
                <p>Visa det <a href='/loa3/previousPMN.do?userid=333333_goteborgsstad&amp;role=PARENT'>senast avslutade dokumentet</a>.</p><p>Det finns inget aktuellt dokument för ditt barn Yog Sothoth.</p>Det finns 5 dokument i <a href='pmnParentArchive.do?userid=333333_goteborgsstad&amp;role=PARENT'>arkivet</a>
                <hr />
</div>
    </li>
    <li class="clearfix">
                <a href="/schema.do?userid=333333_goteborgsstad"><div class="title">Schemat</div>
                    <div class="description">Det finns 6 händelser i dag och 7 på måndag.</div></a>
    </li>
    <li class="clearfix">
                <a href="/loa3/assessmentMatrixMyChildren.do?userid=333333_goteborgsstad&amp;mode=parent"><div class="title">Bedömningsmatriser</div>
                    <div class="description">Inga ändringar har gjorts de senaste 14 dagarna.</div></a>
    </li>
    <li class="clearfix">
                <a href="/attendanceStudentHistory.do"><div class="title">Gå till närvarohantering</div>
                    <div class="description">Yog Sothoth har frånvaro registrerad på 15 lektioner denna termin, den senaste 2021-08-24 12:55.</div></a>
    </li>
</ul>
    <hr class="separator" />
<h4>
    <img src='/viewUserImage.do?id=222222_goteborgsstad' alt="Tsaggothua" width='24' height='32' class='user-image float-right'/>
    Tsaggothua
</h4>
<ul class="myChildrenLinks">
    <li class="clearfix">
                <a href="/personalMyChildContacts.do?userid=222222_goteborgsstad"><div class="title">Kontaktuppgifter</div>
                    <div class="description">Här visas mentorns kontaktuppgifter. </div></a>
    </li>
    <li class="clearfix">
                <a href="/loa3/parentPMN.do?userid=222222_goteborgsstad&amp;role=PARENT"><div class="title">Dokument inför utvecklingssamtal</div>
                    <div class="description">Här ser du barnets dokument</div></a>
    </li>
    <li class="extra-info clearfix">
        <a href="javascript:EC_doExpandCollaps('extraInfo222222_goteborgsstad2', '/pp/lookAndFeel/skins/hjarntorget/icons/minimized.png', '/pp/lookAndFeel/skins/hjarntorget/icons/expanded.png');" title="" class="expand-collapse font-normal"><img src="/pp/lookAndFeel/skins/hjarntorget/icons/minimized.png" id="extraInfo222222_goteborgsstad2-img" alt="No Title"/>Mer information</a>
<div id="extraInfo222222_goteborgsstad2" class="hide expandCollaps" >
                <p>Visa det <a href='/loa3/previousPMN.do?userid=222222_goteborgsstad&amp;role=PARENT'>senast avslutade dokumentet</a>.</p><p>Det finns inget aktuellt dokument för ditt barn Tsaggothua.</p>Det finns 9 dokument i <a href='pmnParentArchive.do?userid=222222_goteborgsstad&amp;role=PARENT'>arkivet</a>
                <hr />
</div>
    </li>
    <li class="clearfix">
                <a href="/schema.do?userid=222222_goteborgsstad"><div class="title">Schemat</div>
                    <div class="description">Det finns 3 händelser i dag och 6 på måndag.</div></a>
    </li>
    <li class="clearfix">
                <a href="/loa3/assessmentMatrixMyChildren.do?userid=222222_goteborgsstad&amp;mode=parent"><div class="title">Bedömningsmatriser</div>
                    <div class="description">Inga ändringar har gjorts de senaste 14 dagarna.</div></a>
    </li>
    <li class="clearfix">
                <a href="/attendanceStudentHistory.do"><div class="title">Gå till närvarohantering</div>
                    <div class="description">Tsaggothua har frånvaro registrerad på 9 lektioner denna termin, den senaste 2021-09-03 11:10.</div></a>
    </li>
</ul>
```

## PIM messages
So called PIM messages (usually from teachers to guardians) can be fetched with a GET request to `https://hjarntorget.goteborg.se/api/wall/events?language=en&limit=50`. The `language` parameter changes the title of some messages, but seems to be mostly irrelevant otherwise. 

Response (formatted for clarity and cut down to four different messages):
```json
[
    {
        "id": 33333333,
        "type": "PIM_SENT",
        "intId": 88888888,
        "eventId": null,
        "eventName": null,
        "created": {
            "ts": 1630655567726,
            "timezoneOffsetMinutes": 120
        },
        "creator": {
            "id": "000000_goteborgsstad",
            "firstName": "Cthulhu",
            "lastName": "Macula",
            "email": "cthulhu.macula@grundskola.goteborg.se",
            "online": false,
            "imagePath": "/pp/lookAndFeel/skins/hjarntorget/icons/an_image.png",
            "extraInfoInCatalog": ""
        },
        "title": "PIM from PING PONG",
        "body": "Veckobrev åk 7 v.35 \n\nHej!\r\nÄnnu en vecka har gått, och vi har börjat komma igång med skolarbetet på riktigt. ...",
        "attribute1": "Cthulhu Macula",
        "attribute2": null,
        "url": "https://hjarntorget.goteborg.se/pimShowInboxMessage.do?id=88888888&linkOrigin=wall",
        "onclick": null,
        "anonymous": false,
        "images": [],
        "videos": [],
        "unread": false
    },
    {
        "id": 22222222,
        "type": "PIM_SENT",
        "intId": 99999999,
        "eventId": null,
        "eventName": null,
        "created": {
            "ts": 1630653645496,
            "timezoneOffsetMinutes": 120
        },
        "creator": {
            "id": "000001_goteborgsstad",
            "firstName": "Wilbur",
            "lastName": "Whateley",
            "email": "wilbur.whateley@grundskola.goteborg.se",
            "online": false,
            "imagePath": "/viewUserImage.do?id=000001_goteborgsstad&ts=1263325456337",
            "extraInfoInCatalog": ""
        },
        "title": "PIM from PING PONG",
        "body": " Veckoinformation för v.36.\n\nHej!\r\nVad kul att så många kunde vara med på föräldramötet ...",
        "attribute1": "Wilbur Whateley",
        "attribute2": null,
        "url": "https://hjarntorget.goteborg.se/pimShowInboxMessage.do?id=99999999&linkOrigin=wall",
        "onclick": null,
        "anonymous": false,
        "images": [],
        "videos": [],
        "unread": false
    },
    {
        "id": 33333333,
        "type": "INFORMATION_MESSAGE_CREATED",
        "intId": 7777777,
        "eventId": null,
        "eventName": null,
        "created": {
            "ts": 1630404000000,
            "timezoneOffsetMinutes": 120
        },
        "creator": {
            "id": "555555_goteborgsstad",
            "firstName": "Information Digitalisering",
            "lastName": "Innovation",
            "email": "information.digitaliseringochinnovation@forskola.goteborg.se",
            "online": false,
            "imagePath": "/pp/lookAndFeel/skins/hjarntorget/icons/monalisa_large.png",
            "extraInfoInCatalog": ""
        },
        "title": "Information",
        "body": "Nu får du och ditt barn tillgång till Polyglutt hemma",
        "attribute1": null,
        "attribute2": null,
        "url": "https://hjarntorget.goteborg.se/entranceMessageShow.do?id=7777777&mode=myCurrent&linkOrigin=wall",
        "onclick": null,
        "anonymous": false,
        "images": [],
        "videos": [],
        "unread": false
    },
    {
        "id": 31968136,
        "type": "POLL_REMINDER",
        "intId": 44444444,
        "eventId": 111111,
        "eventName": "138JÄTS Provschema år 7",
        "created": {
            "ts": 1628769678022,
            "timezoneOffsetMinutes": 120
        },
        "creator": {
            "id": "666666_goteborgsstad",
            "firstName": "Azathoth",
            "lastName": "Svensson",
            "email": "azathoth.svensson@grundskola.goteborg.se",
            "online": false,
            "imagePath": "/viewUserImage.do?id=666666_goteborgsstad&ts=1557229396323",
            "extraInfoInCatalog": ""
        },
        "title": "Unfinished survey",
        "body": "Hjälp oss att bli bättre: Tittar du/ditt barn på NO- och matte-materialet på Hjärntorget? ....",
        "attribute1": null,
        "attribute2": null,
        "url": "https://hjarntorget.goteborg.se/courseId/111111/content.do?id=44444444&linkOrigin=wall",
        "onclick": null,
        "anonymous": false,
        "images": [],
        "videos": [],
        "unread": false
    }
]
```

Messages there can be marked as read by posting to:
`https://hjarntorget.goteborg.se/pimRemove.do`

with a body containing
```
action=markRead&tablePageSizepimInboxTable=100&id=88888888%3AINBOX
```

same endpoint can mark messages as unread (when `action=markUnread`)

It is also possible to send responses to some PIM messages and read the ones sent.

## Attendance management
Abscences can be reported by posting to: `https://hjarntorget.goteborg.se/attendanceParentSubmitAbsence.do`

with the body:
```
attendeeId=222222_goteborgsstad&statusId=50607080&_submit=Spara&startTimeString=2021-09-03+08%3A00&endTimeString=2021-09-03+16%3A00
```

## Class mates
There does not seem to be any listing of class mates accessible.

## Schedule
Posting to `https://hjarntorget.goteborg.se/schema.do?userid=222222_goteborgsstad` redirects to the schedule for the child with the given user id. The url will be something like `https://hjarntorget.goteborg.se/schema.do?handle=1616161616161` where the handle parameter likely indicates the schedule for the child. The response is a hard to parse weekly schedule. The best approach is likely to after the redirect manually follow it and add some parameters so that the request goes to `https://hjarntorget.goteborg.se/schema.do?date=2021-09-03&view=list&handle=1616161616161` where the `date` param is today's date. The response is more easily parsable than the default table based weekly schedule. Below are the relavant parts of the response (a lot of extra cruft is included in the whole response).

```html
<div class="tabPageContainer clearfix">
    <div class='cal-list-view'>
        <p>Här visas händelser från i dag och 12 månader framåt.</p>
        <h4>Fredag 3 september 2021</h4>
        <table>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">09.00-09.55</span></td>
                <td><span title="MA"> <span class="dynamic-data">MA</span></span>, <span title="B264"><span
                            class="dynamic-data">B264</span></span>, [KAN]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30906005:1&tile=true&handle=1616161616161&date=2021-09-03&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">11.10-12.15</span></td>
                <td><span title="SV"> <span class="dynamic-data">SV</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [TST]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30906005:1&tile=true&handle=1616161616161&date=2021-09-03&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">12.15-13.00</span></td>
                <td><span title="LUNCH"> <span class="dynamic-data">LUNCH</span></span>, <span title="-"><span
                            class="dynamic-data">-</span></span></td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30906005:1&tile=true&handle=1616161616161&date=2021-09-03&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
        </table>
        <h4>Måndag 6 september 2021</h4>
        <table>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">08.50-09.35</span></td>
                <td><span title="HKK"> <span class="dynamic-data">HKK</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [JSC]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30006005:1&tile=true&handle=1616161616161&date=2021-09-06&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">09.55-10.50</span></td>
                <td><span title="BL"> <span class="dynamic-data">BL</span></span>, <span title="B260"><span
                            class="dynamic-data">B260</span></span>, [JRU]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30006005:1&tile=true&handle=1616161616161&date=2021-09-06&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">11.00-12.10</span></td>
                <td><span title="IDH"> <span class="dynamic-data">IDH</span></span>, <span title="IDH Ute"><span
                            class="dynamic-data">IDH Ute</span></span>, [KTO]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30806007:1&tile=true&handle=1616161616161&date=2021-09-06&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">12.25-13.00</span></td>
                <td><span title="LUNCH"> <span class="dynamic-data">LUNCH</span></span>, <span title="-"><span
                            class="dynamic-data">-</span></span></td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30106005:1&tile=true&handle=1616161616161&date=2021-09-06&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">13.00-14.00</span></td>
                <td><span title="EN"> <span class="dynamic-data">EN</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [JEK]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30106005:1&tile=true&handle=1616161616161&date=2021-09-06&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">14.10-15.10</span></td>
                <td><span title="MA"> <span class="dynamic-data">MA</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [KAN]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30106005:1&tile=true&handle=1616161616161&date=2021-09-06&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
        </table>
        <h4>Tisdag 7 september 2021</h4>
        <table>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">08.10-08.40</span></td>
                <td><span title="EV"> <span class="dynamic-data">EV</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [KAN]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30106005:1&tile=true&handle=1616161616161&date=2021-09-07&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">08.40-08.55</span></td>
                <td><span title="MENT"> <span class="dynamic-data">MENT</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [KAN]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30206005:1&tile=true&handle=1616161616161&date=2021-09-07&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">09.00-09.50</span></td>
                <td><span title="EN"> <span class="dynamic-data">EN</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [JEK]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30206005:1&tile=true&handle=1616161616161&date=2021-09-07&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">11.20-12.20</span></td>
                <td><span title="SV"> <span class="dynamic-data">SV</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [TST]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30206005:1&tile=true&handle=1616161616161&date=2021-09-07&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">12.20-13.00</span></td>
                <td><span title="LUNCH"> <span class="dynamic-data">LUNCH</span></span>, <span title="-"><span
                            class="dynamic-data">-</span></span></td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30206005:1&tile=true&handle=1616161616161&date=2021-09-07&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">13.00-13.55</span></td>
                <td><span title="M2FRA"> <span class="dynamic-data">M2FRA</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [MFB]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30306005:1&tile=true&handle=1616161616161&date=2021-09-07&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
        </table>
        <h4>Onsdag 8 september 2021</h4>
        <table>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">08.55-09.35</span></td>
                <td><span title="SV"> <span class="dynamic-data">SV</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [TST]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30306005:1&tile=true&handle=1616161616161&date=2021-09-08&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">09.45-10.40</span></td>
                <td><span title="M2FRA"> <span class="dynamic-data">M2FRA</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [MFB]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30306005:1&tile=true&handle=1616161616161&date=2021-09-08&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">10.50-11.50</span></td>
                <td><span title="IDH"> <span class="dynamic-data">IDH</span></span>, <span title="GYMa, GYMb"><span
                            class="dynamic-data">GYMa, GYMb</span></span>, [KTO]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30806007:1&tile=true&handle=1616161616161&date=2021-09-08&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">12.15-13.00</span></td>
                <td><span title="LUNCH"> <span class="dynamic-data">LUNCH</span></span>, <span title="-"><span
                            class="dynamic-data">-</span></span></td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30406005:1&tile=true&handle=1616161616161&date=2021-09-08&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">13.00-14.05</span></td>
                <td><span title="MA"> <span class="dynamic-data">MA</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [KAN]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30406005:1&tile=true&handle=1616161616161&date=2021-09-08&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
        </table>
        <h4>Torsdag 9 september 2021</h4>
        <table>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">08.10-09.25</span></td>
                <td><span title="SL"> <span class="dynamic-data">SL</span></span>, <span title="B255"><span
                            class="dynamic-data">B255</span></span>, [BMO, JEJ]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30106007:1&tile=true&handle=1616161616161&date=2021-09-09&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">09.40-10.20</span></td>
                <td><span title="M2FRA"> <span class="dynamic-data">M2FRA</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [MFB]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30506005:1&tile=true&handle=1616161616161&date=2021-09-09&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">10.40-11.25</span></td>
                <td><span title="MU"> <span class="dynamic-data">MU</span></span>, <span title="B268"><span
                            class="dynamic-data">B268</span></span>, [MHE]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30506005:1&tile=true&handle=1616161616161&date=2021-09-09&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">11.30-12.20</span></td>
                <td><span title="MA"> <span class="dynamic-data">MA</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [KAN]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30506005:1&tile=true&handle=1616161616161&date=2021-09-09&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">12.20-13.00</span></td>
                <td><span title="LUNCH"> <span class="dynamic-data">LUNCH</span></span>, <span title="-"><span
                            class="dynamic-data">-</span></span></td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30506005:1&tile=true&handle=1616161616161&date=2021-09-09&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
        </table>
        <h4>Fredag 10 september 2021</h4>
        <table>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">09.00-09.55</span></td>
                <td><span title="MA"> <span class="dynamic-data">MA</span></span>, <span title="B264"><span
                            class="dynamic-data">B264</span></span>, [KAN]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30606005:1&tile=true&handle=1616161616161&date=2021-09-10&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">11.10-12.15</span></td>
                <td><span title="SV"> <span class="dynamic-data">SV</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [TST]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30606005:1&tile=true&handle=1616161616161&date=2021-09-10&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">12.15-13.00</span></td>
                <td><span title="LUNCH"> <span class="dynamic-data">LUNCH</span></span>, <span title="-"><span
                            class="dynamic-data">-</span></span></td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30706005:1&tile=true&handle=1616161616161&date=2021-09-10&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
        </table>
        
<!-- A bunch more days ... -->

        <h4>Onsdag 22 december 2021</h4>
        <table>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">08.55-09.35</span></td>
                <td><span title="SV"> <span class="dynamic-data">SV</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [TST]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30806007:1&tile=true&handle=1616161616161&date=2021-12-22&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">09.45-10.40</span></td>
                <td><span title="M2FRA"> <span class="dynamic-data">M2FRA</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [MFB]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30806007:1&tile=true&handle=1616161616161&date=2021-12-22&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">12.15-13.00</span></td>
                <td><span title="LUNCH"> <span class="dynamic-data">LUNCH</span></span>, <span title="-"><span
                            class="dynamic-data">-</span></span></td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30906007:1&tile=true&handle=1616161616161&date=2021-12-22&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
            <tr>
                <td class='time'><span class="date" style="white-space: nowrap;">13.00-14.05</span></td>
                <td><span title="MA"> <span class="dynamic-data">MA</span></span>, <span title="A402"><span
                            class="dynamic-data">A402</span></span>, [KAN]</td>
                <td class='link'><a href='#'
                        onclick="PP.util.Dialog.open({url: '/schemaEventView.do?eventId=30906007:1&tile=true&handle=1616161616161&date=2021-12-22&view=list', dimensions : {width: '600px', height: null} }); return false;">Visa</a>
                </td>
            </tr>
        </table>
    </div>
</div>
```

## Information messages 
There are some non-PIM messages that are also shown on Hjärntorget. A GET request to `https://hjarntorget.goteborg.se/entranceMessageList.do` once logged in will give the a HTML response with the below data being the most relevant. The links to `/entranceMessageShow.do` can be followed to show the actual text.

```html
<tbody id='entrance_tr'>
    <tr class="data-row odd default-table__row--foldable " id="entrance_tr_3200000">
        <td class="leftCell" data-column="Rubrik: "><a
                href="/entranceMessageShow.do?id=3200000&amp;mode=myCurrent&amp;tableSortByentrance=lastChanged"
                class="font-bold"><span class="formatting"><span class="dynamic-data">Nu får du och
                        ditt barn tillgång till Polyglutt hemma</span></span></a></td>
        <td data-column="Avsändare: "><a title="Skicka PIM till offline-användaren"
                href="/pimWritePopup.do?recipient=500000_goteborgsstad"
                onclick="popupPim('/pimWritePopup.do?recipient=500000_goteborgsstad','500000_goteborgsstad'); return false;"><img
                    style='vertical-align: top;' alt="Skicka PIM till offline-användaren" width="16"
                    height="16"
                    src="/pp/lookAndFeel/skins/hjarntorget/icons/pim_offline.png" /></a>&nbsp;<a
                class="popup-link" href="/personalDetailPopup.do?id=500000_goteborgsstad"
                onclick="popupPersonalDetail('500000_goteborgsstad'); return false;"
                title="Personlig sida för Information Digitalisering Innovation (information.digitaliseringochinnovation@forskola.goteborg.se)"><span
                    class="dynamic-data">Information Digitalisering Innovation</span></a></td>
        <td data-column="Senast ändrad: ">26 aug 2021 11:38</td>
    </tr>
    <tr class="data-row even default-table__row--foldable " id="entrance_tr_3200001">
        <td class="leftCell" data-column="Rubrik: "><a
                href="/entranceMessageShow.do?id=3200001&amp;mode=myCurrent&amp;tableSortByentrance=lastChanged"><span
                    class="formatting"><span class="dynamic-data">Information från
                        grundskoleförvaltningen</span></span></a></td>
        <td data-column="Avsändare: "><a title="Skicka PIM till offline-användaren"
                href="/pimWritePopup.do?recipient=400000_goteborgsstad"
                onclick="popupPim('/pimWritePopup.do?recipient=400000_goteborgsstad','400000_goteborgsstad'); return false;"><img
                    style='vertical-align: top;' alt="Skicka PIM till offline-användaren" width="16"
                    height="16"
                    src="/pp/lookAndFeel/skins/hjarntorget/icons/pim_offline.png" /></a>&nbsp;<a
                class="popup-link" href="/personalDetailPopup.do?id=400000_goteborgsstad"
                onclick="popupPersonalDetail('400000_goteborgsstad'); return false;"
                title="Personlig sida för Grundskola Informerar"><span
                    class="dynamic-data">Grundskola Informerar</span></a></td>
        <td data-column="Senast ändrad: ">16 aug 2021 08:54</td>
    </tr>
</tbody>
```

