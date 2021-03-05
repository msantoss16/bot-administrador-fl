# arg[1] = email
# arg[2] = senha
# arg[3] = periodo
# arg[4] = paridade
# arg[5] = sinal
# arg[7] = valor
from iqoptionapi.stable_api import IQ_Option
import sys

API = IQ_Option(sys.argv[1], sys.argv[2])
API.connect()
ALL_Asset = API.get_all_open_time()

if(ALL_Asset["binary"][sys.argv[4]]["open"]):
    status = API.buy(float(sys.argv[6]), sys.argv[4], sys.argv[5], int(sys.argv[3]))
    print(str(status[0])+"!"+str(status[1]).replace('\n', '').replace('\r', ''))
else:
    status = API.buy(float(sys.argv[6]), sys.argv[4]+"-OTC", sys.argv[5], int(sys.argv[3]))
    print((str(status[0])+"!"+str(status[1])))
#status = API.buy(float(sys.argv[6]), sys.argv[4], sys.argv[5], int(sys.argv[3]))
#print(status)
#API.buy(500,sys.argv[3],sys.argv[4],sys.argv[5])
#API.buy(valor, paridade, sinal, tempo (md5, md10))
