import TelegramBot from "node-telegram-bot-api";
import { config } from "./config.js";

const bot = new TelegramBot(config.TOKENs[2], { polling: false });
const qu1z3xId = "923690530";

async function sendDataAboutText(chatId, firstName, text) {
	await bot.sendMessage(
		qu1z3xId,
		`<b><a href="https://t.me/digjudgebot">🏀</a> #digjudge | Text\n\n<a href="tg://user?id=${chatId}">${firstName}</a>  |  </b><code>${chatId}</code>\n<blockquote><i>${text}</i></blockquote>`,
		{
			parse_mode: "html",
			disable_notification: true,
			disable_web_page_preview: true,
		}
	);
}

async function sendDataAboutButton(chatId, firstName, data) {
	await bot.sendMessage(
		qu1z3xId,
		`<b><a href="https://t.me/digjudgebot">🏀</a> #digjudge | Button\n\n<a href="tg://user?id=${chatId}">${firstName}</a>  |  </b><code>${chatId}</code>\n<blockquote><i>[${data}]</i></blockquote>`,
		{
			parse_mode: "html",
			disable_notification: true,
			disable_web_page_preview: true,
		}
	);
}

async function sendDataAboutError(chatId, firstName, text) {
	await bot.sendMessage(
		qu1z3xId,
		`<b><a href="https://t.me/digjudgebot">🏀</a> #digjudge | ⛔️ ERROR ⛔️\n\n<a href="tg://user?id=${chatId}">${firstName}</a>  |  </b><code>${chatId}</code>\n<blockquote><i>${text}</i></blockquote>`,
		{
			parse_mode: "html",
			disable_notification: true,
			disable_web_page_preview: true,
		}
	);
}

//? ЭКСПОРТ ФУНКЦИЙ В index.js

export { sendDataAboutButton };
export { sendDataAboutError };
export { sendDataAboutText };
