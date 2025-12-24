from PIL import Image
import os

source_path = '/Users/kmrnnwr/.gemini/antigravity/brain/49bab8b7-1ee5-42ff-80e1-ec35dfbd89ff/uploaded_image_1766561792225.png'
output_dir = 'assets/images/segnali/'

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

img = Image.open(source_path)
width, height = img.size
cell_width = width // 4
cell_height = height // 2

# Filenames as mapped in the plan
filenames = [
    # Row 1
    "percorso-unico-pedonale-ciclabile.png",      # sec-5-19
    "fine-pista-ciclabile-contigua.png",          # sec-5-31 (NEW)
    "fine-percorso-pedonale-ciclabile.png",       # sec-5-20
    "percorso-riservato-quadrupedi.png",          # sec-5-21
    # Row 2
    "fine-percorso-riservato-quadrupedi.png",     # sec-5-22
    "alt-dogana.png",                             # sec-5-23
    "alt-polizia.png",                            # sec-5-26
    "alt-stazione.png"                            # sec-5-27
]

count = 0
for row in range(2):
    for col in range(4):
        if count >= len(filenames):
            break
            
        left = col * cell_width
        upper = row * cell_height
        right = left + cell_width
        # Reduce lower bound to exclude text at the bottom.
        # Trial: Keep top 75% of the cell.
        lower = upper + int(cell_height * 0.75)
        
        # Crop
        cell = img.crop((left, upper, right, lower))
        
        # Save
        output_path = os.path.join(output_dir, filenames[count])
        cell.save(output_path)
        print(f"Saved: {output_path}")
        
        count += 1
