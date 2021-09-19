# Hjärntorget
The below headings describe some endpoints that can be used to fetch information from Hjärntorget. In order to query and post to any of the endpoints described the user must already have a session with Hjärntorget. There is some documentation around accessible endpoints that return json at: https://hjarntorget.goteborg.se/api/

Note that the below is only really valid for a sample size of 1 school + 1 preschool. Other schools & preschools might have entierly different setups in how they send messages & updates to parents.

## Fetching the logged in user
Making a get request to `https://hjarntorget.goteborg.se/api/core/current-user` when logged in gets information about the logged in user.

```json
{
    "id": "303030_goteborgsstad",
    "firstName": "NYARLATHOTEP",
    "lastName": "CRAWLING CHAOS",
    "email": "nyarlathotep@example.com",
    "online": true,
    "imagePath": "/pp/lookAndFeel/skins/hjarntorget/icons/monalisa_large.png",
    "extraInfoInCatalog": ""
}
```

## Fetching which school children belong to a guardian
The api enpoint `https://hjarntorget.goteborg.se/api/person/children` can be used to fetched the logged in user's children. The response looks like:

```json
[
    {
        "id": "444444_goteborgsstad",
        "firstName": "Tawil",
        "lastName": "at'Umr",
        "email": "tawil9999@skola.goteborg.se",
        "online": false,
        "imagePath": "/pp/lookAndFeel/skins/hjarntorget/icons/monalisa_large.png",
        "extraInfoInCatalog": ""
    },
    {
        "id": "333333_goteborgsstad",
        "firstName": "Yog",
        "lastName": "Sothoth",
        "email": "yogsot9999@skola.goteborg.se",
        "online": false,
        "imagePath": "/pp/lookAndFeel/skins/hjarntorget/icons/monalisa_large.png",
        "extraInfoInCatalog": ""
    },
    {
        "id": "222222_goteborgsstad",
        "firstName": "Tsaggothua",
        "lastName": "",
        "email": "tsa9999@skola.goteborg.se",
        "online": false,
        "imagePath": "/pp/lookAndFeel/skins/hjarntorget/icons/monalisa_large.png",
        "extraInfoInCatalog": ""
    }
]
```

Some notes on the responses, the `id` field for children seem to end with `_goteborgsstad`. The email field seem to be constructed with first three letters of first and last name along with month and day of birth.

### Parsing children info from portlet response
Ab alternate approach would be to get the school children for a guardian by sending a GET request to `https://hjarntorget.goteborg.se/portletMyChildren.do`. Then parse the response, but the json API seems a log cleaner!

