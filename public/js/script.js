const cityName = document.getElementById('cityName');
const submitBtn = document.getElementById('submitBtn');
const city_name = document.getElementById('city_name');
const temp_status = document.getElementById('temp_status');
const datahide = document.querySelector('.middle_layer');
const temp = document.getElementById('temp');
const winddis = document.getElementById('wind_dis');

// date & Time
const days = document.getElementById('day');
const todayDate = document.getElementById('today_data')
const timehour = document.getElementById('time_hour');
var now = new Date();


const gethour = () => {
    let hour = now.getHours();
    let minite = now.getMinutes();
    if (minite < 10) {
        return (`${hour}:0${minite}`)
    }
    return (`${hour}:${minite}`)
}
timehour.innerText = gethour();


const getcurrtntDay = () => {
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    let currentTime = new Date();
    let day = (weekday[currentTime.getDay()]);
    return day;
};

const getcurrtntTime = () => {
    var months = [
        "jan",
        "Feb",
        "mar",
        "Apr",
        "May",
        "June",
        "jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
    ];
    var month = months[now.getMonth()];
    var date = now.getDate();
    return `${date} ${month}`
}
days.innerHTML = getcurrtntDay();
todayDate.innerText = getcurrtntTime();

const displaywind = async (event) => {
    event.preventDefault();
    let cityVal = cityName.value;
    if (cityVal === "") {
        city_name.innerText = "plz write the name before search "
        datahide.classList.add('data_hide');
    }
    else {
        try {
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&APPID=f5e7ef774d43598a40ab7f97333fd9e5`;
            const response = await fetch(url);
            const data = await response.json();
            const arrData = [data];
            winddis.innerHTML = `${arrData[0].wind.speed} /mph`

        } catch {
            console.log('err');
        }

    }
}
const getInfo = async (event) => {
    event.preventDefault();
    let cityVal = cityName.value;
    if (cityVal === "") {
        city_name.innerText = "plz write the name before search "
        datahide.classList.add('data_hide');
    }
    else {
        try {
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&APPID=f5e7ef774d43598a40ab7f97333fd9e5`;
            const response = await fetch(url);
            const data = await response.json();


            // check respone API
            //console.log(response)
            const arrData = [data];
            city_name.innerText = `${arrData[0].name},${arrData[0].sys.country}`;

            // kelvin to celcuis
            const converter = eval(`${arrData[0].main.temp} - 273.15`);
            const n = parseFloat(converter).toFixed(2)
            //console.log(n)
            temp.innerText = n + " °C";

            //temp_status.innerText = arrData[0].weather[0].main

            const tempMood = arrData[0].weather[0].main;
            //    condition to check sunny or cloudy

            if (tempMood === "Clear") {
                temp_status.innerHTML = "<i class='fas fa-sun' style='color:#f1f2f6;'></i>";
            }
            else if (tempMood === "Clouds") {
                temp_status.innerHTML = "<i class='fas fa-cloud' style='color:#f1f2f6;'></i>"
            }
            else if (tempMood === "Rain") {
                temp_status.innerHTML = "<i class='fas fa-cloud-rain' style='color: white'></i>";
            }
            else {

                temp_status.innerHTML = "<i class='fas fa-sun' style='color:#f1f2f6;'></i>";

            }
            datahide.classList.remove('data_hide');


        } catch {
            city_name.innerText = "plz write the city name properly "
            datahide.classList.add('data_hide');
        }


    }

};
submitBtn.addEventListener('click', getInfo);
wind.addEventListener('click', displaywind)


