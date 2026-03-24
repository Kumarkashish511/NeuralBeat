#!/usr/bin/env python3
"""
Generate Aether Chrome Extension Icons
Resizes logo.png to required sizes
"""

from PIL import Image
import os
import sys

def main():
    sizes = [16, 32, 48, 128]
    icons_dir = 'icons'
    source_image = 'logo.png'
    
    if not os.path.exists(source_image):
        print(f"❌ Error: {source_image} not found.")
        sys.exit(1)
        
    # Create icons directory if it doesn't exist
    os.makedirs(icons_dir, exist_ok=True)
    
    print("Generating Aether extension icons from logo.png...")
    
    try:
        img = Image.open(source_image)
        # Convert to RGBA if not already
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
            
        for size in sizes:
            # Resize with high quality resampling
            # Use LANCZOS for better compatibility across PIL versions
            try:
                # Try new Resampling enum first (Pillow >= 10.0.0)
                resample_method = Image.Resampling.LANCZOS
            except AttributeError:
                # Fall back to old constant (Pillow < 10.0.0)
                resample_method = Image.LANCZOS
            
            icon = img.resize((size, size), resample_method)
            filename = f'{icons_dir}/icon{size}.png'
            icon.save(filename, 'PNG')
            print(f"✅ Created {filename}")
            
        print("\n🎉 All icons generated successfully!")
        
    except Exception as e:
        print(f"❌ Error processing image: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
