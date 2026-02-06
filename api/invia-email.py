from mangum import Mangum
from fast_api.app import app

# ASGI entrypoint for /api/invia-email
handler = Mangum(app)
