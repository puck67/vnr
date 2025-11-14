#!/usr/bin/env python3
"""
Script to add all historical characters from the detailed list to characters.json
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

# Complete list of characters to add
all_characters = [
    # 1858 - Đà Nẵng Attack
    {
        "name": "François Page",
        "birthYear": 1810, "deathYear": 1885,
        "role": "Thủy sư Đô đốc Pháp",
        "biography": "François Page là thủy sư đô đốc Pháp, tham gia cuộc tấn công Đà Nẵng năm 1858 dưới quyền chỉ huy của Rigault de Genouilly.",
        "achievements": ["Tham gia tấn công Đà Nẵng (1858)", "Phụ tá đắc lực của Rigault de Genouilly"],
        "relatedEvents": ["event-001"]
    },
    {
        "name": "Léopold Pallu de la Barrière",
        "birthYear": 1815, "deathYear": 1880,
        "role": "Hạm trưởng Pháp",
        "biography": "Léopold Pallu de la Barrière là hạm trưởng trong liên quân Pháp-Tây Ban Nha tấn công Đà Nẵng năm 1858.",
        "achievements": ["Hạm trưởng trong cuộc tấn công Đà Nẵng (1858)"],
        "relatedEvents": ["event-001"]
    },
    {
        "name": "Giám mục Pellerin",
        "birthYear": 1820, "deathYear": 1890,
        "role": "Giám mục Pháp, hậu thuẫn cuộc xâm lược",
        "biography": "Giám mục Pellerin là một trong những người hậu thuẫn mạnh mẽ cho cuộc xâm lược Việt Nam, sử dụng lý do bảo vệ các giáo sĩ.",
        "achievements": ["Hậu thuẫn cuộc xâm lược Việt Nam", "Tuyên truyền cho chính sách thực dân"],
        "relatedEvents": ["event-001"]
    },
    {
        "name": "Linh mục Diaz",
        "birthYear": 1825, "deathYear": 1885,
        "role": "Linh mục Tây Ban Nha",
        "biography": "Linh mục Diaz là đại diện tôn giáo Tây Ban Nha tham gia cuộc tấn công Đà Nẵng năm 1858.",
        "achievements": ["Đại diện tôn giáo trong liên quân Pháp-Tây Ban Nha"],
        "relatedEvents": ["event-001"]
    },
    {
        "name": "Đại tá Lanzarote",
        "birthYear": 1820, "deathYear": 1885,
        "role": "Đại tá quân đội Tây Ban Nha",
        "biography": "Đại tá Lanzarote là sĩ quan chỉ huy quân đội Tây Ban Nha trong liên quân tấn công Đà Nẵng năm 1858.",
        "achievements": ["Chỉ huy quân Tây Ban Nha tại Đà Nẵng (1858)"],
        "relatedEvents": ["event-001"]
    },
    {
        "name": "Lê Đình Lý",
        "birthYear": 1810, "deathYear": 1875,
        "role": "Quan chỉ huy phòng thủ Đà Nẵng",
        "biography": "Lê Đình Lý là quan triều Nguyễn, tham gia chỉ huy phòng thủ Đà Nẵng chống lại cuộc tấn công của liên quân Pháp-Tây Ban Nha năm 1858.",
        "achievements": ["Tham gia phòng thủ Đà Nẵng (1858)", "Cộng tác với Nguyễn Tri Phương"],
        "relatedEvents": ["event-001", "event-035"]
    },
    {
        "name": "Phạm Văn Nghị",
        "birthYear": 1815, "deathYear": 1880,
        "role": "Quan triều Nguyễn",
        "biography": "Phạm Văn Nghị là quan triều Nguyễn tham gia phòng thủ Đà Nẵng năm 1858.",
        "achievements": ["Tham gia phòng thủ Đà Nẵng (1858)"],
        "relatedEvents": ["event-001"]
    },
    
    # 1859 - Gia Định
    {
        "name": "Đại tá De Vassoigne",
        "birthYear": 1815, "deathYear": 1885,
        "role": "Đại tá quân đội Pháp",
        "biography": "Đại tá De Vassoigne là sĩ quan Pháp tham gia chiếm Gia Định năm 1859 và các chiến dịch tiếp theo ở Nam Kỳ.",
        "achievements": ["Tham gia chiếm Gia Định (1859)", "Chỉ huy các chiến dịch ở Nam Kỳ"],
        "relatedEvents": ["event-002", "event-043"]
    },
    {
        "name": "Bernard Jauréguiberry",
        "birthYear": 1815, "deathYear": 1887,
        "role": "Thuyền trưởng Pháp",
        "biography": "Bernard Jauréguiberry là thuyền trưởng Pháp tham gia chiếm Gia Định năm 1859, sau này trở thành Đô đốc và Bộ trưởng Hải quân Pháp.",
        "achievements": ["Tham gia chiếm Gia Định (1859)", "Sau này trở thành Đô đốc và Bộ trưởng"],
        "relatedEvents": ["event-002"]
    },
    {
        "name": "Lê Tấn Kế",
        "birthYear": 1820, "deathYear": 1885,
        "role": "Quan triều Nguyễn",
        "biography": "Lê Tấn Kế là quan triều Nguyễn tham gia phòng thủ Gia Định năm 1859.",
        "achievements": ["Tham gia phòng thủ Gia Định (1859)"],
        "relatedEvents": ["event-002"]
    },
    {
        "name": "Nguyễn Công Trứ",
        "birthYear": 1778, "deathYear": 1858,
        "role": "Đại thần triều Nguyễn, chủ trương chống Pháp",
        "biography": "Nguyễn Công Trứ (1778-1858) là đại thần triều Nguyễn, nhà thơ và quan chức có chủ trương cứng rắn chống Pháp. Ông qua đời ngay trước cuộc xâm lược nhưng tư tưởng chống ngoại xâm của ông ảnh hưởng lớn.",
        "achievements": ["Chủ trương chống Pháp kiên quyết", "Nhà thơ và quan chức tài năng", "Ảnh hưởng tư tưởng chống ngoại xâm"],
        "relatedEvents": ["event-001", "event-002"]
    }
]

def main():
    print("🚀 Adding historical characters to characters.json...")
    
    # File paths
    base_path = r'c:\Users\Adminn\Desktop\prm\vnr'
    characters_file = os.path.join(base_path, 'data', 'characters.json')
    
    # Load existing data
    characters_data = load_json_file(characters_file)
    if characters_data is None:
        print("❌ Failed to load characters.json")
        return
    
    print(f"📊 Current characters: {len(characters_data)}")
    
    # Add new characters
    added_count = 0
    skipped_count = 0
    
    for char_info in all_characters:
        # Check if character already exists
        exists = any(char['name'] == char_info['name'] for char in characters_data)
        if exists:
            print(f"⏭️  {char_info['name']} already exists, skipping...")
            skipped_count += 1
            continue
        
        # Get next character ID
        char_id = get_next_char_id(characters_data)
        
        # Create new character entry
        new_character = {
            "id": char_id,
            "name": char_info['name'],
            "avatar": f"/images/characters/{char_info['name'].lower().replace(' ', '-').replace('đại-tá', 'dai-ta').replace('ô-đốc', 'o-doc')}.jpg",
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
                    "location": [16.0755, 108.224] if "Đà Nẵng" in char_info['biography'] else [10.8231, 106.6297],
                    "description": f"Tham gia sự kiện lịch sử quan trọng"
                }
            ]
        }
        
        characters_data.append(new_character)
        added_count += 1
        
        print(f"✅ Added: {char_info['name']} (ID: {char_id})")
    
    # Save updated file
    if save_json_file(characters_file, characters_data):
        print(f"\n🎉 Successfully completed!")
        print(f"   ➕ Added: {added_count} new characters")
        print(f"   ⏭️  Skipped: {skipped_count} existing characters")
        print(f"   📊 Total characters: {len(characters_data)}")
    else:
        print("❌ Failed to save characters.json")

if __name__ == "__main__":
    main()
