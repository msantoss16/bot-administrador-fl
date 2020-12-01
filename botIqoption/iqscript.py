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
status = API.buy(int(sys.argv[6]), sys.argv[4], sys.argv[5], int(sys.argv[3]))
print(API.get_balance())
print(status)
#API.buy(500,sys.argv[3],sys.argv[4],sys.argv[5])
#API.buy(valor, paridade, sinal, tempo (md5, md10))
