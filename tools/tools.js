module.exports = {
    sortByDate: ((a, b) => {
        return sortByDate(a, b);
    }),
    sortByDrinkName: ((a, b) => {
        return sortByDrinkName(a, b);
    })
}

function sortByDate(a, b) {
    var aDate = a.date.getTime();  
    var bDate = b.date.getTime();
    return ((aDate < bDate) ? -1 : ((aDate > bDate) ? 1 : 0));
}

function sortByDrinkName(a, b) {
    return ((a.drinkName < b.drinkName) ? -1 : ((a.drinkName > b.drinkName) ? 1 : 0));
}