const SIX_PM_24_HRS = 23; // 18;
const ONE_HOUR_MS = 3000; //60 * 60 * 1000;
const NOTIF_LAST_SHOWN_DATE_KEY = "notifLastShownDate";

function getNotifBody({ ingredients }) {
	const ingredientsStr = ingredients
		.map(getIngredientParts)
		.map((parts) => parts[3] || null)
		.filter(Boolean)
		.join(", ");
	return `Ingredients: ${ingredientsStr}`;
}

function getNotifConfig(cocktailOfTheDay) {
	const title = `Cocktail of the day: ${cocktailOfTheDay.name}`;
	const config = {
		body: getNotifBody(cocktailOfTheDay),
		icon: `${window.location.host}/img/appIcon.png`,
		data: {
			url: `${window.location.host}?cocktail=${encodeURIComponent(cocktailOfTheDay.name)}`
		},
		actions: [{ action: "openLink", title: 'See recipe' }],
	};
	return { title, config };
}

window.addEventListener("load",
	() => navigator.serviceWorker.register("notificationServiceWorker.js").then(() => {
		const { title, config } = getNotifConfig(COCKTAIL_OF_DAY);
		setInterval(() => {
			const now = new Date();
			if (now.getHours() === SIX_PM_24_HRS) {
				const dateStrToday = now.toDateString();
				const notifLastShownDate = localStorage.getItem(NOTIF_LAST_SHOWN_DATE_KEY);
				if (notifLastShownDate !== dateStrToday) {
					localStorage.setItem(NOTIF_LAST_SHOWN_DATE_KEY, dateStrToday);
					Notification.requestPermission().then((permission) => {
						if (permission === "granted") {
							navigator.serviceWorker.ready.then((registration) => {
								registration.showNotification(title, config);
							});
						}
					});
				}
			}
		}, ONE_HOUR_MS);
	})
);
