import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import fs from "fs";

import { sendDataAboutButton } from "./tgterminal.js";
import { sendDataAboutError } from "./tgterminal.js";
import { sendDataAboutAction } from "./tgterminal.js";
import { match } from "assert";

const TOKENs = [
	"6654105779:AAEnCdIzKS_cgJUg4rMY8yNM3LPP5iZ-d_A",
	"6305745212:6858989950:AAH5tFy09SfJcD71mJoa4sB4lHEyWzw8nrQ",
];

const TOKEN = TOKENs[0]; // 1 - оригинал
const bot = new TelegramBot(TOKEN, { polling: true });

const qu1z3xId = "923690530";
const jackId = "6815420098";
let BotName = "digjudgebot";

let usersData = [],
	scoreHistoryButtons = [];

bot.setMyCommands([
	{
		command: "/restart",
		description: "Перезапуск 🏅",
	},
]);

const menuHomeText = [
	"Чем я могу быть полезен, спортсмен? 🤔",
	"Свисток в рот и я готов! 😆",
	"Нам нужен судь.. Я здесь! 😉",
	"Как мне помочь, звезда спортивная? 🌟",
	"Готов к действию, спортсмен? 💪",
	"Опять игра? Давай начнем! 🏋️‍♂️",
	"Готов к игре? Держи меня в руках! 🏀",
	"Готов обеспечить честность! 🏆",
	"Команды готовы! Что от меня требуется? 🧐",
	"Начать игру? Я на позиции! 🥸",
	"За честную игру! Как могу помочь? 🤔",
];

