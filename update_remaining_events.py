#!/usr/bin/env python3
"""
Update remaining events (1889-1930) with characters
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

def find_character_id_by_name(characters_data, name):
    """Find character ID by name"""
    for char in characters_data:
        if char['name'] == name:
            return char['id']
    return None

def find_event_by_name_and_year(events_data, name_keywords, year):
    """Find event by name keywords and year"""
    for event in events_data:
        event_name = event.get('name', '').lower()
        event_year = event.get('date', {}).get('year', 0)
        
        if event_year == year:
            for keyword in name_keywords:
                if keyword.lower() in event_name:
                    return event.get('id')
    return None

# Remaining events from 1889-1930
remaining_event_character_mapping = {
    # 1889-1895 - Giai đoạn Cần Vương muộn
    "1889_can_vuong_muon": {
        "year": 1889,
        "keywords": ["cần vương", "giai đoạn"],
        "characters": [
            "Phan Đình Phùng", "Cao Thắng", "Trần Tấn", "Tống Duy Tân"
        ]
    },
    
    # 1896 - Phan Đình Phùng hy sinh
    "1896_phan_dinh_phung": {
        "year": 1896,
        "keywords": ["phan đình phùng", "hy sinh"],
        "characters": [
            "Phan Đình Phùng", "Cao Thắng"
        ]
    },
    
    # 1897-1903 - Kỷ nguyên thuộc địa - Duy Tân
    "1897_ky_nguyen_thuc_dia": {
        "year": 1897,
        "keywords": ["paul doumer", "kỷ nguyên"],
        "characters": [
            "Paul Doumer", "Trần Quý Cáp", "Phan Châu Trinh", "Huỳnh Thúc Kháng", "Lê Khiết"
        ]
    },
    
    # 1904 - Thành lập Duy Tân Hội
    "1904_duy_tan_hoi": {
        "year": 1904,
        "keywords": ["duy tân hội", "thành lập"],
        "characters": [
            "Phan Bội Châu", "Cường Để", "Tăng Bạt Hổ", "Nguyễn Thành"
        ]
    },
    
    # 1905 - Phong trào Đông Du
    "1905_dong_du": {
        "year": 1905,
        "keywords": ["đông du", "phong trào"],
        "characters": [
            "Phan Bội Châu", "Cường Để", "Hồ Tùng Mậu", "Lê Văn Hòe", "Nguyễn Thượng Hiền"
        ]
    },
    
    # 1907 - Phong trào Duy Tân
    "1907_duy_tan": {
        "year": 1907,
        "keywords": ["duy tân", "phong trào"],
        "characters": [
            "Phan Châu Trinh", "Huỳnh Thúc Kháng", "Trần Quý Cáp", "Lương Văn Can", 
            "Nguyễn Quyền", "Dương Bá Trạc", "Lê Đại", "Phạm Tư"
        ]
    },
    
    # 1907 - Thành lập Đông Kinh Nghĩa Thục
    "1907_dong_kinh_nghia_thuc": {
        "year": 1907,
        "keywords": ["đông kinh nghĩa thục", "thành lập"],
        "characters": [
            "Phan Châu Trinh", "Huỳnh Thúc Kháng", "Trần Quý Cáp", "Lương Văn Can",
            "Nguyễn Quyền", "Dương Bá Trạc", "Lê Đại", "Phạm Tư"
        ]
    },
    
    # 1908 - Phong trào chống thuế
    "1908_chong_thue": {
        "year": 1908,
        "keywords": ["chống thuế", "phong trào"],
        "characters": [
            "Trần Cao Vân", "Thái Phiên", "Huỳnh Thúc Kháng", "Phan Châu Trinh", "Trần Quý Cáp"
        ]
    },
    
    # 1911 - Nguyễn Tất Thành ra đi
    "1911_nguyen_tat_thanh": {
        "year": 1911,
        "keywords": ["nguyễn tất thành", "ra đi"],
        "characters": [
            "Nguyễn Ái Quốc", "Tướng Latouche-Tréville", "Phan Xích Long"
        ]
    },
    
    # 1912 - Thành lập Việt Nam Quang Phục Hội
    "1912_quang_phuc_hoi": {
        "year": 1912,
        "keywords": ["quang phục hội", "thành lập"],
        "characters": [
            "Phan Bội Châu", "Cường Để", "Nguyễn Hải Thần", "Nguyễn Thượng Hiền", "Lê Kỳ"
        ]
    },
    
    # 1913 - Hoàng Hoa Thám hy sinh
    "1913_hoang_hoa_tham": {
        "year": 1913,
        "keywords": ["hoàng hoa thám", "hy sinh"],
        "characters": [
            "Hoàng Hoa Thám", "Sancy", "Charles A."
        ]
    },
    
    # 1916 - Khởi nghĩa Duy Tân
    "1916_khoi_nghia_duy_tan": {
        "year": 1916,
        "keywords": ["duy tân", "khởi nghĩa"],
        "characters": [
            "Vua Duy Tân", "Trần Cao Vân", "Thái Phiên", "Huỳnh Thúc Kháng"
        ]
    },
    
    # 1917 - Khởi nghĩa Thái Nguyên
    "1917_thai_nguyen": {
        "year": 1917,
        "keywords": ["thái nguyên", "khởi nghĩa"],
        "characters": [
            "Đội Cấn", "Lương Ngọc Quyến", "Trịnh Văn Cẩn", "Chánh tổng Đội Giá"
        ]
    },
    
    # 1919 - Nguyễn Ái Quốc gửi Bản yêu sách
    "1919_ban_yeu_sach": {
        "year": 1919,
        "keywords": ["yêu sách", "nguyễn ái quốc"],
        "characters": [
            "Nguyễn Ái Quốc", "Phan Châu Trinh", "Marcel Cachin"
        ]
    },
    
    # 1920 - Nguyễn Ái Quốc tham gia Đảng Cộng sản Pháp
    "1920_dang_cong_san_phap": {
        "year": 1920,
        "keywords": ["cộng sản pháp", "nguyễn ái quốc"],
        "characters": [
            "Nguyễn Ái Quốc", "Marcel Cachin", "Paul Vaillant-Couturier", "Boris Souvarine"
        ]
    },
    
    # 1924 - Phạm Hồng Thái ám sát Merlin
    "1924_pham_hong_thai": {
        "year": 1924,
        "keywords": ["phạm hồng thái", "merlin"],
        "characters": [
            "Phạm Hồng Thái", "Martial Henri Merlin", "Hồ Tùng Mậu", "Lê Hồng Sơn", "Lâm Đức Thụ"
        ]
    },
    
    # 1925 - Hội Việt Nam Cách mạng Thanh niên
    "1925_hoi_thanh_nien": {
        "year": 1925,
        "keywords": ["thanh niên", "cách mạng"],
        "characters": [
            "Nguyễn Ái Quốc", "Hồ Tùng Mậu", "Lê Hồng Sơn", "Tôn Quang Phiệt", "Châu Văn Liêm"
        ]
    },
    
    # 1925 - Phan Bội Châu bị bắt
    "1925_phan_boi_chau_bi_bat": {
        "year": 1925,
        "keywords": ["phan bội châu", "bị bắt"],
        "characters": [
            "Phan Bội Châu"
        ]
    },
    
    # 1926 - Đám tang Phan Châu Trinh
    "1926_dam_tang_phan_chau_trinh": {
        "year": 1926,
        "keywords": ["phan châu trinh", "tang"],
        "characters": [
            "Phan Châu Trinh", "Huỳnh Thúc Kháng", "Nguyễn Ái Quốc", "Phan Bội Châu", "Phạm Quỳnh"
        ]
    },
    
    # 1927 - Thành lập Việt Nam Quốc dân Đảng
    "1927_vnqdd": {
        "year": 1927,
        "keywords": ["quốc dân đảng", "thành lập"],
        "characters": [
            "Nguyễn Thái Học", "Phó Đức Chính", "Nguyễn Khắc Nhu", "Nguyễn Văn Viên", 
            "Nguyễn Văn Sâm", "Đặng Thái Thuyến"
        ]
    },
    
    # 1929 - Ba tổ chức cộng sản ra đời
    "1929_ba_to_chuc_cong_san": {
        "year": 1929,
        "keywords": ["ba tổ chức", "cộng sản"],
        "characters": [
            "Trần Văn Cung", "Nguyễn Đức Cảnh", "Ngô Gia Tự", "Châu Văn Liêm", 
            "Tôn Đức Thắng", "Nguyễn Thiệu", "Hồ Tùng Mậu", "Lê Hồng Sơn"
        ]
    },
    
    # 1930 - Thành lập Đảng Cộng sản Việt Nam
    "1930_thanh_lap_dang": {
        "year": 1930,
        "keywords": ["đảng cộng sản việt nam", "thành lập"],
        "characters": [
            "Nguyễn Ái Quốc", "Trịnh Đình Cửu", "Châu Văn Liêm"
        ]
    },
    
    # 1930 - Xô viết Nghệ Tĩnh
    "1930_xo_viet_nghe_tinh": {
        "year": 1930,
        "keywords": ["xô viết", "nghệ tĩnh"],
        "characters": [
            "Trần Phú", "Lê Hồng Phong", "Hà Huy Tập", "Nguyễn Phong Sắc", "Phan Đăng Lưu"
        ]
    },
    
    # 1930 - Khởi nghĩa Yên Bái
    "1930_yen_bai": {
        "year": 1930,
        "keywords": ["yên bái", "khởi nghĩa"],
        "characters": [
            "Nguyễn Thái Học", "Phó Đức Chính", "Nguyễn Văn Viên"
        ]
    },
    
    # 1930 - Bãi công Phú Riềng Đỏ
    "1930_phu_rieng_do": {
        "year": 1930,
        "keywords": ["phú riềng", "bãi công"],
        "characters": [
            "Lê Duẩn", "Trần Tử Bình", "Nguyễn Văn Cừ"
        ]
    }
}

def main():
    print("🚀 Updating remaining events (1889-1930) with characters...")
    
    # File paths
    base_path = r'c:\Users\Adminn\Desktop\prm\vnr'
    characters_file = os.path.join(base_path, 'data', 'characters.json')
    events_file = os.path.join(base_path, 'data', 'events.json')
    
    # Load data
    characters_data = load_json_file(characters_file)
    events_data = load_json_file(events_file)
    
    if not characters_data or not events_data:
        print("❌ Failed to load data files")
        return
    
    print(f"📊 Loaded {len(characters_data)} characters and {len(events_data)} events")
    
    # Update events with characters
    updated_events = 0
    total_characters_added = 0
    
    for mapping_key, mapping_data in remaining_event_character_mapping.items():
        year = mapping_data['year']
        keywords = mapping_data['keywords']
        character_names = mapping_data['characters']
        
        # Find the event
        event_id = find_event_by_name_and_year(events_data, keywords, year)
        
        if event_id:
            # Find the event in the data
            for event in events_data:
                if event.get('id') == event_id:
                    # Get existing related characters
                    existing_chars = event.get('relatedCharacters', [])
                    new_char_list = list(existing_chars)  # Start with existing
                    
                    # Add characters from mapping
                    for char_name in character_names:
                        char_id = find_character_id_by_name(characters_data, char_name)
                        if char_id:
                            if char_id not in new_char_list:
                                new_char_list.append(char_id)
                                total_characters_added += 1
                        else:
                            print(f"⚠️  Character '{char_name}' not found for {mapping_key}")
                    
                    # Update event
                    event['relatedCharacters'] = new_char_list
                    updated_events += 1
                    
                    print(f"✅ Updated {event_id}: {event.get('name', 'Unknown')} ({year}) - {len(new_char_list)} characters")
                    break
        else:
            print(f"⚠️  Event not found for {mapping_key} ({year}) with keywords: {keywords}")
    
    # Save updated events
    if save_json_file(events_file, events_data):
        print(f"\n🎉 Successfully updated remaining events!")
        print(f"   📊 Updated events: {updated_events}")
        print(f"   👥 Total character assignments: {total_characters_added}")
        print(f"   📁 Saved to: {events_file}")
    else:
        print("❌ Failed to save events.json")

if __name__ == "__main__":
    main()
