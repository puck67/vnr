#!/usr/bin/env python3
"""
Update ALL remaining events with characters from the complete list
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

def find_event_by_keywords(events_data, keywords, year=None):
    """Find event by keywords and optional year"""
    for event in events_data:
        event_name = event.get('name', '').lower()
        event_year = event.get('date', {}).get('year', 0)
        
        # Check year if provided
        if year and event_year != year:
            continue
            
        # Check if any keyword matches
        for keyword in keywords:
            if keyword.lower() in event_name:
                return event.get('id')
    return None

# COMPLETE mapping for ALL remaining events
all_remaining_events = {
    # Additional events that might have been missed
    
    # 1875-1883 - Giai đoạn chuẩn bị
    "1875_nam_dau_le_thuoc": {
        "keywords": ["năm đầu lệ thuộc", "tự cường"],
        "year": 1875,
        "characters": ["Nguyễn Lộ Trạch", "Nguyễn Văn Tường"]
    },
    
    "1876_phong_trao_canh_tan": {
        "keywords": ["canh tân", "cách mạng thầm lặng"],
        "year": 1876,
        "characters": ["Nguyễn Lộ Trạch"]
    },
    
    "1877_lang_nhung_khong_yen": {
        "keywords": ["lặng nhưng không yên", "tĩnh lặng"],
        "year": 1877,
        "characters": ["Nguyễn Lộ Trạch"]
    },
    
    "1878_nam_ban_le": {
        "keywords": ["bản lề", "pháp khai thác"],
        "year": 1878,
        "characters": ["Nguyễn Lộ Trạch"]
    },
    
    "1879_lang_gio_truoc_bao": {
        "keywords": ["lặng gió trước bão"],
        "year": 1879,
        "characters": ["Nguyễn Văn Tường", "Tôn Thất Thuyết"]
    },
    
    "1880_ban_le_dinh_doan": {
        "keywords": ["bản lề định đoạt", "bắc kỳ sắp mất"],
        "year": 1880,
        "characters": ["Nguyễn Văn Tường", "Tôn Thất Thuyết", "Nguyễn Lộ Trạch"]
    },
    
    "1881_cang_thang_truoc_bao": {
        "keywords": ["căng thẳng trước bão"],
        "year": 1881,
        "characters": ["Nguyễn Văn Tường", "Tôn Thất Thuyết"]
    },
    
    "1882_ha_noi_that_thu": {
        "keywords": ["hà nội thất thủ", "hoàng diệu"],
        "year": 1882,
        "characters": ["Henri Rivière", "Hoàng Diệu"]
    },
    
    "1883_nam_mat_nuoc": {
        "keywords": ["năm mất nước", "harmand"],
        "year": 1883,
        "characters": ["Tôn Thất Thuyết", "Vua Hàm Nghi"]
    },
    
    # 1889-1895 - Giai đoạn Cần Vương muộn (chi tiết hơn)
    "1890_dinh_cao_can_vuong": {
        "keywords": ["đỉnh cao cần vương", "rực lửa"],
        "year": 1890,
        "characters": ["Phan Đình Phùng", "Nguyễn Thiện Thuật", "Tống Duy Tân"]
    },
    
    "1891_binh_dinh_bac_trung_ky": {
        "keywords": ["bình định bắc-trung kỳ", "ba đình thất thủ"],
        "year": 1891,
        "characters": ["Tống Duy Tân", "Phạm Bành", "Phan Đình Phùng"]
    },
    
    "1892_phan_cong_ba_dinh": {
        "keywords": ["phản công ba đình", "tống duy tân hy sinh"],
        "year": 1892,
        "characters": ["Tống Duy Tân"]
    },
    
    "1893_huong_khe_cam_cu": {
        "keywords": ["hương khê cầm cự", "cao thắng hy sinh"],
        "year": 1893,
        "characters": ["Cao Thắng", "Phan Đình Phùng"]
    },
    
    "1894_chien_dich_vu_quang": {
        "keywords": ["chiến dịch vũ quang", "khốc liệt nhất"],
        "year": 1894,
        "characters": ["Phan Đình Phùng"]
    },
    
    "1895_phan_dinh_phung_hy_sinh": {
        "keywords": ["phan đình phùng hy sinh", "kết thúc cần vương"],
        "year": 1895,
        "characters": ["Phan Đình Phùng"]
    },
    
    # 1897-1903 - Kỷ nguyên thuộc địa (chi tiết)
    "1898_yen_the_bung_len": {
        "keywords": ["yên thế bùng lên", "con hùm yên thế"],
        "year": 1898,
        "characters": ["Hoàng Hoa Thám", "Phan Bội Châu"]
    },
    
    "1899_hai_nuoc_viet": {
        "keywords": ["hai nước việt", "cầu doumer"],
        "year": 1899,
        "characters": ["Paul Doumer", "Hoàng Hoa Thám", "Phan Bội Châu"]
    },
    
    "1900_chuyen_giao_the_ky": {
        "keywords": ["chuyển giao thế kỷ", "cầu long biên"],
        "year": 1900,
        "characters": ["Paul Doumer", "Hoàng Hoa Thám", "Phan Bội Châu"]
    },
    
    "1901_khoi_dau_the_ky_moi": {
        "keywords": ["khởi đầu thế kỷ mới", "hai ngọn lửa"],
        "year": 1901,
        "characters": ["Hoàng Hoa Thám", "Phan Bội Châu"]
    },
    
    "1902_chuyen_giao_am_tham": {
        "keywords": ["chuyển giao âm thầm", "hòa hoãn"],
        "year": 1902,
        "characters": ["Hoàng Hoa Thám", "Paul Beau"]
    },
    
    "1903_ngon_duoc_khai_sang": {
        "keywords": ["ngọn đuốc khai sáng", "vong quốc sử"],
        "year": 1903,
        "characters": ["Phan Bội Châu", "Phan Châu Trinh", "Hoàng Hoa Thám"]
    },
    
    # 1909-1915 - Giai đoạn chuyển tiếp
    "1909_duy_tan_dong_du_tan_ra": {
        "keywords": ["duy tân - đông du tan rã"],
        "year": 1909,
        "characters": ["Phan Bội Châu", "Huỳnh Thúc Kháng", "Ngô Đức Kế"]
    },
    
    "1910_lang_gio_hat_giong": {
        "keywords": ["lặng gió nhưng hạt giống", "chuyển giao thế hệ"],
        "year": 1910,
        "characters": ["Phan Bội Châu", "Nguyễn Tất Thành", "Trần Cao Vân"]
    },
    
    "1914_chien_tranh_the_gioi": {
        "keywords": ["chiến tranh thế giới", "người việt châu âu"],
        "year": 1914,
        "characters": ["Phan Bội Châu", "Nguyễn Tất Thành"]
    },
    
    "1915_im_lang_tich_tu": {
        "keywords": ["im lặng nhưng tích tụ", "thuế máu"],
        "year": 1915,
        "characters": ["Phan Bội Châu", "Nguyễn Tất Thành"]
    },
    
    # 1918-1923 - Giai đoạn quốc tế hóa
    "1918_chien_tranh_ket_thuc": {
        "keywords": ["chiến tranh kết thúc", "quyền dân tộc"],
        "year": 1918,
        "characters": ["Nguyễn Tất Thành", "Phan Bội Châu"]
    },
    
    "1921_hoi_lien_hiep": {
        "keywords": ["hội liên hiệp", "union intercoloniale"],
        "year": 1921,
        "characters": ["Nguyễn Ái Quốc"]
    },
    
    "1922_trien_lam_thuc_dia": {
        "keywords": ["triển lãm thuộc địa", "marseille"],
        "year": 1922,
        "characters": ["Nguyễn Ái Quốc"]
    },
    
    "1923_nguyen_ai_quoc_lien_xo": {
        "keywords": ["nguyễn ái quốc đến liên xô", "mác - lênin"],
        "year": 1923,
        "characters": ["Nguyễn Ái Quốc"]
    },
    
    # 1928-1929 - Chuẩn bị thành lập Đảng
    "1928_phong_trao_vo_san_hoa": {
        "keywords": ["phong trào vô sản hóa", "lý tưởng hành động"],
        "year": 1928,
        "characters": ["Nguyễn Ái Quốc", "Hội Việt Nam Cách mạng Thanh niên"]
    }
}

def main():
    print("🚀 Updating ALL remaining events with characters...")
    
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
    
    for mapping_key, mapping_data in all_remaining_events.items():
        keywords = mapping_data['keywords']
        year = mapping_data.get('year')
        character_names = mapping_data['characters']
        
        # Find the event
        event_id = find_event_by_keywords(events_data, keywords, year)
        
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
    
    # Also update any events that don't have relatedCharacters field yet
    events_without_characters = 0
    for event in events_data:
        if 'relatedCharacters' not in event or not event['relatedCharacters']:
            event['relatedCharacters'] = []
            events_without_characters += 1
    
    # Save updated events
    if save_json_file(events_file, events_data):
        print(f"\n🎉 Successfully updated ALL remaining events!")
        print(f"   📊 Updated events: {updated_events}")
        print(f"   👥 Total character assignments: {total_characters_added}")
        print(f"   🔧 Events initialized with empty characters: {events_without_characters}")
        print(f"   📁 Saved to: {events_file}")
        
        # Count total events with characters
        events_with_chars = sum(1 for event in events_data if event.get('relatedCharacters'))
        print(f"   📈 Total events with characters: {events_with_chars}/{len(events_data)}")
    else:
        print("❌ Failed to save events.json")

if __name__ == "__main__":
    main()