const motivationPhrases = [
	"Не оглядывайся назад. Твоя история еще не завершена. Каждый новый день - это возможность стать лучше, сильнее, быстрее. 💪",
	"Сложные тренировки делают тебя сильнее. Каждый подъем, каждое усилие - это шаг вперед к своей цели. Держись и продолжай двигаться вперед! 🔥",
	"Не бойся испытаний. Именно они делают тебя сильнее. Каждое преодоленное препятствие - это шанс доказать свою силу и выносливость. 💥",
	"Помни, что каждый прогресс - это победа. Даже самый маленький шаг вперед приближает тебя к своей мечте. Не сомневайся в себе и иди к своей победе! 🚀",
	"Ты сильнее, чем думаешь. Верь в себя и свои возможности. Ничто не может остановить тебя, если у тебя есть цель и решимость достичь ее. 💫",
	"Каждый день - это новая возможность стать лучше. Не жди идеального момента, создавай его сам. Ты можешь достичь своих целей, если будешь настойчив и целеустремлен. 🌟",
	"Спорт - это не только физическая активность, это и урок самосовершенствования. Тренируйся не только для победы на поле, но и для победы над собой. 💥",
	"Пусть каждая тренировка будет шагом к новой версии себя. Ты можешь преодолеть все, если веришь в себя и готов бороться за свои мечты. 🏆",
	"Спорт - это не только соревнование с другими, но и с собой. Каждый день ты можешь стать лучше, чем был вчера. Не сравнивай себя с другими, сравнивай себя с самим собой и стремись к постоянному улучшению. 💪",
	"Будь готов к трудностям и препятствиям на своем пути. Именно они делают твою победу еще сладкой. Не падай духом перед испытаниями, а берись за них с уверенностью и решимостью. 🏋️‍♂️",
	"Возможности ждут тех, кто готов брать их. Не жди идеального момента, чтобы начать действовать. Сегодня - лучший день для того, чтобы начать двигаться к своей цели. 🌟",
	"Твоя сила не определяется тем, сколько раз ты упал, а тем, сколько раз ты встал и продолжил идти вперед. Не бойся неудач, они делают тебя сильнее и мудрее. 💫",
	"Мечтай большим, действуй смело, верь в себя и не отступай перед трудностями. Ты способен на великие свершения, если будешь настойчив и целеустремлен. 🚀",
	"Не думай о том, что можешь потерять, а о том, что можешь выиграть. Каждый шаг вперед приближает тебя к своей мечте. Держись за свои цели и иди к ним с уверенностью. 🌈",
	"Твой успех - это результат твоих действий и усилий. Не жди, что кто-то другой сделает это за тебя. Будь активным создателем своей судьбы и стремись к своим мечтам. 🎯",
	"Пусть твоя стремительность будет сильнее, чем твои страхи. Смело шагай вперед и покажи миру, на что способен настоящий боец. 🏆",
	"Успех не приходит к тем, кто ждет, а к тем, кто действует. Двигайся вперед с уверенностью, будь настойчивым и неуклонным в достижении своих целей. 💥",
	"Жизнь - это как велосипед. Чтобы сохранить равновесие, нужно двигаться. Не останавливайся, даже если трудности кажутся непреодолимыми. Ты сильнее, чем думаешь. 🚴‍♂️",
	"Вокруг тебя есть неограниченные возможности. Верь в себя, верь в свои способности, и невозможное станет возможным. Ты создатель своей судьбы! ✨",
	"Помни, что каждый день - это новый шанс стать лучше, чем был вчера. Даже самый маленький шаг вперед приближает тебя к своей мечте. Иди к ней с уверенностью и решимостью. 🌟",
	"Ты не можешь изменить прошлое, но можешь влиять на свое будущее. Сфокусируйся на том, что в твоих руках сейчас, и делай все возможное, чтобы достичь своих целей. 🌈",
	"Помни, что твоя сила и мудрость - это ключи к успеху. Не сомневайся в себе, иди вперед с уверенностью, и победа не заставит себя долго ждать. 💪",
	"Великие свершения начинаются с мечты и желания. Поверь в себя, действуй смело и не упускай возможности стать лучше каждый день. 🚀",
	"Трудности - это всего лишь испытания на твоем пути к успеху. Смотри на них как на возможность расти и развиваться, а не как на преграду. Ты сильнее, чем думаешь! 🌟",
	"Помни, что каждый прогресс - это шаг вперед. Даже самые маленькие достижения приближают тебя к цели. Не забывай ценить каждый шаг на своем пути! 💫",
	"Твоя сила не измеряется количеством побед, а способностью продолжать идти вперед после поражений. Верь в себя и свою неограниченную возможность достичь успеха! 🌟",
	"Каждый день дает новый шанс стать лучше, чем был вчера. Не упускай возможность сделать что-то великое сегодня. Будь настойчивым и дерзай! 💪",
	"Ты уникален и способен на великие свершения. Не останавливайся перед трудностями, они лишь проверяют твою решимость. Иди вперед с верой в себя и свои силы! 🚀",
	"Никогда не забывай, что ты заслуживаешь самого лучшего. Твоя решимость и стремление к успеху превращают мечты в реальность. Держись за свои цели и иди к ним с уверенностью! 🌈",
	"Секрет успеха заключается в том, чтобы каждый день делать шаги к своим целям. Не бойся ошибок, они лишь учат тебя быть сильнее и мудрее. Будь настойчивым и неуклонным в преследовании своих мечт! 🏆",
	"Твоя сила и мудрость несравнимы. Верь в себя и свои способности, и ничто не сможет помешать тебе достичь того, что ты заслуживаешь. Смотри на свои цели с оптимизмом и решимостью! ✨",
	"Пусть каждый день будет наполнен стремлением к успеху и уверенностью в своих силах. Ты можешь все, если только веришь в себя и готов бороться за свои мечты. Никогда не сомневайся в своем потенциале! 💥",
	"Сложности - это лишь временные испытания на твоем пути к великим свершениям. Будь настойчивым и упорным, и ни одно препятствие не сможет помешать тебе добиться того, чего ты хочешь. 🌟",
	"Твоя сила и решимость не имеют границ. Верь в себя и свои способности, и ничто не сможет остановить тебя на пути к успеху. Будь настойчивым и стремись к своим мечтам! 💪",
	"Каждый день дает тебе возможность стать лучше, чем был вчера. Не упускай этот шанс! Двигайся вперед с уверенностью и решимостью, и ничто не сможет помешать тебе достичь своих целей. 🌟",
	"Твои мечты - это твое руководство к успеху. Не бойся мечтать большим, иди к своим целям с уверенностью и решимостью. Ты способен на великие свершения, если только веришь в себя! 🚀",
	"Каждый шаг, который ты делаешь вперед, приближает тебя к своей мечте. Не останавливайся перед трудностями, они лишь укрепляют твою решимость. Двигайся вперед с уверенностью и оптимизмом! 🌈",
	"Ты - создатель своей судьбы. Не доверяй случаю, строй свою жизнь сам. Будь настойчивым, целеустремленным и неуклонным в достижении своих целей. Ты заслуживаешь успеха! 🏆",
	"Сложности - это всего лишь испытания на пути к своим целям. Будь настойчивым и упорным, и ни одно препятствие не сможет остановить тебя. Двигайся вперед с верой в себя и свои силы! 💫",
	"Не бойся неудач, они лишь учат тебя быть сильнее. Каждая преграда - это возможность стать лучше. Двигайся вперед с оптимизмом и решимостью, и победа не заставит себя долго ждать! ✨",
	"Ты - сила природы, способная на великие свершения. Не допускай мысли о поражениях, стремись только к победам. Смотри на свои цели с оптимизмом и уверенностью, и ты обязательно добьешься успеха! 💥",
	"Каждый день - это новая страница твоей жизни, готовая быть заполненной великими свершениями. Не упускай возможность сделать что-то великое сегодня. Верь в себя и свои способности! 📖",
	"Помни, что ты - не просто часть мира, ты - сила, способная на перемены. Верь в себя, верь в свои мечты, и ничто не сможет помешать тебе достичь того, чего ты хочешь. Стремись к своей мечте с решимостью и уверенностью! 🌈",
	"Ты - хозяин своей судьбы. Не допускай мысли о поражениях, стремись только к победам. Двигайся вперед с решимостью и уверенностью, и ты обязательно добьешься успеха! 🚀",
	"Каждая преграда - это лишь шаг к победе. Не позволяй трудностям сбить тебя с пути к своим целям. Смотри на препятствия с оптимизмом и решимостью, и ты обязательно преодолеешь их! 💫",
	"Твоя сила и выносливость не знают границ. Верь в себя и свои способности, и ничто не сможет помешать тебе на пути к успеху. Будь настойчивым и стремись к своим мечтам! 💪",
	"Каждый день дает тебе возможность стать сильнее и лучше. Не упускай этот шанс! Двигайся вперед с уверенностью и решимостью, и ты обязательно достигнешь своих целей. 🌟",
	"Ты - создатель своего будущего. Не доверяй случаю, строй свою жизнь сам. Будь настойчивым, целеустремленным и неуклонным в достижении своих целей. Ты заслуживаешь успеха! 🏆",
	"Сложности - это всего лишь испытания на твоем пути к успеху. Будь настойчивым и упорным, и ни одно препятствие не сможет остановить тебя. Двигайся вперед с верой в себя и свои силы! 💥",
	"Не бойся неудач, они лишь учат тебя быть сильнее. Каждая преграда - это возможность стать лучше. Двигайся вперед с оптимизмом и решимостью, и победа не заставит себя долго ждать! ✨",
	"Ты - сила природы, способная на великие свершения. Не допускай мысли о поражениях, стремись только к победам. Смотри на свои цели с оптимизмом и уверенностью, и ты обязательно добьешься успеха! 💫",
	"Каждый день - это новая возможность стать лучше, чем был вчера. Не упускай этот шанс! Двигайся вперед с уверенностью и решимостью, и ты обязательно достигнешь своих целей. 🌟",
	"Помни, что ты - не просто часть мира, ты - сила, способная на перемены. Верь в себя, верь в свои мечты, и ничто не сможет помешать тебе достичь того, чего ты хочешь. Стремись к своей мечте с решимостью и уверенностью! 🌈",
	"Твоя сила - это твоя вера. Верь в себя, верь в свои возможности, и ничто не сможет помешать тебе достичь своих целей. Будь настойчивым и упорным, и ты обязательно добьешься успеха! 💪",
	"Способность видеть возможности в трудностях - это настоящий дар. Не бойся вызовов, иди навстречу им с открытым сердцем и решимостью. Ты сильнее, чем кажется! 🚀",
	"Каждая мечта начинается с первого шага. Двигайся вперед с уверенностью и решимостью, и ничто не сможет помешать тебе достичь своих целей. Будь настойчивым и неуклонным в стремлении к успеху! 🌟",
	"Ты - художник своей судьбы. Не доверяй случаю, создавай свою жизнь сам. Будь настойчивым и целеустремленным, и ты обязательно добьешься своих мечт! ✨",
	"Каждая неудача - это урок на пути к успеху. Не сомневайся в себе, иди вперед с решимостью и уверенностью. Ты способен на великие свершения, если будешь настойчив и целеустремлен! 🏆",
	"Твоя сила - это твоя настойчивость. Не останавливайся перед трудностями, иди навстречу им с открытым сердцем и уверенностью. Ты сильнее, чем думаешь! 💥",
	"Верь в себя, как никто другой. Ты - источник своей силы и мудрости. Двигайся вперед с решимостью и уверенностью, и ничто не сможет помешать тебе достичь своих целей. 💫",
	"Трудности - это всего лишь испытания на пути к успеху. Не сдавайся перед препятствиями, смотри на них как на возможность расти и развиваться. Ты способен на великие свершения! 🌈",
	"Твоя сила - это твоя вера в себя. Верь в свои способности, верь в свои мечты, и ничто не сможет помешать тебе достичь своих целей. Будь настойчивым и решительным, и ты обязательно добьешься успеха! 🌟",
	"Ты - капитан своей судьбы. Не допускай мысли о поражениях, стремись только к победам. Двигайся вперед с оптимизмом и решимостью, и ты обязательно достигнешь своих целей. 💪",
	"Ты - художник своей жизни. Каждый новый день - это пустой холст, готовый к заполнению твоими яркими красками. Будь творцом своего будущего и наполни его яркими красками своих мечт! 🎨",
	"Сила в том, чтобы не сдаваться. Даже когда темно вокруг, найди свой свет и иди к нему. Ты - светило, способное преодолеть любые трудности! 💡",
	"Каждое утро - это новая возможность начать заново. Не теряй времени на сожаления о прошлом, сфокусируйся на своем будущем и двигайся к нему с уверенностью и решимостью! 🌅",
	"Спорт - это не только физические упражнения, это и тренировка души. Поверь в себя, преодолевай трудности и становись сильнее с каждым новым днем! 💪",
	"Твоя сила - это твоя решимость. Каждый раз, когда ты встаешь после падения, ты становишься сильнее. Не бойся неудач, они делают тебя мудрее и сильнее! 🌟",
	"Успех - это не финишная черта, это состояние ума. Стремись к своим целям с открытым сердцем и уверенностью, и ты обязательно достигнешь своих мечт! 🚀",
	"Помни, что твои мысли создают твою реальность. Мечтай красиво, действуй смело и верь в себя, и невозможное станет возможным! ✨",
	"Ты - звезда своей собственной истории. Не допускай, чтобы кто-то другой писал ее за тебя. Будь автором своей судьбы и иди к своим мечтам смело и решительно! 🌟",
	"Каждый день - это новая возможность преодолеть себя. Не останавливайся на достигнутом, стремись к большему и будь готов к вызовам, которые ждут тебя на пути к успеху! 💫",
	"Ты - архитектор своей собственной судьбы. Поставь перед собой высокие цели, иди к ним с уверенностью и решимостью, и ничто не сможет помешать тебе достичь своих мечт! 🏰",
	"Не сравнивай свой начало с чьим-то концом. Каждый преодолевает свой путь, и твоя история уникальна. Доверься своему пути и двигайся вперед с верой и уверенностью! 🌟",
	"Всякий раз, когда ты чувствуешь себя слабым, помни, что твоя сила не определяется числами на весах или секундах на хронометре. Твоя истинная сила - это твоя решимость и вера в себя! 💪",
	"Будь вдохновением для себя и для других. Твои успехи - это не только твои личные победы, это и мотивация для окружающих. Покажи миру, что ты способен на великие свершения! 🚀",
	"Твое тело - это храм твоего духа. Ухаживай за ним, тренируй его, укрепляй его, и ты обретешь не только силу физическую, но и душевную. Заботься о себе и о своем здоровье всегда! 🌿",
	"Помни, что твои мысли - твои самые мощные инструменты. Наполни их позитивом, силой и уверенностью, и ты сможешь преодолеть любые трудности. Верь в себя и иди к своим мечтам смело! 🌟",
	"Все великие идеи начинаются с одного маленького шага. Не бойся делать первый шаг, даже если он кажется маленьким. Он может стать началом большой и удивительной путешествии к своим мечтам! 🚶‍♂️",
	"Нет ничего невозможного для того, кто верит в себя и готов действовать. Сфокусируйся на своих целях, и каждый день сделай хотя бы один шаг в их сторону. Мечтай большим и действуй смело! 🌈",
	"Трудности - это не повод сдаваться, а возможность стать сильнее. Взгляни на каждое препятствие как на шанс для своего роста и развития. Ты гораздо сильнее, чем кажется! 💫",
	"Помни, что твоя судьба в твоих руках. Ты - капитан своего корабля, и только ты можешь выбирать направление своего плавания. Верь в себя и иди к своим мечтам смело и решительно! ⛵️",
	"Не сдавайся перед трудностями, а борись с ними. Каждая победа над собой делает тебя сильнее. Двигайся вперед с уверенностью и решимостью, и ты обязательно достигнешь своих целей! 💪",
	"Каждый день - это новая страница в твоей книге жизни. Пусть твои поступки будут пером, которым ты пишешь свою историю. Делай каждый день значимым и запоминающимся! 📖",
	"Ты создан для великих свершений. Не сомневайся в себе и своих способностях. Смело берись за новые вызовы и стремись к новым вершинам. Ты можешь все, что захочешь! 🏔️",
	"Все, что ты можешь вообразить, ты можешь достигнуть. Поверь в себя и свои мечты, и ты обязательно найдешь силы и ресурсы, чтобы их осуществить. Верь в себя и двигайся вперед смело! 💫",
	"Не зацикливайся на своих неудачах. Всякая неудача - это урок, который делает тебя сильнее и мудрее. Прими его, извлеки уроки и двигайся дальше к своим целям с оптимизмом и уверенностью! 📚",
	"Секрет успеха - это настойчивость и упорство. Даже если путь к своим мечтам кажется трудным, не сдавайся. Продолжай двигаться вперед шаг за шагом, и ты обязательно достигнешь своих целей! 👣",
	"Будь храбрым в темных временах и верь в себя, когда все кажется потерянным. Внутри тебя сила, способная преодолеть любые трудности. Доверься своему внутреннему голосу и двигайся вперед смело! 🔥",
	"Ты - создатель своей судьбы. Не давай никому или чему-то другому контролировать твою жизнь. Верь в себя и свои способности, и иди к своим целям с уверенностью и решимостью! 🌟",
	"Помни, что твоя жизнь - это твое произведение искусства. Каждый день ты создаешь новые шедевры своими поступками, мыслями и решениями. Сделай свою жизнь произведением искусства, которым ты будешь гордиться! 🎨",
	"Каждый новый день - это возможность начать с чистого листа. Поверь в свои возможности, поверь в себя, и сделай этот день особенным. Ты способен на великие дела, если только будешь верить в себя и свои мечты! ✨",
	"Нет лучшего времени начать, чем сейчас. Не жди идеального момента или обстоятельств, чтобы начать двигаться к своим целям. Действуй прямо сейчас, и каждый день приближайся к своим мечтам! ⏳",
	"Поверь в свою силу и возможности. Ты обладаешь всем необходимым, чтобы добиться своих целей. Не сомневайся в себе, иди вперед с уверенностью и решимостью! 💪",
	"Твоя целеустремленность и настойчивость - твои сильнейшие оружия на пути к успеху. Не отступай перед трудностями, не позволяй себе унывать. Ты способен преодолеть все препятствия! 🚀",
	"Каждый новый день - это новая возможность преодолеть себя. Поставь перед собой новые вызовы, стремись к самосовершенствованию, и каждый день становись лучше, чем был вчера! 🌟",
	"Помни, что успех приходит к тем, кто не боится рисковать и не боится ошибаться. Не бойся сделать шаг в неизвестность, иди вперед смело, и ты обязательно добьешься своих целей! 🎯",
	"Будь готов к переменам и адаптируйся к ним с легкостью. Гибкость и умение приспосабливаться к новым условиям - это ключевые качества успешных людей. Иди вперед с открытым умом и сердцем! 🔄",
	"Никогда не останавливайся на достигнутом. Всегда ищи новые вызовы и возможности для роста и развития. Ты - бесконечно сильнее и мудрее, чем думаешь. Поверь в себя и свой потенциал! 🌈",
	"Успех - это не точка назначения, это путь. Не фокусируйся только на цели, наслаждайся процессом движения к ней. Каждый шаг на этом пути приближает тебя к своей мечте! 👣",
	"Помни, что твой внутренний огонь - твой самый сильный союзник на пути к успеху. Поддерживай его горящим, не позволяй сомнениям и страхам его потушить. Иди к своей цели с яростным пламенем в сердце! 🔥",
	"Возможности окружают нас повсюду, мы должны только быть готовы их заметить и воспользоваться ими. Не ограничивай свои возможности, иди вперед с открытым взглядом и готовностью к действию! 🌠",
	"Никогда не забывай, что ты - творец своей судьбы. Ты имеешь силу изменить свою жизнь к лучшему, начни прямо сейчас! Двигайся вперед смело и с уверенностью, и ничто не сможет помешать тебе! 💫",
];

