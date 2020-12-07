import configs
import asyncio
from telethon import TelegramClient, events, sync
from telethon.utils import get_display_name
import logging
import requests

logging.basicConfig(level=logging.ERROR)

def sepMandarApi(texto):
    texto2 = texto.split()
    req = requests.post("http://localhost:8081/sinais", json={'periodo':texto2[3][1:], 'paridade':texto2[5], 'horario':texto2[7], 'sinal':texto2[9].lower(), 'gale':texto2[11]})
    return req

async def bot():
    async with TelegramClient(configs.userLogin['number'], configs.userLogin['api_id'], configs.userLogin['api_hash']) as client:
        async def defChat():
            dialog_count = 3
            dialogs = await client.get_dialogs(limit=dialog_count)
            i = None
            while i is None:
                print('Escolha o chat')
                for i, dialog in enumerate(dialogs, start=1):
                    print('{}. {}'.format(i, get_display_name(dialog.entity)))
                i = int(input('Digite o número do chat: '))
            return dialogs[i].entity
        entity = None
        while entity is None:
            entity = await defChat()
        @client.on(events.NewMessage(from_users=configs.userLogin['number']))
        async def my_event_handler(event):
            if 'GD SINAIS' in event.raw_text:
                print(sepMandarApi(event.raw_text))
                #print(event.sender)
        await client.run_until_disconnected()
        
def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(bot())
    loop.close()

if __name__ == '__main__':
    main()