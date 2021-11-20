const ACTIVE_IPO_JSON_URL = "https://groww.in/v1/api/stocks_ipo/v2/listing/user";
const ZERODHA_IPO_BID_URL = "https://console.zerodha.com/portfolio/ipo";
const CALENDAR_ID = "54c9sqpapr248kn4nm4t0r50ds@group.calendar.google.com";

const calendar = CalendarApp.getCalendarById(CALENDAR_ID);

function main() {
  let activeIpoListings = fetchActiveIpoListings_();
  activeIpoListings.forEach(createIpoEvent_);
}

function createIpoEvent_(activeIpoListing) {
  let ipoCompany = activeIpoListing['company'];
  let biddingStartDate = calculateDate_(ipoCompany['biddingStartDate'], ipoCompany['dailyStartTime']);
  let biddingEndDate = calculateDate_(ipoCompany['biddingEndDate'], ipoCompany['dailyEndTime']);

  if (!isIpoEventCreated_(ipoCompany, biddingStartDate)) {
    let ipoEvent = calendar.createEvent(`${ipoCompany['growwShortName']} IPO`, biddingStartDate, biddingEndDate);
    ipoEvent.setColor(CalendarApp.EventColor.GRAY);
    ipoEvent.setLocation(ZERODHA_IPO_BID_URL);
    ipoEvent.setDescription(createDescription_(ipoCompany));
    ipoEvent.setTag('isin', ipoCompany['isin']);

    console.log('IPO event successfully created for :: ', ipoCompany['name']);
  } else {
    console.warn('IPO event already created for :: ', ipoCompany['name']);
  }
}

function fetchActiveIpoListings_() {
  let activeIpoListings = [];
  let response = UrlFetchApp.fetch(ACTIVE_IPO_JSON_URL);
  if (response.getResponseCode() === 200) {
    let ipoListings = JSON.parse(response.getContentText());
    if ('ipoCompanyListingOrderMap' in ipoListings && 'ACTIVE' in ipoListings['ipoCompanyListingOrderMap'])
      activeIpoListings = ipoListings['ipoCompanyListingOrderMap']['ACTIVE'];
    console.log('Successfully fetched active IPO listings with value :: ', activeIpoListings);
  } else {
    console.error('Unable to fetch IPO details with response code :: ', response.getResponseCode());
  }
  return activeIpoListings;
}

function isIpoEventCreated_(ipoCompany, biddingStartDate) {
  let isin = ipoCompany['isin'];
  let events = calendar.getEventsForDay(biddingStartDate);
  for (const event of events) {
    console.log(`Found event with name ${event.getTitle()} on ${biddingStartDate}`)
    if (event.getTag('isin') === isin) return true;
  }

  return false;
}