let rndNum, textToSayHello, rndId;

//? ФУНКЦИИ

async function menuHome(chatId, exit = true) {
	try {
		rndNum = Math.floor(Math.random() * menuHomeText.length);

		if (exit) {
			await bot.editMessageText(`<b>${menuHomeText[rndNum]}</b>`, {
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId === chatId)
					.messageId,
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: "5️⃣:9️⃣ Счёт очков 1️⃣:3️⃣",
								callback_data: "gameScore",
							},
						],
						[
							{ text: "Мотивация 🦅", callback_data: "motivation" },
							{ text: "Профиль 👤", callback_data: "info" },
						],
						// [{ text: "📗 Судейский журнал 🧮", callback_data: "judgeMenu" }],
					],
				},
			});
		} else if (!exit) {
			await bot
				.sendMessage(chatId, `<b>${menuHomeText[rndNum]}</b>`, {
					parse_mode: "html",
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: "5️⃣:9️⃣ Счёт очков 1️⃣:3️⃣",
									callback_data: "gameScore",
								},
							],
							[
								{ text: "Мотивация 🦅", callback_data: "motivation" },
								{ text: "Профиль 👤", callback_data: "info" },
							],

							// [{ text: "📗 Судейский журнал 🧮", callback_data: "judgeMenu" }],
						],
					},
				})
				.then(
					(message) =>
						(usersData.find((obj) => obj.chatId === chatId).messageId =
							message.message_id)
				);
		}
	} catch (error) {
		console.log(error);
	}
}

