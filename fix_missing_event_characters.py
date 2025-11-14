#!/usr/bin/env python3
"""
Fix missing characters in events to match 100% with user's detailed list
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
    """Find character ID by name with variations"""
    # Direct match first
    for char in characters_data:
        if char['name'] == name:
            return char['id']
    
    # Try variations
    name_variations = {
        "Rigault de Genouilly": "Charles Rigault de Genouilly",
        "Page": "François Page",
        "De Vassoigne": "Đại tá De Vassoigne", 
        "Jauréguiberry": "Bernard Jauréguiberry",
        "Võ Duy Dương": "Võ Duy Dương (Thiên hộ Dương)",
        "Nguyễn Thiện Thuật": "Nguyễn Thiện Thuật",
        "Hoàng Diệu": "Hoàng Diệu",
        "Nguyễn Văn Tường": "Nguyễn Văn Tường"
    }
    
    if name in name_variations:
        for char in characters_data:
            if char['name'] == name_variations[name]:
                return char['id']
    
    return None

def find_event_by_id(events_data, event_id):
    """Find event by ID"""
    for event in events_data:
        if event.get('id') == event_id:
            return event
    return None

# Missing character assignments that need to be fixed
missing_assignments = {
    "event-001": [
        "Charles Rigault de Genouilly", "Trần Hoằng", "Nguyễn Duy", "Phạm Thế Hiển"
    ],
    "event-002": [
        "Charles Rigault de Genouilly"  # Use full name
    ],
    "event-034": [
        "Charles Rigault de Genouilly", "François Page"
    ],
    "event-003": [
        "Võ Duy Dương"
    ],
    "event-043": [
        "Đại tá De Vassoigne", "Bernard Jauréguiberry"
    ],
    "event-016": [
        "Phan Thanh Giản", "Phạm Thế Hiển"
    ],
    "event-044": [
        "Phan Thanh Giản", "Phạm Phú Thứ", "Ngụy Khắc Đản"
    ],
    "event-046": [
        "Võ Duy Dương"
    ],
    "event-047": [
        "Võ Duy Dương"
    ],
    "event-004": [
        "Nguyễn Thiện Thuật"
    ],
    "event-017": [
        "Phan Thanh Giản"
    ],
    "event-005": [
        "Hoàng Diệu"
    ],
    "event-018": [
        "Nguyễn Văn Tường"
    ]
}

def main():
    print("🔧 Fixing missing characters in events...")
    
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
    
    # Fix missing assignments
    fixed_events = 0
    total_assignments_added = 0
    
    for event_id, missing_chars in missing_assignments.items():
        event = find_event_by_id(events_data, event_id)
        
        if event:
            current_chars = event.get('relatedCharacters', [])
            added_chars = []
            
            for char_name in missing_chars:
                char_id = find_character_id_by_name(characters_data, char_name)
                
                if char_id:
                    if char_id not in current_chars:
                        current_chars.append(char_id)
                        added_chars.append(char_name)
                        total_assignments_added += 1
                else:
                    print(f"⚠️  Character '{char_name}' not found for {event_id}")
            
            if added_chars:
                event['relatedCharacters'] = current_chars
                fixed_events += 1
                print(f"✅ Fixed {event_id}: {event.get('name', 'Unknown')}")
                print(f"   Added: {', '.join(added_chars)}")
                print(f"   Total characters: {len(current_chars)}")
        else:
            print(f"⚠️  Event {event_id} not found")
    
    # Save updated events
    if save_json_file(events_file, events_data):
        print(f"\n🎉 Successfully fixed missing character assignments!")
        print(f"   🔧 Fixed events: {fixed_events}")
        print(f"   ➕ Total assignments added: {total_assignments_added}")
        print(f"   📁 Saved to: {events_file}")
        
        # Verify fix
        print(f"\n🔍 Verification:")
        for event_id in missing_assignments.keys():
            event = find_event_by_id(events_data, event_id)
            if event:
                char_count = len(event.get('relatedCharacters', []))
                print(f"   {event_id}: {char_count} characters")
    else:
        print("❌ Failed to save events.json")

if __name__ == "__main__":
    main()
