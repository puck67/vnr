#!/usr/bin/env python3
"""
Script to add all remaining historical characters from 1858-1930
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

# Complete remaining characters list
remaining_characters = [
    # 1861 - Khởi nghĩa Nguyễn Trung Trực
    {
        "name": "Doãn Uẩn",
        "birthYear": 1830, "deathYear": 1890,
        "role": "Nghĩa sĩ Nam Kỳ",
        "biography": "Doãn Uẩn là nghĩa sĩ tham gia khởi nghĩa Nguyễn Trung Trực năm 1861, chống lại quân Pháp ở Nam Kỳ.",
        "achievements": ["Tham gia khởi nghĩa Nguyễn Trung Trực (1861)", "Kháng chiến chống Pháp ở Nam Kỳ"],
        "relatedEvents": ["event-003"]
    },
    {
        "name": "Phan Tòng",
        "birthYear": 1825, "deathYear": 1885,
        "role": "Nghĩa sĩ Nam Kỳ",
        "biography": "Phan Tòng là nghĩa sĩ tham gia khởi nghĩa Nguyễn Trung Trực năm 1861.",
        "achievements": ["Tham gia khởi nghĩa Nguyễn Trung Trực (1861)"],
        "relatedEvents": ["event-003"]
    },
    {
        "name": "Lê Quang Quan",
        "birthYear": 1820, "deathYear": 1880,
        "role": "Nghĩa sĩ Nam Kỳ",
        "biography": "Lê Quang Quan là nghĩa sĩ tham gia khởi nghĩa Nguyễn Trung Trực năm 1861.",
        "achievements": ["Tham gia khởi nghĩa Nguyễn Trung Trực (1861)"],
        "relatedEvents": ["event-003"]
    },
    {
        "name": "Bonard",
        "birthYear": 1805, "deathYear": 1875,
        "role": "Đô đốc Pháp",
        "biography": "Bonard là đô đốc Pháp, chỉ huy các chiến dịch ở Nam Kỳ từ 1861-1863, kế nhiệm Rigault de Genouilly.",
        "achievements": ["Chỉ huy chiến dịch Nam Kỳ (1861-1863)", "Ký Hòa ước Nhâm Tuất (1862)"],
        "relatedEvents": ["event-003", "event-016", "event-043"]
    },
    
    # 1862 - Hòa ước Nhâm Tuất
    {
        "name": "Lâm Duy Hiệp",
        "birthYear": 1815, "deathYear": 1885,
        "role": "Phó sứ triều Nguyễn",
        "biography": "Lâm Duy Hiệp là phó sứ triều Nguyễn trong đoàn ký Hòa ước Nhâm Tuất năm 1862, phụ tá Phan Thanh Giản.",
        "achievements": ["Phó sứ ký Hòa ước Nhâm Tuất (1862)", "Phụ tá Phan Thanh Giản"],
        "relatedEvents": ["event-016"]
    },
    {
        "name": "Trương Văn Uyển",
        "birthYear": 1820, "deathYear": 1890,
        "role": "Quan triều Nguyễn",
        "biography": "Trương Văn Uyển là quan triều Nguyễn tham gia đoàn ký Hòa ước Nhâm Tuất năm 1862.",
        "achievements": ["Tham gia ký Hòa ước Nhâm Tuất (1862)"],
        "relatedEvents": ["event-016"]
    },
    {
        "name": "De Lagrée",
        "birthYear": 1823, "deathYear": 1868,
        "role": "Sĩ quan Pháp",
        "biography": "Ernest Doudart de Lagrée là sĩ quan và nhà thám hiểm Pháp, tham gia ký Hòa ước Nhâm Tuất và các hoạt động ngoại giao với triều đình Huế.",
        "achievements": ["Tham gia ký Hòa ước Nhâm Tuất (1862)", "Nhà thám hiểm sông Mê Kông"],
        "relatedEvents": ["event-016", "event-043"]
    },
    
    # 1863 - Sứ bộ Paris
    {
        "name": "Phạm Phú Thứ",
        "birthYear": 1825, "deathYear": 1895,
        "role": "Thành viên sứ bộ sang Paris",
        "biography": "Phạm Phú Thứ là thành viên sứ bộ Đại Nam sang Paris năm 1863 cùng Phan Thanh Giản để chuộc lại Nam Kỳ.",
        "achievements": ["Thành viên sứ bộ sang Paris (1863)", "Nỗ lực chuộc lại Nam Kỳ"],
        "relatedEvents": ["event-043"]
    },
    {
        "name": "Ngụy Khắc Đản",
        "birthYear": 1820, "deathYear": 1885,
        "role": "Thành viên sứ bộ sang Paris",
        "biography": "Ngụy Khắc Đản là thành viên sứ bộ Đại Nam sang Paris năm 1863.",
        "achievements": ["Thành viên sứ bộ sang Paris (1863)"],
        "relatedEvents": ["event-043"]
    },
    {
        "name": "Norodom",
        "birthYear": 1834, "deathYear": 1904,
        "role": "Quốc vương Campuchia",
        "biography": "Norodom là quốc vương Campuchia ký hiệp ước bảo hộ với Pháp năm 1863, làm Việt Nam mất quyền kiểm soát Campuchia.",
        "achievements": ["Ký hiệp ước bảo hộ với Pháp (1863)", "Quốc vương Campuchia (1860-1904)"],
        "relatedEvents": ["event-043"]
    },
    
    # 1864 - Trương Định
    {
        "name": "Lê Văn Phú",
        "birthYear": 1830, "deathYear": 1890,
        "role": "Thống binh nghĩa quân Gò Công",
        "biography": "Lê Văn Phú là thống binh nghĩa quân dưới quyền Trương Định tại Gò Công.",
        "achievements": ["Thống binh nghĩa quân Gò Công", "Cộng sự trung thành của Trương Định"],
        "relatedEvents": ["event-045"]
    },
    {
        "name": "Nguyễn Công Nguyên",
        "birthYear": 1825, "deathYear": 1885,
        "role": "Thủ lĩnh nghĩa quân Gò Công",
        "biography": "Nguyễn Công Nguyên là thủ lĩnh nghĩa quân dưới quyền Trương Định tại Gò Công.",
        "achievements": ["Thủ lĩnh nghĩa quân Gò Công", "Tham gia kháng chiến chống Pháp"],
        "relatedEvents": ["event-045"]
    },
    
    # 1865 - Kháng chiến miền Tây
    {
        "name": "Nguyễn Hữu Huân",
        "birthYear": 1830, "deathYear": 1870,
        "role": "Thủ khoa Huân - Nghĩa sĩ miền Tây",
        "biography": "Nguyễn Hữu Huân (Thủ khoa Huân) là nghĩa sĩ tham gia phong trào kháng chiến miền Tây, cộng tác với Nguyễn Trung Trực và Võ Duy Dương.",
        "achievements": ["Tham gia kháng chiến miền Tây (1865-1870)", "Cộng tác với Nguyễn Trung Trực"],
        "relatedEvents": ["event-046", "event-047"]
    },
    
    # 1867 - Bãi Sậy
    {
        "name": "Nguyễn Văn Nho",
        "birthYear": 1835, "deathYear": 1900,
        "role": "Nghĩa sĩ khởi nghĩa Bãi Sậy",
        "biography": "Nguyễn Văn Nho là nghĩa sĩ tham gia khởi nghĩa Bãi Sậy năm 1867 cùng Nguyễn Thiện Thuật.",
        "achievements": ["Tham gia khởi nghĩa Bãi Sậy (1867)"],
        "relatedEvents": ["event-004"]
    },
    {
        "name": "Đốc Tít",
        "birthYear": 1840, "deathYear": 1905,
        "role": "Nghĩa sĩ khởi nghĩa Bãi Sậy",
        "biography": "Đốc Tít là nghĩa sĩ tham gia khởi nghĩa Bãi Sậy năm 1867.",
        "achievements": ["Tham gia khởi nghĩa Bãi Sậy (1867)"],
        "relatedEvents": ["event-004"]
    },
    
    # 1868 - Đốt tàu Espérance
    {
        "name": "Lãnh binh Tấn",
        "birthYear": 1840, "deathYear": 1905,
        "role": "Lãnh binh nghĩa quân",
        "biography": "Lãnh binh Tấn là cộng sự của Nguyễn Trung Trực trong chiến công đốt tàu Espérance năm 1868.",
        "achievements": ["Tham gia đốt tàu Espérance (1868)", "Cộng sự của Nguyễn Trung Trực"],
        "relatedEvents": ["event-048"]
    },
    
    # 1869-1872 - Bảy Thưa
    {
        "name": "Nguyễn Thành Long",
        "birthYear": 1835, "deathYear": 1900,
        "role": "Nghĩa sĩ Bảy Thưa",
        "biography": "Nguyễn Thành Long là nghĩa sĩ tham gia khởi nghĩa Bảy Thưa dưới quyền Trần Văn Thành.",
        "achievements": ["Tham gia khởi nghĩa Bảy Thưa (1869-1873)"],
        "relatedEvents": ["event-049", "event-050", "event-051", "event-052", "event-053"]
    },
    {
        "name": "Nguyễn Văn Lợi",
        "birthYear": 1840, "deathYear": 1905,
        "role": "Nghĩa sĩ Bảy Thưa",
        "biography": "Nguyễn Văn Lợi là nghĩa sĩ tham gia khởi nghĩa Bảy Thưa dưới quyền Trần Văn Thành.",
        "achievements": ["Tham gia khởi nghĩa Bảy Thưa (1869-1873)"],
        "relatedEvents": ["event-049", "event-050", "event-051", "event-052", "event-053"]
    },
    {
        "name": "Võ Văn Đề",
        "birthYear": 1845, "deathYear": 1910,
        "role": "Nghĩa sĩ Bảy Thưa",
        "biography": "Võ Văn Đề là nghĩa sĩ tham gia khởi nghĩa Bảy Thưa dưới quyền Trần Văn Thành.",
        "achievements": ["Tham gia khởi nghĩa Bảy Thưa (1869-1873)"],
        "relatedEvents": ["event-049", "event-050", "event-051", "event-052", "event-053"]
    }
]

def main():
    print("🚀 Adding remaining historical characters...")
    
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
    
    for char_info in remaining_characters:
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
                    "location": [10.8231, 106.6297],  # Default to Saigon area
                    "description": f"Tham gia sự kiện lịch sử quan trọng"
                }
            ]
        }
        
        characters_data.append(new_character)
        added_count += 1
        
        print(f"✅ Added: {char_info['name']} (ID: {char_id})")
    
    # Save updated file
    if save_json_file(characters_file, characters_data):
        print(f"\n🎉 Successfully completed batch 2!")
        print(f"   ➕ Added: {added_count} new characters")
        print(f"   ⏭️  Skipped: {skipped_count} existing characters")
        print(f"   📊 Total characters: {len(characters_data)}")
    else:
        print("❌ Failed to save characters.json")

if __name__ == "__main__":
    main()
