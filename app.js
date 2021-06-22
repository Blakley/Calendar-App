
/* set up our required variables */
const express = require('express');
const path = require('path');
const app = express();

/* set the path of the view folder */
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

/* starting page: redirect to default calendar */
app.get("/",  (req, res) => {
    res.redirect('/calendar');
});

/* create calendar variables */
var year;
var month;
var get_first;
var current_month;
var highlight_date = false;

/* obtain the url parameters and parse them */
app.get("/calendar", (req, res) => {
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const url_string = url.toString();

    /* obtain the month if requested a particular one */
    if (url_string.charAt(30)) {
        month = url_string.charAt(37);
        if (!isNaN(url_string.charAt(38))) {
            // check if the month is 10 through 12
            month = url_string.charAt(37) + url_string.charAt(38);
            month = Math.abs(month); // ensure any negative values don't get routed
            if (month > 12)
                month = 12; // the max month value = 12
        }
        if (month == 0) {
            month = 1;
        }
        requested_month = month;
        highlight_date = false;
    }
    else {
        // use the current date instead
        let cDate = new Date();
        let cMonth = cDate.getMonth() + 1;
        let cYear = cDate.getFullYear();
        month = cMonth;
        year = cYear;
        highlight_date = true;
    }

    /* obtain the year if requested a particular one */
    let counter = 0;
    for (let member in url_string) {
        if ((counter >= 44 && counter <= 49)) {
            if (counter == 44 && year) {
                year = "";
            }
            year += url_string[member];
        }
        counter++;
    }

    /* additional check for undefined year */
    if (counter >= 44 && counter <= 49 && (year != undefined)) {
        let numbers = year.match(/\d+/g).map(Number);
        year = numbers;
        year = Math.abs(year);
    }

    /* use the current date if url (date & year) parameters not provided */
    if (month == undefined && year == undefined) {
        let today = new Date();
        month = today.getMonth() + 1;
        year = today.getFullYear();
    }

    /* Calculate how many days are in the month */
    if (month === 4 || month === 6 || month === 9 || month === 11)
        lastDay = 30;
    else if (month !== 2)
        lastDay = 31;
    else if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
        lastDay = 29;
    else
        lastDay = 28;

    /* Get the first day of the month */
    current_month = parseInt(month, 10);
    get_first = new Date(year, current_month-1, 1);

    let days = new Array(7);
    days[0] = "SU";
    days[1] = "MO";
    days[2] = "TU";
    days[3] = "WE";
    days[4] = "TH";
    days[5] = "FR";
    days[6] = "SA";

    let first_day = days[get_first.getDay()];
    let daysMonth = new Date(year, month, 0).getDate(); // number of days in the month.
    const months = ["January", "February", "March", "April",
    "May", "June", "July", "August", "September", "October",
    "November", "December"];

    let monthYear = months[month-1] + " " + year; // current month and year
    let d = new Date();
    var d_current = d.getDate(); // get current date (number).

    let isMonth = false; // bool for if the calendar is on the current month
    if (d.getMonth()+1 == month) {
        isMonth = true;
    }

    /* calculate and return the next calendar cell value */
    const empty_cell = " ";
    var day_counter = 0;
    var cell_count = 0;
    function getDayValue() {
        cell_count++;
        if (day_counter < daysMonth) {
            switch(first_day)
            {
                case "SU":
                    return ++day_counter;
                case "MO":
                    if (cell_count < 2)
                        return empty_cell
                    else
                        return ++day_counter;
                case "TU":
                    if (cell_count < 3)
                        return empty_cell
                    else
                        return ++day_counter;
                case "WE":
                    if (cell_count < 4)
                        return empty_cell
                    else
                        return ++day_counter;
                case "TH":
                    if (cell_count < 5)
                        return empty_cell
                    else
                        return ++day_counter;
                case "FR":
                    if (cell_count < 6)
                        return empty_cell
                    else
                        return ++day_counter;
                case "SA":
                    if (cell_count < 7)
                        return empty_cell
                    else
                        return ++day_counter;
            }
        }
        else {
                return empty_cell;
        }
    }

    /* create a reference to the specified year & month */
    let my_month = month;
    let my_year = year;

    /* prepare the calendar with html values to send to the client */
    res.render("calendar.ejs",{
        monthYear: monthYear,
        i0: getDayValue(),  i1: getDayValue(), i2: getDayValue(),
        i3: getDayValue(),  i4: getDayValue(), i5: getDayValue(),
        i6: getDayValue(),  i7: getDayValue(), i8: getDayValue(),
        i9: getDayValue(),  i10: getDayValue(), i11: getDayValue(),
        i12: getDayValue(), i13: getDayValue(), i14: getDayValue(),
        i15: getDayValue(), i16: getDayValue(), i17: getDayValue(),
        i18: getDayValue(), i19: getDayValue(), i20: getDayValue(),
        i21: getDayValue(), i22: getDayValue(), i23: getDayValue(),
        i24: getDayValue(), i25: getDayValue(), i26: getDayValue(),
        i27: getDayValue(), i28: getDayValue(), i29: getDayValue(),
        i30: getDayValue(), i31: getDayValue(), i32: getDayValue(),
        i33: getDayValue(), i34: getDayValue(), i35: getDayValue(),
        i36: getDayValue(), i37: getDayValue(), i38: getDayValue(),
        i39: getDayValue(), i40: getDayValue(), i41: getDayValue(),
        d_current: d_current,  default_cal: highlight_date,
        my_month: my_month, my_year: my_year, isMonth: isMonth
    });
});

/* Listen on the specified port */
app.listen(3000);
