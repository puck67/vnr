#!/usr/bin/env python3
"""
Final period: Add characters from 1916-1930
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

# Characters from 1916-1930 period
final_period_characters = [
    # 1916 - Khởi nghĩa Duy Tân
    {
        "name": "Vua Duy Tân",
        "birthYear": 1900, "deathYear": 1945,
        "role": "Vua triều Nguyễn, lãnh đạo khởi nghĩa Duy Tân",
        "biography": "Vua Duy Tân (1900-1945) là vua thứ 12 triều Nguyễn, lãnh đạo khởi nghĩa Duy Tân năm 1916 cùng Trần Cao Vân và Thái Phiên. Bị đày sang đảo Réunion sau thất bại.",
        "achievements": ["Lãnh đạo khởi nghĩa Duy Tân (1916)", "Vua trẻ tuổi nhất lãnh đạo khởi nghĩa", "Bị đày sang Réunion"],
        "relatedEvents": ["event-024"]
    },
    
    # 1917 - Khởi nghĩa Thái Nguyên
    {
        "name": "Đội Cấn",
        "birthYear": 1885, "deathYear": 1950,
        "role": "Lãnh đạo khởi nghĩa Thái Nguyên",
        "biography": "Đội Cấn là lãnh đạo khởi nghĩa Thái Nguyên năm 1917, được Lương Ngọc Quyến hỗ trợ.",
        "achievements": ["Lãnh đạo khởi nghĩa Thái Nguyên (1917)"],
        "relatedEvents": ["event-025"]
    },
    {
        "name": "Trịnh Văn Cẩn",
        "birthYear": 1880, "deathYear": 1945,
        "role": "Tham gia khởi nghĩa Thái Nguyên",
        "biography": "Trịnh Văn Cẩn tham gia khởi nghĩa Thái Nguyên năm 1917 cùng Đội Cấn.",
        "achievements": ["Tham gia khởi nghĩa Thái Nguyên (1917)"],
        "relatedEvents": ["event-025"]
    },
    {
        "name": "Chánh tổng Đội Giá",
        "birthYear": 1875, "deathYear": 1940,
        "role": "Chánh tổng tham gia khởi nghĩa Thái Nguyên",
        "biography": "Chánh tổng Đội Giá là quan địa phương tham gia khởi nghĩa Thái Nguyên năm 1917.",
        "achievements": ["Tham gia khởi nghĩa Thái Nguyên (1917)"],
        "relatedEvents": ["event-025"]
    },
    
    # 1919 - Yêu sách của Nguyễn Ái Quốc
    {
        "name": "Marcel Cachin",
        "birthYear": 1869, "deathYear": 1958,
        "role": "Nhà cách mạng Pháp xã hội",
        "biography": "Marcel Cachin là nhà cách mạng Pháp xã hội, ủng hộ Nguyễn Ái Quốc và Bản yêu sách năm 1919.",
        "achievements": ["Ủng hộ Bản yêu sách của Nguyễn Ái Quốc (1919)", "Nhà cách mạng xã hội Pháp"],
        "relatedEvents": ["event-026"]
    },
    
    # 1920 - Nguyễn Ái Quốc vào Đảng Cộng sản Pháp
    {
        "name": "Paul Vaillant-Couturier",
        "birthYear": 1892, "deathYear": 1937,
        "role": "Lãnh đạo Đảng Cộng sản Pháp",
        "biography": "Paul Vaillant-Couturier là lãnh đạo Đảng Cộng sản Pháp, đồng chí của Nguyễn Ái Quốc.",
        "achievements": ["Lãnh đạo Đảng Cộng sản Pháp", "Đồng chí của Nguyễn Ái Quốc"],
        "relatedEvents": ["event-027"]
    },
    {
        "name": "Boris Souvarine",
        "birthYear": 1895, "deathYear": 1984,
        "role": "Thành viên Đảng Cộng sản Pháp",
        "biography": "Boris Souvarine là thành viên Đảng Cộng sản Pháp, cùng thời với Nguyễn Ái Quốc.",
        "achievements": ["Thành viên Đảng Cộng sản Pháp", "Cùng thời với Nguyễn Ái Quốc"],
        "relatedEvents": ["event-027"]
    },
    
    # 1924 - Phạm Hồng Thái ám sát Merlin
    {
        "name": "Phạm Hồng Thái",
        "birthYear": 1896, "deathYear": 1924,
        "role": "Liệt sĩ cách mạng",
        "biography": "Phạm Hồng Thái (1896-1924) là liệt sĩ cách mạng, dũng cảm ném bom ám sát Toàn quyền Martial Henri Merlin năm 1924 tại Quảng Châu, hy sinh anh dũng.",
        "achievements": ["Ném bom ám sát Toàn quyền Merlin (1924)", "Liệt sĩ cách mạng anh dũng", "Biểu tượng tinh thần hy sinh"],
        "relatedEvents": ["event-029"]
    },
    {
        "name": "Martial Henri Merlin",
        "birthYear": 1860, "deathYear": 1935,
        "role": "Toàn quyền Đông Dương",
        "biography": "Martial Henri Merlin là Toàn quyền Đông Dương (1911-1914, 1917-1925), bị Phạm Hồng Thái ám sát hụt năm 1924.",
        "achievements": ["Toàn quyền Đông Dương", "Bị ám sát hụt bởi Phạm Hồng Thái (1924)"],
        "relatedEvents": ["event-029"]
    },
    {
        "name": "Lê Hồng Sơn",
        "birthYear": 1902, "deathYear": 1942,
        "role": "Cách mạng gia",
        "biography": "Lê Hồng Sơn là cách mạng gia, cộng sự của Hồ Tùng Mậu trong hoạt động cách mạng.",
        "achievements": ["Cách mạng gia", "Cộng sự của Hồ Tùng Mậu"],
        "relatedEvents": ["event-029", "event-028"]
    },
    {
        "name": "Lâm Đức Thụ",
        "birthYear": 1900, "deathYear": 1970,
        "role": "Cách mạng gia",
        "biography": "Lâm Đức Thụ là cách mạng gia, tham gia hoạt động cùng Phạm Hồng Thái.",
        "achievements": ["Cách mạng gia", "Tham gia hoạt động cùng Phạm Hồng Thái"],
        "relatedEvents": ["event-029"]
    },
    
    # 1925 - Hội Việt Nam Cách mạng Thanh niên - Bắt Phan Bội Châu
    {
        "name": "Tôn Quang Phiệt",
        "birthYear": 1900, "deathYear": 1975,
        "role": "Thành viên Hội Thanh niên",
        "biography": "Tôn Quang Phiệt là thành viên Hội Việt Nam Cách mạng Thanh niên do Nguyễn Ái Quốc thành lập.",
        "achievements": ["Thành viên Hội Việt Nam Cách mạng Thanh niên"],
        "relatedEvents": ["event-028"]
    },
    {
        "name": "Châu Văn Liêm",
        "birthYear": 1895, "deathYear": 1948,
        "role": "Đại biểu An Nam Cộng sản Đảng",
        "biography": "Châu Văn Liêm là đại biểu An Nam Cộng sản Đảng, sau này tham gia thành lập Đảng Cộng sản Việt Nam.",
        "achievements": ["Đại biểu An Nam Cộng sản Đảng", "Tham gia thành lập Đảng Cộng sản Việt Nam"],
        "relatedEvents": ["event-028", "event-014"]
    },
    
    # 1926 - Tang Phan Châu Trinh
    {
        "name": "Phạm Quỳnh",
        "birthYear": 1892, "deathYear": 1945,
        "role": "Nhà văn, viết điếu văn Phan Châu Trinh",
        "biography": "Phạm Quỳnh là nhà văn, nhà báo, viết điếu văn cho Phan Châu Trinh năm 1926.",
        "achievements": ["Nhà văn, nhà báo nổi tiếng", "Viết điếu văn Phan Châu Trinh (1926)"],
        "relatedEvents": ["event-030"]
    },
    
    # 1927 - Thành lập Việt Nam Quốc dân Đảng
    {
        "name": "Nguyễn Thái Học",
        "birthYear": 1902, "deathYear": 1930,
        "role": "Chủ tịch Việt Nam Quốc dân Đảng",
        "biography": "Nguyễn Thái Học (1902-1930) là chủ tịch Việt Nam Quốc dân Đảng, lãnh đạo khởi nghĩa Yên Bái năm 1930, bị xử chém cùng năm.",
        "achievements": ["Chủ tịch Việt Nam Quốc dân Đảng", "Lãnh đạo khởi nghĩa Yên Bái (1930)", "Hy sinh năm 1930"],
        "relatedEvents": ["event-031", "event-033"]
    },
    {
        "name": "Phó Đức Chính",
        "birthYear": 1900, "deathYear": 1930,
        "role": "Lãnh đạo Việt Nam Quốc dân Đảng",
        "biography": "Phó Đức Chính là lãnh đạo Việt Nam Quốc dân Đảng, tham gia khởi nghĩa Yên Bái năm 1930.",
        "achievements": ["Lãnh đạo Việt Nam Quốc dân Đảng", "Tham gia khởi nghĩa Yên Bái (1930)"],
        "relatedEvents": ["event-031", "event-033"]
    },
    {
        "name": "Nguyễn Khắc Nhu",
        "birthYear": 1905, "deathYear": 1975,
        "role": "Thành viên Việt Nam Quốc dân Đảng",
        "biography": "Nguyễn Khắc Nhu là thành viên Việt Nam Quốc dân Đảng, tham gia thành lập đảng năm 1927.",
        "achievements": ["Thành viên sáng lập Việt Nam Quốc dân Đảng (1927)"],
        "relatedEvents": ["event-031"]
    },
    {
        "name": "Nguyễn Văn Viên",
        "birthYear": 1898, "deathYear": 1930,
        "role": "Lãnh đạo Việt Nam Quốc dân Đảng",
        "biography": "Nguyễn Văn Viên là lãnh đạo Việt Nam Quốc dân Đảng, tham gia khởi nghĩa Yên Bái năm 1930.",
        "achievements": ["Lãnh đạo Việt Nam Quốc dân Đảng", "Tham gia khởi nghĩa Yên Bái (1930)"],
        "relatedEvents": ["event-031", "event-033"]
    },
    {
        "name": "Nguyễn Văn Sâm",
        "birthYear": 1895, "deathYear": 1965,
        "role": "Thành viên Việt Nam Quốc dân Đảng",
        "biography": "Nguyễn Văn Sâm là thành viên Việt Nam Quốc dân Đảng, tham gia thành lập đảng.",
        "achievements": ["Thành viên Việt Nam Quốc dân Đảng"],
        "relatedEvents": ["event-031"]
    },
    {
        "name": "Đặng Thái Thuyến",
        "birthYear": 1900, "deathYear": 1970,
        "role": "Thành viên Việt Nam Quốc dân Đảng",
        "biography": "Đặng Thái Thuyến là thành viên Việt Nam Quốc dân Đảng, tham gia hoạt động cách mạng.",
        "achievements": ["Thành viên Việt Nam Quốc dân Đảng"],
        "relatedEvents": ["event-031"]
    }
]

def main():
    print("🚀 Adding final period characters (1916-1930)...")
    
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
    
    for char_info in final_period_characters:
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
                    "year": char_info['birthYear'] + 25,  # Approximate active year
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
        print(f"\n🎉 Successfully completed final period!")
        print(f"   ➕ Added: {added_count} new characters")
        print(f"   ⏭️  Skipped: {skipped_count} existing characters")
        print(f"   📊 Total characters: {len(characters_data)}")
    else:
        print("❌ Failed to save characters.json")

if __name__ == "__main__":
    main()
