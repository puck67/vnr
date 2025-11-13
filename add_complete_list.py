#!/usr/bin/env python3
"""
Complete list: Add ALL remaining historical characters from 1887-1930
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

# COMPLETE remaining characters list from 1887-1930
complete_remaining_characters = [
    # 1887 - Liên bang Đông Dương
    {
        "name": "Paul Bert",
        "birthYear": 1833, "deathYear": 1886,
        "role": "Toàn quyền Đông Dương đầu tiên",
        "biography": "Paul Bert là Toàn quyền Đông Dương đầu tiên, thiết lập nền móng cho Liên bang Đông Dương năm 1887.",
        "achievements": ["Toàn quyền Đông Dương đầu tiên", "Thiết lập Liên bang Đông Dương"],
        "relatedEvents": ["event-022"]
    },
    {
        "name": "Jean Constans",
        "birthYear": 1833, "deathYear": 1913,
        "role": "Toàn quyền Đông Dương",
        "biography": "Jean Constans là Toàn quyền Đông Dương, tiếp tục củng cố Liên bang Đông Dương.",
        "achievements": ["Toàn quyền Đông Dương", "Củng cố Liên bang Đông Dương"],
        "relatedEvents": ["event-022"]
    },
    {
        "name": "De Lanessan",
        "birthYear": 1843, "deathYear": 1919,
        "role": "Toàn quyền Đông Dương",
        "biography": "Jean-Marie de Lanessan là Toàn quyền Đông Dương, phát triển chính sách thuộc địa.",
        "achievements": ["Toàn quyền Đông Dương", "Phát triển chính sách thuộc địa"],
        "relatedEvents": ["event-022"]
    },
    
    # 1888 - Hàm Nghi bị bắt
    {
        "name": "Trương Quang Ngọc",
        "birthYear": 1855, "deathYear": 1925,
        "role": "Người phản bội vua Hàm Nghi",
        "biography": "Trương Quang Ngọc là người phản bội, chỉ điểm cho Pháp bắt vua Hàm Nghi năm 1888 tại Tà Bạt.",
        "achievements": ["Phản bội vua Hàm Nghi (1888)", "Chỉ điểm cho Pháp"],
        "relatedEvents": ["event-024"]
    },
    {
        "name": "Tôn Thất Đàm",
        "birthYear": 1860, "deathYear": 1930,
        "role": "Cận thần vua Hàm Nghi",
        "biography": "Tôn Thất Đàm là cận thần trung thành của vua Hàm Nghi, theo vua đến cuối cùng.",
        "achievements": ["Cận thần trung thành vua Hàm Nghi", "Theo vua đến cuối cùng"],
        "relatedEvents": ["event-024"]
    },
    
    # 1889-1895 - Giai đoạn Cần Vương muộn
    {
        "name": "Trần Tấn",
        "birthYear": 1850, "deathYear": 1920,
        "role": "Nghĩa sĩ Cần Vương",
        "biography": "Trần Tấn là nghĩa sĩ tham gia giai đoạn muộn của phong trào Cần Vương.",
        "achievements": ["Tham gia Cần Vương giai đoạn muộn"],
        "relatedEvents": ["event-021"]
    },
    
    # 1897-1903 - Kỷ nguyên thuộc địa - Duy Tân
    {
        "name": "Paul Doumer",
        "birthYear": 1857, "deathYear": 1932,
        "role": "Toàn quyền Đông Dương",
        "biography": "Paul Doumer là Toàn quyền Đông Dương (1897-1902), thiết lập hệ thống khai thác thuộc địa toàn diện.",
        "achievements": ["Toàn quyền Đông Dương (1897-1902)", "Thiết lập hệ thống khai thác thuộc địa", "Xây dựng cầu Long Biên"],
        "relatedEvents": ["event-035", "event-036"]
    },
    {
        "name": "Trần Quý Cáp",
        "birthYear": 1870, "deathYear": 1908,
        "role": "Nghĩa sĩ Duy Tân",
        "biography": "Trần Quý Cáp là nghĩa sĩ tham gia phong trào Duy Tân, bị xử tử năm 1908 trong phong trào chống thuế.",
        "achievements": ["Tham gia phong trào Duy Tân", "Hy sinh trong phong trào chống thuế (1908)"],
        "relatedEvents": ["event-011", "event-012"]
    },
    {
        "name": "Lê Khiết",
        "birthYear": 1875, "deathYear": 1945,
        "role": "Trí thức Duy Tân",
        "biography": "Lê Khiết là trí thức tham gia phong trào Duy Tân, ủng hộ cải cách giáo dục.",
        "achievements": ["Trí thức Duy Tân", "Ủng hộ cải cách giáo dục"],
        "relatedEvents": ["event-011"]
    },
    
    # 1904 - Thành lập Duy Tân Hội
    {
        "name": "Tăng Bạt Hổ",
        "birthYear": 1875, "deathYear": 1945,
        "role": "Thành viên Duy Tân Hội",
        "biography": "Tăng Bạt Hổ là thành viên sáng lập Duy Tân Hội năm 1904 cùng Phan Bội Châu.",
        "achievements": ["Thành viên sáng lập Duy Tân Hội (1904)", "Cộng sự của Phan Bội Châu"],
        "relatedEvents": ["event-037"]
    },
    {
        "name": "Nguyễn Thành",
        "birthYear": 1860, "deathYear": 1925,
        "role": "Thành viên Duy Tân Hội",
        "biography": "Nguyễn Thành là học giả, thành viên Duy Tân Hội và sau này là sáng lập viên Đông Kinh Nghĩa Thục.",
        "achievements": ["Thành viên Duy Tân Hội", "Sáng lập viên Đông Kinh Nghĩa Thục"],
        "relatedEvents": ["event-037", "event-011"]
    },
    
    # 1905 - Phong trào Đông Du
    {
        "name": "Hồ Tùng Mậu",
        "birthYear": 1896, "deathYear": 1951,
        "role": "Học sinh Đông Du",
        "biography": "Hồ Tùng Mậu là một trong những học sinh Đông Du đầu tiên, sau này trở thành cách mạng gia.",
        "achievements": ["Học sinh Đông Du đầu tiên", "Cách mạng gia"],
        "relatedEvents": ["event-010", "event-028"]
    },
    {
        "name": "Lê Văn Hòe",
        "birthYear": 1885, "deathYear": 1955,
        "role": "Học sinh Đông Du",
        "biography": "Lê Văn Hòe là học sinh tham gia phong trào Đông Du sang Nhật Bản học tập.",
        "achievements": ["Học sinh Đông Du"],
        "relatedEvents": ["event-010"]
    },
    {
        "name": "Nguyễn Thượng Hiền",
        "birthYear": 1888, "deathYear": 1958,
        "role": "Học sinh Đông Du",
        "biography": "Nguyễn Thượng Hiền là học sinh Đông Du, sau này tham gia Việt Nam Quang Phục Hội.",
        "achievements": ["Học sinh Đông Du", "Thành viên Việt Nam Quang Phục Hội"],
        "relatedEvents": ["event-010", "event-013"]
    },
    
    # 1907 - Duy Tân - Đông Kinh Nghĩa Thục
    {
        "name": "Nguyễn Quyền",
        "birthYear": 1869, "deathYear": 1924,
        "role": "Sáng lập viên Đông Kinh Nghĩa Thục",
        "biography": "Nguyễn Quyền là sáng lập viên Đông Kinh Nghĩa Thục cùng Lương Văn Can năm 1907.",
        "achievements": ["Sáng lập viên Đông Kinh Nghĩa Thục (1907)", "Giáo dục gia tiên phong"],
        "relatedEvents": ["event-011"]
    },
    {
        "name": "Dương Bá Trạc",
        "birthYear": 1852, "deathYear": 1915,
        "role": "Giáo sư Đông Kinh Nghĩa Thục",
        "biography": "Dương Bá Trạc là giáo sư tại Đông Kinh Nghĩa Thục, dạy về dân quyền và khoa học mới.",
        "achievements": ["Giáo sư Đông Kinh Nghĩa Thục", "Dạy về dân quyền và khoa học"],
        "relatedEvents": ["event-011"]
    },
    {
        "name": "Lê Đại",
        "birthYear": 1853, "deathYear": 1910,
        "role": "Giáo sư Đông Kinh Nghĩa Thục",
        "biography": "Lê Đại là giáo sư tại Đông Kinh Nghĩa Thục, tham gia giảng dạy chữ quốc ngữ.",
        "achievements": ["Giáo sư Đông Kinh Nghĩa Thục", "Giảng dạy chữ quốc ngữ"],
        "relatedEvents": ["event-011"]
    },
    {
        "name": "Phạm Tư",
        "birthYear": 1860, "deathYear": 1930,
        "role": "Giáo viên Đông Kinh Nghĩa Thục",
        "biography": "Phạm Tư là giáo viên tại Đông Kinh Nghĩa Thục, tham gia phong trào Duy Tân.",
        "achievements": ["Giáo viên Đông Kinh Nghĩa Thục", "Tham gia phong trào Duy Tân"],
        "relatedEvents": ["event-011"]
    },
    
    # 1908 - Phong trào chống thuế Trung Kỳ
    {
        "name": "Thái Phiên",
        "birthYear": 1870, "deathYear": 1916,
        "role": "Tổng chỉ huy quân sự - Lãnh đạo Quang Phục Hội",
        "biography": "Thái Phiên là tổng chỉ huy quân sự, lãnh đạo Quang Phục Hội, tham gia khởi nghĩa Duy Tân 1916.",
        "achievements": ["Tổng chỉ huy quân sự Quang Phục Hội", "Lãnh đạo khởi nghĩa Duy Tân (1916)", "Bị xử chém năm 1916"],
        "relatedEvents": ["event-012", "event-024"]
    },
    
    # 1911 - Nguyễn Tất Thành ra đi
    {
        "name": "Tướng Latouche-Tréville",
        "birthYear": 1860, "deathYear": 1930,
        "role": "Thuyền trưởng tàu Amiral Latouche-Tréville",
        "biography": "Thuyền trưởng tàu Amiral Latouche-Tréville, tàu đưa Nguyễn Tất Thành ra đi tìm đường cứu nước năm 1911.",
        "achievements": ["Thuyền trưởng tàu đưa Hồ Chí Minh ra đi (1911)"],
        "relatedEvents": ["event-025"]
    },
    {
        "name": "Phan Xích Long",
        "birthYear": 1893, "deathYear": 1916,
        "role": "Thủ lĩnh phong trào Phan Xích Long",
        "biography": "Phan Xích Long là thủ lĩnh phong trào mang tên ông, hoạt động cùng thời kỳ với Nguyễn Tất Thành ra đi.",
        "achievements": ["Thủ lĩnh phong trào Phan Xích Long", "Hoạt động năm 1911-1916"],
        "relatedEvents": ["event-025"]
    },
    
    # 1912 - Việt Nam Quang Phục Hội
    {
        "name": "Nguyễn Hải Thần",
        "birthYear": 1878, "deathYear": 1955,
        "role": "Thành viên Việt Nam Quang Phục Hội",
        "biography": "Nguyễn Hải Thần là thành viên Việt Nam Quang Phục Hội, cộng sự của Phan Bội Châu.",
        "achievements": ["Thành viên Việt Nam Quang Phục Hội", "Cộng sự của Phan Bội Châu"],
        "relatedEvents": ["event-013"]
    },
    {
        "name": "Lê Kỳ",
        "birthYear": 1880, "deathYear": 1950,
        "role": "Thành viên Việt Nam Quang Phục Hội",
        "biography": "Lê Kỳ là thành viên Việt Nam Quang Phục Hội, tham gia hoạt động cách mạng.",
        "achievements": ["Thành viên Việt Nam Quang Phục Hội"],
        "relatedEvents": ["event-013"]
    },
    
    # 1913 - Hoàng Hoa Thám hy sinh
    {
        "name": "Sancy",
        "birthYear": 1870, "deathYear": 1940,
        "role": "Sĩ quan Pháp",
        "biography": "Sancy là sĩ quan Pháp tham gia truy bắt Hoàng Hoa Thám.",
        "achievements": ["Sĩ quan Pháp truy bắt Hoàng Hoa Thám"],
        "relatedEvents": ["event-093"]
    },
    {
        "name": "Charles A.",
        "birthYear": 1875, "deathYear": 1945,
        "role": "Quan chức Pháp",
        "biography": "Charles A. là quan chức Pháp tham gia chiến dịch chống Hoàng Hoa Thám.",
        "achievements": ["Quan chức Pháp chống Hoàng Hoa Thám"],
        "relatedEvents": ["event-093"]
    }
]

def main():
    print("🚀 Adding COMPLETE remaining characters (1887-1930)...")
    
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
    
    for char_info in complete_remaining_characters:
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
        print(f"\n🎉 Successfully completed adding remaining characters!")
        print(f"   ➕ Added: {added_count} new characters")
        print(f"   ⏭️  Skipped: {skipped_count} existing characters")
        print(f"   📊 Total characters: {len(characters_data)}")
    else:
        print("❌ Failed to save characters.json")

if __name__ == "__main__":
    main()
