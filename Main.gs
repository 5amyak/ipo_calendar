const IPO_JSON_URL = "https://groww.in/v1/api/stocks_ipo/v2/listing/user";
const ZERODHA_IPO_BID_URL = "https://console.zerodha.com/portfolio/ipo";
const CALENDAR_ID = "54c9sqpapr248kn4nm4t0r50ds@group.calendar.google.com";

const calendar = CalendarApp.getCalendarById(CALENDAR_ID);

function main() {
  let activeIpoListings = fetchIpoListings_('ACTIVE');
  let isAnyFailure = false;
  for (let activeIpoListing of activeIpoListings) {
    try {
      createIpoEvent_(activeIpoListing);
    } catch(e) {
      isAnyFailure = true;
      console.error('Unable to create IPO event due to :: ' + e + ' for :: ' + JSON.stringify(activeIpoListing));
    }
  }

  if (isAnyFailure) throw 'Unable to create IPO event for some listings';
}

function createIpoEvent_(ipoListing) {
  validateListing_(ipoListing);
  let ipoCompany = ipoListing['company'];
  let eventDate = new Date(ipoCompany['biddingEndDate']);
  let eventStartDate = (new Date(eventDate.setHours(10, 0, 0, 0)));
  let eventEndDate = (new Date(eventDate.setHours(16, 30, 0, 0)));

  if (!isIpoEventCreated_(ipoCompany, eventDate)) {
    let ipoEvent = calendar.createEvent(`${ipoCompany['growwShortName']} IPO`, eventStartDate, eventEndDate);
    ipoEvent.setColor(CalendarApp.EventColor.GRAY);
    ipoEvent.setLocation(ZERODHA_IPO_BID_URL);
    ipoEvent.setDescription(createDescription_(ipoCompany));
    ipoEvent.setTag('symbol', ipoCompany['symbol']);

    console.log('IPO event successfully created for :: ', ipoCompany['name']);
  } else {
    console.warn('IPO event already created for :: ', ipoCompany['name']);
  }
}

function fetchIpoListings_(status) {
  let ipoListings = [];
  let response = UrlFetchApp.fetch(IPO_JSON_URL);
  if (response.getResponseCode() === 200) {
    let ipoInfo = JSON.parse(response.getContentText());
    if ('ipoCompanyListingOrderMap' in ipoInfo && status in ipoInfo['ipoCompanyListingOrderMap'])
      ipoListings = ipoInfo['ipoCompanyListingOrderMap'][status];
    console.log(`Successfully fetched ${ipoListings.length} IPO listings with status ${status}`);
  } else {
    console.error(`Unable to fetch IPO listings with status ${status} due to response code ${response.getResponseCode()}`);
  }
  return ipoListings;
}

function isIpoEventCreated_(ipoCompany, eventDate) {
  let symbol = ipoCompany['symbol'];
  let events = calendar.getEventsForDay(eventDate);
  for (const event of events) {
    console.log(`Found event with name ${event.getTitle()} on ${eventDate}`)
    if (event.getTag('symbol') === symbol) return true;
  }

  return false;
}