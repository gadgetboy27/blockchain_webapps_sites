import cryptocompare


cryptocompare.get_coin_list()['BTC']['FullName']

def get_crypto_price(cryptocurrency,currency):
    return cryptocompare.get_price(cryptocurrency,curr=currency)[cryptocurrency][currency]

def get_crypto_name()