let allData = [];

Papa.parse("學5.csv", {
download: true,
header: true,

complete: function(results){

    allData = results.data.filter(
        row => row["學年度"]
    );

    loadYears();
    loadRegions();
    loadTypes();

    updateTotal();
    updateCountryRanking();
    updateSchoolRanking();
    createTrendChart();
}

});

// ===== 學年度 =====
function loadYears(){

const yearSelect =
document.getElementById("yearSelect");

const years =
[...new Set(
    allData.map(row => row["學年度"])
)];

years.sort();

years.forEach(year => {

    const option =
    document.createElement("option");

    option.value = year;
    option.textContent = year;

    yearSelect.appendChild(option);

});

yearSelect.addEventListener("change", updateAll);

}

// ===== 區域 =====
function loadRegions(){

const regionSelect =
document.getElementById("regionSelect");

const regions =
[...new Set(
    allData.map(
        row => row["進修交流國家(地區)區域別"]
    )
)];

regions.sort();

regions.forEach(region => {

    const option =
    document.createElement("option");

    option.value = region;
    option.textContent = region;

    regionSelect.appendChild(option);

});

regionSelect.addEventListener("change", updateAll);

}

// ===== 設立別 =====
function loadTypes(){

const typeSelect =
document.getElementById("typeSelect");

const types =
[...new Set(
    allData.map(
        row => row["設立別"]
    )
)];

types.forEach(type => {

    const option =
    document.createElement("option");

    option.value = type;
    option.textContent = type;

    typeSelect.appendChild(option);

});

typeSelect.addEventListener("change", updateAll);

}

// ===== 共用篩選 =====
function getFilteredData(){

const selectedYear =
document.getElementById("yearSelect").value;

const selectedRegion =
document.getElementById("regionSelect").value;

const selectedType =
document.getElementById("typeSelect").value;

let filteredData = allData;

if(selectedYear !== "all"){

    filteredData =
    filteredData.filter(
        row => row["學年度"] === selectedYear
    );

}

if(selectedRegion !== "all"){

    filteredData =
    filteredData.filter(
        row =>
        row["進修交流國家(地區)區域別"]
        === selectedRegion
    );

}

if(selectedType !== "all"){

    filteredData =
    filteredData.filter(
        row =>
        row["設立別"]
        === selectedType
    );

}

return filteredData;

}

// ===== 更新全部 =====
function updateAll(){

updateTotal();
updateCountryRanking();
updateSchoolRanking();

}

// ===== 總交流人數 =====
function updateTotal(){

const filteredData =
getFilteredData();

let total = 0;

filteredData.forEach(row => {

    total += Number(
        row["本國學生出國進修交流至少1學期(修讀學分)以上人數小計"]
        || 0
    );

});

document.getElementById("totalCount")
.textContent =
total.toLocaleString();

}

// ===== 國家TOP10 =====
function updateCountryRanking(){

const filteredData =
getFilteredData();

const countryTotals = {};

filteredData.forEach(row => {

    const country =
    row["進修交流國家(地區)別"];

    const count =
    Number(
        row["本國學生出國進修交流至少1學期(修讀學分)以上人數小計"]
        || 0
    );

    if(!countryTotals[country]){

        countryTotals[country] = 0;

    }

    countryTotals[country] += count;

});

const top10 =
Object.entries(countryTotals)
.sort((a,b)=>b[1]-a[1])
.slice(0,10);

const maxValue = top10[0]?.[1] || 1;

let html = "";

top10.forEach(item => {

    const country = item[0];
    const value = item[1];

    html += `
    <div class="country-row">

        <div class="country-name">
            ${country}
            (${value.toLocaleString()})
        </div>

        <div class="bar">
            <div class="fill"
            style="width:${(value/maxValue)*100}%">
            </div>
        </div>

    </div>
    `;

});

document.getElementById(
    "countryRanking"
).innerHTML = html;

}

// ===== 學校TOP10 =====
function updateSchoolRanking(){

const filteredData =
getFilteredData();

const schoolTotals = {};

filteredData.forEach(row => {

    const school =
    row["學校名稱"];

    const count =
    Number(
        row["本國學生出國進修交流至少1學期(修讀學分)以上人數小計"]
        || 0
    );

    if(!schoolTotals[school]){

        schoolTotals[school] = 0;

    }

    schoolTotals[school] += count;

});

const top10 =
Object.entries(schoolTotals)
.sort((a,b)=>b[1]-a[1])
.slice(0,10);

const maxValue = top10[0]?.[1] || 1;

let html = "";

top10.forEach(item => {

    const school = item[0];
    const value = item[1];

    html += `
    <div class="country-row">

        <div class="country-name">
            ${school}
            (${value.toLocaleString()})
        </div>

        <div class="bar">
            <div class="fill"
            style="width:${(value/maxValue)*100}%">
            </div>
        </div>

    </div>
    `;

});

document.getElementById(
    "schoolRanking"
).innerHTML = html;

}