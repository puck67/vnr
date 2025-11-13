#!/usr/bin/env python3
"""
Remove characters that are NOT in the user's detailed list
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

# COMPLETE list of characters that should be KEPT (from user's detailed list)
approved_characters = [
    # 1858 – Liên quân Pháp – Tây Ban Nha tấn công Đà Nẵng
    "Charles Rigault de Genouilly", "François Page", "Léopold Pallu de la Barrière",
    "Giám mục Pellerin", "Linh mục Diaz", "Đại tá Lanzarote",
    "Tôn Thất Thuyết", "Nguyễn Tri Phương", "Lê Đình Lý",
    "Phạm Văn Nghị", "Trần Hoằng", "Nguyễn Duy", "Phạm Thế Hiển",
    
    # 1859 – Pháp chiếm Gia Định
    "Đại tá De Vassoigne", "Bernard Jauréguiberry", "Lê Tấn Kế", "Nguyễn Công Trứ",
    
    # 1860 – Quân Pháp rút khỏi Đà Nẵng
    # (Same characters as above)
    
    # 1861 – Khởi nghĩa Nguyễn Trung Trực – Trận Kỳ Hòa – Pháp chiếm Nam Kỳ
    "Nguyễn Trung Trực", "Võ Duy Dương", "Doãn Uẩn", "Trương Định",
    "Phan Tòng", "Lê Quang Quan", "Bonard",
    
    # 1862 – Hòa ước Nhâm Tuất
    "Phan Thanh Giản", "Lâm Duy Hiệp", "Trương Văn Uyển", "De Lagrée",
    
    # 1863 – Sứ bộ Đại Nam sang Paris và Pháp bảo hộ Campuchia
    "Phạm Phú Thứ", "Ngụy Khắc Đản", "Norodom",
    
    # 1864 – Trương Định tuẫn tiết
    "Lê Văn Phú", "Nguyễn Công Nguyên",
    
    # 1865 – Kháng chiến miền Tây
    "Nguyễn Hữu Huân",
    
    # 1866 – Chuẩn bị chống Pháp
    "Trần Văn Thành",
    
    # 1867 – Khởi nghĩa Bãi Sậy – Pháp chiếm 3 tỉnh miền Tây
    "Nguyễn Thiện Thuật", "Nguyễn Văn Nho", "Đốc Tít",
    
    # 1868 – Nguyễn Trung Trực đốt tàu Espérance
    "Lãnh binh Tấn",
    
    # 1869–1872 – Nghĩa quân Bảy Thưa (Trần Văn Thành)
    "Nguyễn Thành Long", "Nguyễn Văn Lợi", "Võ Văn Đề",
    
    # 1873 – Pháp chiếm Hà Nội lần thứ nhất
    "Francis Garnier", "Jean Dupuis", "Hoàng Diệu", "Lưu Vĩnh Phúc",
    
    # 1874 – Ký Hòa ước Giáp Tuất
    "Philastre", "Nguyễn Văn Tường", "Trần Tiễn Thành", "Hoàng Kế Viêm",
    
    # 1884 – Khởi nghĩa Yên Thế – Hiệp ước Patenôtre
    "Hoàng Hoa Thám", "Lương Văn Nắm", "Trương Văn Ý", "Cả Rinh",
    "Patenôtre", "Nguyễn Hữu Độ",
    
    # 1885 – Cần Vương – Hương Khê
    "Vua Hàm Nghi", "Phan Đình Phùng", "Cao Thắng", "Lê Ninh", "Đinh Văn Chất",
    
    # 1886 – Khởi nghĩa Ba Đình
    "Đinh Công Tráng", "Phạm Bành", "Trần Xuân Soạn", "Hà Văn Mao",
    
    # 1887 – Liên bang Đông Dương
    "Paul Bert", "Jean Constans", "De Lanessan",
    
    # 1888 – Vua Hàm Nghi bị bắt
    "Trương Quang Ngọc", "Tôn Thất Đàm",
    
    # 1889–1895 – Giai đoạn Cần Vương muộn
    "Trần Tấn", "Tống Duy Tân",
    
    # 1896 – Phan Đình Phùng hy sinh
    # (Same as above)
    
    # 1897–1903 – Kỷ nguyên thuộc địa – Duy Tân
    "Paul Doumer", "Trần Quý Cáp", "Phan Châu Trinh", "Huỳnh Thúc Kháng", "Lê Khiết",
    
    # 1904 – Thành lập Duy Tân Hội
    "Phan Bội Châu", "Cường Để", "Tăng Bạt Hổ", "Nguyễn Thành",
    
    # 1905 – Phong trào Đông Du
    "Hồ Tùng Mậu", "Lê Văn Hòe", "Nguyễn Thượng Hiền",
    
    # 1907 – Duy Tân – Đông Kinh Nghĩa Thục
    "Lương Văn Can", "Nguyễn Quyền", "Dương Bá Trạc", "Lê Đại", "Phạm Tư",
    
    # 1908 – Phong trào chống thuế Trung Kỳ
    "Trần Cao Vân", "Thái Phiên",
    
    # 1911 – Nguyễn Tất Thành ra đi
    "Nguyễn Ái Quốc", "Tướng Latouche-Tréville", "Phan Xích Long",
    
    # 1912 – Việt Nam Quang Phục Hội
    "Nguyễn Hải Thần", "Lê Kỳ",
    
    # 1913 – Hoàng Hoa Thám hy sinh
    "Sancy", "Charles A.",
    
    # 1916 – Khởi nghĩa Duy Tân
    "Vua Duy Tân",
    
    # 1917 – Khởi nghĩa Thái Nguyên
    "Đội Cấn", "Lương Ngọc Quyến", "Trịnh Văn Cẩn", "Chánh tổng Đội Giá",
    
    # 1919 – Yêu sách của Nguyễn Ái Quốc
    "Marcel Cachin",
    
    # 1920 – Nguyễn Ái Quốc vào Đảng Cộng sản Pháp
    "Paul Vaillant-Couturier", "Boris Souvarine",
    
    # 1924 – Phạm Hồng Thái ám sát Merlin
    "Phạm Hồng Thái", "Martial Henri Merlin", "Lê Hồng Sơn", "Lâm Đức Thụ",
    
    # 1925 – Hội Việt Nam Cách mạng Thanh niên – Bắt Phan Bội Châu
    "Tôn Quang Phiệt", "Châu Văn Liêm",
    
    # 1926 – Tang Phan Châu Trinh
    "Phan Chu Trinh", "Phạm Quỳnh",
    
    # 1927 – Thành lập Việt Nam Quốc dân Đảng
    "Nguyễn Thái Học", "Phó Đức Chính", "Nguyễn Khắc Nhu",
    "Nguyễn Văn Viên", "Nguyễn Văn Sâm", "Đặng Thái Thuyến",
    
    # 1929 – Ba tổ chức cộng sản ra đời
    "Trần Văn Cung", "Nguyễn Đức Cảnh", "Ngô Gia Tự",
    "Tôn Đức Thắng", "Nguyễn Thiệu",
    
    # 1930 – Thành lập Đảng Cộng sản Việt Nam – Xô viết Nghệ Tĩnh – Yên Bái – Phú Riềng Đỏ
    "Trịnh Đình Cửu", "Trần Phú", "Lê Hồng Phong", "Hà Huy Tập",
    "Nguyễn Phong Sắc", "Phan Đăng Lưu", "Lê Duẩn", "Trần Tử Bình", "Nguyễn Văn Cừ"
]

def main():
    print("🗑️  Removing characters NOT in user's approved list...")
    
    # File paths
    base_path = r'c:\Users\Adminn\Desktop\prm\vnr'
    characters_file = os.path.join(base_path, 'data', 'characters.json')
    events_file = os.path.join(base_path, 'data', 'events.json')
    removed_file = os.path.join(base_path, 'data', 'removed_unlisted_characters.json')
    
    # Load data
    characters_data = load_json_file(characters_file)
    events_data = load_json_file(events_file)
    
    if not characters_data or not events_data:
        print("❌ Failed to load data files")
        return
    
    print(f"📊 Current characters: {len(characters_data)}")
    print(f"📋 Approved characters: {len(approved_characters)}")
    
    # Separate characters into keep and remove
    characters_to_keep = []
    characters_to_remove = []
    removed_char_ids = []
    
    for char in characters_data:
        char_name = char.get('name', '')
        if char_name in approved_characters:
            characters_to_keep.append(char)
            print(f"✅ Keeping: {char_name}")
        else:
            characters_to_remove.append(char)
            removed_char_ids.append(char.get('id'))
            print(f"❌ Removing: {char_name}")
    
    # Update events to remove references to deleted characters
    events_updated = 0
    total_references_removed = 0
    
    for event in events_data:
        related_chars = event.get('relatedCharacters', [])
        original_count = len(related_chars)
        
        # Remove references to deleted characters
        updated_chars = [char_id for char_id in related_chars if char_id not in removed_char_ids]
        
        if len(updated_chars) != original_count:
            event['relatedCharacters'] = updated_chars
            events_updated += 1
            removed_count = original_count - len(updated_chars)
            total_references_removed += removed_count
            print(f"🔧 Updated {event.get('id')}: Removed {removed_count} character references")
    
    # Save removed characters for backup
    if save_json_file(removed_file, characters_to_remove):
        print(f"💾 Saved {len(characters_to_remove)} removed characters to backup")
    
    # Save updated characters
    if save_json_file(characters_file, characters_to_keep):
        print(f"✅ Updated characters.json")
    else:
        print("❌ Failed to save characters.json")
        return
    
    # Save updated events
    if save_json_file(events_file, events_data):
        print(f"✅ Updated events.json")
    else:
        print("❌ Failed to save events.json")
        return
    
    # Summary
    print(f"\n📋 CLEANUP SUMMARY:")
    print(f"   ✅ Characters kept: {len(characters_to_keep)}")
    print(f"   ❌ Characters removed: {len(characters_to_remove)}")
    print(f"   🔧 Events updated: {events_updated}")
    print(f"   🗑️  Character references removed: {total_references_removed}")
    print(f"   💾 Backup saved to: {removed_file}")
    
    if len(characters_to_keep) == len(approved_characters):
        print(f"   🏆 Status: PERFECT - Dataset now contains ONLY approved characters!")
    else:
        missing_count = len(approved_characters) - len(characters_to_keep)
        print(f"   ⚠️  Status: {missing_count} approved characters still missing from dataset")

if __name__ == "__main__":
    main()
