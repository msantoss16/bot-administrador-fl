import configs
import asyncio
from telethon import TelegramClient, events, sync
from telethon.utils import get_display_name
import logging
import requests
import sys
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

def pegarDados(temp, periodo="m5", gale=0):
    t = {
        'periodo': periodo,
        'paridade': None,
        'horario': None,
        'sinal': None,
        'gale': gale
    }
    for word in temp:
        if 'm' in word.lower():
            try:
                if word[1].isnumeric():
                    t['periodo'] = word.lower()
            except:
                pass
        elif len(word) == 7:
            if '\\' or '\/' in word:
                t['paridade'] = word.lower()
        elif len(word) == 6:
            t['paridade'] = word.lower()
        elif ':' in word:
            t['horario'] = word.lower()
        elif 'put' in word.lower() or 'call' in word.lower():
            t['sinal'] = word.lower()
        elif 'sem' in word.lower():
            t['gale'] = 0
        elif word.isnumeric():
            t['gale'] = word.lower()
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
    return nnList

async def verSinal(mensagem, phone, username=""):
    if (username is not ""):
        req = requests.post(url+'/checkTelegram', json={"number": phone, "username": username})
        try:
            id = json.dumps(req.json()['_id'])
            dados = pegarDados(mensagem)
            return 'Sinal salvo com sucesso!'
        except:
            return 'Teve um erro ao enviar o sinal!'
    else:
        req = requests.post(url+'/checkTelegram', json={"number": phone})
        try:
            id = json.dumps(req.json()['_id'])
            dados = pegarDados(mensagem)
            print(dados)
            return 'Sinal salvo com sucesso!'
        except:
            return 'Teve um erro ao enviar o sinal!'
        

async def verLista(mensagem, phone, username=""):
    if (username is not ""):
        req = requests.post(url+'/checkTelegram', json={"number": phone, "username": username})
        try:
            id = json.dumps(req.json()['_id'])
            dados = acharSinais(mensagem)
            return 'Lista de sinais salva com sucesso!'
        except:
            return 'Teve um erro ao enviar a lista de sinais!'
    else:
        req = requests.post(url+'/checkTelegram', json={"number": phone})
        try:
            id = json.dumps(req.json()['_id'])
            dados = acharSinais(mensagem)
            print(dados)
            return 'Lista de sinais salva com sucesso!'
        except:
            return 'Teve um erro ao enviar a lista de sinais!'

async def mandarGD(texto, isLista=False):
    if isLista:
        try:
            dados = acharSinais(texto)
            return 'Lista de sinais salva com sucesso!'
        except:
            return 'Teve um erro ao enviar a lista de sinais!'
    else:
        try:
            dados = pegarDados(texto.split())
            return 'Sinal salvo com sucesso!'
        except:
            return 'Teve um erro ao enviar o sinal!'


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
        @client.on(events.NewMessage(from_users=configs.userLogin['number']))
        async def obterSinaisFromGd(event):
            if 'lista' in event.raw_text:
                await event.reply(await mandarGD(event.raw_text, True))
            else:
                await event.reply(await mandarGD(event.raw_Text))   
        
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
            if (len(event.raw_text) > 6):
                userEntity = await client.get_entity(event.from_id)
                if (userEntity.username):
                    await event.reply(await verLista(event.raw_text, str(userEntity.phone), str(userEntity.username)))
                else:
                    await event.reply(await verLista(event.raw_text, str(userEntity.phone)))
            else:
                await event.reply('Por favor, insira uma mensagem!')

        @client.on(events.NewMessage(pattern="/sinal"))
        async def setSinal(event):
            if (len(event.raw_text) > 6):
                userEntity = await client.get_entity(event.from_id)
                if (userEntity.username):
                    await event.reply(await verSinal(event.raw_text.split(), str(userEntity.phone), str(userEntity.username)))
                else:
                    await event.reply(await verSinal(event.raw_text.split(), str(userEntity.phone)))
            else:
                await event.reply('Por favor, insira uma mensagem!')

        @client.on(events.NewMessage(pattern="/padroes"))
        async def getPadroes(event):
            pass


        await client.run_until_disconnected()
def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(bot())
    loop.close()

if __name__ == '__main__':
    main()