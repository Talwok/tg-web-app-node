const TelegramBot = require('node-telegram-bot-api');

const express = require('express');

const cors = require('cors');

const token = "5780589423:AAH5Nch5otEwwKWHf-QUOaig2sTVK87lWRQ";

const webAppUrl = "https://vermillion-taffy-640762.netlify.app";

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
  

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start")
  {
    await bot.sendMessage(chatId, 'Заполни форму ниже', {
        reply_markup:{
            keyboard:[
                [{text: 'Заполни форму', web_app: {url: webAppUrl + '/form'}}]
            ]
        }
    });

    await bot.sendMessage(chatId, 'Сделай заказ быстро', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
            ]
        }
    }); 
  }
 
  if(msg?.web_app_data?.data){
        try {
            const data = JSON.parse(msg?.web_app_data?.data);

            await bot.sendMessage(chatId, 'Спасибо, за обратную связь!');
            await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
            await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);

        } catch(e) {
            console.log(e);
        }
    }
});

app.get('/', (req, res) =>{
    res.send('server works, PORT is ' + PORT);
});

app.post('/web_data', async (req, res) => {
    const {queryId, totalPrice} = req.body;

    await bot.sendMessage(queryId, 'Данные пришли');

    try{
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: `Спасибо за покупку, вы приобрели товар на сумму ${totalPrice}`
            }
        });
        return res.status(200).json({});
    } catch (e) {

        return res.status(500).json({});
    }
});

const PORT = 8000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));