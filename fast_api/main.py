

# DA MODIFICARE SOLO SE:  Aggiungi nuove pagine → aggiungi @app.get("/nuova-pagina", response_class=HTMLResponse)


from fastapi import FastAPI, Request, Form, Response
from fastapi.responses import HTMLResponse, Response, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from datetime import date


from .email_utils import send_email  
from .validators import FormValidator  


BASE_DIR = Path(__file__).parent.parent  
STATIC_DIR = BASE_DIR / "static"         
TEMPLATES_DIR = Path(__file__).parent / "templates"  


app = FastAPI(
    title="Parthenoweb",             
    description="Web Design & Development",  
    version="1.0.0"                 
)

#
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],             
    allow_credentials=True,          
    allow_methods=["*"],            
    allow_headers=["*"],             
)


app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


templates = Jinja2Templates(directory=TEMPLATES_DIR)


def _base_url(request: Request) -> str:
    return str(request.base_url).rstrip("/")


def _canonical_url(request: Request, path: str) -> str:
    return f"{_base_url(request)}{path}"


def _build_structured_data(request: Request) -> dict:
    base_url = _base_url(request)
    return {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Parthenoweb",
        "url": base_url,
        "logo": f"{base_url}/static/assets/images/logo-sfondato.webp",
        "description": "Studio di sviluppo web con sede a Napoli, nel quartiere Materdei. Realizziamo siti moderni, veloci, responsive e ottimizzati SEO.",
        "email": "parthenoweb@gmail.com",
        "telephone": "+39 377 092 0451",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Napoli",
            "addressRegion": "Campania",
            "addressCountry": "IT",
            "streetAddress": "Materdei"
        },
        "areaServed": [
            "Napoli",
            "Materdei",
            "Vomero",
            "Centro Storico",
            "Chiaia"
        ],
        "serviceType": [
            "Sviluppo siti web professionali",
            "Realizzazione siti WordPress",
            "E-commerce",
            "SEO locale per attività a Napoli",
            "Ottimizzazione Core Web Vitals",
            "UI/UX design",
            "Branding digitale",
            "Cookie banner GDPR",
            "Web analytics",
            "Manutenzione e assistenza"
        ]
    }


def _build_seo_context(request: Request, page_key: str) -> dict:
    home_canonical = _canonical_url(request, "/")
    contatti_canonical = _canonical_url(request, "/contatti")
    cookies_canonical = _canonical_url(request, "/cookies")

    page_map = {
        "home": {
            "page_title": "Sviluppo Siti Web Napoli | Realizzazione Siti Web Materdei | Parthenoweb",
            "seo_description": "Parthenoweb è uno studio di sviluppo siti web a Napoli (Materdei): realizziamo siti moderni, veloci, responsive, SEO-ready, e-commerce e WordPress per attività locali e professionisti.",
            "seo_keywords": "sviluppo siti web Napoli, realizzazione siti web Materdei, siti web professionali Napoli, SEO locale Napoli, sviluppo WordPress Napoli, e-commerce Napoli",
            "canonical_url": home_canonical,
            "structured_data": _build_structured_data(request)
        },
        "contatti": {
            "page_title": "Contatti | Consulenza Siti Web Napoli | Parthenoweb",
            "seo_description": "Contatta Parthenoweb per una consulenza sul tuo progetto web a Napoli. Supportiamo attività locali, professionisti, ristoranti, B&B, negozi e artigiani.",
            "seo_keywords": "contatti sviluppo siti web Napoli, consulenza siti web Materdei, agenzia web Napoli contatti",
            "canonical_url": contatti_canonical,
            "structured_data": {
                "@context": "https://schema.org",
                "@type": "ContactPage",
                "name": "Contatti Parthenoweb",
                "url": contatti_canonical,
                "about": {
                    "@type": "ProfessionalService",
                    "name": "Parthenoweb"
                }
            }
        },
        "cookies": {
            "page_title": "Cookie Policy | Parthenoweb",
            "seo_description": "Informativa cookie di Parthenoweb: utilizzo di cookie tecnici essenziali e gestione preferenze.",
            "seo_keywords": "cookie policy parthenoweb, privacy cookie tecnici",
            "seo_robots": "noindex,follow",
            "canonical_url": cookies_canonical
        }
    }

    return page_map.get(page_key, page_map["home"])




@app.get("/", response_class=HTMLResponse)
async def home(request: Request):

    context = {
        "request": request,              
        "page": "home",                  
        "user_accepted_cookies": request.cookies.get("cookiesAccepted")  
    }
    context.update(_build_seo_context(request, "home"))
    return templates.TemplateResponse("home.html", context)


@app.get("/contatti", response_class=HTMLResponse)
async def contatti_get(request: Request):

    context = {
        "request": request,
        "page": "contatti",
        "user_accepted_cookies": request.cookies.get("cookiesAccepted"),
        "form_data": {},                 
        "errors": None,                  
        "success": False,                
        "error": None                    
    }
    context.update(_build_seo_context(request, "contatti"))
    return templates.TemplateResponse("contatti.html", context)


