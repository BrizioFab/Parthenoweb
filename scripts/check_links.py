                      
"""
Controllo link locali per file .html nel progetto.
Stampa link rotti e suggerisce correzioni relative.
"""
import os
import re
import sys
from urllib.parse import urljoin, urlparse

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

HTML_PATTERN = re.compile(r"<\s*(?:a|link|script|img|source|video|iframe|form)[^>]+(?:href|src|action)\s*=\s*[\"']([^\"']+)[\"']", re.IGNORECASE)
ID_PATTERN = re.compile(r"id\s*=\s*\"([^\"]+)\"|id\s*=\s*'([^']+)'", re.IGNORECASE)

skip_schemes = ('http:', 'https:', 'mailto:', 'tel:', 'javascript:', '//')

broken = []
checked = 0

skip_dirs = {'node_modules', '.venv', 'venv', '__pycache__', '.git'}
for dirpath, dirnames, filenames in os.walk(ROOT):
                                                             
    dirnames[:] = [d for d in dirnames if d not in skip_dirs]
    for fname in filenames:
        if not fname.lower().endswith('.html'):
            continue
        fpath = os.path.join(dirpath, fname)
        rel_fpath = os.path.relpath(fpath, ROOT)
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
            text = f.read()
        ids = set(m.group(1) or m.group(2) for m in ID_PATTERN.finditer(text))
        for m in HTML_PATTERN.finditer(text):
            href = m.group(1).strip()
            checked += 1
            if not href or href.startswith('#'):
                                                          
                if href.startswith('#'):
                    anchor = href[1:]
                    if anchor and anchor not in ids:
                        broken.append((rel_fpath, href, 'anchor-not-found'))
                continue
            if href.startswith(skip_schemes):
                continue
                                   
            if href.startswith('/'):
                                                                       
                target = os.path.join(ROOT, href.lstrip('/'))
                                                                                                           
                if not os.path.exists(target):
                    api_try = os.path.join(ROOT, 'api', href.lstrip('/') + '.py')
                    if os.path.exists(api_try):
                        target = api_try
            else:
                target = os.path.normpath(os.path.join(dirpath, href))
                                                
            target = target.split('#')[0].split('?')[0]
            if not os.path.exists(target):
                broken.append((rel_fpath, href, os.path.relpath(target, ROOT)))

                                                                                  
                                                                     
api_checks = [('/invia-email', os.path.join(ROOT, 'api', 'invia-email.py'))]
for endpoint, path in api_checks:
    if not os.path.exists(path):
        broken.append(('project-root', endpoint, os.path.relpath(path, ROOT)))

               
print('Checked references:', checked)
if not broken:
    print('Nessun link locale rotto trovato.')
    sys.exit(0)

print('\nLink rotti trovati:')
for src_file, href, target in broken:
    print(f'- File: {src_file}  ->  href/action: "{href}"  -> risolto in: {target}')

                                 
sys.exit(2)
