Date.prototype.addDays = function (days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
};

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(currentDate);
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

function getNext7Dates() {
  const next7Dates = [];
  var dateArray = getDates(new Date(), new Date().addDays(7));
  for (i = 0; i < dateArray.length; i++) {
    next7Dates.push(dateArray[i].toISOString().split("T")[0]);
  }
  return next7Dates;
}

module.exports = { getNext7Dates };
