const allTokens = recipes.map((recipe) =>
	recipe.ingredients.map((ingredient) =>
		ingredient.split(" ")
	).flat()
)
.flat()
.filter((token) => !token.match(/^[\d\.]/))
.filter((token) => !unitsRegex.test(token))
.map((token) => token.toLowerCase());
const allTokensSet = new Set(allTokens);
const ingredientTokens = Array.from(allTokensSet);

const allNameTokens = recipes.map(
	({ name }) => name.split(" ")
)
.flat()
.map((token) => token.toLowerCase());

const allNameTokensSet = new Set(allNameTokens);
const nameTokens = Array.from(allNameTokensSet);

function clearSuggestions() {
	const suggestionsContainers = document.getElementsByClassName("suggestionsContainer");
	if (suggestionsContainers.length > 0) {
		[...suggestionsContainers].map((suggestionContainer) => suggestionContainer.remove());
	}
}

function resetSuggestions(input) {
	clearSuggestions();
	const suggestionsContainer = createSuggestionsContainer();
	insertAfter(suggestionsContainer, input);
}

function addSuggestionToContainer(suggestionsContainer, input) {
	return function addSuggestion(token) {
		const suggestion = document.createElement("button");
		suggestion.onclick = () => { input.value = token };
		suggestion.className = "suggestion";
		suggestion.innerHTML = "<img class='addSuggestion' src='./img/curved-arrow-left.svg' />"
			+ "<span>" + token + "<span>";
		suggestionsContainer.appendChild(suggestion);
	}
}

function generateSuggestions(input, inputValue, tokens) {
	clearSuggestions();
	const matchingTokens = tokens.filter((token) =>
		token.startsWith(inputValue.toLowerCase())
	).slice(0, SUGGESTION_COUNT_LIMIT);
	if (matchingTokens.length > 0) {
		matchingTokens.forEach(addSuggestionToContainer(suggestionsContainer, input));
	}
}

function createSuggestionsContainer() {
	const suggestionHdr = document.createElement("div");
	suggestionHdr.className = "suggestionHeader";
	suggestionHdr.innerHTML = "Suggestions:";
	
	const suggestionsContainer = document.createElement("div");
	suggestionsContainer.id = "suggestionsContainer";
	suggestionsContainer.classList.add("suggestionsContainer");
	suggestionsContainer.appendChild(suggestionHdr);
	return suggestionsContainer;
}