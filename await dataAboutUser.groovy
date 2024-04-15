await dataAboutUser.customMatchesOptions.push({
					matchId: rndId,
					sportNum: sportNum,
					score: "0:0",
					quarterOfGame: 1,
					startDate: new Date(),
					startTime: new Date().toLocaleTimeString("ru-RU", {
						hour12: false,
						hour: "2-digit",
						minute: "2-digit",
						timeZone: "Europe/Moscow",
					}),
					timeOfAllGame: "",
					nameForCom1:
						sportNum == 1 ||
						sportNum == 2 ||
						sportNum == 3 ||
						sportNum == 4
							? "Синие"
							: "",
					nameForCom2:
						sportNum == 1 ||
						sportNum == 2 ||
						sportNum == 3 ||
						sportNum == 4
							? "Красные"
							: "",

					MAXquarterOfGame:
						sportNum == 1 ||
						sportNum == 2 ||
						sportNum == 3 ||
						sportNum == 4
							? 4
							: "",
					scoresInQuarters: [],
					isOver: false,
					winningTeam: "",
				});













				if (dataAboutUser.currentSportNum == 5) {
		

					const dataAboutCustomMatch = dataAboutUser.customMatchesOptions.find(
						(obj) => obj.matchId == dataAboutUser.currentMatchId
					);
					await bot.editMessageText(
						`<b><i>${
							dataAboutCustomMatch.sportName
								? `${dataAboutCustomMatch.sportName}`
								: "⚙️ Кастомный"
						} • <code>${
							dataAboutCustomMatch.matchId
						}</code> ⚙️\n\nДанные об игре:</i>\n\n${
							co1Score > co2Score
								? `<u>${dataAboutCustomMatch.nameForCom1}</u>`
								: `${dataAboutCustomMatch.nameForCom1}`
						} ${numberToEmoji(co1Score)}  :  ${numberToEmoji(co2Score)} ${
							co2Score > co1Score
								? `<u>${dataAboutCustomMatch.nameForCom2}</u>`
								: `${dataAboutCustomMatch.nameForCom2}`
						}\n\n</b>${
							moreAboutQuarters
								? `<blockquote><b><i>Сегменты:\n\n</i>${dataAboutMatchText}• ${
										dataAboutCustomMatch.quarterOfGame
								  }-й сегмент\nСчет:  ${co1Score} : ${co2Score}\n\n</b>${
										dataAboutCustomMatch.quarterOfGame > 1
											? `<a href="https://t.me/${BotName}/?start=moreAboutQuartersHideInGameScoreCountingWithId${matchId}">Скрыть</a>\n`
											: ""
								  }</blockquote>`
								: `<blockquote><b><i>Сегменты:\n\n</i>${
										dataAboutCustomMatch.quarterOfGame
								  }-й сегмент</b>\nСчет:  <b>${co1Score} : ${co2Score}</b>\n${
										dataAboutCustomMatch.quarterOfGame > 1
											? `<a href="https://t.me/${BotName}/?start=moreAboutQuartersShowInGameScoreCountingWithId${matchId}">Подробнее..</a>\n`
											: ""
								  }</blockquote>`
						}Начало: <b>в ${
							dataAboutCustomMatch.startTime
						}\n\nНе теряй внимательность! 😉</b>`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: usersData.find((obj) => obj.chatId === chatId)
								.messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{
											text: "⬆️",
											callback_data: `upScore1WithId${matchId}`,
										},
										{
											text: `${dataAboutCustomMatch.quarterOfGame}-й`,
											callback_data: `addQuarterWithId${matchId}`,
										},
										{
											text: "⬆️",
											callback_data: `upScore2WithId${matchId}`,
										},
									],
									[
										{
											text: `${
												dataAboutUser.writeco1score
													? `...`
													: `${numberToEmoji(co1Score)}`
											}`,
											callback_data: `toggleWriteScore1WithId${matchId}`,
										},
										{ text: ":", callback_data: "-" },
										{
											text: `${
												dataAboutUser.writeco2score
													? `...`
													: `${numberToEmoji(co2Score)}`
											}`,
											callback_data: `toggleWriteScore2WithId${matchId}`,
										},
									],
									[
										{
											text: `${co1Score > 0 ? `⬇️` : "🚫"}`,
											callback_data: `${
												co1Score > 0 ? `downScore1WithId${matchId}` : "-"
											}`,
										},
										{ text: "🕰️", callback_data: "-" },
										{
											text: `${co2Score > 0 ? `⬇️` : "🚫"}`,
											callback_data: `${
												co2Score > 0 ? `downScore2WithId${matchId}` : "-"
											}`,
										},
									],
									[
										{
											text: "⬅️Назад",
											callback_data: `gameScore`,
										},
										{
											text: `${
												co1Score != 0 || co2Score != 0
													? "Завершить❌"
													: ""
											}`,
											callback_data: `endOfGameWithId${matchId}`,
										},
									],
								],
							},
						}
					);
				}






