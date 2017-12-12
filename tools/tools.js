module.exports = {
    sortByDate: ((a, b) => {
        return sortByDate(a, b);
    }),
    sortByDrinkName: ((a, b) => {
        return sortByDrinkName(a, b);
    })
}

function sortByDate(a, b) {
    var aDay = a.day;
    var aMonth = a.Month - 1;
    var aYear = a.Year;
    var aDate = new Date(aYear, aMonth, aDay).getTime();
    var bDay = b.day;
    var bMonth = b.Month - 1;
    var bYear = b.Year;
    var bDate = new Date(bYear, bMonth, bDay).getTime();
    return ((aDate < bDate) ? -1 : ((aDate > bDate) ? 1 : 0));
}

function sortByDrinkName(a, b) {
    return ((a.drinkName < b.drinkName) ? -1 : ((a.drinkName > b.drinkName) ? 1 : 0));
}