async function netsporta(chatId) {
	try {
		await bot.editMessageText(
			`Помошник в <b><i>раннем доступе</i></b>🥴, и к сожалению доступны <b>не все</b> виды спорта! ☹️\n\nНо у тебя есть возможность создать <b>собственный матч по своим правилам,</b> нажав на раздел <i><b>"Свой ⚙️"!</b></i> 😉\n\n<b>• Остались вопросы? Пиши @qu1z3x</b>`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId === chatId)
					.messageId,
				reply_markup: {
					inline_keyboard: [
						[
							{ text: "⬅️Назад", callback_data: "gameScore" },
							{ text: "Написать✍️", url: "https://t.me/qu1z3x" },
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
	}
}

async function GameScore(chatId, historyIsClear = false) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		bot.editMessageText(
			`<b>5️⃣:9️⃣ <i>Счёт очков</i> 1️⃣:3️⃣\n\nЧто сегодня мы будем судить? 🧐</b>${
				scoreHistoryButtons.length != 0
					? `\n\n<a href ="https://t.me/${BotName}/?start=clearAllMatchHistory">Завершить незаконченые</a>`
					: `${
							historyIsClear
								? "\n\n<i>Незаконченые игры завершены! 😉</i>"
								: ""
					  }`
			}`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId === chatId)
					.messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						...scoreHistoryButtons,
						[
							{
								text: "🏀",
								callback_data: "basketballScores",
							},
							{
								text: "🏐",
								callback_data: "volleyballScores",
							},
							{
								text: "⚽",
								callback_data: "footballScores",
							},
							{
								text: "🏓",
								callback_data: "pinpongScores",
							},
						],
						[
							{ text: "⬅️В меню", callback_data: "exit" },
							{ text: "Свой ⚙️", callback_data: "exit" },
							{ text: "А где? ☹️", callback_data: "netsporta" },
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
	}
}

async function GameScoreCounting(
	chatId,
	sportNum = null,
	matchId = null,
	customCo1Score = null,
	customCo2Score = null
) {
	const dataAboutUser = usersData.find((obj) => obj.chatId === chatId);
	let co1Score,
		co2Score,
		dataAboutMatchText = "";
	try {
		if (sportNum != null) {
			do {
				rndId = Math.floor(Math.random() * 1000000000);
			} while (
				dataAboutUser.matchesData.some(
					(matchData) => matchData.matchId == rndId
				) &&
				dataAboutUser.matchesData.length != 0
			);
			// dataAboutUser.customOptionsForMatches.MAXquarterOfGame
			await dataAboutUser.matchesData.push({
				sportNum: sportNum,
				score: "0:0",
				scoresInQuarters: [],
				quarterOfGame: 1,
				MAXquarterOfGame:
					sportNum == 1 || sportNum == 2 || sportNum == 3 || sportNum == 4
						? 4
						: "",
				isOver: false,
				matchId: rndId,
			});

			[co1Score, co2Score] = dataAboutUser.matchesData[
				dataAboutUser.matchesData.length - 1
			].score
				.split(":")
				.map(Number);

			matchId = rndId;
		} else if (!sportNum) {
			[co1Score, co2Score] = dataAboutUser.matchesData
				.find((obj) => obj.matchId == matchId)
				.score.split(":")
				.map(Number);
		}
		console.log(dataAboutUser.matchesData);

		dataAboutUser.currentMatchId = dataAboutUser.matchesData.find(
			(obj) => obj.matchId == matchId
		).matchId;

		co1Score = customCo1Score != null ? customCo1Score : co1Score;
		co2Score = customCo2Score != null ? customCo2Score : co2Score;

		if (customCo1Score != null || customCo2Score != null) {
			dataAboutUser.matchesData.find(
				(obj) => obj.matchId == matchId
			).score = `${co1Score}:${co2Score}`;
		}

		if (
			dataAboutUser.matchesData.find((obj) => obj.matchId == matchId)
				.scoresInQuarters
		) {
			let i = 0;
			dataAboutUser.matchesData
				.find((obj) => obj.matchId == matchId)
				.scoresInQuarters.forEach((score) => {
					i++;
					dataAboutMatchText += `<b>${i}-й сегмент</b>\nСчет:  <b>${score}</b>\n\n`;
				});
		}

		bot.editMessageText(
			`<b><i>${
				dataAboutUser.matchesData.find((obj) => obj.matchId == matchId)
					.sportNum == 1
					? `🏀 Баскетбол • <code>${
							dataAboutUser.matchesData.find(
								(obj) => obj.matchId == matchId
							).matchId
					  }</code> ⛹️`
					: `${
							dataAboutUser.matchesData.find(
								(obj) => obj.matchId == matchId
							).sportNum == 2
								? `🏐 Волейбол • <code>${
										dataAboutUser.matchesData.find(
											(obj) => obj.matchId == matchId
										).matchId
								  }</code> 🏃`
								: `${
										dataAboutUser.matchesData.find(
											(obj) => obj.matchId == matchId
										).sportNum == 3
											? `⚽ Футбол • <code>${
													dataAboutUser.matchesData.find(
														(obj) => obj.matchId == matchId
													).matchId
											  }</code> 🏃`
											: `${
													dataAboutUser.matchesData.find(
														(obj) => obj.matchId == matchId
													).sportNum == 4
														? `🏓 Пинг-Понг • <code>${
																dataAboutUser.matchesData.find(
																	(obj) =>
																		obj.matchId == matchId
																).matchId
														  }</code> 🎾`
														: ""
											  }`
								  }`
					  }`
			} </i>\n\nДанные об игре:</b>\n\n${dataAboutMatchText}<b>${
				dataAboutUser.matchesData.find((obj) => obj.matchId == matchId)
					.quarterOfGame
			}-й сегмент</b>\nСчет:  <b>${co1Score} : ${co2Score}\n\nНе теряй внимательность! 😉</b>`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId === chatId)
					.messageId,
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: "⬆️",
								callback_data: `upScore1WithId${matchId}`,
							},
							{
								text: `${
									dataAboutUser.matchesData.find(
										(obj) => obj.matchId == matchId
									).quarterOfGame
								}-й`,
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
								callback_data: `exitingTheMatchWithId${matchId}`,
							},
							{
								text: "Завершить❌",
								callback_data: `endOfGameWithId${matchId}`,
							},
						],
					],
				},
			}
		);
		console.log(dataAboutUser);
	} catch (error) {
		console.log(error);
	}
}

