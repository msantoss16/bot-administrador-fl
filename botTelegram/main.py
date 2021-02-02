import configs
import asyncio
from telethon import TelegramClient, events, sync
from telethon.utils import get_display_name
import logging
import requests
import subprocess
import sys
import requests
import json

logging.basicConfig(level=logging.ERROR)

url = 'http://localhost:8081'
p = {
    'gale': [
        'gale',
        'martigale',
        'martingale',
        'mg',
        'g'
    ],
    'sinal': [
        'call',
        'put'
    ]
}

def pegarDados(temp, periodo, gale):
    t = {
        'periodo': periodo,
        'paridade': None,
        'horario': None,
        'sinal': None,
        'gale': gale
    }
    for word in temp:
        if 'm' in word.lower():
            if word[1].isnumeric():
                t['periodo'] = word
        elif len(word) == 7:
            if '\\' or '\/' in word:
                t['paridade'] = word
        elif len(word) == 6:
            t['paridade'] = word
        elif ':' in word:
            t['horario'] = word
        elif 'put' in word.lower() or 'call' in word.lower():
            t['sinal'] = word
        elif 'sem' in word.lower():
            t['gale'] = 0
        elif word.isnumeric():
            t['gale'] = word
    return t
        
def acharSinais(mensagem):
    nList = []
    nnList = []
    periodo = 'm5'
    gale = 0
    tcolumn = mensagem.lower().split('\n')
    for trow in tcolumn:
        trowsplite = trow.split()
        for i in trowsplite:
            if 'put' in i or 'call' in i:
                nList.append(trow)
            if 'm' in i and i[1].isnumeric():
                periodo = i
            if p['gale'][0] in i or p['gale'][1] in i or p['gale'][2] in i or p['gale'][3] in i or p['gale'][4] in i:
                try: 
                    if trowsplite[(trowsplite.index(i)-1)].isnumeric():
                        gale = trowsplite[(trowsplite.index(i)-1)]
                    elif trowsplite[(trowsplite.index(i)+1)].isnumeric():
                        gale = trowsplite[(trowsplite.index(i)+1)]
                except:
                    pass
    if len(nList) > 1:
        for b in nList:
            if b.count(';') > 1: 
                temp = b.split(';')
                t = pegarDados(temp, periodo, gale)
            elif b.count(',') > 1:
                temp = b.split(',')
                t = pegarDados(temp, periodo, gale)
            else:
                temp = b.split()
                t = pegarDados(temp, periodo, gale)
            if (t['paridade'] is not None and t['horario'] is not None and t['sinal'] is not None):
                nnList.append(t)
                print(t)
    return nnList

async def verLista(mensagem, phone, username=""):
    if (username is not ""):
        req = requests.post(url+'/checkTelegram', json={"number": phone, 'username': username})
        print(acharSinais(mensagem))
        try:
            id = json.dumps(req.json()['_id'])
            acharSinais(mensagem)
        except:
            return
    else:
        req = requests.post(url+'/checkTelegram', json={"number": phone})
        id = json.dumps(req.json()['_id'])
        print(id)
        print(acharSinais(mensagem))


def mandarLista(lista):
    pass

def sepMandarApi(texto):
    for word in texto.split():
        if 'm' in word.lower():
            if word[1].isnumeric():
                periodo = word
        if len(word) == 7:
            if '\\' or '\/' in word:
                paridade = word
        elif len(word) == 6:
            paridade = word
        if ':' in word:
            horario = word
        if 'put' in word.lower() or 'call' in word.lower():
            sinal = word
    req = requests.post("http://localhost:8081/sinais", json={'periodo': periodo, 'paridade': paridade, 'horario': horario, 'sinal': sinal, 'gale': 0})
    return req