// async function customMatches(
// 	chatId,
// 	matchId = null,
// 	numberOfStage = 1,
// 	processOfNamingC1 = false,
// 	processOfNamingC2 = false
// ) {
// 	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
// 	try {
// 		switch (numberOfStage) {
// 			case 1:
// 				dataAboutUser.userAction = "customMatches1";

// 				while (
// 					dataAboutUser.customMatchesOptions[
// 						dataAboutUser.customMatchesOptions.indexOf(
// 							dataAboutUser.customMatchesOptions.find(
// 								(obj) => !obj.matchIsСreated
// 							)
// 						)
// 					]
// 				) {
// 					dataAboutUser.customMatchesOptions[
// 						dataAboutUser.customMatchesOptions.indexOf(
// 							dataAboutUser.customMatchesOptions.find(
// 								(obj) => !obj.matchIsСreated
// 							)
// 						)
// 					] = [];
// 				}

// 				await bot.editMessageText(
// 					`<b><i>🎯 Кастомный матч ⚙️</i>\n\n</b>Создавай матчи по своим правилам и со своими командами! 😊<b>${
// 						dataAboutUser.customMatchesOptions || true
// 							? "\n\nСоздай новый или выбери свой шаблон! 😉"
// 							: ""
// 					}</b>`,
// 					{
// 						parse_mode: "html",
// 						chat_id: chatId,
// 						message_id: usersData.find((obj) => obj.chatId == chatId)
// 							.messageId,
// 						disable_web_page_preview: true,
// 						reply_markup: {
// 							inline_keyboard: [
// 								[
// 									{
// 										text: "Создать ➕",
// 										callback_data: "customMatches2",
// 									},
// 								],
// 							],
// 						},
// 					}
// 				);

// 				console.log(dataAboutUser.customMatchesOptions);
// 				break;
// 			case 2:
// 				if (!matchId) {
// 					do {
// 						rndId = Math.floor(Math.random() * 1000000000);
// 					} while (
// 						dataAboutUser.matchesData.some(
// 							(matchData) => matchData.matchId == rndId
// 						) &&
// 						dataAboutUser.matchesData.length != 0
// 					);
// 					await dataAboutUser.customMatchesOptions.push({
// 						matchId: rndId,
// 						sportNum: 5,
// 						sportName: "",
// 						score: "0:0",
// 						quarterOfGame: 1,
// 						startDate: null,
// 						startTime: null,
// 						timeOfAllGame: "",
// 						nameForCom1: "Команда 1",
// 						nameForCom2: "Команда 2",
// 						// MAXquarterOfGame:
// 						// 	sportNum == 1 ||
// 						// 	sportNum == 2 ||
// 						// 	sportNum == 3 ||
// 						// 	sportNum == 4
// 						// 		? 4
// 						// 		: "",
// 						scoresInQuarters: [],
// 						matchIsСreated: false,
// 						isOver: false,
// 					});

// 					matchId = rndId;
// 				}
// 				break;
// 			case 3:
// 				break;
// 		}
// 	} catch (error) {
// 		console.log(error);
// 		sendDataAboutError(chatId, `${String(error)}`);
// 	}
// }





\n${
					co1Score > co2Score
						? `<b>🥇${matchData.nameForCom1}</b>`
						: `${matchData.nameForCom1}`
				} : ${
					co2Score > co1Score
						? `<b>${matchData.nameForCom2}🥇</b>`
						: `${matchData.nameForCom2}`
				}













				await dataAboutUser.customMatchesOptions.push({
						matchId: rndId,
						sportNum: 5,
						sportName: "",
						score: "0:0",
						quarterOfGame: 1,
						startDate: new Date(),
						startTime: new Date().toLocaleTimeString("ru-RU", {
							hour12: false,
							hour: "2-digit",
							minute: "2-digit",
							timeZone: "Europe/Moscow",
						}),
						timeOfAllGame: "",
						nameForCom1: "Команда 1",
						nameForCom2: "Команда 2",
						// MAXquarterOfGame:
						// 	sportNum == 1 ||
						// 	sportNum == 2 ||
						// 	sportNum == 3 ||
						// 	sportNum == 4
						// 		? 4
						// 		: "",
						scoresInQuarters: [],
						matchIsСreated: false,
						isOver: false,
						winningTeam: "",
					});















				