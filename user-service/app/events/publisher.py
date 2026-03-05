import aio_pika
import json
from aio_pika.pool import Pool
from app.config import settings

connection_pool = Pool(
    lambda: aio_pika.connect_robust(settings.RABBITMQ_URL),
    max_size = 10,
)

EXCHANGE_NAME = "events"

async def _get_channel():
    async with connection_pool.acquire() as conn:
        channel = await conn.channel()
        await channel.declare_exchange(EXCHANGE_NAME, aio_pika.ExchangeType.TOPIC, durable=True)
        return channel
    
channel_pool = Pool(_get_channel, max_size = 10,
)

async def publish_event(event_name: str, payload: dict):
    async with channel_pool.acquire() as channel:
        exchange = await channel.get_exchange(EXCHANGE_NAME)
        message = aio_pika.Message(body = json.dumps({"event": event_name, "data": payload, "version": 1}).encode(), 
                                   delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
                                   )
        await exchange.publish(message, routing_key=event_name, mandatory=True)
        await channel.default_exchange.publish(
            aio_pika.Message(body=json.dumps({"event": event_name, "data": payload}).encode(), delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
        ),
            routing_key=event_name
        )