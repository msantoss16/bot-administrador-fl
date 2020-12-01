from flask import Flask, jsonify, request
import requests
from iqoptionapi.stable_api import IQ_Option
import subprocess
import sys
import os
import time
app = Flask(__name__)

def apostar2(periodo, moeda, sinal):
    res = requests.get('http://localhost:8081/users')
    start = time.time()
    for user in res.json()['Users']:
        for conta in user['data']['iqoption']:
            try:
                subprocess.Popen([sys.executable, 'iqscript.py', conta['email'], conta['password'], periodo, moeda, sinal, user['data']['betDetails']['valor']])
                print('teste')
            except Exception as err:
                print(err)
    end = time.time()
    print(end-start)

@app.route('/',methods=['GET'])
def teste():
    return 'Bot iqoption'

@app.route('/',methods=['POST'])
def apostar():
    req_data = request.get_json()
    apostar2(req_data['periodo'], req_data['moeda'], req_data['sinal']);
    return jsonify(req_data)

app.run(debug=True)