@app.post("/contatti", response_class=HTMLResponse)
async def contatti_post(
    request: Request,
    nome: str = Form(...),              
    email: str = Form(...),             
    telefono: str = Form(default=""),   
    descrizione: str = Form(...)        
):
 
    form_data = {
        "nome": nome,
        "email": email,
        "telefono": telefono,
        "descrizione": descrizione
    }
    
    
    errors = FormValidator.validate_all(nome, email, descrizione, telefono or None)
    
    
    if errors:
        context = {
            "request": request,
            "page": "contatti",
            "user_accepted_cookies": request.cookies.get("cookiesAccepted"),
            "form_data": form_data,      
            "errors": errors,             
            "success": False,
            "error": None
        }
        context.update(_build_seo_context(request, "contatti"))
        return templates.TemplateResponse("contatti.html", context)
    
   
    try:
        
        send_email(nome, telefono or None, email, descrizione)
        
        
        context = {
            "request": request,
            "page": "contatti",
            "user_accepted_cookies": request.cookies.get("cookiesAccepted"),
            "form_data": {},              
            "errors": None,
            "success": True,              
            "error": None
        }
        context.update(_build_seo_context(request, "contatti"))
        response = templates.TemplateResponse("contatti.html", context)
     
        response.set_cookie("cookiesAccepted", "true", max_age=60*60*24*365)
        return response
        
    
    except Exception as e:
        error_msg = f"Errore nell'invio della richiesta: {str(e)}"
        print(f"✗ Error sending email: {e}")
        
        context = {
            "request": request,
            "page": "contatti",
            "user_accepted_cookies": request.cookies.get("cookiesAccepted"),
            "form_data": form_data,      
            "errors": None,
            "success": False,
            "error": error_msg           
        }
        context.update(_build_seo_context(request, "contatti"))
        return templates.TemplateResponse("contatti.html", context)




@app.get("/cookies", response_class=HTMLResponse)
async def cookies(request: Request):

    context = {
        "request": request,
        "page": "cookies",
        "user_accepted_cookies": request.cookies.get("cookiesAccepted")
    }
    context.update(_build_seo_context(request, "cookies"))
    return templates.TemplateResponse("cookies.html", context)


@app.get("/robots.txt", response_class=PlainTextResponse)
async def robots_txt(request: Request):
    base_url = _base_url(request)
    content = (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /api/\n\n"
        f"Sitemap: {base_url}/sitemap.xml\n"
    )
    return PlainTextResponse(content)


@app.get("/llms.txt", response_class=PlainTextResponse)
async def llms_txt(request: Request):
    base_url = _base_url(request)
    content = (
        "# Parthenoweb\n\n"
        "Parthenoweb è uno studio di sviluppo web con sede a Napoli (Materdei).\n"
        "Realizza siti web moderni, veloci, responsive e ottimizzati SEO per attività locali, professionisti e piccole imprese.\n\n"
        "## Servizi\n"
        "- Sviluppo siti web professionali\n"
        "- Realizzazione siti WordPress\n"
        "- E-commerce\n"
        "- SEO locale per attività a Napoli\n"
        "- Ottimizzazione Core Web Vitals\n"
        "- UI/UX design\n"
        "- Branding digitale\n"
        "- Cookie banner GDPR\n"
        "- Web analytics\n"
        "- Manutenzione e assistenza\n\n"
        "## URL principali\n"
        f"- {base_url}/\n"
        f"- {base_url}/contatti\n"
        f"- {base_url}/cookies\n"
    )
    return PlainTextResponse(content)


@app.get("/sitemap.xml")
async def sitemap_xml(request: Request):
    urls = [
        _canonical_url(request, "/"),
        _canonical_url(request, "/contatti"),
        _canonical_url(request, "/cookies")
    ]
    lastmod = date.today().isoformat()
    xml_items = "\n".join(
        (
            "  <url>\n"
            f"    <loc>{url}</loc>\n"
            f"    <lastmod>{lastmod}</lastmod>\n"
            "    <changefreq>weekly</changefreq>\n"
            "    <priority>0.8</priority>\n"
            "  </url>"
        )
        for url in urls
    )
    xml = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
        "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
        f"{xml_items}\n"
        "</urlset>"
    )
    return Response(content=xml, media_type="application/xml")

@app.post("/api/cookies/accept")
async def accept_cookies(response: Response):
  
    response.set_cookie("cookiesAccepted", "true", max_age=60*60*24*365)
    return {"status": "ok"}

@app.post("/invia-email")
async def invia_email_legacy(
    nome: str = Form(...),
    email: str = Form(...),
    telefono: str = Form(default=""),
    descrizione: str = Form(...)
):
 
    errors = FormValidator.validate_all(nome, email, descrizione, telefono or None)
    

    if errors:
        return {
            "success": False,
            "message": "Validazione fallita: " + "; ".join(errors)
        }
    

    try:
        send_email(nome, telefono or None, email, descrizione)
        return {
            "success": True,
            "message": "Email inviata con successo"
        }
    except Exception as e:
        print(f"✗ Error: {e}")
        return {
            "success": False,
            "message": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
