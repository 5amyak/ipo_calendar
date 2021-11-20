function createDescription_(ipoCompany) {
  return `<h3>${ipoCompany['name']}</h3>` +
  `<b>Lot Size:</b> ${ipoCompany['lotSize']}<br/>` +
  `<b>Min Price:</b> ${ipoCompany['minPrice']}<br/>` +
  `<b>Max Price:</b> ${ipoCompany['maxPrice']}<br/><br/>` +
  `<a href="https://www.topsharebrokers.com/report/live-ipo-gmp/331/">GMP</a> | ` +
  `<a href="https://www.chittorgarh.com/ipo/ipo_dashboard.asp">Chittorgarh</a> | ` +
  `<a href="${ipoCompany['documentUrl']}">DRHP</a> | ` +
  `<a href="https://news.google.com/search?q=${ipoCompany['searchId']}">More Info</a>`
}

function calculateDate_(dateStr, timeStr) {
  let date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  date.setSeconds(hmsToSecondsOnly_(timeStr));
  
  return date;
}

function hmsToSecondsOnly_(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}