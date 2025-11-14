#!/usr/bin/env python3
"""
Final batch: Add characters from 1873-1930 period
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

# Final batch of characters (1873-1930)
final_characters = [
    # 1873 - Pháp chiếm Hà Nội lần 1
    {
        "name": "Francis Garnier",
        "birthYear": 1839, "deathYear": 1873,
        "role": "Sĩ quan Pháp, chỉ huy chiếm Hà Nội",
        "biography": "Francis Garnier (1839-1873) là sĩ quan hải quân Pháp, chỉ huy cuộc chiếm Hà Nội lần thứ nhất năm 1873. Ông bị giết trong trận đánh với quân Lưu Vĩnh Phúc.",
        "achievements": ["Chỉ huy chiếm Hà Nội lần 1 (1873)", "Nhà thám hiểm sông Mê Kông", "Bị giết trong chiến đấu"],
        "relatedEvents": ["event-005"]
    },
    {
        "name": "Jean Dupuis",
        "birthYear": 1829, "deathYear": 1912,
        "role": "Thương gia và nhà thám hiểm Pháp",
        "biography": "Jean Dupuis là thương gia Pháp, người tạo cớ cho Pháp can thiệp vào Bắc Kỳ năm 1873 thông qua việc buôn bán vũ khí trên sông Hồng.",
        "achievements": ["Tạo cớ cho Pháp can thiệp Bắc Kỳ (1873)", "Thương gia buôn vũ khí trên sông Hồng"],
        "relatedEvents": ["event-005"]
    },
    {
        "name": "Lưu Vĩnh Phúc",
        "birthYear": 1830, "deathYear": 1890,
        "role": "Thủ lĩnh Hắc Kỳ quân",
        "biography": "Lưu Vĩnh Phúc là thủ lĩnh Hắc Kỳ quân, đánh bại và giết chết Francis Garnier năm 1873, buộc Pháp phải rút khỏi Hà Nội tạm thời.",
        "achievements": ["Thủ lĩnh Hắc Kỳ quân", "Đánh bại Francis Garnier (1873)", "Bảo vệ Hà Nội khỏi Pháp"],
        "relatedEvents": ["event-005"]
    },
    
    # 1874 - Hòa ước Giáp Tuất
    {
        "name": "Philastre",
        "birthYear": 1837, "deathYear": 1902,
        "role": "Đại diện Pháp ký Hòa ước Giáp Tuất",
        "biography": "Paul-Louis-Félix Philastre là quan chức Pháp, đại diện ký Hòa ước Giáp Tuất năm 1874 với triều đình Huế.",
        "achievements": ["Đại diện Pháp ký Hòa ước Giáp Tuất (1874)", "Quan chức thuộc địa Pháp"],
        "relatedEvents": ["event-006"]
    },
    {
        "name": "Trần Tiễn Thành",
        "birthYear": 1825, "deathYear": 1895,
        "role": "Đại diện triều Nguyễn ký Hòa ước Giáp Tuất",
        "biography": "Trần Tiễn Thành là quan triều Nguyễn, đại diện ký Hòa ước Giáp Tuất năm 1874 cùng Nguyễn Văn Tường.",
        "achievements": ["Đại diện triều Nguyễn ký Hòa ước Giáp Tuất (1874)"],
        "relatedEvents": ["event-006"]
    },
    {
        "name": "Hoàng Kế Viêm",
        "birthYear": 1820, "deathYear": 1885,
        "role": "Quan triều Nguyễn, phản đối Hòa ước",
        "biography": "Hoàng Kế Viêm là quan triều Nguyễn phản đối mạnh mẽ nhất việc ký Hòa ước Giáp Tuất năm 1874, chủ trương tiếp tục kháng chiến.",
        "achievements": ["Phản đối mạnh mẽ Hòa ước Giáp Tuất (1874)", "Chủ trương tiếp tục kháng chiến"],
        "relatedEvents": ["event-006"]
    },
    
    # 1884 - Yên Thế và Patenôtre
    {
        "name": "Lương Văn Nắm",
        "birthYear": 1855, "deathYear": 1891,
        "role": "Đề Nắm - Thủ lĩnh nghĩa quân Yên Thế",
        "biography": "Lương Văn Nắm (Đề Nắm) là thủ lĩnh nghĩa quân Yên Thế, cộng sự của Hoàng Hoa Thám, hy sinh năm 1891.",
        "achievements": ["Thủ lĩnh nghĩa quân Yên Thế", "Cộng sự của Hoàng Hoa Thám", "Hy sinh năm 1891"],
        "relatedEvents": ["event-009"]
    },
    {
        "name": "Trương Văn Ý",
        "birthYear": 1850, "deathYear": 1915,
        "role": "Nghĩa sĩ Yên Thế",
        "biography": "Trương Văn Ý là nghĩa sĩ tham gia khởi nghĩa Yên Thế dưới quyền Hoàng Hoa Thám.",
        "achievements": ["Tham gia khởi nghĩa Yên Thế", "Cộng sự của Hoàng Hoa Thám"],
        "relatedEvents": ["event-009"]
    },
    {
        "name": "Cả Rinh",
        "birthYear": 1860, "deathYear": 1920,
        "role": "Nghĩa sĩ Yên Thế",
        "biography": "Cả Rinh là nghĩa sĩ tham gia khởi nghĩa Yên Thế dưới quyền Hoàng Hoa Thám.",
        "achievements": ["Tham gia khởi nghĩa Yên Thế"],
        "relatedEvents": ["event-009"]
    },
    {
        "name": "Patenôtre",
        "birthYear": 1845, "deathYear": 1925,
        "role": "Đại diện Pháp ký Hiệp ước Patenôtre",
        "biography": "Jules Patenôtre là đại diện Pháp ký Hiệp ước Patenôtre năm 1884, chính thức hóa chế độ bảo hộ của Pháp đối với Việt Nam.",
        "achievements": ["Ký Hiệp ước Patenôtre (1884)", "Chính thức hóa chế độ bảo hộ"],
        "relatedEvents": ["event-007"]
    },
    {
        "name": "Nguyễn Hữu Độ",
        "birthYear": 1830, "deathYear": 1895,
        "role": "Đại diện triều Nguyễn ký Hiệp ước Patenôtre",
        "biography": "Nguyễn Hữu Độ là quan triều Nguyễn, đại diện ký Hiệp ước Patenôtre năm 1884.",
        "achievements": ["Đại diện triều Nguyễn ký Hiệp ước Patenôtre (1884)"],
        "relatedEvents": ["event-007"]
    },
    
    # 1885 - Cần Vương
    {
        "name": "Lê Ninh",
        "birthYear": 1850, "deathYear": 1920,
        "role": "Nghĩa sĩ Cần Vương",
        "biography": "Lê Ninh là nghĩa sĩ tham gia phong trào Cần Vương năm 1885, cộng sự của Phan Đình Phùng.",
        "achievements": ["Tham gia phong trào Cần Vương (1885)", "Cộng sự của Phan Đình Phùng"],
        "relatedEvents": ["event-008", "event-021"]
    },
    {
        "name": "Đinh Văn Chất",
        "birthYear": 1855, "deathYear": 1925,
        "role": "Nghĩa sĩ Cần Vương",
        "biography": "Đinh Văn Chất là nghĩa sĩ tham gia phong trào Cần Vương năm 1885.",
        "achievements": ["Tham gia phong trào Cần Vương (1885)"],
        "relatedEvents": ["event-008"]
    },
    
    # 1886 - Ba Đình
    {
        "name": "Phạm Bành",
        "birthYear": 1830, "deathYear": 1887,
        "role": "Cán lý quân vụ Ba Đình",
        "biography": "Phạm Bành là cán lý quân vụ Ba Đình, cộng sự của Đinh Công Tráng trong khởi nghĩa Ba Đình năm 1886.",
        "achievements": ["Cán lý quân vụ Ba Đình", "Cộng sự của Đinh Công Tráng", "Hy sinh năm 1887"],
        "relatedEvents": ["event-020"]
    },
    {
        "name": "Trần Xuân Soạn",
        "birthYear": 1845, "deathYear": 1910,
        "role": "Nghĩa sĩ Ba Đình",
        "biography": "Trần Xuân Soạn là nghĩa sĩ tham gia khởi nghĩa Ba Đình năm 1886 dưới quyền Đinh Công Tráng.",
        "achievements": ["Tham gia khởi nghĩa Ba Đình (1886)"],
        "relatedEvents": ["event-020"]
    },
    {
        "name": "Hà Văn Mao",
        "birthYear": 1850, "deathYear": 1915,
        "role": "Nghĩa sĩ Ba Đình",
        "biography": "Hà Văn Mao là nghĩa sĩ tham gia khởi nghĩa Ba Đình năm 1886.",
        "achievements": ["Tham gia khởi nghĩa Ba Đình (1886)"],
        "relatedEvents": ["event-020"]
    }
]

def main():
    print("🚀 Adding final batch of historical characters (1873-1930)...")
    
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
    
    for char_info in final_characters:
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
                    "location": [21.0285, 105.8542] if "Hà Nội" in char_info['biography'] else [16.4637, 107.5909],
                    "description": f"Tham gia sự kiện lịch sử quan trọng"
                }
            ]
        }
        
        characters_data.append(new_character)
        added_count += 1
        
        print(f"✅ Added: {char_info['name']} (ID: {char_id})")
    
    # Save updated file
    if save_json_file(characters_file, characters_data):
        print(f"\n🎉 Successfully completed final batch!")
        print(f"   ➕ Added: {added_count} new characters")
        print(f"   ⏭️  Skipped: {skipped_count} existing characters")
        print(f"   📊 Total characters: {len(characters_data)}")
        
        # Summary
        print(f"\n📋 SUMMARY OF ALL ADDITIONS:")
        print(f"   🔸 Batch 1: 11 characters (1858-1859)")
        print(f"   🔸 Batch 2: 19 characters (1861-1872)")
        print(f"   🔸 Batch 3: {added_count} characters (1873-1886)")
        print(f"   🔸 Total new characters added: {11 + 19 + added_count}")
        print(f"   🔸 Final dataset size: {len(characters_data)} characters")
    else:
        print("❌ Failed to save characters.json")

if __name__ == "__main__":
    main()
