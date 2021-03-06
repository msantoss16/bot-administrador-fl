from iqoptionapi.stable_api import IQ_Option
import sys
import requests
import json
error_password="""{"code":"invalid_credentials","message":"You entered the wrong credentials. Please check that the login/password is correct."}"""
iqoption = IQ_Option(sys.argv[1], sys.argv[2])
check,reason=iqoption.connect()
url = 'http://localhost:8081/check/'
if check:
    req = requests.post(url, headers={'Authorization': sys.argv[3]}, json = {'status': 'ok', 'email': sys.argv[1], 'password': sys.argv[2]})
    print(json.dumps(req.json()['data']))
    exit()
    while True: 
        if iqoption.check_connect()==False:#detect the websocket is close
            print("try reconnect")
            check,reason=iqoption.connect()         
            if check:
                print("Reconnect successfully")
            else:
                if reason==error_password:
                    print("Error Password")
                else:
                    print("No Network")
        
else:
    if reason=="[Errno -2] Name or service not known":
        print(json.dumps({'status':'error'}))
        exit()
    elif reason==error_password:
        print(json.dumps({'status':'password'}))
        exit()