async def bot():
    async with TelegramClient(configs.userLogin['number'], configs.userLogin['api_id'], configs.userLogin['api_hash']) as client:
        # async def defChat():
        #     dialog_count = 3
        #     dialogs = await client.get_dialogs(limit=dialog_count)
        #     i = None
        #     while i is None:
        #         print('Escolha o chat')
        #         for i, dialog in enumerate(dialogs, start=1):
        #             print('{}. {}'.format(i, get_display_name(dialog.entity)))
        #         i = int(input('Digite o número do chat: '))
        #     print(dialogs[i].entity)
        # entity = None
        # while entity is None:
        #     entity = await defChat()
        @client.on(events.NewMessage(from_users=configs.userLogin['number']))
        async def my_event_handler(event):
            if 'GD SINAIS' in event.raw_text:
                print(sepMandarApi(event.raw_text))
                #print(event.sender)

        @client.on(events.NewMessage(from_users="+5511979537463"))
        async def getSinaisFromGD(event):
            periodo = "M5"
            paridade = ""
            horario = ""
            sinal = ""
            gale = 0
            print(event.raw_text)
            for word in event.raw_text.split():
                if 'm' in word.lower():
                    if word[1].isnumeric():
                        periodo = word
                elif len(word) == 7:
                    if '\\' or '\/' in word:
                        paridade = word
                elif len(word) == 6:
                    paridade = word
                elif ':' in word:
                    horario = word
                elif 'put' in word.lower() or 'call' in word.lower():
                    sinal = word
                elif 'sem' in word.lower():
                    gale = 0
                elif word.isnumeric():
                    gale = word
            await event.reply(f'periodo: {periodo}\nparidade: {paridade}\nhorario: {horario}\nsinal: {sinal}\nGale: {gale}')
            print(periodo)
            print(paridade)
            print(horario)
            print(sinal)
            
        @client.on(events.NewMessage(from_users=["+5511979537463"]))
        async def obterSinaisFromUsers(event):
            await event.reply('teste')    
        
        @client.on(events.NewMessage(pattern="/fatorgalepadrao"))
        async def setFatorGale(event): 
            if (len(event.raw_text) > 16):
                try:
                    await event.reply('Fator gale alterado para '+str(float(event.raw_text.split()[1].replace(',', '.'))))
                except:
                    await event.reply('Por favor, insira um valor válido.')
            else:
                await event.reply('Por favor, insira um valor.')

        @client.on(events.NewMessage(pattern="/galepadrao"))
        async def setGale(event):
            if (len(event.raw_text) > 11):
                try:
                    gale = int(event.raw_text.split()[1])
                    if 0 <= gale <= 3:
                        await event.reply('Gale alterado para {} GALE'.format(('sem' if gale <= 0 else str(gale))))
                    else:
                        await event.reply('Por favor, insira um valor válido entre 0 e 3')
                except:
                    await event.reply('Por favor, insira um valor válido entre 0 e 3')
            else:
                await event.reply('Por favor, insira um valor.')

        @client.on(events.NewMessage(pattern="/valorpadrao"))
        async def setValor(event):
            if (len(event.raw_text) > 12):
                try:
                    valor = float(event.raw_text.split()[1].replace(',', '.'))
                    if 0 < valor:
                        await event.reply('Valor padrão alterado para '+str(valor))
                    else:
                        await event.reply('Por favor, insira um valor válido maior que 0')
                except:
                    await event.reply('Por favor, insira um valor válido maior que 0')
            else:
                await event.reply('Por favor, insira um valor.')

        @client.on(events.NewMessage(pattern="/lista"))
        async def setLista(event):
            userEntity = await client.get_entity(event.from_id)
            if (userEntity.username):
                await verLista(event.raw_text, str(userEntity.phone), str(userEntity.username))
                #output = str(subprocess.Popen([sys.executable, 'verLista.py', event.raw_text.encode(), "2", str(userEntity.phone), str(userEntity.username)], stdout = subprocess.PIPE, stderr = subprocess.STDOUT).communicate()[0].decode('utf-8'))
            else:
                await verLista(event.raw_text, str(userEntity.phone))
                #output = str(subprocess.Popen([sys.executable, 'verLista.py', event.raw_text.encode(), "1", str(userEntity.phone)], stdout = subprocess.PIPE, stderr = subprocess.STDOUT).communicate()[0].decode('utf-8'))
            #print(output)

        @client.on(events.NewMessage(pattern="/sinal"))
        async def setSinal(event):
            pass

        @client.on(events.NewMessage(pattern="/padroes"))
        async def getPadroes(event):
            print('teste')

        @client.on(events.NewMessage(pattern='(?i)hello.+'))
        async def handler(event):
            # Respond whenever someone says "Hello" and something else
            await event.reply('Hey!')

        @client.on(events.NewMessage(outgoing=True, pattern='!ping'))
        async def handler(event):
            # Say "!pong" whenever you send "!ping", then delete both messages
            m = await event.respond('!pong')
            await asyncio.sleep(5)
            await client.delete_messages(event.chat_id, [event.id, m.id])

        await client.run_until_disconnected()
def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(bot())
    loop.close()

if __name__ == '__main__':
    main()