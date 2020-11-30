import configs
import asyncio

def bot():
    pass

def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(bot())
    loop.close()