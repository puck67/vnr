#!/usr/bin/env python3
"""
Complete update of events.json with ALL characters from the detailed classification
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

# COMPLETE Event-Character mapping based on user's detailed classification
complete_event_character_mapping = {
    # 1858 - Liên quân Pháp-Tây Ban Nha tấn công Đà Nẵng
    "1858_da_nang": {
        "year": 1858,
        "keywords": ["đà nẵng", "tấn công"],
        "characters": [
            "Charles Rigault de Genouilly", "François Page", "Léopold Pallu de la Barrière",
            "Giám mục Pellerin", "Linh mục Diaz", "Đại tá Lanzarote",
            "Tôn Thất Thuyết", "Nguyễn Tri Phương", "Lê Đình Lý", 
            "Phạm Văn Nghị", "Trần Hoằng", "Nguyễn Duy", "Phạm Thế Hiển"
        ]
    },
    
    # 1859 - Pháp chiếm Gia Định
    "1859_gia_dinh": {
        "year": 1859,
        "keywords": ["gia định", "chiếm"],
        "characters": [
            "Charles Rigault de Genouilly", "Đại tá De Vassoigne", "Bernard Jauréguiberry",
            "Nguyễn Tri Phương", "Lê Tấn Kế", "Nguyễn Công Trứ"
        ]
    },
    
    # 1860 - Quân Pháp rút khỏi Đà Nẵng
    "1860_rut_da_nang": {
        "year": 1860,
        "keywords": ["rút", "đà nẵng"],
        "characters": [
            "Charles Rigault de Genouilly", "François Page",
            "Nguyễn Tri Phương", "Lê Đình Lý"
        ]
    },
    
    # 1861 - Khởi nghĩa Nguyễn Trung Trực - Trận Kỳ Hòa
    "1861_nguyen_trung_truc": {
        "year": 1861,
        "keywords": ["nguyễn trung trực", "khởi nghĩa"],
        "characters": [
            "Nguyễn Trung Trực", "Võ Duy Dương", "Doãn Uẩn", "Trương Định",
            "Phan Tòng", "Lê Quang Quan"
        ]
    },
    
    "1861_ky_hoa": {
        "year": 1861,
        "keywords": ["kỳ hòa", "trận"],
        "characters": [
            "Bonard", "Đại tá De Vassoigne", "Bernard Jauréguiberry",
            "Nguyễn Tri Phương", "Trương Định"
        ]
    },
    
    # 1862 - Ký Hòa ước Nhâm Tuất (Sài Gòn)
    "1862_nham_tuat": {
        "year": 1862,
        "keywords": ["nhâm tuất", "hòa ước"],
        "characters": [
            "Phan Thanh Giản", "Lâm Duy Hiệp", "Trương Văn Uyển", "Phạm Thế Hiển",
            "Bonard", "De Lagrée"
        ]
    },
    
    # 1863 - Sứ bộ Đại Nam sang Paris và Pháp bảo hộ Campuchia
    "1863_su_bo_paris": {
        "year": 1863,
        "keywords": ["sứ bộ", "paris"],
        "characters": [
            "Phan Thanh Giản", "Phạm Phú Thứ", "Ngụy Khắc Đản", "De Lagrée"
        ]
    },
    
    "1863_bao_ho_campuchia": {
        "year": 1863,
        "keywords": ["campuchia", "bảo hộ"],
        "characters": [
            "Norodom", "De Lagrée"
        ]
    },
    
    # 1864 - Trương Định tuẫn tiết
    "1864_truong_dinh": {
        "year": 1864,
        "keywords": ["trương định", "tuẫn tiết"],
        "characters": [
            "Trương Định", "Lê Văn Phú", "Nguyễn Công Nguyên"
        ]
    },
    
    # 1865 - Kháng chiến miền Tây
    "1865_khang_chien_mien_tay": {
        "year": 1865,
        "keywords": ["kháng chiến", "miền tây"],
        "characters": [
            "Nguyễn Trung Trực", "Võ Duy Dương", "Trương Văn Uyển", "Nguyễn Hữu Huân"
        ]
    },
    
    # 1866 - Chuẩn bị chống Pháp
    "1866_chuan_bi": {
        "year": 1866,
        "keywords": ["chuẩn bị", "nghĩa quân"],
        "characters": [
            "Võ Duy Dương", "Nguyễn Trung Trực", "Trần Văn Thành"
        ]
    },
    
    # 1867 - Khởi nghĩa Bãi Sậy
    "1867_bai_say": {
        "year": 1867,
        "keywords": ["bãi sậy", "khởi nghĩa"],
        "characters": [
            "Nguyễn Thiện Thuật", "Nguyễn Văn Nho", "Đốc Tít"
        ]
    },
    
    # 1867 - Pháp chiếm 3 tỉnh miền Tây Nam Kỳ
    "1867_3_tinh_mien_tay": {
        "year": 1867,
        "keywords": ["3 tỉnh", "miền tây"],
        "characters": [
            "Phan Thanh Giản", "Bonard", "De Lagrée"
        ]
    },
    
    # 1868 - Nguyễn Trung Trực đốt tàu Espérance
    "1868_dot_tau_esperance": {
        "year": 1868,
        "keywords": ["espérance", "đốt tàu"],
        "characters": [
            "Nguyễn Trung Trực", "Lãnh binh Tấn"
        ]
    },
    
    # 1869-1872 - Nghĩa quân Bảy Thưa
    "1869_bay_thua": {
        "year": 1869,
        "keywords": ["bảy thưa", "nghĩa quân"],
        "characters": [
            "Trần Văn Thành", "Nguyễn Thành Long", "Nguyễn Văn Lợi", "Võ Văn Đề"
        ]
    },
    
    "1870_bay_thua": {
        "year": 1870,
        "keywords": ["bảy thưa", "khởi nghĩa"],
        "characters": [
            "Trần Văn Thành", "Nguyễn Thành Long", "Nguyễn Văn Lợi", "Võ Văn Đề"
        ]
    },
    
    "1871_bay_thua": {
        "year": 1871,
        "keywords": ["bảy thưa", "nghĩa quân"],
        "characters": [
            "Trần Văn Thành", "Nguyễn Thành Long", "Nguyễn Văn Lợi", "Võ Văn Đề"
        ]
    },
    
    "1872_bay_thua": {
        "year": 1872,
        "keywords": ["bảy thưa", "nghĩa quân"],
        "characters": [
            "Trần Văn Thành", "Nguyễn Thành Long", "Nguyễn Văn Lợi", "Võ Văn Đề"
        ]
    },
    
    # 1873 - Pháp chiếm Hà Nội lần thứ nhất
    "1873_ha_noi": {
        "year": 1873,
        "keywords": ["hà nội", "chiếm"],
        "characters": [
            "Francis Garnier", "Jean Dupuis", "Nguyễn Tri Phương", "Hoàng Diệu", "Lưu Vĩnh Phúc"
        ]
    },
    
    # 1873 - Trận chiến cuối cùng - Trần Văn Thành tuẫn tiết
    "1873_tran_van_thanh": {
        "year": 1873,
        "keywords": ["trần văn thành", "tuẫn tiết"],
        "characters": [
            "Trần Văn Thành"
        ]
    },
    
    # 1874 - Ký Hòa ước Giáp Tuất
    "1874_giap_tuat": {
        "year": 1874,
        "keywords": ["giáp tuất", "hòa ước"],
        "characters": [
            "Philastre", "Nguyễn Văn Tường", "Trần Tiễn Thành", "Hoàng Kế Viêm"
        ]
    },
    
    # 1884 - Khởi nghĩa Yên Thế
    "1884_yen_the": {
        "year": 1884,
        "keywords": ["yên thế", "khởi nghĩa"],
        "characters": [
            "Hoàng Hoa Thám", "Lương Văn Nắm", "Trương Văn Ý", "Cả Rinh"
        ]
    },
    
    # 1884 - Ký Hiệp ước Patenôtre
    "1884_patenotre": {
        "year": 1884,
        "keywords": ["patenôtre", "hiệp ước"],
        "characters": [
            "Patenôtre", "Nguyễn Hữu Độ", "Tôn Thất Thuyết"
        ]
    },
    
    # 1885 - Khởi nghĩa Cần Vương
    "1885_can_vuong": {
        "year": 1885,
        "keywords": ["cần vương", "khởi nghĩa"],
        "characters": [
            "Tôn Thất Thuyết", "Vua Hàm Nghi", "Phan Đình Phùng", "Cao Thắng", "Lê Ninh", "Đinh Văn Chất"
        ]
    },
    
    # 1885 - Khởi nghĩa Hương Khê
    "1885_huong_khe": {
        "year": 1885,
        "keywords": ["hương khê", "khởi nghĩa"],
        "characters": [
            "Phan Đình Phùng", "Cao Thắng", "Lê Ninh"
        ]
    },
    
    # 1886 - Khởi nghĩa Ba Đình
    "1886_ba_dinh": {
        "year": 1886,
        "keywords": ["ba đình", "khởi nghĩa"],
        "characters": [
            "Đinh Công Tráng", "Phạm Bành", "Trần Xuân Soạn", "Hà Văn Mao"
        ]
    },
    
    # 1887 - Thành lập Liên bang Đông Dương
    "1887_lien_bang_dong_duong": {
        "year": 1887,
        "keywords": ["liên bang", "đông dương"],
        "characters": [
            "Paul Bert", "Jean Constans", "De Lanessan"
        ]
    },
    
    # 1888 - Vua Hàm Nghi bị bắt
    "1888_ham_nghi_bi_bat": {
        "year": 1888,
        "keywords": ["hàm nghi", "bị bắt"],
        "characters": [
            "Vua Hàm Nghi", "Trương Quang Ngọc", "Tôn Thất Đàm"
        ]
    }
}

def main():
    print("🚀 Complete update of events.json with ALL characters...")
    
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
    
    for mapping_key, mapping_data in complete_event_character_mapping.items():
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
                    new_char_list = []
                    
                    # Add characters from mapping
                    for char_name in character_names:
                        char_id = find_character_id_by_name(characters_data, char_name)
                        if char_id:
                            if char_id not in new_char_list:
                                new_char_list.append(char_id)
                                total_characters_added += 1
                        else:
                            print(f"⚠️  Character '{char_name}' not found for {mapping_key}")
                    
                    # Keep existing characters if they're in our approved list
                    for existing_char_id in existing_chars:
                        # Find character name by ID
                        char_name = None
                        for char in characters_data:
                            if char['id'] == existing_char_id:
                                char_name = char['name']
                                break
                        
                        if char_name and char_name in character_names:
                            if existing_char_id not in new_char_list:
                                new_char_list.append(existing_char_id)
                    
                    # Update event
                    event['relatedCharacters'] = new_char_list
                    updated_events += 1
                    
                    print(f"✅ Updated {event_id}: {event.get('name', 'Unknown')} ({year}) - {len(new_char_list)} characters")
                    break
        else:
            print(f"⚠️  Event not found for {mapping_key} ({year}) with keywords: {keywords}")
    
    # Save updated events
    if save_json_file(events_file, events_data):
        print(f"\n🎉 Successfully updated events!")
        print(f"   📊 Updated events: {updated_events}")
        print(f"   👥 Total character assignments: {total_characters_added}")
        print(f"   📁 Saved to: {events_file}")
    else:
        print("❌ Failed to save events.json")

if __name__ == "__main__":
    main()