function numberToEmoji(number) {
	const emojiDigits = [
		"0️⃣",
		"1️⃣",
		"2️⃣",
		"3️⃣",
		"4️⃣",
		"5️⃣",
		"6️⃣",
		"7️⃣",
		"8️⃣",
		"9️⃣",
	];
	return String(number)
		.split("")
		.map((digit) => emojiDigits[digit])
		.join("");
}

async function endOfGame(chatId, sportNum) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		bot.editMessageText(`<b></b>`, {
			parse_mode: "html",
			chat_id: chatId,
			message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
			disable_web_page_preview: true,
			reply_markup: {
				inline_keyboard: [[{ text: "", callback_data: "" }]],
			},
		});
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

async function Motivation(chatId) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		rndNum = Math.floor(Math.random() * motivationPhrases.length);

		bot.editMessageText(
			`<b><i>🔥 Мотивация 🦅</i>\n\n<code>"${motivationPhrases[rndNum]}"</code>\n\n© ChatGPT</b>`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							{ text: "⬅️В меню", callback_data: "exit" },
							{ text: "Еще 🔄️", callback_data: "motivation" },
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

async function info(chatId, firstName, userName, userId) {
	try {
		await bot.editMessageText(
			`<b>Твой профиль👤\n\nТвой логин: ${firstName} \n\nТвой id: ${userId}</b>`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId === chatId)
					.messageId,
				reply_markup: {
					inline_keyboard: [
						[{ text: "Поддержка💬", url: "https://t.me/qu1z3x" }],
						[{ text: "⬅️Назад", callback_data: "exit" }],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
	}
}

async function start(chatId, userName) {
	const dataAboutUser = usersData.find((obj) => obj.chatId === chatId);
	try {
		const dateNowHHNN = new Date().getHours() * 100 + new Date().getMinutes();
		if (dateNowHHNN < 1200 && dateNowHHNN >= 600)
			textToSayHello = "Физкульт-утра";
		else if (dateNowHHNN < 1700 && dateNowHHNN >= 1200)
			textToSayHello = "Физкульт-дня";
		else if (dateNowHHNN < 2200 && dateNowHHNN >= 1700)
			textToSayHello = "Физкульт-вечера";
		else if (dateNowHHNN >= 2200 || dateNowHHNN < 600)
			textToSayHello = "Физкульт-ночи";

		await bot
			.sendMessage(chatId, `<b>${textToSayHello}, ${userName}!</b>`, {
				parse_mode: "html",
			})
			.then((message) => (dataAboutUser.sayHi1 = message.message_id));
		await bot
			.sendMessage(
				chatId,
				"<b>Рад тебя видеть!😉</b> Я буду служить тебе <b><i>судьей, челом на замене, хорошим партнером</i></b> в играх! 🫡",
				{ parse_mode: "html" }
			)
			.then((message) => (dataAboutUser.sayHi2 = message.message_id));

		await bot
			.sendMessage(chatId, "ㅤ")
			.then((message) => (dataAboutUser.messageId = message.message_id));

		menuHome(chatId);
	} catch (error) {
		console.log(error);
	}
}

async function StartAll() {
	try {
		if (TOKEN == TOKENs[0]) {
			BotName = "digsch27_bot";
		} else if (TOKEN == TOKENs[1]) {
			BotName = "digjudgebot";
		}

		bot.on("message", async (message) => {
			const chatId = message.chat.id;
			const text = message.text;

			try {
				const dataAboutUser = usersData.find(
					(obj) => obj.chatId === chatId
				);
				if (!dataAboutUser) {
					usersData.push({
						chatId: chatId,
						firstName: message.from.first_name,
						messageId: message.message_id,
						userAction: "",

						// счета
						currentMatchId: "",
						matchesData: [],
						writeco1score: false,
						writeco2score: false,
					});
				}
				if (dataAboutUser || text == "/start" || text == "/restart") {
					if (
						dataAboutUser &&
						dataAboutUser.writeco1score &&
						/^\d+$/.test(text)
					) {
						dataAboutUser.writeco1score = false;

						GameScoreCounting(
							chatId,
							null,
							dataAboutUser.currentMatchId,
							text,
							null
						);
					} else if (
						dataAboutUser &&
						dataAboutUser.writeco2score &&
						/^\d+$/.test(text)
					) {
						dataAboutUser.writeco2score = false;
						GameScoreCounting(
							chatId,
							null,
							dataAboutUser.currentMatchId,
							null,
							text
						);
					}

					//? КОМАНДЫ

					switch (text) {
						case "S":
						case "/restart":
							if (!dataAboutUser) {
								try {
									start(chatId, message.from.first_name, false);
								} catch (error) {}
							} else if (dataAboutUser) {
								if (dataAboutUser.messageId != "") {
									menuHome(chatId);
								} else if (dataAboutUser.messageId == "") {
									try {
										menuHome(chatId, false);
										await bot.deleteMessage(
											chatId,
											dataAboutUser.messageId
										);
									} catch (error) {}
								}
							}
							break;
						case "/start":
							start(chatId, message.from.first_name);
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "/start clearAllMatchHistory":
							dataAboutUser.matchesData.forEach((match) => {
								match.isOver = true;
							});
							scoreHistoryButtons = [];
							GameScore(chatId, true);
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						default:
							break;
					}
				}
				bot.deleteMessage(chatId, message.message_id);
			} catch (error) {
				console.log(error);
				sendDataAboutError(chatId, `${String(error)}`);
			}
		});

		//? КЛАВИАТУРА

		bot.on("callback_query", (query) => {
			const chatId = query.message.chat.id;
			const data = query.data;

			const dataAboutUser = usersData.find((obj) => obj.chatId === chatId);

			if (!dataAboutUser) {
				usersData.push({
					chatId: chatId,
					firstName: query.from.first_name,
					messageId: query.message.message_id,
					// счета
					quarterCount: 1,
					basketScores: [],
					footScores: [],
					volleyScores: [],
					pinPongScores: [],
				});
			}

			if (dataAboutUser) {
				dataAboutUser.messageId = query.message.message_id;
			}

			let commandNum,
				matchId,
				co1Score = 0,
				co2Score = 0;
			if (data.includes("upScore") || data.includes("downScore")) {
				dataAboutUser.writeco1score = false;
				dataAboutUser.writeco2score = false;

				if (data.includes("upScore")) {
					let match = data.match(/^upScore(\d+)WithId(\d+)$/);
					commandNum = parseInt(match[1]);
					matchId = parseInt(match[2]);

					[co1Score, co2Score] = dataAboutUser.matchesData
						.find((obj) => obj.matchId == matchId)
						.score.split(":")
						.map(Number);

					if (commandNum == 1) ++co1Score;
					if (commandNum == 2) ++co2Score;
				}
				if (data.includes("downScore")) {
					let match = data.match(/^downScore(\d+)WithId(\d+)$/);

					commandNum = parseInt(match[1]);
					matchId = parseInt(match[2]);

					[co1Score, co2Score] = dataAboutUser.matchesData
						.find((obj) => obj.matchId == matchId)
						.score.split(":")
						.map(Number);

					if (commandNum == 1) co1Score -= 1;
					if (commandNum == 2) co2Score -= 1;
				}
				dataAboutUser.matchesData.find(
					(obj) => obj.matchId == matchId
				).score = `${co1Score}:${co2Score}`;

				GameScoreCounting(chatId, null, matchId);
			}
			if (data.includes("end ")) {
				let match = data.match(/^downscore(\d+)for(\d+)$/);
				matchId = parseInt(match[1]);
			}
			if (data.includes("exitingTheMatchWithId")) {
				let match = data.match(/^exitingTheMatchWithId(\d+)$/);
				matchId = parseInt(match[1]);

				dataAboutUser.writeco1score = false;
				dataAboutUser.writeco2score = false;
				if (
					dataAboutUser.matchesData.find(
						(obj) =>
							obj.matchId == matchId &&
							obj.score == "0:0" &&
							obj.quarterOfGame == 1
					)
				) {
					dataAboutUser.matchesData.splice(
						dataAboutUser.matchesData.indexOf(
							dataAboutUser.matchesData.find(
								(obj) => obj.matchId == matchId && obj.score == "0:0"
							)
						),
						1
					);
				}
				if (
					!dataAboutUser.matchesData.find(
						(obj) =>
							obj.matchId == matchId &&
							obj.score == "0:0" &&
							obj.quarterOfGame == 1
					)
				) {
					// Очищаем массив scoreHistoryButtons
					scoreHistoryButtons = [];

					// Проходимся по элементам в dataAboutuser.matchesData
					dataAboutUser.matchesData.forEach((match) => {
						// Если isOver == false, добавляем элемент в scoreHistoryButtons
						if (match.isOver == false) {
							scoreHistoryButtons.push([
								{
									text: `${
										match.sportNum == 1
											? "🏀"
											: `${
													match.sportNum == 2
														? "🏐"
														: `${
																match.sportNum == 3
																	? "⚽"
																	: `${
																			match.sportNum == 4
																				? "🏓"
																				: `${
																						match.sportNum ==
																						5
																							? "⚙️"
																							: ``
																				  }`
																	  }`
														  }`
											  }`
									} Продолжить ( ${match.score} ) - ${
										match.quarterOfGame
									}-й
												`,
									callback_data: `matchWithId${match.matchId}`,
								},
							]);
						}
					});
				}

				GameScore(chatId);
			}

			if (data.includes("toggleWriteScore")) {
				let match = data.match(/^toggleWriteScore(\d+)WithId(\d+)$/);

				commandNum = parseInt(match[1]);
				matchId = parseInt(match[2]);

				if (commandNum == 1) {
					dataAboutUser.writeco1score = !dataAboutUser.writeco1score;
					dataAboutUser.writeco2score = false;
				} else if (commandNum == 2) {
					dataAboutUser.writeco1score = false;
					dataAboutUser.writeco2score = !dataAboutUser.writeco2score;
				}

				GameScoreCounting(chatId, null, matchId);
			}

			if (data.includes("matchWithId")) {
				let match = data.match(/^matchWithId(\d+)$/);

				matchId = parseInt(match[1]);

				GameScoreCounting(chatId, null, matchId);
			}

			if (data.includes("addQuarterWithId")) {
				try {
					let match = data.match(/^addQuarterWithId(\d+)$/);

					matchId = parseInt(match[1]);

					let [co1Score, co2Score] = dataAboutUser.matchesData
						.find((obj) => obj.matchId == matchId)
						.score.split(":")
						.map(Number);

					dataAboutUser.matchesData
						.find((obj) => obj.matchId == matchId)
						.scoresInQuarters.push(`${co1Score}:${co2Score}`);
					dataAboutUser.matchesData.find(
						(obj) => obj.matchId == matchId
					).quarterOfGame += 1;

					GameScoreCounting(chatId, null, matchId);
				} catch (error) {
					console.log(error);
					sendDataAboutError(chatId, `${String(error)}`);
				}
			}

			if (data.includes("endOfGameWithId")) {
				let match = data.match(/^endOfGameWithId(\d+)$/);

				matchId = parseInt(match[1]);

				dataAboutUser.matchesData.find(
					(obj) => obj.matchId == matchId
				).isOver = true;

				endOfGame(chatId);
			}

			//? Клавиатура

			switch (data) {
				case "judgeMenu":
					JudgeMenu(chatId);
					break;
				case "exit":
					menuHome(chatId);
					break;
				case "netsporta":
					netsporta(chatId);
					break;
				case "basketballScores":
					GameScoreCounting(chatId, 1);
					break;
				case "volleyballScores":
					GameScoreCounting(chatId, 2);
					break;
				case "footballScores":
					GameScoreCounting(chatId, 3);
					break;
				case "pinpongScores":
					GameScoreCounting(chatId, 4);
					break;
				case "gameScore":
					dataAboutUser.writeco1score = false;
					dataAboutUser.writeco2score = false;
					GameScore(chatId);
					break;
				case "endOfGame":
					dataAboutUser.writeco1score = false;
					dataAboutUser.writeco2score = false;

					switch (dataAboutUser.currentSportNum) {
						case 1:
							if (
								dataAboutUser.basketScores[
									dataAboutUser.basketScores.length - 1
								]
							)
								dataAboutUser.basketScores[
									dataAboutUser.basketScores.length - 1
								].isOver = true;

							break;
						case 2:
							if (
								dataAboutUser.volleyScores[
									dataAboutUser.volleyScores.length - 1
								]
							)
								dataAboutUser.volleyScores[
									dataAboutUser.volleyScores.length - 1
								].isOver = true;

							break;
						case 3:
							if (
								dataAboutUser.footScores[
									dataAboutUser.footScores.length - 1
								]
							)
								dataAboutUser.footScores[
									dataAboutUser.footScores.length - 1
								].isOver = true;

							break;
						case 4:
							if (
								dataAboutUser.pinPongScores[
									dataAboutUser.pinPongScores.length - 1
								]
							)
								dataAboutUser.pinPongScores[
									dataAboutUser.pinPongScores.length - 1
								].isOver = true;
							break;
					}
					//TODO:
					endOfGame(chatId, dataAboutUser.currentSportNum);
					break;
				case "":
					break;
				case "":
					break;
				case "info":
					info(
						chatId,
						query.from.first_name,
						query.from.username,
						query.from.id
					);
					break;
				case "motivation":
					Motivation(chatId);
					break;

				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				default:
					break;
			}
		});
	} catch (error) {
		console.log(error);
	}
}

StartAll();
