from mangum import Mangum
from fast_api.app import app



# ASGI entrypoint for Vercel
handler = Mangum(app)
