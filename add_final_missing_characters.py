#!/usr/bin/env python3
"""
Add the final missing characters that weren't found
"""

import json
import os

def load_json_file(filepath):
    """Load JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def save_json_file(filepath, data):
    """Save JSON file"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False

def get_next_char_id(characters_data):
    """Get next available character ID"""
    existing_ids = []
    for char in characters_data:
        char_id = char.get('id', '')
        if char_id.startswith('char-'):
            try:
                num = int(char_id.split('-')[1])
                existing_ids.append(num)
            except:
                continue
    
    if existing_ids:
        return f"char-{max(existing_ids) + 1:03d}"
    else:
        return "char-001"

def find_character_by_name(characters_data, name):
    """Find character by name"""
    for char in characters_data:
        if char['name'] == name:
            return char
    return None

# Missing characters that need to be added
final_missing_characters = [
    {
        "name": "Võ Duy Dương",
        "birthYear": 1820, "deathYear": 1867,
        "role": "Thiên hộ Dương - Lãnh đạo nghĩa quân miền Tây",
        "biography": "Võ Duy Dương (1820-1867), tự Thiên hộ Dương, là lãnh đạo nghĩa quân miền Tây, lập thành Đồng Cỏ Bay tại Đồng Tháp Mười, cộng tác với Nguyễn Trung Trực chống Pháp.",
        "achievements": [
            "Lãnh đạo nghĩa quân miền Tây",
            "Lập thành Đồng Cỏ Bay tại Đồng Tháp Mười", 
            "Cộng tác với Nguyễn Trung Trực chống Pháp"
        ],
        "relatedEvents": ["event-003", "event-046", "event-047"]
    },
    {
        "name": "Nguyễn Thiện Thuật",
        "birthYear": 1844, "deathYear": 1926,
        "role": "Lãnh đạo khởi nghĩa Bãi Sậy",
        "biography": "Nguyễn Thiện Thuật (1844-1926) là lãnh đạo khởi nghĩa Bãi Sậy năm 1867 ở Bắc Kỳ, sau này tiếp tục hoạt động kháng chiến trong phong trào Cần Vương.",
        "achievements": [
            "Lãnh đạo khởi nghĩa Bãi Sậy (1867)",
            "Tham gia phong trào Cần Vương",
            "Hoạt động kháng chiến lâu dài"
        ],
        "relatedEvents": ["event-004", "event-008"]
    },
    {
        "name": "Hoàng Diệu",
        "birthYear": 1829, "deathYear": 1882,
        "role": "Tổng đốc Hà Nội",
        "biography": "Hoàng Diệu (1829-1882) là Tổng đốc Hà Nội, kiên quyết chống lại cuộc tấn công của Francis Garnier năm 1882, tự thắt cổ tuẫn tiết khi thành thất thủ.",
        "achievements": [
            "Tổng đốc Hà Nội",
            "Kiên quyết chống Francis Garnier (1882)",
            "Tự thắt cổ tuẫn tiết khi thành thất thủ"
        ],
        "relatedEvents": ["event-005", "event-062"]
    },
    {
        "name": "Nguyễn Văn Tường",
        "birthYear": 1824, "deathYear": 1886,
        "role": "Đại thần triều Nguyễn, chủ trương hòa hoãn",
        "biography": "Nguyễn Văn Tường (1824-1886) là đại thần triều Nguyễn, chủ trương hòa hoãn với Pháp, tham gia ký các hiệp ước, bị đày sang Tahiti sau này.",
        "achievements": [
            "Đại thần triều Nguyễn",
            "Tham gia ký Hòa ước Giáp Tuất (1874)",
            "Chủ trương hòa hoãn với Pháp"
        ],
        "relatedEvents": ["event-006", "event-018"]
    }
]

def main():
    print("🚀 Adding final missing characters...")
    
    # File paths
    base_path = r'c:\Users\Adminn\Desktop\prm\vnr'
    characters_file = os.path.join(base_path, 'data', 'characters.json')
    
    # Load existing data
    characters_data = load_json_file(characters_file)
    if characters_data is None:
        print("❌ Failed to load characters.json")
        return
    
    print(f"📊 Current characters: {len(characters_data)}")
    
    # Add missing characters
    added_count = 0
    
    for char_info in final_missing_characters:
        # Check if character already exists
        exists = find_character_by_name(characters_data, char_info['name'])
        if exists:
            print(f"⏭️  {char_info['name']} already exists, skipping...")
            continue
        
        # Get next character ID
        char_id = get_next_char_id(characters_data)
        
        # Create new character entry
        new_character = {
            "id": char_id,
            "name": char_info['name'],
            "avatar": f"/images/characters/{char_info['name'].lower().replace(' ', '-')}.jpg",
            "birthYear": char_info['birthYear'],
            "deathYear": char_info['deathYear'],
            "biography": char_info['biography'],
            "role": char_info['role'],
            "achievements": char_info['achievements'],
            "relatedEvents": char_info['relatedEvents'],
            "journey": [
                {
                    "eventId": char_info['relatedEvents'][0] if char_info['relatedEvents'] else "event-001",
                    "year": char_info['birthYear'] + 40,  # Approximate active year
                    "location": [10.8231, 106.6297],  # Default location
                    "description": f"Tham gia sự kiện lịch sử quan trọng"
                }
            ]
        }
        
        characters_data.append(new_character)
        added_count += 1
        
        print(f"✅ Added: {char_info['name']} (ID: {char_id})")
    
    # Save updated file
    if save_json_file(characters_file, characters_data):
        print(f"\n🎉 Successfully added final missing characters!")
        print(f"   ➕ Added: {added_count} characters")
        print(f"   📊 Total characters: {len(characters_data)}")
    else:
        print("❌ Failed to save characters.json")

if __name__ == "__main__":
    main()
