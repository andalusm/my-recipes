class InvalidIngredientError extends Error {}
class EmptyIngredientError extends Error {}
class MissingParametersError extends Error {}

module.exports = {InvalidIngredientError, EmptyIngredientError, MissingParametersError}
