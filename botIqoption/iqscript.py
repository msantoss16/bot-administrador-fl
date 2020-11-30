from iqoptionapi.stable_api import IQ_Option
import sys
API = IQ_Option(sys.argv[1], sys.argv[2])
API.connect()
print(API.get_balance())