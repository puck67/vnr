#!/usr/bin/env python3
"""
Script to add historical characters from 1858-1930 events to characters.json
"""

import json
import requests
from datetime import datetime

def search_character_info(name):
    """Search for character information online"""
    # This would normally use web scraping or APIs
    # For now, return basic template
    return {
        "biography": f"Nhân vật lịch sử {name} tham gia các sự kiện quan trọng trong giai đoạn 1858-1930.",
        "role": "Nhân vật lịch sử",
        "achievements": [f"Tham gia các sự kiện lịch sử quan trọng"],
        "birthYear": 1800,  # Default, will be updated
        "deathYear": 1900   # Default, will be updated
    }

def load_json_file(filepath):
    """Load JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return []

def save_json_file(filepath, data):
    """Save JSON file"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False

# Historical characters to add
new_characters = [
    # 1858 - Đà Nẵng
    {"name": "Charles Rigault de Genouilly", "events": ["event-001"], "side": "french"},
    {"name": "Thủy sư Đô đốc François Page", "events": ["event-001"], "side": "french"},
    {"name": "Hạm trưởng Léopold Pallu de la Barrière", "events": ["event-001"], "side": "french"},
    {"name": "Giám mục Pellerin", "events": ["event-001"], "side": "french"},
    {"name": "Linh mục Diaz", "events": ["event-001"], "side": "french"},
    {"name": "Đại tá Lanzarote", "events": ["event-001"], "side": "spanish"},
    {"name": "Lê Đình Lý", "events": ["event-001"], "side": "vietnamese"},
    {"name": "Phạm Văn Nghị", "events": ["event-001"], "side": "vietnamese"},
    {"name": "Trần Hoằng", "events": ["event-001"], "side": "vietnamese"},
    {"name": "Nguyễn Duy", "events": ["event-001"], "side": "vietnamese"},
    
    # 1859 - Gia Định
    {"name": "Đại tá De Vassoigne", "events": ["event-002"], "side": "french"},
    {"name": "Thuyền trưởng Bernard Jauréguiberry", "events": ["event-002"], "side": "french"},
    {"name": "Lê Tấn Kế", "events": ["event-002"], "side": "vietnamese"},
    {"name": "Nguyễn Công Trứ", "events": ["event-002"], "side": "vietnamese"},
    
    # 1861 - Khởi nghĩa
    {"name": "Doãn Uẩn", "events": ["event-003"], "side": "vietnamese"},
    {"name": "Phan Tòng", "events": ["event-003"], "side": "vietnamese"},
    {"name": "Lê Quang Quan", "events": ["event-003"], "side": "vietnamese"},
    {"name": "Bonard", "events": ["event-003"], "side": "french"},
    
    # 1862 - Hòa ước
    {"name": "Lâm Duy Hiệp", "events": ["event-016"], "side": "vietnamese"},
    {"name": "Trương Văn Uyển", "events": ["event-016"], "side": "vietnamese"},
    {"name": "De Lagrée", "events": ["event-016"], "side": "french"},
    
    # Continue with more characters...
]

def main():
    print("Adding historical characters to characters.json...")
    
    # Load existing data
    characters_file = r'c:\Users\Adminn\Desktop\prm\vnr\data\characters.json'
    characters_data = load_json_file(characters_file)
    
    if not characters_data:
        print("Failed to load characters.json")
        return
    
    # Get next character ID
    existing_ids = [char.get('id', '') for char in characters_data]
    next_id = len(existing_ids) + 1
    
    added_count = 0
    
    for char_info in new_characters:
        # Check if character already exists
        exists = any(char['name'] == char_info['name'] for char in characters_data)
        if exists:
            print(f"Character {char_info['name']} already exists, skipping...")
            continue
        
        # Create new character entry
        char_id = f"char-{next_id:03d}"
        
        # Get basic info (would normally search online)
        basic_info = search_character_info(char_info['name'])
        
        new_character = {
            "id": char_id,
            "name": char_info['name'],
            "avatar": f"/images/characters/{char_info['name'].lower().replace(' ', '-')}.jpg",
            "birthYear": basic_info['birthYear'],
            "deathYear": basic_info['deathYear'],
            "biography": basic_info['biography'],
            "role": basic_info['role'],
            "achievements": basic_info['achievements'],
            "relatedEvents": char_info['events'],
            "journey": []
        }
        
        characters_data.append(new_character)
        added_count += 1
        next_id += 1
        
        print(f"Added: {char_info['name']} (ID: {char_id})")
    
    # Save updated file
    if save_json_file(characters_file, characters_data):
        print(f"\nSuccessfully added {added_count} new characters!")
        print(f"Total characters: {len(characters_data)}")
    else:
        print("Failed to save characters.json")

if __name__ == "__main__":
    main()
