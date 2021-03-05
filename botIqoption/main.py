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
    for user in res.json()['Users']:
        for conta in user['data']['iqoption']:
            try:
                subprocess.Popen([sys.executable, 'iqscript.py', conta['email'], conta['password'], periodo, moeda, sinal, user['data']['betDetails']['valor']])
                print('teste')
            except Exception as err:
                print(err)

def check(_email, _password, _token):
    output = str(subprocess.Popen([sys.executable, 'checkmail.py', _email, _password, ("Bearer "+_token)], stdout = subprocess.PIPE, stderr = subprocess.STDOUT).communicate()[0].decode('utf-8'))
    return output


@app.route('/',methods=['GET'])
def teste():
    return 'Bot iqoption'

@app.route('/',methods=['POST'])
def apostar():
    req_data = request.get_json()
    apostar2(req_data['periodo'], req_data['moeda'], req_data['sinal'])
    return jsonify(req_data)

@app.route('/check', methods=['POST'])
def checkMail():
    req_data = request.get_json()
    print(req_data)
    checkACC = check(req_data['email'], req_data['password'], req_data['token'])
    return checkACC

def apostarSinalUnico(req):
    paridade = req['sinal']['paridade'].replace('/', '').upper()
    try:
        output = str(subprocess.Popen([sys.executable, 'iqscript.py', req['login']['email'], req['login']['password'], req['sinal']['periodo'], paridade, req['sinal']['sinal'], req['configs']['valor']], stdout = subprocess.PIPE, stderr = subprocess.STDOUT).communicate()[0].decode('utf-8'))
        return output
    except Exception as err:
        print(err)

@app.route('/sinal', methods=['POST'])
def sinal():
    req_data = request.get_json()
    return apostarSinalUnico(req_data)


app.run(debug=True)