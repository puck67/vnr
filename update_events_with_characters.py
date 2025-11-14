#!/usr/bin/env python3
"""
Update events.json with characters based on the detailed classification provided
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

# Event-Character mapping based on user's detailed classification
event_character_mapping = {
    # 1858 - Liên quân Pháp-Tây Ban Nha tấn công Đà Nẵng
    "event-001": {
        "french_spanish": [
            "Charles Rigault de Genouilly",
            "François Page", 
            "Léopold Pallu de la Barrière",
            "Giám mục Pellerin",
            "Linh mục Diaz",
            "Đại tá Lanzarote"
        ],
        "vietnamese": [
            "Tôn Thất Thuyết",
            "Nguyễn Tri Phương", 
            "Lê Đình Lý",
            "Phạm Văn Nghị",
            "Trần Hoằng",
            "Nguyễn Duy",
            "Phạm Thế Hiển"
        ]
    },
    
    # 1859 - Pháp chiếm Gia Định  
    "event-002": {
        "french": [
            "Charles Rigault de Genouilly",
            "Đại tá De Vassoigne",
            "Bernard Jauréguiberry"
        ],
        "vietnamese": [
            "Nguyễn Tri Phương",
            "Lê Tấn Kế", 
            "Nguyễn Công Trứ"
        ]
    },
    
    # 1860 - Quân Pháp rút khỏi Đà Nẵng
    "event-035": {
        "french": [
            "Charles Rigault de Genouilly",
            "François Page"
        ],
        "vietnamese": [
            "Nguyễn Tri Phương",
            "Lê Đình Lý"
        ]
    },
    
    # 1861 - Khởi nghĩa Nguyễn Trung Trực - Trận Kỳ Hòa
    "event-003": {
        "vietnamese": [
            "Nguyễn Trung Trực",
            "Võ Duy Dương", 
            "Doãn Uẩn",
            "Trương Định",
            "Phan Tòng",
            "Lê Quang Quan"
        ],
        "french": [
            "Bonard",
            "Đại tá De Vassoigne", 
            "Bernard Jauréguiberry"
        ]
    },
    
    # 1862 - Ký Hòa ước Nhâm Tuất (Sài Gòn)
    "event-016": {
        "vietnamese": [
            "Phan Thanh Giản",
            "Lâm Duy Hiệp",
            "Trương Văn Uyển", 
            "Phạm Thế Hiển"
        ],
        "french": [
            "Bonard",
            "De Lagrée"
        ]
    },
    
    # 1863 - Sứ bộ Đại Nam sang Paris và Pháp bảo hộ Campuchia
    "event-043": {
        "vietnamese": [
            "Phan Thanh Giản",
            "Phạm Phú Thứ",
            "Ngụy Khắc Đản"
        ],
        "french": [
            "De Lagrée"
        ],
        "cambodian": [
            "Norodom"
        ]
    },
    
    # 1864 - Trương Định tuẫn tiết tại Gò Công
    "event-045": {
        "vietnamese": [
            "Trương Định",
            "Lê Văn Phú",
            "Nguyễn Công Nguyên"
        ]
    },
    
    # 1865 - Phong trào kháng chiến miền Tây
    "event-046": {
        "vietnamese": [
            "Nguyễn Trung Trực",
            "Võ Duy Dương",
            "Trương Văn Uyển",
            "Nguyễn Hữu Huân"
        ]
    },
    
    # 1866 - Năm chuẩn bị: Nghĩa quân miền Tây
    "event-047": {
        "vietnamese": [
            "Võ Duy Dương",
            "Nguyễn Trung Trực", 
            "Trần Văn Thành"
        ]
    },
    
    # 1867 - Khởi nghĩa Bãi Sậy
    "event-004": {
        "vietnamese": [
            "Nguyễn Thiện Thuật",
            "Nguyễn Văn Nho",
            "Đốc Tít"
        ]
    },
    
    # 1867 - Pháp chiếm 3 tỉnh miền Tây Nam Kỳ
    "event-044": {
        "vietnamese": [
            "Phan Thanh Giản"
        ],
        "french": [
            "Bonard",
            "De Lagrée"
        ]
    },
    
    # 1868 - Nguyễn Trung Trực đốt tàu Espérance tại Nhựt Tảo
    "event-048": {
        "vietnamese": [
            "Nguyễn Trung Trực",
            "Lãnh binh Tấn"
        ]
    },
    
    # 1869-1872 - Nghĩa quân Bảy Thưa (Trần Văn Thành)
    "event-049": {
        "vietnamese": [
            "Trần Văn Thành",
            "Nguyễn Thành Long",
            "Nguyễn Văn Lợi", 
            "Võ Văn Đề"
        ]
    },
    "event-050": {
        "vietnamese": [
            "Trần Văn Thành",
            "Nguyễn Thành Long",
            "Nguyễn Văn Lợi",
            "Võ Văn Đề"
        ]
    },
    "event-051": {
        "vietnamese": [
            "Trần Văn Thành",
            "Nguyễn Thành Long", 
            "Nguyễn Văn Lợi",
            "Võ Văn Đề"
        ]
    },
    "event-052": {
        "vietnamese": [
            "Trần Văn Thành",
            "Nguyễn Thành Long",
            "Nguyễn Văn Lợi",
            "Võ Văn Đề"
        ]
    },
    "event-053": {
        "vietnamese": [
            "Trần Văn Thành",
            "Nguyễn Thành Long",
            "Nguyễn Văn Lợi", 
            "Võ Văn Đề"
        ]
    },
    
    # 1873 - Pháp chiếm Hà Nội lần thứ nhất
    "event-005": {
        "french": [
            "Francis Garnier",
            "Jean Dupuis"
        ],
        "vietnamese": [
            "Nguyễn Tri Phương",
            "Hoàng Diệu"
        ],
        "chinese": [
            "Lưu Vĩnh Phúc"
        ]
    },
    
    # 1873 - Trận chiến cuối cùng - Trần Văn Thành tuẫn tiết
    "event-017": {
        "vietnamese": [
            "Trần Văn Thành"
        ]
    },
    
    # 1874 - Ký Hòa ước Giáp Tuất
    "event-006": {
        "french": [
            "Philastre"
        ],
        "vietnamese": [
            "Nguyễn Văn Tường",
            "Trần Tiễn Thành", 
            "Hoàng Kế Viêm"
        ]
    }
}

def main():
    print("🚀 Updating events.json with characters based on detailed classification...")
    
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
    
    for event in events_data:
        event_id = event.get('id')
        
        if event_id in event_character_mapping:
            # Get existing related characters (keep them if they're in our list)
            existing_chars = event.get('relatedCharacters', [])
            new_char_list = []
            
            # Add characters from mapping
            char_groups = event_character_mapping[event_id]
            all_chars_for_event = []
            
            # Collect all characters for this event
            for group_name, char_names in char_groups.items():
                all_chars_for_event.extend(char_names)
            
            # Find character IDs and add them
            for char_name in all_chars_for_event:
                char_id = find_character_id_by_name(characters_data, char_name)
                if char_id:
                    if char_id not in new_char_list:
                        new_char_list.append(char_id)
                        total_characters_added += 1
                else:
                    print(f"⚠️  Character '{char_name}' not found for event {event_id}")
            
            # Keep existing characters if they're in our approved list
            for existing_char_id in existing_chars:
                # Find character name by ID
                char_name = None
                for char in characters_data:
                    if char['id'] == existing_char_id:
                        char_name = char['name']
                        break
                
                if char_name and char_name in all_chars_for_event:
                    if existing_char_id not in new_char_list:
                        new_char_list.append(existing_char_id)
            
            # Update event
            event['relatedCharacters'] = new_char_list
            updated_events += 1
            
            print(f"✅ Updated {event_id}: {event.get('name', 'Unknown')} - {len(new_char_list)} characters")
    
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
