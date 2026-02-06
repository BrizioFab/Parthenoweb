from fast_api.app import app

# ASGI entrypoint for Vercel — export `app` so the platform serves it.
from fast_api.app import app

# ASGI entrypoint for Vercel — export `app` so the platform serves it.
from mangum import Mangum
from fast_api.app import app






def handler(request):
    return {
        "statusCode": 200,
        "body": "Python runtime OK 🚀"
    }


handler = Mangum(app)