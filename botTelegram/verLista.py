import sys
import requests
import json
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

if (sys.argv[2] is "2"):
    req = requests.post(url+'/checkTelegram', json={"number": sys.argv[3], 'username': sys.argv[4]})
    try:
        id = json.dumps(req.json()['_id'])
        acharSinais(sys.argv[1])
    except:
        print('notfound')
    # print(sys.argv[1])
    # print(sys.argv[3])
    # print(sys.argv[4])
else:
    print(sys.argv[1])
    req = requests.post(url+'/checkTelegram', json={"number": sys.argv[3]})
    print(acharSinais(sys.argv[1]))
    try:
        id = json.dumps(req.json()['_id'])
        #acharSinais(sys.argv[1])
    except:
        print('notfound')
    # print(sys.argv[1])
    # print(sys.argv[3])


