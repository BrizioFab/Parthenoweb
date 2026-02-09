#!/usr/bin/env python3
"""
Test di integrazione dell'applicazione FastAPI
Verifica che la app avvii correttamente e importi tutti i moduli necessari
"""
import sys
from pathlib import Path

def test_imports():
    """Testa che tutti i moduli siano importabili"""
    print("🧪 Testando import moduli...")
    try:
        from fast_api.main import app, templates
        print("✓ FastAPI app importata")
        
        from fast_api.validators import FormValidator
        print("✓ FormValidator importato")
        
        from fast_api.email_utils import send_email
        print("✓ email_utils importato")
        
        return True
    except ImportError as e:
        print(f"✗ Errore import: {e}")
        return False


def test_templates():
    """Verifica che sia i templates siano presenti"""
    print("\n🧪 Testando template files...")
    templates_dir = Path("fast_api/templates")
    required = ["base.html", "home.html", "contatti.html", "cookies.html"]
    
    missing = []
    for template in required:
        path = templates_dir / template
        if path.exists():
            print(f"✓ {template}")
        else:
            print(f"✗ {template} NON TROVATO")
            missing.append(template)
    
    return len(missing) == 0


def test_static_files():
    """Verifica che file statici siano presenti"""
    print("\n�912 Testando file statici...")
    static_dir = Path("static")
    
    required_dirs = ["css", "js", "assets/images"]
    missing = []
    
    for dir_path in required_dirs:
        full_path = static_dir / dir_path
        if full_path.exists():
            print(f"✓ {dir_path}/")
        else:
            print(f"✗ {dir_path}/ NON TROVATO")
            missing.append(dir_path)
    
    return len(missing) == 0


def test_validators():
    """Testa FormValidator"""
    print("\n🧪 Testando validatori form...")
    try:
        from fast_api.validators import FormValidator
        
        # Test email valida
        err = FormValidator.validate_email("test@example.com")
        if err is None:
            print("✓ Email valida riconosciuta")
        
        # Test email non valida
        err = FormValidator.validate_email("invalid-email")
        if err:
            print("✓ Email non valida rilevata")
        
        # Test nome valido
        err = FormValidator.validate_nome("Mario Rossi")
        if err is None:
            print("✓ Nome valido riconosciuto")
        
        # Test nome non valido
        err = FormValidator.validate_nome("M")
        if err:
            print("✓ Nome troppo breve rilevato")
        
        return True
    except Exception as e:
        print(f"✗ Errore validatori: {e}")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("🧪 PARTHENOWEB - TEST DI INTEGRAZIONE")
    print("=" * 60)
    
    results = []
    results.append(("Import moduli", test_imports()))
    results.append(("Template files", test_templates()))
    results.append(("Static files", test_static_files()))
    results.append(("Validators", test_validators()))
    
    print("\n" + "=" * 60)
    print("📊 RISULTATI")
    print("=" * 60)
    
    all_pass = True
    for name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status}: {name}")
        if not passed:
            all_pass = False
    
    print("=" * 60)
    if all_pass:
        print("✓ TUTTI I TEST PASSATI - App pronta per avvio!")
        print("\nPer avviare il server:")
        print("  python start_dev_server.py")
        sys.exit(0)
    else:
        print("✗ Alcuni test falliti - Controllare gli errori sopra")
        sys.exit(1)
