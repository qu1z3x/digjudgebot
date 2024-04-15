import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import fs from "fs";

import { sendDataAboutButton } from "./sportterminal.js";
import { sendDataAboutError } from "./sportterminal.js";

const TOKENs = [
	"6654105779:AAEnCdIzKS_cgJUg4rMY8yNM3LPP5iZ-d_A",
	"6858989950:AAH5tFy09SfJcD71mJoa4sB4lHEyWzw8nrQ",
];

const TOKEN = TOKENs[1]; // 1 - оригинал
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
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		dataAboutUser.userAction = "menuHome";
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
							{ text: "Настройки ⚙️", callback_data: "options" },
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
								{ text: "Настройки ⚙️", callback_data: "options" },
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
		// Но у тебя есть возможность создать <b>собственный матч по своим правилам,</b> нажав на раздел <i><b>"Свой ⚙️"!</b></i> 😉
		await bot.editMessageText(
			`Помошник в <b><i>раннем доступе</i></b>🥴, и к сожалению доступны <b>не все</b> виды спорта! ☹️\n\n<b>Есть идеи? Пиши @qu1z3x</b>`,
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
		dataAboutUser.userAction = "GameScore";

		await bot.editMessageText(
			`<b>5️⃣:9️⃣ <i>Счёт очков</i> 1️⃣:3️⃣\n\nЧто сегодня будем судить? 🧐</b>${
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
								callback_data: "CreationNewMatchWithSportNum1",
							},
							{
								text: "🏐",
								callback_data: "CreationNewMatchWithSportNum2",
							},
							{
								text: "⚽",
								callback_data: "CreationNewMatchWithSportNum3",
							},
							{
								text: "🏓",
								callback_data: "CreationNewMatchWithSportNum4",
							},
						],
						[
							{ text: "⬅️В меню", callback_data: "exit" },
							// {
							// 	text: "Свой ⚙️",
							// 	callback_data: "CreationNewMatchWithSportNum5",
							// },
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

async function CreationNewMatch(
	chatId,
	matchId,
	sportNum = null,
	processOfNamingC1 = false,
	processOfNamingC2 = false,
	processOfAddScoreTarget = false,
	matchIdForCopySettigs = null
) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		if (!matchId) {
			do {
				rndId = Math.floor(Math.random() * 1000000000);
			} while (
				dataAboutUser.matchesData.some(
					(matchData) => matchData.matchId == rndId
				) &&
				dataAboutUser.matchesData.length != 0
			);
			await dataAboutUser.matchesData.push({
				matchId: rndId,
				sportNum: sportNum,
				score: "0:0",
				firstScoreTarget:
					sportNum == 1
						? 100
						: sportNum == 2
						? 25
						: sportNum == 3
						? 3
						: sportNum == 4
						? 11
						: sportNum == 5
						? 0
						: null,
				scoreTarget:
					sportNum == 1
						? 100
						: sportNum == 2
						? 25
						: sportNum == 3
						? 3
						: sportNum == 4
						? 11
						: sportNum == 5
						? 0
						: null,
				quarterOfGame: 1,
				startDate: null,
				startTime: null,
				timeOfAllGame: "",
				nameForCom1: "Синие",
				nameForCom2: "Красные",
				scoresInQuarters: [],
				matchIsСreated: false,
				isOver: false,
			});

			matchId = rndId;
		}

		let dataAboutMatch = dataAboutUser.matchesData.find(
			(obj) => obj.matchId == matchId
		);

		if (
			matchIdForCopySettigs != null &&
			dataAboutUser.matchesData.find(
				(obj) => obj.matchId == matchIdForCopySettigs
			)
		) {
			let dataAboutMatchForCopySettings = dataAboutUser.matchesData.find(
				(obj) => obj.matchId == matchIdForCopySettigs
			);

			dataAboutMatch.sportNum = dataAboutMatchForCopySettings.sportNum;
			dataAboutMatch.nameForCom1 = dataAboutMatchForCopySettings.nameForCom1;
			dataAboutMatch.nameForCom2 = dataAboutMatchForCopySettings.nameForCom2;
			dataAboutMatch.scoreTarget =
				dataAboutMatchForCopySettings.firstScoreTarget;
			dataAboutMatch.firstScoreTarget =
				dataAboutMatchForCopySettings.firstScoreTarget;
		}

		dataAboutUser.currentMatchId = matchId;
		dataAboutUser.userAction = "CreationNewMatch";

		await bot.editMessageText(
			`<b><i>${
				dataAboutMatch.sportNum == 1
					? `🏀 Баскетбол`
					: `${
							dataAboutMatch.sportNum == 2
								? `🏐 Волейбол`
								: `${
										dataAboutMatch.sportNum == 3
											? `⚽ Футбол`
											: `${
													dataAboutMatch.sportNum == 4
														? `🏓 Пинг-Понг`
														: `${
																dataAboutMatch.sportNum == 5
																	? `⚙️ Кастомный`
																	: ""
														  }`
											  }`
								  }`
					  }`
			}</i> • Параметры ⚙️\n\nКоманды:</b>\n\n${
				dataAboutMatch.nameForCom1 && dataAboutMatch.nameForCom1 != "Синие"
					? `<a href = "https://t.me/${BotName}/?start=resetNameForCommand1InCreationNewMatchWithId${matchId}">🔄️</a> ${dataAboutMatch.nameForCom1}`
					: `${
							processOfNamingC1
								? `<a href="https://t.me/${BotName}/?start=CreationNewMatchWithId${matchId}">❌</a> ...`
								: `<a href="https://t.me/${BotName}/?start=nameCommand1InCreationNewMatchWithId${matchId}">✏️</a> Синие`
					  }`
			}  :  ${
				dataAboutMatch.nameForCom2 &&
				dataAboutMatch.nameForCom2 != "Красные"
					? `${dataAboutMatch.nameForCom2} <a href = "https://t.me/${BotName}/?start=resetNameForCommand2InCreationNewMatchWithId${matchId}">🔄️</a>`
					: `${
							processOfNamingC2
								? `... <a href="https://t.me/${BotName}/?start=CreationNewMatchWithId${matchId}">❌</a>`
								: `Красные <a href="https://t.me/${BotName}/?start=nameCommand2InCreationNewMatchWithId${matchId}">✏️</a>`
					  }`
			}\n\n<b>Ограничения:</b>\n\nПо счету: ${
				dataAboutMatch.scoreTarget == 0 && !processOfAddScoreTarget
					? `<b>Нет <a href="https://t.me/${BotName}/?start=addScoreTargetInCreationNewMatchWithId${matchId}">✏️</a></b>`
					: processOfAddScoreTarget
					? `<b>... <a href="https://t.me/${BotName}/?start=CreationNewMatchWithId${matchId}">❌</a></b>`
					: `<b>${dataAboutMatch.scoreTarget} ${
							(dataAboutMatch.scoreTarget >= 5 &&
								dataAboutMatch.scoreTarget <= 20) ||
							(dataAboutMatch.scoreTarget % 10 >= 5 &&
								dataAboutMatch.scoreTarget % 10 <= 9) ||
							dataAboutMatch.scoreTarget % 10 == 0
								? "очков"
								: `${
										dataAboutMatch.scoreTarget % 10 == 1
											? "очко"
											: `${
													dataAboutMatch.scoreTarget % 10 >= 2 &&
													dataAboutMatch.scoreTarget % 10 <= 4
														? "очка"
														: ``
											  }`
								  }`
					  }</b> <a href="https://t.me/${BotName}/?start=addScoreTargetInCreationNewMatchWithId${matchId}">✏️</a>`
			}`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: "⬅️Назад ",
								callback_data: `${
									dataAboutMatch.matchIsСreated
										? `matchWithId${matchId}`
										: "gameScore"
								}`,
							},
							{
								text: `${
									dataAboutMatch.matchIsСreated ? "" : "Начать ✅"
								}`,
								callback_data: `matchWithId${matchId}`,
							},
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

async function GameScoreCounting(
	chatId,
	matchId = null,
	customCo1Score = null,
	customCo2Score = null,
	moreAboutQuarters = false
) {
	const dataAboutUser = usersData.find((obj) => obj.chatId === chatId);

	let co1Score,
		co2Score,
		dataAboutMatchText = "",
		dataAboutMatch;

	try {
		dataAboutMatch = dataAboutUser.matchesData.find(
			(obj) => obj.matchId == matchId
		);

		if (dataAboutUser.userAction == "CreationNewMatch") {
			dataAboutMatch.startDate = new Date();
			dataAboutMatch.startTime = new Date().toLocaleTimeString("ru-RU", {
				hour12: false,
				hour: "2-digit",
				minute: "2-digit",
				timeZone: "Europe/Moscow",
			});
			dataAboutMatch.matchIsСreated = true;

			console.log("time is update");
		}

		dataAboutUser.userAction = "GameScoreCounting";

		[co1Score, co2Score] = dataAboutMatch.score.split(":").map(Number);

		dataAboutUser.currentMatchId = dataAboutMatch.matchId;

		co1Score = customCo1Score != null ? customCo1Score : co1Score;
		co2Score = customCo2Score != null ? customCo2Score : co2Score;

		if (customCo1Score != null || customCo2Score != null) {
			dataAboutMatch.score = `${parseInt(co1Score)} : ${parseInt(co2Score)}`;
		}

		if (dataAboutMatch.scoresInQuarters) {
			let i = 0;
			dataAboutMatch.scoresInQuarters.forEach((score) => {
				let [s1, s2] = score.split(":").map(Number);
				i++;
				dataAboutMatchText += `<b>• ${i}-й сегмент</b>\nСчет:  <b>${s1} : ${s2}</b>\n\n`;
			});
		}

		await bot.editMessageText(
			`<b><i>${
				dataAboutMatch.sportNum == 1
					? `🏀 Баскетбол • <code>${dataAboutMatch.matchId}</code> ⛹️`
					: `${
							dataAboutMatch.sportNum == 2
								? `🏐 Волейбол • <code>${dataAboutMatch.matchId}</code> 🏃`
								: `${
										dataAboutMatch.sportNum == 3
											? `⚽ Футбол • <code>${dataAboutMatch.matchId}</code> 🏃`
											: `${
													dataAboutMatch.sportNum == 4
														? `🏓 Пинг-Понг • <code>${dataAboutMatch.matchId}</code> 🎾`
														: `${
																dataAboutMatch.sportNum == 5
																	? `⚙️ Кастомный  • <code>${dataAboutMatch.matchId}</code> ⚙️`
																	: ""
														  }`
											  }`
								  }`
					  }`
			}\n\nДанные об игре:</i>\n\n${
				co1Score > co2Score
					? `<u>${dataAboutMatch.nameForCom1}</u>`
					: `${dataAboutMatch.nameForCom1}`
			} ${numberToEmoji(co1Score)}  :  ${numberToEmoji(co2Score)} ${
				co2Score > co1Score
					? `<u>${dataAboutMatch.nameForCom2}</u>`
					: `${dataAboutMatch.nameForCom2}`
			}\n\n</b>${
				moreAboutQuarters
					? `<blockquote><b><i>Сегменты:\n\n</i>${dataAboutMatchText}• ${
							dataAboutMatch.quarterOfGame
					  }-й сегмент\nСчет:  ${co1Score} : ${co2Score}\n\n</b>${
							dataAboutMatch.quarterOfGame > 1
								? `<a href="https://t.me/${BotName}/?start=moreAboutQuartersHideInCreationNewMatchWithId${matchId}">Скрыть</a>\n`
								: ""
					  }</blockquote>`
					: `<blockquote><b><i>Сегменты:\n\n</i>${
							dataAboutMatch.quarterOfGame
					  }-й сегмент</b>\nСчет:  <b>${co1Score} : ${co2Score}</b>\n${
							dataAboutMatch.quarterOfGame > 1
								? `<a href="https://t.me/${BotName}/?start=moreAboutQuartersShowInCreationNewMatchWithId${matchId}">Подробнее..</a>\n`
								: ""
					  }</blockquote>`
			}Начало: <b>в ${
				dataAboutMatch.startTime
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
								text: `${dataAboutMatch.quarterOfGame}-й`,
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
							{
								text: "⚙️",
								callback_data: `optionsForMatchWithId${matchId}`,
							},
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
									co1Score != 0 || co2Score != 0 ? "Завершить❌" : ""
								}`,
								callback_data: `endOfGameWithId${matchId}`,
							},
						],
					],
				},
			}
		);
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

async function endOfGame(
	chatId,
	matchId,
	moreAboutQuarters = false,
	numOfStage = 1
) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
	const dataAboutMatch = dataAboutUser.matchesData.find(
		(obj) => obj.matchId == matchId
	);

	let co1Score,
		co2Score,
		dataAboutMatchText = "";

	try {
		[co1Score, co2Score] = dataAboutMatch.score.split(":").map(Number);

		switch (numOfStage) {
			case 1:
				dataAboutUser.userAction = "endOfGame1";

				if (!dataAboutMatch.isOver) {
					dataAboutMatch.scoresInQuarters.push(`${co1Score}:${co2Score}`);

					dataAboutMatch.isOver = true;
				}

				if (dataAboutMatch.timeOfAllGame == "") {
					dataAboutMatch.timeOfAllGame = new Date(
						Math.floor((new Date() - dataAboutMatch.startDate) / 1000) *
							1000
					)
						.toISOString()
						.substr(14, 5);
				}

				if (dataAboutMatch.scoresInQuarters && moreAboutQuarters) {
					let i = 0;
					dataAboutMatch.scoresInQuarters.forEach((score) => {
						let [s1, s2] = score.split(":").map(Number);
						i++;
						dataAboutMatchText += `\n\n<b>• ${i}-й сегмент</b>\nСчет:  <b>${s1} : ${s2}</b>`;
					});
				}

				await bot.editMessageText(
					`<b><i>${
						dataAboutMatch.sportNum == 1
							? "🏀"
							: `${
									dataAboutMatch.sportNum == 2
										? "🏐"
										: `${
												dataAboutMatch.sportNum == 3
													? "⚽"
													: `${
															dataAboutMatch.sportNum == 4
																? "🏓"
																: `${
																		dataAboutMatch.sportNum ==
																		5
																			? "⚙️"
																			: ``
																  }`
													  }`
										  }`
							  }`
					} Игра окончена</i> ❌\n\n${numberToEmoji(
						co1Score
					)} : ${numberToEmoji(co2Score)}\n\n${
						co1Score == co2Score
							? "🤷‍♂️ Ничья 🤷 \n"
							: co1Score > co2Score
							? `${dataAboutMatch.nameForCom1} - ${co1Score}🥇`
							: co1Score < co2Score
							? `${dataAboutMatch.nameForCom2} - ${co2Score}🥇`
							: ``
					}\n${
						co1Score == co2Score
							? ""
							: co1Score > co2Score
							? `${
									dataAboutMatch.nameForCom2
							  } - ${co2Score}🥈\n\n</b>Отрыв: <b>${
									co1Score - co2Score
							  } ${
									(co1Score - co2Score >= 5 &&
										co1Score - co2Score <= 20) ||
									(parseInt(co1Score - co2Score) % 10 >= 5 &&
										parseInt(co1Score - co2Score) % 10 <= 9)
										? "очков"
										: `${
												(co1Score - co2Score) % 10 == 1
													? "очко"
													: `${
															(co1Score - co2Score) % 10 >= 2 &&
															(co1Score - co2Score) % 10 <= 4
																? "очка"
																: ``
													  }`
										  }`
							  }\n`
							: co1Score < co2Score
							? `${
									dataAboutMatch.nameForCom1
							  } - ${co1Score}🥈\n\n</b>Отрыв: <b>${
									co2Score - co1Score
							  } ${
									(co2Score - co1Score >= 5 &&
										co2Score - co1Score <= 20) ||
									(parseInt(co2Score - co1Score) % 10 >= 5 &&
										parseInt(co2Score - co1Score) % 10 <= 9)
										? "очков"
										: `${
												(co2Score - co1Score) % 10 == 1
													? "очко"
													: `${
															(co2Score - co1Score) % 10 >= 2 &&
															(co2Score - co1Score) % 10 <= 4
																? "очка"
																: ``
													  }`
										  }`
							  }\n`
							: ``
					}</b>Начало: <b>в ${
						dataAboutMatch.startTime
					}</b>\nДлительность: <b>${dataAboutMatch.timeOfAllGame}</b>${
						moreAboutQuarters
							? `\n<blockquote>Сегментов: <b>${dataAboutMatch.quarterOfGame} - <a href="https://t.me/${BotName}/?start=moreAboutQuartersHideInEndOfGameWithId${matchId}">cкрыть</a>${dataAboutMatchText}</b></blockquote>\n\n<b>Id матча:</b> <code>${matchId}</code>`
							: `<blockquote>Сегментов: <b>${dataAboutMatch.quarterOfGame} - <a href="https://t.me/${BotName}/?start=moreAboutQuartersShowInEndOfGameWithId${matchId}">подробнее</a></b></blockquote>`
					}`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: `${
											dataAboutMatch.sportNum == 1
												? "🏀"
												: `${
														dataAboutMatch.sportNum == 2
															? "🏐"
															: `${
																	dataAboutMatch.sportNum == 3
																		? "⚽"
																		: `${
																				dataAboutMatch.sportNum ==
																				4
																					? "🏓"
																					: `${
																							dataAboutMatch.sportNum ==
																							5
																								? "⚙️"
																								: ``
																					  }`
																		  }`
															  }`
												  }`
										} Реванш 🔄️`,
										callback_data: `copySettingsFromMatchWithId${dataAboutMatch.matchId}`,
									},
								],
								[
									{
										text: "⬅️Назад",
										callback_data: `gameScore`,
									},

									{
										text: "История 💾",
										callback_data: "historyOfMatches",
									},
								],
							],
						},
					}
				);
				break;
			case 2:
				dataAboutUser.userAction = "endOfGame2";

				dataAboutMatch.scoreTarget = 0;

				await bot.editMessageText(
					`<b><i>${
						dataAboutMatch.sportNum == 1
							? `🏀 Баскетбол • <code>${dataAboutMatch.matchId}</code> ⛹️`
							: `${
									dataAboutMatch.sportNum == 2
										? `🏐 Волейбол • <code>${dataAboutMatch.matchId}</code> 🏃`
										: `${
												dataAboutMatch.sportNum == 3
													? `⚽ Футбол • <code>${dataAboutMatch.matchId}</code> 🏃`
													: `${
															dataAboutMatch.sportNum == 4
																? `🏓 Пинг-Понг • <code>${dataAboutMatch.matchId}</code> 🎾`
																: `${
																		dataAboutMatch.sportNum ==
																		5
																			? `⚙️ Кастомный  • <code>${dataAboutMatch.matchId}</code> ⚙️`
																			: ""
																  }`
													  }`
										  }`
							  }`
					}</i>\n\n${
						co1Score > co2Score
							? `<u>${dataAboutMatch.nameForCom1}</u>`
							: `${dataAboutMatch.nameForCom1}`
					} ${numberToEmoji(co1Score)}  :  ${numberToEmoji(co2Score)} ${
						co2Score > co1Score
							? `<u>${dataAboutMatch.nameForCom2}</u>`
							: `${dataAboutMatch.nameForCom2}`
					}</b>\n\n${
						co1Score > co2Score
							? `Команда <b>"${
									dataAboutMatch.nameForCom1
							  }"</b> - достигла отметки в <b>${co1Score} ${
									(co1Score >= 5 && co1Score <= 20) ||
									(co1Score % 10 >= 5 && co1Score % 10 <= 9) ||
									co1Score % 10 == 0
										? "очков"
										: `${
												co1Score % 10 == 1
													? "очко"
													: `${
															co1Score % 10 >= 2 &&
															co1Score % 10 <= 4
																? "очка"
																: ``
													  }`
										  }`
							  }!</b>`
							: co1Score < co2Score
							? `Команда <b>"${
									dataAboutMatch.nameForCom2
							  }"</b> - достигла отметки в <b>${co2Score} ${
									(co2Score >= 5 && co2Score <= 20) ||
									(co2Score % 10 >= 5 && co2Score % 10 <= 9) ||
									co2Score % 10 == 0
										? "очков"
										: `${
												co2Score % 10 == 1
													? "очко"
													: `${
															co2Score % 10 >= 2 &&
															co2Score % 10 <= 4
																? "очка"
																: ``
													  }`
										  }`
							  }!</b>`
							: ``
					}\n\nПродолжить матч <b>${
						dataAboutMatch.quarterOfGame + 1 == 2 ? "во" : "в"
					} ${dataAboutMatch.quarterOfGame + 1}-м сегменте до ${parseInt(
						dataAboutMatch.firstScoreTarget *
							(dataAboutMatch.quarterOfGame + 1)
					)} ${
						(parseInt(
							dataAboutMatch.firstScoreTarget *
								(dataAboutMatch.quarterOfGame + 1)
						) >= 5 &&
							parseInt(
								dataAboutMatch.firstScoreTarget *
									(dataAboutMatch.quarterOfGame + 1)
							) <= 20) ||
						(parseInt(
							dataAboutMatch.firstScoreTarget *
								(dataAboutMatch.quarterOfGame + 1)
						) %
							10 >=
							5 &&
							parseInt(
								dataAboutMatch.firstScoreTarget *
									(dataAboutMatch.quarterOfGame + 1)
							) %
								10 <=
								9) ||
						parseInt(
							dataAboutMatch.firstScoreTarget *
								(dataAboutMatch.quarterOfGame + 1)
						) %
							10 ==
							0
							? "очков"
							: `${
									parseInt(
										dataAboutMatch.firstScoreTarget *
											(dataAboutMatch.quarterOfGame + 1)
									) %
										10 ==
									1
										? "очка"
										: `${
												parseInt(
													dataAboutMatch.firstScoreTarget *
														(dataAboutMatch.quarterOfGame + 1)
												) %
													10 >=
													2 &&
												parseInt(
													dataAboutMatch.firstScoreTarget *
														(dataAboutMatch.quarterOfGame + 1)
												) %
													10 <=
													4
													? "очков"
													: ``
										  }`
							  }`
					},</b> или <b>завершить его с текущим результатом?</b> 🤔`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: `Продолжить ( ${
											dataAboutMatch.quarterOfGame + 1 == 2
												? "во"
												: "в"
										} ${
											dataAboutMatch.quarterOfGame + 1
										}-м сегм ) ✅`,
										callback_data: `continueAndAddQuarterForMatchWithId${dataAboutMatch.matchId}`,
									},
								],
								[
									{
										text: "⬅️Без сегмента",
										callback_data: `matchWithId${dataAboutMatch.matchId}`,
									},
									{
										text: "Завершить ❌",
										callback_data: `endOfGameWithId${dataAboutMatch.matchId}`,
									},
								],
							],
						},
					}
				);
				break;
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

async function historyOfMatches(chatId, sportNumForHistory = 0) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
	try {
		let historyOfMatchesText = "";

		switch (sportNumForHistory) {
			case 0:
				if (dataAboutUser.matchesData.filter((obj) => obj.isOver)) {
					historyOfMatchesText = `<b>Все матчи:\n\n</b>`;
					dataAboutUser.matchesData
						.filter((obj) => obj.isOver)
						.forEach((matchData) => {
							let [co1Score, co2Score] = matchData.score
								.split(":")
								.map(Number);

							historyOfMatchesText += `${
								matchData.sportNum == 1
									? "🏀 Баскетбол"
									: `${
											matchData.sportNum == 2
												? "🏐 Волейбол"
												: `${
														matchData.sportNum == 3
															? "⚽ Футбол"
															: `${
																	matchData.sportNum == 4
																		? "🏓 Пинг-понг"
																		: `${
																				matchData.sportNum ==
																				5
																					? "⚙️ Кастомный"
																					: ``
																		  }`
															  }`
												  }`
									  }`
							} • ${matchData.startDate.getDate()}.${
								matchData.startDate.getMonth() + 1
							}.${matchData.startDate
								.getFullYear()
								.toString()
								.slice(-2)}\n<b>${co1Score}  :  ${co2Score}  -  ${
								matchData.quarterOfGame
							} сегм.</b>\n<b><a href="https://t.me/${BotName}/?start=moreAboutMatchWithId${
								matchData.matchId
							}">О матче</a> • <a href="https://t.me/${BotName}/?start=copySettingsFromMatchWithId${
								matchData.matchId
							}">Повторить</a></b>\n\n`;
						});
				}

				break;
			case 1:
				if (
					dataAboutUser.matchesData.filter(
						(obj) => obj.isOver && obj.sportNum == 1
					)
				) {
					historyOfMatchesText = `<b>Только баскетбольные матчи:\n\n</b>`;
					dataAboutUser.matchesData
						.filter((obj) => obj.isOver && obj.sportNum == 1)
						.forEach((matchData) => {
							let [co1Score, co2Score] = matchData.score
								.split(":")
								.map(Number);

							historyOfMatchesText += `🏀 Баскетбол • ${matchData.startDate.getDate()}.${
								matchData.startDate.getMonth() + 1
							}.${matchData.startDate
								.getFullYear()
								.toString()
								.slice(-2)}\n<b>${co1Score}  :  ${co2Score}  -  ${
								matchData.quarterOfGame
							} сегм.\n<a href="https://t.me/${BotName}/?start=moreAboutMatchWithId${
								matchData.matchId
							}">О матче</a> • <a href="https://t.me/${BotName}/?start=copySettingsFromMatchWithId${
								matchData.matchId
							}">Повторить</a></b>\n\n`;
						});
				}
				break;
			case 2:
				if (
					dataAboutUser.matchesData.filter(
						(obj) => obj.isOver && obj.sportNum == 2
					)
				) {
					historyOfMatchesText = `<b>Только волейбольные матчи:\n\n</b>`;
					dataAboutUser.matchesData
						.filter((obj) => obj.isOver && obj.sportNum == 2)
						.forEach((matchData) => {
							let [co1Score, co2Score] = matchData.score
								.split(":")
								.map(Number);

							historyOfMatchesText += `🏐 Волейбол • ${matchData.startDate.getDate()}.${
								matchData.startDate.getMonth() + 1
							}.${matchData.startDate
								.getFullYear()
								.toString()
								.slice(-2)}\n<b>${co1Score}  :  ${co2Score}  -  ${
								matchData.quarterOfGame
							} сегм.\n<a href="https://t.me/${BotName}/?start=moreAboutMatchWithId${
								matchData.matchId
							}">О матче</a> • <a href="https://t.me/${BotName}/?start=copySettingsFromMatchWithId${
								matchData.matchId
							}">Повторить</a></b>\n\n`;
						});
				}
				break;
			case 3:
				if (
					dataAboutUser.matchesData.filter(
						(obj) => obj.isOver && obj.sportNum == 3
					)
				) {
					historyOfMatchesText = `<b>Только футбольные матчи:\n\n</b>`;
					dataAboutUser.matchesData
						.filter((obj) => obj.isOver && obj.sportNum == 3)
						.forEach((matchData) => {
							let [co1Score, co2Score] = matchData.score
								.split(":")
								.map(Number);

							historyOfMatchesText += `⚽ Футбол • ${matchData.startDate.getDate()}.${
								matchData.startDate.getMonth() + 1
							}.${matchData.startDate
								.getFullYear()
								.toString()
								.slice(-2)}\n<b>${co1Score}  :  ${co2Score}  -  ${
								matchData.quarterOfGame
							} сегм.\n<a href="https://t.me/${BotName}/?start=moreAboutMatchWithId${
								matchData.matchId
							}">О матче</a> • <a href="https://t.me/${BotName}/?start=copySettingsFromMatchWithId${
								matchData.matchId
							}">Повторить</a></b>\n\n`;
						});
				}
				break;
			case 4:
				if (
					dataAboutUser.matchesData.filter(
						(obj) => obj.isOver && obj.sportNum == 4
					)
				) {
					historyOfMatchesText = `<b>Только теннисные матчи:\n\n</b>`;
					dataAboutUser.matchesData
						.filter((obj) => obj.isOver && obj.sportNum == 4)
						.forEach((matchData) => {
							let [co1Score, co2Score] = matchData.score
								.split(":")
								.map(Number);

							historyOfMatchesText += `🏓 Пинг-понг • ${matchData.startDate.getDate()}.${
								matchData.startDate.getMonth() + 1
							}.${matchData.startDate
								.getFullYear()
								.toString()
								.slice(-2)}\n<b>${co1Score}  :  ${co2Score}  -  ${
								matchData.quarterOfGame
							} сегм.\n<a href="https://t.me/${BotName}/?start=moreAboutMatchWithId${
								matchData.matchId
							}">О матче</a> • <a href="https://t.me/${BotName}/?start=copySettingsFromMatchWithId${
								matchData.matchId
							}">Повторить</a></b>\n\n`;
						});
				}
				break;
			case 5:
				if (
					dataAboutUser.matchesData.filter(
						(obj) => obj.isOver && obj.sportNum == 5
					)
				) {
					historyOfMatchesText = `<b>Только кастомные матчи:\n\n</b>`;
					dataAboutUser.matchesData
						.filter((obj) => obj.isOver && obj.sportNum == 5)
						.forEach((matchData) => {
							let [co1Score, co2Score] = matchData.score
								.split(":")
								.map(Number);

							historyOfMatchesText += `⚙️ Кастомный • ${matchData.startDate.getDate()}.${
								matchData.startDate.getMonth() + 1
							}.${matchData.startDate
								.getFullYear()
								.toString()
								.slice(-2)}\n<b>${co1Score}  :  ${co2Score}  -  ${
								matchData.quarterOfGame
							} сегм.\n<a href="https://t.me/${BotName}/?start=moreAboutMatchWithId${
								matchData.matchId
							}">О матче</a> • <a href="https://t.me/${BotName}/?start=copySettingsFromMatchWithId${
								matchData.matchId
							}">Повторить</a></b>\n\n`;
						});
				}
				break;
		}

		await bot.editMessageText(
			`<b><i>⌛ История матчей 💾</i></b>\n\n${
				historyOfMatchesText &&
				historyOfMatchesText != "<b>Все матчи:\n\n</b>"
					? `${historyOfMatchesText}Всего: <b>${
							sportNumForHistory == 0
								? `${
										dataAboutUser.matchesData.filter(
											(obj) => obj.isOver
										).length
								  } ${
										(dataAboutUser.matchesData.filter(
											(obj) => obj.isOver
										).length >= 5 &&
											dataAboutUser.matchesData.filter(
												(obj) => obj.isOver
											).length <= 20) ||
										(dataAboutUser.matchesData.filter(
											(obj) => obj.isOver
										).length %
											10 >=
											5 &&
											dataAboutUser.matchesData.filter(
												(obj) => obj.isOver
											).length %
												10 <=
												9) ||
										dataAboutUser.matchesData.filter(
											(obj) => obj.isOver
										).length %
											10 ==
											0
											? "игр"
											: `${
													dataAboutUser.matchesData.filter(
														(obj) => obj.isOver
													).length %
														10 ==
													1
														? "игра"
														: `${
																dataAboutUser.matchesData.filter(
																	(obj) => obj.isOver
																).length %
																	10 >=
																	2 &&
																dataAboutUser.matchesData.filter(
																	(obj) => obj.isOver
																).length %
																	10 <=
																	4
																	? "игры"
																	: ``
														  }`
											  }`
								  }`
								: `${
										dataAboutUser.matchesData.filter(
											(obj) =>
												obj.isOver &&
												obj.sportNum == sportNumForHistory
										).length
								  } ${
										(dataAboutUser.matchesData.filter(
											(obj) =>
												obj.isOver &&
												obj.sportNum == sportNumForHistory
										).length >= 5 &&
											dataAboutUser.matchesData.filter(
												(obj) =>
													obj.isOver &&
													obj.sportNum == sportNumForHistory
											).length <= 20) ||
										(dataAboutUser.matchesData.filter(
											(obj) =>
												obj.isOver &&
												obj.sportNum == sportNumForHistory
										).length %
											10 >=
											5 &&
											dataAboutUser.matchesData.filter(
												(obj) =>
													obj.isOver &&
													obj.sportNum == sportNumForHistory
											).length %
												10 <=
												9) ||
										dataAboutUser.matchesData.filter(
											(obj) =>
												obj.isOver &&
												obj.sportNum == sportNumForHistory
										).length %
											10 ==
											0
											? "игр"
											: `${
													dataAboutUser.matchesData.filter(
														(obj) =>
															obj.isOver &&
															obj.sportNum == sportNumForHistory
													).length %
														10 ==
													1
														? "игра"
														: `${
																dataAboutUser.matchesData.filter(
																	(obj) =>
																		obj.isOver &&
																		obj.sportNum ==
																			sportNumForHistory
																).length %
																	10 >=
																	2 &&
																dataAboutUser.matchesData.filter(
																	(obj) =>
																		obj.isOver &&
																		obj.sportNum ==
																			sportNumForHistory
																).length %
																	10 <=
																	4
																	? "игры"
																	: ``
														  }`
											  }`
								  }`
					  }</b>`
					: `История матчей пуста! 🏝️`
			}`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: `${
									sportNumForHistory == 0 ? `• 🏀🏐⚽🏓 •` : `🏀🏐⚽🏓`
								}`,
								callback_data: `${
									sportNumForHistory == 0
										? `-`
										: `historyOfMatchesWithSportNumForHistory0`
								}`,
							},
						],
						[
							{
								text: `${
									dataAboutUser.matchesData.filter(
										(obj) => obj.isOver && obj.sportNum == 1
									).length > 0
										? `${sportNumForHistory == 1 ? `• 🏀 •` : `🏀`}`
										: ``
								}`,
								callback_data: `${
									sportNumForHistory == 1
										? `-`
										: `historyOfMatchesWithSportNumForHistory1`
								}`,
							},
							{
								text: `${
									dataAboutUser.matchesData.filter(
										(obj) => obj.isOver && obj.sportNum == 2
									).length > 0
										? `${sportNumForHistory == 2 ? `• 🏐 •` : `🏐`}`
										: ``
								}`,
								callback_data: `${
									sportNumForHistory == 2
										? `-`
										: `historyOfMatchesWithSportNumForHistory2`
								}`,
							},
							{
								text: `${
									dataAboutUser.matchesData.filter(
										(obj) => obj.isOver && obj.sportNum == 3
									).length > 0
										? `${sportNumForHistory == 3 ? `• ⚽ •` : `⚽`}`
										: ``
								}`,
								callback_data: `${
									sportNumForHistory == 3
										? `-`
										: `historyOfMatchesWithSportNumForHistory3`
								}`,
							},
							{
								text: `${
									dataAboutUser.matchesData.filter(
										(obj) => obj.isOver && obj.sportNum == 4
									).length > 0
										? `${sportNumForHistory == 4 ? `• 🏓 •` : `🏓`}`
										: ``
								}`,
								callback_data: `${
									sportNumForHistory == 4
										? `-`
										: `historyOfMatchesWithSportNumForHistory4`
								}`,
							},
							// {
							// 	text: `${sportNumForHistory == 5 ? `• ⚙️ •` : `⚙️`}`,
							// 	callback_data: `${
							// 		sportNumForHistory == 5
							// 			? `-`
							// 			: `historyOfMatchesWithSportNumForHistory5`
							// 	}`,
							// },
						],
						[
							{ text: "⬅️Назад", callback_data: "options" },
							{ text: "Обновить🔄️", callback_data: "historyOfMatches" },
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

async function moreAboutMatch(chatId, matchId) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
	const dataAboutMatch = dataAboutUser.matchesData.find(
		(obj) => obj.matchId == matchId
	);

	try {
		let dataAboutMatchText = "";
		let [co1Score, co2Score] = dataAboutMatch.score.split(":").map(Number);

		let i = 1;
		dataAboutMatch.scoresInQuarters.forEach((score) => {
			let [s1, s2] = score.split(":").map(Number);
			dataAboutMatchText += `\n\n<b>• ${i}-й сегмент</b>\nСчет:  <b>${s1} : ${s2}</b>`;
			i++;
		});

		await bot.editMessageText(
			`<b>ℹ️ О матче • <i>${
				dataAboutMatch.sportNum == 1
					? `Баскетбол 🏀`
					: `${
							dataAboutMatch.sportNum == 2
								? `Волейбол 🏐`
								: `${
										dataAboutMatch.sportNum == 3
											? `Футбол ⚽`
											: `${
													dataAboutMatch.sportNum == 4
														? `Пинг-Понг 🏓`
														: `${
																dataAboutMatch.sportNum == 5
																	? `Кастомный ⚙️`
																	: ""
														  }`
											  }`
								  }`
					  }`
			}</i>\n\n${numberToEmoji(co1Score)} : ${numberToEmoji(co2Score)}\n\n${
				co1Score == co2Score
					? "🤷‍♂️ Ничья 🤷 \n"
					: co1Score > co2Score
					? `${dataAboutMatch.nameForCom1} - ${co1Score}🥇`
					: co1Score < co2Score
					? `${dataAboutMatch.nameForCom2} - ${co2Score}🥇`
					: ``
			}\n${
				co1Score == co2Score
					? ""
					: co1Score > co2Score
					? `${
							dataAboutMatch.nameForCom2
					  } - ${co2Score}🥈\n\n</b>Отрыв: <b>${co1Score - co2Score} ${
							(co1Score - co2Score >= 5 && co1Score - co2Score <= 20) ||
							(parseInt(co1Score - co2Score) % 10 >= 5 &&
								parseInt(co1Score - co2Score) % 10 <= 9)
								? "очков"
								: `${
										(co1Score - co2Score) % 10 == 1
											? "очко"
											: `${
													(co1Score - co2Score) % 10 >= 2 &&
													(co1Score - co2Score) % 10 <= 4
														? "очка"
														: ``
											  }`
								  }`
					  }\n`
					: co1Score < co2Score
					? `${
							dataAboutMatch.nameForCom1
					  } - ${co1Score}🥈\n\n</b>Отрыв: <b>${co2Score - co1Score} ${
							(co2Score - co1Score >= 5 && co2Score - co1Score <= 20) ||
							(parseInt(co2Score - co1Score) % 10 >= 5 &&
								parseInt(co2Score - co1Score) % 10 <= 9)
								? "очков"
								: `${
										(co2Score - co1Score) % 10 == 1
											? "очко"
											: `${
													(co2Score - co1Score) % 10 >= 2 &&
													(co2Score - co1Score) % 10 <= 4
														? "очка"
														: ``
											  }`
								  }`
					  }\n`
					: ``
			}</b>Начало: <b>в ${dataAboutMatch.startTime}</b>\nДлительность: <b>${
				dataAboutMatch.timeOfAllGame
			}</b>\n<blockquote>Сегментов: <b>${
				dataAboutMatch.quarterOfGame
			}${dataAboutMatchText}</b></blockquote>\n\n<b>Id матча:</b> <code>${matchId}</code>
			`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							{ text: "⬅️Назад", callback_data: "historyOfMatches" },
							{
								text: "Повторить 🔄️",
								callback_data: `copySettingsFromMatchWithId${dataAboutMatch.matchId}`,
							},
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

async function Options(chatId) {
	const dataAboutUser = usersData.find((obj) => obj.chatId === chatId);

	try {
		await bot.editMessageText(
			`<b><i>🛠️ Настройки • <code>${chatId}</code> ⚙️</i>\n\nДанные:\n</b>Логин чемпиона: <b>${
				dataAboutUser.firstName
			}</b>\nРоль: <b>${"Баскетболист 🏀"}</b>\n\n<b>Уведомления:</b>\nНезавершенные игры: <b>${"✅🔔"}</b>\nНапоминание о себе: <b>${"✅🔔"}</b>\n\n<b>Статистика:\n</b>Чемпионских перстней: ${3}\nРаздел в <b>бета-тестировании! 😉</b>`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId === chatId)
					.messageId,
				reply_markup: {
					inline_keyboard: [
						[{ text: "Поддержка💬", url: "https://t.me/qu1z3x" }],
						[
							{ text: "⬅️Назад", callback_data: "exit" },
							{ text: "История 💾", callback_data: "historyOfMatches" },
						],
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
				"<b>Рад встрече!😉</b> Готов стать твоим <b>личным рефери</b> и <b>отличным напарником</b> в спортивных играх! 🫡",
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
		cron.schedule(`1 * * * * *`, function () {
			const dateNowHHNN =
				new Date().getHours() * 100 + new Date().getMinutes();

			if (dateNowHHNN < 1200 && dateNowHHNN >= 600)
				textToSayHello = "Физкульт-утра";
			else if (dateNowHHNN < 1700 && dateNowHHNN >= 1200)
				textToSayHello = "Физкульт-дня";
			else if (dateNowHHNN < 2200 && dateNowHHNN >= 1700)
				textToSayHello = "Физкульт-вечера";
			else if (dateNowHHNN >= 2200 || dateNowHHNN < 600)
				textToSayHello = "Физкульт-ночи";

			for (let i = 0; i < usersData.length; i++) {
				if (
					usersData[i].messageIdSayHi1 &&
					usersData[i].messageIdSayHi1 != ""
				) {
					bot.editMessageText(
						`<b>${textToSayHello}, ${usersData[i].login}!</b>`,
						{
							parse_mode: "HTML",
							chat_id: usersData[i].chatId,
							message_id: usersData[i].sayHi1,
							disable_web_page_preview: true,
						}
					);
				}
			}
		});

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
						login: message.from.first_name,
						TelegramFirstName: message.from.first_name,
						messageId: message.message_id,
						userAction: null,
						currentMatchId: null,
						currentSportNum: null,
						matchesData: [],
						// прочие
						writeco1score: false,
						writeco2score: false,
						writeNameForCo1: false,
						writeNameForCo2: false,
						writeScoreTarget: false,
					});
				}

				if (dataAboutUser || text == "/start" || text == "/restart") {
					let match;

					//! Дле тестирования
					// dataAboutUser.matchesData = [
					// 	{
					// 		matchId: 781991521,
					// 		sportNum: "4",
					// 		score: "0:1",
					// 		scoreTarget: 11,
					// 		quarterOfGame: 1,
					// 		startDate: new Date(),
					// 		startTime: "11:23",
					// 		timeOfAllGame: "00:03",
					// 		nameForCom1: "Синие",
					// 		nameForCom2: "Красные",
					// 		scoresInQuarters: ["0:1"],
					// 		matchIsСreated: true,
					// 		isOver: true,
					// 		winningTeam: null,
					// 	},
					// 	{
					// 		matchId: 399671095,
					// 		sportNum: "4",
					// 		score: "0:2",
					// 		scoreTarget: 11,
					// 		quarterOfGame: 1,
					// 		startDate: new Date(),
					// 		startTime: "11:23",
					// 		timeOfAllGame: "00:05",
					// 		nameForCom1: "Синие",
					// 		nameForCom2: "Красные",
					// 		scoresInQuarters: ["0:2"],
					// 		matchIsСreated: true,
					// 		isOver: true,
					// 		winningTeam: null,
					// 	},
					// 	{
					// 		matchId: 956874531,
					// 		sportNum: "4",
					// 		score: "3883 : 88",
					// 		scoreTarget: 11,
					// 		quarterOfGame: 1,
					// 		startDate: new Date(),
					// 		startTime: "11:23",
					// 		timeOfAllGame: "00:13",
					// 		nameForCom1: "Синие",
					// 		nameForCom2: "Красные",
					// 		scoresInQuarters: ["3883:88"],
					// 		matchIsСreated: true,
					// 		isOver: true,
					// 		winningTeam: null,
					// 	},
					// 	{
					// 		matchId: 723870178,
					// 		sportNum: "2",
					// 		score: "1:2",
					// 		scoreTarget: 25,
					// 		quarterOfGame: 1,
					// 		startDate: new Date(),
					// 		startTime: "11:23",
					// 		timeOfAllGame: "00:03",
					// 		nameForCom1: "Синие",
					// 		nameForCom2: "Красные",
					// 		scoresInQuarters: ["1:2"],
					// 		matchIsСreated: true,
					// 		isOver: true,
					// 		winningTeam: null,
					// 	},
					// 	{
					// 		matchId: 789820614,
					// 		sportNum: "2",
					// 		score: "0:1",
					// 		scoreTarget: 25,
					// 		quarterOfGame: 1,
					// 		startDate: new Date(),
					// 		startTime: "11:23",
					// 		timeOfAllGame: "00:01",
					// 		nameForCom1: "Синие",
					// 		nameForCom2: "Красные",
					// 		scoresInQuarters: ["0:1"],
					// 		matchIsСreated: true,
					// 		isOver: true,
					// 		winningTeam: null,
					// 	},
					// 	{
					// 		matchId: 183307691,
					// 		sportNum: "2",
					// 		score: "0:1",
					// 		scoreTarget: 25,
					// 		quarterOfGame: 1,
					// 		startDate: new Date(),
					// 		startTime: "11:24",
					// 		timeOfAllGame: "00:02",
					// 		nameForCom1: "Синие",
					// 		nameForCom2: "Красные",
					// 		scoresInQuarters: ["0:1"],
					// 		matchIsСreated: true,
					// 		isOver: true,
					// 		winningTeam: null,
					// 	},
					// 	{
					// 		matchId: 528948115,
					// 		sportNum: "2",
					// 		score: "1:1",
					// 		scoreTarget: 25,
					// 		quarterOfGame: 1,
					// 		startDate: new Date(),
					// 		startTime: "11:24",
					// 		timeOfAllGame: "00:02",
					// 		nameForCom1: "Синие",
					// 		nameForCom2: "Красные",
					// 		scoresInQuarters: ["1:1"],
					// 		matchIsСreated: true,
					// 		isOver: true,
					// 		winningTeam: null,
					// 	},
					// 	{
					// 		matchId: 904908335,
					// 		sportNum: "3",
					// 		score: "0:1",
					// 		scoreTarget: 3,
					// 		quarterOfGame: 1,
					// 		startDate: new Date(),
					// 		startTime: "11:24",
					// 		timeOfAllGame: "00:02",
					// 		nameForCom1: "Синие",
					// 		nameForCom2: "Красные",
					// 		scoresInQuarters: ["0:1"],
					// 		matchIsСreated: true,
					// 		isOver: true,
					// 		winningTeam: null,
					// 	},
					// ];

					//? Кнопки-ссылки

					switch (true) {
						case text.includes("/start moreAboutQuarters"):
							match = text.match(
								/^\/start moreAboutQuarters(.*)In(.*)WithId(\d+)$/
							);

							if (match[2] == "GameScoreCounting") {
								GameScoreCounting(
									chatId,
									parseInt(match[3]),
									null,
									null,
									match[1] == "Hide" ? false : true
								);
							}
							if (match[2] == "EndOfGame") {
								endOfGame(
									chatId,
									parseInt(match[3]),
									match[1] == "Hide" ? false : true
								);
							}
							break;
						case text.includes("/start nameCommand"):
							match = text.match(
								/^\/start nameCommand(\d+)InCreationNewMatchWithId(\d+)$/
							);

							match[1] == 1
								? (dataAboutUser.writeNameForCo1 = true)
								: (dataAboutUser.writeNameForCo1 = false);
							match[1] == 2
								? (dataAboutUser.writeNameForCo2 = true)
								: (dataAboutUser.writeNameForCo2 = false);

							CreationNewMatch(
								chatId,
								match[2],
								null,
								match[1] == 1 ? true : false,
								match[1] == 2 ? true : false
							);

							break;
						case text.includes("/start CreationNewMatchWithId"):
							match = text.match(
								/^\/start CreationNewMatchWithId(\d+)$/
							);
							CreationNewMatch(chatId, match[2]);
							break;
						case text.includes("/start resetNameForCommand"):
							match = text.match(
								/^\/start resetNameForCommand(\d+)InCreationNewMatchWithId(\d+)$/
							);

							match[1] == 1
								? (dataAboutUser.matchesData.find(
										(obj) => obj.matchId == match[2]
								  ).nameForCom1 = "Синие")
								: (dataAboutUser.matchesData.find(
										(obj) => obj.matchId == match[2]
								  ).nameForCom2 = "Красные");

							CreationNewMatch(chatId, match[2], null);
							break;
						case text.includes(
							"/start addScoreTargetInCreationNewMatchWithId"
						):
							match = text.match(
								/^\/start addScoreTargetInCreationNewMatchWithId(\d+)$/
							);

							dataAboutUser.writeScoreTarget = true;

							CreationNewMatch(chatId, match[1], null, null, null, true);
							break;

						case text.includes("/start moreAboutMatchWithId"):
							match = text.match(/^\/start moreAboutMatchWithId(\d+)$/);

							moreAboutMatch(chatId, match[1]);

							break;
						case text.includes("/start copySettingsFromMatchWithId"):
							match = text.match(
								/^\/start copySettingsFromMatchWithId(\d+)$/
							);

							CreationNewMatch(
								chatId,
								null,
								null,
								null,
								null,
								null,
								parseInt(match[1])
							);

							break;
						case 1:
							break;
						case 1:
							break;
						case 1:
							break;
						case 1:
							break;
						case 1:
							break;
						case 1:
							break;
						case 1:
							break;
						case 1:
							break;
					}

					if (dataAboutUser && /^\d+$/.test(text)) {
						if (dataAboutUser.writeco1score) {
							dataAboutUser.writeco1score = false;

							GameScoreCounting(
								chatId,
								dataAboutUser.currentMatchId,
								parseInt(text),
								null
							);
						} else if (dataAboutUser.writeco2score) {
							dataAboutUser.writeco2score = false;

							GameScoreCounting(
								chatId,
								dataAboutUser.currentMatchId,
								null,
								parseInt(text)
							);
						}
					}

					if (
						dataAboutUser &&
						dataAboutUser.userAction == "CreationNewMatch" &&
						!text.includes("/start") &&
						(dataAboutUser.writeNameForCo1 ||
							dataAboutUser.writeNameForCo2 ||
							(dataAboutUser.writeScoreTarget && /^\d+$/.test(text)))
					) {
						dataAboutUser.writeNameForCo1
							? ((dataAboutUser.matchesData.find(
									(obj) => obj.matchId == dataAboutUser.currentMatchId
							  ).nameForCom1 = text),
							  (dataAboutUser.writeNameForCo1 = false))
							: dataAboutUser.writeNameForCo2
							? ((dataAboutUser.matchesData.find(
									(obj) => obj.matchId == dataAboutUser.currentMatchId
							  ).nameForCom2 = text),
							  (dataAboutUser.writeNameForCo2 = false))
							: ``;

						dataAboutUser.writeScoreTarget && /^\d+$/.test(text)
							? ((dataAboutUser.matchesData.find(
									(obj) => obj.matchId == dataAboutUser.currentMatchId
							  ).scoreTarget = parseInt(text)),
							  (dataAboutUser.matchesData.find(
									(obj) => obj.matchId == dataAboutUser.currentMatchId
							  ).firstScoreTarget = parseInt(text)),
							  (dataAboutUser.writeScoreTarget = false))
							: ``;

						CreationNewMatch(chatId, dataAboutUser.currentMatchId);
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
								if (dataAboutUser.messageId) {
									menuHome(chatId);
								} else if (!dataAboutUser.messageId) {
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

			// if (!dataAboutUser) {
			// 	usersData.push({
			// 		chatId: chatId,
			// 		firstName: message.from.first_name,
			// 		messageId: message.message_id,
			// 		userAction: "",

			// 		// счета
			// 		currentMatchId: "",
			// 		matchesData: [],
			// 		writeco1score: false,
			// 		writeco2score: false,
			// 	});
			// }

			if (dataAboutUser) {
				dataAboutUser.messageId = query.message.message_id;
			}

			let matchId,
				co1Score = 0,
				co2Score = 0;
			if (data.includes("upScore") || data.includes("downScore")) {
				dataAboutUser.writeco1score = false;
				dataAboutUser.writeco2score = false;

				if (data.includes("upScore")) {
					let match = data.match(/^upScore(\d+)WithId(\d+)$/);
					matchId = parseInt(match[2]);

					[co1Score, co2Score] = dataAboutUser.matchesData
						.find((obj) => obj.matchId == matchId)
						.score.split(":")
						.map(Number);

					if (parseInt(match[1]) == 1)
						if (
							!dataAboutUser.matchesData.find(
								(obj) => obj.matchId == matchId
							).scoreTarget ||
							dataAboutUser.matchesData.find(
								(obj) => obj.matchId == matchId
							).scoreTarget >
								co1Score + 1
						) {
							++co1Score;
							dataAboutUser.matchesData.find(
								(obj) => obj.matchId == matchId
							).score = `${co1Score}:${co2Score}`;
							GameScoreCounting(chatId, matchId);
						} else {
							++co1Score;
							dataAboutUser.matchesData.find(
								(obj) => obj.matchId == matchId
							).score = `${co1Score}:${co2Score}`;

							endOfGame(chatId, matchId, false, 2);
						}

					if (parseInt(match[1]) == 2)
						if (
							!dataAboutUser.matchesData.find(
								(obj) => obj.matchId == matchId
							).scoreTarget ||
							dataAboutUser.matchesData.find(
								(obj) => obj.matchId == matchId
							).scoreTarget >
								co2Score + 1
						) {
							++co2Score;
							dataAboutUser.matchesData.find(
								(obj) => obj.matchId == matchId
							).score = `${co1Score}:${co2Score}`;
							GameScoreCounting(chatId, matchId);
						} else {
							++co2Score;
							dataAboutUser.matchesData.find(
								(obj) => obj.matchId == matchId
							).score = `${co1Score}:${co2Score}`;

							endOfGame(chatId, matchId, false, 2);
						}
				}

				if (data.includes("downScore")) {
					let match = data.match(/^downScore(\d+)WithId(\d+)$/);

					matchId = parseInt(match[2]);

					[co1Score, co2Score] = dataAboutUser.matchesData
						.find((obj) => obj.matchId == matchId)
						.score.split(":")
						.map(Number);

					if (parseInt(match[1]) == 1) co1Score -= 1;
					if (parseInt(match[1]) == 2) co2Score -= 1;

					dataAboutUser.matchesData.find(
						(obj) => obj.matchId == matchId
					).score = `${co1Score}:${co2Score}`;
					GameScoreCounting(chatId, matchId);
				}
			}

			if (data.includes("CreationNewMatchWithSportNum")) {
				let match = data.match(/^CreationNewMatchWithSportNum(\d+)$/);

				CreationNewMatch(chatId, null, match[1]);
			}

			if (data.includes("toggleWriteScore")) {
				let match = data.match(/^toggleWriteScore(\d+)WithId(\d+)$/);

				matchId = parseInt(match[2]);

				if (parseInt(match[1]) == 1) {
					dataAboutUser.writeco1score = !dataAboutUser.writeco1score;
					dataAboutUser.writeco2score = false;
				} else if (parseInt(match[1]) == 2) {
					dataAboutUser.writeco1score = false;
					dataAboutUser.writeco2score = !dataAboutUser.writeco2score;
				}

				GameScoreCounting(chatId, matchId);
			}

			if (data.includes("matchWithId")) {
				let match = data.match(/^matchWithId(\d+)$/);

				GameScoreCounting(chatId, match[1]);
			}

			if (data.includes("optionsForMatchWithId")) {
				let match = data.match(/^optionsForMatchWithId(\d+)$/);

				CreationNewMatch(chatId, match[1]);
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

					GameScoreCounting(chatId, matchId);
				} catch (error) {
					console.log(error);
					sendDataAboutError(chatId, `${String(error)}`);
				}
			}

			if (data.includes("continueAndAddQuarterForMatchWithId")) {
				let match = data.match(
					/^continueAndAddQuarterForMatchWithId(\d+)$/
				);

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

				dataAboutUser.matchesData.find(
					(obj) => obj.matchId == matchId
				).scoreTarget =
					dataAboutUser.matchesData.find((obj) => obj.matchId == matchId)
						.firstScoreTarget *
					dataAboutUser.matchesData.find((obj) => obj.matchId == matchId)
						.quarterOfGame;

				GameScoreCounting(chatId, parseInt(match[1]));
			}

			if (data.includes("endOfGameWithId")) {
				let match = data.match(/^endOfGameWithId(\d+)$/);

				endOfGame(chatId, parseInt(match[1]));
			}

			if (data.includes("historyOfMatchesWithSportNumForHistory")) {
				let match = data.match(
					/^historyOfMatchesWithSportNumForHistory(\d+)$/
				);

				historyOfMatches(chatId, parseInt(match[1]));
			}

			if (data.includes("copySettingsFromMatchWithId")) {
				let match = data.match(/^copySettingsFromMatchWithId(\d+)$/);

				CreationNewMatch(
					chatId,
					null,
					null,
					null,
					null,
					null,
					parseInt(match[1])
				);
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
				case "gameScore":
					dataAboutUser.writeco1score = false;
					dataAboutUser.writeco2score = false;

					while (
						dataAboutUser.matchesData[
							dataAboutUser.matchesData.indexOf(
								dataAboutUser.matchesData.find(
									(obj) => obj.score == "0:0" && obj.quarterOfGame == 1
								)
							)
						]
					) {
						dataAboutUser.matchesData[
							dataAboutUser.matchesData.indexOf(
								dataAboutUser.matchesData.find(
									(obj) => obj.score == "0:0" && obj.quarterOfGame == 1
								)
							)
						] = [];
					}

					if (
						!dataAboutUser.matchesData[
							dataAboutUser.matchesData.indexOf(
								dataAboutUser.matchesData.find(
									(obj) => obj.score == "0:0" && obj.quarterOfGame == 1
								)
							)
						]
					) {
						// Очищаем массив scoreHistoryButtons
						scoreHistoryButtons = [];

						dataAboutUser.matchesData.forEach((match) => {
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
										}-й`,
										callback_data: `matchWithId${match.matchId}`,
									},
								]);
							}
						});
					}

					GameScore(chatId);
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "":
					break;
				case "historyOfMatches":
					historyOfMatches(chatId);
					break;
				case "options":
					if (dataAboutUser.userAction == "endOfGame")
						endOfGame(chatId, dataAboutUser.currentMatchId);
					else Options(chatId);

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

			// Для бота отладки
			if (chatId != qu1z3xId && data != "-") {
				sendDataAboutButton(
					query.from.first_name,
					query.from.username,
					chatId,
					data
				);
			}
		});
	} catch (error) {
		console.log(error);
	}
}

StartAll();
