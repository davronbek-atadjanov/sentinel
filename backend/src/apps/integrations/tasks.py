import json
import time
import requests
import hashlib
import hmac
from celery import shared_task
from django.utils import timezone

from apps.integrations.models.integrations import Webhook, WebhookDelivery

@shared_task(bind=True, max_retries=3)
def deliver_webhook_task(self, webhook_id, event_type, payload):
    try:
        webhook = Webhook.objects.get(id=webhook_id, is_active=True)
    except Webhook.DoesNotExist:
        # Webhook was deleted or deactivated before delivery
        return "Webhook not found or inactive"

    json_payload = json.dumps(payload)
    
    # Generate signature using HMAC-SHA256
    signature = hmac.new(
        webhook.secret_key.encode('utf-8'),
        json_payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    headers = {
        "Content-Type": "application/json",
        "X-Sentinel-Event": event_type,
        "X-Sentinel-Signature": f"sha256={signature}",
    }

    start_time = time.time()
    response_status = None
    response_body = ""

    try:
        response = requests.post(
            webhook.url, 
            data=json_payload, 
            headers=headers, 
            timeout=10
        )
        response_status = response.status_code
        response_body = response.text[:2000] # store up to 2000 chars of response

        if response.status_code >= 500:
            # Server error on webhook receiver side, we should retry!
            duration_ms = int((time.time() - start_time) * 1000)
            WebhookDelivery.objects.create(
                webhook=webhook,
                event_type=event_type,
                request_payload=payload,
                response_status_code=response_status,
                response_body=response_body,
                duration_ms=duration_ms
            )
            # Retry exponentially (1min, 5min, 15min default behavior roughly based on countdown)
            countdown = 60 * (2 ** self.request.retries) 
            raise self.retry(exc=Exception(f"Receiver returned {response_status}"), countdown=countdown)

    except requests.exceptions.RequestException as e:
        response_body = str(e)[:2000]
        duration_ms = int((time.time() - start_time) * 1000)
        
        # Save failed attempt
        WebhookDelivery.objects.create(
            webhook=webhook,
            event_type=event_type,
            request_payload=payload,
            response_status_code=0,
            response_body=response_body,
            duration_ms=duration_ms
        )
        
        # Retry connection drops/timeouts
        countdown = 60 * (2 ** self.request.retries)
        raise self.retry(exc=e, countdown=countdown)

    # Success recording (2xx, 3xx, 4xx responses)
    duration_ms = int((time.time() - start_time) * 1000)
    WebhookDelivery.objects.create(
        webhook=webhook,
        event_type=event_type,
        request_payload=payload,
        response_status_code=response_status,
        response_body=response_body,
        duration_ms=duration_ms
    )

    return f"Delivered to {webhook.url} with status {response_status}"
