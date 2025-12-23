
import urllib.request
import urllib.parse
import json
import os
import subprocess

# Mappings: Local Filename (without ext) -> Wikimedia Filename (without 'File:' and '.svg')
MAPPINGS = {
    "animali-selvatici": "Italian_traffic_signs_-_animali_selvatici_vaganti",
    "caduta-massi": "Italian_traffic_signs_-_caduta_massi_da_sinistra", 
    "catene-neve": "Italian_traffic_signs_-_catene_da_neve_obbligatorie",
    "centro-abitato": "Italian_traffic_signs_-_inizio_centro_abitato",
    "fine-centro-abitato": "Italian_traffic_signs_-_fine_centro_abitato",
    "divieto-accesso": "Italian_traffic_signs_-_senso_vietato",
    "divieto-transito": "Italian_traffic_signs_-_divieto_di_transito",
    "divieto-svolta-destra": "Italian_traffic_signs_-_divieto_di_svolta_a_destra_(figura_II_51)",
    "divieto-svolta-sinistra": "Italian_traffic_signs_-_divieto_di_svolta_a_sinistra_(figura_II_50)",
    "divieto-inversione": "Italian_traffic_signs_-_divieto_di_inversione_di_marcia",
    "divieto-sorpasso": "Italian_traffic_signs_-_divieto_di_sorpasso",
    "limite-minimo-velocita": "Italian_traffic_signs_-_limite_minimo_di_velocita", 
    "direzione-obbligatoria-destra": "Italian_traffic_signs_-_direzione_obbligatoria_a_destra",
    "precedenza-senso-opposto": "Italian_traffic_signs_-_precedenza_nei_sensi_unici_alternati",
    "incrocio-diritto-precedenza": "Italian_traffic_signs_-_intersezione_con_diritto_di_precedenza",
    "intersezione-t-destra": "Italian_traffic_signs_-_intersezione_a_T_con_diritto_di_precedenza_a_destra",
    "strada-deformata": "Italian_traffic_signs_-_strada_deformata",
    "dosso": "Italian_traffic_signs_-_dosso",
    "strettoia-simmetrica": "Italian_traffic_signs_-_strettoia_simmetrica",
    "discesa-pericolosa": "Italian_traffic_signs_-_discesa_pericolosa",
    "salita-ripida": "Italian_traffic_signs_-_salita_ripida",
    "banchina-pericolosa": "Italian_traffic_signs_-_banchina_cedevole",
    "lavori-in-corso": "Italian_traffic_signs_-_lavori",
    "divieto-transito-veicoli-motore": "Italian_traffic_signs_-_divieto_di_transito_alle_autovetture",
    "divieto-transito-pedoni": "Italian_traffic_signs_-_transito_vietato_ai_pedoni",
    "divieto-transito-motocicli": "Italian_traffic_signs_-_divieto_di_transito_ai_motocicli",
    "divieto-transito-autocarri": "Italian_traffic_signs_-_divieto_di_transito_agli_autocarri",
}

BASE_API = "https://commons.wikimedia.org/w/api.php"
DEST_DIR = "assets/images/segnali"

def get_image_url(filename):
    titles = [
        f"File:{filename}.svg",
        f"File:{filename.replace('Italian_traffic_signs_-_', '')}.svg"
    ]
    
    for title in titles:
        params = {
            "action": "query",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url",
            "format": "json"
        }
        query_string = urllib.parse.urlencode(params)
        url = f"{BASE_API}?{query_string}"
        
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'})
            with urllib.request.urlopen(req) as response:
                data = json.load(response)
                pages = data["query"]["pages"]
                for page_id in pages:
                    if "missing" not in pages[page_id]:
                        return pages[page_id]["imageinfo"][0]["url"]
        except Exception as e:
            print(f"Error fetching metadata for {title}: {e}")
    return None

def download_and_convert(local_name, wiki_name):
    print(f"Processing {local_name}...")
    url = get_image_url(wiki_name)
    if not url:
        print(f"❌ URL not found for {wiki_name}")
        return

    print(f"  Found URL: {url}")
    svg_path = os.path.join(DEST_DIR, f"{local_name}.svg")
    png_path = os.path.join(DEST_DIR, f"{local_name}.png")

    try:
        # Download SVG
        # Use headers to avoid 403 Forbidden on some CDNs
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'})
        with urllib.request.urlopen(req) as response:
            with open(svg_path, 'wb') as f:
                f.write(response.read())
        
        # Convert to PNG using qlmanage
        # qlmanage -t -s 1000 -o <out_dir> <svg_file>
        try:
             subprocess.run(["qlmanage", "-t", "-s", "500", "-o", DEST_DIR, svg_path], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception as e:
             print(f"Conversion command failed: {e}")
        
        # Rename .svg.png to .png
        generated_png = svg_path + ".png"
        if os.path.exists(generated_png):
            if os.path.exists(png_path):
                os.remove(png_path)
            os.rename(generated_png, png_path)
            print(f"✅ Replaced {local_name}.png")
        else:
            print(f"❌ Conversion output not found for {local_name}")

        # Cleanup SVG
        if os.path.exists(svg_path):
            os.remove(svg_path)

    except Exception as e:
        print(f"❌ Error processing {local_name}: {e}")

def main():
    for local, wiki in MAPPINGS.items():
        download_and_convert(local, wiki)

if __name__ == "__main__":
    main()
