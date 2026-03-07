import aio_pika
import json
from config import settings
from email_service import send_email

async def consume():

    connection = await aio_pika.connect_robust(settings.rabbitmq_url)

    channel = await connection.channel()

    queue = await channel.declare_queue("user_events", durable=True)

    async with queue.iterator() as queue_iter:
        async for message in queue_iter:
            async with message.process():
                payload = json.loads(message.body)

                event = payload["event"]
                data = payload["data"]

                if event == "user.created":
                    await send_email(
                        to=data["email"],
                        subject="Welcome",
                        body="Welcome to our platform!"
                    )
