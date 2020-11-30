from flask import Flask, jsonify, request
import requests
from iqoptionapi.stable_api import IQ_Option
import subprocess
import sys
import os
app = Flask(__name__)

def apostar2(hora, moeda, valor, chamada):
    res = requests.get('http://localhost:8081/users')
    for user in res.json()['Users']:
        for conta in user['data']['iqoption']:
            try:
                subprocess.run([sys.executable, 'iqscript.py', conta['email'], conta['password']])
            except Exception as err:
                print(err)

@app.route('/',methods=['GET'])
def teste():
    return 'Bot iqoption'

@app.route('/',methods=['POST'])
def apostar():
    req_data = request.get_json()
    apostar2('', '', '', '');
    return jsonify(req_data)

app.run(debug=True)