## PIM messages
So called PIM messages (usually from teachers to guardians) can be fetched with a GET request to `https://hjarntorget.goteborg.se/api/wall/events?language=en&limit=50`. The `language` parameter changes the title of some messages, but seems to be mostly irrelevant otherwise. Notably is that most messages seem to be directed directly to parents. As such it is a bit hard to sort them to only the relevant children. The current implementation in apiGbg.ts tries to sort out which child a message "belongs to" by checking if the creator of the message is a member of any "event" that the child is also a member of. However, some messages seems to be sent by system users (see last message in sample response below). I could add some scanning for the name of the event to see if it is in the message... feels a bit hacky though :/

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
        "id": 44444444,
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
    }, {
        "id": 32089609,
        "type": "PIM_SENT",
        "intId": 26966589,
        "eventId": null,
        "eventName": null,
        "created": {
            "ts": 1630216831211,
            "timezoneOffsetMinutes": 120
        },
        "creator": {
            "id": "__system$virtual$calendar__",
            "firstName": "Kalendern",
            "lastName": "i PING PONG",
            "email": null,
            "online": false,
            "imagePath": "/pp/lookAndFeel/skins/default/icons/monalisa_large.png",
            "extraInfoInCatalog": ""
        },
        "title": "PIM from PING PONG",
        "body": "Alarm från kalendern!\n\n2021-08-30 08.00\nFrån kalender: 138JÄTS Provschema år 7\nLäxa engelska\n\n\nVarje vecka har vi engelskaläxa, denna är alltid till måndag.\r\n\r\nDessa finns alltid i engelskans google classroom.",
        "attribute1": "Kalendern i PING PONG",
        "attribute2": null,
        "url": "https://hjarntorget.goteborg.se/pimShowInboxMessage.do?id=26966589&linkOrigin=wall",
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
Attendance for a child on a particular day can be fetched throught the API: `https://hjarntorget.goteborg.se/api/#attendancextodays-absence-for-person_header?person=333333_goteborgsstad&dateIso=2021-09-03&language=en`

```json
{
    "attendee": {
        "id": "333333_goteborgsstad",
        "firstName": "Yog",
        "lastName": "Sothoth",
        "email": "yogsot9999@skola.goteborg.se",
        "online": false,
        "imagePath": "/pp/lookAndFeel/skins/hjarntorget/icons/monalisa_large.png",
        "extraInfoInCatalog": ""
    },
    "events": [
        {
            "id": "35900007:1",
            "attendee": null,
            "recordId": 313000041,
            "totalAbsence": 65,
            "eventLength": 65,
            "legalGuardianContacted": false,
            "shouldBeContacted": true,
            "createdBy": {
                "id": "000000_goteborgsstad",
                "firstName": "Cthulhu",
                "lastName": "Macula",
                "email": "cthulhu.macula@grundskola.goteborg.se",
                "online": false,
                "imagePath": "/pp/lookAndFeel/skins/hjarntorget/icons/monalisa_large.png",
                "extraInfoInCatalog": ""
            },
            "created": {
                "ts": 1630663971234,
                "timezoneOffsetMinutes": 120
            },
            "statuses": [
                {
                    "left": 0,
                    "width": 100,
                    "status": "Unnotified absence",
                    "attendance": 65,
                    "color": "#f00"
                }
            ],
            "archivedStatuses": [],
            "emailNotifications": [],
            "smsNotifications": [],
            "manualNotifications": [],
            "lesson": {
                "id": "35900007:1",
                "title": "SV",
                "location": "A402",
                "calendars": [
                    "111ABCD 21/22 8B/SVSVA"
                ],
                "startDate": {
                    "ts": 1630660200000,
                    "timezoneOffsetMinutes": 120
                },
                "endDate": {
                    "ts": 1630664100000,
                    "timezoneOffsetMinutes": 120
                },
                "ownPlannings": null,
                "teacherPlannings": null,
                "teacherAndStudentPlannings": null,
                "ownGeneralPlannings": null,
                "teacherGeneralPlannings": null,
                "teacherAndStudentGeneralPlannings": null,
                "bookedResourceNames": [],
                "bookedTeacherNames": [
                    "Cthulhu Macula (CTM)"
                ],
                "hasTest": false,
                "hasHomework": false,
                "hasAssignment": false,
                "url": null,
                "note": ""
            }
        }
    ],
    "canRegisterAbscence": true,
    "useSmsForAttendance": true,
    "haslegalGuardian": true,
    "showWarning": true
}
```

Abscences can be reported by posting to: `https://hjarntorget.goteborg.se/attendanceParentSubmitAbsence.do`

with the body:
```
attendeeId=333333_goteborgsstad&statusId=500000080&_submit=Spara&startTimeString=2021-09-03+08%3A00&endTimeString=2021-09-03+16%3A00
```

Not entierly sure what the `statusId` is for.


or by posting to `https://hjarntorget.goteborg.se/api/attendance/register-absence`

providing these parameters. (Haven't tested it though)
    language : String
    forUser : String
    reason : int
    startTime : String
    stopTime : String
    role : 'STUDENT' | 'MENTOR' | 'PARENT'


## Class mates
There does not seem to be any listing of class mates accessible. Each student is associated to different "events" in Hjärntorget. It is possible to get the events a parent is part of loop over them and then fetch the students for each of those and just pick the lists where a particular child belongs.


## Schedule
There are some API endpoints for fetching a the schedule for a child. E.g. `https://hjarntorget.goteborg.se/api/schema/lessons`


## Information messages 
There are some non-PIM messages that are also shown on Hjärntorget. 

The messages can be fetched in a json format by sending a get request to `https://hjarntorget.goteborg.se/api/information/messages-by-date-desc?messageStatus=ALL&offset=0&limit=795&language=en`. Message status can be one of `'ARCHIVED' | 'CURRENT' | 'ALL'`. Note that the body is a string containing html so will likely need to be decoded in some way.

```json
[
    {
        "id": 3276034,
        "title": "Nu får du och ditt barn tillgång till Polyglutt hemma",
        "body": "<p><strong>Nu f&aring;r alla barn som g&aring;r i kommunal f&ouml;rskola i G&ouml;teborg tillg&aring;ng till bilderboksappen Polyglutt hemifr&aring;n! Det inneb&auml;r att du som v&aring;rdnadshavare och barn kan ta del av ett bibliotek av b&ouml;cker p&aring; b&aring;de svenska och 60 andra spr&aring;k, inklusive TAKK och teckenspr&aring;k via telefon eller l&auml;splatta.<\/strong><\/p>\r\n<p>Polyglutt &auml;r en app med bilderb&ouml;cker som fungerar som ett verktyg f&ouml;r att arbeta med spr&aring;kutveckling och litteratur i f&ouml;rskolan och hemma.<\/p>\r\n<p>Polyglutt Home Access &auml;r en tj&auml;nst som inneb&auml;r att alla barn som g&aring;r i kommunal f&ouml;rskola i G&ouml;teborg f&aring;r tillg&aring;ng till ett bibliotek av b&ouml;cker p&aring; b&aring;de svenska och 60 andra spr&aring;k, inklusive TAKK och teckenspr&aring;k hemifr&aring;n. Varje f&ouml;rskola kan ocks&aring; skapa egna bokhyllor med boktips i appen som du och ditt barn kan l&auml;sa hemma.<\/p>\r\n<p>Tj&auml;nsten fungerar p&aring; iPad, Androidplattor och i mobilen.<\/p>\r\n<p>Vill du veta mer om tj&auml;nsten, kontakta pedagogerna p&aring; ditt barns f&ouml;rskola.<\/p>",
        "creator": {
            "id": "501747_goteborgsstad",
            "firstName": "Information Digitalisering",
            "lastName": "Innovation",
            "email": "information.digitaliseringochinnovation@forskola.goteborg.se",
            "online": false,
            "imagePath": "/pp/lookAndFeel/skins/hjarntorget/icons/monalisa_large.png",
            "extraInfoInCatalog": ""
        },
        "recipientGroups": [
            {
                "id": 1121821,
                "name": "DL Göteborg Vhavare förskolor"
            }
        ],
        "created": {
            "ts": 1629970713111,
            "timezoneOffsetMinutes": 120
        },
        "attachments": [],
        "readByUser": true,
        "archivedByUser": false
    },
    {
        "id": 3270718,
        "title": "Information från grundskoleförvaltningen",
        "body": "<p>Till v&aring;rdnadshavare med barn p&aring; G&ouml;teborgs Stads grundskolor och grunds&auml;rskolor.<\/p>\r\n<p>Spridningen av covid-19 har &ouml;kat. D&auml;rf&ouml;r &auml;r det viktigt att alla hj&auml;lper till att minska spridningen av smitta.<\/p>\r\n<h2>Vi forts&auml;tter h&aring;lla avst&aring;nd<\/h2>\r\n<ul>\r\n<li>Om du vill ha kontakt med n&aring;gon p&aring; ditt barns skola vill vi g&auml;rna att du ringer eller skickar e-post.<\/li>\r\n<li>L&auml;mna och h&auml;mta ditt barn utomhus p&aring; skolg&aring;rden.<\/li>\r\n<li>En del m&ouml;ten som skolan har kommer att vara digitala.<\/li>\r\n<li>Uppmuntra ditt barn att promenera till och fr&aring;n skolan f&ouml;r att minska tr&auml;ngseln i kollektivtrafiken.<\/li>\r\n<\/ul>\r\n<h2>Detta g&auml;ller n&auml;r ditt barn &auml;r sjukt<\/h2>\r\n<ul>\r\n<li>Barn som bara &auml;r lite sjuka, som till exempel &auml;r snuviga eller har ont i halsen, ska stanna hemma.<\/li>\r\n<li>Ber&auml;tta alltid f&ouml;r skolan om ditt barn har konstaterad covid-19.<\/li>\r\n<\/ul>\r\n<p><a href=\"https://goteborg.se/wps/wcm/connect/a515d17c-7078-4663-8493-d1900b78cfb3/Om+ditt+barn+%C3%A4r+sjukt+eller+borta+fr%C3%A5n+skolan_information+till+v%C3%A5rdnadshavare_uppdaterad+13+augusti+2021.pdf?MOD=AJPERES\">H&auml;r hittar du mer information om vad som g&auml;ller n&auml;r ditt barn &auml;r sjukt.<\/a><\/p>\r\n<h2>Om ditt barn har varit p&aring; resa utomlands<\/h2>\r\n<p>Folkh&auml;lsomyndigheten rekommenderar alla som har varit i l&auml;nder utanf&ouml;r Norden att ta ett test f&ouml;r covid-19 n&auml;r de kommer tillbaka Sverige. Detta g&auml;ller oavsett om man har symtom eller inte.<\/p>\r\n<p>L&auml;s mer p&aring; Krisinformation.se om vad som g&auml;ller f&ouml;r resor fr&aring;n olika l&auml;nder: <br /><a href=\"https://www.krisinformation.se/detta-kan-handa/handelser-och-storningar/20192/myndigheterna-om-det-nya-coronaviruset/reseinformation-med-anledning-av-det-nya-coronaviruset\">Utrikesresor och att vistas utomlands - Krisinformation.se<\/a><\/p>\r\n<h2>Undervisning p&aring; skolan<\/h2>\r\n<p>Fr&aring;n och med h&ouml;stterminen 2021 har alla skolor undervisning p&aring; plats i skolan. Detta g&auml;ller &auml;ven f&ouml;r &aring;rskurs 7-9.<\/p>\r\n<p>F&ouml;r f&ouml;rskoleklass till och med &aring;rskurs 9 finns det fortfarande m&ouml;jlighet att f&aring; undervisning p&aring; distans om:<\/p>\r\n<ul>\r\n<li>M&aring;nga av de som jobbar p&aring; skolan &auml;r fr&aring;nvarande p&aring; grund av covid-19 och det inte g&aring;r att ha undervisning i skolan.<\/li>\r\n<li>Det &auml;r stor spridningen av covid-19 bland elever och medarbetare.<\/li>\r\n<\/ul>\r\n<h2>Nytt test f&ouml;r covid-19 p&aring; skolorna<\/h2>\r\n<p>Inom kort b&ouml;rjar V&auml;stra G&ouml;talandsregionen med ett nytt test f&ouml;r covid-19 riktat mot elever. &nbsp;Om ditt barn har haft n&auml;ra kontakt med en person p&aring; skolan som har konstaterad covid-19 f&aring;r ni med ett paket hem med ett test.&nbsp;<\/p>\r\n<p>Du som v&aring;rdnadshavare hj&auml;lper ditt barn att ta testet. Testet l&auml;mnar du som v&aring;rdnadshavare sedan till en utvald v&aring;rdcentral.<\/p>\r\n<p>Om ditt barn ska ta ett test f&aring;r du mer information fr&aring;n ditt barns skola om hur testet g&aring;r till och vilken v&aring;rdcentral du ska l&auml;mna det till.<\/p>\r\n<h2>Kontakt<\/h2>\r\n<p>Har du fr&aring;gor eller funderingar kontaktar du ditt barns skola.<\/p>\r\n<p><a href=\"https://goteborg.se/wps/portal/press-och-media/aktuelltarkivet/aktuellt/18b9930e-d34c-4d6a-817a-c1b8e74e5f9f#Z7_42G01J41KGV2F0ALK2K1SN1M75\">L&auml;s mer om covid-19 och vad som g&auml;ller f&ouml;r grundskolef&ouml;rvaltningen.<\/a><\/p>\r\n<p>&nbsp;<\/p>",
        "creator": {
            "id": "486497_goteborgsstad",
            "firstName": "Grundskola",
            "lastName": "Informerar",
            "email": null,
            "online": false,
            "imagePath": "/pp/lookAndFeel/skins/hjarntorget/icons/monalisa_large.png",
            "extraInfoInCatalog": ""
        },
        "recipientGroups": [
            {
                "id": 4925595,
                "name": "DL Göteborg Grundskola Vhavare Alla"
            },
            {
                "id": 4525636,
                "name": "Grundskola - informationskonto"
            },
            {
                "id": 4925600,
                "name": "DL Göteborg Grundsärskola Vhavare Alla"
            }
        ],
        "created": {
            "ts": 1629096850743,
            "timezoneOffsetMinutes": 120
        },
        "attachments": [
            {
                "id": 67888219,
                "name": "Om ditt barn är sjukt eller borta från skolan_information till vårdnadshavare_uppdaterad 13 augusti 2021.pdf",
                "size": 70466
            }
        ],
        "readByUser": true,
        "archivedByUser": false
    },
    {
        "id": 2982365,
        "title": "Nya regler för skolplacering i förskoleklass och grundskola",
        "body": "<p>Grundskolen&auml;mnden har beslutat om nya regler f&ouml;r skolplacering i f&ouml;rskoleklass och grundskola. Reglerna ska st&auml;rka elevernas r&auml;tt till en skola n&auml;ra hemmet och b&ouml;rjar g&auml;lla 1 januari 2021.<\/p>\r\n<p>Du kan l&auml;sa mer p&aring; sidan <a href=\"https://goteborg.se/wps/portal/press-och-media/aktuelltarkivet/aktuellt/e45ce367-4d46-48b4-936d-900a3e45e490\">Nya regler f&ouml;r skolplacering i f&ouml;rskoleklass och grundskola<\/a>.&nbsp;<\/p>\r\n<p>Om du har fr&aring;gor kan du kontakta grundskolef&ouml;rvaltningen p&aring; telefon: 031-365 09 60 eller e-post:&nbsp;<a href=\"mailto:grundskola@grundskola.goteborg.se\">grundskola@grundskola.goteborg.se<\/a>.&nbsp;<\/p>\r\n<p><em>Observera att detta meddelande inte g&aring;r att svara p&aring;.&nbsp;<\/em><\/p>\r\n<p>&nbsp;<\/p>",
        "creator": {
            "id": "486497_goteborgsstad",
            "firstName": "Grundskola",
            "lastName": "Informerar",
            "email": null,
            "online": false,
            "imagePath": "/pp/lookAndFeel/skins/hjarntorget/icons/monalisa_large.png",
            "extraInfoInCatalog": ""
        },
        "recipientGroups": [
            {
                "id": 4925595,
                "name": "DL Göteborg Grundskola Vhavare Alla"
            },
            {
                "id": 4525636,
                "name": "Grundskola - informationskonto"
            }
        ],
        "created": {
            "ts": 1603974943027,
            "timezoneOffsetMinutes": 60
        },
        "attachments": [],
        "readByUser": true,
        "archivedByUser": true
    }
]
```

To mark a message as read a post to e.g. `https://hjarntorget.goteborg.se/api/information/set-message-read?messageId=3276034` where message id is one of the messagesIds above. 