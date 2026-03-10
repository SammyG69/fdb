
async function handleMealLogged(event) {
  console.log("Handling MealLogged event");

  console.log({
    userId: event.userId,
    calories: event.calories,
    protein: event.protein,
    carbs: event.carbs,
    fat: event.fat,
  });
}

module.exports = { handleMealLogged };