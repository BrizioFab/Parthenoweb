from mangum import Mangum
from fast_api.app import app






def handler(request):
    return {
        "statusCode": 200,
        "body": "Python runtime OK 🚀"
    }


handler = Mangum(app)
